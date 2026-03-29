# Tài Liệu Tham Khảo Component

Tài liệu này liệt kê tất cả các component chính trong dự án, được phân loại theo nhóm. Mỗi mục bao gồm đường dẫn file, mục đích, props, và ví dụ sử dụng.

---

## Mục Lục

1. [Layout Components](#1-layout-components)
2. [Product Components](#2-product-components)
3. [Cart Components](#3-cart-components)
4. [Checkout Components](#4-checkout-components)
5. [Home Page Components](#5-home-page-components)
6. [Admin Components](#6-admin-components)
7. [Account Components](#7-account-components)
8. [Search Components](#8-search-components)
9. [News Components](#9-news-components)
10. [Contact Components](#10-contact-components)
11. [UI Primitives (ShadCN)](#11-ui-primitives-shadcn)

---

## 1. Layout Components

### Header

**File:** `src/components/layout/Header.tsx`

**Mục đích:** Thanh điều hướng trên cùng xuất hiện trên mọi trang storefront. Chứa logo, thanh tìm kiếm, badge giỏ hàng, và nút xác thực. Cố định ở đầu trang (`position: sticky; top: 0; z-50`).

**Props:** Không có — render từ dữ liệu nội bộ và context.

**Cách dùng:**
```tsx
// Được render tự động bởi (storefront)/layout.tsx
<Header />
```

---

### Footer

**File:** `src/components/layout/Footer.tsx`

**Mục đích:** Footer toàn site với bốn cột: thông tin công ty, link nhanh, thông tin liên hệ với nhúng Google Maps, và đăng ký nhận tin kèm link chính sách.

**Lưu ý:** Đây là client component (`"use client"`) vì dùng `new Date()` cho năm bản quyền, phải được tính trong trình duyệt để tránh lỗi hydration.

**Props:** Không có.

**Cách dùng:**
```tsx
<Footer />
```

---

### NavBar

**File:** `src/components/layout/NavBar.tsx`

**Mục đích:** Thanh điều hướng ngang desktop (chỉ hiển thị từ màn hình `lg` trở lên). Chứa link điều hướng chính và dropdown "Sản phẩm" được lấy từ `src/data/categories.ts`. Đánh dấu link hiện tại dựa trên URL.

**Props:** Không có — dùng `usePathname()` nội bộ.

**Cách dùng:**
```tsx
<NavBar />
```

**Để thêm menu item**, chỉnh mảng `navLinks` ở đầu file:
```ts
const navLinks = [
  { href: "/", label: "Trang chu", icon: true, exact: true },
  { href: "/san-pham", label: "San pham", dropdown: true },
  { href: "/tin-tuc", label: "Tin tuc" },
  // Thêm link của bạn ở đây:
  { href: "/gioi-thieu", label: "Gioi thieu" },
];
```

---

### MobileNav

**File:** `src/components/layout/MobileNav.tsx`

**Mục đích:** Menu hamburger trên mobile, mở panel trượt từ cạnh (ShadCN `Sheet`) chứa các link điều hướng. Chỉ hiển thị dưới breakpoint `lg`.

**Props:** Không có.

**Cách dùng:**
```tsx
<MobileNav />
```

---

### CartBadge

**File:** `src/components/layout/CartBadge.tsx`

**Mục đích:** Nút icon giỏ hàng trong header. Hiển thị badge đỏ với tổng số lượng khi giỏ hàng không trống. Link đến `/gio-hang`.

**Props:** Không có — đọc `totalItems` từ `useCart()`.

**Cách dùng:**
```tsx
<CartBadge />
```

---

### AuthButton

**File:** `src/components/layout/AuthButton.tsx`

**Mục đích:** Nút tài khoản trong header. Hiển thị link đăng nhập khi chưa xác thực, hoặc dropdown avatar người dùng với tùy chọn tài khoản/đăng xuất khi đã đăng nhập.

**Props:** Không có — đọc `user` từ `useAuth()`.

**Cách dùng:**
```tsx
<AuthButton />
```

---

### HeaderSearchInput

**File:** `src/components/layout/HeaderSearchInput.tsx`

**Mục đích:** Thanh input tìm kiếm trên header desktop. Khi submit, chuyển hướng đến `/tim-kiem?q=<tu-khoa>`.

**Props:** Không có.

**Cách dùng:**
```tsx
<HeaderSearchInput />
```

---

### SearchDropdown

**File:** `src/components/layout/SearchDropdown.tsx`

**Mục đích:** Trigger tìm kiếm mobile — nút icon kính lúp mở dropdown với ô nhập tìm kiếm. Thay thế `HeaderSearchInput` trên màn hình nhỏ hơn breakpoint `sm`.

**Props:** Không có.

**Cách dùng:**
```tsx
<SearchDropdown />
```

---

## 2. Product Components

### ProductCard

**File:** `src/components/product/ProductCard.tsx`

**Mục đích:** Hiển thị một sản phẩm trong lưới. Cho thấy ảnh sản phẩm, badge tồn kho, nút trái tim wishlist (khi hover), tên sản phẩm, xuất xứ, đánh giá sao mẫu, và giá. Toàn bộ card là link đến trang chi tiết sản phẩm.

**Props:**
```ts
{ product: Product }
```

**Cách dùng:**
```tsx
import { ProductCard } from "~/components/product/ProductCard";
import { products } from "~/data/products";

<ProductCard product={products[0]} />
```

**Lưu ý:** Đây là client component vì dùng `useWishlist()`.

---

### ProductGrid

**File:** `src/components/product/ProductGrid.tsx`

**Mục đích:** Render lưới responsive các component `ProductCard`. Hiển thị thông báo trạng thái trống khi mảng `products` rỗng.

**Props:**
```ts
{ products: Product[] }
```

**Cách dùng:**
```tsx
import { ProductGrid } from "~/components/product/ProductGrid";

<ProductGrid products={filteredProducts} />
```

**Số cột:** 2 (mobile) → 3 (md) → 4 (lg) → 5 (2xl)

---

### ProductListingClient

**File:** `src/components/product/ProductListingClient.tsx`

**Mục đích:** Toàn bộ UI danh sách sản phẩm cho `/san-pham`. Đọc URL parameters để lọc và sắp xếp sản phẩm. Render breadcrumb, sidebar bộ lọc (hoặc Sheet trên mobile), điều khiển sắp xếp, và `ProductGrid`.

**Props:**
```ts
{
  products: Product[];
  categories: Category[];
}
```

**Cách dùng:**
```tsx
// Được dùng bởi san-pham/page.tsx
<ProductListingClient products={products} categories={categories} />
```

**Lưu ý:** Phải được bao bọc trong `<Suspense>` vì dùng `useSearchParams()`.

---

### ProductFilters

**File:** `src/components/product/ProductFilters.tsx`

**Mục đích:** Panel bộ lọc sidebar cho danh sách sản phẩm. Tạo các tùy chọn bộ lọc động từ mảng sản phẩm. Cập nhật URL parameters khi bộ lọc được chọn hoặc xóa.

**Props:**
```ts
{
  products: Product[];
  categories: Category[];
}
```

**Cách dùng:**
```tsx
<ProductFilters products={products} categories={categories} />
```

---

### ProductSort

**File:** `src/components/product/ProductSort.tsx`

**Mục đích:** Dropdown chọn cách sắp xếp sản phẩm. Các tùy chọn: Mới nhất (newest), Tên A-Z (name), Giá tăng dần (price). Cập nhật URL parameter `sort`.

**Props:** Không có — đọc và ghi URL params nội bộ.

**Cách dùng:**
```tsx
<ProductSort />
```

---

### ProductDetail

**File:** `src/components/product/ProductDetail.tsx`

**Mục đích:** Toàn bộ view chi tiết sản phẩm: thư viện ảnh, tiêu đề, xuất xứ, tiêu chuẩn, mô tả, giá, khu vực thêm giỏ hàng, sản phẩm liên quan, và đánh giá.

**Props:**
```ts
{ product: Product }
```

**Cách dùng:**
```tsx
<ProductDetail product={product} />
```

---

### ImageGallery

**File:** `src/components/product/ImageGallery.tsx`

**Mục đích:** Hiển thị ảnh chính lớn với các thumbnail nhỏ bên dưới. Click vào thumbnail để đổi ảnh chính. Dùng trong trang chi tiết sản phẩm.

**Props:**
```ts
{
  images: string[];  // mảng đường dẫn ảnh
  alt: string;
}
```

**Cách dùng:**
```tsx
<ImageGallery images={product.images ?? [product.image]} alt={product.name} />
```

---

### AddToCartArea

**File:** `src/components/product/AddToCartArea.tsx`

**Mục đích:** Input chọn số lượng và các nút "Thêm vào giỏ hàng" / "Yêu cầu báo giá" trên trang chi tiết sản phẩm. Gọi `useCart().addItem()` khi submit.

**Props:**
```ts
{ product: Product }
```

**Cách dùng:**
```tsx
<AddToCartArea product={product} />
```

---

### PriceDisplay

**File:** `src/components/product/PriceDisplay.tsx`

**Mục đích:** Render giá sản phẩm theo ba cách: "Liên hệ" cho giá null, giá khuyến mãi với giá gốc gạch ngang cho sản phẩm giảm giá, hoặc giá thông thường.

**Props:**
```ts
{
  product: Product;
  size?: "card" | "detail";  // "card" nhỏ hơn, "detail" lớn hơn
}
```

**Cách dùng:**
```tsx
<PriceDisplay product={product} size="detail" />
```

---

### ProductImageWithFallback

**File:** `src/components/product/ProductImageWithFallback.tsx`

**Mục đích:** Bao bọc `Image` của Next.js để hiển thị placeholder màu xám nếu ảnh sản phẩm bị lỗi tải (404 hoặc lỗi khác). Tất cả ảnh sản phẩm trong catalog dùng component này.

**Props:** Giống props của `next/image` cộng thêm hành vi fallback tùy chọn.

**Cách dùng:**
```tsx
<ProductImageWithFallback
  src={product.image}
  alt={product.name}
  fill
  className="object-contain"
  sizes="(max-width: 640px) 100vw, 25vw"
/>
```

---

### ReviewSection

**File:** `src/components/product/ReviewSection.tsx`

**Mục đích:** Render các đánh giá sản phẩm mẫu (từ `src/data/reviews.ts`) bên dưới mô tả sản phẩm.

**Props:**
```ts
{ productSlug: string }
```

**Cách dùng:**
```tsx
<ReviewSection productSlug={product.slug} />
```

---

### RelatedProducts

**File:** `src/components/product/RelatedProducts.tsx`

**Mục đích:** Hiển thị lưới sản phẩm liên quan dựa trên `product.relatedSlugs`. Fallback sang sản phẩm cùng danh mục nếu `relatedSlugs` rỗng.

**Props:**
```ts
{ product: Product }
```

**Cách dùng:**
```tsx
<RelatedProducts product={product} />
```

---

### CrossSellProducts

**File:** `src/components/product/CrossSellProducts.tsx`

**Mục đích:** Hiển thị lưới sản phẩm "Bạn cũng có thể thích" trên trang giỏ hàng. Hiển thị sản phẩm từ danh mục liên quan.

**Props:**
```ts
{ categorySlug: string }
```

**Cách dùng:**
```tsx
<CrossSellProducts categorySlug="que-han" />
```

---

## 3. Cart Components

### CartItemsTable

**File:** `src/components/cart/CartItemsTable.tsx`

**Mục đích:** Bảng chính các sản phẩm trong giỏ hàng. Tra cứu dữ liệu sản phẩm đầy đủ từ `src/data/products.ts` dùng slug được lưu trong cart context.

**Props:** Không có — đọc từ `useCart()`.

**Cách dùng:**
```tsx
<CartItemsTable />
```

---

### CartRow

**File:** `src/components/cart/CartRow.tsx`

**Mục đích:** Một hàng trong bảng giỏ hàng. Hiển thị ảnh sản phẩm, tên, đơn giá, điều chỉnh số lượng (tăng/giảm), tổng dòng, và nút xóa.

**Props:**
```ts
{
  item: CartItem;
  product: Product;
}
```

**Cách dùng:**
```tsx
<CartRow item={cartItem} product={productData} />
```

---

### OrderSummary

**File:** `src/components/cart/OrderSummary.tsx`

**Mục đích:** Panel tóm tắt bên phải trên trang giỏ hàng. Hiển thị tổng số lượng, tổng giá ước tính, và nút tiến đến checkout.

**Props:** Không có — đọc từ `useCart()`.

**Cách dùng:**
```tsx
<OrderSummary />
```

---

### EmptyCart

**File:** `src/components/cart/EmptyCart.tsx`

**Mục đích:** Hiển thị khi giỏ hàng không có sản phẩm. Cho thấy thông báo thân thiện và link đến danh sách sản phẩm.

**Props:** Không có.

**Cách dùng:**
```tsx
{items.length === 0 && <EmptyCart />}
```

---

### CartPromoBanner

**File:** `src/components/cart/CartPromoBanner.tsx`

**Mục đích:** Banner thông báo khuyến mãi hiển thị phía trên các sản phẩm trong giỏ (ví dụ: thông báo miễn phí vận chuyển khi đủ điều kiện).

**Props:** Không có.

**Cách dùng:**
```tsx
<CartPromoBanner />
```

---

### CartCrossSell

**File:** `src/components/cart/CartCrossSell.tsx`

**Mục đích:** Section "Bạn cũng có thể thích" hiển thị bên dưới bảng giỏ hàng. Render sản phẩm từ danh mục liên quan.

**Props:** Không có — lấy danh mục từ sản phẩm đầu tiên trong giỏ.

**Cách dùng:**
```tsx
<CartCrossSell />
```

---

## 4. Checkout Components

### BankTransferCard

**File:** `src/components/checkout/BankTransferCard.tsx`

**Mục đích:** Hiển thị hướng dẫn thanh toán chuyển khoản ngân hàng (số tài khoản, tên ngân hàng, chủ tài khoản) và ảnh mã QR. Xuất hiện khi người dùng chọn "chuyển khoản" làm phương thức thanh toán trên trang checkout.

**Props:** Không có.

**Cách dùng:**
```tsx
{paymentMethod === "bank" && <BankTransferCard />}
```

---

### ConfirmationContent

**File:** `src/components/checkout/ConfirmationContent.tsx`

**Mục đích:** Nội dung trang `/xac-nhan` (xác nhận đơn hàng). Hiển thị mã đơn hàng, sản phẩm, tổng tiền, và nhắc nhở chuyển khoản.

**Props:** Không có — đọc đơn hàng mới nhất từ localStorage.

**Cách dùng:**
```tsx
<ConfirmationContent />
```

---

### QuotationForm

**File:** `src/components/checkout/QuotationForm.tsx`

**Mục đích:** Form yêu cầu báo giá tại `/bao-gia`. Thu thập tên công ty, người liên hệ, điện thoại, email, yêu cầu sản phẩm, và ghi chú.

**Props:** Không có.

**Cách dùng:**
```tsx
<QuotationForm />
```

---

## 5. Home Page Components

### HeroBanner

**File:** `src/components/home/HeroBanner.tsx`

**Mục đích:** Slideshow ảnh hero toàn chiều rộng dùng Embla Carousel. Mỗi slide có ảnh nền, tiêu đề, và nút kêu gọi hành động.

**Props:** Không có — các slide được hard-code trong component.

**Cách dùng:**
```tsx
<HeroBanner />
```

**Để thay đổi slide:** Chỉnh mảng slides bên trong `HeroBanner.tsx`.

---

### CategoryGrid

**File:** `src/components/home/CategoryGrid.tsx`

**Mục đích:** Lưới thẻ danh mục link đến `/san-pham?category=<slug>`. Mỗi thẻ hiển thị tên danh mục và tùy chọn ảnh.

**Props:**
```ts
{ categories: Category[] }
```

**Cách dùng:**
```tsx
import { categories } from "~/data/categories";
<CategoryGrid categories={categories} />
```

---

### PromoBanners

**File:** `src/components/home/PromoBanners.tsx`

**Mục đích:** Section với hai hoặc ba ảnh banner khuyến mãi đặt cạnh nhau (ví dụ: "Miễn phí vận chuyển", "Hàng mới về"). Dữ liệu đến từ `src/data/promotions.ts`.

**Props:** Không có.

**Cách dùng:**
```tsx
<PromoBanners />
```

---

### TrendingProducts

**File:** `src/components/home/TrendingProducts.tsx`

**Mục đích:** Section "Sản phẩm xu hướng" với danh sách card sản phẩm có thể cuộn ngang. Chọn một tập sản phẩm từ `src/data/products.ts`.

**Props:** Không có.

**Cách dùng:**
```tsx
<TrendingProducts />
```

---

### NewsSection

**File:** `src/components/home/NewsSection.tsx`

**Mục đích:** Hiển thị các bài viết tin tức mới nhất trên trang chủ theo lưới 3 cột.

**Props:**
```ts
{ articles: NewsArticle[] }
```

**Cách dùng:**
```tsx
import { news } from "~/data/news";
<NewsSection articles={news.slice(0, 3)} />
```

---

### PartnerCarousel

**File:** `src/components/home/PartnerCarousel.tsx`

**Mục đích:** Carousel tự động chạy hiển thị logo các công ty đối tác ở cuối trang chủ.

**Props:** Không có — dữ liệu đối tác được hard-code trong component.

**Cách dùng:**
```tsx
<PartnerCarousel />
```

---

## 6. Admin Components

### AdminSidebar

**File:** `src/components/admin/AdminSidebar.tsx`

**Mục đích:** Sidebar điều hướng bên trái cho trang quản trị. Desktop: sidebar cố định. Mobile: nút hamburger mở panel trượt `Sheet`. Chứa link đến tất cả các section admin.

**Props:** Không có — dùng `usePathname()` để đánh dấu link hiện tại.

**Cách dùng:**
```tsx
// Được dùng bởi (admin)/quan-tri/layout.tsx
<AdminSidebar />
```

---

### AdminPinGate

**File:** `src/components/admin/AdminPinGate.tsx`

**Mục đích:** Bao bọc các trang admin với màn hình nhập PIN. Render dialog nhập PIN cho đến khi người dùng nhập đúng. PIN mặc định là `1234`. PIN không được lưu lại (hỏi lại mỗi phiên).

**Props:**
```ts
{ children: React.ReactNode }
```

**Cách dùng:**
```tsx
<AdminPinGate>
  <AdminDashboard />
</AdminPinGate>
```

---

### RevenueChart

**File:** `src/components/admin/RevenueChart.tsx`

**Mục đích:** Biểu đồ cột doanh thu theo tháng dùng Recharts. Dữ liệu đến từ `src/data/admin/reports.ts`.

**Props:** Không có.

**Cách dùng:**
```tsx
<RevenueChart />
```

---

### TopProductsChart

**File:** `src/components/admin/TopProductsChart.tsx`

**Mục đích:** Biểu đồ cột ngang hiển thị sản phẩm bán chạy nhất theo doanh thu. Dùng Recharts.

**Props:** Không có.

**Cách dùng:**
```tsx
<TopProductsChart />
```

---

### CustomerSegmentsChart

**File:** `src/components/admin/CustomerSegmentsChart.tsx`

**Mục đích:** Biểu đồ tròn hiển thị phân khúc khách hàng: mới, quay lại, và không hoạt động. Dùng Recharts.

**Props:** Không có.

**Cách dùng:**
```tsx
<CustomerSegmentsChart />
```

---

## 7. Account Components

Các component này được dùng trên trang `/tai-khoan`. Tất cả đều là client component đọc từ context hoặc localStorage.

### ProfileForm

**File:** `src/components/account/ProfileForm.tsx`

**Mục đích:** Form chỉnh sửa hồ sơ người dùng (tên, điện thoại, công ty). Lưu thay đổi vào localStorage qua `AuthContext`.

**Props:** Không có — đọc từ `useAuth()`.

---

### OrderHistory

**File:** `src/components/account/OrderHistory.tsx`

**Mục đích:** Danh sách đơn hàng đã đặt bởi người dùng này (đọc từ localStorage `haingoc_v2_orders`). Hiển thị mã đơn hàng, ngày đặt, trạng thái, và tổng tiền.

**Props:** Không có.

---

### QuotationHistory

**File:** `src/components/account/QuotationHistory.tsx`

**Mục đích:** Danh sách yêu cầu báo giá đã gửi qua form `/bao-gia` (đọc từ localStorage).

**Props:** Không có.

---

### WishlistSection

**File:** `src/components/account/WishlistSection.tsx`

**Mục đích:** Lưới sản phẩm người dùng đã thêm vào wishlist. Đọc slug từ `useWishlist()`, tra cứu dữ liệu sản phẩm đầy đủ từ `src/data/products.ts`.

**Props:** Không có.

---

### StatsCards

**File:** `src/components/account/StatsCards.tsx`

**Mục đích:** Thẻ KPI tóm tắt cho người dùng: tổng đơn hàng, tổng chi tiêu, sản phẩm trong giỏ hàng, sản phẩm trong wishlist.

**Props:** Không có.

---

### DebtTrackingCard

**File:** `src/components/account/DebtTrackingCard.tsx`

**Mục đích:** Hiển thị thông tin công nợ còn lại và hạn mức tín dụng mẫu cho khách hàng B2B.

**Props:** Không có.

---

### SupportForm

**File:** `src/components/account/SupportForm.tsx`

**Mục đích:** Form gửi yêu cầu hỗ trợ đơn giản trong section tài khoản. Submit local với thông báo toast thành công.

**Props:** Không có.

---

## 8. Search Components

### SearchPageClient

**File:** `src/components/search/SearchPageClient.tsx`

**Mục đích:** Toàn bộ client component trang kết quả tìm kiếm. Đọc tham số URL `q`, lọc sản phẩm theo tên, mô tả, xuất xứ, tiêu chuẩn, và vật liệu, sau đó render `ProductGrid`.

**Props:**
```ts
{ products: Product[] }
```

**Cách dùng:**
```tsx
// Được dùng bởi tim-kiem/page.tsx
<SearchPageClient products={products} />
```

---

## 9. News Components

### NewsCard

**File:** `src/components/news/NewsCard.tsx`

**Mục đích:** Component card hiển thị tóm tắt bài viết tin tức: ảnh bìa, tiêu đề, ngày đăng, và trích dẫn. Link đến trang chi tiết bài viết tại `/tin-tuc/[slug]`.

**Props:**
```ts
{ article: NewsArticle }
```

**Cách dùng:**
```tsx
import { NewsCard } from "~/components/news/NewsCard";

articles.map(a => <NewsCard key={a.slug} article={a} />)
```

---

## 10. Contact Components

### ContactForm

**File:** `src/components/contact/ContactForm.tsx`

**Mục đích:** Form liên hệ trên trang `/lien-he`. Các trường: họ tên, email, điện thoại, chủ đề, nội dung. Khi submit, hiển thị thông báo toast thành công (không gửi email thật).

**Props:** Không có.

**Cách dùng:**
```tsx
<ContactForm />
```

---

## 11. UI Primitives (ShadCN)

Các component này nằm trong `src/components/ui/` và được copy từ ShadCN UI. Bạn có thể chỉnh sửa trực tiếp. Dưới đây là tham khảo nhanh cho từng component và pattern sử dụng điển hình.

### Badge

**File:** `src/components/ui/badge.tsx`

**Mục đích:** Nhãn màu nhỏ cho chỉ thị trạng thái (ví dụ: "Còn hàng", "Hết hàng").

```tsx
import { Badge } from "~/components/ui/badge";

<Badge className="bg-green-100 text-green-700">Còn hàng</Badge>
```

---

### Button

**File:** `src/components/ui/button.tsx`

**Mục đích:** Nút bấm có style với các variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`. Sizes: `default`, `sm`, `lg`, `icon`.

```tsx
import { Button } from "~/components/ui/button";

<Button variant="outline" size="sm">Nhấn vào đây</Button>
```

---

### Breadcrumb

**File:** `src/components/ui/breadcrumb.tsx`

**Mục đích:** Điều hướng breadcrumb có accessibility (hỗ trợ ARIA) với các phần có thể kết hợp.

```tsx
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Trang chu</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>San pham</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

### Input

**File:** `src/components/ui/input.tsx`

**Mục đích:** Trường input văn bản có style.

```tsx
import { Input } from "~/components/ui/input";

<Input type="text" placeholder="Ten cong ty" />
```

---

### Textarea

**File:** `src/components/ui/textarea.tsx`

**Mục đích:** Input văn bản nhiều dòng có style.

```tsx
import { Textarea } from "~/components/ui/textarea";

<Textarea placeholder="Ghi chu..." rows={4} />
```

---

### Select

**File:** `src/components/ui/select.tsx`

**Mục đích:** Dropdown chọn có style và hỗ trợ accessibility.

```tsx
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "~/components/ui/select";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Chon loai" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="retail">Ban le</SelectItem>
    <SelectItem value="dealer">Dai ly</SelectItem>
  </SelectContent>
</Select>
```

---

### Dialog

**File:** `src/components/ui/dialog.tsx`

**Mục đích:** Modal dialog với overlay. Dùng trong trang quản trị cho các form thêm/sửa.

```tsx
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger,
} from "~/components/ui/dialog";

<Dialog>
  <DialogTrigger>Mở</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Them san pham</DialogTitle>
    </DialogHeader>
    {/* nội dung form */}
  </DialogContent>
</Dialog>
```

---

### Sheet

**File:** `src/components/ui/sheet.tsx`

**Mục đích:** Panel trượt từ cạnh màn hình. Dùng cho nav mobile và bộ lọc sản phẩm mobile.

```tsx
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

<Sheet>
  <SheetTrigger>Mở bộ lọc</SheetTrigger>
  <SheetContent side="left">
    {/* panel bộ lọc */}
  </SheetContent>
</Sheet>
```

---

### Separator

**File:** `src/components/ui/separator.tsx`

**Mục đích:** Đường phân cách ngang hoặc dọc.

```tsx
import { Separator } from "~/components/ui/separator";

<Separator className="my-4" />
```

---

### Sonner (Toaster)

**File:** `src/components/ui/sonner.tsx`

**Mục đích:** Bao bọc component `Toaster` của package `sonner`. Được mount một lần trong root layout. Dùng hàm `toast()` để kích hoạt thông báo từ bất kỳ đâu.

```tsx
// Trong root layout (đã được cài đặt sẵn):
import { Toaster } from "~/components/ui/sonner";
<Toaster />

// Trong bất kỳ client component nào:
import { toast } from "sonner";
toast("Da them vao gio hang");
toast.error("Co loi xay ra");
```

---

### Carousel

**File:** `src/components/ui/carousel.tsx`

**Mục đích:** Bao bọc ShadCN cho Embla Carousel. Dùng cho `HeroBanner` và `PartnerCarousel`. Hỗ trợ tự động chạy qua plugin `embla-carousel-autoplay`.

```tsx
import {
  Carousel, CarouselContent, CarouselItem,
  CarouselNext, CarouselPrevious,
} from "~/components/ui/carousel";

<Carousel>
  <CarouselContent>
    <CarouselItem>Slide 1</CarouselItem>
    <CarouselItem>Slide 2</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```
