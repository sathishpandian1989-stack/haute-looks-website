import { ChangeDetectionStrategy, Component, ElementRef, Injector, OnInit, afterNextRender, computed, inject, input, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { IconComponent } from '../shared/icon.component';
import { AGE_RANGES, GENDERS, SERVICE_OPTIONS, whatsappLink } from '../core/site.config';
import { LeadInput, LeadService, formatIndianMobile, newSubmissionId, normaliseIndianMobile } from '../core/lead.service';
import { AnalyticsService } from '../core/analytics.service';

type State = 'idle' | 'submitting' | 'success' | 'error';

const indianMobile = (c: AbstractControl): ValidationErrors | null =>
  !c.value || normaliseIndianMobile(c.value) ? null : { mobile: true };

const notPast = (c: AbstractControl): ValidationErrors | null => {
  if (!c.value) return null;
  return c.value < todayIso() ? { past: true } : null;
};

function todayIso(): string {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

@Component({
  selector: 'app-booking-form',
  imports: [ReactiveFormsModule, IconComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss',
})
export class BookingFormComponent implements OnInit {
  readonly presetService = input<string>('');

  private readonly fb = inject(FormBuilder);
  private readonly leads = inject(LeadService);
  private readonly analytics = inject(AnalyticsService);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);

  protected readonly services = SERVICE_OPTIONS;
  protected readonly genders = GENDERS;
  protected readonly ages = AGE_RANGES;
  protected readonly times = ['Morning (8:30 – 12)', 'Afternoon (12 – 4)', 'Evening (4 – 9)', 'Any time'];
  protected readonly minDate = todayIso();
  protected readonly configured = this.leads.configured;

  protected readonly state = signal<State>('idle');
  protected readonly errorMessage = signal('');
  protected readonly leadId = signal('');
  protected readonly attempted = signal(false);

  private submissionId = newSubmissionId();
  private startedAt = Date.now();
  private started = false;

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80), Validators.pattern(/^[\p{L} .'-]+$/u)]],
    whatsapp: ['', [Validators.required, indianMobile]],
    sameNumber: [true],
    phone: ['', [indianMobile]],
    service: ['', Validators.required],
    preferredDate: ['', notPast],
    preferredTime: [''],
    email: ['', [Validators.email, Validators.maxLength(120)]],
    gender: [''],
    ageRange: [''],
    message: ['', Validators.maxLength(1000)],
    consent: [false, Validators.requiredTrue],
    website: [''], // honeypot
  });

  private readonly values = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  protected readonly waPreview = computed(() => {
    const n = normaliseIndianMobile(this.values().whatsapp ?? '');
    return n ? formatIndianMobile(n) : '';
  });
  protected readonly sameNumber = computed(() => this.values().sameNumber ?? true);
  protected readonly messageLength = computed(() => (this.values().message ?? '').length);

  ngOnInit(): void {
    const preset = this.presetService();
    if (preset) this.form.controls.service.setValue(preset);
    this.form.controls.sameNumber.valueChanges.subscribe((same) => {
      const phone = this.form.controls.phone;
      phone.setValidators(same ? [indianMobile] : [Validators.required, indianMobile]);
      if (same) phone.setValue('');
      phone.updateValueAndValidity();
    });
  }

  protected onFirstInteraction(): void {
    if (this.started) return;
    this.started = true;
    this.startedAt = Date.now();
    this.analytics.event('form_start', { form: 'enquiry' });
  }

  protected show(name: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || this.attempted());
  }

  protected error(name: keyof typeof this.form.controls): string {
    const e = this.form.controls[name].errors;
    if (!e) return '';
    if (e['server']) return e['server'];
    switch (name) {
      case 'name':
        return e['required'] ? 'Please enter your name.' : 'Please enter a valid name (letters only, 2–80 characters).';
      case 'whatsapp':
        return e['required']
          ? 'Please enter your WhatsApp number.'
          : 'Enter a 10-digit Indian mobile number (e.g. 98765 43210). +91 is optional.';
      case 'phone':
        return e['required'] ? 'Please enter your phone number.' : 'Enter a valid 10-digit Indian mobile number.';
      case 'service':
        return 'Please choose a service.';
      case 'preferredDate':
        return 'Please choose today or a future date.';
      case 'email':
        return 'Please enter a valid email address, or leave it empty.';
      case 'message':
        return 'Please keep your message under 1000 characters.';
      case 'consent':
        return 'Please agree so we can contact you about your enquiry.';
      default:
        return 'Please check this field.';
    }
  }

  protected async submit(): Promise<void> {
    if (this.state() === 'submitting') return;
    this.attempted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.afterRender(() => this.focusFirstInvalid());
      return;
    }

    this.state.set('submitting');
    this.errorMessage.set('');
    const v = this.form.getRawValue();
    const payload: LeadInput = {
      name: v.name.trim(),
      whatsapp: v.whatsapp.trim(),
      phone: v.sameNumber ? '' : v.phone.trim(),
      gender: v.gender,
      ageRange: v.ageRange,
      service: v.service,
      email: v.email.trim(),
      preferredDate: v.preferredDate,
      preferredTime: v.preferredTime,
      message: v.message.trim(),
      consent: v.consent,
      website: v.website,
    };

    const result = await this.leads.submit(payload, this.submissionId, this.startedAt);
    if (result.ok) {
      this.leadId.set(result.leadId);
      this.state.set('success');
      this.analytics.event('generate_lead', { service: payload.service });
      this.afterRender(() => this.host.nativeElement.querySelector('.success')?.focus());
      return;
    }

    if (result.fieldErrors) {
      for (const [key, msg] of Object.entries(result.fieldErrors)) {
        const control = this.form.get(key);
        control?.setErrors({ ...(control.errors ?? {}), server: msg });
      }
    }
    this.errorMessage.set(result.message);
    this.state.set('error');
    this.afterRender(() => this.host.nativeElement.querySelector('.form-alert')?.focus());
  }

  protected reset(): void {
    this.form.reset({ sameNumber: true, consent: false, service: this.presetService() || '' });
    this.attempted.set(false);
    this.submissionId = newSubmissionId();
    this.started = false;
    this.leadId.set('');
    this.state.set('idle');
  }

  protected whatsappFollowUp(): string {
    return whatsappLink(`Hello HAUTE LOOKS, I just sent an enquiry on your website (ref ${this.leadId()}).`);
  }

  private afterRender(fn: () => void): void {
    afterNextRender(fn, { injector: this.injector });
  }

  private focusFirstInvalid(): void {
    const el = this.host.nativeElement.querySelector('[aria-invalid="true"]') as HTMLElement | null;
    el?.focus();
  }
}
