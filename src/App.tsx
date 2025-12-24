import { useState } from "react";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Hours from "./components/Hours";
import Location from "./components/Location";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <div className="container">
      <Navbar /> 
      <Header />
      <Menu onSelectItem={setSelectedItem} />
      <Hours />
      <Location />
      <Footer />
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />
    </div>
  );
}

export default App;