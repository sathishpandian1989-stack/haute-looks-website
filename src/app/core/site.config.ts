/**
 * Central business configuration for HAUTE LOOKS.
 * Every phone number, link, address and hour shown on the site comes from here.
 * Values marked "CONFIRM" were supplied by the client and must be verified before launch.
 */

export interface PhoneLine {
  label: string;
  display: string;
  /** E.164 digits without "+" (used for tel: and wa.me links) */
  digits: string;
}

export const SITE = {
  name: 'HAUTE LOOKS',
  fullName: 'HAUTE LOOKS Unisex Salon & Bridal Studio',
  descriptor: 'Unisex Salon & Bridal Studio',
  city: 'Karaikudi',
  tagline: 'Professional haircuts and bridal packages at affordable prices',

  /** Production URL (no trailing slash). Update when a custom domain is connected. */
  url: 'https://sathishpandian1989-stack.github.io/haute-looks-website',

  address: {
    street: '1/5, 7th Street ICICI, Opp. College Road',
    locality: 'Subramaniyapuram South, Vairavapuram',
    city: 'Karaikudi',
    region: 'Tamil Nadu',
    postalCode: '630001',
    country: 'IN',
  },

  /** CONFIRM: which number receives WhatsApp bookings. The first entry is treated as primary. */
  phones: [
    { label: 'Bookings', display: '+91 99760 81533', digits: '919976081533' },
    { label: 'Salon line', display: '+91 63837 03734', digits: '916383703734' },
  ] as PhoneLine[],

  email: 'sathishpandian1989@gmail.com',

  /** CONFIRM: hours supplied as all 7 days, 8:30 AM – 9:00 PM */
  hours: {
    label: 'Open all 7 days',
    display: '8:30 AM – 9:00 PM',
    opens: '08:30',
    closes: '21:00',
  },

  instagram: {
    handle: '@hautelooks_karaikudi',
    url: 'https://www.instagram.com/hautelooks_karaikudi/',
  },

  /** CONFIRM: replace with the final public Google Maps / Business Profile URL. */
  googleProfileUrl: 'https://share.google/fgePtLJBMqmwMoUS9',
  directionsUrl: 'https://share.google/fgePtLJBMqmwMoUS9',
  /**
   * Paste the iframe "src" from Google Maps → Share → Embed a map once the exact pin is verified.
   * Leave empty to show the directions card instead of a (possibly wrong) guessed pin.
   */
  mapEmbedUrl: '',

  whatsappGreeting: "Hello HAUTE LOOKS, I'd like to enquire about an appointment.",

  /** Leadership: name/bio only once provided and approved by the owner. */
  leader: {
    name: '',
    role: 'Founder & Lead Stylist',
    portrait: 'images/team-lead',
  },
} as const;

export const SERVICE_OPTIONS = [
  'Haircut & Styling',
  "Men's Haircut & Beard Grooming",
  'Hair Colour',
  'Hair Smoothening / Treatment',
  'Skin Care',
  'Occasion Makeup',
  'Bridal Makeup & Hair Package',
  'Other / Not sure yet',
] as const;

export const AGE_RANGES = ['Under 18', '18–24', '25–34', '35–44', '45–54', '55+', 'Prefer not to say'] as const;
export const GENDERS = ['Female', 'Male', 'Other', 'Prefer not to say'] as const;

export function primaryPhone(): PhoneLine {
  return SITE.phones[0];
}

export function whatsappLink(message: string = SITE.whatsappGreeting, phone: PhoneLine = primaryPhone()): string {
  return `https://wa.me/${phone.digits}?text=${encodeURIComponent(message)}`;
}

export function telLink(phone: PhoneLine): string {
  return `tel:+${phone.digits}`;
}

export function serviceEnquiry(service: string): string {
  return whatsappLink(`Hello HAUTE LOOKS, I'd like to enquire about ${service}. Could you share availability and pricing?`);
}

export function fullAddress(): string {
  const a = SITE.address;
  return `${a.street}, ${a.locality}, ${a.city} ${a.postalCode}`;
}
