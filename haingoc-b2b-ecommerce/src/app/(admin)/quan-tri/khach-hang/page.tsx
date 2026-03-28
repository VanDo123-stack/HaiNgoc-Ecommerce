"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

import { adminCustomers, MOCK_DATA_DISCLAIMER } from "~/data/admin/customers";
import { formatVND } from "~/lib/format";
import { cn } from "~/lib/utils";
import { type AdminCustomer } from "~/types/admin";

const tabs = [
  { key: "retail" as const, label: "Bán lẻ" },
  { key: "dealer" as const, label: "Đại lý" },
  { key: "project" as const, label: "Dự án" },
];

type SortableColumn = keyof AdminCustomer;

const DEFAULT_SORT: { column: SortableColumn; direction: "asc" | "desc" } = {
  column: "companyName",
  direction: "asc",
};

export default function KhachHangPage() {
  const [activeTab, setActiveTab] = useState<"retail" | "dealer" | "project">(
    "retail",
  );
  const [sortConfig, setSortConfig] = useState<{
    column: SortableColumn;
    direction: "asc" | "desc";
  }>(DEFAULT_SORT);

  function handleTabChange(tab: "retail" | "dealer" | "project") {
    setActiveTab(tab);
    setSortConfig(DEFAULT_SORT);
  }

  function handleSort(column: SortableColumn) {
    setSortConfig((prev) => {
      if (prev.column === column) {
        return { column, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { column, direction: "asc" };
    });
  }

  function getSortIcon(column: SortableColumn) {
    if (sortConfig.column !== column) {
      return <ChevronsUpDown className="ml-1 inline size-4" />;
    }
    if (sortConfig.direction === "asc") {
      return <ChevronUp className="ml-1 inline size-4" />;
    }
    return <ChevronDown className="ml-1 inline size-4" />;
  }

  const filteredAndSorted = useMemo(() => {
    const filtered = adminCustomers.filter((c) => c.type === activeTab);
    return [...filtered].sort((a, b) => {
      const col = sortConfig.column;
      const aVal = a[col];
      const bVal = b[col];
      const dir = sortConfig.direction === "asc" ? 1 : -1;
      if (typeof aVal === "string" && typeof bVal === "string") {
        return aVal.localeCompare(bVal, "vi") * dir;
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * dir;
      }
      return 0;
    });
  }, [activeTab, sortConfig]);

  const sortableTh = (
    label: string,
    column: SortableColumn,
    align?: "right",
  ) => (
    <th
      className={cn(
        "cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold text-muted-foreground hover:text-foreground",
        align === "right" && "text-right",
      )}
      onClick={() => handleSort(column)}
    >
      {label}
      {getSortIcon(column)}
    </th>
  );

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Khách hàng</h1>

      {/* Tab bar */}
      <div className="mb-4 flex gap-2" role="tablist">
        {tabs.map((tab) => (
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
              {sortableTh("Tên công ty", "companyName")}
              {sortableTh("Liên hệ", "contactName")}
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                Điện thoại
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                Loại
              </th>
              {sortableTh("Đơn hàng", "totalOrders")}
              {sortableTh("Công nợ", "outstandingDebt")}
              {sortableTh("Hạn mức", "creditLimit")}
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8">
                  <p className="text-center text-muted-foreground">
                    Không có khách hàng trong phân khúc này
                  </p>
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3">{customer.companyName}</td>
                  <td className="px-4 py-3">{customer.contactName}</td>
                  <td className="px-4 py-3">{customer.phone}</td>
                  <td className="px-4 py-3">
                    {customer.type === "retail"
                      ? "Bán lẻ"
                      : customer.type === "dealer"
                        ? "Đại lý"
                        : "Dự án"}
                  </td>
                  <td className="px-4 py-3">{customer.totalOrders}</td>
                  <td className="px-4 py-3">
                    {formatVND(customer.outstandingDebt)}
                  </td>
                  <td className="px-4 py-3">
                    {formatVND(customer.creditLimit)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{MOCK_DATA_DISCLAIMER}</p>
    </div>
  );
}
