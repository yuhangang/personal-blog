export interface CoastalLocation {
  name: string;
  lat: number;
  lng: number;
  description: string;
  image?: string;
  imageAlt?: string;
  featured?: boolean;
}

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

export const getThumbnailUrl = (url: string) => {
  if (!url || !url.includes('pantai-timor/')) return url;
  if (url.includes('/thumb/')) return url;
  const lastSlash = url.lastIndexOf('/');
  if (lastSlash === -1) return url;
  return url.substring(0, lastSlash) + '/thumb' + url.substring(lastSlash);
};

export const PANTAI_TIMOR_COPY = {
  hero: {
    title: "PANTAI TIMOR",
    scroll: "SCROLL"
  },
  animatedTitle: {
    title: "PANTAI TIMOR",
    chinese: "東海岸",
    jawi: "ڤنتاي تيمور",
    subtitle: "A PHOTOGRAPHIC JOURNEY TO THE EASTERN ENCLAVE"
  },
  historyCulture: {
    label: "Echoes of the Monsoon",
    title: "A Tapestry Woven by Wind and Tide",
    sections: [
      {
        title: "The Siamese Imprint",
        content: "For centuries, the powerful kingdoms of Ayutthaya and Sukhothai to the north cast their long, protective shadows over these shores. This historical proximity didn't just alter borders; it seeped into the soil. It wove Siamese grace into the intricate architecture, spiced the local dialects with foreign syllables, and shaped the daily customs of Kelantan and Terengganu, birthing a mesmerizing Malay-Siamese cultural synthesis that still breathes in the streets today."
      },
      {
        title: "The Islamic Dawn",
        content: "Carried on the relentless northeast monsoon winds by weary yet hopeful merchants, Islam did not arrive by the sword, but through whispered prayers and the bustling exchange of the marketplace. It gently embedded itself into the region's soul. The famed Terengganu Inscription Stone, pulled from the muddy banks of a local river, stands as silent witness—the earliest known testament to the Quranic-based Jawi script in the Malay world, marking a profound awakening of faith and law."
      },
      {
        title: "The Maritime Crossroads",
        content: "Long before modern ports arose, this eastern shoreline was a pulsating artery in a vast, ancient global network. It was the crucial bridge between the silk markets of China, the spice routes of India, and the faraway ports of the Middle East. These coastal villages were not sleepy hamlets, but dynamic, polyglot hubs where empires traded, ideas clashed, and a remarkable seafaring resilience was forged against the crashing waves of the South China Sea."
      }
    ]
  },
  villageRhythms: {
    label: "VILLAGE RHYTHMS",
    title: "Portraits Carved by the Tide",
    content: "To truly understand the coast, you must listen to its heartbeat—the people who wake before dawn and the weathered spaces they call home. Here, brightly painted wooden boats stand in stubborn defiance of the corrosive, salty winds, and the rhythmic thud of traditional weaving looms creates a living, breathing tapestry of an uncompromising daily life."
  },
  localSection: {
    title: "The Living Artifact",
    content: "This is not merely a gallery of photographs; it is a reliquary of salt-stained memories. Our collection spans generations, meticulously preserving the fleeting atmosphere, the unspoken stories, and the raw, unfiltered essence of the Timor coast before the tide washes it away.",
    cta: "Step Into the Archive"
  },
  memory: {
    label: "A FRAGILE MEMORY",
    title: "The Dashboard Reflection",
    content: "From the dashboard, the world seems to pause. A cinematic reflection of a coast defined by the horizon, where salt-stained memories are meticulously preserved before the tide washes them away."
  },
  geography: {
    label: "COASTAL GEOGRAPHY",
    title: "The Eastern Enclave",
    content: "Wanderering along the coastline"
  },
  almanac: {
    label: "THE COASTAL ALMANAC",
    content: "An ongoing documentation of a horizon that refuses to stand still. Every captured frame, every note, is a silent witness to the eternal, sometimes violent, often tender dialogue between the shifting sands and the relentless sea."
  },
  quote: {
    text: "Visual manifestations transcend the mere act of telling a story. They are the salt in the wind, the lifeblood of our culture still being written in the sand.",
    author: "— Echoes of the Coast"
  },
  loading: {
    text: "Loading ..."
  },
  footer: {
    menu: {
      history: "HISTORY",
      village: "VILLAGE",
      geography: "GEOGRAPHY",
      archive: "ARCHIVE",
      home: "HOME",
      gallery: "GALLERY"
    },
    copyright: "© 2026 pelbag.ai"
  },
  navbar: {
    title: "PANTAI TIMOR",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    backToGallery: "Back to Gallery",
    home: "Home"
  },
  lightbox: {
    viewPhoto: "View Photo",
    defaultDescription: "A frame from the eastern coast archive.",
    aria: {
      closeGrid: "Close grid view",
      openGrid: "Open grid view",
      closeLightbox: "Close photo viewer",
      prevPhoto: "Previous photo",
      nextPhoto: "Next photo"
    }
  }
};

