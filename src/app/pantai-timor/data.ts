export interface CoastalLocation {
  name: string;
  lat: number;
  lng: number;
  description: string;
  image?: string;
  imageAlt?: string;
}

export const COASTAL_LOCATIONS: CoastalLocation[] = [
  { 
    name: "Bachok", 
    lat: 6.0628, 
    lng: 102.3945, 
    description: "The northern gateway to the Kelantan coast, where traditional fishing boats line the shore.",
    image: "/images/pantai-timor/DSC00052.jpg",
    imageAlt: "Coastal Water Ripples at Bachok"
  },
  { 
    name: "Besut", 
    lat: 5.7600, 
    lng: 102.4900, 
    description: "A serene border town where the estuary meets the azure sea, home to skilled boat builders.",
    image: "/images/pantai-timor/DSC00465.JPG",
    imageAlt: "Ancient Tree at Besut"
  },
  { 
    name: "Penarik", 
    lat: 5.6167, 
    lng: 102.8333, 
    description: "A breathtaking stretch of pristine beach lined with leaning coconut palms and traditional houses.",
    image: "/images/pantai-timor/DSC00932.JPG",
    imageAlt: "Pristine Beach at Penarik"
  },
  { 
    name: "Kuala Terengganu", 
    lat: 5.3302, 
    lng: 103.1408, 
    description: "The royal heartbeat of the eastern heritage, known for its iconic drawbridge and bustling markets.",
    image: "/images/pantai-timor/DSC00679.JPG",
    imageAlt: "Fishing Boat at Kuala Terengganu"
  },
  { 
    name: "Marang", 
    lat: 5.2045, 
    lng: 103.2081, 
    description: "A quiet fishing enclave and the gateway to the crystalline waters of Kapas Island.",
    image: "/images/pantai-timor/DSC00516.JPG",
    imageAlt: "Boat Detail at Marang"
  },
  { 
    name: "Dungun", 
    lat: 4.7578, 
    lng: 103.4150, 
    description: "Famed for its ancient rock formations and as the historical nesting grounds of giant leatherback turtles.",
    image: "/images/pantai-timor/DSC00234.jpg",
    imageAlt: "Island Peaks at Dungun"
  },
];
