export interface CoastalLocation {
  name: string;
  lat: number;
  lng: number;
  description: string;
  image?: string;
  imageAlt?: string;
}

export type AttractionCategory = 'island' | 'beach' | 'lake' | 'waterfall' | 'museum' | 'heritage' | 'nature';

export interface Attraction {
  name: string;
  nameMalay?: string;
  lat: number;
  lng: number;
  category: AttractionCategory;
  description: string;
}

export const ATTRACTIONS: Attraction[] = [
  // ── Islands ─────────────────────────────────────────────────────────────
  {
    name: "Perhentian Islands",
    nameMalay: "Pulau Perhentian",
    lat: 5.9058,
    lng: 102.7567,
    category: "island",
    description: "Twin islands famed for crystalline waters, coral reefs, and some of Southeast Asia's finest snorkelling."
  },
  {
    name: "Redang Island",
    nameMalay: "Pulau Redang",
    lat: 5.7767,
    lng: 103.0022,
    category: "island",
    description: "A marine sanctuary of turquoise lagoons and vibrant coral gardens, one of Malaysia's most beloved dive destinations."
  },
  {
    name: "Kapas Island",
    nameMalay: "Pulau Kapas",
    lat: 5.2150,
    lng: 103.2580,
    category: "island",
    description: "Cotton Island — a secluded gem of white sand beaches and calm, clear waters, an easy escape from Marang."
  },
  {
    name: "Tenggol Island",
    nameMalay: "Pulau Tenggol",
    lat: 4.8000,
    lng: 103.6700,
    category: "island",
    description: "An isolated paradise known as Terengganu's most pristine island, rich in whale shark and manta ray sightings."
  },
  // ── Beaches ─────────────────────────────────────────────────────────────
  {
    name: "Pantai Cahaya Bulan",
    nameMalay: "Pantai Cahaya Bulan",
    lat: 6.0600,
    lng: 102.2900,
    category: "beach",
    description: "Moonlight Beach — a long arc of golden sand hugging the northern Kelantan coast, beloved by locals at dusk."
  },
  {
    name: "Batu Buruk Beach",
    nameMalay: "Pantai Batu Buruk",
    lat: 5.3200,
    lng: 103.1580,
    category: "beach",
    description: "The urban seafront of Kuala Terengganu, a lively gathering ground for traditional kite-flying and evening food stalls."
  },
  {
    name: "Cherating Beach",
    nameMalay: "Pantai Cherating",
    lat: 4.0667,
    lng: 103.3833,
    category: "beach",
    description: "A relaxed surf village with leatherback turtle nesting grounds and a bohemian backpacker heritage."
  },
  // ── Lakes ────────────────────────────────────────────────────────────────
  {
    name: "Kenyir Lake",
    nameMalay: "Tasik Kenyir",
    lat: 5.0500,
    lng: 102.7000,
    category: "lake",
    description: "One of the largest man-made lakes in Southeast Asia, studded with 340 islands and surrounded by ancient rainforest."
  },
  // ── Waterfalls ───────────────────────────────────────────────────────────
  {
    name: "Sekayu Waterfalls",
    nameMalay: "Air Terjun Sekayu",
    lat: 5.2200,
    lng: 102.8400,
    category: "waterfall",
    description: "A series of seven cascading falls deep within the Terengganu jungle, a treasured natural retreat."
  },
  {
    name: "Lasir Waterfall",
    nameMalay: "Air Terjun Lasir",
    lat: 5.0800,
    lng: 102.7600,
    category: "waterfall",
    description: "A dramatic waterfall accessible by boat from Kenyir Lake, plunging into clear jungle pools."
  },
  // ── Museums & Heritage ───────────────────────────────────────────────────
  {
    name: "Terengganu State Museum",
    nameMalay: "Muzium Negeri Terengganu",
    lat: 5.3350,
    lng: 103.1370,
    category: "museum",
    description: "The largest museum in Malaysia, housing the 14th-century Terengganu Inscription Stone and vast maritime collections."
  },
  {
    name: "Kelantan State Museum",
    nameMalay: "Muzium Negeri Kelantan",
    lat: 6.1234,
    lng: 102.2396,
    category: "museum",
    description: "Housed in a colonial-era building in Kota Bharu, preserving royal regalia, wayang kulit puppets and ancient crafts."
  },
  {
    name: "Crystal Mosque",
    nameMalay: "Masjid Kristal",
    lat: 5.3288,
    lng: 103.1478,
    category: "heritage",
    description: "A luminous icon of modern Islamic architecture on Wan Man Island, built from steel, glass and crystal."
  },
  {
    name: "Kota Bharu Old Town",
    nameMalay: "Bandar Kota Bharu",
    lat: 6.1178,
    lng: 102.2383,
    category: "heritage",
    description: "The cultural heartland of Kelantan — famous for its vibrant markets, Malay arts, traditional crafts and royal heritage."
  },
  {
    name: "Istana Maziah",
    nameMalay: "Istana Maziah",
    lat: 5.3338,
    lng: 103.1355,
    category: "heritage",
    description: "A stately yellow palace on the waterfront of Kuala Terengganu, a symbol of the Terengganu royal household."
  },
  // ── Nature ───────────────────────────────────────────────────────────────
  {
    name: "Taman Negara",
    nameMalay: "Taman Negara",
    lat: 4.1000,
    lng: 102.4500,
    category: "nature",
    description: "One of the world's oldest rainforests at 130 million years, home to tigers, tapirs, and the world's longest canopy walkway."
  },
];

