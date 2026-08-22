export interface CategoryItem {
  id: string;
  name: string;
  tagline: string;
  image: string;
  badge: string;
  count: string;
}

export interface DestinationItem {
  id: string;
  name: string;
  country: string;
  travelStyle: string;
  costLevel: string;
  image: string;
  rating: number;
  highlight: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  location: string;
  category: string;
  duration: string;
  estimatedCost: string;
  image: string;
  rating: number;
}

export interface RouteCity {
  city: string;
  stateCountry: string;
  days: string;
  dates: string;
  activitiesCount: number;
  image: string;
}

export interface InspirationStory {
  id: string;
  title: string;
  tagline: string;
  duration: string;
  cities: string[];
  estimatedBudget: string;
  image: string;
  badge: string;
}

export const LANDING_CATEGORIES: CategoryItem[] = [
  {
    id: "nature",
    name: "Nature & Escapes",
    tagline: "Untamed peaks, misty valleys & serene lakes",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&auto=format&fit=crop&q=80",
    badge: "Scenic",
    count: "120+ Places",
  },
  {
    id: "food",
    name: "Culinary & Markets",
    tagline: "Secret street food trails & local dining",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&auto=format&fit=crop&q=80",
    badge: "Gourmet",
    count: "85+ Tours",
  },
  {
    id: "culture",
    name: "Heritage & Temples",
    tagline: "Centuries of history & iconic landmarks",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=700&auto=format&fit=crop&q=80",
    badge: "Historic",
    count: "94+ Sights",
  },
  {
    id: "beach",
    name: "Coastal & Islands",
    tagline: "Sun-drenched golden shores & secret coves",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&auto=format&fit=crop&q=80",
    badge: "Tropical",
    count: "110+ Spots",
  },
  {
    id: "adventure",
    name: "Treks & Adventure",
    tagline: "Adrenaline-fueled climbs & expeditions",
    image:
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=700&auto=format&fit=crop&q=80",
    badge: "Thrills",
    count: "64+ Trails",
  },
  {
    id: "city",
    name: "Urban & Nightlife",
    tagline: "Vibrant skylines, cafes & evening buzz",
    image:
      "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=700&auto=format&fit=crop&q=80",
    badge: "Modern",
    count: "140+ Cities",
  },
];

export const LANDING_DESTINATIONS: DestinationItem[] = [
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    travelStyle: "Culture · Shrines · Tea Ceremonies",
    costLevel: "₹₹₹",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&auto=format&fit=crop&q=80",
    rating: 4.9,
    highlight: "Arashiyama Bamboo Groves & Fushimi Inari",
  },
  {
    id: "goa",
    name: "Goa",
    country: "India",
    travelStyle: "Coastal · Heritage · Sunsets",
    costLevel: "₹₹",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&auto=format&fit=crop&q=80",
    rating: 4.8,
    highlight: "Golden Coastlines & Latin Quarters",
  },
  {
    id: "amalfi",
    name: "Amalfi Coast",
    country: "Italy",
    travelStyle: "Cliffside Towns · Coastal · Culinary",
    costLevel: "₹₹₹₹",
    image:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=900&auto=format&fit=crop&q=80",
    rating: 4.9,
    highlight: "Positano Cliffs & Mediterranean Views",
  },
  {
    id: "istanbul",
    name: "Istanbul",
    country: "Turkey",
    travelStyle: "Bazaars · Architecture · Bosphorus",
    costLevel: "₹₹",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=900&auto=format&fit=crop&q=80",
    rating: 4.8,
    highlight: "Grand Bazaar & Hagia Sophia Dome",
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    travelStyle: "Emerald Terraces · Wellness · Surf",
    costLevel: "₹₹",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&auto=format&fit=crop&q=80",
    rating: 4.9,
    highlight: "Ubud Rice Terraces & Sacred Waterfalls",
  },
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    travelStyle: "Historic Trams · Pastries · Miradouros",
    costLevel: "₹₹₹",
    image:
      "https://images.unsplash.com/photo-1509803874385-db7c23652552?w=900&auto=format&fit=crop&q=80",
    rating: 4.8,
    highlight: "Alfama Cobbled Alleys & Ocean Breezes",
  },
];