export const ATTRACTIONS: Attraction[] = [
  // ── Cities ──────────────────────────────────────────────────────────────
  {
    name: "KUALA TERENGGANU",
    lat: 5.3308,
    lng: 103.1408,
    category: "city",
    description: "The royal capital of Terengganu, where centuries of maritime heritage meet modern Islamic architecture. Here, the scent of sea salt mingles with the intricate artistry of traditional boatbuilders.",
    minZoom: 0,
    priority: 0
  },
  {
    name: "KOTA BHARU",
    lat: 6.1254,
    lng: 102.2386,
    category: "city",
    description: "The fiercely independent cultural heart of Kelantan. A city alive with the vivid colors of the Siti Khadijah market and the hypnotic, rhythmic shadows of the ancient wayang kulit.",
    minZoom: 0,
    priority: 0
  },
  {
    name: "KUANTAN",
    lat: 3.8077,
    lng: 103.3260,
    category: "city",
    description: "The bustling metropolis of the East Coast, where the relentless energy of commerce gently surrenders to the tranquil, pine-fringed shores of the South China Sea.",
    minZoom: 0,
    priority: 0
  },
  {
    name: "DUNGUN",
    lat: 4.7500,
    lng: 103.4167,
    category: "city",
    description: "Once a roaring iron-mining boomtown, Dungun has quietly reclaimed its peace. It now stands as a serene coastal enclave and the gateway to the untouched depths of Tenggol Island.",
    minZoom: 0,
    priority: 1
  },
  {
    name: "KEMAMAN",
    lat: 4.2333,
    lng: 103.4167,
    category: "city",
    description: "Terengganu's southern sentinel. A town of stark contrasts where massive industrial landmarks overlook sleepy fishing villages, famous for its rich coffee and surf-battered shores.",
    minZoom: 0,
    priority: 1
  },
  {
    name: "BESUT",
    lat: 5.8333,
    lng: 102.5500,
    category: "city",
    description: "The northernmost frontier of Terengganu. A mosaic of traditional fishing communities, wooden stilt houses, and the bustling transit point to the paradisiacal Perhentian waters.",
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
    description: "The 'Stopping Point' for ancient traders. These twin islands offer a sanctuary of crystalline waters, vibrant coral gardens, and a timeless, barefoot serenity.",
    minZoom: 0,
    priority: 1
  },
  {
    name: "Redang Island",
    nameMalay: "Pulau Redang",
    lat: 5.7767,
    lng: 103.0022,
    category: "island",
    description: "A breathtaking marine sanctuary where turquoise lagoons lap against blinding white sands. Beneath the surface lies one of the most biodiverse coral reefs in the archipelago.",
    minZoom: 0,
    priority: 1
  },
  {
    name: "Lang Tengah Island",
    nameMalay: "Pulau Lang Tengah",
    lat: 5.783,
    lng: 102.883,
    category: "island",
    description: "The 'Eagle in the Middle.' A quiet, secluded gem nestled between Redang and Perhentian, offering untouched reefs and a profound escape from the modern world.",
    minZoom: 8.2,
    priority: 3
  },
  {
    name: "Kapas Island",
    nameMalay: "Pulau Kapas",
    lat: 5.2150,
    lng: 103.2580,
    category: "island",
    description: "Cotton Island—named for its impossibly soft, powdery beaches. A secluded haven of calm, transparent waters just a short boat ride from the mainland.",
    minZoom: 9.0,
    priority: 4
  },
  {
    name: "Tenggol Island",
    nameMalay: "Pulau Tenggol",
    lat: 4.8000,
    lng: 103.6700,
    category: "island",
    description: "An isolated, dramatic paradise rising from the deep sea. Known as Terengganu's most pristine frontier, it is a haven for divers seeking the gentle giants of the ocean.",
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
    description: "Moonlight Beach. A sweeping arc of golden sand holding the memories of generations. As dusk falls, the horizon fills with the flutter of traditional wau kites dancing in the wind.",
    minZoom: 9.2,
    priority: 3
  },
  {
    name: "Batu Buruk Beach",
    nameMalay: "Pantai Batu Buruk",
    lat: 5.3200,
    lng: 103.1580,
    category: "beach",
    description: "The vibrant urban seafront of Kuala Terengganu. A place of community, where the crash of the waves meets the scent of sizzling street food and the laughter of evening strollers.",
    minZoom: 9.2,
    priority: 3
  },
  {
    name: "Cherating Beach",
    nameMalay: "Pantai Cherating",
    lat: 4.0667,
    lng: 103.3833,
    category: "beach",
    description: "A laid-back sanctuary with a bohemian soul. Famed for its legendary surf breaks, intricate batik workshops, and its history as a sacred nesting ground for leatherback turtles.",
    minZoom: 8.0,
    priority: 2
  },
  {
    name: "Rantau Abang",
    nameMalay: "Rantau Abang",
    lat: 4.871,
    lng: 103.389,
    category: "beach",
    description: "A serene stretch of golden sand steeped in melancholy and heritage. Once the midnight sanctuary for giant leatherback turtles, it remains a poignant symbol of coastal conservation.",
    minZoom: 8.5,
    priority: 2
  },
  {
    name: "Penarik",
    nameMalay: "Pantai Penarik",
    lat: 5.605,
    lng: 102.816,
    category: "beach",
    description: "A living postcard of the traditional Malay coast. Here, centuries-old wooden houses stand gracefully beneath swaying coconut groves, meeting the edge of an undisturbed river estuary.",
    minZoom: 9.0,
    priority: 3
  },
  {
    name: "Pantai Batu Pelanduk",
    nameMalay: "Pantai Batu Pelanduk",
    lat: 4.912,
    lng: 103.364,
    category: "beach",
    description: "A dramatic shoreline defined by nature's sculpture. Unique rock formations, weathered into the shape of mouse-deer by centuries of crashing waves, stand guard over the restless sea.",
    minZoom: 9.5,
    priority: 4
  },
  {
    name: "Kemasik Beach",
    nameMalay: "Pantai Kemasik",
    lat: 4.416,
    lng: 103.457,
    category: "beach",
    description: "An enchanting landscape where a tranquil inland lagoon meets the violent sea, separated only by a sliver of sand and guarded by iconic, twin monolithic rocks. A true geological marvel.",
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
    description: "A vast, emerald labyrinth of water drowning an ancient valley. Studded with 340 islands and encircled by a 130-million-year-old rainforest, it is a place of primeval mystery.",
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
    description: "A symphony of water carved through the deep jungle. Seven tiered cascades plunge into crystal-clear pools, offering a treasured, cooling retreat from the tropical heat.",
    minZoom: 9.5,
    priority: 3
  },
  {
    name: "Lasir Waterfall",
    nameMalay: "Air Terjun Lasir",
    lat: 5.0800,
    lng: 102.7600,
    category: "waterfall",
    description: "A dramatic, multi-tiered waterfall hidden within the Kenyir basin. Accessible only by boat, it plunges majestically through the dense rainforest canopy into deep, shaded pools.",
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
    description: "A sprawling architectural marvel standing on stilts. It holds the soul of the state, preserving the 14th-century Inscription Stone and a vast fleet of historic traditional vessels.",
    minZoom: 8.8,
    priority: 2
  },
  {
    name: "Kelantan State Museum",
    nameMalay: "Muzium Negeri Kelantan",
    lat: 6.1234,
    lng: 102.2396,
    category: "museum",
    description: "Housed within colonial walls in Kota Bharu, this museum safeguards the intricate regal history of Kelantan, from royal regalia to the mystical artistry of wayang kulit.",
    minZoom: 8.8,
    priority: 2
  },
  {
    name: "Crystal Mosque",
    nameMalay: "Masjid Kristal",
    lat: 5.3288,
    lng: 103.1478,
    category: "heritage",
    description: "A luminous, ethereal icon resting on Wan Man Island. Built entirely of steel, glass, and crystal, its domes reflect the ever-changing colors of the Terengganu River.",
    minZoom: 0,
    priority: 1
  },
  {
    name: "Istana Maziah",
    nameMalay: "Istana Maziah",
    lat: 5.3338,
    lng: 103.1355,
    category: "heritage",
    description: "A stately, sun-yellow palace anchoring the waterfront of Kuala Terengganu. A living symbol of the royal household, echoing with the quiet dignity of centuries past.",
    minZoom: 9.0,
    priority: 2
  },
  {
    name: "Kerteh Refinery",
    nameMalay: "Penapisan Kerteh",
    lat: 4.567,
    lng: 103.454,
    category: "heritage",
    description: "The 'City of Lights.' A sprawling, industrial colossus that transforms the night sky into a glowing, futuristic landscape—a stark, awe-inspiring contrast to the natural coastline.",
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
    description: "A primordial world older than the Amazon. This 130-million-year-old rainforest teems with the unseen presence of tigers, the calls of hornbills, and the whispering canopy above.",
    minZoom: 0,
    priority: 1
  },
  {
    name: "Bukit Keluang",
    nameMalay: "Bukit Keluang",
    lat: 5.802,
    lng: 102.605,
    category: "nature",
    description: "A dramatic coastal hill offering sweeping, panoramic views of the South China Sea. Below, secret sea caves and rugged cliffs wait to be explored via winding wooden walkways.",
    minZoom: 8.5,
    priority: 2
  },
];

