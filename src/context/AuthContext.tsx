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
  dismissPhoneOnboarding: () => void;
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
        // Check for cached profile / dev session
        const cachedProfile = localStorage.getItem('atelier_customer_profile');
        const devUser = localStorage.getItem('atelier_dev_user');
        if (cachedProfile) {
          try {
            const parsed = JSON.parse(cachedProfile);
            setCustomerProfile(parsed);
          } catch {
            // Ignore parse error
          }
        }
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
      const cachedPhone = localStorage.getItem('atelier_customer_phone_' + email);

      // Query existing customer records for this email without using maybeSingle() which throws on duplicates
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Customer profile DB query note:', error.message);
      }

      if (data && data.length > 0) {
        const primaryCustomer = data[0];
        const effectivePhone = primaryCustomer.phone || cachedPhone || '';

        const profile: Customer = {
          ...primaryCustomer,
          phone: effectivePhone
        };

        setCustomerProfile(profile);
        localStorage.setItem('atelier_customer_profile', JSON.stringify(profile));
        if (effectivePhone) {
          localStorage.setItem('atelier_customer_phone_' + email, effectivePhone);
        }

        // If phone has at least 10 digits, onboarding is completed
        const cleanDigits = effectivePhone.replace(/\D/g, '');
        if (cleanDigits.length >= 10) {
          setNeedsPhoneOnboarding(false);
        } else {
          setNeedsPhoneOnboarding(true);
        }
      } else {
        // Create new customer record
        try {
          const { data: inserted, error: insertError } = await supabase
            .from('customers')
            .insert({
              auth_user_id: authUserId,
              name: name,
              email: email,
              phone: cachedPhone || null,
              marketing_consent: false
            })
            .select();

          if (inserted && inserted.length > 0) {
            const profile = inserted[0];
            setCustomerProfile(profile);
            localStorage.setItem('atelier_customer_profile', JSON.stringify(profile));
            const cleanDigits = (profile.phone || '').replace(/\D/g, '');
            setNeedsPhoneOnboarding(cleanDigits.length < 10);
          } else {
            throw insertError || new Error('Insert returned no rows');
          }
        } catch (insertErr) {
          console.warn('Customer DB insert fallback:', insertErr);
          // Resilient local profile fallback so user is never blocked
          const fallbackProfile: Customer = {
            id: crypto.randomUUID(),
            auth_user_id: authUserId,
            name: name,
            email: email,
            phone: cachedPhone || undefined,
            marketing_consent: false,
            created_at: new Date().toISOString()
          };
          setCustomerProfile(fallbackProfile);
          localStorage.setItem('atelier_customer_profile', JSON.stringify(fallbackProfile));
          const cleanDigits = (cachedPhone || '').replace(/\D/g, '');
          setNeedsPhoneOnboarding(cleanDigits.length < 10);
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
    const cleaned = phone.trim().replace(/\D/g, '');
    if (cleaned.length < 10) {
      throw new Error('Please enter a valid 10-digit mobile phone number.');
    }

    const email = customerProfile?.email || user?.email;
    if (!email) {
      throw new Error('No active user email session found.');
    }

    setIsLoading(true);

    try {
      // 1. Immediately update local state & localStorage so the UI is responsive & never blocked
      const updatedProfile: Customer = {
        id: customerProfile?.id || crypto.randomUUID(),
        auth_user_id: user?.id,
        name: customerProfile?.name || user?.user_metadata?.full_name || email.split('@')[0],
        email: email,
        phone: cleaned,
        marketing_consent: marketingConsent,
        created_at: customerProfile?.created_at || new Date().toISOString()
      };

      setCustomerProfile(updatedProfile);
      setNeedsPhoneOnboarding(false);
      localStorage.setItem('atelier_customer_phone_' + email, cleaned);
      localStorage.setItem('atelier_customer_profile', JSON.stringify(updatedProfile));

      // 2. Persist to Supabase Database (updates by email across matching customer records)
      try {
        await supabase
          .from('customers')
          .update({
            phone: cleaned,
            marketing_consent: marketingConsent,
            updated_at: new Date().toISOString()
          })
          .eq('email', email);
      } catch (dbErr) {
        console.warn('Supabase DB phone update note (local state preserved):', dbErr);
      }
    } catch (err: any) {
      console.error('Error saving phone number:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const dismissPhoneOnboarding = () => {
    setNeedsPhoneOnboarding(false);
  };

  const logout = async () => {
    setIsLoading(true);
    localStorage.removeItem('atelier_dev_user');
    localStorage.removeItem('atelier_customer_profile');
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
        dismissPhoneOnboarding,
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
