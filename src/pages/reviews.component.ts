import { Component, computed, inject, signal } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CATEGORIES, PRODUCTS } from "../data";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs/operators";
import {
  LucideAngularModule,
  Armchair,
  Monitor,
  Lightbulb,
  Briefcase,
  Keyboard,
  Speaker,
  Check,
  X,
} from "lucide-angular";

@Component({
  selector: "app-reviews",
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, NgOptimizedImage],
  template: `
    <div class="bg-white min-h-screen pb-20">
      <header class="pt-24 pb-12 px-6 bg-slate-50 border-b border-slate-100">
        <div class="max-w-7xl mx-auto text-center">
          <h1
            class="font-serif text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight"
          >
            All Reviews
          </h1>
          <p class="text-lg text-slate-500 max-w-2xl mx-auto mb-10">
            Comprehensive analysis of the best gear for your workspace.
          </p>

          <div class="flex flex-wrap justify-center gap-x-4 gap-y-12">
            <a
              [routerLink]="['/reviews']"
              class="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border"
              [class.bg-slate-900]="!activeCategory()"
              [class.text-white]="!activeCategory()"
              [class.border-slate-900]="!activeCategory()"
              [class.bg-white]="activeCategory()"
              [class.text-slate-500]="activeCategory()"
              [class.border-slate-200]="activeCategory()"
              [class.hover:border-slate-900]="activeCategory()"
            >
              All
            </a>

            @for (cat of categories; track cat.id) {
            <a
              [routerLink]="['/reviews']"
              [queryParams]="{ category: cat.id }"
              class="group flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300 relative"
              [class.bg-blue-600]="activeCategory() === cat.id"
              [class.border-blue-600]="activeCategory() === cat.id"
              [class.text-white]="activeCategory() === cat.id"
              [class.bg-white]="activeCategory() !== cat.id"
              [class.border-slate-200]="activeCategory() !== cat.id"
              [class.text-slate-400]="activeCategory() !== cat.id"
              [class.hover:border-blue-400]="activeCategory() !== cat.id"
              [class.hover:text-blue-500]="activeCategory() !== cat.id"
              [title]="cat.label"
            >
              <lucide-icon
                [img]="getIcon(cat.icon)"
                [size]="20"
                [strokeWidth]="2"
              ></lucide-icon>

              @if (activeCategory() === cat.id) {
              <div
                class="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-10"
              >
                <span
                  class="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-sm shadow-sm border border-blue-100"
                >
                  {{ cat.label }}
                </span>
              </div>
              }
            </a>
            }
          </div>
        </div>
      </header>

      <section class="max-w-7xl mx-auto px-6 py-20">
        @if (filteredProducts().length === 0) {
        <div class="text-center py-20">
          <div
            class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4"
          >
            <lucide-icon [img]="xIcon" [size]="32"></lucide-icon>
          </div>
          <h3 class="font-serif text-xl font-bold text-slate-900 mb-2">
            No reviews found
          </h3>
          <p class="text-slate-500">Try selecting a different category.</p>
          <a
            routerLink="/reviews"
            class="inline-block mt-6 text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-slate-900"
          >
            Clear Filters
          </a>
        </div>
        } @else {
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          @for (product of filteredProducts(); track product.id) {
          <article class="group cursor-pointer flex flex-col h-full">
            <a
              [routerLink]="['/review', product.id]"
              class="block overflow-hidden rounded-lg bg-slate-100 aspect-[4/3] mb-6 relative shadow-sm"
            >
              <img
                [src]="product.image"
                [alt]="product.name"
                loading="lazy"
                class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                (error)="handleImageError($event)"
              />
              <div
                class="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-900 shadow-sm rounded-sm"
              >
                {{ product.category }}
              </div>
            </a>
            <div class="flex flex-col flex-grow">
              <div class="flex items-center gap-2 mb-3">
                <div class="flex text-yellow-500">
                  @for (star of [1,2,3,4,5]; track star) {
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    [attr.fill]="
                      star <= product.rating ? 'currentColor' : 'none'
                    "
                    stroke="currentColor"
                    stroke-width="2"
                    class="opacity-90"
                  >
                    <polygon
                      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                    ></polygon>
                  </svg>
                  }
                </div>
                <span class="text-xs font-bold text-slate-400"
                  >{{ product.rating }}/5</span
                >
              </div>
              <h3
                class="font-serif text-2xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-700 transition-colors"
              >
                <a [routerLink]="['/review', product.id]">{{ product.name }}</a>
              </h3>
              <p
                class="text-slate-600 leading-relaxed text-sm line-clamp-3 mb-6 flex-grow"
              >
                {{ product.summary }}
              </p>
              <div
                class="flex items-center justify-between mt-auto pt-6 border-t border-slate-100"
              >
                <a
                  [routerLink]="['/review', product.id]"
                  class="text-[10px] font-bold uppercase tracking-widest text-slate-900 group-hover:text-blue-700 transition-colors"
                >
                  Read Review
                </a>
                <span
                  class="text-[10px] font-bold uppercase tracking-widest text-slate-300 group-hover:text-blue-300 transition-colors"
                >
                  Check Price →
                </span>
              </div>
            </div>
          </article>
          }
        </div>
        }
      </section>
    </div>
  `,
})
export class ReviewsComponent {
  categories = CATEGORIES;
  products = PRODUCTS;
  route = inject(ActivatedRoute);

  readonly xIcon = X;

  private iconMap: any = {
    chair: Armchair,
    monitor: Monitor,
    lightbulb: Lightbulb,
    briefcase: Briefcase,
    keyboard: Keyboard,
    speaker: Speaker,
  };

  activeCategory = toSignal(
    this.route.queryParams.pipe(map((params) => params["category"] || null))
  );

  filteredProducts = computed(() => {
    const categoryId = this.activeCategory();
    if (!categoryId) return this.products;
    return this.products.filter((p) => p.category === categoryId);
  });

  getIcon(iconName: string): any {
    return this.iconMap[iconName] || Briefcase;
  }

  handleImageError(event: any) {
    event.target.src = "https://picsum.photos/800/600?grayscale";
  }
}
