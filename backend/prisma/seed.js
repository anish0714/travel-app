// Seeds realistic Canadian reference data: major airports (real IATA codes)
// and a representative set of real, well-known hotels in each city, with a
// couple of bookable room types and rate plans per hotel.

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const airports = [
  { iataCode: "YYZ", name: "Toronto Pearson International Airport", city: "Toronto", country: "Canada", timezone: "America/Toronto" },
  { iataCode: "YTZ", name: "Billy Bishop Toronto City Airport", city: "Toronto", country: "Canada", timezone: "America/Toronto" },
  { iataCode: "YVR", name: "Vancouver International Airport", city: "Vancouver", country: "Canada", timezone: "America/Vancouver" },
  { iataCode: "YUL", name: "Montréal-Trudeau International Airport", city: "Montreal", country: "Canada", timezone: "America/Toronto" },
  { iataCode: "YYC", name: "Calgary International Airport", city: "Calgary", country: "Canada", timezone: "America/Edmonton" },
  { iataCode: "YOW", name: "Ottawa Macdonald-Cartier International Airport", city: "Ottawa", country: "Canada", timezone: "America/Toronto" },
  { iataCode: "YEG", name: "Edmonton International Airport", city: "Edmonton", country: "Canada", timezone: "America/Edmonton" },
  { iataCode: "YWG", name: "Winnipeg James Armstrong Richardson International Airport", city: "Winnipeg", country: "Canada", timezone: "America/Winnipeg" },
  { iataCode: "YHZ", name: "Halifax Stanfield International Airport", city: "Halifax", country: "Canada", timezone: "America/Halifax" },
  { iataCode: "YXE", name: "Saskatoon John G. Diefenbaker International Airport", city: "Saskatoon", country: "Canada", timezone: "America/Regina" },
  { iataCode: "YQB", name: "Québec City Jean Lesage International Airport", city: "Quebec City", country: "Canada", timezone: "America/Toronto" },
  { iataCode: "YYJ", name: "Victoria International Airport", city: "Victoria", country: "Canada", timezone: "America/Vancouver" },
  { iataCode: "YQR", name: "Regina International Airport", city: "Regina", country: "Canada", timezone: "America/Regina" },
  { iataCode: "YFC", name: "Fredericton International Airport", city: "Fredericton", country: "Canada", timezone: "America/Halifax" },
  { iataCode: "YYT", name: "St. John's International Airport", city: "St. John's", country: "Canada", timezone: "America/St_Johns" },
];

const airlines = [
  { iataCode: "AC", name: "Air Canada" },
  { iataCode: "WS", name: "WestJet" },
  { iataCode: "PD", name: "Porter Airlines" },
  { iataCode: "F8", name: "Flair Airlines" },
];

const suppliers = [
  { name: "Fairmont Hotels & Resorts", type: "HOTEL_CHAIN" },
  { name: "Marriott International", type: "HOTEL_CHAIN" },
  { name: "Hyatt Hotels Corporation", type: "HOTEL_CHAIN" },
  { name: "Pan Pacific Hotels Group", type: "HOTEL_CHAIN" },
  { name: "Omni Hotels & Resorts", type: "HOTEL_CHAIN" },
  { name: "InterContinental Hotels Group", type: "HOTEL_CHAIN" },
  { name: "Accor", type: "HOTEL_CHAIN" },
  { name: "Best Western Hotels & Resorts", type: "HOTEL_CHAIN" },
  { name: "Wyndham Hotels & Resorts", type: "HOTEL_CHAIN" },
  { name: "Choice Hotels International", type: "HOTEL_CHAIN" },
  { name: "Independent", type: "INDEPENDENT" },
];

