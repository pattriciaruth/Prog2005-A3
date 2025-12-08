import { Component, OnInit } from '@angular/core';
import { AlertController, IonicSafeString } from '@ionic/angular';
import { InventoryService } from '../services/inventory.service';
import { Item } from '../models/item';

/* Allowed values for the stock filter UI segment */
type StockFilter = 'all' | 'in' | 'limited' | 'out';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {

  /* Full list of items loaded from backend */
  items: Item[] = [];

  /* Display list after search + filters */
  filteredItems: Item[] = [];

  /* ---------------- UI STATE ---------------- */
  searchTerm = '';                       // Search input text
  stockFilter: StockFilter = 'all';      // Selected stock segment filter
  showOnlyFeatured = false;              // Toggle: featured-only filter

  loading = false;                       // Shows loading indicator
  errorMessage = '';                     // Error banner text

  /* A demo-protected record name (cannot delete) */
  readonly protectedItemName = 'Laptop';


  constructor(
    private inventoryService: InventoryService,   // API service
    private alertCtrl: AlertController            // Alert popup handler
  ) {}

  /* Lifecycle hook – runs automatically when entering tab for first time */
  ngOnInit() {
    this.loadItems();
  }

  /* -------------------------------------------------
     HELP BUTTON — Displays instructional information
  --------------------------------------------------- */
  async showHelp() {
    const alert = await this.alertCtrl.create({
      header: 'How to Use This Page',
      message: this.helpText,
      buttons: ['OK']
    });
    await alert.present();
  }

  /* Text displayed inside the help pop-up */
  helpText = `
• This page displays all items currently stored in the inventory database.                                                                                   
• Use the search bar to quickly locate items by name.                
• Pull down to refresh the list at any time.                  
Note: Items come directly from the backend server.                       
`;


  /* -------------------------------------------------
     PROTECTED RECORD CHECK
     Used to show a banner warning if a demo item exists.
  --------------------------------------------------- */
  get hasProtectedRecord(): boolean {
    return this.items.some(
      i => (i.item_name || '').toLowerCase() === this.protectedItemName.toLowerCase()
    );
  }

  /* -------------------------------------------------
     LOAD ITEMS FROM BACKEND
     Fetches the item list and applies UI filters.
  --------------------------------------------------- */
  loadItems() {
    this.loading = true;
    this.errorMessage = '';

    this.inventoryService.getItems().subscribe({
      next: data => {
        this.items = data || [];
        this.applyFilters();       // Always filter after loading
        this.loading = false;
        console.log('Items from server (Tab1):', this.items);
      },
      error: err => {
        console.error('Error loading items', err);
        this.errorMessage = 'Could not load items from server.';
        this.loading = false;
      }
    });
  }

  /* -------------------------------------------------
     UI HANDLERS: SEARCH, FILTERS, TOGGLE
     Called from HTML whenever user interacts with UI
  --------------------------------------------------- */

  onSearchChange(event: any) {
    const value = (event.detail?.value ?? event.target?.value ?? '').toString();
    this.searchTerm = value;
    this.applyFilters();
  }

  onStockFilterChange(event: any) {
    const value = (event.detail?.value ?? 'all') as StockFilter;
    this.stockFilter = value;
    this.applyFilters();
  }

  onFeaturedToggle(event: any) {
    const checked = !!(event.detail?.checked ?? event.target?.checked);
    this.showOnlyFeatured = checked;
    this.applyFilters();
  }

  /* -------------------------------------------------
     APPLY FILTERS
     Runs search + featured filter + stock filter.
     This function determines what appears on screen.
  --------------------------------------------------- */
  private applyFilters() {
    let list = [...this.items];

    /* --- SEARCH FILTER --- */
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      list = list.filter(i =>
        (i.item_name || '').toLowerCase().includes(term)
      );
    }

    /* --- FEATURED FILTER --- */
    if (this.showOnlyFeatured) {
      list = list.filter(i => i.featured_item === 1);
    }

    /* --- STOCK FILTER (in / out / limited) --- */
    if (this.stockFilter !== 'all') {
      list = list.filter(i => this.getStockStatus(i) === this.stockFilter);
    }

    this.filteredItems = list;
  }

  /* -------------------------------------------------
     STOCK STATUS CALCULATION
     Converts backend stock text into normalized filter values.
     Used for badge colors AND filtering logic.
  --------------------------------------------------- */
  getStockStatus(item: Item): StockFilter {
    if (!item) { return 'all'; }

    const status = (item.stock_status || '').toLowerCase();

    if (status.includes('out')) return 'out';
    if (status.includes('low')) return 'limited';
    if (status.includes('in')) return 'in';

    /* Fallback logic if server sent non-standard values */
    if (item.quantity === 0) return 'out';
    if (item.quantity <= 3) return 'limited';

    return 'in';
  }

  /* Human-readable version of the stock label */
  getStockLabel(item: Item): string {
    const s = this.getStockStatus(item);
    if (s === 'in') return 'In stock';
    if (s === 'limited') return 'Limited';
    if (s === 'out') return 'Out of stock';
    return 'Unknown';
  }

  /* -------------------------------------------------
     CATEGORY ICON MAPPING
     Chooses correct icon based on item.category
  --------------------------------------------------- */
  getCategoryIcon(category?: string): string {
    const c = (category || '').toLowerCase();
    if (c === 'electronics') return 'tv-outline';
    if (c === 'furniture')   return 'bed-outline';
    if (c === 'clothing')    return 'shirt-outline';
    if (c === 'tools')       return 'construct-outline';
    return 'cube-outline'; // default icon
  }
}
