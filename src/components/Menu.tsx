// src/components/Menu.tsx
import { useState } from "react";
import styles from "./Menu.module.css";
import Tabs from "./Tabs";
import MenuItem from "./MenuItem";
import MenuSkeleton from "./MenuSkeleton";
import { useMenu, type MenuItemData } from "../hooks/useMenu";
import { formatPrice, localize } from "../lib/menuFormat";
import { useTranslation } from "react-i18next";
import { useCart } from "../cart/cartStore";

interface MenuProps {
  onSelectItem: (item: MenuItemData) => void;
}

// Abas cujos itens abrem o modal com foto (bebidas e vinhos não abrem).
const categoriesWithModal = ["entrada", "principal", "lanches", "sobremesa"];

const Menu: React.FC<MenuProps> = ({ onSelectItem }) => {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const { tabs, entriesByTab, loading, error, reload } = useMenu();
  const { addItem, quantityOf } = useCart();
  const [activeTab, setActiveTab] = useState("entrada");

  if (loading) return <MenuSkeleton />;

  // Se a aba escolhida não existir mais (desativada no painel), cai na primeira.
  const currentTab = tabs.some((tab) => tab.slug === activeTab)
    ? activeTab
    : tabs[0]?.slug ?? "";
  const currentItems = entriesByTab[currentTab] ?? [];
  const isClickable = categoriesWithModal.includes(currentTab);

  const tabOptions = tabs.map((tab) => ({
    id: tab.slug,
    label: localize(tab, language).name,
  }));

  return (
    <main className={styles.menuWrapper}>
      <div className={styles.menuContainer}>
        <Tabs tabs={tabOptions} activeTab={currentTab} onTabChange={setActiveTab} />

        <section className={styles.contentArea}>
          {error ? (
            <div className={styles.errorBox} role="alert">
              <p className={styles.errorTitle}>{t("menu.load_error_title")}</p>
              <p className={styles.placeholder}>{t("menu.load_error_text")}</p>
              <button className={styles.retryButton} onClick={reload}>
                {t("menu.retry")}
              </button>
            </div>
          ) : currentItems.length > 0 ? (
            currentItems.map((entry) => {
              if (entry.kind === "section") {
                return (
                  <h2 key={`sec-${entry.category.id}`} className={styles.sectionTitle}>
                    {localize(entry.category, language).name}
                  </h2>
                );
              }
              if (entry.kind === "subsection") {
                return (
                  <h3 key={`sub-${entry.category.id}`} className={styles.subSectionTitle}>
                    {localize(entry.category, language).name}
                  </h3>
                );
              }

              const { item } = entry;
              const text = localize(item, language);
              return (
                <MenuItem
                  key={item.id}
                  name={text.name}
                  price={formatPrice(item.price)}
                  description={text.description}
                  picture={item.show_picture_icon}
                  servingType={item.serving_type ?? undefined}
                  isAvailable={item.is_available}
                  onClick={isClickable ? () => onSelectItem(item) : undefined}
                  onAdd={() => addItem(item)}
                  addLabel={t("cart.add_named", { name: text.name })}
                  cartQuantity={quantityOf(item.id)}
                />
              );
            })
          ) : (
            <p className={styles.placeholder}>{t("menu.empty")}</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default Menu;
