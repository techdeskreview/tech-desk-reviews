import { Component, computed, inject, SecurityContext, EffectRef, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PRODUCTS } from '../data';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeHtml, Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (product(); as p) {
      <article class="animate-in fade-in duration-500">
        <!-- Breadcrumbs -->
        <nav aria-label="Breadcrumb" class="bg-white border-b border-slate-100">
          <div class="max-w-4xl mx-auto px-6 h-12 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
            <a routerLink="/" class="hover:text-slate-900">Home</a>
            <span aria-hidden="true">/</span>
            <a [routerLink]="['/category', p.category]" class="hover:text-slate-900">{{ p.category }}</a>
            <span aria-hidden="true">/</span>
            <span class="text-slate-900" aria-current="page">Review</span>
          </div>
        </nav>

        <!-- Hero -->
        <header class="max-w-4xl mx-auto px-6 py-12 md:py-16">
          <div class="flex flex-col gap-8">
             <div class="flex flex-col gap-4">
               <div class="flex items-center gap-3">
                 <span class="bg-blue-100 text-blue-800 text-[10px] font-bold uppercase px-2 py-1 tracking-widest rounded-sm">
                   Editor's Choice
                 </span>
                 <div class="flex items-center gap-1 text-yellow-500" [attr.aria-label]="'Rating: ' + p.rating + ' out of 5 stars'">
                   @for(star of [1,2,3,4,5]; track star) {
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" [attr.fill]="star <= p.rating ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" aria-hidden="true">
                       <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                     </svg>
                   }
                   <span class="text-slate-900 font-bold ml-1 text-sm" aria-hidden="true">{{ p.rating }}/5</span>
                 </div>
               </div>
               <h1 class="font-serif text-4xl md:text-6xl font-black text-slate-900 leading-[1.1]">
                 {{ p.name }}
               </h1>
               <p class="text-xl md:text-2xl text-slate-500 font-serif italic">
                 "{{ p.verdict }}"
               </p>
             </div>

             <!-- Hero Image & Quick Actions -->
             <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-8">
               <div class="relative aspect-[4/5] bg-slate-100 rounded-lg overflow-hidden shadow-sm border border-slate-200">
                  <img [src]="p.image" [alt]="p.name" 
                       class="w-full h-full object-cover"
                       (error)="handleImageError($event)">
                  <!-- Pinterest Pin Button Overlay (Conceptual) -->
                  <div class="absolute top-4 right-4">
                     <a [href]="getPinterestShareUrl(p)"
                        target="_blank"
                        aria-label="Save to Pinterest"
                        class="bg-white/90 p-2 rounded-full hover:bg-red-600 hover:text-white text-red-600 transition-colors shadow-md flex items-center gap-2">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.497-.698-2.433-2.888-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z"/></svg>
                        <span class="text-xs font-bold uppercase hidden md:inline">Save</span>
                     </a>
                  </div>
               </div>
               
               <div class="flex flex-col gap-6 justify-center h-full">
                  <div class="bg-slate-50 p-6 rounded-lg border border-slate-100">
                    <h3 class="font-bold text-sm uppercase tracking-widest text-slate-500 mb-2">Verdict</h3>
                    <p class="text-slate-800 font-medium leading-relaxed">{{ p.summary }}</p>
                  </div>
                  
                  <div class="flex flex-col gap-3">
                    <a [href]="p.amazonLink" target="_blank" class="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-bold text-center py-4 rounded shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group">
                      Check Price on Amazon
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" x2="21" y1="14" y2="3"></line></svg>
                    </a>
                    <p class="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                      Secure Transaction via Amazon
                    </p>
                  </div>
               </div>
             </div>
          </div>
        </header>

        <!-- Main Content -->
        <div class="max-w-3xl mx-auto px-6 pb-20">
          <div class="prose prose-slate prose-lg max-w-none text-slate-700">
            <!-- Dynamic HTML Content -->
            <div [innerHTML]="sanitizedContent()"></div>
            
            <h3>Why We Picked It</h3>
            <p>{{ p.whyWePicked }}</p>
            
            <div class="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
               <div class="bg-green-50 p-6 rounded-lg border border-green-100">
                 <h4 class="text-green-800 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
                   The Pros
                 </h4>
                 <ul class="space-y-2">
                   @for (pro of p.pros; track pro) {
                     <li class="flex items-start gap-2 text-sm text-green-900">
                       <span class="text-green-500 mt-1" aria-hidden="true">•</span> {{ pro }}
                     </li>
                   }
                 </ul>
               </div>
               
               <div class="bg-red-50 p-6 rounded-lg border border-red-100">
                 <h4 class="text-red-800 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                   The Cons
                 </h4>
                 <ul class="space-y-2">
                   @for (con of p.cons; track con) {
                     <li class="flex items-start gap-2 text-sm text-red-900">
                       <span class="text-red-500 mt-1" aria-hidden="true">•</span> {{ con }}
                     </li>
                   }
                 </ul>
               </div>
            </div>
            
            <div class="bg-slate-50 p-8 rounded-xl border-l-4 border-[#FFD814] my-12 text-center not-prose shadow-sm">
               <h3 class="font-serif text-2xl font-bold text-slate-900 mb-2">Ready to Upgrade?</h3>
               <p class="text-slate-500 mb-6 max-w-md mx-auto">See the latest pricing and availability.</p>
               <a [href]="p.amazonLink" target="_blank" class="inline-block px-8 py-4 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-bold rounded shadow-sm hover:shadow-md transition-all">
                 View Deal on Amazon
               </a>
            </div>
          </div>
        </div>
      </article>
    }
  `
})
export class ProductComponent {
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);
  
  // LÓGICA ATUALIZADA: Lê a string (slug) da URL
  productSlug = toSignal(this.route.paramMap.pipe(map(params => params.get('slug'))));
  product = computed(() => PRODUCTS.find(p => p.slug === this.productSlug()));
  
  // Safe HTML content
  sanitizedContent = computed(() => {
    const html = this.product()?.fullArticle || '';
    return this.sanitizer.sanitize(SecurityContext.HTML, html);
  });

  currentUrl = window.location.href;

  constructor() {
    effect(() => {
      const p = this.product();
      if (p) {
        this.titleService.setTitle(`${p.name} Review | Tech Desk`);
        this.metaService.updateTag({ name: 'description', content: p.summary });
        this.metaService.updateTag({ property: 'og:title', content: p.name });
        this.metaService.updateTag({ property: 'og:description', content: p.summary });
        
        // Construct paths for standardized assets
        const filename = p.image.split('/').pop();
        // OG Path: assets/images/og/[filename]
        const ogImage = `assets/images/og/${filename}`;
        
        this.metaService.updateTag({ property: 'og:image', content: window.location.origin + '/' + ogImage });
        
        this.addJsonLd(p);
      }
    });
  }

  getPinterestShareUrl(p: any): string {
      const filename = p.image.split('/').pop();
      // Pinterest Path: assets/images/pinterest/[filename]
      const pinterestImage = `assets/images/pinterest/${filename}`;
      const mediaUrl = window.location.origin + '/' + pinterestImage;
      const url = encodeURIComponent(window.location.href);
      const media = encodeURIComponent(mediaUrl);
      const description = encodeURIComponent(p.name);
      return `https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${description}`;
  }

  addJsonLd(product: any) {
    // Remove existing JSON-LD
    const existingScript = this.document.getElementById('json-ld');
    if (existingScript) {
      existingScript.remove();
    }

    const script = this.document.createElement('script');
    script.id = 'json-ld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": window.location.origin + '/' + product.image,
      "description": product.summary,
      "brand": {
        "@type": "Brand",
        "name": "Tech Desk Reviews"
      },
      "review": {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": product.rating,
          "bestRating": "5"
        },
        "author": {
          "@type": "Organization",
          "name": "Tech Desk Independent Reviews"
        }
      }
    });
    this.document.head.appendChild(script);
  }

  handleImageError(event: any) {
    event.target.src = 'https://picsum.photos/800/1000?grayscale';
  }
}