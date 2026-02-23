
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PRODUCTS } from '../data';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  template: `
    <div class="bg-slate-50 py-20 px-6 border-b border-slate-100">
      <div class="max-w-4xl mx-auto text-center">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-4">Search Results</p>
        <h1 class="font-serif text-4xl md:text-5xl font-black text-slate-900 mb-6">"{{ query() }}"</h1>
        <p class="text-slate-500">Found {{ products().length }} matching articles</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-16">
      @if (products().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          @for (product of products(); track product.id) {
            <article class="flex flex-col border-b border-slate-100 pb-12 md:border-none md:pb-0">
              <a [routerLink]="['/review', product.id]" class="block aspect-[3/2] overflow-hidden rounded-lg bg-slate-100 mb-6 group">
                <img [src]="product.image" [alt]="product.name" 
                     loading="lazy"
                     class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                     (error)="handleImageError($event)">
              </a>
              <div class="flex items-center gap-2 mb-3">
                <span class="text-xs font-bold text-blue-600 uppercase tracking-widest">{{ product.category }}</span>
                <span class="text-slate-300">•</span>
                <div class="flex text-yellow-500 text-xs">
                   <span class="font-bold text-slate-400 ml-1">{{ product.rating }}/5</span>
                </div>
              </div>
              <h2 class="font-serif text-2xl font-bold text-slate-900 mb-3 hover:text-blue-700 transition-colors">
                <a [routerLink]="['/review', product.id]">{{ product.name }}</a>
              </h2>
              <p class="text-slate-600 mb-6 leading-relaxed line-clamp-3">{{ product.summary }}</p>
              <a [routerLink]="['/review', product.id]" class="text-xs font-bold uppercase tracking-widest text-slate-900 hover:text-blue-700 mt-auto">Read Review</a>
            </article>
          }
        </div>
      } @else {
        <div class="text-center py-12">
          <p class="text-xl text-slate-400 font-serif italic mb-8">We couldn't find any reviews matching your search.</p>
          <a routerLink="/" class="inline-block px-8 py-3 bg-slate-900 text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-blue-700 transition-colors">Return Home</a>
        </div>
      }
    </div>
  `
})
export class SearchComponent {
  private route = inject(ActivatedRoute);
  
  query = toSignal(this.route.queryParams.pipe(map(params => params['q'] || '')));

  products = computed(() => {
    const q = (this.query() || '').toLowerCase().trim();
    if (!q) return [];
    return PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.summary.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.verdict.toLowerCase().includes(q)
    );
  });

  handleImageError(event: any) {
    event.target.src = 'https://picsum.photos/800/600?grayscale';
  }
}
