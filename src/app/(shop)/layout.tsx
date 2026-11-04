import type { ReactNode } from "react";
import { CartModalProvider } from "@/components/cart";
import { Footer, Header, ShopBottomNav } from "@/components/layout";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <CartModalProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ShopBottomNav />
    </CartModalProvider>
  );
}