const hotels = [
  // Toronto
  { name: "Fairmont Royal York", address: "100 Front St W", city: "Toronto", country: "Canada", lat: 43.6455, long: -79.3806, starRating: 5.0, supplierName: "Fairmont Hotels & Resorts" },
  { name: "The Omni King Edward Hotel", address: "37 King St E", city: "Toronto", country: "Canada", lat: 43.6496, long: -79.3757, starRating: 4.5, supplierName: "Omni Hotels & Resorts" },
  { name: "Delta Hotels Toronto", address: "75 Lower Simcoe St", city: "Toronto", country: "Canada", lat: 43.6440, long: -79.3830, starRating: 4.0, supplierName: "Marriott International" },

  // Vancouver
  { name: "Fairmont Waterfront", address: "900 Canada Pl", city: "Vancouver", country: "Canada", lat: 49.2888, long: -123.1120, starRating: 5.0, supplierName: "Fairmont Hotels & Resorts" },
  { name: "Pan Pacific Vancouver", address: "999 Canada Pl", city: "Vancouver", country: "Canada", lat: 49.2894, long: -123.1131, starRating: 4.5, supplierName: "Pan Pacific Hotels Group" },
  { name: "Sheraton Vancouver Wall Centre", address: "1088 Burrard St", city: "Vancouver", country: "Canada", lat: 49.2823, long: -123.1246, starRating: 4.0, supplierName: "Marriott International" },

  // Montreal
  { name: "Fairmont The Queen Elizabeth", address: "900 Boulevard René-Lévesque O", city: "Montreal", country: "Canada", lat: 45.5002, long: -73.5697, starRating: 5.0, supplierName: "Fairmont Hotels & Resorts" },
  { name: "Hotel Bonaventure Montreal", address: "900 Rue de la Gauchetière O", city: "Montreal", country: "Canada", lat: 45.4986, long: -73.5658, starRating: 4.0, supplierName: "Independent" },
  { name: "Le Centre Sheraton Montreal", address: "1201 Boulevard René-Lévesque O", city: "Montreal", country: "Canada", lat: 45.4975, long: -73.5735, starRating: 4.0, supplierName: "Marriott International" },

  // Calgary
  { name: "Fairmont Palliser", address: "133 9 Ave SW", city: "Calgary", country: "Canada", lat: 51.0447, long: -114.0653, starRating: 4.5, supplierName: "Fairmont Hotels & Resorts" },
  { name: "Hyatt Regency Calgary", address: "700 Centre St SE", city: "Calgary", country: "Canada", lat: 51.0453, long: -114.0587, starRating: 4.0, supplierName: "Hyatt Hotels Corporation" },

  // Ottawa
  { name: "Fairmont Château Laurier", address: "1 Rideau St", city: "Ottawa", country: "Canada", lat: 45.4247, long: -75.6929, starRating: 5.0, supplierName: "Fairmont Hotels & Resorts" },
  { name: "The Westin Ottawa", address: "11 Colonel By Dr", city: "Ottawa", country: "Canada", lat: 45.4229, long: -75.6924, starRating: 4.0, supplierName: "Marriott International" },

  // Quebec City
  { name: "Fairmont Le Château Frontenac", address: "1 Rue des Carrières", city: "Quebec City", country: "Canada", lat: 46.8123, long: -71.2050, starRating: 5.0, supplierName: "Fairmont Hotels & Resorts" },
  { name: "Hôtel Château Laurier Québec", address: "1220 Place George-V O", city: "Quebec City", country: "Canada", lat: 46.8010, long: -71.2185, starRating: 4.0, supplierName: "Independent" },

  // Banff, AB
  { name: "Fairmont Banff Springs", address: "405 Spray Ave", city: "Banff", country: "Canada", lat: 51.1660, long: -115.5716, starRating: 5.0, supplierName: "Fairmont Hotels & Resorts" },

  // Halifax
  { name: "The Westin Nova Scotian", address: "1181 Hollis St", city: "Halifax", country: "Canada", lat: 44.6423, long: -63.5724, starRating: 4.0, supplierName: "Marriott International" },
  { name: "Delta Hotels Halifax", address: "1990 Barrington St", city: "Halifax", country: "Canada", lat: 44.6467, long: -63.5727, starRating: 4.0, supplierName: "Marriott International" },

  // Winnipeg
  { name: "Fairmont Winnipeg", address: "2 Lombard Pl", city: "Winnipeg", country: "Canada", lat: 49.8970, long: -97.1385, starRating: 4.5, supplierName: "Fairmont Hotels & Resorts" },
  { name: "Delta Hotels Winnipeg", address: "350 St Mary Ave", city: "Winnipeg", country: "Canada", lat: 49.8917, long: -97.1444, starRating: 4.0, supplierName: "Marriott International" },

  // Victoria
  { name: "Fairmont Empress", address: "721 Government St", city: "Victoria", country: "Canada", lat: 48.4235, long: -123.3700, starRating: 5.0, supplierName: "Fairmont Hotels & Resorts" },
  { name: "Delta Hotels Victoria Ocean Pointe", address: "100 Harbour Rd", city: "Victoria", country: "Canada", lat: 48.4212, long: -123.3853, starRating: 4.0, supplierName: "Marriott International" },

  // --- Tier 2: mid-range (~3.5 star) ---
  { name: "Holiday Inn Toronto Downtown Centre", address: "30 Carlton St", city: "Toronto", country: "Canada", lat: 43.6616, long: -79.3818, starRating: 3.5, supplierName: "InterContinental Hotels Group" },
  { name: "Holiday Inn Vancouver Centre Broadway", address: "711 W Broadway", city: "Vancouver", country: "Canada", lat: 49.2632, long: -123.1207, starRating: 3.5, supplierName: "InterContinental Hotels Group" },
  { name: "Novotel Montreal Centre", address: "1180 Rue de la Montagne", city: "Montreal", country: "Canada", lat: 45.4949, long: -73.5734, starRating: 3.5, supplierName: "Accor" },
  { name: "Holiday Inn Calgary Downtown", address: "1020 8 Ave SW", city: "Calgary", country: "Canada", lat: 51.0470, long: -114.0797, starRating: 3.5, supplierName: "InterContinental Hotels Group" },
  { name: "Novotel Ottawa City Centre", address: "33 Nicholas St", city: "Ottawa", country: "Canada", lat: 45.4256, long: -75.6892, starRating: 3.5, supplierName: "Accor" },
  { name: "Hotel Manoir Victoria", address: "44 Côte du Palais", city: "Quebec City", country: "Canada", lat: 46.8129, long: -71.2058, starRating: 3.5, supplierName: "Independent" },
  { name: "Banff Ptarmigan Inn", address: "337 Banff Ave", city: "Banff", country: "Canada", lat: 51.1774, long: -115.5699, starRating: 3.5, supplierName: "Independent" },
  { name: "Holiday Inn Halifax Centre", address: "1980 Robie St", city: "Halifax", country: "Canada", lat: 44.6486, long: -63.5934, starRating: 3.5, supplierName: "InterContinental Hotels Group" },
  { name: "Best Western Plus Winnipeg Airport Hotel", address: "1715 Wellington Ave", city: "Winnipeg", country: "Canada", lat: 49.9028, long: -97.2260, starRating: 3.5, supplierName: "Best Western Hotels & Resorts" },
  { name: "Chateau Victoria Hotel & Suites", address: "740 Burdett Ave", city: "Victoria", country: "Canada", lat: 48.4171, long: -123.3616, starRating: 3.5, supplierName: "Independent" },

  // --- Tier 3: budget (~2.5 star) ---
  { name: "Days Inn by Wyndham Toronto Danforth", address: "2403 Danforth Ave", city: "Toronto", country: "Canada", lat: 43.6893, long: -79.3086, starRating: 2.5, supplierName: "Wyndham Hotels & Resorts" },
  { name: "Days Inn by Wyndham Vancouver Downtown", address: "921 W Pender St", city: "Vancouver", country: "Canada", lat: 49.2839, long: -123.1194, starRating: 2.5, supplierName: "Wyndham Hotels & Resorts" },
  { name: "Travelodge Hotel Montreal Centre", address: "50 Boulevard René-Lévesque O", city: "Montreal", country: "Canada", lat: 45.5063, long: -73.5629, starRating: 2.5, supplierName: "Wyndham Hotels & Resorts" },
  { name: "Super 8 by Wyndham Calgary South", address: "4909 Blackfoot Trail SE", city: "Calgary", country: "Canada", lat: 51.0125, long: -114.0338, starRating: 2.5, supplierName: "Wyndham Hotels & Resorts" },
  { name: "Comfort Inn Ottawa East", address: "1252 Michael St", city: "Ottawa", country: "Canada", lat: 45.4231, long: -75.6083, starRating: 2.5, supplierName: "Choice Hotels International" },
  { name: "Comfort Inn Quebec", address: "6435 Boulevard Wilfrid-Hamel", city: "Quebec City", country: "Canada", lat: 46.8158, long: -71.3369, starRating: 2.5, supplierName: "Choice Hotels International" },
  { name: "Comfort Inn Halifax", address: "88 Chain Lake Dr", city: "Halifax", country: "Canada", lat: 44.6395, long: -63.6423, starRating: 2.5, supplierName: "Choice Hotels International" },
  { name: "Super 8 by Wyndham Winnipeg", address: "3000 Pembina Hwy", city: "Winnipeg", country: "Canada", lat: 49.8145, long: -97.1524, starRating: 2.5, supplierName: "Wyndham Hotels & Resorts" },
  { name: "Comfort Inn & Suites Downtown Victoria", address: "3020 Blanshard St", city: "Victoria", country: "Canada", lat: 48.4344, long: -123.3654, starRating: 2.5, supplierName: "Choice Hotels International" },
];

