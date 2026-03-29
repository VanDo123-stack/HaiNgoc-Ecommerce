"use client";

import React, { useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight, Eye, FileDown, Mail, Paperclip, Trash2, Upload, FileText, ImageIcon } from "lucide-react";

import { adminOrders } from "~/data/admin/orders";
import { formatVND } from "~/lib/format";
import { generateQuotePdf } from "~/lib/generate-quote-pdf";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { type AdminOrder, type OrderAttachment } from "~/types/admin";

type OrderStatus = AdminOrder["status"];

const statusTabs: { key: OrderStatus | "all"; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "Mới", label: "Mới" },
  { key: "Đã báo giá", label: "Đã báo giá" },
  { key: "Đang giao", label: "Đang giao" },
  { key: "Hoàn thành", label: "Hoàn thành" },
];

const DEFAULT_SORT: { column: string; direction: "asc" | "desc" } = {
  column: "orderDate",
  direction: "desc",
};

function getStatusBadge(status: OrderStatus) {
  switch (status) {
    case "Mới":
      return <Badge variant="outline">{status}</Badge>;
    case "Đã báo giá":
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 border-yellow-200"
        >
          {status}
        </Badge>
      );
    case "Đang giao":
      return <Badge variant="default">{status}</Badge>;
    case "Hoàn thành":
      return (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 border-green-200"
        >
          {status}
        </Badge>
      );
  }
}

const allStatuses: OrderStatus[] = ["Mới", "Đã báo giá", "Đang giao", "Hoàn thành"];

