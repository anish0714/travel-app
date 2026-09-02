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

async function main() {
  // Clear previously seeded rows, children before parents, so this script
  // is safe to re-run against a dev database.
  await prisma.hotelRatePlan.deleteMany();
  await prisma.hotelRoom.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.airport.deleteMany();

  await prisma.airport.createMany({ data: airports });

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

  console.log(`Seeded ${airports.length} airports, ${suppliers.length} suppliers, and ${hotels.length} hotels (with rooms + rate plans).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
