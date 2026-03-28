import { type MockOrder } from "~/data/account";
import { Badge } from "~/components/ui/badge";

export function QuotationHistory({ quotations }: { quotations: MockOrder[] }) {
  if (quotations.length === 0) {
    return (
      <p className="py-4 text-sm text-muted-foreground">
        Chưa có yêu cầu báo giá nào
      </p>
    );
  }

  return (
    <div>
      {quotations.map((quotation) => (
        <div
          key={quotation.id}
          className="flex items-start justify-between border-b border-border py-4"
        >
          <div>
            <p className="text-sm font-semibold">{quotation.id}</p>
            <p className="text-sm text-muted-foreground">{quotation.date}</p>
            <ul className="mt-1 text-sm">
              {quotation.items.map((item, i) => (
                <li key={i}>
                  {item.name} x{item.quantity}
                </li>
              ))}
            </ul>
          </div>
          <Badge variant="secondary">{quotation.status}</Badge>
        </div>
      ))}
    </div>
  );
}