export default function DonHangPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");
  const [sortConfig, setSortConfig] = useState<{
    column: string;
    direction: "asc" | "desc";
  }>(DEFAULT_SORT);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [orders, setOrders] = useState([...adminOrders]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
  }

  function handleTabChange(tab: OrderStatus | "all") {
    setActiveTab(tab);
    setSortConfig(DEFAULT_SORT);
    setCurrentPage(1);
  }

  function handleSort(column: string) {
    setSortConfig((prev) => {
      if (prev.column === column) {
        return { column, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { column, direction: "asc" };
    });
    setCurrentPage(1);
  }

  function getSortIcon(column: string) {
    if (sortConfig.column !== column) {
      return <ChevronsUpDown className="ml-1 inline size-4" />;
    }
    if (sortConfig.direction === "asc") {
      return <ChevronUp className="ml-1 inline size-4" />;
    }
    return <ChevronDown className="ml-1 inline size-4" />;
  }

  const filteredAndSorted = useMemo(() => {
    const filtered =
      activeTab === "all"
        ? orders
        : orders.filter((o) => o.status === activeTab);

    return [...filtered].sort((a, b) => {
      const col = sortConfig.column as keyof AdminOrder;
      const dir = sortConfig.direction === "asc" ? 1 : -1;

      if (col === "totalAmount" || col === "id") {
        const aVal = a[col];
        const bVal = b[col];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return (aVal - bVal) * dir;
        }
        if (typeof aVal === "string" && typeof bVal === "string") {
          return aVal.localeCompare(bVal, "vi") * dir;
        }
      }

      if (col === "customerName" || col === "orderDate") {
        const aVal = a[col];
        const bVal = b[col];
        if (typeof aVal === "string" && typeof bVal === "string") {
          return aVal.localeCompare(bVal, "vi") * dir;
        }
      }

      return 0;
    });
  }, [activeTab, sortConfig, orders]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / pageSize));
  const paginatedOrders = filteredAndSorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Đơn hàng</h1>

      {/* Tab bar */}
      <div className="mb-4 flex flex-wrap gap-2" role="tablist">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground",
            )}
            onClick={() => handleTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th
                className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold text-muted-foreground hover:text-foreground"
                onClick={() => handleSort("id")}
              >
                Mã đơn
                {getSortIcon("id")}
              </th>
              <th
                className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold text-muted-foreground hover:text-foreground"
                onClick={() => handleSort("customerName")}
              >
                Khách hàng
                {getSortIcon("customerName")}
              </th>
              <th
                className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold text-muted-foreground hover:text-foreground"
                onClick={() => handleSort("orderDate")}
              >
                Ngày đặt
                {getSortIcon("orderDate")}
              </th>
              <th
                className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold text-muted-foreground hover:text-foreground"
                onClick={() => handleSort("totalAmount")}
              >
                Tổng tiền
                {getSortIcon("totalAmount")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                Số SP
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                Cập nhật
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8">
                  <p className="text-center text-muted-foreground">
                    Không có đơn hàng với trạng thái này
                  </p>
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
                    <td className="px-4 py-3">{order.customerName}</td>
                    <td className="px-4 py-3">
                      {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-3">
                      {formatVND(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                    <td className="px-4 py-3">{order.items.length}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className="h-8 rounded-md border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {allStatuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                          className={cn(
                            "rounded p-1.5 transition-colors hover:bg-muted",
                            expandedId === order.id ? "bg-muted text-foreground" : "text-muted-foreground",
                          )}
                          title="Chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === order.id && (
                    <tr className="border-b border-border bg-blue-50">
                      <td colSpan={7} className="px-4 py-4">
                        {/* Action buttons */}
                        <div className="mb-4 flex gap-2">
                          <button
                            onClick={() => {
                              const doc = generateQuotePdf(order);
                              doc.save(`bao-gia-${order.id}.pdf`);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-md bg-blue-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                          >
                            <FileDown className="h-3.5 w-3.5" />
                            Tải báo giá PDF
                          </button>
                          <a
                            href={`mailto:${order.email ?? ""}?subject=${encodeURIComponent(`Báo giá ${order.id} — Hải Ngọc`)}&body=${encodeURIComponent(`Kính gửi ${order.customerName},\n\nVui lòng xem báo giá đính kèm cho đơn hàng ${order.id}.\n\nTổng giá trị: ${formatVND(order.totalAmount)}\n\nTrân trọng,\nHải Ngọc`)}`}
                            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            Gửi email báo giá
                          </a>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          {/* Checkout info */}
                          <div>
                            <h4 className="mb-2 text-sm font-semibold">Thông tin đặt hàng</h4>
                            <dl className="space-y-1 text-sm">
                              <div className="flex gap-2">
                                <dt className="w-24 shrink-0 text-muted-foreground">Công ty:</dt>
                                <dd>{order.companyName ?? "Chưa cập nhật"}</dd>
                              </div>
                              <div className="flex gap-2">
                                <dt className="w-24 shrink-0 text-muted-foreground">MST:</dt>
                                <dd>{order.taxCode ?? "Chưa cập nhật"}</dd>
                              </div>
                              <div className="flex gap-2">
                                <dt className="w-24 shrink-0 text-muted-foreground">Điện thoại:</dt>
                                <dd>{order.phone ?? "Chưa cập nhật"}</dd>
                              </div>
                              <div className="flex gap-2">
                                <dt className="w-24 shrink-0 text-muted-foreground">Email:</dt>
                                <dd>{order.email ?? "Chưa cập nhật"}</dd>
                              </div>
                              <div className="flex gap-2">
                                <dt className="w-24 shrink-0 text-muted-foreground">Địa chỉ:</dt>
                                <dd>{order.address ?? "Chưa cập nhật"}</dd>
                              </div>
                              {order.notes && (
                                <div className="flex gap-2">
                                  <dt className="w-24 shrink-0 text-muted-foreground">Ghi chú:</dt>
                                  <dd>{order.notes}</dd>
                                </div>
                              )}
                            </dl>
                          </div>
                          {/* Order items */}
                          <div>
                            <h4 className="mb-2 text-sm font-semibold">Sản phẩm ({order.items.length})</h4>
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-border">
                                  <th className="pb-1 text-left text-xs text-muted-foreground">Tên</th>
                                  <th className="pb-1 text-right text-xs text-muted-foreground">SL</th>
                                  <th className="pb-1 text-right text-xs text-muted-foreground">Đơn giá</th>
                                  <th className="pb-1 text-right text-xs text-muted-foreground">Thành tiền</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item) => (
                                  <tr key={item.productSlug} className="border-b border-border/50 last:border-0">
                                    <td className="py-1.5">{item.productName}</td>
                                    <td className="py-1.5 text-right">{item.quantity}</td>
                                    <td className="py-1.5 text-right">{formatVND(item.unitPrice)}</td>
                                    <td className="py-1.5 text-right font-medium">{formatVND(item.quantity * item.unitPrice)}</td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr>
                                  <td colSpan={3} className="pt-2 text-right font-semibold">Tổng:</td>
                                  <td className="pt-2 text-right font-semibold">{formatVND(order.totalAmount)}</td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>

                        {/* Attachments (CO/CQ) */}
                        <div className="mt-4 border-t border-border pt-4">
                          <div className="mb-3 flex items-center justify-between">
                            <h4 className="text-sm font-semibold flex items-center gap-1.5">
                              <Paperclip className="h-4 w-4" />
                              Chứng từ đính kèm ({order.attachments?.length ?? 0})
                            </h4>
                            <AttachmentUpload
                              onUpload={(attachment) => {
                                setOrders((prev) =>
                                  prev.map((o) =>
                                    o.id === order.id
                                      ? { ...o, attachments: [...(o.attachments ?? []), attachment] }
                                      : o,
                                  ),
                                );
                              }}
                            />
                          </div>
                          {order.attachments && order.attachments.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                              {order.attachments.map((att) => (
                                <div
                                  key={att.id}
                                  className="flex items-center gap-3 rounded-md border border-border p-2.5"
                                >
                                  {att.fileType.startsWith("image/") ? (
                                    <a href={att.fileUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
                                      <img
                                        src={att.fileUrl}
                                        alt={att.name}
                                        className="h-12 w-12 rounded object-cover"
                                      />
                                    </a>
                                  ) : (
                                    <a href={att.fileUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
                                      <FileText className="h-12 w-12 rounded bg-muted p-2 text-muted-foreground" />
                                    </a>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">{att.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      <Badge variant="outline" className="mr-1 text-[10px]">{att.type}</Badge>
                                      {new Date(att.uploadedAt).toLocaleDateString("vi-VN")}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => {
                                      URL.revokeObjectURL(att.fileUrl);
                                      setOrders((prev) =>
                                        prev.map((o) =>
                                          o.id === order.id
                                            ? { ...o, attachments: o.attachments?.filter((a) => a.id !== att.id) }
                                            : o,
                                        ),
                                      );
                                    }}
                                    className="shrink-0 rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                    title="Xóa"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Chưa có chứng từ đính kèm</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <span className="text-sm text-muted-foreground">
              Hiển thị {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredAndSorted.length)} / {filteredAndSorted.length} đơn hàng
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "h-8 min-w-8 rounded px-2 text-sm transition-colors",
                    page === currentPage
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Attachment upload sub-component
const attachmentTypes: OrderAttachment["type"][] = ["CO", "CQ", "Invoice", "Other"];

function AttachmentUpload({ onUpload }: { onUpload: (att: OrderAttachment) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [docType, setDocType] = useState<OrderAttachment["type"]>("CO");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const attachment: OrderAttachment = {
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: file.name,
      type: docType,
      fileUrl: URL.createObjectURL(file),
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
    };
    onUpload(attachment);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={docType}
        onChange={(e) => setDocType(e.target.value as OrderAttachment["type"])}
        className="h-7 rounded border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {attachmentTypes.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <input
        ref={fileRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        onChange={handleFile}
        className="hidden"
      />
      <button
        onClick={() => fileRef.current?.click()}
        className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted"
      >
        <Upload className="h-3.5 w-3.5" />
        Tải lên
      </button>
    </div>
  );
}
