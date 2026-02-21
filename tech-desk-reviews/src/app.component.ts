import { Component, computed, signal, inject } from "@angular/core";
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from "@angular/router";
import { CATEGORIES } from "./data";
import { CommonModule } from "@angular/common";
import { CookieConsentComponent } from "./components/cookie-consent.component";
import { CookieService } from "./services/cookie.service";
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
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    CookieConsentComponent,
    LucideAngularModule,
  ],
  template: `
    <div class="min-h-screen flex flex-col font-sans bg-white text-slate-700">
      <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:font-bold focus:shadow-lg"
      >
        Skip to content
      </a>

      @if (isCategoryMenuOpen() || isSearchOpen() || isMobileMenuOpen()) {
        <div
          class="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-[1px] transition-all"
          (click)="closeAllMenus()"
        ></div>
      }

      <nav
        aria-label="Main Navigation"
        class="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-slate-100 transition-all duration-300"
      >
        <div
          class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative"
        >
          <div class="flex items-center gap-8">
            <a
              routerLink="/"
              (click)="closeAllMenus()"
              aria-label="Tech Desk Independent Reviews Home"
              class="flex flex-col group z-50 relative"
            >
              <span
                class="font-serif text-2xl font-black text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors"
              >
                Tech Desk<span class="text-blue-600">.</span>
              </span>
              <span
                class="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400 group-hover:text-slate-600 transition-colors"
              >
                Independent Reviews
              </span>
            </a>

            <div
              class="hidden md:block w-px h-8 bg-slate-100"
              role="separator"
            ></div>

            <div class="hidden md:flex items-center gap-8">
              <a
                routerLink="/reviews"
                class="text-xs font-bold uppercase tracking-widest text-slate-900 hover:text-blue-700 transition-colors"
                routerLinkActive="text-blue-700"
              >
                All Reviews
              </a>

              <div class="relative">
                <button
                  (click)="toggleCategoryMenu()"
                  (keydown.escape)="closeCategoryMenu()"
                  [attr.aria-expanded]="isCategoryMenuOpen()"
                  aria-haspopup="true"
                  aria-controls="category-dropdown"
                  class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 hover:text-blue-700 transition-colors z-50 relative"
                >
                  Categories
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    [class.rotate-180]="isCategoryMenuOpen()"
                    class="transition-transform duration-200"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                @if (isCategoryMenuOpen()) {
                  <div
                    id="category-dropdown"
                    role="menu"
                    class="absolute top-full left-0 mt-6 w-64 bg-white border border-slate-100 shadow-xl rounded-lg p-2 animate-in fade-in slide-in-from-top-2 z-50"
                  >
                    <div class="flex flex-col">
                      <a
                        routerLink="/reviews"
                        role="menuitem"
                        (click)="closeCategoryMenu()"
                        class="px-4 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50 hover:text-blue-700 rounded-md transition-colors flex items-center justify-between"
                      >
                        View All
                        <span class="opacity-50">→</span>
                      </a>
                      <div
                        class="h-px bg-slate-100 my-2"
                        role="separator"
                      ></div>
                      @for (cat of categories; track cat.id) {
                        <a
                          [routerLink]="['/reviews']"
                          [queryParams]="{ category: cat.id }"
                          role="menuitem"
                          (click)="closeCategoryMenu()"
                          class="px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-700 rounded-md transition-colors flex items-center justify-between group"
                        >
                          {{ cat.label }}
                          <span
                            class="opacity-0 group-hover:opacity-100 text-blue-400"
                            aria-hidden="true"
                            >→</span
                          >
                        </a>
                      }
                    </div>
                  </div>
                }
              </div>

              <button
                (click)="toggleSearch()"
                aria-label="Toggle Search"
                class="text-slate-500 hover:text-blue-700 transition-colors flex items-center gap-2 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  class="group-hover:scale-110 transition-transform"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center gap-6">
            <a
              href="https://www.pinterest.com/techdesk_gear/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Tech Desk on Pinterest"
              class="hidden md:flex items-center gap-2 text-slate-500 hover:text-[#E60023] transition-colors group"
            >
              <span
                class="text-[10px] font-bold uppercase tracking-widest group-hover:text-slate-900"
                >Follow us</span
              >
              <svg
                role="img"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.497-.698-2.433-2.888-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z"
                />
              </svg>
            </a>

            <button
              (click)="toggleMobileMenu()"
              class="md:hidden p-2 text-slate-900 hover:bg-slate-50 rounded-lg"
              [attr.aria-expanded]="isMobileMenuOpen()"
              aria-label="Toggle Mobile Menu"
            >
              @if (!isMobileMenuOpen()) {
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              } @else {
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              }
            </button>
          </div>
        </div>

        @if (isSearchOpen()) {
          <div
            class="absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl p-6 z-40 animate-in slide-in-from-top-2"
          >
            <div class="max-w-3xl mx-auto relative">
              <input
                #searchInput
                id="search-input"
                type="text"
                placeholder="Search reviews..."
                autofocus
                (keydown.enter)="performSearch(searchInput.value)"
                class="w-full bg-slate-50 border border-slate-200 rounded-lg py-4 px-6 pr-12 text-lg font-serif focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-900"
              />
              <button
                (click)="performSearch(searchInput.value)"
                aria-label="Submit Search"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
            <div class="text-center mt-4">
              <button
                (click)="closeSearch()"
                class="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600"
              >
                Close Search
              </button>
            </div>
          </div>
        }
        @if (isMobileMenuOpen()) {
          <div
            class="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl py-6 px-6 flex flex-col gap-4 animate-in slide-in-from-top-4 z-40 max-h-[80vh] overflow-y-auto"
          >
            <div class="relative mb-2">
              <label for="mobile-search-input" class="sr-only">Search</label>
              <input
                #mobileSearchInput
                id="mobile-search-input"
                type="text"
                placeholder="Search..."
                (keydown.enter)="performSearch(mobileSearchInput.value)"
                class="w-full bg-slate-50 border border-slate-200 rounded-md py-3 px-4 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <a
              routerLink="/reviews"
              (click)="closeMobileMenu()"
              class="text-lg font-serif font-black text-slate-900 py-2 border-b border-slate-100"
            >
              All Reviews
            </a>

            <div class="pb-4 border-b border-slate-100">
              <h3
                class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4"
              >
                Categories
              </h3>
              <div class="flex flex-col gap-2">
                @for (cat of categories; track cat.id) {
                  <a
                    [routerLink]="['/reviews']"
                    [queryParams]="{ category: cat.id }"
                    (click)="closeMobileMenu()"
                    class="text-lg font-serif font-bold text-slate-800 py-2 hover:text-blue-700"
                  >
                    {{ cat.label }}
                  </a>
                }
              </div>
            </div>

            <div class="flex flex-col gap-3">
              <a
                routerLink="/about"
                (click)="closeMobileMenu()"
                class="text-sm font-medium text-slate-600"
                >About Us</a
              >
              <a
                href="https://www.pinterest.com/techdesk_gear/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm font-medium text-[#E60023] flex items-center gap-2"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.497-.698-2.433-2.888-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z"
                  />
                </svg>
                Follow on Pinterest
              </a>
            </div>
          </div>
        }
      </nav>

      <main id="main-content" class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <footer class="bg-slate-50 border-t border-slate-200 mt-20 pt-16 pb-12">
        <div class="max-w-7xl mx-auto px-6 text-center md:text-left">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div class="col-span-1 md:col-span-2">
              <span
                class="font-serif text-xl font-black text-slate-900 mb-4 block"
                >Tech Desk.</span
              >
              <p class="text-slate-500 text-sm leading-relaxed max-w-sm mb-6">
                Independent editorial publication dedicated to the intersection
                of productivity, ergonomics, and workspace aesthetics.
              </p>
              <a
                href="https://www.pinterest.com/techdesk_gear/"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 hover:text-[#E60023] transition-colors"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.497-.698-2.433-2.888-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z"
                  />
                </svg>
                Follow us on Pinterest
              </a>
            </div>
            <div>
              <h4
                class="font-bold text-slate-900 uppercase tracking-widest text-xs mb-6"
              >
                Browse
              </h4>
              <ul class="space-y-3">
                <li>
                  <a
                    routerLink="/reviews"
                    class="text-sm text-slate-500 hover:text-blue-700 transition-colors"
                    >All Reviews</a
                  >
                </li>
                @for (cat of categories; track cat.id) {
                  <li>
                    <a
                      [routerLink]="['/reviews']"
                      [queryParams]="{ category: cat.id }"
                      class="text-sm text-slate-500 hover:text-blue-700 transition-colors"
                      >{{ cat.label }}</a
                    >
                  </li>
                }
              </ul>
            </div>
            <div>
              <h4
                class="font-bold text-slate-900 uppercase tracking-widest text-xs mb-6"
              >
                Legal
              </h4>
              <ul class="space-y-3">
                <li>
                  <a
                    routerLink="/privacy"
                    class="text-sm text-slate-500 hover:text-blue-700 transition-colors"
                    >Privacy Policy</a
                  >
                </li>
                <li>
                  <a
                    routerLink="/accessibility"
                    class="text-sm text-slate-500 hover:text-blue-700 transition-colors"
                    >Accessibility Statement</a
                  >
                </li>
                <li>
                  <a
                    routerLink="/disclaimer"
                    class="text-sm text-slate-500 hover:text-blue-700 transition-colors"
                    >Affiliate Disclaimer</a
                  >
                </li>
                <li>
                  <a
                    routerLink="/about"
                    class="text-sm text-slate-500 hover:text-blue-700 transition-colors"
                    >About Us</a
                  >
                </li>
              </ul>
            </div>
          </div>
          <div
            class="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <p class="text-xs text-slate-400 font-medium">
              © {{ year }} Tech Desk Review. All rights reserved.
            </p>
            <p class="text-xs text-slate-400 italic">
              As an Amazon Associate we earn from qualifying purchases.
            </p>
          </div>
        </div>
      </footer>

      <app-cookie-consent></app-cookie-consent>
    </div>
  `,
})
export class AppComponent {
  categories = CATEGORIES;
  isMobileMenuOpen = signal(false);
  isCategoryMenuOpen = signal(false);
  isSearchOpen = signal(false);
  year = new Date().getFullYear();
  cookieService = inject(CookieService);

  // Registro dos ícones
  readonly chair = Armchair;
  readonly monitor = Monitor;
  readonly lightbulb = Lightbulb;
  readonly briefcase = Briefcase;
  readonly keyboard = Keyboard;
  readonly speaker = Speaker;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.closeAllMenus();
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((v) => !v);
    this.isCategoryMenuOpen.set(false);
    this.isSearchOpen.set(false);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  toggleCategoryMenu() {
    this.isCategoryMenuOpen.update((v) => !v);
    this.isSearchOpen.set(false);
  }

  closeCategoryMenu() {
    this.isCategoryMenuOpen.set(false);
  }

  toggleSearch() {
    this.isSearchOpen.update((v) => !v);
    this.isCategoryMenuOpen.set(false);
    this.isMobileMenuOpen.set(false);
  }

  closeSearch() {
    this.isSearchOpen.set(false);
  }

  closeAllMenus() {
    this.isCategoryMenuOpen.set(false);
    this.isMobileMenuOpen.set(false);
    this.isSearchOpen.set(false);
  }

  performSearch(query: string) {
    if (query.trim()) {
      this.router.navigate(["/search"], { queryParams: { q: query } });
      this.closeAllMenus();
    }
  }
}
