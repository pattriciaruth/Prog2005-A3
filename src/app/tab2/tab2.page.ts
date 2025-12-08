import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { Item } from '../models/item';
import { AlertController } from '@ionic/angular';

/**
 * Shape of the reactive form model used in the template.
 * Mirrors the fields required to create an Item.
 */
interface ItemForm {
  item_name: string;
  category: string;
  quantity: number | null;
  price: number | null;
  supplier_name: string;
  stock_status: string;
  featured_item: boolean;   // checkbox in the form
  special_note: string;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {

  // ---------- Help text for this tab ---------------------------------------
  /**
   * Text content shown in the help popup when the floating help
   * button is pressed. Explains how to use the Manage Items form.
   */
  readonly helpText = `
    • Use this form to add a new item to the inventory. 
    • All fields marked with * are required before submitting. 
    • Quantity and Price must be non-negative numbers. 
    • Use the Category and Stock status dropdowns to classify the item. 
    • Tick “Mark as featured item” to show it in the Featured list on the right
      and on the Browse tab.
  `;

  // ---------- Form model ---------------------------------------------------
  /**
   * Form state bound via ngModel in the template.
   * Initial values match common defaults (e.g., Electronics, In Stock).
   */
  form: ItemForm = {
    item_name: '',
    category: 'Electronics',
    quantity: null,
    price: null,
    supplier_name: '',
    stock_status: 'In Stock',
    featured_item: false,
    special_note: ''
  };

  /** Indicates whether a submit request is currently in progress. */
  submitting = false;

  /** Message displayed when the form submission succeeds. */
  successMessage = '';

  /** Message displayed when a server or submission error occurs. */
  errorMessage = '';

  /** List of validation error strings to show above the form. */
  validationErrors: string[] = [];

  // ---------- Featured items list -----------------------------------------
  /**
   * Items that are currently marked as featured in the inventory.
   * Displayed in the right-hand table to give immediate feedback.
   */
  featuredItems: Item[] = [];

  /** Shows loading state while featured items are being fetched. */
  loadingFeatured = false;

  /** Allowed category options for the dropdown. */
  readonly category = ['Electronics', 'Furniture', 'Clothing', 'Tools', 'Miscellaneous'];

  /** Allowed stock status options for the dropdown. */
  readonly stock_status = ['In Stock', 'Low Stock', 'Out of Stock'];

  constructor(
    private inventoryService: InventoryService,  // Service to call backend API
    private alertCtrl: AlertController           // Used to present Ionic alerts
  ) {}

  /**
   * Lifecycle hook – called once when the component is initialised.
   * Loads the featured items so the right-hand table is populated.
   */
  ngOnInit(): void {
    this.loadFeaturedItems();
  }

  // ---------- Help FAB handler --------------------------------------------
  /**
   * Opens a simple help dialog explaining how to use the Manage Items tab.
   * Triggered when the floating help button is pressed.
   */
  async openHelp(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'How to use "Manage Items"',
      message: this.helpText,
      buttons: ['OK']
    });
    await alert.present();
  }

  // ---------- Load featured items -----------------------------------------
  /**
   * Retrieves all items from the backend and filters down to only those
   * that are flagged as featured_item === 1. These are shown in the
   * "Featured items" table on the right.
   */
  loadFeaturedItems(): void {
    this.loadingFeatured = true;
    this.inventoryService.getItems().subscribe({
      next: (items) => {
        this.featuredItems = (items || []).filter(i => i.featured_item === 1);
        this.loadingFeatured = false;
      },
      error: (err) => {
        console.error('Error loading featured items', err);
        this.loadingFeatured = false;
      }
    });
  }

  // ---------- Form submit --------------------------------------------------
  /**
   * Called when the user submits the Add item form.
   * - Clears any previous messages
   * - Runs client-side validation
   * - Sends a createItem request if valid
   * - Refreshes the featured items list after success
   */
  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.validationErrors = [];

    // Run validation before sending data to the server
    if (!this.validateForm()) {
      return;
    }

    // Build the payload in the shape expected by the backend
    const payload: Item = {
      item_id: 0, // server auto-increments; this value is ignored
      item_name: this.form.item_name.trim(),
      category: this.form.category as 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Miscellaneous',
      quantity: Number(this.form.quantity),
      price: Number(this.form.price),
      supplier_name: this.form.supplier_name.trim(),
      stock_status: this.form.stock_status as 'In Stock' | 'Low Stock' | 'Out of Stock',
      featured_item: this.form.featured_item ? 1 : 0,
      special_note: this.form.special_note?.trim() || ''
    };

    this.submitting = true;

    // Use createItem or addItem depending on how your service is implemented.
    // Here we assume createItem exists and wraps POST /.
    this.inventoryService.createItem(payload).subscribe({
      next: (created: any) => {
        console.log('Created item:', created);
        this.submitting = false;
        this.successMessage = 'Item created successfully.';
        this.resetForm();
        this.loadFeaturedItems();   // Refresh featured list to include the new item
      },
      error: (err: any) => {
        console.error('Error creating item', err);
        this.submitting = false;
        this.errorMessage = 'Failed to create item. Please try again.';
      }
    });
  }

  // ---------- Validation ---------------------------------------------------
  /**
   * Basic client-side validation for the form fields.
   * Populates validationErrors with user-friendly messages and
   * returns true if the form is valid.
   */
  private validateForm(): boolean {
    const errors: string[] = [];

    if (!this.form.item_name.trim()) {
      errors.push('Item name is required.');
    }
    if (!this.form.category) {
      errors.push('Category is required.');
    }

    if (
      this.form.quantity === null ||
      isNaN(Number(this.form.quantity)) ||
      Number(this.form.quantity) < 0
    ) {
      errors.push('Quantity must be a non-negative number.');
    }

    if (
      this.form.price === null ||
      isNaN(Number(this.form.price)) ||
      Number(this.form.price) < 0
    ) {
      errors.push('Price must be a non-negative number.');
    }

    if (!this.form.supplier_name.trim()) {
      errors.push('Supplier name is required.');
    }

    if (!this.form.stock_status) {
      errors.push('Stock status is required.');
    }

    this.validationErrors = errors;
    return errors.length === 0;
  }

  // ---------- Reset form ---------------------------------------------------
  /**
   * Resets the form back to its initial state.
   * Typically called after a successful submission or when the user
   * clicks the "Clear" button.
   */
  resetForm(): void {
    this.form = {
      item_name: '',
      category: 'Electronics',
      quantity: null,
      price: null,
      supplier_name: '',
      stock_status: 'In Stock',
      featured_item: false,
      special_note: ''
    };
  }

  // ---------- Featured list helpers ---------------------------------------
  /**
   * Maps an item's stock_status to a CSS class used to colour the
   * badge in the Featured items table.
   */
  getStockBadgeClass(item: Item): string {
    const status = (item.stock_status || '').toLowerCase();
    if (status.includes('out')) return 'lvl-1';  // low / out-of-stock
    if (status.includes('low')) return 'lvl-2';  // limited stock
    if (status.includes('in')) return 'lvl-4';   // healthy stock
    return '';
  }
}
