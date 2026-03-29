// 1. Disclaimer

export const STOREFRONT_MOCK_DISCLAIMER = "Du lieu mo phong";


// 2. Profile

export const mockProfile = {
  name: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  phone: "0901 234 567",
  company: "Công ty TNHH Cơ Khí ABC",
};

export interface MockOrder {
  id: string;
  date: string;
  status: string;
  items: { name: string; quantity: number }[];
}

export const mockOrders: MockOrder[] = [
  {
    id: "DH-2024-001",
    date: "2024-01-15",
    status: "Đã giao",
    items: [{ name: "Que hàn LB52U Kobelco", quantity: 5 }],
  },
  {
    id: "DH-2024-002",
    date: "2024-03-08",
    status: "Đang xử lý",
    items: [{ name: "Máy mài góc Makita 9553B", quantity: 2 }],
  },
];

export const mockQuotations: MockOrder[] = [
  {
    id: "BG-2024-001",
    date: "2024-02-10",
    status: "Chờ xử lý",
    items: [{ name: "Đá cắt Klingspor A960TZ", quantity: 10 }],
  },
  {
    id: "BG-2024-002",
    date: "2024-03-20",
    status: "Đã hủy",
    items: [{ name: "Que hàn ESAB OK 48.00", quantity: 3 }],
  },
];

// 3. Debt tracking mock data

export interface MockInvoice {
  id: string;
  date: string;
  amount: number;
  status: string;
}

export interface MockCustomerDebt {
  creditLimit: number;
  outstandingDebt: number;
  invoices: MockInvoice[];
}

export const mockCustomerDebt: MockCustomerDebt = {
  creditLimit: 50_000_000,
  outstandingDebt: 12_750_000,
  invoices: [
    { id: "INV-2024-001", date: "2024-01-10", amount: 3_500_000, status: "Chua thanh toan" },
    { id: "INV-2024-002", date: "2024-02-15", amount: 4_250_000, status: "Chua thanh toan" },
    { id: "INV-2024-003", date: "2024-03-05", amount: 5_000_000, status: "Chua thanh toan" },
    { id: "INV-2023-015", date: "2023-12-20", amount: 8_200_000, status: "Da thanh toan" },
  ],
};

// 4. Stats

export const mockViewCount = 47;
