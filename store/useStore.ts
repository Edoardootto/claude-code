import { create } from 'zustand';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Player {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  location: string;
  rating: number;
  gamesPlayed: number;
  showUpRate: number;
  sports: { name: string; level: number }[];
  verified?: boolean;
  online?: boolean;
  compatibility?: number;
  points?: number;
  bio?: string;
}

export interface Game {
  id: string;
  sport: string;
  format: string;
  title: string;
  location: string;
  locationDetail: string;
  dateDay: string;
  dateMonth: string;
  time: string;
  duration: string;
  description: string;
  playersJoined: number;
  playersMax: number;
  players: Player[];
  hostId: string;
  skill: string;
  weather: { temp: string; condition: string; wind: string; rainPct: number };
  latitude: number;
  longitude: number;
  joined: boolean;
}

export interface Activity {
  id: string;
  userId: string;
  type: 'rated' | 'joined' | 'hosting' | 'badge';
  text: string;
  time: string;
  hasBadge?: boolean;
}

export interface PendingRating {
  gameId: string;
  gameTitle: string;
  sport: string;
  location: string;
  daysAgo: number;
  playerCount: number;
  players: Player[];
  iconColor: 'coral' | 'blue' | 'green';
  isNew?: boolean;
}

export interface PastRating {
  id: string;
  gameTitle: string;
  playerCount: number;
  daysAgo: number;
  stars: number;
  sport: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  name: string;
  gameId?: string;
  isGroup: boolean;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  messages: Message[];
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const PLAYERS: Player[] = [
  {
    id: 'jordan',
    name: 'Jordan P.',
    handle: '@jordanp',
    avatar: 'https://i.pravatar.cc/200?img=11',
    location: 'Brooklyn, NY',
    rating: 4.9,
    gamesPlayed: 28,
    showUpRate: 97,
    sports: [{ name: 'Basketball', level: 4.5 }],
    verified: true,
    online: true,
    compatibility: 89,
    points: 2610,
    bio: 'High-energy player, always up for a run. Team-first mentality.',
  },
  {
    id: 'maya',
    name: 'Maya Rivera',
    handle: '@mayarivera',
    avatar: 'https://i.pravatar.cc/200?img=5',
    location: 'Brooklyn, NY',
    rating: 4.9,
    gamesPlayed: 32,
    showUpRate: 98,
    sports: [
      { name: 'Tennis', level: 4.5 },
      { name: 'Running', level: 3.0 },
      { name: 'Basketball', level: 3.5 },
    ],
    verified: true,
    online: true,
    compatibility: 96,
    points: 2840,
    bio: 'Multi-sport enthusiast who believes great teams make great games.',
  },
  {
    id: 'sam',
    name: 'Sam Chen',
    handle: '@samchen',
    avatar: 'https://i.pravatar.cc/200?img=33',
    location: 'Manhattan, NY',
    rating: 4.6,
    gamesPlayed: 25,
    showUpRate: 95,
    sports: [
      { name: 'Soccer', level: 4.0 },
      { name: 'Cycling', level: 3.5 },
    ],
    online: false,
    compatibility: 84,
    points: 2380,
    bio: 'Consistent player, never misses a game.',
  },
  {
    id: 'priya',
    name: 'Priya S.',
    handle: '@priyas',
    avatar: 'https://i.pravatar.cc/200?img=16',
    location: 'Queens, NY',
    rating: 4.7,
    gamesPlayed: 22,
    showUpRate: 94,
    sports: [{ name: 'Volleyball', level: 3.5 }],
    online: false,
    compatibility: 78,
    points: 2110,
    bio: 'Volleyball player who loves outdoor sessions.',
  },
  {
    id: 'leo',
    name: 'Leo M.',
    handle: '@leom',
    avatar: 'https://i.pravatar.cc/200?img=60',
    location: 'Bronx, NY',
    rating: 4.5,
    gamesPlayed: 17,
    showUpRate: 91,
    sports: [{ name: 'Basketball', level: 3.5 }],
    online: false,
    compatibility: 72,
    points: 1680,
  },
  {
    id: 'eva',
    name: 'Eva D.',
    handle: '@evad',
    avatar: 'https://i.pravatar.cc/200?img=45',
    location: 'Brooklyn, NY',
    rating: 4.8,
    gamesPlayed: 15,
    showUpRate: 99,
    sports: [{ name: 'Tennis', level: 4.0 }],
    online: true,
    compatibility: 68,
    points: 1510,
  },
  {
    id: 'tom',
    name: 'Tom W.',
    handle: '@tomw',
    avatar: 'https://i.pravatar.cc/200?img=52',
    location: 'Staten Island, NY',
    rating: 4.4,
    gamesPlayed: 13,
    showUpRate: 88,
    sports: [{ name: 'Tennis', level: 3.5 }],
    online: false,
    compatibility: 61,
    points: 1290,
  },
  {
    id: 'nora',
    name: 'Nora K.',
    handle: '@norak',
    avatar: 'https://i.pravatar.cc/200?img=23',
    location: 'Brooklyn, NY',
    rating: 4.6,
    gamesPlayed: 11,
    showUpRate: 93,
    sports: [{ name: 'Soccer', level: 3.0 }],
    online: false,
    compatibility: 55,
    points: 980,
  },
];

const CURRENT_USER: Player = {
  id: 'alex',
  name: 'Alex',
  handle: '@alex',
  avatar: 'https://i.pravatar.cc/200?img=8',
  location: 'Brooklyn, NY',
  rating: 4.8,
  gamesPlayed: 19,
  showUpRate: 92,
  sports: [
    { name: 'Basketball', level: 4.0 },
    { name: 'Tennis', level: 3.5 },
  ],
  verified: true,
  online: true,
  points: 1920,
};

const SEED_GAMES: Game[] = [
  {
    id: 'game-1',
    sport: 'Basketball',
    format: '5v5',
    title: 'Riverside Court pickup',
    location: 'Riverside Park',
    locationDetail: 'Court 3 · 0.8 mi',
    dateDay: '23',
    dateMonth: 'APR',
    time: '6:30 PM',
    duration: '90 min',
    description: 'Casual full-court 5v5. We rotate teams every two games to keep it fresh. First-timers welcome — bring a light and dark shirt, water, and your game face. Court lights stay on until 8:30.',
    playersJoined: 8,
    playersMax: 10,
    players: PLAYERS.slice(0, 8),
    hostId: 'jordan',
    skill: 'Intermediate',
    weather: { temp: '72°', condition: 'Partly cloudy', wind: '8mph', rainPct: 0 },
    latitude: 40.7820,
    longitude: -73.9828,
    joined: true,
  },
  {
    id: 'game-2',
    sport: 'Soccer',
    format: '7v7',
    title: 'Morning kickaround',
    location: 'Downtown Fields',
    locationDetail: 'Field B · 1.2 mi',
    dateDay: '25',
    dateMonth: 'APR',
    time: '7:00 AM',
    duration: '60 min',
    description: 'Relaxed 7-a-side on the turf. All levels welcome. We keep score but it\'s mostly about the workout. Bring your own water.',
    playersJoined: 9,
    playersMax: 14,
    players: PLAYERS.slice(2, 9),
    hostId: 'sam',
    skill: 'All levels',
    weather: { temp: '64°', condition: 'Clear', wind: '5mph', rainPct: 0 },
    latitude: 40.7128,
    longitude: -74.0060,
    joined: true,
  },
  {
    id: 'game-3',
    sport: 'Tennis',
    format: 'Doubles',
    title: 'Evening doubles w/ Maya',
    location: 'Oak Courts',
    locationDetail: 'Court 2 · 0.4 mi',
    dateDay: '26',
    dateMonth: 'APR',
    time: '5:30 PM',
    duration: '90 min',
    description: 'Competitive doubles match. Looking for players around 3.5–4.5. Hit me up if you want to join.',
    playersJoined: 4,
    playersMax: 4,
    players: [PLAYERS[1], PLAYERS[5], PLAYERS[6], CURRENT_USER],
    hostId: 'maya',
    skill: '3.5 – 4.5',
    weather: { temp: '70°', condition: 'Sunny', wind: '4mph', rainPct: 0 },
    latitude: 40.7282,
    longitude: -73.7949,
    joined: true,
  },
  // Map-only games (not joined)
  {
    id: 'game-4',
    sport: 'Basketball',
    format: '3v3',
    title: 'Prospect Park 3v3',
    location: 'Prospect Park',
    locationDetail: 'Court 1 · 2.1 mi',
    dateDay: '22',
    dateMonth: 'APR',
    time: '5:00 PM',
    duration: '60 min',
    description: 'Quick 3v3 games. Bring your A-game.',
    playersJoined: 4,
    playersMax: 6,
    players: PLAYERS.slice(0, 4),
    hostId: 'leo',
    skill: 'Intermediate',
    weather: { temp: '68°', condition: 'Sunny', wind: '6mph', rainPct: 0 },
    latitude: 40.6602,
    longitude: -73.9690,
    joined: false,
  },
  {
    id: 'game-5',
    sport: 'Soccer',
    format: '5v5',
    title: 'Central Park Sunday Soccer',
    location: 'Central Park',
    locationDetail: 'Great Lawn · 3.2 mi',
    dateDay: '22',
    dateMonth: 'APR',
    time: '10:00 AM',
    duration: '90 min',
    description: 'Friendly 5v5, mixed levels. Just show up and play.',
    playersJoined: 7,
    playersMax: 10,
    players: PLAYERS.slice(1, 5),
    hostId: 'sam',
    skill: 'Beginner',
    weather: { temp: '66°', condition: 'Clear', wind: '4mph', rainPct: 0 },
    latitude: 40.7812,
    longitude: -73.9665,
    joined: false,
  },
  {
    id: 'game-6',
    sport: 'Tennis',
    format: 'Singles',
    title: 'Riverside Tennis Ladder',
    location: 'Riverside Park',
    locationDetail: 'Courts · 0.9 mi',
    dateDay: '23',
    dateMonth: 'APR',
    time: '8:00 AM',
    duration: '60 min',
    description: 'Singles ladder format, round-robin style.',
    playersJoined: 5,
    playersMax: 8,
    players: PLAYERS.slice(1, 6),
    hostId: 'eva',
    skill: '3.0 – 4.5',
    weather: { temp: '65°', condition: 'Overcast', wind: '7mph', rainPct: 10 },
    latitude: 40.7850,
    longitude: -73.9860,
    joined: false,
  },
  {
    id: 'game-7',
    sport: 'Volleyball',
    format: '4v4',
    title: 'Beach Volleyball',
    location: 'Brighton Beach',
    locationDetail: 'Sand courts · 4.5 mi',
    dateDay: '24',
    dateMonth: 'APR',
    time: '2:00 PM',
    duration: '120 min',
    description: 'Sand volleyball, all levels welcome.',
    playersJoined: 6,
    playersMax: 8,
    players: PLAYERS.slice(3, 7),
    hostId: 'priya',
    skill: 'All levels',
    weather: { temp: '75°', condition: 'Sunny', wind: '10mph', rainPct: 0 },
    latitude: 40.5773,
    longitude: -73.9590,
    joined: false,
  },
  {
    id: 'game-8',
    sport: 'Running',
    format: 'Group run',
    title: 'Brooklyn Bridge Run',
    location: 'Brooklyn Bridge',
    locationDetail: 'DUMBO start · 1.8 mi',
    dateDay: '25',
    dateMonth: 'APR',
    time: '7:00 AM',
    duration: '45 min',
    description: '5k morning group run across the bridge.',
    playersJoined: 12,
    playersMax: 20,
    players: PLAYERS.slice(0, 5),
    hostId: 'nora',
    skill: 'All paces',
    weather: { temp: '58°', condition: 'Clear', wind: '3mph', rainPct: 0 },
    latitude: 40.7061,
    longitude: -73.9969,
    joined: false,
  },
];

const ACTIVITIES: Activity[] = [
  { id: 'a1', userId: 'maya', type: 'rated', text: 'Maya rated you 5 stars after Friday\'s match', time: '2 hours ago', hasBadge: true },
  { id: 'a2', userId: 'jordan', type: 'joined', text: 'Jordan joined your Sunset Court Pickup', time: '4 hours ago' },
  { id: 'a3', userId: 'sam', type: 'hosting', text: 'Sam is hosting a new soccer game nearby', time: 'Yesterday' },
  { id: 'a4', userId: 'priya', type: 'badge', text: 'Priya unlocked the Regular badge · 10 games', time: 'Yesterday' },
];

const INITIAL_PENDING: PendingRating[] = [
  {
    gameId: 'pending-1',
    gameTitle: 'Friday Pickup Ball',
    sport: 'Basketball',
    location: 'Riverside Park',
    daysAgo: 2,
    playerCount: 7,
    players: PLAYERS.slice(0, 7),
    iconColor: 'coral',
    isNew: true,
  },
  {
    gameId: 'pending-2',
    gameTitle: 'Doubles w/ Maya & Tom',
    sport: 'Tennis',
    location: 'Oak Courts',
    daysAgo: 4,
    playerCount: 3,
    players: PLAYERS.slice(1, 4),
    iconColor: 'blue',
    isNew: false,
  },
];

const INITIAL_PAST: PastRating[] = [
  { id: 'past-1', gameTitle: 'Monday Night Hoops', playerCount: 8, daysAgo: 5, stars: 4, sport: 'Basketball' },
  { id: 'past-2', gameTitle: 'Weekend Soccer Meetup', playerCount: 11, daysAgo: 7, stars: 5, sport: 'Soccer' },
  { id: 'past-3', gameTitle: 'Tennis Social Night', playerCount: 5, daysAgo: 14, stars: 3, sport: 'Tennis' },
];

const INITIAL_THREADS: ChatThread[] = [
  {
    id: 'thread-game-1',
    name: 'Riverside Court pickup',
    gameId: 'game-1',
    isGroup: true,
    participants: ['alex', 'jordan', 'maya'],
    lastMessage: 'Jordan: See you at 6:30! 🏀',
    lastMessageTime: '2h ago',
    unread: 2,
    messages: [
      { id: 'm1', senderId: 'jordan', text: 'Lineup confirmed for tonight.', timestamp: '4:00 PM' },
      { id: 'm2', senderId: 'maya', text: 'I\'ll bring the water bottles.', timestamp: '4:15 PM' },
      { id: 'm3', senderId: 'jordan', text: 'See you at 6:30! 🏀', timestamp: '4:20 PM' },
    ],
  },
];

// ─── Toast ────────────────────────────────────────────────────────────────────

let _toast: ((msg: string, type?: 'success' | 'info') => void) | null = null;
export const registerToast = (cb: typeof _toast) => { _toast = cb; };
export const showToast = (msg: string, type: 'success' | 'info' = 'success') => _toast?.(msg, type);

// ─── Store ────────────────────────────────────────────────────────────────────

export interface RatingPayload {
  overall: number;
  attributes: string[];
  attended: boolean;
  playerRatings: Record<string, number>;
}

interface AppState {
  currentUser: Player;
  allPlayers: Player[];
  allGames: Game[];
  activities: Activity[];
  pendingRatings: PendingRating[];
  pastRatings: PastRating[];
  chatThreads: ChatThread[];
  userPoints: number;

