import { type Metadata } from "next";

import { news } from "~/data/news";
import { NewsCard } from "~/components/news/NewsCard";

export const metadata: Metadata = {
  title: "Tin tức - Hải Ngọc",
  description:
    "Tin tức và cập nhật ngành cơ khí, vật tư công nghiệp từ Hải Ngọc.",
};

export default function NewsPage() {
  return (
    <main className="py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <h1 className="mb-6 text-2xl font-semibold">Tin tức &amp; Cập nhật</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </main>
  );
}
