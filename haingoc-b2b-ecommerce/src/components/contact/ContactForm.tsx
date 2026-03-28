"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất!");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-muted-foreground mb-4 text-sm">
        Các trường có dấu * là bắt buộc
      </p>

      <div>
        <label className="mb-2 block text-sm font-semibold">Họ và tên *</label>
        <Input
          type="text"
          placeholder="Ví dụ: Nguyễn Văn A"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">
          Số điện thoại *
        </label>
        <Input
          type="tel"
          placeholder="Ví dụ: 0901234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">Email *</label>
        <Input
          type="email"
          placeholder="Ví dụ: contact@congty.vn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">Tên công ty</label>
        <Input
          type="text"
          placeholder="Ví dụ: Công ty TNHH Cơ khí ABC"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">Nội dung *</label>
        <Textarea
          placeholder="Mô tả yêu cầu hoặc câu hỏi của bạn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full">
        Gửi
      </Button>
    </form>
  );
}
