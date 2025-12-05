import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { Item } from '../models/item';

type StockFilter = 'all' | 'in' | 'limited' | 'out';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {

  items: Item[] = [];
  filteredItems: Item[] = [];

  // UI state
  searchTerm = '';
  stockFilter: StockFilter = 'all';
  showOnlyFeatured = false;

  loading = false;
  errorMessage = '';

  // Demo “protected” record (matches server rule)
  readonly protectedItemName = 'Laptop';

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.loadItems();
  }

  get hasProtectedRecord(): boolean {
    return this.items.some(
      i => (i.item_name || '').toLowerCase() === this.protectedItemName.toLowerCase()
    );
  }

  loadItems() {
    this.loading = true;
    this.errorMessage = '';

    this.inventoryService.getItems().subscribe({
      next: data => {
        this.items = data || [];
        this.applyFilters();
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

  // --- UI handlers ---------------------------------------------------------

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

  openHelp() {
    // Simple placeholder – you can replace with an Action Sheet later
    alert(
      'Browse items help:\n\n' +
      '• Search items by name\n' +
      '• Filter by stock status or featured items\n' +
      '• The “Laptop” record is protected and cannot be deleted.'
    );
  }

  // --- Helpers -------------------------------------------------------------

  private applyFilters() {
    let list = [...this.items];

    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      list = list.filter(i =>
        (i.item_name || '').toLowerCase().includes(term)
      );
    }

    if (this.showOnlyFeatured) {
      list = list.filter(i => i.featured_item === 1);
    }

    if (this.stockFilter !== 'all') {
      list = list.filter(i => this.getStockStatus(i) === this.stockFilter);
    }

    this.filteredItems = list;
  }

  getStockStatus(item: Item): StockFilter {
    if (!item) { return 'all'; }

    const status = (item.stock_status || '').toLowerCase();

    if (status.includes('out')) return 'out';
    if (status.includes('low')) return 'limited';
    if (status.includes('in')) return 'in';

    // fallback using quantity
    if (item.quantity === 0) return 'out';
    if (item.quantity <= 3) return 'limited';

    return 'in';
  }

  getStockLabel(item: Item): string {
    const s = this.getStockStatus(item);
    if (s === 'in') return 'In stock';
    if (s === 'limited') return 'Limited';
    if (s === 'out') return 'Out of stock';
    return 'Unknown';
  }

  getCategoryIcon(category?: string): string {
    const c = (category || '').toLowerCase();
    if (c === 'electronics') return 'tv-outline';
    if (c === 'furniture')   return 'bed-outline';
    if (c === 'clothing')    return 'shirt-outline';
    if (c === 'tools')       return 'construct-outline';
    return 'cube-outline';
  }
}