// Room tiers keyed by star rating, so pricing scales with hotel class
// instead of being hand-typed per property.
const ROOM_TIERS = {
  5.0: [
    { roomType: "Standard King", maxOccupancy: 2, basePrice: 429 },
    { roomType: "Deluxe Suite", maxOccupancy: 4, basePrice: 689 },
  ],
  4.5: [
    { roomType: "Standard King", maxOccupancy: 2, basePrice: 339 },
    { roomType: "Deluxe Suite", maxOccupancy: 4, basePrice: 549 },
  ],
  4.0: [
    { roomType: "Standard King", maxOccupancy: 2, basePrice: 249 },
    { roomType: "Deluxe Suite", maxOccupancy: 4, basePrice: 399 },
  ],
  3.5: [
    { roomType: "Standard King", maxOccupancy: 2, basePrice: 169 },
    { roomType: "Deluxe Suite", maxOccupancy: 4, basePrice: 259 },
  ],
  2.5: [
    { roomType: "Standard King", maxOccupancy: 2, basePrice: 109 },
    { roomType: "Deluxe Suite", maxOccupancy: 4, basePrice: 159 },
  ],
};

// Real Canadian travel insurance providers, one plan per tier. premiumRate
// is applied against a trip's subtotal at booking time (see
// backend/src/routes/bookings.js), floored at minimumPremium.
const insurancePlans = [
  {
    provider: "TuGo",
    planName: "TuGo Emergency Medical",
    tier: "BASIC",
    coverageAmount: 100000,
    premiumRate: 0.04,
    minimumPremium: 19,
    description: "Emergency medical coverage for unexpected illness or injury while traveling.",
  },
  {
    provider: "Manulife",
    planName: "Manulife CoverMe Trip Package",
    tier: "STANDARD",
    coverageAmount: 2500000,
    premiumRate: 0.07,
    minimumPremium: 39,
    description: "Emergency medical coverage plus trip cancellation and interruption protection.",
  },
  {
    provider: "Allianz Global Assistance",
    planName: "Allianz All-Inclusive",
    tier: "PREMIUM",
    coverageAmount: 5000000,
    premiumRate: 0.12,
    minimumPremium: 79,
    description: "Comprehensive coverage: medical, trip cancellation, baggage, and flight delay protection.",
  },
];

