"use client";

import { Badge } from "~/components/ui/badge";
import { formatVND } from "~/lib/format";
import { mockCustomerDebt, STOREFRONT_MOCK_DISCLAIMER } from "~/data/account";

export function DebtTrackingCard() {
  const { creditLimit, outstandingDebt, invoices } = mockCustomerDebt;
  const debtPercent = Math.min(
    100,
    Math.round((outstandingDebt / creditLimit) * 100),
  );
  const barColor =
    debtPercent < 50
      ? "bg-green-500"
      : debtPercent < 80
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <div className="bg-card border-border rounded-lg border p-4">
      {/* Heading with disclaimer badge */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Hạn mức tín dụng</h3>
        <Badge variant="outline">{STOREFRONT_MOCK_DISCLAIMER}</Badge>
      </div>

      {/* Three stats */}
      <div className="mb-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-muted-foreground text-xs">Hạn mức</p>
          <p className="text-sm font-semibold">{formatVND(creditLimit)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Dư nợ</p>
          <p className="text-sm font-semibold">{formatVND(outstandingDebt)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Còn lại</p>
          <p className="text-sm font-semibold">
            {formatVND(creditLimit - outstandingDebt)}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-1 h-2 w-full rounded-full bg-muted">
        <div
          className={`h-2 rounded-full ${barColor}`}
          style={{ width: `${debtPercent}%` }}
        />
      </div>
      <p className="text-muted-foreground mb-4 text-sm">{debtPercent}%</p>

      {/* Invoice table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border border-b">
              <th className="pb-2 text-left font-medium">Mã hóa đơn</th>
              <th className="pb-2 text-left font-medium">Ngày</th>
              <th className="pb-2 text-right font-medium">Số tiền</th>
              <th className="pb-2 text-right font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-border border-b last:border-0">
                <td className="py-2">{invoice.id}</td>
                <td className="text-muted-foreground py-2">{invoice.date}</td>
                <td className="py-2 text-right">{formatVND(invoice.amount)}</td>
                <td className="py-2 text-right">{invoice.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
