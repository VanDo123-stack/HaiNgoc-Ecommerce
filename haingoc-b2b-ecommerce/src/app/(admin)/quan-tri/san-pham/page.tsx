"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, AlertTriangle, Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { products as staticProducts } from "~/data/products";
import { categories } from "~/data/categories";
import { adminInventory } from "~/data/admin/inventory";
import { type Product } from "~/types/product";
import { type InventoryItem } from "~/types/admin";
import { formatVND } from "~/lib/format";
import { cn } from "~/lib/utils";

type SortConfig = {
  column: string;
  direction: "asc" | "desc";
};

type ActiveTab = "san-pham" | "ton-kho";

const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

function SortIcon({ column, sortConfig }: { column: string; sortConfig: SortConfig }) {
  if (sortConfig.column !== column) {
    return <ChevronsUpDown className="ml-1 inline size-4 text-muted-foreground" />;
  }
  if (sortConfig.direction === "asc") {
    return <ChevronUp className="ml-1 inline size-4 text-primary" />;
  }
  return <ChevronDown className="ml-1 inline size-4 text-primary" />;
}

type FormProduct = {
  name: string;
  categorySlug: string;
  price: string;
  originalPrice: string;
  status: "in-stock" | "out-of-stock";
  standardType: string;
};

const emptyForm: FormProduct = {
  name: "",
  categorySlug: categories[0]?.slug ?? "",
  price: "",
  originalPrice: "",
  status: "in-stock",
  standardType: "",
};