  joinGame: (gameId: string) => void;
  leaveGame: (gameId: string) => void;
  submitRating: (gameId: string, payload: RatingPayload) => void;
  createGame: (data: Partial<Game>) => string;
  sendMessage: (threadId: string, text: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: CURRENT_USER,
  allPlayers: PLAYERS,
  allGames: SEED_GAMES,
  activities: ACTIVITIES,
  pendingRatings: INITIAL_PENDING,
  pastRatings: INITIAL_PAST,
  chatThreads: INITIAL_THREADS,
  userPoints: 1920,

  joinGame: (gameId) => {
    const game = get().allGames.find((g) => g.id === gameId);
    if (!game || game.joined) return;
    set((s) => ({
      allGames: s.allGames.map((g) =>
        g.id === gameId ? { ...g, joined: true, playersJoined: g.playersJoined + 1 } : g
      ),
    }));
    showToast("You're in! 🎉");
  },

  leaveGame: (gameId) => {
    const game = get().allGames.find((g) => g.id === gameId);
    if (!game || !game.joined) return;
    set((s) => ({
      allGames: s.allGames.map((g) =>
        g.id === gameId ? { ...g, joined: false, playersJoined: Math.max(0, g.playersJoined - 1) } : g
      ),
    }));
    showToast(`Left ${game.title}`, 'info');
  },

  submitRating: (gameId, payload) => {
    const pending = get().pendingRatings.find((p) => p.gameId === gameId);
    if (!pending) return;

    const newPast: PastRating = {
      id: `past-${Date.now()}`,
      gameTitle: pending.gameTitle,
      playerCount: pending.playerCount,
      daysAgo: pending.daysAgo,
      stars: payload.overall,
      sport: pending.sport,
    };

    set((s) => ({
      pendingRatings: s.pendingRatings.filter((p) => p.gameId !== gameId),
      pastRatings: [newPast, ...s.pastRatings],
      userPoints: s.userPoints + 80,
    }));
    showToast('Rating submitted · +80 pts earned 🏆');
  },

  createGame: (data) => {
    const id = `game-${Date.now()}`;
    const newGame: Game = {
      id,
      sport: data.sport ?? 'Basketball',
      format: data.format ?? '5v5',
      title: data.title ?? 'New Game',
      location: data.location ?? 'TBD',
      locationDetail: data.locationDetail ?? '',
      dateDay: data.dateDay ?? '22',
      dateMonth: data.dateMonth ?? 'APR',
      time: data.time ?? '6:00 PM',
      duration: data.duration ?? '90 min',
      description: data.description ?? '',
      playersJoined: 1,
      playersMax: data.playersMax ?? 10,
      players: [get().currentUser],
      hostId: 'alex',
      skill: data.skill ?? 'All levels',
      weather: { temp: '70°', condition: 'Clear', wind: '5mph', rainPct: 0 },
      latitude: 40.7128,
      longitude: -74.0060,
      joined: true,
    };
    set((s) => ({
      allGames: [...s.allGames, newGame],
      userPoints: s.userPoints + 50,
    }));
    showToast('Your game is live 🎉');
    return id;
  },

  sendMessage: (threadId, text) => {
    const msg: Message = { id: `m-${Date.now()}`, senderId: 'alex', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    set((s) => ({
      chatThreads: s.chatThreads.map((t) =>
        t.id === threadId
          ? { ...t, messages: [...t.messages, msg], lastMessage: `You: ${text}`, lastMessageTime: 'Now', unread: 0 }
          : t
      ),
    }));
  },
}));
