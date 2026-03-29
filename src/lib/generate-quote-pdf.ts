import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { robotoRegular, robotoBold } from "~/lib/fonts/roboto";
import { type AdminOrder } from "~/types/admin";
import { formatVND } from "~/lib/format";

function setupVietnameseFont(doc: jsPDF) {
  doc.addFileToVFS("Roboto-Regular.ttf", robotoRegular);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.addFileToVFS("Roboto-Bold.ttf", robotoBold);
  doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");
  doc.setFont("Roboto");
}

export function generateQuotePdf(order: AdminOrder) {
  const doc = new jsPDF();
  setupVietnameseFont(doc);

  // Header
  doc.setFont("Roboto", "bold");
  doc.setFontSize(20);
  doc.setTextColor(30, 64, 175);
  doc.text("HẢI NGỌC", 14, 20);

  doc.setFont("Roboto", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Cung cấp vật tư công nghiệp cơ khí và dầu khí", 14, 27);

  // Quote title
  doc.setFont("Roboto", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text("BÁO GIÁ / QUOTATION", 14, 42);

  // Quote info
  doc.setFont("Roboto", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(`Mã đơn: ${order.id}`, 14, 52);
  doc.text(
    `Ngày: ${new Date(order.orderDate).toLocaleDateString("vi-VN")}`,
    14,
    58,
  );
  doc.text(`Trạng thái: ${order.status}`, 14, 64);

  // Customer info
  doc.setFont("Roboto", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text("THÔNG TIN KHÁCH HÀNG", 14, 78);

  doc.setFont("Roboto", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80);
  const customerLines = [
    `Khách hàng: ${order.customerName}`,
    `Công ty: ${order.companyName ?? "—"}`,
    `MST: ${order.taxCode ?? "—"}`,
    `Điện thoại: ${order.phone ?? "—"}`,
    `Email: ${order.email ?? "—"}`,
    `Địa chỉ: ${order.address ?? "—"}`,
  ];
  customerLines.forEach((line, i) => {
    doc.text(line, 14, 85 + i * 6);
  });

  // Items table
  const tableStartY = 85 + customerLines.length * 6 + 8;

  autoTable(doc, {
    startY: tableStartY,
    head: [["#", "Sản phẩm", "Số lượng", "Đơn giá (VNĐ)", "Thành tiền (VNĐ)"]],
    body: order.items.map((item, i) => [
      (i + 1).toString(),
      item.productName,
      item.quantity.toString(),
      formatVND(item.unitPrice) ?? "",
      formatVND(item.quantity * item.unitPrice) ?? "",
    ]),
    foot: [["", "", "", "TỔNG CỘNG:", formatVND(order.totalAmount) ?? ""]],
    styles: { fontSize: 9, font: "Roboto" },
    headStyles: { fillColor: [30, 64, 175], font: "Roboto", fontStyle: "bold" },
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold", font: "Roboto" },
    theme: "grid",
  });

  // Notes
  if (order.notes) {
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
    doc.setFont("Roboto", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Ghi chú: ${order.notes}`, 14, finalY + 10);
  }

  // Footer
  doc.setFont("Roboto", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    "Báo giá có giá trị trong 30 ngày kể từ ngày phát hành.",
    14,
    doc.internal.pageSize.height - 20,
  );
  doc.text(
    "Hải Ngọc — info@haingoc.com.vn",
    14,
    doc.internal.pageSize.height - 14,
  );

  return doc;
}
