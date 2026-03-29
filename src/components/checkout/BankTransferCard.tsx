import { Building2 } from "lucide-react";

// 1. Props

interface BankTransferCardProps {
  orderRef?: string;
  amount?: number;
}

// 2. Component

export function BankTransferCard({ orderRef, amount }: BankTransferCardProps) {
  const qrUrl = `https://img.vietqr.io/image/VCB-1234567890-compact.png?amount=${amount ?? 0}&addInfo=${encodeURIComponent(`Bao gia ${orderRef ?? ""}`)}&accountName=${encodeURIComponent("CONG TY TNHH HAI NGOC")}`;

  return (
    <div className="rounded-lg border border-border bg-secondary p-6">
      {/* Heading */}
      <div className="mb-3 flex items-center gap-2">
        <Building2 size={20} />
        <h2 className="text-xl font-semibold">Thông tin chuyển khoản</h2>
      </div>

      {/* Transfer note */}
      <p className="mb-4 text-sm text-muted-foreground">
        Nếu muốn đặt cọc trước, vui lòng chuyển khoản theo thông tin dưới đây
        và ghi rõ mã yêu cầu trong nội dung chuyển khoản.
      </p>

      {/* Bank details grid */}
      <div className="mb-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <span className="font-normal text-muted-foreground">Ngân hàng</span>
        <span className="font-medium">Vietcombank</span>

        <span className="font-normal text-muted-foreground">Số tài khoản</span>
        <span className="font-medium">1234567890</span>

        <span className="font-normal text-muted-foreground">Chủ tài khoản</span>
        <span className="font-medium">CÔNG TY TNHH HẢI NGỌC</span>

        <span className="font-normal text-muted-foreground">Chi nhánh</span>
        <span className="font-medium">Chi nhánh TP. Hồ Chí Minh</span>
      </div>

      {/* Transfer content template */}
      {orderRef && (
        <div className="rounded bg-muted px-3 py-2 font-mono text-sm">
          Nội dung chuyển khoản:{" "}
          <span className="font-semibold">Bao gia {orderRef}</span>
        </div>
      )}

      {/* VietQR Code */}
      <div className="mt-4 flex flex-col items-center gap-2 rounded-md border border-border bg-white p-4">
        <img
          src={qrUrl}
          alt="QR chuyển khoản"
          className="h-48 w-48"
        />
        <p className="text-center text-xs text-muted-foreground">
          Quét mã QR để chuyển khoản nhanh qua ứng dụng ngân hàng
        </p>
      </div>
    </div>
  );
}
