import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { InventoryService } from '../services/inventory.service';
import { Item } from '../models/item';

/**
 * Form model used by the right-side Edit/Delete panel.
 * Matches the structure of the Item model but supports nulls for
 * required numeric fields when the form first loads.
 */
interface EditForm {
  item_id: number | null;
  item_name: string;
  category: 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Miscellaneous';
  quantity: number | null;
  price: number | null;
  supplier_name: string;
  stock_status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  featured_item: boolean;
  special_note: string;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {

  // -------------------------------------------------------------------------
  // LEFT SIDE: SEARCH PANEL
  // Used to load a specific record by its name
  // -------------------------------------------------------------------------
  searchName = '';               // The name typed by the user
  loadingLookup = false;         // Controls spinner/disabled state during lookup

  // Stores the currently loaded record shown in the "Current record" card
  currentItem: Item | null = null;

  // -------------------------------------------------------------------------
  // RIGHT SIDE: EDIT + DELETE FORM
  // Populated after a successful lookup
  // -------------------------------------------------------------------------
  form: EditForm = {
    item_id: null,
    item_name: '',
    category: 'Electronics',
    quantity: null,
    price: null,
    supplier_name: '',
    stock_status: 'In Stock',
    featured_item: false,
    special_note: ''
  };

  // Dropdown list options
  readonly categories = ['Electronics', 'Furniture', 'Clothing', 'Tools', 'Miscellaneous'];
  readonly stockStatuses = ['In Stock', 'Low Stock', 'Out of Stock'];

  // UI banners for user feedback
  successMessage = '';
  errorMessage = '';
  submittingUpdate = false;      // Used when saving edits
  submittingDelete = false;      // Used when deleting a record

  // Hardcoded protected item name per assignment brief
  readonly protectedItemName = 'Laptop';

  // -------------------------------------------------------------------------
  // HELP TEXT FOR FLOATING ACTION BUTTON (FAB)
  // Displayed inside an Ionic alert dialog
  // -------------------------------------------------------------------------
  readonly helpText = `
    • Search for an item by its exact name, then press  Load item . 
    • The current record details appear on the left and the form on the right is filled in. 
    • Edit any fields and press  Save changes  to update. 
    • Use <strong>Delete item</strong> to remove it (except the protected “Laptop” record).
  `;

  constructor(
    private inventoryService: InventoryService,   // API communication service
    private alertCtrl: AlertController            // Used to show popup alerts
  ) {}

  // =========================================================================
  // HELP BUTTON HANDLER
  // =========================================================================

  /**
   * Opens an informational popup explaining how to use this tab.
   * Triggered by the floating help button on the bottom-right corner.
   */
  async showHelp() {
    const alert = await this.alertCtrl.create({
      header: 'How to use "Update & Remove Items"',
      message: this.helpText,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // =========================================================================
  // LOAD EXISTING ITEM BY NAME
  // =========================================================================

  /**
   * Looks up an item in the database using its exact name.
   * Populates the left preview panel and the right edit form.
   */
  onLoadItem() {
    this.successMessage = '';
    this.errorMessage = '';
    this.currentItem = null;

    const name = this.searchName.trim();
    if (!name) {
      this.errorMessage = 'Please enter an item name to search.';
      return;
    }

    this.loadingLookup = true;
    console.log('Searching for item:', name);

    this.inventoryService.getItemByName(name).subscribe({
      next: (res: any) => {
        this.loadingLookup = false;
        console.log('Raw response from getItemByName:', res);

        // API may return a single object or an array of results → normalize to one item
        const item: any = Array.isArray(res) ? res[0] : res;

        if (!item || !item.item_name) {
          this.errorMessage = `No item named "${name}" was found on the server.`;
          this.currentItem = null;
          return;
        }

        // Store the result and sync the edit form
        this.currentItem = item as Item;
        this.patchFormFromItem(item as Item);

        this.successMessage =
          `Item "${item.item_name}" loaded successfully. You can now update or delete it.`;
      },
      error: (err) => {
        console.error('Error loading item by name', err);
        this.loadingLookup = false;
        this.errorMessage = 'Failed to load item. Please check the name and try again.';
      }
    });
  }

  /**
   * Copies the loaded item data into the edit form on the right panel.
   */
  private patchFormFromItem(item: Item) {
    this.form = {
      item_id: item.item_id ?? null,
      item_name: item.item_name ?? '',
      category: item.category ?? 'Electronics',
      quantity: item.quantity ?? null,
      price: item.price ?? null,
      supplier_name: item.supplier_name ?? '',
      stock_status: item.stock_status ?? 'In Stock',
      featured_item: item.featured_item === 1,
      special_note: item.special_note ?? ''
    };
  }

  // =========================================================================
  // UPDATE EXISTING ITEM
  // =========================================================================

  /**
   * Sends an update request to the backend using the current form values.
   * Basic validation occurs here before sending the request.
   */
  onUpdateItem() {
    if (!this.form.item_name.trim()) {
      this.errorMessage = 'Item name is required before updating.';
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.submittingUpdate = true;

    // Build payload in the format expected by the backend
    const payload: Item = {
      item_id: this.form.item_id!,
      item_name: this.form.item_name.trim(),
      category: this.form.category,
      quantity: Number(this.form.quantity ?? 0),
      price: Number(this.form.price ?? 0),
      supplier_name: this.form.supplier_name.trim(),
      stock_status: this.form.stock_status,
      featured_item: this.form.featured_item ? 1 : 0,
      special_note: this.form.special_note?.trim() || ''
    };

    this.inventoryService.updateItem(this.form.item_name.trim(), payload).subscribe({
      next: (res) => {
        console.log('Update response:', res);
        this.submittingUpdate = false;
        this.successMessage = `Item "${this.form.item_name}" updated successfully.`;

        // Update preview panel to reflect latest changes
        this.currentItem = payload;
      },
      error: (err) => {
        console.error('Error updating item', err);
        this.submittingUpdate = false;
        this.errorMessage = 'Failed to update item. Please try again.';
      }
    });
  }

  // =========================================================================
  // DELETE EXISTING ITEM
  // =========================================================================

  /**
   * Returns true if the current form represents the protected item
   * (e.g., "Laptop"), which the server will not allow deleting.
   */
  get isProtected(): boolean {
    return (this.form.item_name || '').toLowerCase() ===
           this.protectedItemName.toLowerCase();
  }

  /**
   * Asks the user to confirm before deleting an item.
   * Prevents deletion of protected server items.
   */
  async confirmDelete() {
    if (!this.form.item_name.trim()) {
      this.errorMessage = 'Load an item before trying to delete.';
      return;
    }

    if (this.isProtected) {
      this.errorMessage = 'This record is protected and cannot be deleted (server rule).';
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Delete item?',
      message: `Are you sure you want to permanently delete "${this.form.item_name}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.onDeleteItem()
        }
      ]
    });
    await alert.present();
  }

  /**
   * Performs deletion after user confirmation.
   */
  private onDeleteItem() {
    this.successMessage = '';
    this.errorMessage = '';
    this.submittingDelete = true;

    const name = this.form.item_name.trim();

    this.inventoryService.deleteItem(name).subscribe({
      next: (res) => {
        console.log('Delete response:', res);
        this.submittingDelete = false;
        this.successMessage = `Item "${name}" deleted successfully.`;

        // Reset UI after deletion
        this.currentItem = null;
        this.resetForm();
        this.searchName = '';
      },
      error: (err) => {
        console.error('Error deleting item', err);
        this.submittingDelete = false;
        this.errorMessage =
          'Failed to delete item. The server may be protecting this record.';
      }
    });
  }

  // =========================================================================
  // UTILITIES
  // =========================================================================

  /**
   * Clears the edit form back to its initial (empty) state.
   */
  resetForm() {
    this.form = {
      item_id: null,
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
}