export const COASTAL_LOCATIONS: CoastalLocation[] = [
  {
    "name": "Coastal Archive Point 01",
    "lat": 5.973952,
    "lng": 102.440377,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/78E961C5-31C7-418E-9811-635ADA3EBAB9.JPG",
    "imageAlt": "Coastal photography 78E961C5-31C7-418E-9811-635ADA3EBAB9.JPG",
  },
  {
    "name": "Coastal Archive Point 02",
    "lat": 5.829322,
    "lng": 102.558491,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00032.jpg",
    "imageAlt": "Coastal photography DSC00032.jpg",
    featured:true,
  },
  {
    "name": "Coastal Archive Point 03",
    "lat": 5.430578,
    "lng": 103.068323,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00052.jpg",
    "imageAlt": "Coastal photography DSC00052.jpg",
    featured:true,
  },
  {
    "name": "Coastal Archive Point 04",
    "lat": 5.620211,
    "lng": 102.802515,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00068.jpg",
    "imageAlt": "Coastal photography DSC00068.jpg"
  },
  {
    "name": "Coastal Archive Point 05",
    "lat": 5.732381,
    "lng": 102.665718,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00234.jpg",
    "imageAlt": "Coastal photography DSC00234.jpg"
  },
  {
    "name": "Coastal Archive Point 06",
    "lat": 6.023100,
    "lng": 102.418742,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00465.JPG",
    "imageAlt": "Coastal photography DSC00465.JPG"
  },
  {
    "name": "Coastal Archive Point 07",
    "lat":6.023368,
    "lng": 102.416231,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00516.JPG",
    "imageAlt": "Coastal photography DSC00516.JPG"
  },
  {
    "name": "Coastal Archive Point 08",
    "lat": 6.028801,
    "lng": 102.416447,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00552.JPG",
    "imageAlt": "Coastal photography DSC00552.JPG",
  },
  {
    "name": "Coastal Archive Point 09",
   "lat": 6.028801,
    "lng": 102.416447,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00587.JPG",
    "imageAlt": "Coastal photography DSC00587.JPG"
  },
  {
    "name": "Coastal Archive Point 10",
    "lat": 6.028801,
    "lng": 102.416447,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00590.JPG",
    "imageAlt": "Coastal photography DSC00590.JPG",
    "featured": true,
  },
  {
    "name": "Coastal Archive Point 11",
     "lat": 6.028801,
    "lng": 102.416447,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00608.JPG",
    "imageAlt": "Coastal photography DSC00608.JPG"
  },
  {
    "name": "Coastal Archive Point 12",
    "lat": 6.031716,
    "lng": 102.414712,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00631.JPG",
    "imageAlt": "Coastal photography DSC00631.JPG"
  },
  {
    "name": "Coastal Archive Point 13",
    "lat": 6.031716,
    "lng": 102.414712,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00638.JPG",
    "imageAlt": "Coastal photography DSC00638.JPG"
  },
  {
    "name": "Coastal Archive Point 14",
    "lat": 6.030274,
    "lng": 102.415008,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00645.JPG",
    "imageAlt": "Coastal photography DSC00645.JPG"
  },
  {
    "name": "Coastal Archive Point 15",
    "lat": 5.983638,
    "lng": 102.434814,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00649.JPG",
    "imageAlt": "Coastal photography DSC00649.JPG",
    featured:true,
  },
  {
    "name": "Coastal Archive Point 16",
    "lat": 5.974645,
    "lng": 102.440973,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00679.JPG",
    "imageAlt": "Coastal photography DSC00679.JPG",
    featured:true,
  },
  {
    "name": "Coastal Archive Point 17",
    "lat": 5.974645,
    "lng": 102.440973,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00710.JPG",
    "imageAlt": "Coastal photography DSC00710.JPG",
    featured:true,
  },
  {
    "name": "Coastal Archive Point 18",
    "lat": 5.996194,
    "lng": 102.430233,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00743.JPG",
    "imageAlt": "Coastal photography DSC00743.JPG"
  },
  {
    "name": "Coastal Archive Point 19",
    "lat": 6.027410,
    "lng": 102.416115,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00756_2.JPG",
    "imageAlt": "Coastal photography DSC00756_2.JPG",
    "featured": true,
  },
  {
    "name": "Coastal Archive Point 20",
    "lat": 6.027410,
    "lng": 102.416115,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00788.JPG",
    "imageAlt": "Coastal photography DSC00788.JPG"
  },
  {
    "name": "Coastal Archive Point 21",
    "lat": 6.028945,
    "lng": 102.416101,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00799.JPG",
    "imageAlt": "Coastal photography DSC00799.JPG"
  },
  {
    "name": "Coastal Archive Point 22",
    "lat": 6.030996,
    "lng": 102.414735,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00809.JPG",
    "imageAlt": "Coastal photography DSC00809.JPG"
  },
  {
    "name": "Coastal Archive Point 23",
    "lat": 6.024857,
    "lng": 102.417335,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00845.JPG",
    "imageAlt": "Coastal photography DSC00845.JPG"
  },
  {
    "name": "Coastal Archive Point 24",
    "lat": 6.024857,
    "lng": 102.417335,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00854.JPG",
    "imageAlt": "Coastal photography DSC00854.JPG",
    "featured": true,
  },
  {
    "name": "Coastal Archive Point 25",
    "lat": 6.000308,
    "lng": 102.428760,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC00932.JPG",
    "imageAlt": "Coastal photography DSC00932.JPG"
  },
  {
    "name": "Coastal Archive Point 26",
    "lat": 4.827953,
    "lng": 103.416472,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07654.jpg",
    "imageAlt": "Coastal photography DSC07654.jpg"
  },
  {
    "name": "Coastal Archive Point 27",
    "lat": 4.827565,
    "lng": 103.416930,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07665_1.jpg",
    "imageAlt": "Coastal photography DSC07665_1.jpg",
    "featured": true,
  },
  {
    "name": "Coastal Archive Point 28",
    "lat": 4.937331,
    "lng": 103.352965,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07670_1.jpg",
    "imageAlt": "Coastal photography DSC07670_1.jpg",
    featured:true,
  },
  {
    "name": "Coastal Archive Point 30",
    "lat": 5.240394,
    "lng": 103.189754,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07705.jpg",
    "imageAlt": "Coastal photography DSC07705.jpg"
  },
  {
    "name": "Coastal Archive Point 31",
    "lat": 4.944580,
    "lng": 103.348057,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07763_1.jpg",
    "imageAlt": "Coastal photography DSC07763_1.jpg"
  },
  {
    "name": "Coastal Archive Point 32",
    "lat": 4.937331,
    "lng": 103.352965,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07799_1.jpg",
    "imageAlt": "Coastal photography DSC07799_1.jpg"
  },
  {
    "name": "Coastal Archive Point 33",
    "lat": 4.937331,
    "lng": 103.352965,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07802.jpg",
    "imageAlt": "Coastal photography DSC07802.jpg"
  },
  {
    "name": "Coastal Archive Point 34",
    "lat": 5.731662,
    "lng": 102.664681,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC07995.jpg",
    "imageAlt": "Coastal photography DSC07995.jpg"
  },
  {
    "name": "Coastal Archive Point 35",
    "lat": 5.629070,
    "lng": 102.790681,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC01024.jpg",
    "imageAlt": "Coastal photography DSC01024.jpg"
  },
  {
    "name": "Coastal Archive Point 36",
    "lat": 5.625414,
    "lng": 102.791894,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC08014.jpg",
    "imageAlt": "Coastal photography DSC08014.jpg",
    "featured": true,
  },
  {
    "name": "Coastal Archive Point 37",
    "lat": 5.210408,
    "lng": 103.214161,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC08133_1.jpg",
    "imageAlt": "Coastal photography DSC08133_1.jpg",
    "featured": true,
  },
  {
    "name": "Coastal Archive Point 38",
    "lat": 5.210408,
    "lng": 103.214161,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC08162.jpg",
    "imageAlt": "Coastal photography DSC08162.jpg"
  },
  {
    "name": "Coastal Archive Point 39",
    "lat": 4.937077,
    "lng": 103.353147,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC08235.jpg",
    "imageAlt": "Coastal photography DSC08235.jpg",
    "featured": true,
  },
  {
    "name": "Coastal Archive Point 41",
    "lat": 5.625859,
    "lng": 102.794364,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC01061.jpg",
    "imageAlt": "Coastal photography DSC01061.jpg"
  },
  {
    "name": "Coastal Archive Point 42",
    "lat": 5.447360,
    "lng": 103.051640,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC01096.jpg",
    "imageAlt": "Coastal photography DSC01096.jpg"
  },
  {
    "name": "Coastal Archive Point 43",
    "lat": 5.430578,
    "lng": 103.068323,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
    "image": "https://pub-b9f89abd4d2c41cea208e711fca4cc0c.r2.dev/pantai-timor/DSC01109.jpg",
    "imageAlt": "Coastal photography DSC01109.jpg",
    "featured": true,
  },
  {
    "name": "Coastal Archive Point 44",
    "lat": 5.285161,
    "lng": 103.171736,
    "description": "A frozen whisper of the monsoon. Documenting the eternal, shifting dialogue between the unforgiving sea and the resilient eastern shore.",
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

export const FEATURED_IMAGES = CAROUSEL_IMAGES.filter((img) => {
  const loc = COASTAL_LOCATIONS.find((l) => l.image === img.src);
  return loc?.featured === true;
});
