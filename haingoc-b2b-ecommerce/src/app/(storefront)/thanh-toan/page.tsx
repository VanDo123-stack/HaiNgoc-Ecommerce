"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { useCart } from "~/context/CartContext";
import { products } from "~/data/products";
import { cn } from "~/lib/utils";

interface CheckoutForm {
  companyName: string;
  taxCode: string;
  businessAddress: string;
  recipientName: string;
  phone: string;
  deliveryOption: "deliver" | "pickup";
  deliveryAddress: string;
  notes: string;
  paymentMethod: "bank" | "credit" | "cod";
}

function validateForm(f: CheckoutForm): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!f.companyName.trim()) errors.companyName = "Vui lòng nhập tên công ty";
  if (!f.taxCode.trim() || !/^\d{10}(-\d{3})?$/.test(f.taxCode.trim()))
    errors.taxCode = "MST không hợp lệ (10 hoặc 13 chữ số)";
  if (!f.recipientName.trim()) errors.recipientName = "Vui lòng nhập tên người nhận";
  if (!f.phone.trim() || !/^(0|\+84)[0-9]{8,9}$/.test(f.phone.trim()))
    errors.phone = "Số điện thoại không hợp lệ";
  if (f.deliveryOption === "deliver" && !f.deliveryAddress.trim())
    errors.deliveryAddress = "Vui lòng nhập địa chỉ giao hàng";
  return errors;
}