// Realistic domestic route network across the 15 seeded airports, modeled
// after each carrier's real hub/focus-city pattern: Air Canada (national,
// YYZ/YUL/YYC), WestJet (Calgary-hub), Porter (YTZ/Eastern Canada), and
// Flair (ultra-low-cost leisure routes). Flights are generated for the
// next DAYS_AHEAD days from whenever the seed is run, so search results
// stay current rather than pinned to a fixed date.
const DAYS_AHEAD = 7;

const ROUTE_LEGS = [
  // Air Canada — national network
  { airline: "AC", flightNumber: "101", origin: "YYZ", destination: "YVR", hour: 8, minute: 0, durationMin: 300 },
  { airline: "AC", flightNumber: "102", origin: "YVR", destination: "YYZ", hour: 23, minute: 0, durationMin: 285 },
  { airline: "AC", flightNumber: "103", origin: "YYZ", destination: "YYC", hour: 9, minute: 15, durationMin: 240 },
  { airline: "AC", flightNumber: "104", origin: "YYC", destination: "YYZ", hour: 13, minute: 0, durationMin: 235 },
  { airline: "AC", flightNumber: "105", origin: "YYZ", destination: "YUL", hour: 7, minute: 30, durationMin: 70 },
  { airline: "AC", flightNumber: "106", origin: "YUL", destination: "YYZ", hour: 18, minute: 0, durationMin: 70 },
  { airline: "AC", flightNumber: "107", origin: "YYZ", destination: "YOW", hour: 7, minute: 0, durationMin: 60 },
  { airline: "AC", flightNumber: "108", origin: "YOW", destination: "YYZ", hour: 19, minute: 0, durationMin: 60 },
  { airline: "AC", flightNumber: "109", origin: "YYZ", destination: "YHZ", hour: 10, minute: 0, durationMin: 120 },
  { airline: "AC", flightNumber: "110", origin: "YHZ", destination: "YYZ", hour: 15, minute: 0, durationMin: 125 },
  { airline: "AC", flightNumber: "111", origin: "YVR", destination: "YYC", hour: 6, minute: 30, durationMin: 80 },
  { airline: "AC", flightNumber: "112", origin: "YYC", destination: "YVR", hour: 20, minute: 0, durationMin: 80 },
  { airline: "AC", flightNumber: "113", origin: "YYZ", destination: "YQB", hour: 8, minute: 45, durationMin: 85 },
  { airline: "AC", flightNumber: "114", origin: "YQB", destination: "YYZ", hour: 17, minute: 15, durationMin: 85 },
  { airline: "AC", flightNumber: "115", origin: "YYZ", destination: "YYT", hour: 9, minute: 30, durationMin: 160 },
  { airline: "AC", flightNumber: "116", origin: "YYT", destination: "YYZ", hour: 14, minute: 0, durationMin: 165 },
  { airline: "AC", flightNumber: "117", origin: "YYC", destination: "YEG", hour: 7, minute: 15, durationMin: 45 },
  { airline: "AC", flightNumber: "118", origin: "YEG", destination: "YYC", hour: 18, minute: 45, durationMin: 45 },
  { airline: "AC", flightNumber: "119", origin: "YYZ", destination: "YXE", hour: 11, minute: 0, durationMin: 210 },
  { airline: "AC", flightNumber: "120", origin: "YXE", destination: "YYZ", hour: 15, minute: 30, durationMin: 205 },
  { airline: "AC", flightNumber: "121", origin: "YYZ", destination: "YQR", hour: 12, minute: 15, durationMin: 190 },
  { airline: "AC", flightNumber: "122", origin: "YOW", destination: "YVR", hour: 8, minute: 0, durationMin: 300 },
  { airline: "AC", flightNumber: "123", origin: "YVR", destination: "YOW", hour: 21, minute: 0, durationMin: 290 },
  { airline: "AC", flightNumber: "124", origin: "YYZ", destination: "YFC", hour: 13, minute: 45, durationMin: 110 },
  { airline: "AC", flightNumber: "125", origin: "YVR", destination: "YYJ", hour: 7, minute: 30, durationMin: 25 },
  { airline: "AC", flightNumber: "126", origin: "YYJ", destination: "YVR", hour: 19, minute: 0, durationMin: 25 },
  { airline: "AC", flightNumber: "128", origin: "YFC", destination: "YYZ", hour: 16, minute: 30, durationMin: 110 },

  // WestJet — Calgary-hub network
  { airline: "WS", flightNumber: "201", origin: "YYC", destination: "YVR", hour: 7, minute: 0, durationMin: 80 },
  { airline: "WS", flightNumber: "202", origin: "YVR", destination: "YYC", hour: 19, minute: 0, durationMin: 80 },
  { airline: "WS", flightNumber: "203", origin: "YYC", destination: "YYZ", hour: 6, minute: 45, durationMin: 240 },
  { airline: "WS", flightNumber: "204", origin: "YYZ", destination: "YYC", hour: 17, minute: 30, durationMin: 235 },
  { airline: "WS", flightNumber: "205", origin: "YYC", destination: "YEG", hour: 9, minute: 0, durationMin: 45 },
  { airline: "WS", flightNumber: "206", origin: "YEG", destination: "YYC", hour: 20, minute: 15, durationMin: 45 },
  { airline: "WS", flightNumber: "207", origin: "YYC", destination: "YWG", hour: 11, minute: 30, durationMin: 110 },
  { airline: "WS", flightNumber: "208", origin: "YWG", destination: "YYC", hour: 16, minute: 0, durationMin: 105 },
  { airline: "WS", flightNumber: "209", origin: "YYC", destination: "YHZ", hour: 8, minute: 30, durationMin: 290 },
  { airline: "WS", flightNumber: "210", origin: "YYC", destination: "YOW", hour: 13, minute: 15, durationMin: 220 },
  { airline: "WS", flightNumber: "211", origin: "YVR", destination: "YYZ", hour: 7, minute: 15, durationMin: 285 },
  { airline: "WS", flightNumber: "212", origin: "YYZ", destination: "YVR", hour: 14, minute: 30, durationMin: 300 },
  { airline: "WS", flightNumber: "213", origin: "YYC", destination: "YQR", hour: 10, minute: 0, durationMin: 70 },
  { airline: "WS", flightNumber: "214", origin: "YYC", destination: "YXE", hour: 15, minute: 45, durationMin: 75 },
  { airline: "WS", flightNumber: "215", origin: "YHZ", destination: "YYC", hour: 7, minute: 30, durationMin: 290 },
  { airline: "WS", flightNumber: "217", origin: "YQR", destination: "YYC", hour: 13, minute: 0, durationMin: 70 },
  { airline: "WS", flightNumber: "218", origin: "YXE", destination: "YYC", hour: 18, minute: 30, durationMin: 75 },

  // Porter Airlines — Eastern Canada, Billy Bishop-focused
  { airline: "PD", flightNumber: "301", origin: "YTZ", destination: "YOW", hour: 8, minute: 30, durationMin: 65 },
  { airline: "PD", flightNumber: "302", origin: "YOW", destination: "YTZ", hour: 17, minute: 45, durationMin: 65 },
  { airline: "PD", flightNumber: "303", origin: "YTZ", destination: "YUL", hour: 9, minute: 0, durationMin: 65 },
  { airline: "PD", flightNumber: "304", origin: "YUL", destination: "YTZ", hour: 16, minute: 30, durationMin: 65 },
  { airline: "PD", flightNumber: "305", origin: "YTZ", destination: "YHZ", hour: 11, minute: 15, durationMin: 120 },
  { airline: "PD", flightNumber: "306", origin: "YHZ", destination: "YTZ", hour: 18, minute: 30, durationMin: 125 },
  { airline: "PD", flightNumber: "307", origin: "YTZ", destination: "YQB", hour: 12, minute: 45, durationMin: 90 },
  { airline: "PD", flightNumber: "308", origin: "YQB", destination: "YTZ", hour: 19, minute: 15, durationMin: 90 },
  { airline: "PD", flightNumber: "309", origin: "YOW", destination: "YHZ", hour: 14, minute: 0, durationMin: 110 },

  // Flair Airlines — ultra-low-cost leisure routes
  { airline: "F8", flightNumber: "401", origin: "YYZ", destination: "YWG", hour: 6, minute: 0, durationMin: 140 },
  { airline: "F8", flightNumber: "402", origin: "YWG", destination: "YYZ", hour: 21, minute: 30, durationMin: 135 },
  { airline: "F8", flightNumber: "403", origin: "YYZ", destination: "YEG", hour: 7, minute: 45, durationMin: 255 },
  { airline: "F8", flightNumber: "404", origin: "YEG", destination: "YYZ", hour: 16, minute: 0, durationMin: 250 },
  { airline: "F8", flightNumber: "405", origin: "YYC", destination: "YWG", hour: 10, minute: 30, durationMin: 110 },
  { airline: "F8", flightNumber: "406", origin: "YVR", destination: "YWG", hour: 13, minute: 0, durationMin: 165 },
  { airline: "F8", flightNumber: "407", origin: "YYZ", destination: "YHZ", hour: 19, minute: 0, durationMin: 120 },
  { airline: "F8", flightNumber: "408", origin: "YWG", destination: "YYC", hour: 14, minute: 30, durationMin: 110 },
];

