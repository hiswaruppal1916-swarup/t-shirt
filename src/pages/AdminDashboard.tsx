import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Upload,
  Search,
  ExternalLink,
  AlertTriangle,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, ProductVariant, Order, OrderItem } from '../types';
import {
  mapQikinkStatus,
  testQikinkConnection,
  fetchQikinkSyncLogs,
  submitOrderToQikink,
  updateOrderTrackingAndStatus,
  QikinkSyncLog
} from '../services/qikinkService';

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'settings' | 'logs'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [syncLogs, setSyncLogs] = useState<QikinkSyncLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [syncingOrderId, setSyncingOrderId] = useState<string | null>(null);
  const [searchOrderQuery, setSearchOrderQuery] = useState('');
  const [csvPreviewData, setCsvPreviewData] = useState<any[] | null>(null);
  const [csvError, setCsvError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Connection test state
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    token_expires_in?: number;
    mode?: string;
  } | null>(null);

  // Edit tracking modal state
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [modalStatus, setModalStatus] = useState<string>('Live');
  const [modalAwb, setModalAwb] = useState<string>('');
  const [modalCourier, setModalCourier] = useState<string>('BlueDart');
  const [modalTrackingLink, setModalTrackingLink] = useState<string>('');
  const [isSavingTracking, setIsSavingTracking] = useState(false);

  // Edit product cost & price state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editSellingPrice, setEditSellingPrice] = useState<number>(0);
  const [editCostPrice, setEditCostPrice] = useState<number>(0);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, productsRes, variantsRes, logsRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('product_variants').select('*').order('created_at', { ascending: false }),
        fetchQikinkSyncLogs()
      ]);

      if (ordersRes.data) setOrders(ordersRes.data as Order[]);
      if (productsRes.data) setProducts(productsRes.data as Product[]);
      if (variantsRes.data) setVariants(variantsRes.data as ProductVariant[]);
      setSyncLogs(logsRes);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Test live Qikink authentication through Edge Function
  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      const res = await testQikinkConnection();
      setConnectionResult({
        tested: true,
        success: res.success,
        message: res.message || (res.error ? `Error: ${res.error}` : 'Connected'),
        token_expires_in: res.token_expires_in,
        mode: res.mode || 'sandbox'
      });
      if (res.success) {
        showToast('✓ Qikink Sandbox authentication verified!');
      } else {
        showToast(`Connection notice: ${res.message || res.error}`);
      }
    } catch (err: any) {
      setConnectionResult({
        tested: true,
        success: false,
        message: err.message || 'Connection failed'
      });
      showToast(`Error testing connection: ${err.message}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Retry submitting order to Qikink Sandbox Fulfillment
  const handleRetryFulfillment = async (order: Order) => {
    setSyncingOrderId(order.id);
    try {
      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);

      const res = await submitOrderToQikink(order, (items || []) as OrderItem[]);
      if (res.status) {
        showToast(`✓ Order #${order.order_number} submitted to Qikink! ID: ${res.order_id}`);
      } else {
        showToast(`Qikink fulfillment: ${res.error}`);
      }
      await fetchAdminData();
    } catch (err: any) {
      showToast(`Fulfillment error: ${err.message}`);
    } finally {
      setSyncingOrderId(null);
    }
  };

  // Open Tracking & Status Modal
  const openTrackingModal = (order: Order) => {
    setEditingOrder(order);
    setModalStatus(order.qikink_status || 'Live');
    setModalAwb(order.awb_number || '');
    setModalCourier(order.courier_name || 'BlueDart');
    setModalTrackingLink(order.tracking_link || '');
  };

  // Save manual tracking details
  const handleSaveTracking = async () => {
    if (!editingOrder) return;
    setIsSavingTracking(true);
    try {
      const res = await updateOrderTrackingAndStatus({
        order_id: editingOrder.id,
        order_number: editingOrder.order_number,
        qikink_status: modalStatus,
        awb_number: modalAwb.trim(),
        courier_name: modalCourier.trim(),
        tracking_link: modalTrackingLink.trim() || (modalAwb ? `https://www.bluedart.com/tracking?trackNumber=${modalAwb}` : undefined)
      });

      if (res.success) {
        showToast(`Order #${editingOrder.order_number} tracking updated!`);
        setEditingOrder(null);
        await fetchAdminData();
      } else {
        showToast(`Update error: ${res.error}`);
      }
    } finally {
      setIsSavingTracking(false);
    }
  };

  // Start editing product prices & cost
  const startEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setEditSellingPrice(prod.selling_price);
    setEditCostPrice((prod as any).cost_price || 0);
  };

  // Save product prices & cost
  const handleSaveProductPricing = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          selling_price: editSellingPrice,
          cost_price: editCostPrice
        })
        .eq('id', productId);

      if (error) throw error;
      showToast('Pricing and cost updated successfully!');
      setEditingProductId(null);
      await fetchAdminData();
    } catch (err: any) {
      showToast(`Failed to update pricing: ${err.message}`);
    }
  };

  // CSV Import Parser
  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCsvError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
        if (lines.length < 2) {
          setCsvError('CSV file must have a header row and at least 1 data row.');
          return;
        }

        const headers = lines[0].split(',').map((h) => h.trim());
        const parsedRows = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map((v) => v.trim());
          const rowObj: any = {};
          headers.forEach((h, idx) => {
            rowObj[h] = values[idx] || '';
          });
          parsedRows.push(rowObj);
        }

        setCsvPreviewData(parsedRows);
      } catch (err: any) {
        setCsvError('Failed to parse CSV file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Import previewed rows into Supabase
  const handleConfirmImport = async () => {
    if (!csvPreviewData || csvPreviewData.length === 0) return;
    setIsLoading(true);

    try {
      for (const row of csvPreviewData) {
        const { data: newProd } = await supabase
          .from('products')
          .insert({
            name: row.name || 'Imported T-Shirt',
            slug: (row.name || 'imported-tee').toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
            description: row.description || 'Imported via Admin CSV',
            category: row.category || 'Graphic Tees',
            selling_price: parseFloat(row.selling_price) || 899,
            cost_price: parseFloat(row.cost_price) || 350,
            compare_price: parseFloat(row.compare_price) || 1499,
            main_image_url: row.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
            fabric_gsm: row.fabric_gsm || '240 GSM Combed Cotton',
            qikink_enabled: true,
            active: true
          })
          .select()
          .single();

        if (newProd && row.qikink_sku) {
          await supabase.from('product_variants').insert({
            product_id: newProd.id,
            size: row.size || 'L',
            color: row.color || 'Phantom Black',
            variant_name: `${row.color || 'Black'} / ${row.size || 'L'}`,
            qikink_sku: row.qikink_sku,
            inventory_count: 100,
            active: true
          });
        }
      }

      showToast(`Successfully imported ${csvPreviewData.length} items to catalog!`);
      setCsvPreviewData(null);
      await fetchAdminData();
    } catch (err: any) {
      showToast('Import error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const qikinkProcessingCount = orders.filter(
    (o) => o.qikink_status && ['Live', 'To be Printed', 'Printed'].includes(o.qikink_status)
  ).length;
  const inTransitCount = orders.filter(
    (o) => o.qikink_status && ['Manifested', 'In-Transit', 'Out for Delivery'].includes(o.qikink_status)
  ).length;
  const errorCount = orders.filter((o) => o.internal_status === 'QIKINK_SYNC_ERROR').length;

  const filteredOrders = orders.filter(
    (o) =>
      o.order_number.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
      o.customer_phone.includes(searchOrderQuery)
  );

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '5rem',
            right: '1.5rem',
            backgroundColor: '#111827',
            color: '#FFFFFF',
            padding: '0.75rem 1.25rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 600,
            zIndex: 100,
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Top Header & Environment Badge */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.875rem)', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
              Atelier Store Admin
            </h1>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                padding: '0.25rem 0.625rem',
                borderRadius: '9999px',
                backgroundColor: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #A7F3D0'
              }}
            >
              ● Qikink Sandbox Active
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
            Qikink API integration, product SKU mapping, margin management, and fulfillment logs
          </p>
        </div>

        <button onClick={() => onNavigate('home')} className="btn-secondary" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
          Back to Storefront
        </button>
      </div>

      {/* Admin Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.5rem', marginBottom: '2rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`filter-chip ${activeTab === 'overview' ? 'active' : ''}`}
        >
          Overview & Metrics
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`filter-chip ${activeTab === 'orders' ? 'active' : ''}`}
        >
          Orders & Fulfillment ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`filter-chip ${activeTab === 'products' ? 'active' : ''}`}
        >
          Products, Margins & SKUs ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`filter-chip ${activeTab === 'logs' ? 'active' : ''}`}
        >
          Qikink Sync Logs ({syncLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`filter-chip ${activeTab === 'settings' ? 'active' : ''}`}
        >
          Qikink API Health & Test
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>
                Total Orders
              </span>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginTop: '0.375rem' }}>
                {orders.length}
              </p>
              <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>Active in Supabase</span>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>
                Processing at Qikink
              </span>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginTop: '0.375rem' }}>
                {qikinkProcessingCount}
              </p>
              <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Live / Printing queue</span>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>
                Shipped & In-Transit
              </span>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginTop: '0.375rem' }}>
                {inTransitCount}
              </p>
              <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>Courier partners active</span>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>
                Total Revenue
              </span>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginTop: '0.375rem' }}>
                ₹{totalRevenue.toLocaleString()}
              </p>
              <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Indian Rupees (INR)</span>
            </div>
          </div>

          {errorCount > 0 && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', padding: '1rem 1.25rem', borderRadius: '0.75rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertTriangle size={20} color="#DC2626" />
                <span style={{ fontSize: '0.875rem', color: '#991B1B', fontWeight: 600 }}>
                  {errorCount} order(s) encountered Qikink synchronization notices (e.g. Sandbox SKU lookup).
                </span>
              </div>
              <button onClick={() => setActiveTab('orders')} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem', minHeight: '32px' }}>
                Review Orders
              </button>
            </div>
          )}

          {/* Quick Recent Orders Table */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '1.25rem', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', marginBottom: '1rem' }}>
              Recent Order Submissions
            </h3>
            {orders.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>No orders placed yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E5E7EB', textAlign: 'left', color: '#6B7280' }}>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Order #</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Customer</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Amount</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Payment</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Qikink Status</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((ord) => {
                      const status = mapQikinkStatus(ord.qikink_status || 'Live');
                      return (
                        <tr key={ord.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>#{ord.order_number}</td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>{ord.customer_name}</td>
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>₹{ord.total_amount}</td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <span style={{ color: ord.payment_status === 'PAYMENT_SUCCESS' ? '#059669' : '#D97706', fontWeight: 600 }}>
                              {ord.payment_status}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <span style={{ padding: '0.2rem 0.5rem', backgroundColor: '#ECFDF5', color: '#065F46', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 700 }}>
                              {status.label}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <button
                              onClick={() => openTrackingModal(ord)}
                              className="btn-secondary"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.6875rem', minHeight: '28px' }}
                            >
                              Manage Tracking
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS & FULFILLMENT */}
      {activeTab === 'orders' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '1.25rem', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827' }}>
              All Customer Orders ({filteredOrders.length})
            </h2>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '12px', color: '#9CA3AF' }} />
              <input
                type="text"
                value={searchOrderQuery}
                onChange={(e) => setSearchOrderQuery(e.target.value)}
                placeholder="Search order #, customer, phone..."
                style={{ paddingLeft: '2.25rem', minHeight: '38px', fontSize: '0.8125rem' }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB', textAlign: 'left', color: '#6B7280' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Order Number</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Customer</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Phone</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Amount</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Payment</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Qikink ID</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>AWB / Courier</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => {
                  const status = mapQikinkStatus(ord.qikink_status || 'Live');
                  const hasError = ord.internal_status === 'QIKINK_SYNC_ERROR';
                  return (
                    <tr key={ord.id} style={{ borderBottom: '1px solid #F3F4F6', backgroundColor: hasError ? '#FEF2F2' : 'transparent' }}>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>#{ord.order_number}</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>{ord.customer_name}</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>{ord.customer_phone}</td>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>₹{ord.total_amount}</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <span style={{ color: ord.payment_status === 'PAYMENT_SUCCESS' ? '#059669' : '#D97706', fontWeight: 600 }}>
                          {ord.payment_method} ({ord.payment_status})
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <code>{ord.qikink_order_id || 'PENDING'}</code>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <div>
                          <span style={{ padding: '0.2rem 0.5rem', backgroundColor: hasError ? '#FEE2E2' : '#ECFDF5', color: hasError ? '#991B1B' : '#065F46', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 700 }}>
                            {hasError ? 'Sync Notice' : status.label}
                          </span>
                          {ord.error_message && (
                            <p style={{ fontSize: '0.6875rem', color: '#B91C1C', marginTop: '0.25rem', maxWidth: '180px' }}>
                              {ord.error_message}
                            </p>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        {ord.awb_number ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <span style={{ fontWeight: 600 }}>{ord.courier_name ? `${ord.courier_name}: ` : ''}{ord.awb_number}</span>
                            {ord.tracking_link && (
                              <a href={ord.tracking_link} target="_blank" rel="noreferrer" title="Open official tracking">
                                <ExternalLink size={12} color="#2563EB" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: '#9CA3AF' }}>Not Assigned</span>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          <button
                            onClick={() => openTrackingModal(ord)}
                            className="btn-secondary"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.6875rem', minHeight: '28px' }}
                            title="Update status or tracking"
                          >
                            Update
                          </button>
                          {hasError && (
                            <button
                              onClick={() => handleRetryFulfillment(ord)}
                              disabled={syncingOrderId === ord.id}
                              className="btn-primary"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.6875rem', minHeight: '28px' }}
                            >
                              <RefreshCw size={11} className={syncingOrderId === ord.id ? 'animate-spin' : ''} />
                              <span>Retry</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTS & MARGINS */}
      {activeTab === 'products' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* CSV Import Box */}
          <div style={{ backgroundColor: '#F9FAFB', padding: '1.75rem', borderRadius: '1.25rem', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
              Import Products & Qikink SKUs via CSV
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginBottom: '1.25rem' }}>
              Upload your catalog spreadsheet to automatically register products, Qikink SKUs, and retail pricing.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <label className="btn-secondary" style={{ cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={16} />
                <span>Select Catalog CSV File</span>
                <input type="file" accept=".csv" onChange={handleCsvFileUpload} style={{ display: 'none' }} />
              </label>

              <button
                onClick={() => {
                  const sampleCsv = `name,category,selling_price,cost_price,compare_price,size,color,qikink_sku,fabric_gsm\n"Anime Cyber Dragon Tee",Graphic Tees,899,380,1499,L,Phantom Black,QIK-TS-BLK-L,240 GSM\n"Abstract Geometry Tee",Minimalist,799,350,1299,M,Pure White,QIK-TS-WHT-M,220 GSM`;
                  const blob = new Blob([sampleCsv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'sample_qikink_products.csv';
                  a.click();
                }}
                style={{ fontSize: '0.75rem', color: '#4B5563', textDecoration: 'underline' }}
              >
                Download Sample CSV Template
              </button>
            </div>

            {csvError && (
              <p style={{ color: '#B91C1C', fontSize: '0.8125rem', marginTop: '0.75rem' }}>{csvError}</p>
            )}

            {csvPreviewData && (
              <div style={{ marginTop: '1.25rem', padding: '1rem', backgroundColor: '#FFFFFF', borderRadius: '0.5rem', border: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                    Previewing {csvPreviewData.length} records ready for import
                  </h4>
                  <button onClick={handleConfirmImport} className="btn-primary" style={{ padding: '0.375rem 1rem', fontSize: '0.75rem', minHeight: '32px' }}>
                    Confirm & Save to Supabase
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Current Products & Margin Table */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '1.25rem', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', marginBottom: '1rem' }}>
              Active Catalog, Retail Prices & Margin Estimations
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E5E7EB', textAlign: 'left', color: '#6B7280' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Product Name</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Category</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Cost Price (Qikink)</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Selling Price</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Est. Margin</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Mapped Variants & SKUs</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const prodVariants = variants.filter((v) => v.product_id === p.id);
                    const cost = (p as any).cost_price || 0;
                    const margin = p.selling_price - cost;
                    const marginPercent = p.selling_price > 0 ? Math.round((margin / p.selling_price) * 100) : 0;
                    const isEditing = editingProductId === p.id;

                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img src={p.main_image_url} alt="" style={{ width: '36px', height: '44px', objectFit: 'cover', borderRadius: '0.25rem' }} />
                            <strong style={{ color: '#111827' }}>{p.name}</strong>
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>{p.category}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          {isEditing ? (
                            <input
                              type="number"
                              value={editCostPrice}
                              onChange={(e) => setEditCostPrice(parseFloat(e.target.value) || 0)}
                              style={{ width: '80px', padding: '0.25rem 0.5rem', fontSize: '0.8125rem' }}
                            />
                          ) : (
                            <span>{cost > 0 ? `₹${cost}` : '₹0 (Not set)'}</span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>
                          {isEditing ? (
                            <input
                              type="number"
                              value={editSellingPrice}
                              onChange={(e) => setEditSellingPrice(parseFloat(e.target.value) || 0)}
                              style={{ width: '80px', padding: '0.25rem 0.5rem', fontSize: '0.8125rem' }}
                            />
                          ) : (
                            <span>₹{p.selling_price}</span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span style={{ color: margin >= 0 ? '#059669' : '#DC2626', fontWeight: 700 }}>
                            ₹{margin} ({marginPercent}%)
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                            {prodVariants.slice(0, 3).map((v) => (
                              <code key={v.id} style={{ fontSize: '0.6875rem', backgroundColor: '#F3F4F6', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>
                                {v.qikink_sku}
                              </code>
                            ))}
                            {prodVariants.length > 3 && (
                              <span style={{ fontSize: '0.6875rem', color: '#6B7280' }}>+{prodVariants.length - 3} more</span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          {isEditing ? (
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                              <button onClick={() => handleSaveProductPricing(p.id)} className="btn-primary" style={{ padding: '0.25rem 0.5rem', minHeight: '28px' }}>
                                <Check size={12} />
                              </button>
                              <button onClick={() => setEditingProductId(null)} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', minHeight: '28px' }}>
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => startEditProduct(p)} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.6875rem', minHeight: '28px' }}>
                              <Edit2 size={11} style={{ marginRight: '0.25rem' }} />
                              <span>Edit Price</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: QIKINK SYNC LOGS & AUDITS */}
      {activeTab === 'logs' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '1.25rem', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827' }}>
                Qikink Fulfillment & API Sync Audit Logs
              </h2>
              <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.25rem' }}>
                Every API call, order submission, status sync, and provider response is tracked in Supabase.
              </p>
            </div>
            <button onClick={fetchAdminData} className="btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>
              <RefreshCw size={12} style={{ marginRight: '0.375rem' }} />
              <span>Refresh Logs</span>
            </button>
          </div>

          {syncLogs.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: '#6B7280', padding: '2rem 0', textAlign: 'center' }}>
              No sync log entries recorded yet. Submissions will appear here automatically.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E5E7EB', textAlign: 'left', color: '#6B7280' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Timestamp</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Order Number</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Event Type</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Details / Sanitized Payload</th>
                  </tr>
                </thead>
                <tbody>
                  {syncLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '0.75rem 0.5rem', whiteSpace: 'nowrap' }}>
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>
                        #{log.order_number}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <code>{log.sync_type}</code>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <span
                          style={{
                            padding: '0.2rem 0.5rem',
                            backgroundColor: log.status === 'SUCCESS' ? '#ECFDF5' : '#FEF2F2',
                            color: log.status === 'SUCCESS' ? '#065F46' : '#991B1B',
                            borderRadius: '9999px',
                            fontSize: '0.6875rem',
                            fontWeight: 700
                          }}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        {log.error_message ? (
                          <span style={{ color: '#DC2626', fontWeight: 600 }}>{log.error_message}</span>
                        ) : (
                          <pre style={{ fontSize: '0.6875rem', margin: 0, maxHeight: '60px', overflowY: 'auto', backgroundColor: '#F9FAFB', padding: '0.25rem', borderRadius: '0.25rem' }}>
                            {JSON.stringify(log.response_payload || log.request_payload)}
                          </pre>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: QIKINK INTEGRATION SETTINGS */}
      {activeTab === 'settings' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Card 1: Live Status & Edge Function Test */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '1.25rem', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', marginBottom: '1.25rem' }}>
              Qikink Backend Edge Function Health
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #F3F4F6' }}>
                <span style={{ color: '#6B7280' }}>Operating Mode:</span>
                <strong style={{ color: '#059669' }}>● SANDBOX ENVIRONMENT</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #F3F4F6' }}>
                <span style={{ color: '#6B7280' }}>Backend Architecture:</span>
                <strong>Supabase Edge Function (`qikink-api`)</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #F3F4F6' }}>
                <span style={{ color: '#6B7280' }}>Credential Storage:</span>
                <strong style={{ color: '#059669' }}>✓ `app_secrets` (RLS Revoked from Public)</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #F3F4F6' }}>
                <span style={{ color: '#6B7280' }}>Rate Limit Protection:</span>
                <strong>60 req/min (Enforced)</strong>
              </div>
            </div>

            {/* Test Connection Action */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E5E7EB' }}>
              <button
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                className="btn-primary"
                style={{ width: '100%', minHeight: '44px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              >
                <RefreshCw size={14} className={isTestingConnection ? 'animate-spin' : ''} />
                <span>{isTestingConnection ? 'Authenticating with Qikink...' : 'Test Sandbox Authentication'}</span>
              </button>

              {connectionResult && (
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    backgroundColor: connectionResult.success ? '#ECFDF5' : '#FEF2F2',
                    border: `1px solid ${connectionResult.success ? '#A7F3D0' : '#FECACA'}`,
                    fontSize: '0.75rem'
                  }}
                >
                  <p style={{ fontWeight: 700, color: connectionResult.success ? '#065F46' : '#991B1B' }}>
                    {connectionResult.success ? '✓ Authentication Successful' : '✗ Authentication Issue'}
                  </p>
                  <p style={{ color: connectionResult.success ? '#047857' : '#B91C1C', marginTop: '0.25rem' }}>
                    {connectionResult.message}
                  </p>
                  {connectionResult.token_expires_in !== undefined && (
                    <p style={{ color: '#065F46', marginTop: '0.25rem' }}>
                      Token valid for next {connectionResult.token_expires_in} seconds.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Production Readiness */}
          <div style={{ backgroundColor: '#F9FAFB', padding: '1.75rem', borderRadius: '1.25rem', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', marginBottom: '1rem' }}>
              Live Production Readiness Steps
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: '1.6' }}>
              Before switching from Sandbox to Live fulfillment with Qikink:
            </p>
            <ol style={{ paddingLeft: '1.25rem', marginTop: '0.75rem', fontSize: '0.8125rem', color: '#4B5563', lineHeight: '1.7' }}>
              <li>Complete end-to-end test checkout in Sandbox mode.</li>
              <li>Ensure all store product SKUs exist inside your Qikink Merchant Dashboard ("My Products").</li>
              <li>Deposit prepaid funds into your Qikink Dashboard wallet balance.</li>
              <li>Update <code>QIKINK_CLIENT_ID</code> and <code>QIKINK_CLIENT_SECRET</code> in the Supabase <code>app_secrets</code> table with your Live production credentials.</li>
              <li>Switch endpoint URL from <code>sandbox.qikink.com</code> to <code>api.qikink.com</code> with explicit owner approval.</li>
            </ol>
          </div>
        </div>
      )}

      {/* MODAL: EDIT TRACKING & FULFILLMENT STATUS */}
      {editingOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '1.25rem',
              padding: 'clamp(1rem, 4vw, 2rem)',
              maxWidth: 'min(92vw, 480px)',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>
                Order #{editingOrder.order_number} Fulfillment
              </h3>
              <button onClick={() => setEditingOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                  Qikink Fulfillment Status
                </label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }}
                >
                  <option value="Live">Live (Order Confirmed)</option>
                  <option value="To be Printed">To be Printed (In Queue)</option>
                  <option value="Printed">Printed & Inspected</option>
                  <option value="Manifested">Manifested (Packed & Ready)</option>
                  <option value="In-Transit">In-Transit (Shipped)</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Exception">Exception / Delay</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                  Courier Partner Name
                </label>
                <input
                  type="text"
                  value={modalCourier}
                  onChange={(e) => setModalCourier(e.target.value)}
                  placeholder="BlueDart, Delhivery, DTDC..."
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                  AWB / Tracking Number
                </label>
                <input
                  type="text"
                  value={modalAwb}
                  onChange={(e) => setModalAwb(e.target.value)}
                  placeholder="e.g. BD987654321"
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                  Official Tracking URL (Optional)
                </label>
                <input
                  type="text"
                  value={modalTrackingLink}
                  onChange={(e) => setModalTrackingLink(e.target.value)}
                  placeholder="https://www.bluedart.com/tracking?..."
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  onClick={handleSaveTracking}
                  disabled={isSavingTracking}
                  className="btn-primary"
                  style={{ flex: 1, minHeight: '42px' }}
                >
                  {isSavingTracking ? 'Saving...' : 'Save Tracking Information'}
                </button>
                <button
                  onClick={() => setEditingOrder(null)}
                  className="btn-secondary"
                  style={{ minHeight: '42px' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
