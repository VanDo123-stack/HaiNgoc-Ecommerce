"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { useCart } from "~/context/CartContext";
import { cn } from "~/lib/utils";

// 1. Types

interface FormFields {
  companyName: string;
  taxCode: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  vatAddress: string;
}

// 2. Validation helpers

function validateForm(fields: FormFields): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!fields.companyName || fields.companyName.trim().length < 2) {
    errors.companyName = "Vui lòng nhập tên công ty";
  }

  if (fields.taxCode && !/^\d{10}(-\d{3})?$/.test(fields.taxCode.trim())) {
    errors.taxCode = "Mã số thuế không hợp lệ (10 chữ số)";
  }

  if (!fields.phone || !/^(0|\+84)[0-9]{8,9}$/.test(fields.phone.trim())) {
    errors.phone = "Vui lòng nhập số điện thoại hợp lệ";
  }

  if (
    !fields.email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())
  ) {
    errors.email = "Vui lòng nhập email hợp lệ";
  }

  return errors;
}

// 3. Component

export function QuotationForm() {
  const router = useRouter();
  const { items, clearCart } = useCart();

  const [fields, setFields] = useState<FormFields>({
    companyName: "",
    taxCode: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    vatAddress: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showVat, setShowVat] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "credit" | "cod">("bank");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationErrors = validateForm(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear errors and save order snapshot
    setErrors({});

    const ref = "HN-" + new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const date = new Date().toISOString().slice(0, 10);

    const orderSnapshot = {
      items,
      contact: {
        companyName: fields.companyName,
        taxCode: fields.taxCode,
        phone: fields.phone,
        email: fields.email,
        address: fields.address,
        notes: fields.notes,
      },
      ref,
      date,
    };

    localStorage.setItem("haingoc_order", JSON.stringify(orderSnapshot));

    clearCart();
    router.push("/xac-nhan");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Các trường có dấu <span className="text-destructive">*</span> là bắt
        buộc
      </p>

      {/* Company info section */}
      <div className="space-y-4">
        {/* Company name */}
        <div>
          <label
            htmlFor="companyName"
            className="mb-1 block text-sm font-normal leading-snug"
          >
            Tên công ty <span className="text-destructive">*</span>
          </label>
          <Input
            id="companyName"
            name="companyName"
            type="text"
            placeholder="Ví dụ: Công ty TNHH Cơ khí ABC"
            value={fields.companyName}
            onChange={handleChange}
            className={errors.companyName ? "border-destructive" : ""}
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-destructive">
              {errors.companyName}
            </p>
          )}
        </div>

        {/* Tax code */}
        <div>
          <label
            htmlFor="taxCode"
            className="mb-1 block text-sm font-normal leading-snug"
          >
            Mã số thuế
          </label>
          <Input
            id="taxCode"
            name="taxCode"
            type="text"
            placeholder="Ví dụ: 0123456789"
            value={fields.taxCode}
            onChange={handleChange}
            className={errors.taxCode ? "border-destructive" : ""}
          />
          {errors.taxCode && (
            <p className="mt-1 text-sm text-destructive">{errors.taxCode}</p>
          )}
        </div>
      </div>

      <Separator className="my-6" />

      {/* VAT Invoice section — per D-04 */}
      <div className="space-y-4">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={showVat}
            onChange={(e) => {
              setShowVat(e.target.checked);
              if (!e.target.checked) {
                setFields((prev) => ({ ...prev, vatAddress: "" }));
              }
            }}
            className="h-4 w-4 accent-primary"
          />
          <span className="text-sm font-medium">Xuất hóa đơn VAT</span>
        </label>

        {showVat && (
          <div className="mt-4 space-y-4 rounded-lg border border-border bg-muted/30 p-4">
            {/* VAT Company Name — pre-filled from companyName */}
            <div>
              <label htmlFor="vatCompanyName" className="mb-1 block text-sm font-normal leading-snug">
                Tên công ty
              </label>
              <Input
                id="vatCompanyName"
                type="text"
                value={fields.companyName}
                readOnly
                className="bg-muted"
              />
              <p className="mt-1 text-xs text-muted-foreground">Tự động lấy từ thông tin công ty</p>
            </div>

            {/* VAT Tax ID — pre-filled from taxCode */}
            <div>
              <label htmlFor="vatTaxCode" className="mb-1 block text-sm font-normal leading-snug">
                Mã số thuế
              </label>
              <Input
                id="vatTaxCode"
                type="text"
                value={fields.taxCode}
                readOnly
                className="bg-muted"
              />
              <p className="mt-1 text-xs text-muted-foreground">Tự động lấy từ mã số thuế</p>
            </div>

            {/* VAT Registered Address — new editable field */}
            <div>
              <label htmlFor="vatAddress" className="mb-1 block text-sm font-normal leading-snug">
                Địa chỉ đăng ký kinh doanh
              </label>
              <Input
                id="vatAddress"
                name="vatAddress"
                type="text"
                placeholder="Địa chỉ trên giấy phép kinh doanh"
                value={fields.vatAddress}
                onChange={handleChange}
              />
            </div>
          </div>
        )}
      </div>

      <Separator className="my-6" />

      {/* Contact info section */}
      <div className="space-y-4">
        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="mb-1 block text-sm font-normal leading-snug"
          >
            Số điện thoại <span className="text-destructive">*</span>
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Ví dụ: 0901234567"
            value={fields.phone}
            onChange={handleChange}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-destructive">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-normal leading-snug"
          >
            Email <span className="text-destructive">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Ví dụ: contact@congty.vn"
            value={fields.email}
            onChange={handleChange}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive">{errors.email}</p>
          )}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Delivery address section */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="address"
            className="mb-1 block text-sm font-normal leading-snug"
          >
            Địa chỉ giao hàng
          </label>
          <Input
            id="address"
            name="address"
            type="text"
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
            value={fields.address}
            onChange={handleChange}
          />
        </div>
      </div>

      <Separator className="my-6" />

      {/* Notes section */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="notes"
            className="mb-1 block text-sm font-normal leading-snug"
          >
            Ghi chú
          </label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Yêu cầu đặc biệt, thời gian giao hàng mong muốn, v.v."
            value={fields.notes}
            onChange={handleChange}
          />
        </div>
      </div>

      <Separator className="my-6" />

      {/* Payment Methods — per D-05, D-06 */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Phương thức thanh toán</h3>

        {/* Bank transfer — default selected */}
        <div
          onClick={() => setPaymentMethod("bank")}
          className={cn(
            "cursor-pointer rounded-lg border p-4 transition-colors",
            paymentMethod === "bank" ? "border-primary ring-2 ring-primary" : "border-border"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-4 w-4 rounded-full border-2",
              paymentMethod === "bank" ? "border-primary bg-primary" : "border-muted-foreground"
            )} />
            <span className="font-medium">Chuyển khoản ngân hàng</span>
          </div>
          {paymentMethod === "bank" && (
            <div className="mt-3 border-t border-border pt-3">
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <span className="text-muted-foreground">Ngân hàng</span>
                <span className="font-medium">Vietcombank</span>
                <span className="text-muted-foreground">Số tài khoản</span>
                <span className="font-medium">1234567890</span>
                <span className="text-muted-foreground">Chủ tài khoản</span>
                <span className="font-medium">CONG TY TNHH HAI NGOC</span>
                <span className="text-muted-foreground">Chi nhánh</span>
                <span className="font-medium">Chi nhánh TP. Hồ Chí Minh</span>
              </div>
            </div>
          )}
        </div>

        {/* Deferred credit */}
        <div
          onClick={() => setPaymentMethod("credit")}
          className={cn(
            "cursor-pointer rounded-lg border p-4 transition-colors",
            paymentMethod === "credit" ? "border-primary ring-2 ring-primary" : "border-border"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-4 w-4 rounded-full border-2",
              paymentMethod === "credit" ? "border-primary bg-primary" : "border-muted-foreground"
            )} />
            <div>
              <span className="font-medium">Thanh toán trả chậm</span>
              <p className="text-sm text-muted-foreground">Dành cho khách hàng thân thiết</p>
            </div>
          </div>
        </div>

        {/* COD */}
        <div
          onClick={() => setPaymentMethod("cod")}
          className={cn(
            "cursor-pointer rounded-lg border p-4 transition-colors",
            paymentMethod === "cod" ? "border-primary ring-2 ring-primary" : "border-border"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-4 w-4 rounded-full border-2",
              paymentMethod === "cod" ? "border-primary bg-primary" : "border-muted-foreground"
            )} />
            <div>
              <span className="font-medium">Thanh toán khi nhận hàng</span>
              <p className="text-sm text-muted-foreground">Áp dụng cho đơn hàng dưới 10 triệu</p>
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg">
        Gửi yêu cầu báo giá
      </Button>
    </form>
  );
}
