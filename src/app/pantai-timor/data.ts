export interface CoastalLocation {
  name: string;
  lat: number;
  lng: number;
  description: string;
  image?: string;
  imageAlt?: string;
  featured?: boolean;
}

export const getThumbnailUrl = (url: string) => {
  if (!url || !url.includes('pantai-timor/')) return url;
  if (url.includes('/thumb/')) return url;
  const lastSlash = url.lastIndexOf('/');
  if (lastSlash === -1) return url;
  return url.substring(0, lastSlash) + '/thumb' + url.substring(lastSlash);
};

export type AttractionCategory = 'island' | 'beach' | 'lake' | 'waterfall' | 'museum' | 'heritage' | 'nature' | 'city';

export interface Attraction {
  name: string;
  nameMalay?: string;
  lat: number;
  lng: number;
  category: AttractionCategory;
  description: string;
  minZoom?: number;
  priority?: number;
}

export const ATTRACTIONS: Attraction[] = [
  // ── Cities ──────────────────────────────────────────────────────────────
  {
    name: "KUALA TERENGGANU",
    lat: 5.3308,
    lng: 103.1408,
    category: "city",
    description: "The royal capital of Terengganu, a coastal city of maritime heritage and modern Islamic architecture.",
    minZoom: 0,
    priority: 0
  },
  {
    name: "KOTA BHARU",
    lat: 6.1254,
    lng: 102.2386,
    category: "city",
    description: "The cultural heart of Kelantan, famed for its vibrant markets and traditional Malay arts.",
    minZoom: 0,
    priority: 0
  },
  {
    name: "KUANTAN",
    lat: 3.8077,
    lng: 103.3260,
    category: "city",
    description: "The largest city on the East Coast, a hub for commerce and beautiful urban beaches.",
    minZoom: 0,
    priority: 0
  },
  {
    name: "DUNGUN",
    lat: 4.7500,
    lng: 103.4167,
    category: "city",
    description: "A historic mining town turned peaceful coastal enclave, gateway to the pristine Tenggol Island.",
    minZoom: 0,
    priority: 1
  },
  {
    name: "KEMAMAN",
    lat: 4.2333,
    lng: 103.4167,
    category: "city",
    description: "The southern gateway of Terengganu, known for its seafood, surfing and industrial landmarks.",
    minZoom: 0,
    priority: 1
  },
  {
    name: "BESUT",
    lat: 5.8333,
    lng: 102.5500,
    category: "city",
    description: "The northernmost district of Terengganu, famous for its fishing villages and as the transit point to Perhentian.",
    minZoom: 0,
    priority: 1
  },
  // ── Islands ─────────────────────────────────────────────────────────────
  {
    name: "Perhentian Islands",
    nameMalay: "Pulau Perhentian",
    lat: 5.9058,
    lng: 102.7567,
    category: "island",
    description: "Twin islands famed for crystalline waters, coral reefs, and some of Southeast Asia's finest snorkelling.",
    minZoom: 0,
    priority: 1
  },
  {
    name: "Redang Island",
    nameMalay: "Pulau Redang",
    lat: 5.7767,
    lng: 103.0022,
    category: "island",
    description: "A marine sanctuary of turquoise lagoons and vibrant coral gardens, one of Malaysia's most beloved dive destinations.",
    minZoom: 0,
    priority: 1
  },
  {
    name: "Lang Tengah Island",
    nameMalay: "Pulau Lang Tengah",
    lat: 5.783,
    lng: 102.883,
    category: "island",
    description: "An eagle's shaped island known for its turquoise waters and untouched coral reefs, a quiet alternative to Redang.",
    minZoom: 8.2,
    priority: 3
  },
  {
    name: "Kapas Island",
    nameMalay: "Pulau Kapas",
    lat: 5.2150,
    lng: 103.2580,
    category: "island",
    description: "Cotton Island — a secluded gem of white sand beaches and calm, clear waters, an easy escape from Marang.",
    minZoom: 9.0,
    priority: 4
  },
  {
    name: "Tenggol Island",
    nameMalay: "Pulau Tenggol",
    lat: 4.8000,
    lng: 103.6700,
    category: "island",
    description: "An isolated paradise known as Terengganu's most pristine island, rich in whale shark and manta ray sightings.",
    minZoom: 8.0,
    priority: 2
  },
  // ── Beaches ─────────────────────────────────────────────────────────────
  {
    name: "Pantai Cahaya Bulan",
    nameMalay: "Pantai Cahaya Bulan",
    lat: 6.0600,
    lng: 102.2900,
    category: "beach",
    description: "Moonlight Beach — a long arc of golden sand hugging the northern Kelantan coast, beloved by locals at dusk.",
    minZoom: 9.2,
    priority: 3
  },
  {
    name: "Batu Buruk Beach",
    nameMalay: "Pantai Batu Buruk",
    lat: 5.3200,
    lng: 103.1580,
    category: "beach",
    description: "The urban seafront of Kuala Terengganu, a lively gathering ground for traditional kite-flying and evening food stalls.",
    minZoom: 9.2,
    priority: 3
  },
  {
    name: "Cherating Beach",
    nameMalay: "Pantai Cherating",
    lat: 4.0667,
    lng: 103.3833,
    category: "beach",
    description: "A relaxed surf village with leatherback turtle nesting grounds and a bohemian backpacker heritage.",
    minZoom: 8.0,
    priority: 2
  },
  {
    name: "Rantau Abang",
    nameMalay: "Rantau Abang",
    lat: 4.871,
    lng: 103.389,
    category: "beach",
    description: "Once a world-famous nesting ground for giant leatherback turtles, now a serene stretch of golden sand and heritage.",
    minZoom: 8.5,
    priority: 2
  },
  {
    name: "Penarik",
    nameMalay: "Pantai Penarik",
    lat: 5.605,
    lng: 102.816,
    category: "beach",
    description: "A picturesque coastal village where traditional Malay houses meet coconut groves and a pristine river estuary.",
    minZoom: 9.0,
    priority: 3
  },
  {
    name: "Pantai Batu Pelanduk",
    nameMalay: "Pantai Batu Pelanduk",
    lat: 4.912,
    lng: 103.364,
    category: "beach",
    description: "A unique rocky beach known for its mouse-deer shaped stone formations and dramatic coastal landscape.",
    minZoom: 9.5,
    priority: 4
  },
  {
    name: "Kemasik Beach",
    nameMalay: "Pantai Kemasik",
    lat: 4.416,
    lng: 103.457,
    category: "beach",
    description: "A distinctive beach featuring a dramatic lagoon and twin rock formations, widely considered one of the state's most beautiful.",
    minZoom: 9.5,
    priority: 3
  },
  // ── Lakes ────────────────────────────────────────────────────────────────
  {
    name: "Kenyir Lake",
    nameMalay: "Tasik Kenyir",
    lat: 5.0500,
    lng: 102.7000,
    category: "lake",
    description: "One of the largest man-made lakes in Southeast Asia, studded with 340 islands and surrounded by ancient rainforest.",
    minZoom: 0,
    priority: 1
  },
  // ── Waterfalls ───────────────────────────────────────────────────────────
  {
    name: "Sekayu Waterfalls",
    nameMalay: "Air Terjun Sekayu",
    lat: 5.2200,
    lng: 102.8400,
    category: "waterfall",
    description: "A series of seven cascading falls deep within the Terengganu jungle, a treasured natural retreat.",
    minZoom: 9.5,
    priority: 3
  },
  {
    name: "Lasir Waterfall",
    nameMalay: "Air Terjun Lasir",
    lat: 5.0800,
    lng: 102.7600,
    category: "waterfall",
    description: "A dramatic waterfall accessible by boat from Kenyir Lake, plunging into clear jungle pools.",
    minZoom: 9.8,
    priority: 4
  },
  // ── Museums & Heritage ───────────────────────────────────────────────────
  {
    name: "Terengganu State Museum",
    nameMalay: "Muzium Negeri Terengganu",
    lat: 5.3350,
    lng: 103.1370,
    category: "museum",
    description: "The largest museum in Malaysia, housing the 14th-century Terengganu Inscription Stone and vast maritime collections.",
    minZoom: 8.8,
    priority: 2
  },
  {
    name: "Kelantan State Museum",
    nameMalay: "Muzium Negeri Kelantan",
    lat: 6.1234,
    lng: 102.2396,
    category: "museum",
    description: "Housed in a colonial-era building in Kota Bharu, preserving royal regalia, wayang kulit puppets and ancient crafts.",
    minZoom: 8.8,
    priority: 2
  },
  {
    name: "Crystal Mosque",
    nameMalay: "Masjid Kristal",
    lat: 5.3288,
    lng: 103.1478,
    category: "heritage",
    description: "A luminous icon of modern Islamic architecture on Wan Man Island, built from steel, glass and crystal.",
    minZoom: 0,
    priority: 1
  },
  {
    name: "Istana Maziah",
    nameMalay: "Istana Maziah",
    lat: 5.3338,
    lng: 103.1355,
    category: "heritage",
    description: "A stately yellow palace on the waterfront of Kuala Terengganu, a symbol of the Terengganu royal household.",
    minZoom: 9.0,
    priority: 2
  },
  {
    name: "Kerteh Refinery",
    nameMalay: "Penapisan Kerteh",
    lat: 4.567,
    lng: 103.454,
    category: "heritage",
    description: "The 'City of Lights' — an industrial landmark that transforms into a glowing futuristic landscape at night.",
    minZoom: 9.0,
    priority: 3
  },
  // ── Nature ───────────────────────────────────────────────────────────────
  {
    name: "Taman Negara",
    nameMalay: "Taman Negara",
    lat: 4.1000,
    lng: 102.4500,
    category: "nature",
    description: "One of the world's oldest rainforests at 130 million years, home to tigers, tapirs, and the world's longest canopy walkway.",
    minZoom: 0,
    priority: 1
  },
  {
    name: "Bukit Keluang",
    nameMalay: "Bukit Keluang",
    lat: 5.802,
    lng: 102.605,
    category: "nature",
    description: "A scenic hill offering panoramic views of the South China Sea and secret sea caves accessible via wooden walkways.",
    minZoom: 8.5,
    priority: 2
  },
];

