import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SITE, fullAddress } from '../core/site.config';

@Component({
  selector: 'app-privacy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section legal">
      <div class="container narrow">
        <p class="eyebrow">Legal</p>
        <h1 class="display-2">Privacy policy</h1>
        <p class="micro updated">Last updated: {{ updated }}</p>

        <p class="note">
          This policy explains how {{ site.fullName }} (“HAUTE LOOKS”, “we”) handles the information you share through this
          website. It should be reviewed and approved by the salon owner before launch.
        </p>

        <h2>What we collect</h2>
        <p>When you send an enquiry we collect:</p>
        <ul>
          <li>Your name, WhatsApp number and (if different) a phone number for calls</li>
          <li>The service you are interested in, and optionally a preferred date/time and message</li>
          <li>Optionally, your email address, gender and age range — only if you choose to share them</li>
          <li>Your consent to be contacted and the time of your enquiry</li>
          <li>
            How you found us, where available (for example a campaign link or the referring website). We do not guess this when
            it isn’t available.
          </li>
        </ul>
        <p>We do not ask for, and you should not send, sensitive personal information such as health or financial details.</p>

        <h2>Why we use it</h2>
        <p>
          We use your details only to respond to your enquiry, discuss services and prices, and confirm appointments. Optional
          gender and age-range details help us suggest suitable services. We do not sell or rent your information.
        </p>

        <h2>Where it is stored</h2>
        <p>
          Enquiries are stored in a private Google Sheet that only authorised salon staff can access, via a secure Google Apps
          Script connection. The salon owner receives an email notification of each new enquiry.
        </p>

        <h2>How long we keep it</h2>
        <p>
          We keep enquiry records for up to 12 months after our last contact with you, unless you become a client and ask us to
          keep your preferences on file, after which they are deleted.
        </p>

        <h2>Analytics</h2>
        <p>
          If enabled, we use Google Analytics to understand how visitors use the website (for example, which pages are viewed
          and whether the call or WhatsApp buttons are used). Analytics loads only after you choose “Allow” in the consent
          banner. You can change your choice by clearing this site’s storage in your browser.
        </p>

        <h2>Third-party links</h2>
        <p>
          WhatsApp, Instagram and Google Maps links open those services, which have their own privacy policies.
        </p>

        <h2>Your choices</h2>
        <p>
          You can ask us to view, correct or delete the details you shared at any time by contacting us at
          <a [href]="'mailto:' + site.email">{{ site.email }}</a> or {{ site.phones[0].display }}.
        </p>

        <h2>Contact</h2>
        <p>{{ site.fullName }}<br />{{ address }}</p>
      </div>
    </section>
  `,
  styles: `
    .legal {
      padding-top: calc(var(--header-h) + 72px);
    }
    .narrow {
      max-width: 860px;
    }
    .updated {
      margin: 18px 0 32px;
    }
    .note {
      padding: 18px 20px;
      border: 1px dashed var(--gold-line);
      font-size: 15px;
    }
    h2 {
      font-size: 1.9rem;
      margin: 44px 0 14px;
    }
    ul {
      padding-left: 20px;
      display: grid;
      gap: 8px;
      margin: 0 0 1em;
    }
    a {
      text-underline-offset: 4px;
    }
  `,
})
export class PrivacyPage {
  protected readonly site = SITE;
  protected readonly address = fullAddress();
  protected readonly updated = 'October 2026';
}
