// Mock data for the billing component
export const apiCredits = {
  total: 10000,
  used: 6240,
  remaining: 3760,
  nextRefreshDate: '2025-04-15'
};

export const usageHistory = [
  { date: '2025-03-01', creditsUsed: 210 },
  { date: '2025-03-02', creditsUsed: 180 },
  { date: '2025-03-03', creditsUsed: 250 },
  { date: '2025-03-04', creditsUsed: 310 },
  { date: '2025-03-05', creditsUsed: 280 },
  { date: '2025-03-06', creditsUsed: 220 },
  { date: '2025-03-07', creditsUsed: 190 },
  { date: '2025-03-08', creditsUsed: 170 },
  { date: '2025-03-09', creditsUsed: 240 },
  { date: '2025-03-10', creditsUsed: 310 },
  { date: '2025-03-11', creditsUsed: 350 },
  { date: '2025-03-12', creditsUsed: 320 },
  { date: '2025-03-13', creditsUsed: 290 },
  { date: '2025-03-14', creditsUsed: 270 },
  { date: '2025-03-15', creditsUsed: 290 }
];

export const usageByVerificationType = [
  { type: 'ID Verification', credits: 2500 },
  { type: 'Face Verification', credits: 1800 },
  { type: 'Document Verification', credits: 1200 },
  { type: 'Address Verification', credits: 740 }
];

export const invoiceHistory = [
  {
    id: 'INV-20250301',
    date: '2025-03-01',
    amount: 299.00,
    status: 'Paid',
    plan: 'Business',
    credits: 10000,
    downloadUrl: '#'
  },
  {
    id: 'INV-20250201',
    date: '2025-02-01',
    amount: 299.00,
    status: 'Paid',
    plan: 'Business',
    credits: 10000,
    downloadUrl: '#'
  },
  {
    id: 'INV-20250101',
    date: '2025-01-01',
    amount: 299.00,
    status: 'Paid',
    plan: 'Business',
    credits: 10000,
    downloadUrl: '#'
  },
  {
    id: 'INV-20241201',
    date: '2024-12-01',
    amount: 199.00,
    status: 'Paid',
    plan: 'Professional',
    credits: 5000,
    downloadUrl: '#'
  }
];

export const paymentMethods = [
  {
    id: 'pm_1',
    type: 'Credit Card',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: 12,
    expiryYear: 2026,
    isDefault: true
  },
  {
    id: 'pm_2',
    type: 'Credit Card',
    last4: '5678',
    brand: 'Mastercard',
    expiryMonth: 8,
    expiryYear: 2027,
    isDefault: false
  }
];

export const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 99,
    creditAmount: 2000,
    features: [
      'ID Verification',
      'Face Verification',
      'Email Support',
      'Basic Analytics'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 199,
    creditAmount: 5000,
    features: [
      'ID Verification',
      'Face Verification',
      'Document Verification',
      'Priority Support',
      'Advanced Analytics'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    price: 299,
    creditAmount: 10000,
    features: [
      'All Professional Features',
      'Address Verification',
      'API Rate Limit Increase',
      'Dedicated Support',
      'Custom Integrations'
    ]
  }
];