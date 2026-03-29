"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { type mockProfile } from "~/data/account";

export function ProfileForm({
  defaultProfile,
}: {
  defaultProfile: typeof mockProfile;
}) {
  const [name, setName] = useState(defaultProfile.name);
  const [phone, setPhone] = useState(defaultProfile.phone);
  const [email, setEmail] = useState(defaultProfile.email);
  const [company, setCompany] = useState(defaultProfile.company);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Họ và tên</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nguyễn Văn A"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Số điện thoại</label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0901 234 567"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Email</label>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nguyenvana@example.com"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Tên công ty</label>
        <Input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Công ty TNHH Cơ Khí ABC"
        />
      </div>
      <Button
        variant="outline"
        onClick={() => toast.success("Đã lưu thay đổi!")}
      >
        Lưu thay đổi
      </Button>
      <p className="mt-2 text-sm text-muted-foreground">
        Thông tin chỉ lưu tạm thời trong phiên này
      </p>
    </div>
  );
}