const FARE_BASE = { SHORT: 99, MEDIUM: 169, LONG: 249, TRANSCON: 329 };

function tierFor(durationMin) {
  if (durationMin <= 60) return "SHORT";
  if (durationMin <= 150) return "MEDIUM";
  if (durationMin <= 260) return "LONG";
  return "TRANSCON";
}

// Fare structure varies by carrier the way it does in the real market:
// Air Canada and WestJet sell Economy + a premium cabin, Porter sells
// Economy + its "Reserve" premium-economy product, and ultra-low-cost
// Flair sells two Economy fare bundles instead of a premium cabin.
function buildFares(airlineCode, tier) {
  const eco = FARE_BASE[tier];
  switch (airlineCode) {
    case "AC":
      return [
        { cabinClass: "ECONOMY", fareCode: "ECOFLEX", basePrice: eco, refundable: false, seatsAvailable: 118 },
        { cabinClass: "BUSINESS", fareCode: "BIZFLEX", basePrice: Math.round(eco * 2.3), refundable: true, seatsAvailable: 16 },
      ];
    case "WS":
      return [
        { cabinClass: "ECONOMY", fareCode: "ECOSAVE", basePrice: Math.round(eco * 0.9), refundable: false, seatsAvailable: 140 },
        { cabinClass: "BUSINESS", fareCode: "PREMIUM", basePrice: Math.round(eco * 2.1), refundable: true, seatsAvailable: 12 },
      ];
    case "PD":
      return [
        { cabinClass: "ECONOMY", fareCode: "ECONOMY", basePrice: Math.round(eco * 1.05), refundable: false, seatsAvailable: 50 },
        { cabinClass: "PREMIUM_ECONOMY", fareCode: "RESERVE", basePrice: Math.round(eco * 1.7), refundable: true, seatsAvailable: 12 },
      ];
    case "F8":
      return [
        { cabinClass: "ECONOMY", fareCode: "BASIC", basePrice: Math.round(eco * 0.6), refundable: false, seatsAvailable: 160 },
        { cabinClass: "ECONOMY", fareCode: "STANDARD", basePrice: Math.round(eco * 0.85), refundable: true, seatsAvailable: 40 },
      ];
    default:
      return [{ cabinClass: "ECONOMY", fareCode: "ECONOMY", basePrice: eco, refundable: false, seatsAvailable: 100 }];
  }
}

