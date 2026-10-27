/**
 * Site copy & service data. Prices/durations are intentionally omitted until the owner
 * confirms them — every card routes to a WhatsApp enquiry instead.
 */

export interface Img {
  /** path prefix without size suffix, e.g. "images/haircut" → images/haircut-640.webp / -1200.webp */
  base: string;
  alt: string;
}

export interface FeaturedService {
  id: string;
  title: string;
  titleAccent: string;
  text: string;
  icon: string;
  image?: Img;
  enquiry: string;
  layout: 'feature' | 'tall' | 'wide' | 'small' | 'text';
}

export const IMAGES = {
  haircut: { base: 'images/haircut', alt: 'Stylist cutting and shaping a client’s hair with gold scissors' },
  colour: { base: 'images/hair-colour', alt: 'Glossy caramel and honey toned hair colour with soft waves' },
  smoothening: { base: 'images/hair-smoothening', alt: 'Long, sleek and smooth dark hair being finished with a straightener' },
  bridal: { base: 'images/bridal', alt: 'Bride in a red embroidered saree with bridal makeup, floral bun and kundan jewellery' },
  team: { base: 'images/team-lead', alt: 'Portrait of the HAUTE LOOKS lead stylist in the salon' },
} satisfies Record<string, Img>;

export const FEATURED: FeaturedService[] = [
  {
    id: '01',
    title: 'Hair',
    titleAccent: 'Cut',
    text: 'A style chosen for you — not just a trend. We look at your face shape, hair texture and lifestyle before the first snip.',
    icon: 'scissors',
    image: IMAGES.haircut,
    enquiry: 'a haircut',
    layout: 'feature',
  },
  {
    id: '02',
    title: 'Hair',
    titleAccent: 'Colour',
    text: 'Find a shade that complements your look, with a colour consultation before we begin.',
    icon: 'palette',
    image: IMAGES.colour,
    enquiry: 'hair colour',
    layout: 'tall',
  },
  {
    id: '03',
    title: 'Hair',
    titleAccent: 'Smoothening',
    text: 'Hair that looks polished and feels easier to manage day to day.',
    icon: 'sparkles',
    image: IMAGES.smoothening,
    enquiry: 'hair smoothening / treatments',
    layout: 'small',
  },
  {
    id: '04',
    title: 'Skin',
    titleAccent: 'Care',
    text: 'Talk to our team about the skin service that fits your occasion and comfort.',
    icon: 'droplet',
    enquiry: 'skin care services',
    layout: 'text',
  },
  {
    id: '05',
    title: 'Bridal Hair',
    titleAccent: '& Makeup',
    text: 'Your bridal look, planned with care for your special day — makeup, hairstyling and packages built around you.',
    icon: 'crown',
    image: IMAGES.bridal,
    enquiry: 'bridal makeup & hair packages',
    layout: 'wide',
  },
];

export interface ServiceCategory {
  id: string;
  label: string;
  title: string;
  intro: string;
  icon: string;
  image?: Img;
  items: { name: string; text: string }[];
}

