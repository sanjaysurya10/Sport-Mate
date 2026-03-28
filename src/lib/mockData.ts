export const MOCK_USER_PLAYER = {
  id: "u1",
  name: "Ciarán Murphy",
  email: "ciaran@example.com",
  role: "player",
  city: "Dublin",
  turfCoins: 120,
};

export const MOCK_USER_OWNER = {
  id: "u2",
  name: "Siobhán Kelly",
  email: "siobhan@example.com",
  role: "owner",
  city: "Cork",
};

export const MOCK_VENUES = [
  {
    id: "v1",
    name: "UCD Bowl",
    address: "University College Dublin, Belfield",
    city: "Dublin",
    description: "One of Dublin's finest multi-sport facilities with floodlit astro pitches.",
    pricePerHour: 45,
    sports: ["Football", "Rugby", "GAA"],
    facilities: ["Floodlights", "Changing rooms", "Parking", "Café"],
    photos: ["https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80"],
    rating: 4.7,
    reviewCount: 84,
  },
  {
    id: "v2",
    name: "Irishtown Stadium",
    address: "Irishtown, Dublin 4",
    city: "Dublin",
    description: "Classic Dublin venue with full-size pitches and excellent facilities.",
    pricePerHour: 38,
    sports: ["Football", "Athletics"],
    facilities: ["Floodlights", "Changing rooms", "Parking"],
    photos: ["https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80"],
    rating: 4.4,
    reviewCount: 61,
  },
  {
    id: "v3",
    name: "MTU Sports Arena",
    address: "Bishopstown, Cork",
    city: "Cork",
    description: "Modern indoor and outdoor facilities in the heart of Cork.",
    pricePerHour: 35,
    sports: ["Basketball", "Badminton", "Tennis"],
    facilities: ["Changing rooms", "Equipment hire", "Café"],
    photos: ["https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80"],
    rating: 4.5,
    reviewCount: 49,
  },
  {
    id: "v4",
    name: "UL Sports Arena",
    address: "University of Limerick, Limerick",
    city: "Limerick",
    description: "State-of-the-art arena with courts for every sport.",
    pricePerHour: 30,
    sports: ["Basketball", "Tennis", "Badminton", "Football"],
    facilities: ["Floodlights", "Changing rooms", "Parking", "Equipment hire"],
    photos: ["https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80"],
    rating: 4.8,
    reviewCount: 112,
  },
  {
    id: "v5",
    name: "Eamonn Deacy Park",
    address: "Terryland, Galway",
    city: "Galway",
    description: "Galway's premier venue for football and GAA.",
    pricePerHour: 40,
    sports: ["Football", "GAA"],
    facilities: ["Floodlights", "Changing rooms", "Parking"],
    photos: ["https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=800&q=80"],
    rating: 4.3,
    reviewCount: 37,
  },
  {
    id: "v6",
    name: "The Valley",
    address: "Milltown, Dublin 6",
    city: "Dublin",
    description: "Compact astro venue perfect for 5-a-side and casual games.",
    pricePerHour: 28,
    sports: ["Football"],
    facilities: ["Floodlights", "Changing rooms"],
    photos: ["https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=800&q=80"],
    rating: 4.1,
    reviewCount: 28,
  },
];

export const MOCK_GAMES = [
  { id: "g1", sport: "Football", hostName: "Darragh O'Brien", venueName: "UCD Bowl", venueId: "v1", date: "Sat 15 Mar", time: "6:00 PM", spotsTotal: 10, spotsFilled: 7, costPerPlayer: 6, city: "Dublin" },
  { id: "g2", sport: "Basketball", hostName: "Aoife Brennan", venueName: "MTU Sports Arena", venueId: "v3", date: "Sun 16 Mar", time: "11:00 AM", spotsTotal: 8, spotsFilled: 3, costPerPlayer: 5, city: "Cork" },
  { id: "g3", sport: "Tennis", hostName: "Pádraig Walsh", venueName: "UL Sports Arena", venueId: "v4", date: "Sat 15 Mar", time: "9:00 AM", spotsTotal: 4, spotsFilled: 2, costPerPlayer: 8, city: "Limerick" },
  { id: "g4", sport: "GAA", hostName: "Niamh Fitzgerald", venueName: "Eamonn Deacy Park", venueId: "v5", date: "Sun 16 Mar", time: "2:00 PM", spotsTotal: 15, spotsFilled: 9, costPerPlayer: 4, city: "Galway" },
  { id: "g5", sport: "Badminton", hostName: "Eoin McCarthy", venueName: "MTU Sports Arena", venueId: "v3", date: "Mon 17 Mar", time: "7:00 PM", spotsTotal: 6, spotsFilled: 5, costPerPlayer: 7, city: "Cork" },
  { id: "g6", sport: "Football", hostName: "Roisín Doyle", venueName: "The Valley", venueId: "v6", date: "Tue 18 Mar", time: "8:00 PM", spotsTotal: 10, spotsFilled: 6, costPerPlayer: 5, city: "Dublin" },
];