export const LANDING_EXPERIENCES: ExperienceItem[] = [
  {
    id: "exp-1",
    title: "Sunset Catamaran Sailing & Ocean Dolphins",
    location: "South Coast, Goa",
    category: "Coastal Sailing",
    duration: "3.5 Hours",
    estimatedCost: "₹2,400",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=700&auto=format&fit=crop&q=80",
    rating: 4.9,
  },
  {
    id: "exp-2",
    title: "Gion Lantern Trail & Artisan Matcha Tasting",
    location: "Gion District, Kyoto",
    category: "Food & Culture",
    duration: "2.5 Hours",
    estimatedCost: "₹3,800",
    image:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=700&auto=format&fit=crop&q=80",
    rating: 4.9,
  },
  {
    id: "exp-3",
    title: "Path of the Gods Cliffside Trek",
    location: "Amalfi Coast, Italy",
    category: "Mountain Hiking",
    duration: "4.5 Hours",
    estimatedCost: "₹4,200",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&auto=format&fit=crop&q=80",
    rating: 4.8,
  },
  {
    id: "exp-4",
    title: "Ancient Boulders Sunset Heritage Walk",
    location: "Hampi, India",
    category: "Historical Walk",
    duration: "3.0 Hours",
    estimatedCost: "₹1,200",
    image:
      "https://images.unsplash.com/photo-1600100397608-f010e47c183b?w=700&auto=format&fit=crop&q=80",
    rating: 4.9,
  },
];

export const MULTI_CITY_ROUTE: RouteCity[] = [
  {
    city: "Mumbai",
    stateCountry: "Maharashtra, India",
    days: "Days 1–2",
    dates: "Oct 12 – 14",
    activitiesCount: 4,
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80",
  },
  {
    city: "Goa",
    stateCountry: "India",
    days: "Days 3–5",
    dates: "Oct 14 – 17",
    activitiesCount: 6,
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80",
  },
  {
    city: "Hampi",
    stateCountry: "Karnataka, India",
    days: "Days 6–7",
    dates: "Oct 17 – 19",
    activitiesCount: 5,
    image:
      "https://images.unsplash.com/photo-1600100397608-f010e47c183b?w=600&auto=format&fit=crop&q=80",
  },
  {
    city: "Bangalore",
    stateCountry: "Karnataka, India",
    days: "Days 8–9",
    dates: "Oct 19 – 21",
    activitiesCount: 3,
    image:
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format&fit=crop&q=80",
  },
];

export const INSPIRATION_STORIES: InspirationStory[] = [
  {
    id: "japan-7days",
    title: "7 Days in Japan: Neon Skylines to Zen Sanctuaries",
    tagline: "Tokyo · Hakone · Kyoto · Osaka",
    duration: "7 Days",
    cities: ["Tokyo", "Hakone", "Kyoto", "Osaka"],
    estimatedBudget: "₹1,15,000",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&auto=format&fit=crop&q=80",
    badge: "Popular Trail",
  },
  {
    id: "rajasthan-heritage",
    title: "Royal Forts, Palaces & Desert Sunsets Across Rajasthan",
    tagline: "Jaipur · Jodhpur · Udaipur",
    duration: "4 Days",
    cities: ["Jaipur", "Jodhpur", "Udaipur"],
    estimatedBudget: "₹28,500",
    image:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&auto=format&fit=crop&q=80",
    badge: "Heritage Route",
  },
  {
    id: "goa-coastal",
    title: "Coastal Roadtrip: Secret Coves, Spice Farms & Cafes",
    tagline: "Panaji · Vagator · Palolem · Cola Beach",
    duration: "5 Days",
    cities: ["North Goa", "South Goa"],
    estimatedBudget: "₹22,000",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
    badge: "Beach Getaway",
  },
  {
    id: "europe-train",
    title: "Scenic Rail Across Europe: Alpine Lakes & Historic Towns",
    tagline: "Zurich · Vienna · Prague · Budapest",
    duration: "10 Days",
    cities: ["Zurich", "Vienna", "Prague", "Budapest"],
    estimatedBudget: "₹1,65,000",
    image:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=900&auto=format&fit=crop&q=80",
    badge: "Scenic Rail",
  },
];
