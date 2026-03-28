# Tài Liệu Tính Năng

Tài liệu này mô tả từng tính năng chính của nền tảng Hải Ngọc B2B e-commerce, cách hoạt động về mặt kỹ thuật, và nơi tìm code liên quan.

---

## Mục Lục

1. [Xác thực (Authentication)](#1-xác-thực-authentication)
2. [Danh sách sản phẩm](#2-danh-sách-sản-phẩm)
3. [Trang chi tiết sản phẩm](#3-trang-chi-tiết-sản-phẩm)
4. [Hệ thống giỏ hàng](#4-hệ-thống-giỏ-hàng)
5. [Danh sách yêu thích (Wishlist)](#5-danh-sách-yêu-thích-wishlist)
6. [Quy trình thanh toán (Checkout)](#6-quy-trình-thanh-toán-checkout)
7. [Quy trình báo giá](#7-quy-trình-báo-giá)
8. [Tìm kiếm](#8-tìm-kiếm)
9. [Trang quản trị (Admin Dashboard)](#9-trang-quản-trị-admin-dashboard)
10. [Tin tức](#10-tin-tức)
11. [Trang liên hệ](#11-trang-liên-hệ)
12. [Carousel đối tác](#12-carousel-đối-tác)
13. [Trang chính sách](#13-trang-chính-sách)

---

## 1. Xác Thực (Authentication)

**Route:** `/dang-nhap`, `/dang-ky`, `/tai-khoan`

**Context:** `src/context/AuthContext.tsx`

Xác thực hoàn toàn là giả lập — không có server hay JWT nào liên quan. Toàn bộ dữ liệu người dùng được lưu trong `localStorage`.

### Cách hoạt động

- Khi ứng dụng khởi động, `AuthProvider` đọc key `haingoc_v2_auth_user` từ `localStorage` và khôi phục state `user`.
- Một tài khoản demo mặc định được tạo vào `haingoc_v2_auth_accounts` khi lần đầu tải nếu chưa có tài khoản nào.
- `login(email, password)` tìm kiếm trong mảng tài khoản đã lưu để khớp thông tin. Trả về `true` nếu thành công, `false` nếu thất bại.
- `register(user, password)` kiểm tra email trùng lặp, sau đó thêm vào mảng tài khoản. Trả về `false` nếu email đã tồn tại.
- `logout()` xóa state `user` và xóa `haingoc_v2_auth_user` khỏi localStorage.

### Tài khoản demo

```
Email:    demo@haingoc.com.vn
Mật khẩu: 123456
```

### Cấu trúc User

```ts
interface User {
  name: string;
  email: string;
  phone: string;
  company: string;
}
```

### Dùng xác thực trong component

```tsx
"use client";
import { useAuth } from "~/context/AuthContext";

function MyComponent() {
  const { user, login, logout, isLoading } = useAuth();

  if (isLoading) return <p>Đang tải...</p>;
  if (!user) return <p>Vui lòng đăng nhập.</p>;

  return <p>Xin chào, {user.name}</p>;
}
```

### Các section trong trang tài khoản

Trang tài khoản tại `/tai-khoan` hiển thị nhiều sub-component:

- `ProfileForm` — chỉnh sửa tên, điện thoại, công ty
- `OrderHistory` — danh sách đơn hàng đã đặt từ localStorage
- `QuotationHistory` — danh sách yêu cầu báo giá đã gửi
- `WishlistSection` — sản phẩm đã thêm vào danh sách yêu thích
- `StatsCards` — tóm tắt số lượng đơn hàng và chi tiêu
- `DebtTrackingCard` — dữ liệu công nợ mẫu
- `SupportForm` — form gửi yêu cầu hỗ trợ nội bộ

---

## 2. Danh Sách Sản Phẩm

**Route:** `/san-pham`

**Components:** `src/components/product/ProductListingClient.tsx`, `ProductFilters.tsx`, `ProductSort.tsx`, `ProductGrid.tsx`

### Nguồn dữ liệu

Toàn bộ sản phẩm đến từ mảng tĩnh được export bởi `src/data/products.ts`. Không có request mạng nào được thực hiện.

### Lọc theo URL

Bộ lọc được đọc từ URL search parameters, không phải từ component state. Điều này cho phép bookmark và chia sẻ URL đã lọc. Các tham số được hỗ trợ:

| Tham số | Mô tả |
|---|---|
| `category` | Lọc theo slug danh mục (ví dụ: `?category=que-han`) |
| `origin` | Lọc theo xuất xứ sản phẩm |
| `standard` | Lọc theo tiêu chuẩn |
| `standardType` | Lọc theo loại tiêu chuẩn: `JIS`, `ASTM`, `DIN`, `AWS`, `other` |
| `materialGrade` | Lọc theo mác vật liệu (ví dụ: `E7018`) |
| `dimensionCategory` | Lọc theo kích thước (ví dụ: `3.2mm`) |
| `sort` | Thứ tự sắp xếp: `newest` (mặc định), `name`, `price` |

### Sidebar bộ lọc

`ProductFilters` đọc mảng sản phẩm hiện tại để tạo các giá trị bộ lọc có sẵn một cách động. Chỉ hiển thị các giá trị thực sự xuất hiện trong dữ liệu sản phẩm, tránh hiển thị bộ lọc không có kết quả.

Trên mobile, panel bộ lọc mở trong ShadCN `Sheet` (panel trượt từ cạnh màn hình) được kích hoạt bằng một nút.

### Sắp xếp

`ProductSort` hiển thị dropdown chọn kiểu sắp xếp. Logic sắp xếp chạy trong `ProductListingClient`:

- `newest` — giữ nguyên thứ tự mảng gốc từ `products.ts` (thứ tự khi thu thập dữ liệu)
- `name` — sắp xếp theo bảng chữ cái dùng `localeCompare` với locale tiếng Việt (`vi`)
- `price` — sắp xếp tăng dần theo số; sản phẩm có `price: null` xuất hiện cuối

### Breadcrumb

Khi bộ lọc danh mục được kích hoạt, breadcrumb hiển thị `Trang chủ > Sản phẩm > [Tên danh mục]`.

---

## 3. Trang Chi Tiết Sản Phẩm

**Route:** `/san-pham/[slug]`

**File:** `src/app/(storefront)/san-pham/[slug]/page.tsx`

**Component chính:** `src/components/product/ProductDetail.tsx`

### Cách trang tải

Trang là một server component Next.js. Nó dùng `generateStaticParams` để pre-render tất cả slug sản phẩm lúc build:

```ts
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
```

Sản phẩm được tìm bằng `products.find(p => p.slug === params.slug)`. Nếu không tìm thấy, trang gọi `notFound()` để hiển thị trang 404.

### Thư viện ảnh

`src/components/product/ImageGallery.tsx` hiển thị mảng `images` của sản phẩm. Người dùng click vào thumbnail để chuyển ảnh chính. Hầu hết sản phẩm có một ảnh thật cùng các SVG placeholder.

### Hiển thị giá

`src/components/product/PriceDisplay.tsx` xử lý ba trường hợp:
- `price: null` — hiển thị "Liên hệ để biết giá"
- Có `salePrice` và khác `price` — hiển thị giá khuyến mãi màu đỏ + giá gốc gạch ngang
- Giá thông thường — hiển thị giá định dạng VND

### Thêm vào giỏ hàng

`src/components/product/AddToCartArea.tsx` là client component chứa bộ chọn số lượng và nút "Thêm vào giỏ". Nó gọi `useCart().addItem(slug, quantity)` khi submit.

### Đánh giá

`src/components/product/ReviewSection.tsx` hiển thị đánh giá mẫu từ `src/data/reviews.ts`. Đánh giá không gắn với người dùng hay đơn hàng thật.

### Sản phẩm liên quan

`src/components/product/RelatedProducts.tsx` đọc `product.relatedSlugs`, tra cứu các sản phẩm đó và hiển thị `ProductGrid` nhỏ.

---

## 4. Hệ Thống Giỏ Hàng

**Route:** `/gio-hang`

**Context:** `src/context/CartContext.tsx`

### Lưu trữ

Giỏ hàng được lưu vào `localStorage` với key `haingoc_v2_cart`. Mỗi item trong giỏ chỉ chứa `slug` và `quantity` của sản phẩm — không lưu toàn bộ dữ liệu sản phẩm. Dữ liệu sản phẩm đầy đủ được tra cứu từ `src/data/products.ts` khi render trang giỏ hàng.

Khi mount lần đầu, context tự động migrate các key cũ `haingoc_cart` (v1) sang namespace mới.

### Cấu trúc cart item

```ts
interface CartItem {
  slug: string;
  quantity: number;
}
```

### Context API

```ts
{
  items: CartItem[];
  addItem: (slug: string, quantity: number) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
  totalItems: number;  // tổng số lượng tất cả sản phẩm, hiển thị trên badge icon giỏ hàng
}
```

- `addItem` tăng số lượng nếu sản phẩm đã có trong giỏ. Số lượng tối đa mỗi sản phẩm là 999.
- `updateQuantity` với `quantity <= 0` sẽ xóa sản phẩm khỏi giỏ.
- `clearCart` làm trống giỏ hàng và xóa localStorage.

### Các component trang giỏ hàng

- `CartItemsTable` — layout bảng với một `CartRow` cho mỗi sản phẩm
- `CartRow` — một hàng trong bảng với ảnh, tên, điều chỉnh số lượng, giá, nút xóa
- `OrderSummary` — tổng số lượng, tổng giá ước tính, link đến checkout
- `CartPromoBanner` — banner thông báo khuyến mãi phía trên giỏ hàng
- `CartCrossSell` — hiển thị sản phẩm từ danh mục liên quan như gợi ý
- `EmptyCart` — hiển thị khi giỏ hàng trống, có link quay lại trang sản phẩm

### Badge giỏ hàng trong header

`src/components/layout/CartBadge.tsx` đọc `totalItems` từ `useCart()` và hiển thị badge đỏ trên icon giỏ hàng.

---

## 5. Danh Sách Yêu Thích (Wishlist)

**Context:** `src/context/WishlistContext.tsx`

**Storage key:** `haingoc_v2_wishlist`

Wishlist lưu mảng các chuỗi `slug` của sản phẩm và được lưu vào `localStorage`.

### Context API

```ts
{
  slugs: string[];
  addToWishlist: (slug: string) => void;
  removeFromWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  toggleWishlist: (slug: string) => void;
}
```

### Nơi wishlist được sử dụng

- `ProductCard` — hiển thị nút icon trái tim xuất hiện khi hover. Click để bật/tắt wishlist và hiện thông báo toast.
- `WishlistSection` trong trang tài khoản — hiển thị tất cả sản phẩm trong wishlist.
- Trang `ProductDetail` — cũng có nút toggle wishlist.

### Cách dùng hook wishlist

```tsx
"use client";
import { useWishlist } from "~/context/WishlistContext";

function HeartButton({ slug }: { slug: string }) {
  const { isWishlisted, toggleWishlist } = useWishlist();

  return (
    <button onClick={() => toggleWishlist(slug)}>
      {isWishlisted(slug) ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
    </button>
  );
}
```

---

## 6. Quy Trình Thanh Toán (Checkout)

**Route:** `/thanh-toan` → `/xac-nhan`

**File:** `src/app/(storefront)/thanh-toan/page.tsx`

### Tổng quan quy trình

```
Giỏ hàng (/gio-hang) → Thanh toán (/thanh-toan) → Xác nhận (/xac-nhan)
```

### Các trường trong form checkout

Form checkout theo hướng B2B, thu thập:

| Trường | Mô tả |
|---|---|
| Tên công ty | Tên công ty |
| Mã số thuế (MST) | Mã số thuế — được kiểm tra 10 hoặc 13 chữ số |
| Địa chỉ kinh doanh | Địa chỉ kinh doanh |
| Tên người nhận | Tên người nhận hàng |
| Điện thoại | Số điện thoại Việt Nam hợp lệ |
| Tùy chọn giao hàng | "deliver" (giao tận nơi) hoặc "pickup" (tự lấy) |
| Địa chỉ giao hàng | Bắt buộc khi chọn giao tận nơi |
| Ghi chú | Tùy chọn |
| Phương thức thanh toán | "bank" (chuyển khoản), "credit" (công nợ), "cod" (tiền mặt) |

### Thông tin chuyển khoản ngân hàng

Khi chọn "chuyển khoản ngân hàng", `BankTransferCard` hiển thị:
- Số tài khoản ngân hàng
- Tên ngân hàng
- Tên chủ tài khoản
- Ảnh mã QR để chuyển khoản

### Kiểm tra form (Form validation)

Kiểm tra phía client chạy khi submit. Thông báo lỗi xuất hiện ngay dưới mỗi trường. Form không gửi cho đến khi tất cả trường bắt buộc hợp lệ.

### Điều gì xảy ra khi submit

1. Các sản phẩm trong giỏ được kết hợp với dữ liệu form thành object `AdminOrder`.
2. Đơn hàng được ghi vào `localStorage` với key `haingoc_v2_orders` để xuất hiện trong danh sách đơn hàng của trang quản trị.
3. Giỏ hàng được xóa.
4. Người dùng được chuyển đến `/xac-nhan`.

### Trang xác nhận

`ConfirmationContent` đọc đơn hàng từ URL state (hoặc localStorage) và hiển thị:
- Mã đơn hàng
- Sản phẩm đã đặt
- Tổng tiền
- Hướng dẫn chuyển khoản
- Nhắc nhở ghi mã đơn hàng vào nội dung chuyển khoản

---

## 7. Quy Trình Báo Giá

**Route:** `/bao-gia`

**Component:** `src/components/checkout/QuotationForm.tsx`

Form báo giá cho phép khách hàng yêu cầu báo giá mà không cần qua giỏ hàng. Thu thập:

- Tên công ty
- Tên người liên hệ
- Điện thoại
- Email
- Mô tả sản phẩm và số lượng (textarea tự do)
- Ghi chú / yêu cầu đặc biệt

Khi submit, yêu cầu báo giá được lưu vào `localStorage` và hiển thị thông báo thành công. Không có gửi email nào xảy ra.

---

## 8. Tìm Kiếm

**Route:** `/tim-kiem`

**Component:** `src/components/search/SearchPageClient.tsx`

### Cách tìm kiếm hoạt động

Tìm kiếm được điều khiển bởi URL. Từ khóa tìm kiếm được đọc từ tham số URL `q`. Điều này cho phép bookmark và chia sẻ kết quả tìm kiếm.

Component `HeaderSearchInput` (trong header) cập nhật URL khi người dùng nhập và nhấn Enter hoặc click nút tìm kiếm. Phiên bản mobile dùng `SearchDropdown`.

### Logic tìm kiếm

Lọc phía client chạy trên tất cả sản phẩm. Sản phẩm khớp nếu từ khóa tìm kiếm xuất hiện (không phân biệt hoa/thường) trong bất kỳ trường nào sau:

- Tên sản phẩm (`name`)
- Mô tả sản phẩm (`description`)
- Xuất xứ (`origin`)
- Tiêu chuẩn (`standard`)
- Vật liệu (`material`)

### Hiển thị kết quả tìm kiếm

Kết quả được hiển thị trong `ProductGrid`. Nếu không có kết quả nào khớp, sẽ hiển thị thông báo trạng thái trống.

---

## 9. Trang Quản Trị (Admin Dashboard)

**Tiền tố route:** `/quan-tri`

**Bảo vệ bằng PIN:** `src/components/admin/AdminPinGate.tsx` — PIN mặc định là `1234`

Trang quản trị là một route group riêng `(admin)` với layout riêng (`AdminSidebar` thay vì Header/Footer của storefront).

### Tổng quan dashboard (`/quan-tri`)

Hiển thị các thẻ tóm tắt KPI:
- Tổng đơn hàng
- Tổng doanh thu
- Số lượng khách hàng
- Số lượng sản phẩm

Dữ liệu đến từ các file dữ liệu mẫu trong `src/data/admin/`.

### Quản lý sản phẩm (`/quan-tri/san-pham`)

Hiển thị bảng tất cả sản phẩm từ `src/data/products.ts` với:
- Dialog thêm sản phẩm (form thêm vào danh sách trong bộ nhớ — không lưu giữa các phiên)
- Dialog chỉnh sửa sản phẩm
- Xóa sản phẩm (xóa khỏi danh sách trong bộ nhớ)

Lưu ý: Thay đổi ở đây không được ghi ngược lại vào `products.ts`. Chỉ tồn tại trong phiên hiện tại.

### Quản lý đơn hàng (`/quan-tri/don-hang`)

Hiển thị đơn hàng từ hai nguồn:
1. Đơn hàng mẫu trong `src/data/admin/orders.ts` (tĩnh)
2. Đơn hàng đã submit qua trang checkout (từ `localStorage`)

Tính năng:
- Lọc đơn hàng theo trạng thái: Mới / Đã báo giá / Đang giao / Hoàn thành
- Thay đổi trạng thái đơn hàng qua dropdown
- **Tạo PDF báo giá**: click "Tạo PDF" trên đơn hàng sẽ gọi `generateQuotePdf()` và kích hoạt tải xuống tài liệu PDF báo giá
- **Đính kèm file**: đơn hàng có thể đính kèm CO (Certificate of Origin), CQ (Certificate of Quality), hóa đơn, hoặc tài liệu khác. Các file đính kèm được lưu dưới dạng object URL trong phiên hiện tại (không lưu lâu dài).

### Quản lý khách hàng (`/quan-tri/khach-hang`)

Hiển thị khách hàng từ `src/data/admin/customers.ts`. Thông tin khách hàng bao gồm tên công ty, người liên hệ, điện thoại, email, loại khách (bán lẻ / đại lý / dự án), tổng đơn hàng, tổng chi tiêu, công nợ, và hạn mức tín dụng.

### Báo cáo (`/quan-tri/bao-cao`)

Hiển thị ba biểu đồ sử dụng Recharts:
- `RevenueChart` — biểu đồ cột doanh thu theo tháng
- `TopProductsChart` — biểu đồ cột ngang sản phẩm bán chạy nhất
- `CustomerSegmentsChart` — biểu đồ tròn phân khúc khách hàng mới / quay lại / không hoạt động

Dữ liệu đến từ `src/data/admin/reports.ts`.

### Tạo PDF

`src/lib/generate-quote-pdf.ts` dùng jsPDF với font Roboto (nhúng dưới dạng base64 trong `src/lib/fonts/roboto.ts`) để tạo PDF có ký tự tiếng Việt (dấu thanh). PDF bao gồm:
- Header công ty
- Mã báo giá và ngày
- Thông tin khách hàng
- Bảng sản phẩm đơn hàng với đơn giá và tổng
- Tổng tiền theo VND

---

## 10. Tin Tức

**Route:** `/tin-tuc`, `/tin-tuc/[slug]`

**Dữ liệu:** `src/data/news.ts`

**Kiểu:** `src/types/news.ts`

Bài viết tin tức là dữ liệu tĩnh. Mỗi bài có:
- `slug` — định danh trên URL
- `title` — tiêu đề bài viết
- `summary` — mô tả ngắn
- `content` — nội dung đầy đủ (chuỗi HTML hoặc văn bản thuần)
- `date` — ngày đăng
- `image` — ảnh bìa tùy chọn

Trang danh sách tin tức hiển thị bài viết dạng lưới dùng component `NewsCard`. Trang chi tiết hiển thị bài viết đầy đủ.

Trên trang chủ, `NewsSection` hiển thị ba bài viết mới nhất (dùng `news.slice(0, 3)`).

---

## 11. Trang Liên Hệ

**Route:** `/lien-he`

**Component:** `src/components/contact/ContactForm.tsx`

Trang liên hệ bao gồm:
- Form liên hệ với các trường: họ tên, email, điện thoại, chủ đề, nội dung
- Thông tin liên hệ: địa chỉ, điện thoại, email
- Danh sách chi nhánh
- Iframe Google Maps nhúng hiển thị vị trí tại TP. Hồ Chí Minh

Form liên hệ submit ở local (không gửi email). Sau khi submit, thông báo toast xác nhận tin nhắn đã được "gửi".

---

## 12. Carousel Đối Tác

**Component:** `src/components/home/PartnerCarousel.tsx`

**Vị trí trên trang chủ:** Section cuối, phía trên footer

Dùng Embla Carousel với plugin autoplay để hiển thị logo của các công ty đối tác. Logo được lưu trong `public/images/partners/`.

Để thêm đối tác mới:
1. Đặt logo vào `public/images/partners/`.
2. Thêm entry vào mảng `partners` trong `PartnerCarousel.tsx`.

---

## 13. Trang Chính Sách

Cả hai trang chính sách đều là các trang nội dung tĩnh đơn giản.

| Route | File |
|---|---|
| `/chinh-sach-bao-mat` | `(storefront)/chinh-sach-bao-mat/page.tsx` |
| `/dieu-khoan-su-dung` | `(storefront)/dieu-khoan-su-dung/page.tsx` |

Đây là các server component thuần túy với nội dung tiếng Việt được hard-code. Để cập nhật nội dung chính sách, chỉnh sửa trực tiếp nội dung JSX trong các file đó.

Link đến cả hai trang xuất hiện trong footer dưới cột "Thông tin".