export const MOCK_SLOTS = {};

export const MOCK_BOOKINGS = [
  { id: "b1", venueId: "v1", venueName: "UCD Bowl", sport: "Football", date: "2026-03-20", hour: 18, displayDate: "Fri 20 Mar", displayTime: "6:00 PM", amount: 45, status: "confirmed" },
  { id: "b2", venueId: "v3", venueName: "MTU Sports Arena", sport: "Basketball", date: "2026-03-22", hour: 10, displayDate: "Sun 22 Mar", displayTime: "10:00 AM", amount: 35, status: "confirmed" },
  { id: "b3", venueId: "v4", venueName: "UL Sports Arena", sport: "Tennis", date: "2026-02-14", hour: 9, displayDate: "Sat 14 Feb", displayTime: "9:00 AM", amount: 30, status: "confirmed" },
  { id: "b4", venueId: "v2", venueName: "Irishtown Stadium", sport: "Football", date: "2026-02-05", hour: 20, displayDate: "Thu 5 Feb", displayTime: "8:00 PM", amount: 38, status: "cancelled" },
];

export const MOCK_NOTIFICATIONS = [
  { id: "n1", message: "Your booking at UCD Bowl on Fri 20 Mar was confirmed.", type: "booking", read: false, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: "n2", message: "Your booking at MTU Sports Arena on Sun 22 Mar was confirmed.", type: "booking", read: false, createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) },
  { id: "n3", message: "Reminder: You have a game at UCD Bowl tomorrow at 6:00 PM.", type: "reminder", read: true, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { id: "n4", message: "Your booking at Irishtown Stadium was cancelled. Refund pending.", type: "cancellation", read: true, createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
];

export const MOCK_WEATHER = {
  temp: 11,
  condition: "Partly cloudy",
  icon: "⛅",
  label: "Cloudy but playable",
};

export const MOCK_ADMIN_STATS = {
  totalUsers: 1284,
  totalBookings: 3847,
  activeVenues: 62,
  revenueThisMonth: 14320,
};

export const MOCK_ADMIN_USERS = [
  { id: "u1", name: "Ciarán Murphy", email: "ciaran@example.com", role: "player", city: "Dublin", joined: "Jan 2026", status: "active" },
  { id: "u2", name: "Siobhán Kelly", email: "siobhan@example.com", role: "owner", city: "Cork", joined: "Dec 2025", status: "active" },
  { id: "u3", name: "Darragh O'Brien", email: "darragh@example.com", role: "player", city: "Galway", joined: "Feb 2026", status: "active" },
  { id: "u4", name: "Aoife Brennan", email: "aoife@example.com", role: "player", city: "Limerick", joined: "Jan 2026", status: "suspended" },
  { id: "u5", name: "Pádraig Walsh", email: "padraig@example.com", role: "owner", city: "Dublin", joined: "Nov 2025", status: "active" },
  { id: "u6", name: "Niamh Fitzgerald", email: "niamh@example.com", role: "player", city: "Waterford", joined: "Mar 2026", status: "active" },
];

export const MOCK_ADMIN_BOOKINGS = [
  { id: "b1", player: "Ciarán Murphy", venue: "UCD Bowl", date: "20 Mar 2026", time: "6:00 PM", sport: "Football", amount: 45, status: "confirmed" },
  { id: "b2", player: "Aoife Brennan", venue: "MTU Sports Arena", date: "22 Mar 2026", time: "10:00 AM", sport: "Basketball", amount: 35, status: "confirmed" },
  { id: "b3", player: "Darragh O'Brien", venue: "Eamonn Deacy Park", date: "16 Mar 2026", time: "2:00 PM", sport: "GAA", amount: 40, status: "cancelled" },
  { id: "b4", player: "Niamh Fitzgerald", venue: "UL Sports Arena", date: "15 Mar 2026", time: "9:00 AM", sport: "Tennis", amount: 30, status: "confirmed" },
  { id: "b5", player: "Pádraig Walsh", venue: "The Valley", date: "18 Mar 2026", time: "8:00 PM", sport: "Football", amount: 28, status: "confirmed" },
];

export const MOCK_BOOKINGS_CHART = [
  { day: "Mon", count: 18 }, { day: "Tue", count: 24 }, { day: "Wed", count: 31 },
  { day: "Thu", count: 22 }, { day: "Fri", count: 45 }, { day: "Sat", count: 62 },
  { day: "Sun", count: 57 },
];

export const SPORT_ICONS: Record<string, string> = {
  Football: "⚽", Basketball: "🏀", Tennis: "🎾",
  Badminton: "🏸", Cricket: "🏏", Rugby: "🏉", GAA: "🥍",
};
