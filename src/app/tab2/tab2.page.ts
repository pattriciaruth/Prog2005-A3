import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  
}








/*

**********************************
⭐⭐-------DO NOT CHNAGE OR DELET ANY OF THE FOLLOWING LINES. YOUR CODE GOES ABOVE THIS GREEN SECTION-------⭐⭐
**********************************



import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { Item } from '../models/item';
import { AlertController } from '@ionic/angular';

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
  readonly helpText = `
    • Use this form to add a new item to the inventory.<br><br>
    • All fields marked with * are required before submitting.<br>
    • Quantity and Price must be non-negative numbers.<br>
    • Use the Category and Stock status dropdowns to classify the item.<br>
    • Tick “Mark as featured item” to show it in the Featured list on the right
      and on the Browse tab.
  `;

  // ---------- Form model ---------------------------------------------------
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

  submitting = false;
  successMessage = '';
  errorMessage = '';
  validationErrors: string[] = [];

  // ---------- Featured items list -----------------------------------------
  featuredItems: Item[] = [];
  loadingFeatured = false;

  readonly category = ['Electronics', 'Furniture', 'Clothing', 'Tools', 'Miscellaneous'];
  readonly stock_status = ['In Stock', 'Low Stock', 'Out of Stock'];

  constructor(
    private inventoryService: InventoryService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {
    this.loadFeaturedItems();
  }

  // ---------- Help FAB handler --------------------------------------------
  async openHelp(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'How to use "Manage Items"',
      message: this.helpText,
      buttons: ['OK']
    });
    await alert.present();
  }

  // ---------- Load featured items -----------------------------------------
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
  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.validationErrors = [];

    if (!this.validateForm()) {
      return;
    }

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
        this.loadFeaturedItems();
      },
      error: (err: any) => {
        console.error('Error creating item', err);
        this.submitting = false;
        this.errorMessage = 'Failed to create item. Please try again.';
      }
    });
  }

  // ---------- Validation ---------------------------------------------------
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
  getStockBadgeClass(item: Item): string {
    const status = (item.stock_status || '').toLowerCase();
    if (status.includes('out')) return 'lvl-1';
    if (status.includes('low')) return 'lvl-2';
    if (status.includes('in')) return 'lvl-4';
    return '';
  }
}
*/
