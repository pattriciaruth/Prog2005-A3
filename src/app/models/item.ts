

/**
 * Represents a single item in the café inventory.
 * Used for displaying, updating and managing product details.
 */
export interface Item {
  /** Unique ID assigned to the item (auto-increment). */
  itemId: number;

  /** Name of the item. */
  itemName: string;

  /** Category of the item. */
  category: 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Miscellaneous';

  /** Current quantity of this item. */
  quantity: number;

  /** Price per item. */
  price: number;

  /** Supplier or vendor providing this item. */
  supplierName: string;

  /** Stock status of the item. */
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';

  /** Marked as featured? (0 = no, 1 = yes, etc.). */
  featuredItem: number;

  /** Optional note (special handling, comments, etc.). */
  specialNote?: string;
}