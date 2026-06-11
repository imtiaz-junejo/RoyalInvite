export type ThemeKey = "gold" | "rose" | "emerald" | "ivory"

export interface ThemeConfig {
  key: ThemeKey
  name: string
  bg: string
  bg2: string
  surface: string
  accent: string
  accent2: string
  text: string
  textDark: string
  glow: string
  cardFront: string
  cardInner: string
  coverGradient: string
}

export const themes: Record<ThemeKey, ThemeConfig> = {
  gold: {
    key: "gold",
    name: "Royal Gold",
    bg: "#0d0a04",
    bg2: "#1a1208",
    surface: "#221a08",
    accent: "#c9a84c",
    accent2: "#e8d5a3",
    text: "#fdf8f0",
    textDark: "#1a1208",
    glow: "rgba(201,168,76,0.3)",
    cardFront: "linear-gradient(145deg, #1a1208 0%, #2d2010 50%, #1a1208 100%)",
    cardInner: "linear-gradient(160deg, #fdf8f0 0%, #f5ead8 100%)",
    coverGradient: "linear-gradient(160deg, #0d0a04 0%, #2d2010 50%, #0d0a04 100%)",
  },
  rose: {
    key: "rose",
    name: "Rose Blush",
    bg: "#1a0810",
    bg2: "#2d0f1c",
    surface: "#3d1526",
    accent: "#e8739a",
    accent2: "#f5b8cc",
    text: "#fff5f8",
    textDark: "#2d0f1c",
    glow: "rgba(232,115,154,0.3)",
    cardFront: "linear-gradient(145deg, #2d0f1c 0%, #5c1f38 50%, #2d0f1c 100%)",
    cardInner: "linear-gradient(160deg, #fff5f8 0%, #fde8ef 100%)",
    coverGradient: "linear-gradient(160deg, #1a0810 0%, #5c1f38 50%, #1a0810 100%)",
  },
  emerald: {
    key: "emerald",
    name: "Emerald Night",
    bg: "#020d08",
    bg2: "#041a0e",
    surface: "#072816",
    accent: "#3dd68c",
    accent2: "#a8f0cc",
    text: "#f0fdf5",
    textDark: "#041a0e",
    glow: "rgba(61,214,140,0.3)",
    cardFront: "linear-gradient(145deg, #041a0e 0%, #0d4a22 50%, #041a0e 100%)",
    cardInner: "linear-gradient(160deg, #f0fdf5 0%, #dcf5e8 100%)",
    coverGradient: "linear-gradient(160deg, #020d08 0%, #0d4a22 50%, #020d08 100%)",
  },
  ivory: {
    key: "ivory",
    name: "Minimal Ivory",
    bg: "#f5f0e8",
    bg2: "#ece5d5",
    surface: "#e5ddc8",
    accent: "#8b6914",
    accent2: "#c9a84c",
    text: "#2a1f0a",
    textDark: "#2a1f0a",
    glow: "rgba(139,105,20,0.2)",
    cardFront: "linear-gradient(145deg, #ddd3ba 0%, #f0e8d5 50%, #ddd3ba 100%)",
    cardInner: "linear-gradient(160deg, #fffef9 0%, #faf6ec 100%)",
    coverGradient: "linear-gradient(160deg, #ddd3ba 0%, #f0e8d5 50%, #ddd3ba 100%)",
  },
}

export type FontKey = "cormorant" | "cinzel" | "lato"

export const fonts: Record<FontKey, { name: string; style: string }> = {
  cormorant: { name: "Cormorant Garamond", style: "'Cormorant Garamond', serif" },
  cinzel: { name: "Cinzel", style: "'Cinzel', serif" },
  lato: { name: "Lato", style: "'Lato', sans-serif" },
}

export type TemplateKey = "royal" | "floral" | "modern" | "mehndi" | "nikah" | "heritage"

export interface TemplateConfig {
  key: TemplateKey
  name: string
  theme: ThemeKey
  font: FontKey
  bride: string
  groom: string
  headline: string
  message: string
  familyNames: string
  venueName: string
  venueAddress: string
  dressCode: string
  musicTitle: string
  musicArtist: string
  storyTitle?: string
  storyText?: string
  mealOptions?: string
  scheduleText?: string
  eventSeriesTitle?: string
  eventSeriesText?: string
  primaryLanguage?: "en" | "hi" | "ur" | "mr" | "gu"
  secondaryLanguage?: "en" | "hi" | "ur" | "mr" | "gu"
}

