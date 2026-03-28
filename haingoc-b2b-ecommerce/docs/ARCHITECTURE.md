# Tài Liệu Kiến Trúc

Tài liệu này giải thích kiến trúc kỹ thuật của frontend Hải Ngọc B2B E-commerce: cách các component được tổ chức, cách dữ liệu chảy qua ứng dụng, và các quyết định thiết kế quan trọng.

---

## Mục Lục

1. [Tổng quan cấp cao](#1-tổng-quan-cấp-cao)
2. [Phân cấp component](#2-phân-cấp-component)
3. [Luồng dữ liệu](#3-luồng-dữ-liệu)
4. [Quản lý state](#4-quản-lý-state)
5. [Cấu trúc routing](#5-cấu-trúc-routing)
6. [Cách tiếp cận styling](#6-cách-tiếp-cận-styling)
7. [Các thư viện chính và lý do sử dụng](#7-các-thư-viện-chính-và-lý-do-sử-dụng)
8. [Những gì KHÔNG được sử dụng (và lý do)](#8-những-gì-không-được-sử-dụng-và-lý-do)

---

## 1. Tổng Quan Cấp Cao

Ứng dụng là một website **dữ liệu tĩnh, chỉ có frontend**. Không có backend API, không có truy vấn database, và không có fetch dữ liệu phía server lúc request.

```
Browser
  └── Next.js App Router
        ├── Route group: (storefront)    ← trang khách hàng
        │     └── layout.tsx             ← Context Providers + Header + Footer
        │           └── page components  ← đọc từ src/data/*
        └── Route group: (admin)         ← trang quản trị
              └── layout.tsx             ← AdminSidebar
                    └── page components  ← đọc từ src/data/admin/*
```

**Dữ liệu nằm trong các file TypeScript** (`src/data/`), không phải trong database hay API. Các trang import dữ liệu trực tiếp lúc build/render.

**State nằm trong React Context + localStorage.** Giỏ hàng, wishlist và state xác thực được quản lý bởi ba React Context provider. Tất cả đều lưu vào `localStorage` dùng helper có namespace (`src/lib/storage.ts`).

---

## 2. Phân Cấp Component

### Phân cấp trang storefront

```
src/app/layout.tsx                     (layout gốc)
  └── src/app/(storefront)/layout.tsx  (layout storefront)
        ├── AuthProvider               (context/AuthContext.tsx)
        │     └── CartProvider         (context/CartContext.tsx)
        │           └── WishlistProvider (context/WishlistContext.tsx)
        │                 ├── Header
        │                 │     ├── MobileNav
        │                 │     ├── HeaderSearchInput
        │                 │     ├── SearchDropdown (mobile)
        │                 │     ├── CartBadge
        │                 │     ├── AuthButton
        │                 │     └── NavBar (có dropdown danh mục)
        │                 ├── {nội dung trang}
        │                 └── Footer
        └── (các component trang riêng lẻ)
```

### Cây component trang chủ

```
page.tsx (Home)
  ├── HeroBanner         (Embla Carousel với các slide)
  ├── CategoryGrid       (lưới thẻ danh mục)
  ├── PromoBanners       (ảnh banner khuyến mãi)
  ├── ProductGrid        (sản phẩm nổi bật — 8 sản phẩm)
  │     └── ProductCard (mỗi sản phẩm)
  │           ├── ProductImageWithFallback
  │           └── PriceDisplay
  ├── TrendingProducts   (carousel sản phẩm xu hướng)
  ├── NewsSection        (3 bài viết mới nhất)
  │     └── NewsCard
  └── PartnerCarousel    (Embla Carousel, tự động chạy)
```

### Cây component danh sách sản phẩm

```
san-pham/page.tsx
  └── ProductListingClient   (client component, đọc URL params)
        ├── Breadcrumb
        ├── ProductFilters   (sidebar — cập nhật URL params)
        ├── ProductSort      (dropdown — cập nhật URL params)
        └── ProductGrid
              └── ProductCard
                    ├── ProductImageWithFallback
                    └── PriceDisplay
```

### Cây component chi tiết sản phẩm

```
san-pham/[slug]/page.tsx
  └── ProductDetail          (client component)
        ├── Breadcrumb
        ├── ImageGallery      (thumbnail + ảnh chính)
        ├── PriceDisplay
        ├── AddToCartArea     (input số lượng + nút)
        ├── tab thông tin sản phẩm (mô tả, thông số, tiêu chuẩn)
        ├── ReviewSection     (đánh giá mẫu)
        └── RelatedProducts   (lưới card sản phẩm liên quan)
```

### Cây component admin

```
(admin)/quan-tri/layout.tsx
  └── AdminSidebar           (client component với mobile Sheet)
        └── {nội dung trang admin}

Dashboard:  Thẻ tóm tắt KPI
Products:   Bảng sản phẩm với dialog thêm/sửa/xóa
Orders:     Bảng đơn hàng với điều khiển trạng thái, nút PDF, đính kèm
Customers:  Bảng khách hàng
Reports:    RevenueChart + TopProductsChart + CustomerSegmentsChart
```

---

## 3. Luồng Dữ Liệu

### Dữ liệu tĩnh (chỉ đọc)

Sản phẩm, danh mục, tin tức, đánh giá, khuyến mãi, và dữ liệu admin được import trực tiếp từ các file `src/data/`. Đây là luồng một chiều: file dữ liệu → component. Không có gì ghi ngược lại các file này lúc runtime.

```
src/data/products.ts
  │
  ├── import bởi: src/app/(storefront)/page.tsx        (trang chủ)
  ├── import bởi: src/app/(storefront)/san-pham/page.tsx
  ├── import bởi: src/app/(storefront)/san-pham/[slug]/page.tsx
  ├── import bởi: src/app/(storefront)/thanh-toan/page.tsx
  └── import bởi: src/components/cart/CartItemsTable.tsx (tra cứu sản phẩm)
```

### Dữ liệu context (đọc + ghi)

Ba context provider quản lý state mà người dùng có thể thay đổi:

```
Hành động người dùng (ví dụ: "Thêm vào giỏ")
  │
  ▼
Component gọi phương thức context
  (ví dụ: useCart().addItem("slug", 1))
  │
  ▼
Context cập nhật React state (useState)
  │
  ├── Re-render tất cả consumer của context đó
  │
  └── useEffect ghi vào localStorage
        (key: haingoc_v2_cart)
```

Lần tải trang tiếp theo:

```
Component mount
  │
  ▼
useEffect chạy
  │
  ▼
Đọc từ localStorage (haingoc_v2_cart)
  │
  ▼
Khôi phục React state
```

### Luồng submit đơn hàng

```
Submit form checkout
  │
  ▼
Tạo object AdminOrder từ form + sản phẩm trong giỏ
  │
  ▼
Đọc danh sách đơn hàng hiện có từ localStorage (haingoc_v2_orders)
  │
  ▼
Thêm đơn hàng mới vào danh sách
  │
  ▼
Ghi mảng đơn hàng đã cập nhật vào localStorage
  │
  ▼
Xóa giỏ hàng
  │
  ▼
Chuyển hướng đến /xac-nhan
```

Trang quản trị đọc đơn hàng từ cùng key localStorage `haingoc_v2_orders`, nên đơn hàng đặt trên storefront xuất hiện ngay lập tức trong trang quản trị.

---

## 4. Quản Lý State

### Triết lý thiết kế

Không có thư viện state global nào (không Redux, không Zustand, không Jotai). State được quản lý ở ba cấp độ:

| Cấp độ | Cơ chế | Phạm vi |
|---|---|---|
| State global có lưu trữ | React Context + localStorage | Giỏ hàng, wishlist, xác thực |
| State local của trang/component | `useState` | Input form, toggle UI, mở/đóng dialog |
| State URL | Next.js `useSearchParams` | Bộ lọc sản phẩm, thứ tự sắp xếp, từ khóa tìm kiếm |

### Tại sao dùng URL state cho bộ lọc

Bộ lọc và tìm kiếm dùng URL parameters thay vì component state. Điều này mang lại cho người dùng:
- URL có thể chia sẻ (ví dụ: gửi link đến danh sách sản phẩm đã lọc)
- Điều hướng trình duyệt tiến/lùi hoạt động bình thường
- Không mất state khi refresh trang

### Thứ tự lồng nhau của context provider

Ba provider được lồng theo thứ tự này trong `(storefront)/layout.tsx`:

```tsx
<AuthProvider>
  <CartProvider>
    <WishlistProvider>
      {children}
    </WishlistProvider>
  </CartProvider>
</AuthProvider>
```

Thứ tự chỉ quan trọng ở chỗ mỗi provider là độc lập — chúng không phụ thuộc vào nhau. Việc lồng nhau là tùy ý.

### SSR safety (An toàn với Server-Side Rendering)

Cả ba context đều dùng pattern `mountedRef` hoặc `isLoading` để tránh đọc `localStorage` trong quá trình server-side rendering (SSR). `localStorage` chỉ có trong trình duyệt. Pattern trông như thế này:

```tsx
const mountedRef = useRef(false);

useEffect(() => {
  // Chỉ chạy trong browser, sau khi mount
  const stored = localStorage.getItem("some-key");
  if (stored) setItems(JSON.parse(stored));
  mountedRef.current = true;
}, []);

useEffect(() => {
  if (!mountedRef.current) return; // Bỏ qua lần render đầu tiên
  localStorage.setItem("some-key", JSON.stringify(items));
}, [items]);
```

Pattern này ngăn component ghi mảng rỗng vào localStorage khi SSR, điều đó sẽ xóa dữ liệu đã lưu trước đó.

---

## 5. Cấu Trúc Routing

### Route groups

"Route groups" trong Next.js App Router dùng tên thư mục trong ngoặc đơn. Chúng nhóm các trang lại mà không ảnh hưởng đến URL.

```
src/app/
  (storefront)/    ← nhóm tất cả trang khách hàng dưới một layout
  (admin)/         ← nhóm tất cả trang admin dưới một layout khác
```

Điều này cho phép storefront và admin có layout hoàn toàn riêng biệt (Header/Footer vs. AdminSidebar) mà không chia sẻ một wrapper layout chung.

### Dynamic routes (Route động)

| Pattern | File | URL ví dụ |
|---|---|---|
| `/san-pham/[slug]` | `san-pham/[slug]/page.tsx` | `/san-pham/que-han-kobelco-lb-52-18` |
| `/tin-tuc/[slug]` | `tin-tuc/[slug]/page.tsx` | `/tin-tuc/huong-dan-chon-que-han` |

Route động dùng `generateStaticParams` để pre-render tất cả slug hợp lệ lúc build. Điều này có nghĩa là:
- Không cần server để phục vụ từng trang sản phẩm riêng lẻ
- Slug không hợp lệ kích hoạt `notFound()` và hiển thị trang 404

### API routes

File `src/app/api/trpc/[trpc]/route.ts` là một phần của scaffold T3. Nó xử lý các HTTP request tRPC. File này không được dùng cho storefront hay admin nhưng phải giữ nguyên cho cơ sở hạ tầng tRPC.

---

## 6. Cách Tiếp Cận Styling

### Tailwind CSS 4

Dự án dùng Tailwind CSS 4 được cấu hình qua PostCSS (`postcss.config.js`). Không có file `tailwind.config.js` — Tailwind 4 đọc cấu hình trực tiếp từ CSS.

Theme tokens (màu sắc, border-radius, font) được định nghĩa trong `src/styles/globals.css` dùng CSS custom properties trong block `@theme`. Các component ShadCN sử dụng các token này.

### ShadCN UI

ShadCN UI cung cấp các component primitive có sẵn, hỗ trợ accessibility. Các component nằm trong `src/components/ui/`. Chúng được copy vào codebase (không phải là npm dependency runtime) nên bạn có thể chỉnh sửa trực tiếp.

Các component ShadCN đang sử dụng:
- `Badge` — nhãn trạng thái sản phẩm
- `Button` — nút bấm xuyên suốt ứng dụng
- `Breadcrumb` — điều hướng breadcrumb cho trang
- `Carousel` — bao bọc Embla Carousel cho hero và section đối tác
- `Command` — dùng trong dropdown tìm kiếm
- `Dialog` — modal dialog trong trang quản trị
- `DropdownMenu` — dropdown nút xác thực, dropdown sắp xếp
- `Input` — input form
- `NavigationMenu` — nav desktop (một phần)
- `Select` — dropdown chọn trong form
- `Separator` — đường phân cách
- `Sheet` — panel trượt từ cạnh (nav mobile, bộ lọc mobile)
- `Sonner` (qua package `sonner`) — thông báo toast
- `Textarea` — input form nhiều dòng

### Tiện ích class

`src/lib/utils.ts` export hàm `cn()`, ghép các class Tailwind và giải quyết xung đột dùng `tailwind-merge` và `clsx`:

```ts
import { cn } from "~/lib/utils";

// Cách dùng:
<div className={cn("base-class", condition && "conditional-class", props.className)} />
```

Luôn dùng `cn()` khi kết hợp class lập trình hoặc nhận prop `className`.

### Responsive design (Thiết kế responsive)

Ứng dụng dùng cách tiếp cận mobile-first. Hầu hết component có các breakpoint sau:

| Breakpoint | Min-width | Dùng cho |
|---|---|---|
| `sm` | 640px | Hiện thanh tìm kiếm trong header, layout 2 cột |
| `md` | 768px | Lưới sản phẩm 3 cột |
| `lg` | 1024px | Hiện nav desktop, sidebar bộ lọc, lưới 4 cột |
| `2xl` | 1536px | Lưới sản phẩm 5 cột |

---

## 7. Các Thư Viện Chính Và Lý Do Sử Dụng

### next-themes

Hỗ trợ chế độ tối/sáng/theo hệ thống. Tích hợp với variant `dark:` của Tailwind. `ThemeProvider` nằm trong `src/app/layout.tsx`. Các component ShadCN dùng CSS variables tự động chuyển đổi giữa các theme.

### Embla Carousel

Dùng cho `HeroBanner` (slideshow ảnh hero) và `PartnerCarousel`. Được chọn vì component `Carousel` của ShadCN UI được xây dựng trên Embla. Plugin `embla-carousel-autoplay` cho phép tự động chuyển slide trong carousel đối tác.

### jsPDF + jspdf-autotable

Dùng riêng trong trang quản trị để tạo tài liệu PDF báo giá. Font Roboto được nhúng dưới dạng base64 trong `src/lib/fonts/roboto.ts` vì jsPDF cần font bundled với ứng dụng để hỗ trợ ký tự tiếng Việt (dấu thanh điệu).

### Recharts

Dùng cho ba biểu đồ báo cáo admin. Đây là thư viện biểu đồ native cho React với TypeScript support tốt và các component biểu đồ có thể kết hợp linh hoạt.

### Zod

Dùng để định nghĩa và kiểm tra kiểu `Product` và `Category`. Schema Zod trong `src/types/product.ts` đóng vai trò vừa là validator runtime vừa là nguồn kiểu TypeScript (`z.infer<typeof ProductSchema>`). Điều này đảm bảo nếu bạn thêm sản phẩm có dữ liệu không hợp lệ, TypeScript sẽ phát hiện ra.

### Sonner

Thư viện thông báo toast nhẹ. Dùng để phản hồi wishlist ("Đã thêm vào yêu thích"), xác nhận submit form, và các thao tác giỏ hàng. Component `Toaster` được mount một lần trong `src/app/layout.tsx`.

### Slugify

Dùng trong form "thêm sản phẩm" của trang quản trị để tự động tạo slug thân thiện với URL từ tên sản phẩm.

### Lucide React

Thư viện icon với ngôn ngữ thiết kế nhất quán. Dùng xuyên suốt ứng dụng cho icon điều hướng, icon giỏ hàng, trái tim (wishlist), ngôi sao (đánh giá), và icon form.

---

## 8. Những Gì KHÔNG Được Sử Dụng (Và Lý Do)

### tRPC procedure cho dữ liệu storefront

tRPC đã được scaffold và cơ sở hạ tầng tồn tại (`src/server/api/`, `src/trpc/`), nhưng không có procedure nào fetch dữ liệu sản phẩm storefront. Vì toàn bộ dữ liệu là tĩnh, tRPC sẽ thêm sự phức tạp không cần thiết và round-trip mạng. Giữ dữ liệu sản phẩm trong các file `src/data/`.

### Prisma / PostgreSQL

Scaffold có Prisma nhưng không có model Prisma nào được định nghĩa cho sản phẩm, đơn hàng, hay người dùng. Biến môi trường `DATABASE_URL` được yêu cầu bởi validation của scaffold, nhưng không có truy vấn database nào chạy cho các tính năng storefront.

### Thư viện quản lý state global (Zustand, Redux)

React Context đủ dùng cho ba phần state global (auth, cart, wishlist). Đây là các state tree nhỏ với logic cập nhật đơn giản. Thêm thư viện quản lý state sẽ tăng độ phức tạp mà không mang lại lợi ích gì.

### Server actions

Next.js server actions không được dùng. Tất cả các mutation (thêm vào giỏ, checkout, v.v.) là các thao tác phía client trên localStorage.