function aircraftFor(airlineCode, tier) {
  if (airlineCode === "F8") return "Boeing 737 MAX 8";
  if (airlineCode === "PD") return tier === "SHORT" ? "De Havilland Dash 8-400" : "Embraer E195-E2";
  if (airlineCode === "WS") return tier === "SHORT" ? "De Havilland Dash 8-400" : "Boeing 737-800";
  if (tier === "TRANSCON") return "Airbus A321neo";
  if (tier === "LONG") return "Airbus A320";
  return "Airbus A220-300";
}

async function seedFlights(airportIdByCode, airlineIdByCode) {
  const flightRows = [];
  const legRefs = [];
  const now = new Date();

  for (const leg of ROUTE_LEGS) {
    for (let d = 1; d <= DAYS_AHEAD; d++) {
      const departureTime = new Date(now);
      departureTime.setDate(departureTime.getDate() + d);
      departureTime.setHours(leg.hour, leg.minute, 0, 0);
      const arrivalTime = new Date(departureTime.getTime() + leg.durationMin * 60000);
      const tier = tierFor(leg.durationMin);

      flightRows.push({
        airlineId: airlineIdByCode[leg.airline],
        flightNumber: leg.flightNumber,
        originAirportId: airportIdByCode[leg.origin],
        destinationAirportId: airportIdByCode[leg.destination],
        departureTime,
        arrivalTime,
        aircraftType: aircraftFor(leg.airline, tier),
      });
      legRefs.push(leg);
    }
  }

  const createdFlights = await prisma.flight.createManyAndReturn({ data: flightRows });
  const flightIdByKey = new Map(
    createdFlights.map((f) => [`${f.airlineId}|${f.flightNumber}|${f.departureTime.toISOString()}`, f.id])
  );

  const fareRows = [];
  flightRows.forEach((row, i) => {
    const key = `${row.airlineId}|${row.flightNumber}|${row.departureTime.toISOString()}`;
    const flightId = flightIdByKey.get(key);
    const leg = legRefs[i];
    const tier = tierFor(leg.durationMin);
    for (const fare of buildFares(leg.airline, tier)) {
      fareRows.push({ flightId, currency: "CAD", ...fare });
    }
  });

  await prisma.flightFare.createMany({ data: fareRows });
  return { flights: createdFlights.length, fares: fareRows.length };
}

