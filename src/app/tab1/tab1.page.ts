import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { Item } from '../models/item';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {

  items: Item[] = [];         // 👈 important: initialised as []
  errorMessage = '';

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.inventoryService.getItems().subscribe({
      next: (data) => {
        console.log('Items from server:', data);
        this.items = data || [];  // 👈 extra safety
      },
      error: (err) => {
        console.error('Error loading items', err);
        this.errorMessage = 'Could not load items from server.';
      }
    });
  }
}