export const COASTAL_LOCATIONS: CoastalLocation[] = [
  {
    "name": "Coastal Archive Point 01",
    
    "lat": 5.973952,
    "lng": 102.440377,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/78E961C5-31C7-418E-9811-635ADA3EBAB9.JPG",
    "imageAlt": "Coastal photography 78E961C5-31C7-418E-9811-635ADA3EBAB9.JPG",
  },
  {
    "name": "Coastal Archive Point 02",
    "lat": 5.829322,
    "lng": 102.558491,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00032.jpg",
    "imageAlt": "Coastal photography DSC00032.jpg",
    featured:true,
  },
  {
    "name": "Coastal Archive Point 03",
    "lat": 5.430578,
    "lng": 103.068323,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00052.jpg",
    "imageAlt": "Coastal photography DSC00052.jpg",
    featured:true,
  },
  {
    "name": "Coastal Archive Point 04",
    "lat": 5.620211,
    "lng": 102.802515,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00068.jpg",
    "imageAlt": "Coastal photography DSC00068.jpg"
  },
  {
    "name": "Coastal Archive Point 05",
    "lat": 5.732381,
    "lng": 102.665718,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00234.jpg",
    "imageAlt": "Coastal photography DSC00234.jpg"
  },
  {
    "name": "Coastal Archive Point 06",
    "lat": 6.023100,
    "lng": 102.418742,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00465.JPG",
    "imageAlt": "Coastal photography DSC00465.JPG"
  },
  {
    "name": "Coastal Archive Point 07",
    "lat":6.023368,
    "lng": 102.416231,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00516.JPG",
    "imageAlt": "Coastal photography DSC00516.JPG"
  },
  {
    "name": "Coastal Archive Point 08",
    "lat": 6.028801,
    "lng": 102.416447,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00552.JPG",
    "imageAlt": "Coastal photography DSC00552.JPG",
  },
  {
    "name": "Coastal Archive Point 09",
   "lat": 6.028801,
    "lng": 102.416447,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00587.JPG",
    "imageAlt": "Coastal photography DSC00587.JPG"
  },
  {
    "name": "Coastal Archive Point 10",
    "lat": 6.028801,
    "lng": 102.416447,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00590.JPG",
    "imageAlt": "Coastal photography DSC00590.JPG",
    "featured": true,
  },
  {
    "name": "Coastal Archive Point 11",
     "lat": 6.028801,
    "lng": 102.416447,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00608.JPG",
    "imageAlt": "Coastal photography DSC00608.JPG"
  },
  {
    "name": "Coastal Archive Point 12",
    "lat": 6.031716,
    "lng": 102.414712,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00631.JPG",
    "imageAlt": "Coastal photography DSC00631.JPG"
  },
  {
    "name": "Coastal Archive Point 13",
    "lat": 6.031716,
    "lng": 102.414712,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00638.JPG",
    "imageAlt": "Coastal photography DSC00638.JPG"
  },
  {
    "name": "Coastal Archive Point 14",
    "lat": 6.030274,
    "lng": 102.415008,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00645.JPG",
    "imageAlt": "Coastal photography DSC00645.JPG"
  },
  {
    "name": "Coastal Archive Point 15",
    "lat": 5.983638,
    "lng": 102.434814,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00649.JPG",
    "imageAlt": "Coastal photography DSC00649.JPG",
    featured:true,
  },
  {
    "name": "Coastal Archive Point 16",
    "lat": 5.974645,
    "lng": 102.440973,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00679.JPG",
    "imageAlt": "Coastal photography DSC00679.JPG",
    featured:true,
  },
  {
    "name": "Coastal Archive Point 17",
    "lat": 5.974645,
    "lng": 102.440973,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00710.JPG",
    "imageAlt": "Coastal photography DSC00710.JPG",
    featured:true,
  },
  {
    "name": "Coastal Archive Point 18",
    "lat": 5.996194,
    "lng": 102.430233,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00743.JPG",
    "imageAlt": "Coastal photography DSC00743.JPG"
  },
  {
    "name": "Coastal Archive Point 19",
    "lat": 6.027410,
    "lng": 102.416115,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00756_2.JPG",
    "imageAlt": "Coastal photography DSC00756_2.JPG",
    "featured": true,
  },
  {
    "name": "Coastal Archive Point 20",
    "lat": 6.027410,
    "lng": 102.416115,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00788.JPG",
    "imageAlt": "Coastal photography DSC00788.JPG"
  },
  {
    "name": "Coastal Archive Point 21",
    "lat": 6.028945,
    "lng": 102.416101,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00799.JPG",
    "imageAlt": "Coastal photography DSC00799.JPG"
  },
  {
    "name": "Coastal Archive Point 22",
    "lat": 6.030996,
    "lng": 102.414735,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00809.JPG",
    "imageAlt": "Coastal photography DSC00809.JPG"
  },
  {
    "name": "Coastal Archive Point 23",
    "lat": 6.024857,
    "lng": 102.417335,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00845.JPG",
    "imageAlt": "Coastal photography DSC00845.JPG"
  },
  {
    "name": "Coastal Archive Point 24",
    "lat": 6.024857,
    "lng": 102.417335,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00854.JPG",
    "imageAlt": "Coastal photography DSC00854.JPG",
    "featured": true,
  },
  {
    "name": "Coastal Archive Point 25",
    "lat": 6.000308,
    "lng": 102.428760,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00932.JPG",
    "imageAlt": "Coastal photography DSC00932.JPG"
  },
  {
    "name": "Coastal Archive Point 26",
    "lat": 4.827953,
    "lng": 103.416472,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07654.jpg",
    "imageAlt": "Coastal photography DSC07654.jpg"
  },
  {
    "name": "Coastal Archive Point 27",
    "lat": 4.827565,
    "lng": 103.416930,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07665_1.jpg",
    "imageAlt": "Coastal photography DSC07665_1.jpg",
    "featured": true,
  },
  {
    "name": "Coastal Archive Point 28",
    "lat": 4.937331,
    "lng": 103.352965,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07670_1.jpg",
    "imageAlt": "Coastal photography DSC07670_1.jpg",
    featured:true,
  },
  {
    "name": "Coastal Archive Point 30",
    "lat": 5.240394,
    "lng": 103.189754,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07705.jpg",
    "imageAlt": "Coastal photography DSC07705.jpg"
  },
  {
    "name": "Coastal Archive Point 31",
    "lat": 4.944580,
    "lng": 103.348057,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07763_1.jpg",
    "imageAlt": "Coastal photography DSC07763_1.jpg"
  },
  {
    "name": "Coastal Archive Point 32",
    "lat": 4.937331,
    "lng": 103.352965,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07799_1.jpg",
    "imageAlt": "Coastal photography DSC07799_1.jpg"
  },
  {
    "name": "Coastal Archive Point 33",
    "lat": 4.937331,
    "lng": 103.352965,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07802.jpg",
    "imageAlt": "Coastal photography DSC07802.jpg"
  },
  {
    "name": "Coastal Archive Point 34",
    "lat": 5.731662,
    "lng": 102.664681,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07995.jpg",
    "imageAlt": "Coastal photography DSC07995.jpg"
  },
  {
    "name": "Coastal Archive Point 35",
    "lat": 5.629070,
    "lng": 102.790681,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC01024.jpg",
    "imageAlt": "Coastal photography DSC01024.jpg"
  },
  {
    "name": "Coastal Archive Point 36",
    "lat": 5.625414,
    "lng": 102.791894,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC08014.jpg",
    "imageAlt": "Coastal photography DSC08014.jpg",
    "featured": true,
  },
  {
    "name": "Coastal Archive Point 37",
    "lat": 5.210408,
    "lng": 103.214161,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC08133_1.jpg",
    "imageAlt": "Coastal photography DSC08133_1.jpg",
    "featured": true,
  },
  {
    "name": "Coastal Archive Point 38",
    "lat": 5.210408,
    "lng": 103.214161,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC08162.jpg",
    "imageAlt": "Coastal photography DSC08162.jpg"
  },
  {
    "name": "Coastal Archive Point 39",
    "lat": 4.937077,
    "lng": 103.353147,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC08235.jpg",
    "imageAlt": "Coastal photography DSC08235.jpg"
  },
  {
    "name": "Coastal Archive Point 41",
    "lat": 5.625859,
    "lng": 102.794364,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC01061.jpg",
    "imageAlt": "Coastal photography DSC01061.jpg"
  },
  {
    "name": "Coastal Archive Point 42",
    "lat": 5.447360,
    "lng": 103.051640,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC01096.jpg",
    "imageAlt": "Coastal photography DSC01096.jpg"
  },
  {
    "name": "Coastal Archive Point 43",
    "lat": 5.430578,
    "lng": 103.068323,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC01109.jpg",
    "imageAlt": "Coastal photography DSC01109.jpg",
    "featured": true,
  },
  {
    "name": "Coastal Archive Point 44",
    "lat": 5.285161,
    "lng": 103.171736,
    "description": "A scene from the eastern coast archive. Documenting the intersection of land and sea.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC01218.jpg",
    "imageAlt": "Coastal photography DSC01218.jpg"
  }
];

