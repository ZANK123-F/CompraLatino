export type AuthUser = {
  token: string;
  email: string;
  fullName: string;
  role: string;
  firebaseUid: string;
};

export type Product = {
  id: number;
  externalId: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  priceJpy: number;
  priceLocal: number;
  fxRate: number;
  currency: string;
};

export type CartItem = { product: Product; quantity: number };

export type Order = {
  id: number;
  code: string;
  status: string;
  totalLocal: number;
  currency: string;
  createdAtUtc: string;
  items: Array<{
    productId: number;
    title: string;
    category: string;
    quantity: number;
    unitPriceLocal: number;
    unitPriceJpy: number;
  }>;
  payment?: {
    wompiTransactionId: string;
    status: string;
    amount: number;
    currency: string;
  } | null;
};

export type Recommendation = {
  productId: number;
  title: string;
  category: string;
  imageUrl: string;
  priceLocal: number;
  reason: string;
};

export type BiDashboard = {
  kpis: Array<{ key: string; label: string; value: number; unit: string }>;
  salesByDay: Array<{ label: string; value: number }>;
  topCategories: Array<{ label: string; value: number }>;
  paymentFunnel: Array<{ label: string; value: number }>;
  yAuctionsResults: Array<{ label: string; value: number }>;
};
