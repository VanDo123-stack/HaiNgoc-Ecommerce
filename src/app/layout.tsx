import "~/styles/globals.css";

import { type Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://haingoc.com.vn"),
  title: "Hải Ngọc - Vật tư công nghiệp",
  description:
    "Cung cấp vật tư công nghiệp cho ngành cơ khí và dầu khí. Que hàn Kobelco, máy mài, dụng cụ cắt hàn chuyên dụng.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "Hải Ngọc - Vật tư công nghiệp",
    description:
      "Cung cấp vật tư công nghiệp cho ngành cơ khí và dầu khí. Que hàn Kobelco, máy mài, dụng cụ cắt hàn chuyên dụng.",
    siteName: "Hải Ngọc - Vật tư công nghiệp",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 200,
        height: 200,
        alt: "Logo Hải Ngọc",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Hải Ngọc - Vật tư công nghiệp",
    description:
      "Cung cấp vật tư công nghiệp cho ngành cơ khí và dầu khí. Que hàn Kobelco, máy mài, dụng cụ cắt hàn chuyên dụng.",
  },
};

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="font-sans antialiased">
        <TRPCReactProvider>
          {children}
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
