import { Header } from "~/components/layout/Header";
import { Footer } from "~/components/layout/Footer";
import { AuthProvider } from "~/context/AuthContext";
import { CartProvider } from "~/context/CartContext";
import { WishlistProvider } from "~/context/WishlistContext";


export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Header />
          {children}
          <Footer />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
