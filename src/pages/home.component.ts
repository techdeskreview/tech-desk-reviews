import { Component, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CATEGORIES, PRODUCTS } from "../data";
import { NgOptimizedImage, CommonModule } from "@angular/common";
import {
  LucideAngularModule,
  Armchair,
  Monitor,
  Lightbulb,
  Briefcase,
  Keyboard,
  Speaker,
} from "lucide-angular";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, CommonModule, LucideAngularModule],
  template: `
    <header class="relative bg-white pt-24 pb-20 px-6 border-b border-slate-50">
      <div class="max-w-5xl mx-auto text-center">
        <h1
          class="font-serif text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]"
        >
          Work <span class="italic text-blue-700">Elevated.</span>
        </h1>
        <p
          class="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Professional gear analysis for the modern workspace. We test the
          products that define your productivity.
        </p>
        <div
          class="flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <button
            (click)="scrollToGrid()"
            class="px-8 py-4 bg-slate-900 text-white font-bold uppercase tracking-widest text-xs hover:bg-blue-700 transition-colors rounded-sm w-full md:w-auto"
          >
            Browse Categories
          </button>
          <button
            (click)="scrollToReviews()"
            class="px-8 py-4 bg-white border border-slate-200 text-slate-900 font-bold uppercase tracking-widest text-xs hover:border-slate-900 transition-colors rounded-sm w-full md:w-auto"
          >
            Latest Reviews
          </button>
        </div>
      </div>
    </header>

    <section
      id="categories-grid"
      class="max-w-7xl mx-auto px-6 py-20 bg-slate-50/50"
    >
      <div class="flex items-center justify-between mb-12">
        <h2 class="font-serif text-3xl font-bold text-slate-900">
          Explore Gear
        </h2>
        <div class="h-px bg-slate-200 flex-grow ml-8"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (cat of categories; track cat.id) {
          <a
            [routerLink]="['/reviews']"
            [queryParams]="{ category: cat.id }"
            class="group relative overflow-hidden bg-white p-8 rounded-xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300"
          >
            <div class="relative z-10">
              <span
                class="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 mb-3 block opacity-0 transform -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                >Browse</span
              >
              <h3
                class="font-serif text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2"
              >
                {{ cat.label }}
              </h3>
              <p class="text-sm text-slate-500 leading-relaxed">
                {{ cat.desc }}
              </p>
            </div>
            <div
              class="absolute bottom-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 text-slate-900"
            >
              <lucide-icon
                [img]="getIcon(cat.icon)"
                [size]="64"
                [strokeWidth]="1.5"
              ></lucide-icon>
            </div>
          </a>
        }
      </div>
    </section>

    <section id="latest-reviews" class="max-w-7xl mx-auto px-6 py-20">
      <div class="flex items-center justify-between mb-12">
        <h2 class="font-serif text-3xl font-bold text-slate-900">
          Latest Analysis
        </h2>
        <a
          routerLink="/reviews"
          class="hidden md:block text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-slate-900 transition-colors"
          >View All Reviews →</a
        >
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
      >
        @for (product of latestProducts; track product.id) {
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
                  @for (star of [1, 2, 3, 4, 5]; track star) {
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
              <a
                [routerLink]="['/review', product.id]"
                class="inline-flex items-center text-xs font-bold uppercase tracking-widest text-blue-700 hover:text-blue-900 mt-auto group-hover:underline decoration-blue-200 underline-offset-4"
              >
                Read Full Review
              </a>
            </div>
          </article>
        }
      </div>
    </section>
  `,
})
export class HomeComponent {
  categories = CATEGORIES;

  // A MÁGICA ESTÁ AQUI: O .sort inverte a lista e coloca os IDs maiores (mais novos) primeiro
  latestProducts = [...PRODUCTS].sort((a, b) => b.id - a.id).slice(0, 9);

  private iconMap: any = {
    chair: Armchair,
    monitor: Monitor,
    lightbulb: Lightbulb,
    briefcase: Briefcase,
    keyboard: Keyboard,
    speaker: Speaker,
  };

  getIcon(iconName: string): any {
    return this.iconMap[iconName] || Briefcase;
  }

  scrollToGrid() {
    document
      .getElementById("categories-grid")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  scrollToReviews() {
    document
      .getElementById("latest-reviews")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  handleImageError(event: any) {
    event.target.src = "https://picsum.photos/800/600?grayscale";
  }
}
