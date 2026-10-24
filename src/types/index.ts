// Core Data Models matching Supabase Schema & Qikink API

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  selling_price: number;
  compare_price?: number;
  main_image_url: string;
  mockup_url?: string;
  fabric_gsm: string;
  qikink_enabled: boolean;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  color_hex?: string;
  variant_name: string;
  qikink_sku: string;
  qikink_product_reference?: string;
  inventory_count: number;
  active: boolean;
}

export interface Design {
  id: string;
  name: string;
  design_code: string;
  design_url: string;
  mockup_url?: string;
  width_inches: number;
  height_inches: number;
  placement: string;
  active: boolean;
}

export interface CartItem {
  productId: string;
  productName: string;
  productSlug: string;
  variantId: string;
  variantName: string;
  size: string;
  color: string;
  qikinkSku: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}

export type PaymentMethod = 'PREPAID' | 'COD' | 'TEST_GATEWAY';
export type PaymentStatus = 'PAYMENT_PENDING' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED';
export type InternalOrderStatus =
  | 'PAYMENT_PENDING'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'QIKINK_PENDING'
  | 'QIKINK_SUBMITTED'
  | 'QIKINK_CONFIRMED'
  | 'QIKINK_SYNC_ERROR'
  | 'COMPLETED';

export type QikinkFulfillmentStatus =
  | 'Live'
  | 'To be Printed'
  | 'Partially Picklisted'
  | 'Printed'
  | 'Manifested'
  | 'In-Transit'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Exception'
  | 'RTO Initiated'
  | 'Returned'
  | 'Cancelled'
  | 'On Hold'
  | 'Live OOS';

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  auth_user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  internal_status: InternalOrderStatus;
  qikink_order_id?: string;
  qikink_order_number?: string;
  qikink_status?: QikinkFulfillmentStatus;
  subtotal: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  awb_number?: string;
  tracking_link?: string;
  courier_name?: string;
  last_sync_at?: string;
  error_message?: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  variant_id: string;
  qikink_sku: string;
  product_name: string;
  variant_name?: string;
  size: string;
  color: string;
  quantity: number;
  unit_price: number;
  design_code?: string;
}

export interface Customer {
  id: string;
  auth_user_id?: string;
  name: string;
  email: string;
  phone?: string;
  marketing_consent: boolean;
  created_at?: string;
}

export interface QikinkConfig {
  mode: 'sandbox' | 'live';
  sandbox_token_url: string;
  live_token_url: string;
  sandbox_order_url: string;
  live_order_url: string;
  rate_limit_per_minute: number;
  configured: boolean;
  last_sync?: string;
}