export const templates: Record<TemplateKey, TemplateConfig> = {
  royal: {
    key: "royal",
    name: "Classic Royal",
    theme: "gold",
    font: "cormorant",
    bride: "Sophia",
    groom: "Alexander",
    headline: "Together Forever",
    message: "Together with their families, they joyfully invite you to celebrate their sacred union in a day filled with love, laughter, and the eternal promise of forever.",
    familyNames: "The Anderson & Miller Families",
    venueName: "The Grand Ballroom",
    venueAddress: "123 Rose Garden Lane, New York, NY",
    dressCode: "Black Tie Formal",
    musicTitle: "A Thousand Years",
    musicArtist: "Christina Perri",
  },
  floral: {
    key: "floral",
    name: "Floral Romance",
    theme: "rose",
    font: "cormorant",
    bride: "Isabella",
    groom: "Lorenzo",
    headline: "A Garden Wedding",
    message: "Amid blossoms and birdsong, two hearts become one. Join us for an afternoon of beauty, romance, and celebration in our garden of love.",
    familyNames: "The Rossi & Bianchi Families",
    venueName: "Rosewood Gardens",
    venueAddress: "45 Petal Lane, Pasadena, CA",
    dressCode: "Garden Party Chic",
    musicTitle: "Can't Help Falling in Love",
    musicArtist: "Elvis Presley",
  },
  modern: {
    key: "modern",
    name: "Modern Minimal",
    theme: "ivory",
    font: "lato",
    bride: "Avery",
    groom: "Jordan",
    headline: "Simply, Forever",
    message: "No fuss, just love. We're keeping it simple and celebrating with the people who mean the world to us.",
    familyNames: "Hayes & Park Families",
    venueName: "The Loft at West Elm",
    venueAddress: "88 Industrial Blvd, Chicago, IL",
    dressCode: "Smart Casual",
    musicTitle: "Perfect",
    musicArtist: "Ed Sheeran",
  },
  mehndi: {
    key: "mehndi",
    name: "Mehndi Garden",
    theme: "rose",
    font: "cormorant",
    bride: "Aisha",
    groom: "Rehan",
    headline: "An Evening of Color & Celebration",
    message: "Join us for a joyous mehndi celebration filled with music, laughter, color, and blessings before our wedding day.",
    familyNames: "The Khan & Siddiqui Families",
    venueName: "Jasmine Courtyard",
    venueAddress: "Lotus Avenue, Mumbai",
    dressCode: "Festive Traditional",
    musicTitle: "Mehndi Hai Rachnewali",
    musicArtist: "Traditional",
    storyTitle: "From friendship to forever",
    storyText: "Our story has been shaped by faith, family, and joyful moments. We cannot wait to celebrate this next chapter with you.",
    mealOptions: "Vegetarian, Jain, Vegan",
    scheduleText: "5:00 PM | Welcome Drinks\n5:30 PM | Mehndi Ceremony\n7:00 PM | Music & Dance\n8:30 PM | Dinner",
    eventSeriesTitle: "Wedding Week Celebrations",
    eventSeriesText: "Mehndi | 12 Dec 2026 | 5:00 PM | Jasmine Courtyard\nSangeet | 13 Dec 2026 | 7:00 PM | Sapphire Hall\nWedding | 14 Dec 2026 | 11:00 AM | Noor Palace",
    primaryLanguage: "en",
    secondaryLanguage: "hi",
  },
  nikah: {
    key: "nikah",
    name: "Noor Nikah",
    theme: "emerald",
    font: "cinzel",
    bride: "Zara",
    groom: "Yusuf",
    headline: "With Duas and Gratitude",
    message: "By the grace of Allah, our families request the honour of your presence at our Nikah ceremony and reception.",
    familyNames: "The Ahmed & Rahman Families",
    venueName: "Noor Banquet",
    venueAddress: "Hyderabad, India",
    dressCode: "Elegant Traditional",
    musicTitle: "Instrumental Nasheed",
    musicArtist: "Traditional",
    storyTitle: "A story written with duas",
    storyText: "Every meeting, every prayer, and every blessing has brought us to this beautiful day of commitment and joy.",
    mealOptions: "Vegetarian, Non-Vegetarian",
    scheduleText: "11:00 AM | Guests Arrive\n11:30 AM | Nikah Ceremony\n1:00 PM | Lunch Reception",
    eventSeriesTitle: "Celebration Events",
    eventSeriesText: "Nikah | 20 Jan 2027 | 11:30 AM | Noor Banquet\nReception | 21 Jan 2027 | 7:00 PM | Pearl Pavilion",
    primaryLanguage: "en",
    secondaryLanguage: "ur",
  },
  heritage: {
    key: "heritage",
    name: "Heritage Royale",
    theme: "gold",
    font: "cinzel",
    bride: "Priya",
    groom: "Arjun",
    headline: "A Royal Celebration of Love",
    message: "With immense joy and blessings from our families, we invite you to be part of our wedding celebrations and sacred union.",
    familyNames: "The Sharma & Iyer Families",
    venueName: "Raj Mahal Palace",
    venueAddress: "Jaipur, Rajasthan",
    dressCode: "Royal Festive",
    musicTitle: "Raabta",
    musicArtist: "Instrumental Ensemble",
    storyTitle: "Two families, one celebration",
    storyText: "From cherished traditions to new dreams, our wedding brings together the love of our families and the joy of our closest friends.",
    mealOptions: "Vegetarian, Non-Vegetarian, Jain",
    scheduleText: "10:00 AM | Haldi\n5:00 PM | Baraat\n6:30 PM | Wedding Ceremony\n8:30 PM | Reception Dinner",
    eventSeriesTitle: "Our Wedding Journey",
    eventSeriesText: "Haldi | 02 Feb 2027 | 10:00 AM | Raj Courtyard\nSangeet | 03 Feb 2027 | 7:00 PM | Palace Terrace\nWedding | 04 Feb 2027 | 6:30 PM | Raj Mahal Palace",
    primaryLanguage: "en",
    secondaryLanguage: "hi",
  },
}
