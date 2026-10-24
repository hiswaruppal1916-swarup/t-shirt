// Payment Provider Abstraction Layer

export interface PaymentProcessRequest {
  orderNumber: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  method: 'CARD' | 'UPI' | 'NETBANKING' | 'COD';
  simulateOutcome?: 'SUCCESS' | 'FAILURE' | 'CANCELLED';
}

export interface PaymentProcessResponse {
  success: boolean;
  providerPaymentId?: string;
  providerOrderId?: string;
  message: string;
  errorCode?: string;
}

export interface PaymentProvider {
  name: string;
  isTestProvider: boolean;
  processPayment(req: PaymentProcessRequest): Promise<PaymentProcessResponse>;
}

/**
 * Isolated Test Payment Provider for Development & Staging
 * Simulates real gateway flows, including simulated failure, retry, and cancellation
 */
export class DummyTestPaymentProvider implements PaymentProvider {
  name = 'Sandbox Dummy Payment Gateway';
  isTestProvider = true;

  async processPayment(req: PaymentProcessRequest): Promise<PaymentProcessResponse> {
    // Artificial latency for realistic gateway feel
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (req.method === 'COD') {
      return {
        success: true,
        providerPaymentId: `COD-${Date.now()}`,
        providerOrderId: `DUMMY-ORD-${req.orderNumber}`,
        message: 'Cash on Delivery order marked for payment collection on delivery.'
      };
    }

    if (req.simulateOutcome === 'FAILURE') {
      return {
        success: false,
        errorCode: 'PAYMENT_DECLINED_BY_BANK',
        message: 'Simulated payment failure: Card declined by issuing bank.'
      };
    }

    if (req.simulateOutcome === 'CANCELLED') {
      return {
        success: false,
        errorCode: 'USER_CANCELLED',
        message: 'Simulated payment cancellation: Checkout aborted by user.'
      };
    }

    // Default simulation is SUCCESS
    return {
      success: true,
      providerPaymentId: `PAY-TEST-${Math.floor(100000 + Math.random() * 900000)}`,
      providerOrderId: `GATEWAY-ORD-${req.orderNumber}`,
      message: 'Payment authorized and captured successfully via test gateway.'
    };
  }
}

// Active singleton instance (easily swapped when real Razorpay/Stripe gateway is wired)
export const paymentProvider: PaymentProvider = new DummyTestPaymentProvider();
