import { supabase } from '../lib/supabase';
import { Order, ShippingAddress, OrderItem } from '../types';

export interface QikinkTokenResponse {
  status: string;
  token?: string;
  expires_in?: number;
  message?: string;
}

export interface QikinkOrderRequest {
  order_number: string;
  qikink_shipping: number; // 1 = Qikink shipping
  gateway: 'Prepaid' | 'COD';
  total_order_value: number;
  line_items: Array<{
    search_from_my_products: number;
    sku: string;
    quantity: number;
    price: number;
    design_code?: string;
  }>;
  shipping_address: {
    first_name: string;
    last_name?: string;
    address1: string;
    address2?: string;
    phone: string;
    email: string;
    city: string;
    zip: string;
    province: string;
    country_code: string;
  };
}

export interface QikinkOrderResponse {
  status: boolean | string;
  order_id?: string;
  qikink_order_number?: string;
  message?: string;
  error?: string;
  tracking_number?: string;
  courier_name?: string;
  tracking_link?: string;
}

export interface QikinkSyncLog {
  id: string;
  order_id: string;
  order_number: string;
  sync_type: string;
  status: string;
  request_payload?: any;
  response_payload?: any;
  error_message?: string;
  created_at: string;
}

// Client-side rate limiting guard: max 60 requests per 60 seconds
const requestTimestamps: number[] = [];

function checkRateLimit(): boolean {
  const now = Date.now();
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - 60000) {
    requestTimestamps.shift();
  }
  if (requestTimestamps.length >= 60) {
    return false;
  }
  requestTimestamps.push(now);
  return true;
}

/**
 * Maps Qikink provider status to customer-friendly display label and badge style
 */
export function mapQikinkStatus(status?: string): {
  label: string;
  stepIndex: number;
  variant: 'default' | 'success' | 'warning' | 'error';
} {
  switch (status) {
    case 'Live':
      return { label: 'Order Confirmed', stepIndex: 1, variant: 'default' };
    case 'To be Printed':
    case 'Partially Picklisted':
      return { label: 'Preparing & Queueing Print', stepIndex: 2, variant: 'default' };
    case 'Printed':
      return { label: 'Printed & Quality Inspected', stepIndex: 3, variant: 'default' };
    case 'Manifested':
      return { label: 'Packed & Manifested', stepIndex: 4, variant: 'default' };
    case 'In-Transit':
      return { label: 'Shipped & In-Transit', stepIndex: 5, variant: 'success' };
    case 'Out for Delivery':
      return { label: 'Out for Delivery', stepIndex: 6, variant: 'success' };
    case 'Delivered':
      return { label: 'Delivered', stepIndex: 7, variant: 'success' };
    case 'Exception':
      return { label: 'Delivery Issue / Exception', stepIndex: 5, variant: 'warning' };
    case 'RTO Initiated':
      return { label: 'Returning to Origin', stepIndex: 5, variant: 'warning' };
    case 'Returned':
      return { label: 'Returned', stepIndex: 7, variant: 'error' };
    case 'Cancelled':
      return { label: 'Cancelled', stepIndex: 0, variant: 'error' };
    case 'On Hold':
      return { label: 'Fulfillment Delayed / On Hold', stepIndex: 2, variant: 'warning' };
    case 'Live OOS':
      return { label: 'Temporarily Out of Stock', stepIndex: 1, variant: 'warning' };
    default:
      return { label: status || 'Processing', stepIndex: 1, variant: 'default' };
  }
}

/**
 * Validates the schema before creating a Qikink Order
 */
