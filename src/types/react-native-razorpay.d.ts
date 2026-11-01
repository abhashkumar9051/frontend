declare module "react-native-razorpay" {
  export interface RazorpayCheckoutOptions {
    key: string;
    order_id: string;
    amount: number | string;
    currency: string;
    name: string;
    description?: string;
    image?: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
      method?: "card" | "netbanking" | "wallet" | "emi" | "upi";
    };
    theme?: {
      color?: string;
      backdrop_color?: string;
      hide_topbar?: boolean;
    };
  }

  export interface RazorpayCheckoutResult {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }

  const RazorpayCheckout: {
    open(options: RazorpayCheckoutOptions): Promise<RazorpayCheckoutResult>;
  };

  export default RazorpayCheckout;
}
