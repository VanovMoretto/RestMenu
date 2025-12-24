import { useState } from "react";
import Navbar from "./components/Navbar"; // Importação Nova
import Header from "./components/Header";
import Menu from "./components/Menu";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <div className="container">
      <Navbar /> 
      
      <Header />
      <Menu onSelectItem={setSelectedItem} />

      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />
    </div>
  );
}

export default App;