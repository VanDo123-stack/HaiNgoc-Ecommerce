"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer>
      {/* Top section */}
      <div className="bg-blue-900 py-10 text-white">
        <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Company info */}
          <div>
            <h3 className="mb-4 text-lg font-light text-blue-300">
              Về Hải Ngọc
            </h3>
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Hải Ngọc"
                width={120}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-sm leading-relaxed text-white/70">
              Chuyên cung cấp vật tư công nghiệp cho ngành cơ khí và dầu khí.
              Đối tác tin cậy của các doanh nghiệp sản xuất và xây dựng.
            </p>
          </div>

          {/* Column 2: Quick links */}
          <div>
            <h3 className="mb-4 text-lg font-light text-blue-300">
              Liên kết nhanh
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/san-pham"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                Sản phẩm
              </Link>
              <Link
                href="/tin-tuc"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                Tin tức
              </Link>
              <Link
                href="/lien-he"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                Liên hệ
              </Link>
              <Link
                href="/dich-vu-gia-cong"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                Dịch vụ gia công
              </Link>
              <Link
                href="/ho-tro-ky-thuat"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                Hỗ trợ kỹ thuật
              </Link>
              <Link
                href="/tai-khoan"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                Tài khoản
              </Link>
            </nav>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="mb-4 text-lg font-light text-blue-300">Liên hệ</h3>
            <ul className="flex flex-col gap-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" />
                <span>
                  172 Nguyễn Tri Phương, Phường 7, TP. Vũng Tàu, Bà Rịa-Vũng Tàu
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-blue-300" />
                <span>(+84) 28 1234 5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-blue-300" />
                <span>info@haingoc.com.vn</span>
              </li>
            </ul>

            {/* Map */}
            <h3 className="mb-3 mt-6 text-lg font-light text-blue-300">
              Bản đồ
            </h3>
            <div className="overflow-hidden rounded-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.0!2d107.0843!3d10.3460!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31756fce89d1e9d3%3A0x1234567890abcdef!2s172%20Nguy%E1%BB%85n%20Tri%20Ph%C6%B0%C6%A1ng%2C%20Ph%C6%B0%E1%BB%9Dng%207%2C%20V%C5%A9ng%20T%C3%A0u!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
                width="100%"
                height="120"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vị trí Hải Ngọc"
              />
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="mb-4 text-lg font-light text-blue-300">
              Đăng ký nhận bản tin
            </h3>
            <p className="mb-4 text-sm text-white/70">
              Nhận thông tin khuyến mãi và sản phẩm mới nhất từ Hải Ngọc.
            </p>
            <form
              className="flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Địa chỉ email"
                className="h-9 flex-1 rounded-md border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/40"
              />
              <button
                type="submit"
                className="h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500"
              >
                Gửi
              </button>
            </form>

            <h3 className="mb-3 mt-6 text-lg font-light text-blue-300">
              Thông tin
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/dieu-khoan-su-dung"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                Điều khoản sử dụng
              </Link>
              <Link
                href="/chinh-sach-bao-mat"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                Chính sách bảo mật
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-blue-950 py-4 text-center text-sm text-white/60">
        <div className="container mx-auto max-w-7xl px-4">
          <p>
            &copy; {new Date().getFullYear()} Hải Ngọc. Chuyên cung cấp vật tư
            công nghiệp cơ khí và dầu khí.
          </p>
        </div>
      </div>
    </footer>
  );
}
