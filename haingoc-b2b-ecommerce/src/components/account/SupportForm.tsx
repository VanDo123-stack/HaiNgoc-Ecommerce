"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const SUBJECT_OPTIONS = ["Trả hàng", "Đổi hàng", "Khiếu nại", "Khác"];

export function SupportForm() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!subject) {
      toast("Vui lòng chọn chủ đề");
      return;
    }
    toast(
      "Yêu cầu đã được gửi. Chúng tôi sẽ liên hệ trong 1-2 ngày làm việc.",
    );
    setSubject("");
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium">Chủ đề</label>
        <Select value={subject} onValueChange={(v) => setSubject(v ?? "")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn chủ đề..." />
          </SelectTrigger>
          <SelectContent>
            {SUBJECT_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="message">
          Nội dung
        </label>
        <Textarea
          id="message"
          placeholder="Mô tả chi tiết yêu cầu của bạn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
        />
      </div>
      <Button type="submit" className="w-full">
        Gửi yêu cầu
      </Button>
    </form>
  );
}
