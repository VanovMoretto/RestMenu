import { useState, useEffect, useRef } from "react";
import { ChevronUp } from "lucide-react";
import styles from "./ScrollToTop.module.css";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOverFooter, setIsOverFooter] = useState(false);
  
  // Referência direta ao elemento do botão no DOM
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleScroll = () => {
    // 1. Visibilidade (aparece após 300px)
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }

    // 2. Colisão Precisa usando a posição REAL do botão
    const footer = document.querySelector('footer');
    
    // Só calculamos se o botão estiver visível e o footer existir
    if (footer && buttonRef.current) {
      const footerRect = footer.getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();
      
      // O Ponto de Gatilho é: A linha de baixo do botão MENOS 49% da altura dele.
      // Ou seja, queremos que troque quando o footer cobrir quase metade do botão.
      const triggerPoint = buttonRect.bottom - (buttonRect.height * 0.49);
      if (footerRect.top <= triggerPoint) {
        setIsOverFooter(true);
      } else {
        setIsOverFooter(false);
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); 
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible]); 

  if (!isVisible) {
    return null;
  }

  return (
    <button 
      ref={buttonRef} // <--- Ligamos o botão à nossa referência aqui
      className={`${styles.button} ${isOverFooter ? styles.inverse : ''}`} 
      onClick={scrollToTop}
    >
      <ChevronUp size={28} strokeWidth={2.5} />
    </button>
  );
};

export default ScrollToTop;