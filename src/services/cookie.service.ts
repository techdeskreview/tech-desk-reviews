
import { Injectable, signal } from '@angular/core';

export interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class CookieService {
  private readonly STORAGE_KEY = 'techdesk_cookie_consent';
  
  // State management using Signals
  consent = signal<CookieConsent | null>(null);
  showBanner = signal<boolean>(false);

  constructor() {
    this.init();
  }

  private init() {
    // Check local storage for existing consent
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.consent.set(parsed);
        this.showBanner.set(false);
        this.applyConsent(parsed);
      } catch (e) {
        // Fallback if storage is corrupted
        this.showBanner.set(true);
      }
    } else {
      // No consent found, show banner with a slight delay for better UX on first load
      setTimeout(() => this.showBanner.set(true), 500);
    }
  }

  acceptAll() {
    const consent: CookieConsent = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    this.saveConsent(consent);
  }

  rejectNonEssential() {
    const consent: CookieConsent = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    this.saveConsent(consent);
  }

  openSettings() {
    this.showBanner.set(true);
  }

  private saveConsent(consent: CookieConsent) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(consent));
    this.consent.set(consent);
    this.showBanner.set(false);
    this.applyConsent(consent);
  }

  private applyConsent(consent: CookieConsent) {
    // This is where analytics/marketing scripts would be loaded dynamically
    if (consent.analytics) {
      // Example: Load Google Analytics
      console.log('Consent granted: Loading Analytics scripts...');
      // this.loadScript('https://www.googletagmanager.com/gtag/js?id=UA-XXXXX-Y');
    }
    
    if (consent.marketing) {
      console.log('Consent granted: Loading Marketing scripts...');
    }
  }
}
