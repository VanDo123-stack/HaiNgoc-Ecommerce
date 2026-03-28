import { promotions } from "~/data/promotions";

export function PromoBanners() {
  const activeBanners = promotions.filter(
    (p) => p.type === "banner" && p.isActive,
  );
  if (activeBanners.length === 0) return null;

  return (
    <section className="bg-muted/50 py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="mb-6 text-xl leading-tight font-semibold">
          Khuyến mãi nổi bật
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {activeBanners.map((banner) => (
            <div
              key={banner.id}
              className="bg-card border-border rounded-lg border p-6"
            >
              <h3 className="text-base font-semibold">{banner.title}</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {banner.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
