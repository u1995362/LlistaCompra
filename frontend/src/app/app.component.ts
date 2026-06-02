import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  bought: boolean;
}

const STORAGE_KEY = 'shopping-list-v1';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.css',
})
export class AppComponent {
  newName = '';
  newQuantity = 1;

  private readonly _items = signal<ShoppingItem[]>(this.loadItems());

  readonly items = computed(() => this._items());
  readonly boughtCount = computed(() => this._items().filter(i => i.bought).length);

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
    });
  }

  addItem(): void {
    const name = this.newName.trim();
    const quantity = Number(this.newQuantity) || 1;

    if (!name) return;

    const newItem: ShoppingItem = {
      id: Date.now(),
      name,
      quantity: Math.max(1, quantity),
      bought: false
    };

    this._items.update(items => [newItem, ...items]);
    this.newName = '';
    this.newQuantity = 1;
  }

  toggleBought(id: number): void {
    this._items.update(items =>
      items.map(item =>
        item.id === id ? { ...item, bought: !item.bought } : item
      )
    );
  }

  removeItem(id: number): void {
    this._items.update(items => items.filter(item => item.id !== id));
  }

  clearBought(): void {
    this._items.update(items => items.filter(item => !item.bought));
  }

  clearAll(): void {
    this._items.set([]);
  }

  private loadItems(): ShoppingItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];

      const parsed = JSON.parse(raw) as ShoppingItem[];
      if (!Array.isArray(parsed)) return [];

      return parsed.map(item => ({
        id: Number(item.id) || Date.now(),
        name: String(item.name ?? ''),
        quantity: Number(item.quantity) || 1,
        bought: Boolean(item.bought)
      })).filter(item => item.name.trim().length > 0);
    } catch {
      return [];
    }
  }
}