async function main() {
  // Clear previously seeded rows, children before parents, so this script
  // is safe to re-run against a dev database.
  await prisma.flightFare.deleteMany();
  await prisma.flight.deleteMany();
  await prisma.hotelRatePlan.deleteMany();
  await prisma.hotelRoom.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.airline.deleteMany();
  await prisma.airport.deleteMany();
  await prisma.insurancePlan.deleteMany();

  await prisma.insurancePlan.createMany({ data: insurancePlans });

  const createdAirports = await prisma.airport.createManyAndReturn({ data: airports });
  const airportIdByCode = Object.fromEntries(createdAirports.map((a) => [a.iataCode, a.id]));

  const createdAirlines = await prisma.airline.createManyAndReturn({ data: airlines });
  const airlineIdByCode = Object.fromEntries(createdAirlines.map((a) => [a.iataCode, a.id]));

  const supplierIdByName = {};
  for (const supplier of suppliers) {
    const created = await prisma.supplier.create({ data: supplier });
    supplierIdByName[supplier.name] = created.id;
  }

  for (const h of hotels) {
    const hotel = await prisma.hotel.create({
      data: {
        supplierId: supplierIdByName[h.supplierName],
        name: h.name,
        address: h.address,
        city: h.city,
        country: h.country,
        latitude: h.lat,
        longitude: h.long,
        starRating: h.starRating,
      },
    });

    const tiers = ROOM_TIERS[h.starRating] ?? ROOM_TIERS[4.0];
    for (const tier of tiers) {
      const room = await prisma.hotelRoom.create({
        data: {
          hotelId: hotel.id,
          roomType: tier.roomType,
          maxOccupancy: tier.maxOccupancy,
          basePrice: tier.basePrice,
          currency: "CAD",
        },
      });

      await prisma.hotelRatePlan.createMany({
        data: [
          { roomId: room.id, rateCode: "FLEX", refundable: true, cancellationDeadline: null, price: tier.basePrice },
          { roomId: room.id, rateCode: "ADV", refundable: false, cancellationDeadline: null, price: Math.round(tier.basePrice * 0.88) },
        ],
      });
    }
  }

  const flightSummary = await seedFlights(airportIdByCode, airlineIdByCode);

  console.log(
    `Seeded ${airports.length} airports, ${airlines.length} airlines, ${suppliers.length} suppliers, ` +
      `${hotels.length} hotels (with rooms + rate plans), ${insurancePlans.length} insurance plans, and ` +
      `${flightSummary.flights} flights (${flightSummary.fares} fares) over the next ${DAYS_AHEAD} days.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