export function validateQikinkOrderPayload(
  orderNumber: string,
  gateway: 'Prepaid' | 'COD',
  items: OrderItem[],
  address: ShippingAddress,
  totalAmount: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!orderNumber || orderNumber.trim().length === 0) {
    errors.push('Order number is required.');
  }
  if (!items || items.length === 0) {
    errors.push('At least one line item is required.');
  }
  items.forEach((item, idx) => {
    if (!item.qikink_sku) {
      errors.push(`Item #${idx + 1} (${item.product_name}) lacks a verified Qikink SKU.`);
    }
    if (item.quantity <= 0) {
      errors.push(`Item #${idx + 1} quantity must be greater than 0.`);
    }
    if (item.unit_price <= 0) {
      errors.push(`Item #${idx + 1} unit price must be positive.`);
    }
  });

  if (!address.firstName || address.firstName.trim().length === 0) {
    errors.push('Shipping first name is required.');
  }
  if (!address.addressLine1 || address.addressLine1.trim().length === 0) {
    errors.push('Shipping address line 1 is required.');
  }
  if (!address.city || address.city.trim().length === 0) {
    errors.push('Shipping city is required.');
  }
  if (!address.postalCode || address.postalCode.trim().length < 5) {
    errors.push('A valid PIN / postal code is required.');
  }
  if (!address.phone || address.phone.trim().length < 10) {
    errors.push('A valid customer phone number is required for courier delivery.');
  }
  if (totalAmount <= 0) {
    errors.push('Total order value must be greater than zero.');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Tests the live Qikink Sandbox authentication via Supabase Edge Function
 */
export async function testQikinkConnection(): Promise<{
  success: boolean;
  message: string;
  token_expires_in?: number;
  mode?: string;
  error?: string;
}> {
  try {
    const { data, error } = await supabase.functions.invoke('qikink-api', {
      body: { action: 'test_connection' }
    });

    if (error) {
      return {
        success: false,
        message: 'Edge Function invocation failed',
        error: error.message
      };
    }

    return data;
  } catch (err: any) {
    return {
      success: false,
      message: 'Failed to connect to backend Edge function',
      error: err.message
    };
  }
}

/**
 * Submits an order to Qikink Fulfillment through the secure Supabase Edge Function.
 * Verifies payment confirmation and credentials server-side without exposing secrets.
 */
export async function submitOrderToQikinkSandbox(
  order: Order,
  items: OrderItem[]
): Promise<QikinkOrderResponse> {
  if (!checkRateLimit()) {
    throw new Error('Rate limit exceeded: Qikink API allows maximum 60 requests per minute.');
  }

  const gateway: 'Prepaid' | 'COD' = order.payment_method === 'COD' ? 'COD' : 'Prepaid';

  const validation = validateQikinkOrderPayload(
    order.order_number,
    gateway,
    items,
    order.shipping_address,
    order.total_amount
  );

  if (!validation.valid) {
    return {
      status: false,
      error: `Validation Failed: ${validation.errors.join('; ')}`
    };
  }

  try {
    // Invoke secure Edge Function
    const { data, error } = await supabase.functions.invoke('qikink-api', {
      body: {
        action: 'create_order',
        order_id: order.id
      }
    });

    if (error) {
      console.warn('Qikink Edge Function notice:', error);
      return {
        status: false,
        error: error.message || 'Edge function error'
      };
    }

    if (!data.success) {
      return {
        status: false,
        error: data.error || 'Qikink fulfillment submission rejected',
        message: data.details ? JSON.stringify(data.details) : undefined
      };
    }

    return {
      status: true,
      order_id: data.order_id,
      qikink_order_number: order.order_number,
      message: data.message || 'Order successfully submitted to Qikink Sandbox'
    };
  } catch (err: any) {
    return {
      status: false,
      error: err.message || 'Unexpected network error during order submission'
    };
  }
}

export const submitOrderToQikink = submitOrderToQikinkSandbox;

/**
 * Updates order tracking and status via backend Edge function and logs to database
 */
export async function updateOrderTrackingAndStatus(params: {
  order_id: string;
  order_number?: string;
  qikink_status?: string;
  awb_number?: string;
  courier_name?: string;
  tracking_link?: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('qikink-api', {
      body: {
        action: 'update_status',
        ...params
      }
    });

    if (error) throw error;
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to update tracking details'
    };
  }
}

/**
 * Fetches recent Qikink synchronization logs for auditing and debugging
 */
export async function fetchQikinkSyncLogs(orderId?: string): Promise<QikinkSyncLog[]> {
  let query = supabase
    .from('qikink_order_sync_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (orderId) {
    query = query.eq('order_id', orderId);
  }

  const { data, error } = await query;
  if (error || !data) {
    console.error('Error fetching sync logs:', error);
    return [];
  }
  return data as QikinkSyncLog[];
}
