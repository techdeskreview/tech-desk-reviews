import { Component, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";

@Component({
  selector: "app-static-page",
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-3xl mx-auto px-6 py-20 min-h-[60vh]">
      <a
        routerLink="/"
        class="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline mb-8 block"
        >← Back Home</a
      >

      <h1
        class="font-serif text-4xl md:text-5xl font-black text-slate-900 mb-12 pb-6 border-b border-slate-100"
      >
        {{ title }}
      </h1>

      <div class="prose prose-slate prose-lg max-w-none text-slate-700">
        @if (pageType === "about") {
          <p>
            <strong>Tech Desk Review</strong> is an independent editorial
            publication dedicated to the intersection of productivity,
            ergonomics, and workspace aesthetics. We believe that the
            environment you work in directly influences the quality of your
            output.
          </p>
          <p>
            Our mission is to cut through the marketing noise and provide
            honest, data-driven analysis of desk gear. From standing desks to
            mechanical keyboards, every product we feature has been evaluated
            for build quality, long-term durability, and ergonomic value.
          </p>
        } @else if (pageType === "privacy") {
          <p>
            Your privacy is critically important to us. At Tech Desk Review, we
            have a few fundamental principles:
          </p>
          <ul>
            <li>
              We don't ask you for personal information unless we truly need it.
            </li>
            <li>
              We don't share your personal information with anyone except to
              comply with the law, develop our products, or protect our rights.
            </li>
          </ul>
          <h3>Cookies</h3>
          <p>
            We use cookies to help identify and track visitors, their usage of
            our website, and their website access preferences.
          </p>
        } @else if (pageType === "disclaimer") {
          <p>
            <strong>Tech Desk Review is reader-supported.</strong> When you buy
            through links on our site, we may earn an affiliate commission.
          </p>
          <p>
            Tech Desk Review is a participant in the Amazon Services LLC
            Associates Program, an affiliate advertising program designed to
            provide a means for sites to earn advertising fees by advertising
            and linking to Amazon.com.
          </p>
          <p>
            This comes at <strong>no extra cost to you</strong>. Our reputation
            is our most valuable asset, and we only recommend products that we
            believe provide genuine value to our readers.
          </p>
        } @else if (pageType === "accessibility") {
          <p>
            <strong>Tech Desk Reviews</strong> is committed to ensuring digital
            accessibility for people with disabilities. We are continually
            improving the user experience for everyone and applying the relevant
            accessibility standards.
          </p>

          <h3>Conformance Status</h3>
          <p>
            The Web Content Accessibility Guidelines (WCAG) defines requirements
            for designers and developers to improve accessibility for people
            with disabilities. It defines three levels of conformance: Level A,
            Level AA, and Level AAA.
          </p>
          <p>
            <strong>Tech Desk Reviews</strong> is partially conformant with WCAG
            2.1 level AA. Partially conformant means that some parts of the
            content do not fully conform to the accessibility standard.
          </p>

          <h3>Feedback</h3>
          <p>
            We welcome your feedback on the accessibility of Tech Desk Reviews.
            Please let us know if you encounter accessibility barriers on Tech
            Desk Reviews:
          </p>
          <ul>
            <li>E-mail: support@techdeskreview.com</li>
            <li>Instagram: @techdesk_gear</li>
          </ul>
          <p>We try to respond to feedback within 2 business days.</p>

          <h3>Technical Specifications</h3>
          <p>
            Accessibility of Tech Desk Reviews relies on the following
            technologies to work with the particular combination of web browser
            and any assistive technologies or plugins installed on your
            computer:
          </p>
          <ul>
            <li>HTML</li>
            <li>WAI-ARIA</li>
            <li>CSS</li>
            <li>JavaScript</li>
          </ul>
        }
      </div>
    </div>
  `,
})
export class StaticPageComponent {
  private route = inject(ActivatedRoute);
  pageType: string = "";
  title: string = "";

  constructor() {
    this.route.data.subscribe((data) => {
      this.pageType = data["page"];
      if (this.pageType === "about") this.title = "About Us";
      else if (this.pageType === "privacy") this.title = "Privacy Policy";
      else if (this.pageType === "disclaimer")
        this.title = "Affiliate Disclaimer";
      else if (this.pageType === "accessibility")
        this.title = "Accessibility Statement";
    });
  }
}