export const CAROUSEL_IMAGES = [
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/78E961C5-31C7-418E-9811-635ADA3EBAB9.JPG",
    "alt": "Coastal photography 78E961C5-31C7-418E-9811-635ADA3EBAB9.JPG",
    "isPortrait": true
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00032.jpg",
    "alt": "Coastal photography DSC00032.jpg"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00052.jpg",
    "alt": "Coastal photography DSC00052.jpg"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00068.jpg",
    "alt": "Coastal photography DSC00068.jpg",
    "isPortrait": true
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00234.jpg",
    "alt": "Coastal photography DSC00234.jpg",
    "isPortrait": true
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00465.JPG",
    "alt": "Coastal photography DSC00465.JPG"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00516.JPG",
    "alt": "Coastal photography DSC00516.JPG"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00552.JPG",
    "alt": "Coastal photography DSC00552.JPG"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00587.JPG",
    "alt": "Coastal photography DSC00587.JPG"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00590.JPG",
    "alt": "Coastal photography DSC00590.JPG"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00608.JPG",
    "alt": "Coastal photography DSC00608.JPG"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00631.JPG",
    "alt": "Coastal photography DSC00631.JPG"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00638.JPG",
    "alt": "Coastal photography DSC00638.JPG"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00645.JPG",
    "alt": "Coastal photography DSC00645.JPG"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00649.JPG",
    "alt": "Coastal photography DSC00649.JPG"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00679.JPG",
    "alt": "Coastal photography DSC00679.JPG"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00710.JPG",
    "alt": "Coastal photography DSC00710.JPG"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00743.JPG",
    "alt": "Coastal photography DSC00743.JPG"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00756_2.JPG",
    "alt": "Coastal photography DSC00756_2.JPG"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00788.JPG",
    "alt": "Coastal photography DSC00788.JPG"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00799.JPG",
    "alt": "Coastal photography DSC00799.JPG"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00809.JPG",
    "alt": "Coastal photography DSC00809.JPG"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00845.JPG",
    "alt": "Coastal photography DSC00845.JPG",
    "isPortrait": true
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00854.JPG",
    "alt": "Coastal photography DSC00854.JPG"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00932.JPG",
    "alt": "Coastal photography DSC00932.JPG"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07654.jpg",
    "alt": "Coastal photography DSC07654.jpg",
    "isPortrait": true
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07665_1.jpg",
    "alt": "Coastal photography DSC07665_1.jpg"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07670_1.jpg",
    "alt": "Coastal photography DSC07670_1.jpg"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07705.jpg",
    "alt": "Coastal photography DSC07705.jpg"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07763_1.jpg",
    "alt": "Coastal photography DSC07763_1.jpg"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07799_1.jpg",
    "alt": "Coastal photography DSC07799_1.jpg"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07802.jpg",
    "alt": "Coastal photography DSC07802.jpg",
    "isPortrait": true
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07995.jpg",
    "alt": "Coastal photography DSC07995.jpg",
    "isPortrait": true
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC01024.jpg",
    "alt": "Coastal photography DSC01024.jpg"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC08014.jpg",
    "alt": "Coastal photography DSC08014.jpg",
    "isPortrait": true
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC08133_1.jpg",
    "alt": "Coastal photography DSC08133_1.jpg"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC08162.jpg",
    "alt": "Coastal photography DSC08162.jpg",
    "isPortrait": true
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC08235.jpg",
    "alt": "Coastal photography DSC08235.jpg"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC01061.jpg",
    "alt": "Coastal photography DSC01061.jpg"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC01096.jpg",
    "alt": "Coastal photography DSC01096.jpg"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC01109.jpg",
    "alt": "Coastal photography DSC01109.jpg"
  },
  {
    "src": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC01218.jpg",
    "alt": "Coastal photography DSC01218.jpg"
  }
];
