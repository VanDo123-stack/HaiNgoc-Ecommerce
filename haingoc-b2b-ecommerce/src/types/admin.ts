// Admin domain types — used exclusively by src/data/admin/ and admin panel UI
// Never import this in storefront code

export interface AdminCustomer {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  type: "retail" | "dealer" | "project";
  totalOrders: number;
  totalSpent: number; // VND
  outstandingDebt: number; // VND
  creditLimit: number; // VND
  joinedDate: string; // ISO date
  lastOrderDate: string; // ISO date
}

export interface AdminOrderItem {
  productSlug: string;
  productName: string;
  quantity: number;
  unitPrice: number; // VND
}

export interface OrderAttachment {
  id: string;
  name: string;
  type: "CO" | "CQ" | "Invoice" | "Other";
  fileUrl: string; // object URL for session, or path
  fileType: string; // mime type
  uploadedAt: string;
}

export interface AdminOrder {
  id: string;
  customerId: string;
  customerName: string;
  items: AdminOrderItem[];
  status: "Mới" | "Đã báo giá" | "Đang giao" | "Hoàn thành";
  orderDate: string;
  totalAmount: number; // VND
  notes?: string;
  // Checkout form data
  companyName?: string;
  taxCode?: string; // MST
  phone?: string;
  email?: string;
  address?: string;
  // Attachments (session-only)
  attachments?: OrderAttachment[];
}

export interface InventoryItem {
  productSlug: string;
  productName: string;
  currentStock: number;
  reorderLevel: number;
  unit: string; // "gói", "cái", "viên", "hộp"
  lastRestocked: string;
}

export interface MonthlyReportEntry {
  month: string; // "T1", "T2", ... "T12"
  revenue: number;
  orders: number;
}

export interface TopProductEntry {
  productSlug: string;
  productName: string;
  soldCount: number;
  revenue: number;
}

export interface ReportData {
  monthlyRevenue: MonthlyReportEntry[];
  topProducts: TopProductEntry[];
  customerSegments: { new: number; returning: number; inactive: number };
  inventoryAlerts: {
    productSlug: string;
    currentStock: number;
    reorderLevel: number;
  }[];
}