export const CATEGORIES: ServiceCategory[] = [
  {
    id: 'hair',
    label: 'Hair',
    title: 'Hair, cut & colour',
    intro: 'From a quick refresh to a complete restyle — every hair service starts with a conversation about what you want.',
    icon: 'scissors',
    image: IMAGES.haircut,
    items: [
      { name: 'Haircuts', text: 'Women’s and men’s cuts shaped to your face, texture and routine.' },
      { name: 'Styling & blow-dry', text: 'Polished finishes for everyday, parties and photographs.' },
      { name: 'Hair colour', text: 'Global colour, highlights and touch-ups after a shade consultation.' },
      { name: 'Hair treatments', text: 'Smoothening and care treatments for frizzy, dry or hard-to-manage hair.' },
      { name: 'Grooming', text: 'Beard shaping, trims and clean-ups for a sharp, easy-to-maintain look.' },
    ],
  },
  {
    id: 'skin',
    label: 'Skin',
    title: 'Skin care',
    intro: 'Relaxing skin services to help you feel fresh and ready. Ask our team for the current skin menu and what suits you.',
    icon: 'droplet',
    items: [
      { name: 'Skin consultation', text: 'Tell us about your skin and occasion — we’ll suggest a suitable service.' },
      { name: 'Skin services', text: 'Ask us for the current skin service menu — we only recommend what suits you.' },
    ],
  },
  {
    id: 'makeup',
    label: 'Makeup',
    title: 'Makeup',
    intro: 'Makeup for the moments that matter, matched to your outfit, lighting and the look you love.',
    icon: 'brush',
    image: IMAGES.colour,
    items: [
      { name: 'Occasion makeup', text: 'Parties, receptions, engagements and family functions.' },
      { name: 'Hair styling for events', text: 'Buns, braids and soft waves to complete your look.' },
    ],
  },
  {
    id: 'bridal',
    label: 'Bridal',
    title: 'Bridal studio',
    intro: 'Bridal makeup, bridal hairstyling and packages — final packages depend on your requirements and event schedule.',
    icon: 'crown',
    image: IMAGES.bridal,
    items: [
      { name: 'Bridal makeup', text: 'A photo-ready bridal look planned around your saree, jewellery and ceremony.' },
      { name: 'Bridal hairstyling', text: 'Traditional and contemporary styles, with flowers and accessories.' },
      { name: 'Bridal packages', text: 'Share your dates and functions and we’ll discuss the right package.' },
    ],
  },
];

export const PROMISES = [
  { icon: 'ear', title: 'We listen first', text: 'Every visit starts with what you want — your style, your occasion, your comfort.' },
  { icon: 'message-square', title: 'Know before you book', text: 'Ask for prices on WhatsApp. No guesswork, no surprise add-ons.' },
  { icon: 'clock', title: 'Open all week', text: 'Appointments seven days a week, so a fresh look fits your schedule.' },
  { icon: 'heart', title: 'Unisex & bridal', text: 'Women, men and brides — one studio for hair, skin and makeup.' },
];

export const FAQS = [
  {
    q: 'Do I need an appointment?',
    a: 'Booking ahead is recommended, especially for bridal and longer services. Contact us to check availability; walk-ins depend on the day’s schedule.',
  },
  {
    q: 'What services do you offer?',
    a: 'We offer hair, skin and makeup services. Contact us for the current service menu and pricing.',
  },
  {
    q: 'Do you offer bridal packages?',
    a: 'Yes — contact our team with your event date and requirements so we can discuss the available bridal options.',
  },
  {
    q: 'How can I know the price before booking?',
    a: 'Message us with the service you are interested in and we will share the applicable price or consultation details.',
  },
  {
    q: 'Where is HAUTE LOOKS located?',
    a: 'We are at 1/5, 7th Street ICICI, Opp. College Road, Subramaniyapuram South, Vairavapuram, Karaikudi 630001. Use the Get Directions link before travelling.',
  },
  {
    q: 'What are your opening hours?',
    a: 'We are open all seven days, 8:30 AM to 9:00 PM. Please confirm with the salon before visiting, as hours may change on holidays.',
  },
  {
    q: 'How do I book?',
    a: 'Call either listed number, start a WhatsApp enquiry or use the enquiry form. Your appointment is confirmed only when the salon replies and confirms availability.',
  },
  {
    q: 'Can I request a particular stylist or bridal look?',
    a: 'Of course. Mention your preference and share reference photos when you enquire. Availability depends on the salon schedule.',
  },
];

/**
 * Before/after pairs. DEMO ONLY until the owner supplies matched, consented client photos:
 * set `demo: false` and provide real `before` / `after` images.
 */
export interface Transformation {
  title: string;
  label: string;
  before: Img;
  after: Img;
  demo: boolean;
}

export const TRANSFORMATIONS: Transformation[] = [
  { title: 'Restyle & cut', label: 'Haircut', before: IMAGES.haircut, after: IMAGES.haircut, demo: true },
  { title: 'Colour & gloss', label: 'Hair colour', before: IMAGES.colour, after: IMAGES.colour, demo: true },
  { title: 'Smooth finish', label: 'Hair treatment', before: IMAGES.smoothening, after: IMAGES.smoothening, demo: true },
  { title: 'Bridal glow', label: 'Bridal makeup', before: IMAGES.bridal, after: IMAGES.bridal, demo: true },
];
