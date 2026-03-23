export type DeckType = 'fibonacci' | 'tshirt' | 'powers2' | 'custom';

export interface DeckConfig {
  id: DeckType;
  name: string;
  cards: string[];
  icon: string;
}

export const DECK_PRESETS: Record<DeckType, DeckConfig> = {
  fibonacci: {
    id: 'fibonacci',
    name: 'Fibonacci',
    cards: ['0', '1', '2', '3', '5', '8', '13', '21', '?', '☕'],
    icon: '🔢',
  },
  tshirt: {
    id: 'tshirt',
    name: 'T-Shirt',
    cards: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?', '☕'],
    icon: '👕',
  },
  powers2: {
    id: 'powers2',
    name: 'Powers of 2',
    cards: ['0', '1', '2', '4', '8', '16', '32', '64', '?', '☕'],
    icon: '⚡',
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    cards: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    icon: '✏️',
  },
};

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  vote: string | null;
  isOnline: boolean;
  isObserver: boolean;
  isFacilitator: boolean;
}

export interface RoomState {
  id: string;
  name: string;
  deck: DeckConfig;
  participants: Participant[];
  isRevealed: boolean;
  currentIssue: string;
  round: number;
}

export interface VoteStats {
  average: number | null;
  median: number | null;
  mode: string | null;
  agreement: number;
  hasDiscrepancy: boolean;
}

export function calculateStats(participants: Participant[], deck: DeckConfig): VoteStats {
  const votes = participants
    .filter(p => !p.isObserver && p.vote && p.vote !== '?' && p.vote !== '☕')
    .map(p => p.vote!);

  if (votes.length === 0) {
    return { average: null, median: null, mode: null, agreement: 0, hasDiscrepancy: false };
  }

  const numericVotes = votes.map(Number).filter(n => !isNaN(n));

  const average = numericVotes.length > 0
    ? Math.round((numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length) * 10) / 10
    : null;

  const sorted = [...numericVotes].sort((a, b) => a - b);
  const median = numericVotes.length > 0
    ? sorted.length % 2 === 0
      ? Math.round(((sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2) * 10) / 10
      : sorted[Math.floor(sorted.length / 2)]
    : null;

  const freq: Record<string, number> = {};
  votes.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
  const maxFreq = Math.max(...Object.values(freq));
  const mode = Object.entries(freq).find(([, f]) => f === maxFreq)?.[0] || null;

  const uniqueVotes = new Set(votes);
  const agreement = Math.round((maxFreq / votes.length) * 100);

  const hasDiscrepancy = numericVotes.length >= 2 &&
    (Math.max(...numericVotes) - Math.min(...numericVotes)) > (average || 0) * 0.8;

  return { average, median, mode, agreement, hasDiscrepancy };
}

const AVATARS = ['🦊', '🐱', '🐶', '🐼', '🦁', '🐸', '🐵', '🦄', '🐲', '🐺', '🦅', '🐙'];
const NAMES = ['Alice', 'Bruno', 'Carol', 'Diego', 'Elena', 'Felipe', 'Gabi', 'Hugo', 'Iris', 'João', 'Karen', 'Leo'];

export function generateMockParticipants(count: number, withVotes = false, deck?: DeckConfig): Participant[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `p-${i}`,
    name: NAMES[i % NAMES.length],
    avatar: AVATARS[i % AVATARS.length],
    vote: withVotes && i > 0 ? (deck?.cards[Math.floor(Math.random() * (deck.cards.length - 2))] || '5') : null,
    isOnline: Math.random() > 0.1,
    isObserver: i === count - 1 && count > 3,
    isFacilitator: i === 0,
  }));
}
