
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CATEGORIES, PRODUCTS } from '../data';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (category(); as cat) {
      <div class="bg-slate-50 py-20 px-6 border-b border-slate-100">
        <div class="max-w-4xl mx-auto text-center">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-4">Category</p>
          <h1 class="font-serif text-4xl md:text-6xl font-black text-slate-900 mb-6">{{ cat.label }}</h1>
          <p class="text-xl text-slate-500 max-w-2xl mx-auto">
            Expert analysis and reviews for {{ cat.desc.toLowerCase() }}. We've tested the best gear in this category to help you decide.
          </p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-16">
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
                   <span class="font-bold text-slate-400 ml-1">{{ product.rating }}/5 Score</span>
                </div>
              </div>
              <h2 class="font-serif text-2xl font-bold text-slate-900 mb-3 hover:text-blue-700 transition-colors">
                <a [routerLink]="['/review', product.id]">{{ product.name }}</a>
              </h2>
              <p class="text-slate-600 mb-6 leading-relaxed line-clamp-3">{{ product.summary }}</p>
              <div class="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                <a [routerLink]="['/review', product.id]" class="text-xs font-bold uppercase tracking-widest text-slate-900 hover:text-blue-700">Read Review</a>
                <a [href]="product.amazonLink" target="_blank" class="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-amazon-text">Check Price</a>
              </div>
            </article>
          }
        </div>
        
        @if (products().length === 0) {
           <div class="text-center py-20">
             <p class="text-slate-400 italic">No products found in this category yet.</p>
             <a routerLink="/" class="text-blue-600 font-bold mt-4 inline-block hover:underline">Back Home</a>
           </div>
        }
      </div>
    }
  `
})
export class CategoryComponent {
  private route = inject(ActivatedRoute);
  
  // Get category ID from URL
  categoryId = toSignal(this.route.paramMap.pipe(map(params => params.get('id'))));

  // Computed category object
  category = computed(() => 
    CATEGORIES.find(c => c.id === this.categoryId())
  );

  // Filtered products
  products = computed(() => 
    PRODUCTS.filter(p => p.category === this.categoryId())
  );

  handleImageError(event: any) {
    event.target.src = 'https://picsum.photos/800/600?grayscale';
  }
}
