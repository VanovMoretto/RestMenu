import { useState } from "react";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Hours from "./components/Hours";
import Location from "./components/Location";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import "./App.css";
import ScrollToTop from "./components/ScrollToTop";
import type { MenuItemData } from "./hooks/useMenu";
import CartProvider from "./cart/CartProvider";
import CartBar from "./checkout/CartBar";
import CheckoutSheet from "./checkout/CheckoutSheet";

function App() {
  const [selectedItem, setSelectedItem] = useState<MenuItemData | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <CartProvider>
      <div className="container">
        <Navbar />
        <Header />
        <Menu onSelectItem={setSelectedItem} />
        <Hours />
        <Location />
        <Footer />
        <ScrollToTop />
        <Modal
          key={selectedItem?.id ?? "none"} // zera quantidade/observação a cada prato
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
        />
        {!checkoutOpen && <CartBar onOpen={() => setCheckoutOpen(true)} />}
        {checkoutOpen && <CheckoutSheet onClose={() => setCheckoutOpen(false)} />}
      </div>
    </CartProvider>
  );
}

export default App;
