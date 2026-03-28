# Hải Ngọc B2B E-commerce — Tài Liệu Dành Cho Lập Trình Viên

Tài liệu này là tham khảo chính cho các lập trình viên làm việc trên frontend Hải Ngọc B2B e-commerce. Bao gồm hướng dẫn cài đặt, cấu trúc dự án, định tuyến (routing), và các tác vụ thường gặp trong quá trình phát triển.

---

## Mục Lục

1. [Giới thiệu dự án](#1-giới-thiệu-dự-án)
2. [Công nghệ sử dụng](#2-công-nghệ-sử-dụng)
3. [Bắt đầu nhanh](#3-bắt-đầu-nhanh)
4. [Cấu trúc dự án](#4-cấu-trúc-dự-án)
5. [Các trang và route](#5-các-trang-và-route)
6. [Cách tạo trang mới](#6-cách-tạo-trang-mới)
7. [Cách chỉnh sửa giao diện](#7-cách-chỉnh-sửa-giao-diện)
8. [Cách thêm hoặc chỉnh sửa sản phẩm](#8-cách-thêm-hoặc-chỉnh-sửa-sản-phẩm)
9. [Cách chỉnh sửa menu điều hướng](#9-cách-chỉnh-sửa-menu-điều-hướng)
10. [Câu hỏi thường gặp (FAQ)](#10-câu-hỏi-thường-gặp-faq)
11. [Các file quan trọng](#11-các-file-quan-trọng)

---

## 1. Giới Thiệu Dự Án

Hải Ngọc B2B E-commerce là website **chỉ có frontend** dành cho nhà cung cấp vật tư công nghiệp phục vụ các ngành cơ khí và dầu khí. Được xây dựng dựa trên nội dung của haingoc.com.vn.

**Chức năng của nền tảng:**

- Cho phép khách hàng doanh nghiệp duyệt sản phẩm công nghiệp (que hàn, máy mài, dụng cụ cắt hàn, đá mài đá cắt, vật tư thiết bị)
- Hỗ trợ thêm sản phẩm vào giỏ hàng và tiến hành checkout theo quy trình B2B với thông tin công ty, mã số thuế (MST), và tùy chọn giao hàng
- Hỗ trợ yêu cầu báo giá
- Bao gồm trang quản trị nội bộ (quản lý đơn hàng, quản lý sản phẩm, tạo PDF báo giá, báo cáo doanh thu)

**Ràng buộc quan trọng:**

- Không có backend, database, hay gọi API phía server. Toàn bộ dữ liệu nằm trong các file TypeScript tĩnh.
- Dữ liệu sản phẩm (~30 sản phẩm) được thu thập một lần từ website gốc và lưu trong `src/data/products.ts`.
- Checkout chỉ hỗ trợ chuyển khoản ngân hàng. Không tích hợp cổng thanh toán.
- Toàn bộ nội dung hiển thị bằng tiếng Việt.

---

## 2. Công Nghệ Sử Dụng

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| Next.js | 15.2.x | Framework React, App Router, server components |
| React | 19.0.x | Thư viện UI |
| TypeScript | 5.8.x | Toàn bộ code trong `src/` |
| Tailwind CSS | 4.0.x | Styling theo hướng utility-first |
| ShadCN UI | 4.x | Bộ component UI có sẵn, hỗ trợ accessibility |
| Embla Carousel | 8.x | Banner hero và carousel đối tác |
| jsPDF + jspdf-autotable | 4.x / 5.x | Tạo PDF báo giá trong trang quản trị |
| Recharts | 3.x | Biểu đồ trong báo cáo quản trị |
| Lucide React | 1.x | Icon dùng xuyên suốt ứng dụng |
| Sonner | 2.x | Thông báo toast |
| Zod | 3.x | Kiểm tra dữ liệu sản phẩm tại runtime |
| Slugify | 1.x | Tạo slug URL thân thiện |
| next-themes | 0.4.x | Hỗ trợ chế độ tối/sáng |
| Yarn | 1.22.22 | Quản lý package |
| Turbopack | (tích hợp sẵn) | Bundler dev nhanh, dùng qua `next dev --turbo` |

**Lưu ý:** Dự án được khởi tạo bằng create-t3-app và có sẵn cơ sở hạ tầng tRPC + Prisma. Các phần này tồn tại trong codebase nhưng **không được sử dụng** cho storefront hay admin. Toàn bộ dữ liệu được phục vụ từ file tĩnh. Không thêm gọi database hay tRPC procedure cho các tính năng storefront.

---

## 3. Bắt Đầu Nhanh

### Yêu cầu

- Node.js 20 trở lên
- Yarn 1.22.22 (classic)

```bash
node --version   # phải là 20+
yarn --version   # phải là 1.22.22
```

### Cài đặt và chạy

```bash
# Clone repository
git clone <repo-url>
cd haingoc-b2b-ecommerce

# Cài đặt dependencies
yarn install

# Khởi động development server
yarn dev
```

Ứng dụng sẽ chạy tại **http://localhost:3000**.

### Các lệnh khác

```bash
yarn build          # Build production
yarn start          # Chạy bản production trên máy local
yarn lint           # Chạy ESLint
yarn lint:fix       # Tự động sửa lỗi lint
yarn format:write   # Format tất cả file với Prettier
yarn format:check   # Kiểm tra format mà không ghi file
yarn typecheck      # Kiểm tra kiểu TypeScript
```

### Biến môi trường

Dự án yêu cầu biến môi trường `DATABASE_URL` vì kế thừa từ scaffold T3. Để phát triển local mà không cần database:

```bash
# Tạo file .env
cp .env.example .env
```

Đặt `SKIP_ENV_VALIDATION=1` trong `.env` nếu bạn không muốn chạy PostgreSQL local (storefront không cần):

```
SKIP_ENV_VALIDATION=1
DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
```

---

## 4. Cấu Trúc Dự Án

```
haingoc-b2b-ecommerce/
├── public/
│   ├── logo.png                    # Logo công ty
│   └── images/
│       ├── products/               # Ảnh sản phẩm phân theo danh mục
│       │   ├── que-han/
│       │   ├── may-mai/
│       │   ├── dung-cu-cat-han/
│       │   ├── da-mai-da-cat/
│       │   └── vat-tu-thiet-bi/
│       └── partners/               # Logo đối tác dùng cho carousel
├── src/
│   ├── app/                        # Các trang và layout Next.js App Router
│   │   ├── layout.tsx              # Layout gốc (font, global providers)
│   │   ├── (storefront)/           # Route group: trang dành cho khách hàng
│   │   │   ├── layout.tsx          # Shell storefront (Header + Footer + Providers)
│   │   │   ├── page.tsx            # Trang chủ (/)
│   │   │   ├── san-pham/           # Danh sách sản phẩm (/san-pham)
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/         # Chi tiết sản phẩm (/san-pham/[slug])
│   │   │   │       └── page.tsx
│   │   │   ├── gio-hang/           # Giỏ hàng (/gio-hang)
│   │   │   ├── thanh-toan/         # Thanh toán (/thanh-toan)
│   │   │   ├── xac-nhan/           # Xác nhận đơn hàng (/xac-nhan)
│   │   │   ├── bao-gia/            # Yêu cầu báo giá (/bao-gia)
│   │   │   ├── tim-kiem/           # Kết quả tìm kiếm (/tim-kiem)
│   │   │   ├── tin-tuc/            # Danh sách và chi tiết tin tức (/tin-tuc)
│   │   │   │   └── [slug]/
│   │   │   ├── lien-he/            # Trang liên hệ (/lien-he)
│   │   │   ├── tai-khoan/          # Tài khoản người dùng (/tai-khoan)
│   │   │   ├── dang-nhap/          # Đăng nhập (/dang-nhap)
│   │   │   ├── dang-ky/            # Đăng ký (/dang-ky)
│   │   │   ├── dich-vu-gia-cong/   # Trang dịch vụ gia công
│   │   │   ├── ho-tro-ky-thuat/    # Trang hỗ trợ kỹ thuật
│   │   │   ├── chinh-sach-bao-mat/ # Chính sách bảo mật
│   │   │   └── dieu-khoan-su-dung/ # Điều khoản sử dụng
│   │   ├── (admin)/                # Route group: trang quản trị
│   │   │   └── quan-tri/           # Root admin (/quan-tri)
│   │   │       ├── layout.tsx      # Shell admin (sidebar)
│   │   │       ├── page.tsx        # Tổng quan dashboard
│   │   │       ├── san-pham/       # Quản lý sản phẩm
│   │   │       ├── don-hang/       # Quản lý đơn hàng
│   │   │       ├── khach-hang/     # Quản lý khách hàng
│   │   │       └── bao-cao/        # Báo cáo và biểu đồ
│   │   └── api/
│   │       └── trpc/[trpc]/        # Handler tRPC HTTP (không dùng cho storefront)
│   ├── components/
│   │   ├── layout/                 # Header, Footer, NavBar, CartBadge, v.v.
│   │   ├── product/                # ProductCard, ProductGrid, ProductFilters, v.v.
│   │   ├── home/                   # HeroBanner, CategoryGrid, TrendingProducts, v.v.
│   │   ├── cart/                   # CartItemsTable, CartRow, OrderSummary, v.v.
│   │   ├── checkout/               # BankTransferCard, QuotationForm, ConfirmationContent
│   │   ├── admin/                  # AdminSidebar, RevenueChart, TopProductsChart, v.v.
│   │   ├── account/                # ProfileForm, OrderHistory, WishlistSection, v.v.
│   │   ├── contact/                # ContactForm
│   │   ├── news/                   # NewsCard
│   │   ├── search/                 # SearchPageClient
│   │   └── ui/                     # ShadCN UI primitives (Button, Input, Badge, v.v.)
│   ├── context/
│   │   ├── AuthContext.tsx         # State xác thực + localStorage
│   │   ├── CartContext.tsx         # State giỏ hàng + lưu trữ localStorage
│   │   └── WishlistContext.tsx     # State danh sách yêu thích + lưu trữ localStorage
│   ├── data/
│   │   ├── products.ts             # ~30 sản phẩm tĩnh (nguồn dữ liệu chính)
│   │   ├── categories.ts           # Danh mục sản phẩm
│   │   ├── news.ts                 # Bài viết tin tức
│   │   ├── reviews.ts              # Đánh giá sản phẩm mẫu
│   │   ├── promotions.ts           # Dữ liệu banner khuyến mãi
│   │   ├── account.ts              # Dữ liệu tài khoản mẫu cho trang tài khoản
│   │   └── admin/
│   │       ├── orders.ts           # Đơn hàng mẫu cho trang quản trị
│   │       ├── customers.ts        # Khách hàng mẫu cho trang quản trị
│   │       ├── inventory.ts        # Dữ liệu tồn kho mẫu
│   │       └── reports.ts          # Dữ liệu báo cáo/biểu đồ mẫu
│   ├── lib/
│   │   ├── storage.ts              # Helper localStorage với namespace + migration
│   │   ├── format.ts               # Định dạng tiền tệ VND
│   │   ├── utils.ts                # Hàm cn() (ghép class Tailwind)
│   │   ├── generate-quote-pdf.ts   # Tạo báo giá PDF bằng jsPDF
│   │   └── fonts/
│   │       └── roboto.ts           # Dữ liệu font Roboto cho PDF (base64)
│   ├── styles/
│   │   └── globals.css             # CSS toàn cục và theme tokens Tailwind
│   ├── types/
│   │   ├── product.ts              # Kiểu Product, Category + schema Zod
│   │   ├── admin.ts                # Kiểu dành cho admin (đơn hàng, khách hàng, v.v.)
│   │   ├── news.ts                 # Kiểu bài viết tin tức
│   │   └── review.ts               # Kiểu đánh giá
│   ├── server/                     # Scaffold T3 (tRPC + Prisma — không dùng cho storefront)
│   ├── trpc/                       # Scaffold T3 (tRPC client — không dùng cho storefront)
│   └── env.js                      # Kiểm tra biến môi trường có kiểu an toàn
├── docs/                           # Tài liệu cho lập trình viên (bạn đang ở đây)
├── next.config.js
├── tailwind.config.js (via postcss.config.js)
├── tsconfig.json
├── package.json
└── yarn.lock
```

---

## 5. Các Trang Và Route

### Route storefront (dành cho khách hàng)

| URL | File | Mô tả |
|---|---|---|
| `/` | `(storefront)/page.tsx` | Trang chủ với banner hero, danh mục, sản phẩm nổi bật, sản phẩm xu hướng, tin tức, carousel đối tác |
| `/san-pham` | `(storefront)/san-pham/page.tsx` | Danh sách sản phẩm với bộ lọc sidebar và sắp xếp |
| `/san-pham/[slug]` | `(storefront)/san-pham/[slug]/page.tsx` | Chi tiết sản phẩm với thư viện ảnh, thông số, đánh giá, thêm vào giỏ, sản phẩm liên quan |
| `/gio-hang` | `(storefront)/gio-hang/page.tsx` | Trang giỏ hàng với bảng sản phẩm, tóm tắt đơn hàng, gợi ý mua kèm |
| `/thanh-toan` | `(storefront)/thanh-toan/page.tsx` | Form checkout B2B (thông tin công ty, MST, giao hàng, chuyển khoản) |
| `/xac-nhan` | `(storefront)/xac-nhan/page.tsx` | Trang xác nhận đơn hàng sau khi checkout |
| `/bao-gia` | `(storefront)/bao-gia/page.tsx` | Form yêu cầu báo giá |
| `/tim-kiem` | `(storefront)/tim-kiem/page.tsx` | Trang kết quả tìm kiếm (tìm kiếm theo URL) |
| `/tin-tuc` | `(storefront)/tin-tuc/page.tsx` | Danh sách bài viết tin tức |
| `/tin-tuc/[slug]` | `(storefront)/tin-tuc/[slug]/page.tsx` | Chi tiết bài viết tin tức |
| `/lien-he` | `(storefront)/lien-he/page.tsx` | Trang liên hệ với form, chi nhánh, Google Maps |
| `/tai-khoan` | `(storefront)/tai-khoan/page.tsx` | Tài khoản người dùng: hồ sơ, đơn hàng, báo giá, yêu thích, theo dõi công nợ |
| `/dang-nhap` | `(storefront)/dang-nhap/page.tsx` | Trang đăng nhập |
| `/dang-ky` | `(storefront)/dang-ky/page.tsx` | Trang đăng ký tài khoản |
| `/dich-vu-gia-cong` | `(storefront)/dich-vu-gia-cong/page.tsx` | Thông tin dịch vụ gia công |
| `/ho-tro-ky-thuat` | `(storefront)/ho-tro-ky-thuat/page.tsx` | Thông tin hỗ trợ kỹ thuật |
| `/chinh-sach-bao-mat` | `(storefront)/chinh-sach-bao-mat/page.tsx` | Chính sách bảo mật |
| `/dieu-khoan-su-dung` | `(storefront)/dieu-khoan-su-dung/page.tsx` | Điều khoản sử dụng |

### Route admin (trang quản trị)

| URL | File | Mô tả |
|---|---|---|
| `/quan-tri` | `(admin)/quan-tri/page.tsx` | Tổng quan dashboard với các thẻ KPI |
| `/quan-tri/san-pham` | `(admin)/quan-tri/san-pham/page.tsx` | CRUD sản phẩm (thêm, sửa, xóa) |
| `/quan-tri/don-hang` | `(admin)/quan-tri/don-hang/page.tsx` | Danh sách đơn hàng, thay đổi trạng thái, tạo PDF, đính kèm file |
| `/quan-tri/khach-hang` | `(admin)/quan-tri/khach-hang/page.tsx` | Danh sách và chi tiết khách hàng |
| `/quan-tri/bao-cao` | `(admin)/quan-tri/bao-cao/page.tsx` | Biểu đồ doanh thu, sản phẩm bán chạy, phân khúc khách hàng |

**Lưu ý:** Trang quản trị có bảo vệ bằng mã PIN qua component `AdminPinGate`. Mã PIN mặc định là `1234`.

---

## 6. Cách Tạo Trang Mới

### Bước 1: Chọn route group phù hợp

- Trang dành cho khách hàng đặt trong `src/app/(storefront)/`
- Trang admin đặt trong `src/app/(admin)/quan-tri/`

### Bước 2: Tạo thư mục và file trang

Để tạo trang storefront mới tại `/gioi-thieu` (Giới thiệu):

```bash
mkdir src/app/(storefront)/gioi-thieu
touch src/app/(storefront)/gioi-thieu/page.tsx
```

### Bước 3: Viết component trang

```tsx
// src/app/(storefront)/gioi-thieu/page.tsx
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Giới thiệu - Hải Ngọc",
  description: "Tìm hiểu về công ty Hải Ngọc.",
};

export default function GioiThieuPage() {
  return (
    <main className="py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <h1 className="text-2xl font-bold">Giới thiệu</h1>
        <p className="mt-4 text-muted-foreground">Nội dung trang giới thiệu.</p>
      </div>
    </main>
  );
}
```

**Quy tắc:**
- Server components (mặc định) KHÔNG được có `"use client"` ở đầu file.
- Nếu trang cần tương tác (state, event handlers), thêm `"use client"` lên đầu và bỏ `async`/`await`.
- Dùng `export const metadata` cho metadata SEO — chỉ hoạt động trong server components.
- Luôn dùng pattern `container mx-auto max-w-7xl px-4` để đảm bảo chiều rộng trang nhất quán.

### Bước 4: Thêm trang vào menu điều hướng (nếu cần)

Xem [Phần 9](#9-cách-chỉnh-sửa-menu-điều-hướng).

---

## 7. Cách Chỉnh Sửa Giao Diện

### Thay đổi màu sắc

Màu sắc được định nghĩa dưới dạng CSS custom properties (design tokens) trong `src/styles/globals.css`. Dự án dùng Tailwind CSS 4 với theme tùy chỉnh.

Màu thương hiệu chính là xanh lam. Để thay đổi, cập nhật biến CSS trong `globals.css`:

```css
:root {
  --primary: oklch(0.55 0.2 240); /* xanh lam — đổi giá trị này */
  --background: oklch(1 0 0);
}
```

Riêng phần header và footer, các màu xanh (`bg-blue-800`, `bg-blue-900`, `bg-blue-950`) được hard-code trực tiếp bằng class Tailwind trong `src/components/layout/Header.tsx` và `src/components/layout/Footer.tsx`. Bạn sửa trực tiếp tại đó.

### Thay đổi chiều rộng layout

Chiều rộng tối đa cho tất cả các trang được kiểm soát bởi `max-w-7xl` (1280px). Để thay đổi, tìm kiếm `max-w-7xl` trên toàn bộ codebase và thay bằng class max-width Tailwind khác (ví dụ: `max-w-6xl`).

### Thay đổi banner hero

Banner hero nằm ở `src/components/home/HeroBanner.tsx`, dùng Embla Carousel. Để thay đổi slide, chỉnh mảng slides trong file đó. Ảnh lưu trong `public/images/`.

### Thêm hoặc bỏ section trên trang chủ

Chỉnh sửa `src/app/(storefront)/page.tsx`. Mỗi section là một component import riêng:

```tsx
<HeroBanner />
<CategoryGrid categories={categories} />
<PromoBanners />
{/* Khu vực Sản phẩm nổi bật */}
<TrendingProducts />
<NewsSection articles={latestNews} />
<PartnerCarousel />
```

Thêm hoặc xóa dòng để kiểm soát section nào xuất hiện.

### Chế độ tối (Dark mode)

Dự án đã cài `next-themes`. Theme provider bao bọc toàn bộ ứng dụng trong `src/app/layout.tsx`. Các component ShadCN tự động nhận diện class `dark`. Để thêm nút chuyển theme, dùng hook `useTheme` của `next-themes` trong một client component.

---

## 8. Cách Thêm Hoặc Chỉnh Sửa Sản Phẩm

Toàn bộ sản phẩm được lưu trong `src/data/products.ts` dưới dạng mảng TypeScript gồm các object `Product`.

### Cấu trúc dữ liệu sản phẩm

```ts
{
  id: "unique-id-matching-slug",           // string, bắt buộc
  slug: "url-friendly-slug",               // string, bắt buộc, chỉ dùng a-z 0-9 -
  name: "Tên Sản Phẩm Hiển Thị",          // string, bắt buộc
  categorySlug: "que-han",                 // phải khớp với slug trong src/data/categories.ts
  material: "mô tả vật liệu",             // string (có thể để trống)
  origin: "KOBELCO – Nhật Bản",           // string (hiển thị trên card)
  standard: "AWS A5.1 E7018",             // string
  description: "Mô tả đầy đủ sản phẩm",  // string
  image: "/images/products/que-han/filename.webp",  // phải bắt đầu bằng /images/
  images: ["/images/..."],                 // mảng tùy chọn cho thư viện ảnh
  status: "in-stock",                      // "in-stock" | "out-of-stock"
  price: 210000,                           // số theo VND, hoặc null cho "liên hệ báo giá"
  originalPrice: 245000,                   // tùy chọn, để hiển thị giá gạch
  salePrice: 210000,                       // tùy chọn
  discountPercent: 14,                     // tùy chọn, 0-100
  relatedSlugs: ["other-product-slug"],    // tùy chọn, cho phần sản phẩm liên quan
  standardType: "AWS",                     // tùy chọn: "JIS" | "ASTM" | "DIN" | "AWS" | "other"
  dimensionCategory: "3.2mm",              // tùy chọn, cho bộ lọc kích thước
  materialGrade: "E7018",                  // tùy chọn, cho bộ lọc mác thép
}
```

### Thêm sản phẩm mới

1. Đặt ảnh sản phẩm vào `public/images/products/<category-slug>/`.
2. Mở `src/data/products.ts`.
3. Thêm object mới vào mảng `products` theo cấu trúc trên.
4. Đảm bảo `categorySlug` khớp với một trong các slug trong `src/data/categories.ts`.

Ví dụ:

```ts
{
  id: "may-mai-bosch-gws-900",
  slug: "may-mai-bosch-gws-900",
  name: "Máy mài Bosch GWS 900",
  categorySlug: "may-mai",
  material: "",
  origin: "Bosch – Đức",
  standard: "",
  description: "Máy mài cầm tay Bosch GWS 900, công suất 900W.",
  image: "/images/products/may-mai/may-mai-bosch-gws-900.webp",
  status: "in-stock",
  price: 1250000,
},
```

### Thêm danh mục mới

1. Mở `src/data/categories.ts` và thêm entry mới:

```ts
{
  slug: "thiet-bi-bao-ho",
  name: "Thiết bị bảo hộ",
  description: "",
  image: undefined,
  productCount: 0, // cập nhật sau khi thêm sản phẩm
},
```

2. Tạo thư mục tương ứng trong `public/images/products/thiet-bi-bao-ho/`.

### Đặt giá sản phẩm là "Liên hệ báo giá"

Đặt `price: null`. Component `PriceDisplay` sẽ hiển thị "Liên hệ" thay vì số.

---

## 9. Cách Chỉnh Sửa Menu Điều Hướng

Thanh điều hướng nằm ở `src/components/layout/NavBar.tsx`. Các link menu được định nghĩa trong mảng `navLinks` gần đầu file:

```ts
const navLinks = [
  { href: "/", label: "Trang chủ", icon: true, exact: true },
  { href: "/san-pham", label: "Sản phẩm", dropdown: true },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/lien-he", label: "Liên hệ" },
  { href: "/dich-vu-gia-cong", label: "Dịch vụ gia công" },
  { href: "/ho-tro-ky-thuat", label: "Hỗ trợ kỹ thuật" },
];
```

**Để thêm link:** thêm object vào mảng với `href` và `label`.

**Để xóa link:** xóa object tương ứng.

**Để thêm dropdown:** đặt `dropdown: true`. Các mục dropdown được tự động lấy từ `src/data/categories.ts`. Các mục dropdown tùy chỉnh chưa được hỗ trợ mà không cần sửa code phần render dropdown trong `NavBar.tsx`.

Menu điều hướng mobile dùng `src/components/layout/MobileNav.tsx`. File này đọc cùng pattern mảng `navLinks`, do đó bạn có thể cần cập nhật cả hai file nếu muốn thay đổi phản ánh trên mobile.

---

## 10. Câu Hỏi Thường Gặp (FAQ)

**H: Tại sao checkout không thực sự gửi đơn hàng đi đâu?**

Đây là bản demo chỉ có frontend. Khi form checkout được submit, dữ liệu đơn hàng được ghi vào `localStorage` để hiển thị trong danh sách đơn hàng của trang quản trị. Không có backend hay hệ thống email nào liên quan.

**H: Làm thế nào để reset giỏ hàng hoặc trạng thái đăng nhập trong lúc phát triển?**

Mở DevTools của trình duyệt, vào Application > Local Storage, xóa tất cả key bắt đầu bằng `haingoc_v2_`.

**H: Tại sao trang chi tiết sản phẩm hiện ảnh placeholder?**

Hầu hết sản phẩm chỉ có một ảnh thật. Mảng `images` được lấp đầy bằng `/images/products/placeholder-1.svg` và `/placeholder-2.svg` để đủ số lượng cho thư viện ảnh. Thay thế bằng ảnh thật để cải thiện trang sản phẩm.

**H: Làm thế nào để vào trang quản trị?**

Truy cập `/quan-tri`. Bạn sẽ được yêu cầu nhập mã PIN. Mã PIN mặc định là `1234`. Đây là xác thực giả lập phía client — không có xác thực thật sự.

**H: Tôi có thể thêm chức năng backend thật không?**

Dự án đã có sẵn tRPC và Prisma (từ create-t3-app). Bạn có thể mở rộng để thêm các procedure thật, nhưng điều này nằm ngoài phạm vi hiện tại của dự án.

**H: Màu theme Tailwind được định nghĩa ở đâu?**

Trong `src/styles/globals.css` dưới dạng CSS custom properties. Quy ước ShadCN dùng `--primary`, `--background`, `--card`, v.v. Màu header xanh lam cụ thể dùng class Tailwind hard-code (`bg-blue-800`, `bg-blue-900`) trong các component layout.

**H: Điều gì xảy ra nếu tôi thêm sản phẩm có slug trùng lặp?**

Trang chi tiết sản phẩm dùng `products.find(p => p.slug === slug)`. Nếu hai sản phẩm có cùng slug, kết quả khớp đầu tiên sẽ được dùng. Hãy giữ slug duy nhất.

**H: Làm thế nào để thay đổi thông tin đăng nhập demo?**

Trong `src/context/AuthContext.tsx`, tìm `DEFAULT_ACCOUNTS` và chỉnh các trường `email` và `password`. Tài khoản demo hiện tại là `demo@haingoc.com.vn` / `123456`.

---

## 11. Các File Quan Trọng

| File | Mục đích |
|---|---|
| `src/app/(storefront)/layout.tsx` | Bao bọc tất cả trang storefront với Header, Footer và ba context providers |
| `src/app/(storefront)/page.tsx` | Trang chủ — kiểm soát section nào xuất hiện và theo thứ tự nào |
| `src/components/layout/Header.tsx` | Thanh điều hướng trên cùng với logo, tìm kiếm, badge giỏ hàng, nút xác thực |
| `src/components/layout/NavBar.tsx` | Điều hướng ngang desktop với dropdown danh mục |
| `src/components/layout/MobileNav.tsx` | Menu hamburger trên mobile |
| `src/components/layout/Footer.tsx` | Footer với link, thông tin liên hệ, form đăng ký nhận tin, Google Maps |
| `src/context/CartContext.tsx` | Quản lý state giỏ hàng — thêm, xóa, cập nhật, lưu vào localStorage |
| `src/context/AuthContext.tsx` | State xác thực — đăng nhập, đăng ký, đăng xuất, tài khoản demo |
| `src/context/WishlistContext.tsx` | State danh sách yêu thích — bật/tắt sản phẩm trong wishlist |
| `src/data/products.ts` | Nguồn dữ liệu duy nhất của tất cả sản phẩm |
| `src/data/categories.ts` | Định nghĩa danh mục sản phẩm |
| `src/types/product.ts` | Kiểu `Product` và `Category` với schema Zod |
| `src/types/admin.ts` | Kiểu dành cho admin: `AdminOrder`, `AdminCustomer`, `InventoryItem`, v.v. |
| `src/lib/storage.ts` | Helper `getItem` / `setItem` cho localStorage có namespace `haingoc_v2_` |
| `src/lib/format.ts` | `formatVND()` — định dạng tiền tệ Việt Nam Đồng |
| `src/lib/generate-quote-pdf.ts` | Tạo tài liệu báo giá PDF từ một đơn hàng |
| `src/styles/globals.css` | CSS toàn cục, Tailwind theme tokens, biến màu sắc |
| `src/app/layout.tsx` | Layout gốc: HTML shell, font, global providers (Toaster, ThemeProvider) |
