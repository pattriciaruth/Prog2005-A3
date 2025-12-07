import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  
}








/*

**********************************
⭐⭐-------DO NOT CHNAGE OR DELET ANY OF THE FOLLOWING LINES. YOUR CODE GOES ABOVE THIS GREEN SECTION-------⭐⭐
**********************************





/*
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { InventoryService } from '../services/inventory.service';
import { Item } from '../models/item';

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

  // left-side search
  searchName = '';
  loadingLookup = false;

  // current record (for the “Current record” panel)
  currentItem: Item | null = null;

  // right-side edit form
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

  readonly categories = ['Electronics', 'Furniture', 'Clothing', 'Tools', 'Miscellaneous'];
  readonly stockStatuses = ['In Stock', 'Low Stock', 'Out of Stock'];

  // banners
  successMessage = '';
  errorMessage = '';
  submittingUpdate = false;
  submittingDelete = false;

  // protected name from the brief
  readonly protectedItemName = 'Laptop';

  // help text
  readonly helpText = `
    • Search for an item by its exact name, then press  Load item . 
    • The current record details appear on the left and the form on the right is filled in. 
    • Edit any fields and press  Save changes  to update. 
    • Use <strong>Delete item to remove it (except the protected “Laptop” record).
  `;

  constructor(
    private inventoryService: InventoryService,
    private alertCtrl: AlertController
  ) {}

  // ------------ HELP FAB ------------------------------------

  async showHelp() {
    const alert = await this.alertCtrl.create({
      header: 'How to use "Update & Remove Items"',
      message: this.helpText,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // ------------ LOAD BY NAME --------------------------------

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

        // Handle either a single object OR an array with one object
        const item: any = Array.isArray(res) ? res[0] : res;

        if (!item || !item.item_name) {
          this.errorMessage = `No item named "${name}" was found on the server.`;
          this.currentItem = null;
          return;
        }

        this.currentItem = item as Item;
        this.patchFormFromItem(item as Item);
        this.successMessage = `Item "${item.item_name}" loaded successfully. You can now update or delete it.`;
      },
      error: (err) => {
        console.error('Error loading item by name', err);
        this.loadingLookup = false;
        this.errorMessage = 'Failed to load item. Please check the name and try again.';
      }
    });
  }

  // fill the edit form from the loaded item
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

  // ------------ UPDATE ---------------------------------------

  onUpdateItem() {
    if (!this.form.item_name.trim()) {
      this.errorMessage = 'Item name is required before updating.';
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.submittingUpdate = true;

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
        // keep currentItem in sync
        this.currentItem = payload;
      },
      error: (err) => {
        console.error('Error updating item', err);
        this.submittingUpdate = false;
        this.errorMessage = 'Failed to update item. Please try again.';
      }
    });
  }

  // ------------ DELETE ---------------------------------------

  get isProtected(): boolean {
    return (this.form.item_name || '').toLowerCase() === this.protectedItemName.toLowerCase();
  }

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
        this.currentItem = null;
        this.resetForm();
        this.searchName = '';
      },
      error: (err) => {
        console.error('Error deleting item', err);
        this.submittingDelete = false;
        this.errorMessage = 'Failed to delete item. The server may be protecting this record.';
      }
    });
  }

  // ------------ UTIL -----------------------------------------

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
*/