import type { CustomerInformation } from "../pages/CheckoutInformationPage";
import type {
  InventoryProduct,
  InventorySortOption,
  SortDirection,
} from "../pages/InventoryPage";

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password?: string): Chainable<void>;
      loginVisit(): Chainable<void>;
      loginTypeUsername(value: string): Chainable<void>;
      loginTypePassword(value: string): Chainable<void>;
      loginSubmit(): Chainable<void>;
      loginAssertErrorMessage(expected: string): Chainable<void>;
      loginCloseErrorMessage(): Chainable<void>;

      inventoryWaitForLoad(): Chainable<void>;
      inventoryAddProduct(productName: string): Chainable<void>;
      inventoryRemoveProduct(productName: string): Chainable<void>;
      inventoryOpenProductDetails(productName: string): Chainable<void>;
      inventoryOpenCart(): Chainable<void>;
      inventorySort(option: InventorySortOption): Chainable<void>;
      inventoryAssertProductsSortedByName(
        direction: SortDirection
      ): Chainable<void>;
      inventoryAssertProductsSortedByPrice(
        direction: SortDirection
      ): Chainable<void>;
      inventoryAssertFirstProductName(expected: string): Chainable<void>;
      inventoryAssertInventoryCount(expected: number): Chainable<void>;
      inventoryAssertCartBadgeCount(expected: number): Chainable<void>;
      inventoryAssertCartBadgeAtLeast(minAmount: number): Chainable<void>;
      inventoryAssertCartBadgeCleared(): Chainable<void>;
      inventoryResetAppState(): Chainable<void>;
      inventoryVerifyItemIsInCart(productName: string): Chainable<void>;
      inventoryVerifyItemIsNotInCart(productName: string): Chainable<void>;
      inventoryVerifyDefaultSort(): Chainable<void>;
      inventoryAssertProductImagesMatchNames(): Chainable<void>;
      inventoryGetAllProducts(): Chainable<InventoryProduct[]>;

      cartAssertItems(expectedItems: string[]): Chainable<void>;
      cartAssertNumberOfItems(expected: number): Chainable<void>;
      cartCheckout(): Chainable<void>;
      cartVerifyCartPageIsDisplayed(): Chainable<void>;
      cartVerifyCartIsEmpty(): Chainable<void>;
      cartVerifyItemInCart(itemName: string): Chainable<void>;
      cartVerifyItemNotInCart(itemName: string): Chainable<void>;
      cartVerifyCartItemCount(count: number): Chainable<void>;
      cartGetItemPrice(itemName: string): Chainable<JQuery<HTMLElement>>;
      cartVerifyItemQuantity(
        itemName: string,
        quantity: number
      ): Chainable<void>;
      cartGetItemQuantity(itemName: string): Chainable<JQuery<HTMLElement>>;
      cartRemoveItem(itemName: string): Chainable<void>;
      cartContinueShopping(): Chainable<void>;

      checkoutFillInformation(customer: CustomerInformation): Chainable<void>;
      checkoutContinue(): Chainable<void>;
      checkoutCancel(): Chainable<void>;
      checkoutAssertError(message: string): Chainable<void>;
      checkoutAssertErrorNotShown(): Chainable<void>;
      checkoutAssertStillOnInformation(): Chainable<void>;

      checkoutOverviewAssertItems(expectedItems: string[]): Chainable<void>;
      checkoutOverviewAssertSubtotalGreaterThan(
        minValue: number
      ): Chainable<void>;
      checkoutOverviewFinish(): Chainable<void>;
      checkoutOverviewVerifyStepTwo(): Chainable<void>;
      checkoutOverviewVerifyItemInSummary(itemName: string): Chainable<void>;
      checkoutOverviewGetSummaryItemCount(): Chainable<number>;
      checkoutOverviewVerifyPaymentInfo(): Chainable<void>;
      checkoutOverviewVerifyShippingInfo(): Chainable<void>;
      checkoutOverviewGetItemTotal(): Chainable<JQuery<HTMLElement>>;
      checkoutOverviewGetTax(): Chainable<JQuery<HTMLElement>>;
      checkoutOverviewGetTotal(): Chainable<JQuery<HTMLElement>>;

      checkoutAssertSuccessMessage(): Chainable<void>;
      checkoutBackToProducts(): Chainable<void>;

      productDetailsBackToProducts(): Chainable<void>;

      sauceInterceptServiceWorker(): Chainable<void>;
      sauceInterceptAssets(): Chainable<void>;
      sauceInterceptAnalytics(): Chainable<void>;
      saucePrepareNetworkStubs(): Chainable<void>;
      sauceBlockFonts(): Chainable<void>;
      sauceBreakFirstProductImage(): Chainable<void>;
    }
  }
}

import "./commands/cart";
import "./commands/checkout-complete";
import "./commands/checkout-information";
import "./commands/checkout-overview";
import "./commands/interceptors";
import "./commands/inventory";
import "./commands/login";
import "./commands/product-details";

export {};
