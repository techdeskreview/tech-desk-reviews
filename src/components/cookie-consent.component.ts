
import { Component, inject, ElementRef, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CookieService } from '../services/cookie.service';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (cookieService.showBanner()) {
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="cookie-heading" 
        aria-describedby="cookie-desc"
        class="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-[100] p-6 md:p-8 animate-in slide-in-from-bottom duration-500 font-sans">
        
        <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div class="flex-1 max-w-4xl">
            <h2 id="cookie-heading" class="text-lg font-serif font-bold text-slate-900 mb-2">We value your privacy</h2>
            <p id="cookie-desc" class="text-sm text-slate-600 leading-relaxed">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
              Strictly necessary cookies are always active. 
              By clicking "Accept All", you consent to our use of analytics and marketing cookies. 
              Read our <a routerLink="/privacy" class="text-blue-600 underline hover:text-blue-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-sm">Privacy Policy</a>.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto min-w-fit">
            <button 
              (click)="cookieService.rejectNonEssential()"
              class="px-6 py-3 border border-slate-300 bg-white rounded-md text-slate-700 font-bold text-sm uppercase tracking-wider hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 w-full sm:w-auto">
              Reject Non-Essential
            </button>
            <button 
              #acceptBtn
              (click)="cookieService.acceptAll()"
              class="px-6 py-3 bg-blue-600 rounded-md text-white font-bold text-sm uppercase tracking-wider hover:bg-blue-700 shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 w-full sm:w-auto">
              Accept All
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class CookieConsentComponent {
  cookieService = inject(CookieService);
  @ViewChild('acceptBtn') acceptBtn!: ElementRef;

  constructor() {
    // Focus management for Accessibility
    effect(() => {
        if (this.cookieService.showBanner()) {
            // Wait for animation to start/render
            setTimeout(() => {
                 this.acceptBtn?.nativeElement?.focus();
            }, 100); 
        }
    });
  }
}
