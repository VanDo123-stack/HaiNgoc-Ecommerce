import { type MockOrder } from "~/data/account";
import { Badge } from "~/components/ui/badge";

export function OrderHistory({ orders }: { orders: MockOrder[] }) {
  if (orders.length === 0) {
    return (
      <p className="py-4 text-sm text-muted-foreground">
        Chưa có đơn hàng nào
      </p>
    );
  }

  return (
    <div>
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-start justify-between border-b border-border py-4"
        >
          <div>
            <p className="text-sm font-semibold">{order.id}</p>
            <p className="text-sm text-muted-foreground">{order.date}</p>
            <ul className="mt-1 text-sm">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.name} x{item.quantity}
                </li>
              ))}
            </ul>
          </div>
          <Badge variant="secondary">{order.status}</Badge>
        </div>
      ))}
    </div>
  );
}