export const COASTAL_LOCATIONS: CoastalLocation[] = [
  {
    "name": "Coastal Archive Point 01",
    "lat": 6.08,
    "lng": 102.28,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/78E961C5-31C7-418E-9811-635ADA3EBAB9.JPG",
    "imageAlt": "Coastal photography 78E961C5-31C7-418E-9811-635ADA3EBAB9.JPG"
  },
  {
    "name": "Coastal Archive Point 02",
    "lat": 6.063,
    "lng": 102.3155,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00032.jpg",
    "imageAlt": "Coastal photography DSC00032.jpg"
  },
  {
    "name": "Coastal Archive Point 03",
    "lat": 5.9746,
    "lng": 102.2975,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00052.jpg",
    "imageAlt": "Coastal photography DSC00052.jpg"
  },
  {
    "name": "Coastal Archive Point 04",
    "lat": 5.9408,
    "lng": 102.3754,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00068.jpg",
    "imageAlt": "Coastal photography DSC00068.jpg"
  },
  {
    "name": "Coastal Archive Point 05",
    "lat": 5.8796,
    "lng": 102.3613,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00234.jpg",
    "imageAlt": "Coastal photography DSC00234.jpg"
  },
  {
    "name": "Coastal Archive Point 06",
    "lat": 5.8289,
    "lng": 102.4233,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00465.JPG",
    "imageAlt": "Coastal photography DSC00465.JPG"
  },
  {
    "name": "Coastal Archive Point 07",
    "lat": 5.782,
    "lng": 102.4482,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00516.JPG",
    "imageAlt": "Coastal photography DSC00516.JPG"
  },
  {
    "name": "Coastal Archive Point 08",
    "lat": 5.7097,
    "lng": 102.4823,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00552.JPG",
    "imageAlt": "Coastal photography DSC00552.JPG"
  },
  {
    "name": "Coastal Archive Point 09",
    "lat": 5.6224,
    "lng": 102.479,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00587.JPG",
    "imageAlt": "Coastal photography DSC00587.JPG"
  },
  {
    "name": "Coastal Archive Point 10",
    "lat": 5.577,
    "lng": 102.5706,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00590.JPG",
    "imageAlt": "Coastal photography DSC00590.JPG"
  },
  {
    "name": "Coastal Archive Point 11",
    "lat": 5.5404,
    "lng": 102.5512,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00608.JPG",
    "imageAlt": "Coastal photography DSC00608.JPG"
  },
  {
    "name": "Coastal Archive Point 12",
    "lat": 5.4805,
    "lng": 102.5815,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00631.JPG",
    "imageAlt": "Coastal photography DSC00631.JPG"
  },
  {
    "name": "Coastal Archive Point 13",
    "lat": 5.401,
    "lng": 102.6376,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00638.JPG",
    "imageAlt": "Coastal photography DSC00638.JPG"
  },
  {
    "name": "Coastal Archive Point 14",
    "lat": 5.3798,
    "lng": 102.6178,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00645.JPG",
    "imageAlt": "Coastal photography DSC00645.JPG"
  },
  {
    "name": "Coastal Archive Point 15",
    "lat": 5.3188,
    "lng": 102.6948,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00649.JPG",
    "imageAlt": "Coastal photography DSC00649.JPG"
  },
  {
    "name": "Coastal Archive Point 16",
    "lat": 5.29,
    "lng": 102.6878,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00679.JPG",
    "imageAlt": "Coastal photography DSC00679.JPG"
  },
  {
    "name": "Coastal Archive Point 17",
    "lat": 5.2555,
    "lng": 102.7704,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00710.JPG",
    "imageAlt": "Coastal photography DSC00710.JPG"
  },
  {
    "name": "Coastal Archive Point 18",
    "lat": 5.182,
    "lng": 102.747,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00743.JPG",
    "imageAlt": "Coastal photography DSC00743.JPG"
  },
  {
    "name": "Coastal Archive Point 19",
    "lat": 5.1365,
    "lng": 102.8187,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00756_2.JPG",
    "imageAlt": "Coastal photography DSC00756_2.JPG"
  },
  {
    "name": "Coastal Archive Point 20",
    "lat": 5.0698,
    "lng": 102.8108,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00788.JPG",
    "imageAlt": "Coastal photography DSC00788.JPG"
  },
  {
    "name": "Coastal Archive Point 21",
    "lat": 5.0335,
    "lng": 102.8537,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00799.JPG",
    "imageAlt": "Coastal photography DSC00799.JPG"
  },
  {
    "name": "Coastal Archive Point 22",
    "lat": 4.9715,
    "lng": 102.9008,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00809.JPG",
    "imageAlt": "Coastal photography DSC00809.JPG"
  },
  {
    "name": "Coastal Archive Point 23",
    "lat": 4.9218,
    "lng": 102.8729,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00845.JPG",
    "imageAlt": "Coastal photography DSC00845.JPG"
  },
  {
    "name": "Coastal Archive Point 24",
    "lat": 4.8183,
    "lng": 102.9473,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00854.JPG",
    "imageAlt": "Coastal photography DSC00854.JPG"
  },
  {
    "name": "Coastal Archive Point 25",
    "lat": 4.7531,
    "lng": 102.9338,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC00932.JPG",
    "imageAlt": "Coastal photography DSC00932.JPG"
  },
  {
    "name": "Coastal Archive Point 26",
    "lat": 4.7071,
    "lng": 102.9972,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC07654.jpg",
    "imageAlt": "Coastal photography DSC07654.jpg"
  },
  {
    "name": "Coastal Archive Point 27",
    "lat": 4.6598,
    "lng": 102.9876,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC07665_1.jpg",
    "imageAlt": "Coastal photography DSC07665_1.jpg"
  },
  {
    "name": "Coastal Archive Point 28",
    "lat": 4.5862,
    "lng": 103.0788,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC07670_1.jpg",
    "imageAlt": "Coastal photography DSC07670_1.jpg"
  },
  {
    "name": "Coastal Archive Point 29",
    "lat": 4.5388,
    "lng": 103.0565,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC07671.jpg",
    "imageAlt": "Coastal photography DSC07671.jpg"
  },
  {
    "name": "Coastal Archive Point 30",
    "lat": 4.4953,
    "lng": 103.137,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC07705.jpg",
    "imageAlt": "Coastal photography DSC07705.jpg"
  },
  {
    "name": "Coastal Archive Point 31",
    "lat": 4.504,
    "lng": 103.0982,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC07763_1.jpg",
    "imageAlt": "Coastal photography DSC07763_1.jpg"
  },
  {
    "name": "Coastal Archive Point 32",
    "lat": 4.4397,
    "lng": 103.1287,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC07799_1.jpg",
    "imageAlt": "Coastal photography DSC07799_1.jpg"
  },
  {
    "name": "Coastal Archive Point 33",
    "lat": 4.3684,
    "lng": 103.2136,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC07802.jpg",
    "imageAlt": "Coastal photography DSC07802.jpg"
  },
  {
    "name": "Coastal Archive Point 34",
    "lat": 4.3198,
    "lng": 103.1938,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC07995.jpg",
    "imageAlt": "Coastal photography DSC07995.jpg"
  },
  {
    "name": "Coastal Archive Point 35",
    "lat": 4.2573,
    "lng": 103.2637,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC08003_1.jpg",
    "imageAlt": "Coastal photography DSC08003_1.jpg"
  },
  {
    "name": "Coastal Archive Point 36",
    "lat": 4.2184,
    "lng": 103.2531,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC08014.jpg",
    "imageAlt": "Coastal photography DSC08014.jpg"
  },
  {
    "name": "Coastal Archive Point 37",
    "lat": 4.1808,
    "lng": 103.306,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC08133_1.jpg",
    "imageAlt": "Coastal photography DSC08133_1.jpg"
  },
  {
    "name": "Coastal Archive Point 38",
    "lat": 4.1245,
    "lng": 103.3158,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC08162.jpg",
    "imageAlt": "Coastal photography DSC08162.jpg"
  },
  {
    "name": "Coastal Archive Point 39",
    "lat": 4.0127,
    "lng": 103.3612,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC08235.jpg",
    "imageAlt": "Coastal photography DSC08235.jpg"
  },
  {
    "name": "Coastal Archive Point 40",
    "lat": 3.9707,
    "lng": 103.3723,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "/images/pantai-timor/DSC09897.jpg",
    "imageAlt": "Coastal photography DSC09897.jpg"
  }
];
