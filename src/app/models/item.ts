

/**
 * Represents a single item in the café inventory.
 * Used for displaying, updating and managing product details.
 */
export interface Item {
  /** Unique ID assigned to the item (auto-increment). */
  item_id: number;

  /** Name of the item. */
  item_name: string;

  /** Category of the item. */
  category: 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Miscellaneous';

  /** Current quantity of this item. */
  quantity: number;

  /** Price per item. */
  price: number;

  /** Supplier or vendor providing this item. */
  supplier_name: string;

  /** Stock status of the item. */
  stock_status: 'In Stock' | 'Low Stock' | 'Out of Stock';

  /** Marked as featured? (0 = no, 1 = yes, etc.). */
  featured_item: number;

  /** Optional note (special handling, comments, etc.). */
  special_note?: string;
}