export default function ThanhToanPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();

  const [form, setForm] = useState<CheckoutForm>({
    companyName: "Công ty TNHH Cơ Khí Đông Nam",
    taxCode: "0312456789",
    businessAddress: "Lô C12, 172 Nguyễn Tri Phương, P.7, TP. Vũng Tàu",
    recipientName: "Nguyễn Văn Anh",
    phone: "0901234567",
    deliveryOption: "deliver",
    deliveryAddress: "Số 45 Nguyễn Trãi, P.3, Q.5, TP.HCM",
    notes: "Giao trước 8h sáng, yêu cầu CO/CQ đính kèm",
    paymentMethod: "bank",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // Compute order summary
  const cartProducts = items.map((item) => {
    const product = products.find((p) => p.slug === item.slug);
    return { ...item, product };
  });

  const pricedItems = cartProducts.filter((i) => i.product?.price != null);
  const contactItems = cartProducts.filter((i) => i.product?.price == null);
  const subtotal = pricedItems.reduce(
    (sum, i) => sum + (i.product?.salePrice ?? i.product?.price ?? 0) * i.quantity,
    0,
  );
  const hasContactItems = contactItems.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const ref = "HN-" + new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const orderSnapshot = {
      items,
      checkout: {
        companyName: form.companyName,
        taxCode: form.taxCode,
        businessAddress: form.businessAddress,
        recipientName: form.recipientName,
        phone: form.phone,
        deliveryOption: form.deliveryOption,
        deliveryAddress: form.deliveryAddress,
        notes: form.notes,
        paymentMethod: form.paymentMethod,
      },
      ref,
      date: new Date().toISOString().slice(0, 10),
    };
    localStorage.setItem("haingoc_order", JSON.stringify(orderSnapshot));
    clearCart();
    router.push("/xac-nhan");
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Giỏ hàng trống</h1>
        <p className="mt-2 text-muted-foreground">Vui lòng thêm sản phẩm trước khi thanh toán.</p>
        <Link href="/san-pham" className="mt-4 inline-block text-primary hover:underline">
          Xem sản phẩm
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/gio-hang">Giỏ hàng</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Thanh toán</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mb-6 text-2xl font-semibold">Thanh toán</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* LEFT COLUMN — Customer Data */}
          <div className="space-y-6 lg:col-span-2">
            {/* Section A1: Company Info */}
            <div className="rounded-lg border border-border p-6">
              <h2 className="mb-4 text-lg font-semibold">Thông tin công ty (xuất hóa đơn VAT)</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="mb-1 block text-sm font-medium">
                    Tên công ty <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Ví dụ: Công ty TNHH Cơ khí ABC"
                    value={form.companyName}
                    onChange={handleChange}
                    className={errors.companyName ? "border-destructive" : ""}
                  />
                  {errors.companyName && <p className="mt-1 text-sm text-destructive">{errors.companyName}</p>}
                </div>
                <div>
                  <label htmlFor="taxCode" className="mb-1 block text-sm font-medium">
                    Mã số thuế (MST) <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="taxCode"
                    name="taxCode"
                    placeholder="0123456789"
                    value={form.taxCode}
                    onChange={handleChange}
                    className={errors.taxCode ? "border-destructive" : ""}
                  />
                  {errors.taxCode && <p className="mt-1 text-sm text-destructive">{errors.taxCode}</p>}
                </div>
                <div>
                  <label htmlFor="businessAddress" className="mb-1 block text-sm font-medium">
                    Địa chỉ đăng ký kinh doanh
                  </label>
                  <Input
                    id="businessAddress"
                    name="businessAddress"
                    placeholder="Địa chỉ trên giấy phép kinh doanh"
                    value={form.businessAddress}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Section A2: Delivery Info */}
            <div className="rounded-lg border border-border p-6">
              <h2 className="mb-4 text-lg font-semibold">Thông tin giao hàng</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="recipientName" className="mb-1 block text-sm font-medium">
                    Người nhận <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="recipientName"
                    name="recipientName"
                    placeholder="Họ và tên người nhận hàng"
                    value={form.recipientName}
                    onChange={handleChange}
                    className={errors.recipientName ? "border-destructive" : ""}
                  />
                  {errors.recipientName && <p className="mt-1 text-sm text-destructive">{errors.recipientName}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1 block text-sm font-medium">
                    Số điện thoại <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="0901234567"
                    value={form.phone}
                    onChange={handleChange}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone}</p>}
                </div>

                {/* Delivery option */}
                <div>
                  <label className="mb-2 block text-sm font-medium">Hình thức nhận hàng</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, deliveryOption: "deliver" }))}
                      className={cn(
                        "flex-1 rounded-lg border p-3 text-sm transition-colors",
                        form.deliveryOption === "deliver"
                          ? "border-primary bg-primary/5 ring-2 ring-primary"
                          : "border-border hover:bg-muted/30",
                      )}
                    >
                      <p className="font-medium">Giao hàng tận nơi</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Giao đến công trình hoặc kho</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, deliveryOption: "pickup", deliveryAddress: "" }))}
                      className={cn(
                        "flex-1 rounded-lg border p-3 text-sm transition-colors",
                        form.deliveryOption === "pickup"
                          ? "border-primary bg-primary/5 ring-2 ring-primary"
                          : "border-border hover:bg-muted/30",
                      )}
                    >
                      <p className="font-medium">Nhận tại kho Hải Ngọc</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">172 Nguyễn Tri Phương, P.7, TP. Vũng Tàu</p>
                    </button>
                  </div>
                </div>

                {form.deliveryOption === "deliver" && (
                  <div>
                    <label htmlFor="deliveryAddress" className="mb-1 block text-sm font-medium">
                      Địa chỉ giao hàng <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="deliveryAddress"
                      name="deliveryAddress"
                      placeholder="Số nhà, đường, phường, quận, tỉnh/thành"
                      value={form.deliveryAddress}
                      onChange={handleChange}
                      className={errors.deliveryAddress ? "border-destructive" : ""}
                    />
                    {errors.deliveryAddress && <p className="mt-1 text-sm text-destructive">{errors.deliveryAddress}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Section A3: Notes */}
            <div className="rounded-lg border border-border p-6">
              <h2 className="mb-4 text-lg font-semibold">Ghi chú đặc biệt</h2>
              <Textarea
                name="notes"
                placeholder="Ví dụ: cắt thép theo bản vẽ, giao trước 8h sáng, yêu cầu CO/CQ..."
                value={form.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          {/* RIGHT COLUMN — Order Summary & Payment */}
          <div className="space-y-6 lg:col-span-1">
            {/* Order Summary */}
            <div className="rounded-lg border border-border p-6">
              <h2 className="mb-4 text-lg font-semibold">Đơn hàng của bạn</h2>

              <div className="max-h-60 space-y-3 overflow-y-auto">
                {cartProducts.map(({ slug, quantity, product }) => (
                  <div key={slug} className="flex items-start justify-between gap-2 text-sm">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{product?.name ?? slug}</p>
                      <p className="text-xs text-muted-foreground">x{quantity}</p>
                    </div>
                    <span className="shrink-0 text-right">
                      {product?.price != null
                        ? `${((product.salePrice ?? product.price) * quantity).toLocaleString("vi-VN")} đ`
                        : "Liên hệ"}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span className="font-medium">{subtotal.toLocaleString("vi-VN")} đ</span>
                </div>
                {hasContactItems && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sản phẩm liên hệ</span>
                    <span className="text-xs">{contactItems.length} SP — báo giá sau</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vận chuyển</span>
                  <span className="text-xs">Thông báo sau</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Tổng cộng</span>
                <span className="text-red-600">{subtotal.toLocaleString("vi-VN")} đ</span>
              </div>
              {hasContactItems && (
                <p className="mt-1 text-xs text-muted-foreground">
                  + sản phẩm liên hệ sẽ được báo giá riêng
                </p>
              )}
            </div>

            {/* Payment Methods */}
            <div className="rounded-lg border border-border p-6">
              <h2 className="mb-4 text-lg font-semibold">Phương thức thanh toán</h2>
              <div className="space-y-3">
                {/* Bank transfer */}
                <div
                  onClick={() => setForm((prev) => ({ ...prev, paymentMethod: "bank" }))}
                  className={cn(
                    "cursor-pointer rounded-lg border p-4 transition-colors",
                    form.paymentMethod === "bank" ? "border-primary ring-2 ring-primary" : "border-border",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("h-4 w-4 rounded-full border-2", form.paymentMethod === "bank" ? "border-primary bg-primary" : "border-muted-foreground")} />
                    <span className="text-sm font-medium">Chuyển khoản ngân hàng</span>
                  </div>
                  {form.paymentMethod === "bank" && (
                    <div className="mt-3 border-t border-border pt-3 text-sm">
                      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
                        <span className="text-muted-foreground">Ngân hàng</span>
                        <span className="font-medium">Vietcombank</span>
                        <span className="text-muted-foreground">Số TK</span>
                        <span className="font-medium">1234567890</span>
                        <span className="text-muted-foreground">Chủ TK</span>
                        <span className="font-medium">CONG TY TNHH HAI NGOC</span>
                        <span className="text-muted-foreground">Chi nhánh</span>
                        <span className="font-medium">TP. Hồ Chí Minh</span>
                      </div>
                      <div className="mt-4 flex flex-col items-center gap-2 rounded-md border border-border bg-white p-3">
                        <img
                          src={`https://img.vietqr.io/image/VCB-1234567890-compact.png?amount=${subtotal}&addInfo=Thanh+toan+don+hang+Hai+Ngoc&accountName=CONG+TY+TNHH+HAI+NGOC`}
                          alt="QR chuyển khoản"
                          className="h-40 w-40"
                        />
                        <p className="text-center text-xs text-muted-foreground">
                          Quét mã QR để chuyển khoản nhanh
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Deferred credit */}
                <div
                  onClick={() => setForm((prev) => ({ ...prev, paymentMethod: "credit" }))}
                  className={cn(
                    "cursor-pointer rounded-lg border p-4 transition-colors",
                    form.paymentMethod === "credit" ? "border-primary ring-2 ring-primary" : "border-border",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("h-4 w-4 rounded-full border-2", form.paymentMethod === "credit" ? "border-primary bg-primary" : "border-muted-foreground")} />
                    <div>
                      <p className="text-sm font-medium">Thanh toán trả chậm</p>
                      <p className="text-xs text-muted-foreground">Dành cho khách hàng có hợp đồng khung</p>
                    </div>
                  </div>
                </div>

                {/* COD */}
                <div
                  onClick={() => setForm((prev) => ({ ...prev, paymentMethod: "cod" }))}
                  className={cn(
                    "cursor-pointer rounded-lg border p-4 transition-colors",
                    form.paymentMethod === "cod" ? "border-primary ring-2 ring-primary" : "border-border",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("h-4 w-4 rounded-full border-2", form.paymentMethod === "cod" ? "border-primary bg-primary" : "border-muted-foreground")} />
                    <div>
                      <p className="text-sm font-medium">Thanh toán khi nhận hàng (COD)</p>
                      <p className="text-xs text-muted-foreground">Đơn hàng dưới 10 triệu</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full bg-blue-800 hover:bg-blue-700" size="lg">
              {hasContactItems ? "Gửi yêu cầu báo giá chính thức" : "Xác nhận đặt hàng"}
            </Button>

            <Link
              href="/gio-hang"
              className="block text-center text-sm text-muted-foreground hover:text-foreground"
            >
              ← Quay lại giỏ hàng
            </Link>
          </div>
        </div>
      </form>
    </main>
  );
}
