

/**
 * Represents a single item in the café inventory.
 * Used for displaying, updating and managing product details.
 */
export interface CafeItem {
  /**
   * Unique ID assigned to the item .
   */
  itemId: string;

  /**
   * Name of the café item shown in menus and inventory.
   */
  name: string;

  /**
   * Category this item belongs to (e.g., Beverage, Bakery, Snack).
   */
  category: string;

  /**
   * Current quantity being recorded or used in the system.
   */
  quantity: number;

  /**
   * Selling price per item/unit.
   */
  price: number;

  /**
   * Supplier or vendor providing this item.
   */
  supplier: string;

  /**
   * Stock status from 1 (very low) to 5 (fully stocked).
   */
  stockLevel: number; // 1 = low, 5 = full

  /**
   * Whether this item is marked as popular or high-selling.
   */
  popular: boolean;

  /**
   * Extra notes or comments about the item (optional usage).
   */
  comment: string;
}
