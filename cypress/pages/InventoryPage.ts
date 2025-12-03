export type InventorySortOption = "az" | "za" | "lohi" | "hilo";
export type SortDirection = "asc" | "desc";
export type InventoryProduct = { name: string; price: string };

export const inventorySelectors = {
  pageTitle: ".title",
  inventoryItems: ".inventory_item",
  inventoryItemName: ".inventory_item_name",
  inventoryItemPrice: ".inventory_item_price",
  inventoryItemImage: ".inventory_item_img img",
  cartBadge: ".shopping_cart_badge",
  cartLink: ".shopping_cart_link",
  sortDropdown: "[data-test='product-sort-container']",
  menuButton: "#react-burger-menu-btn",
  closeMenuButton: "#react-burger-cross-btn",
  resetLink: "#reset_sidebar_link",
};

export const inventoryImageExclusionWords = ["labs", "the", "all", "things"];
