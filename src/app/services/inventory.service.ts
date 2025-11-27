// src/app/services/inventory.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/item';

// Server endpoint given in the assignment brief
const BASE_URL = 'https://prog2005.it.scu.edu.au/ArtGalley';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient) {}

  /**
   * Get all café items.
   * GET /
   */
  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${BASE_URL}/`);
  }

  /**
   * Get a single café item by name.
   * GET /name
   */
  getItemByName(name: string): Observable<Item> {
    return this.http.get<Item>(`${BASE_URL}/${name}`);
  }

  /**
   * Add a new café item.
   * POST /
   */
  addItem(item: Item): Observable<any> {
    return this.http.post(`${BASE_URL}/`, item);
  }

  /**
   * Update an existing café item by name.
   * PUT /name
   */
  updateItem(name: string, item: Item): Observable<any> {
    return this.http.put(`${BASE_URL}/${name}`, item);
  }

  /**
   * Delete a café item by name.
   * DELETE /name
   */
  deleteItem(name: string): Observable<any> {
    return this.http.delete(`${BASE_URL}/${name}`);
  }
}
