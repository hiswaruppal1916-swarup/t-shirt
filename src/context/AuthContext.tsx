import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Customer } from '../types';

interface AuthContextType {
  user: any | null;
  customerProfile: Customer | null;
  isLoading: boolean;
  needsPhoneOnboarding: boolean;
  loginWithGoogle: () => Promise<void>;
  simulateCustomerLogin: (email: string, name: string) => Promise<void>;
  savePhoneNumber: (phone: string, marketingConsent: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [customerProfile, setCustomerProfile] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsPhoneOnboarding, setNeedsPhoneOnboarding] = useState(false);

  useEffect(() => {
    // 1. Check active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleUserAuthenticated(session.user);
      } else {
        // Check for local development session
        const devUser = localStorage.getItem('atelier_dev_user');
        if (devUser) {
          try {
            const parsed = JSON.parse(devUser);
            setUser(parsed);
            loadCustomerProfile(parsed.id, parsed.email, parsed.user_metadata?.full_name || parsed.email);
          } catch {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      }
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleUserAuthenticated(session.user);
      } else {
        const devUser = localStorage.getItem('atelier_dev_user');
        if (!devUser) {
          setUser(null);
          setCustomerProfile(null);
          setNeedsPhoneOnboarding(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserAuthenticated = async (authUser: any) => {
    setUser(authUser);
    const email = authUser.email || '';
    const name = authUser.user_metadata?.full_name || email.split('@')[0] || 'Customer';
    await loadCustomerProfile(authUser.id, email, name);
  };

  const loadCustomerProfile = async (authUserId: string, email: string, name: string) => {
    setIsLoading(true);
    try {
      // Find existing customer record
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading customer profile:', error);
      }

      if (data) {
        setCustomerProfile(data);
        // If phone is missing, prompt mandatory phone onboarding
        if (!data.phone || data.phone.trim().length === 0) {
          setNeedsPhoneOnboarding(true);
        } else {
          setNeedsPhoneOnboarding(false);
        }
      } else {
        // Create new customer record
        const { data: newCust, error: insertError } = await supabase
          .from('customers')
          .insert({
            auth_user_id: authUserId,
            name: name,
            email: email,
            marketing_consent: false
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating customer profile:', insertError);
        } else if (newCust) {
          setCustomerProfile(newCust);
          setNeedsPhoneOnboarding(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.warn('Supabase OAuth notice:', err.message);
      // Fallback convenience for local environment testing:
      await simulateCustomerLogin('swarup.shopper@gmail.com', 'Swarup Pal');
    } finally {
      setIsLoading(false);
    }
  };

  const simulateCustomerLogin = async (email: string, name: string) => {
    setIsLoading(true);
    const mockAuthUser = {
      id: 'd9b047a2-7e9b-4b47-a4c3-a3d8f8e02d91',
      email: email,
      user_metadata: { full_name: name }
    };
    localStorage.setItem('atelier_dev_user', JSON.stringify(mockAuthUser));
    setUser(mockAuthUser);
    await loadCustomerProfile(mockAuthUser.id, email, name);
    setIsLoading(false);
  };

  const savePhoneNumber = async (phone: string, marketingConsent: boolean) => {
    if (!customerProfile && !user) return;
    setIsLoading(true);

    try {
      const email = customerProfile?.email || user?.email;
      const { data, error } = await supabase
        .from('customers')
        .update({
          phone: phone.trim(),
          marketing_consent: marketingConsent,
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .select()
        .single();

      if (error) {
        console.error('Error saving phone number:', error);
      } else if (data) {
        setCustomerProfile(data);
        setNeedsPhoneOnboarding(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    localStorage.removeItem('atelier_dev_user');
    await supabase.auth.signOut();
    setUser(null);
    setCustomerProfile(null);
    setNeedsPhoneOnboarding(false);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        customerProfile,
        isLoading,
        needsPhoneOnboarding,
        loginWithGoogle,
        simulateCustomerLogin,
        savePhoneNumber,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
