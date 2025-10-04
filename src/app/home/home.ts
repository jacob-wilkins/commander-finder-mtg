import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Scry from 'scryfall-sdk';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  // component-bound properties used by the template
  card: any | null = null;
  prints: any[] = [];
  loading = false;
  error: string | null = null;
  imageUrl: string | null = null;

  constructor() {}

  async ngOnInit(): Promise<void> {
    // default search on init
    await this.search('Counterspell');
  }

  async search(name: string): Promise<void> {
    if (!name) return;
    this.loading = true;
    this.error = null;
    this.card = null;
    this.prints = [];
    this.imageUrl = null;
    try {
      const found = await Scry.Cards.byName(name);
      this.card = found;
      // compute a sensible image URL (handle single-faced and multi-faced cards)
      this.imageUrl = this.extractImageUrl(found);
      const prints = await found.getPrints();
      this.prints = Array.isArray(prints) ? prints : [];
    } catch (e: any) {
      console.error(e);
      this.error = String(e?.message ?? e);
    } finally {
      this.loading = false;
    }
  }

  private extractImageUrl(card: any): string | null {
    if (!card) return null;
    // single-faced cards usually have image_uris
    if (card.image_uris && card.image_uris.normal) return card.image_uris.normal;
    if (card.image_uris && card.image_uris.small) return card.image_uris.small;

    // double-faced / modal cards often have card_faces with image_uris
    if (Array.isArray(card.card_faces) && card.card_faces.length > 0) {
      const face = card.card_faces[0];
      if (face.image_uris && face.image_uris.normal) return face.image_uris.normal;
      if (face.image_uris && face.image_uris.small) return face.image_uris.small;
    }

    // fallback to null if not found
    return null;
  }
}
