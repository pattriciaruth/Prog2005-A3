import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

import { InventoryService } from '../services/inventory.service';
import { Item } from '../models/item';  

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {

  // All items from the server
  items: Item[] = [];

  // Items after search filter
  filteredItems: Item[] = [];

  // Search text bound to <ion-searchbar>
  searchTerm = '';

  // UI state
  errorMessage = '';
  isLoading = false;

  constructor(
    private inventoryService: InventoryService,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.loadItems();
  }

  /** Load items from backend */
  loadItems() {
    this.isLoading = true;
    this.errorMessage = '';

    this.inventoryService.getItems().subscribe({
      next: (data) => {
        const rawItems: any[] = data || [];

        // Normalise data & infer stock status if missing
        this.items = rawItems.map((item) => {
          const quantity = Number(item.quantity ?? 0);

          // If backend doesn't send stock_status, infer from quantity
          const stockStatus =
            item.stock_status ||
            this.inferStockStatus(quantity);

          return {
            ...item,
            quantity,
            stock_status: stockStatus,
          } as Item;
        });

        this.filteredItems = [...this.items];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading items', err);
        this.errorMessage = 'Could not load items from server.';
        this.isLoading = false;
      },
    });
  }

  /** Simple rule: 0 = Out of Stock, <5 = Low Stock, else In Stock */
  private inferStockStatus(quantity: number): string {
    if (quantity <= 0) return 'Out of Stock';
    if (quantity < 5) return 'Low Stock';
    return 'In Stock';
  }

  /** Called when user types in the search bar */
  filterItems() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredItems = [...this.items];
      return;
    }

    this.filteredItems = this.items.filter((item) =>
      (item.item_name || '').toLowerCase().includes(term)
    );
  }

  /** Colour for stock-status chip */
  getStatusColor(status: string | undefined): string {
    switch (status) {
      case 'In Stock':
        return 'success';
      case 'Low Stock':
        return 'warning';
      case 'Out of Stock':
        return 'danger';
      default:
        return 'medium';
    }
  }

  /** Icon based on category (for left icon in list item) */
  getCategoryIcon(category: string | undefined): string {
    switch (category) {
      case 'Electronics':
        return 'hardware-chip';
      case 'Furniture':
        return 'bed';
      case 'Clothing':
        return 'shirt';
      case 'Tools':
        return 'construct';
      case 'Miscellaneous':
      default:
        return 'cube';
    }
  }

  /** Optional accent colour per category (used in HTML via [color]) */
  getCategoryColor(category: string | undefined): string {
    switch (category) {
      case 'Electronics':
        return 'primary';
      case 'Furniture':
        return 'tertiary';
      case 'Clothing':
        return 'secondary';
      case 'Tools':
        return 'warning';
      case 'Miscellaneous':
      default:
        return 'medium';
    }
  }

  /** Help button (top-right + FAB) */
  async openHelp() {
    const sheet = await this.actionSheetCtrl.create({
      header: 'Browse Page Help',
      buttons: [
        {
          text: 'Form rules',
          handler: () => {
            // placeholder – you can add more details later
            console.log('Help: form rules');
          },
        },
        {
          text: 'Sample JSON (server item format)',
          handler: () => {
            console.log('Help: sample JSON');
          },
        },
        {
          text: 'Contact TA (placeholder)',
          handler: () => {
            console.log('Help: contact TA');
          },
        },
        {
          text: 'Close',
          role: 'cancel',
        },
      ],
    });

    await sheet.present();
  }

  /** Pull-to-refresh handler (optional, for bonus UX) */
  handleRefresh(event: any) {
    this.inventoryService.getItems().subscribe({
      next: (data) => {
        const rawItems: any[] = data || [];
        this.items = rawItems.map((item) => {
          const quantity = Number(item.quantity ?? 0);
          const stockStatus =
            item.stock_status || this.inferStockStatus(quantity);
          return { ...item, quantity, stock_status: stockStatus } as Item;
        });
        this.filteredItems = [...this.items];
        event.target.complete();
      },
      error: () => {
        this.errorMessage = 'Could not refresh items.';
        event.target.complete();
      },
    });
  }
}