export default function SanPhamPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("san-pham");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: "name",
    direction: "asc",
  });
  const [productList, setProductList] = useState<Product[]>([...staticProducts]);
  const [showModal, setShowModal] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<FormProduct>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  function handleSort(column: string) {
    setSortConfig((prev) => {
      if (prev.column === column) {
        return { column, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { column, direction: "asc" };
    });
    setCurrentPage(1);
  }

  function handleTabChange(tab: ActiveTab) {
    setActiveTab(tab);
    setSortConfig({ column: "name", direction: "asc" });
    setCurrentPage(1);
  }

  function openAdd() {
    setEditingSlug(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(product: Product) {
    setEditingSlug(product.slug);
    setForm({
      name: product.name,
      categorySlug: product.categorySlug,
      price: product.price?.toString() ?? "",
      originalPrice: product.originalPrice?.toString() ?? "",
      status: product.status,
      standardType: product.standardType ?? "",
    });
    setShowModal(true);
  }

  function handleSave() {
    if (!form.name.trim()) return;
    const price = form.price ? Number(form.price) : null;
    const originalPrice = form.originalPrice ? Number(form.originalPrice) : null;
    const discountPercent = price && originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined;

    if (editingSlug) {
      setProductList((prev) =>
        prev.map((p) =>
          p.slug === editingSlug
            ? {
                ...p,
                name: form.name,
                categorySlug: form.categorySlug,
                price,
                originalPrice,
                salePrice: discountPercent ? price : undefined,
                discountPercent,
                status: form.status,
                standardType: form.standardType as Product["standardType"],
              }
            : p,
        ),
      );
    } else {
      const slug = form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const newProduct: Product = {
        id: slug,
        slug,
        name: form.name,
        categorySlug: form.categorySlug,
        material: "",
        origin: "",
        standard: "",
        description: "",
        image: "/images/products/placeholder-1.svg",
        status: form.status,
        price,
        originalPrice,
        salePrice: discountPercent ? price : undefined,
        discountPercent,
        standardType: form.standardType as Product["standardType"],
      };
      setProductList((prev) => [...prev, newProduct]);
    }
    setShowModal(false);
  }

  function handleDelete(slug: string) {
    setProductList((prev) => prev.filter((p) => p.slug !== slug));
    setDeleteConfirm(null);
  }

  const sortedProducts = useMemo(() => {
    const sorted = [...productList];
    sorted.sort((a: Product, b: Product) => {
      let aVal: string | number = "";
      let bVal: string | number = "";

      if (sortConfig.column === "name") {
        aVal = a.name;
        bVal = b.name;
      } else if (sortConfig.column === "category") {
        aVal = categoryMap[a.categorySlug] ?? a.categorySlug;
        bVal = categoryMap[b.categorySlug] ?? b.categorySlug;
      } else if (sortConfig.column === "price") {
        aVal = a.salePrice ?? a.price ?? 0;
        bVal = b.salePrice ?? b.price ?? 0;
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        const cmp = aVal.localeCompare(bVal, "vi");
        return sortConfig.direction === "asc" ? cmp : -cmp;
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
    return sorted;
  }, [sortConfig, productList]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sản phẩm</h1>
        {activeTab === "san-pham" && (
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Thêm sản phẩm
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          role="tab"
          aria-selected={activeTab === "san-pham"}
          onClick={() => handleTabChange("san-pham")}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-colors",
            activeTab === "san-pham"
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground",
          )}
        >
          Sản phẩm ({productList.length})
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "ton-kho"}
          onClick={() => handleTabChange("ton-kho")}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-colors",
            activeTab === "ton-kho"
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground",
          )}
        >
          Tồn kho
        </button>
      </div>

      {/* Product Tab */}
      {activeTab === "san-pham" && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th
                  className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold text-muted-foreground hover:text-foreground"
                  onClick={() => handleSort("name")}
                >
                  Tên sản phẩm
                  <SortIcon column="name" sortConfig={sortConfig} />
                </th>
                <th
                  className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold text-muted-foreground hover:text-foreground"
                  onClick={() => handleSort("category")}
                >
                  Danh mục
                  <SortIcon column="category" sortConfig={sortConfig} />
                </th>
                <th
                  className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold text-muted-foreground hover:text-foreground"
                  onClick={() => handleSort("price")}
                >
                  Giá bán
                  <SortIcon column="price" sortConfig={sortConfig} />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Không có sản phẩm
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product: Product) => {
                  const displayPrice = product.salePrice ?? product.price;
                  return (
                    <tr
                      key={product.slug}
                      className="border-b border-border last:border-0 hover:bg-muted/30"
                    >
                      <td className="max-w-xs truncate px-4 py-3 font-medium">{product.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {categoryMap[product.categorySlug] ?? product.categorySlug}
                      </td>
                      <td className="px-4 py-3">{formatVND(displayPrice)}</td>
                      <td className="px-4 py-3">
                        {product.status === "in-stock" ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                            Còn hàng
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                            Hết hàng
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(product)}
                            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            title="Sửa"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          {deleteConfirm === product.slug ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(product.slug)}
                                className="rounded bg-destructive px-2 py-1 text-xs text-destructive-foreground"
                              >
                                Xóa
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                              >
                                Hủy
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(product.slug)}
                              className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                              title="Xóa"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <span className="text-sm text-muted-foreground">
                Hiển thị {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, sortedProducts.length)} / {sortedProducts.length} sản phẩm
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
      )}

      {/* Inventory Tab */}
      {activeTab === "ton-kho" && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Sản phẩm</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Tồn kho</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Mức đặt lại</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Đơn vị</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Nhập kho cuối</th>
              </tr>
            </thead>
            <tbody>
              {adminInventory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Không có dữ liệu tồn kho
                  </td>
                </tr>
              ) : (
                adminInventory.map((item: InventoryItem) => {
                  const isLowStock = item.currentStock < item.reorderLevel;
                  return (
                    <tr
                      key={item.productSlug}
                      className={cn(
                        "border-b border-border last:border-0 hover:bg-muted/30",
                        isLowStock && "bg-red-50",
                      )}
                    >
                      <td className="px-4 py-3 font-medium">
                        {isLowStock && <AlertTriangle className="mr-1 inline size-4 text-destructive" />}
                        {item.productName}
                      </td>
                      <td className={cn("px-4 py-3", isLowStock && "font-semibold text-destructive")}>
                        {item.currentStock}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{item.reorderLevel}</td>
                      <td className="px-4 py-3 text-muted-foreground">{item.unit}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(item.lastRestocked).toLocaleDateString("vi-VN")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editingSlug ? "Sửa sản phẩm" : "Thêm sản phẩm"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Tên sản phẩm *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Danh mục</label>
                <select
                  value={form.categorySlug}
                  onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Giá bán (VNĐ)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Giá gốc (VNĐ)</label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Trạng thái</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "in-stock" | "out-of-stock" })}
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="in-stock">Còn hàng</option>
                  <option value="out-of-stock">Hết hàng</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Tiêu chuẩn</label>
                <input
                  value={form.standardType}
                  onChange={(e) => setForm({ ...form, standardType: e.target.value })}
                  placeholder="VD: AWS, JIS, DIN..."
                  className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-md px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim()}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {editingSlug ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
