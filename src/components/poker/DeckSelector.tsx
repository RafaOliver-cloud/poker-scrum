import { DECK_PRESETS, type DeckType } from "@/lib/poker";
import { motion } from "framer-motion";

interface DeckSelectorProps {
  selected: DeckType;
  onSelect: (deck: DeckType) => void;
}

export function DeckSelector({ selected, onSelect }: DeckSelectorProps) {
  const decks = Object.values(DECK_PRESETS).filter(d => d.id !== 'custom');

  return (
    <div className="flex flex-wrap gap-2">
      {decks.map(deck => (
        <motion.button
          key={deck.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(deck.id)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium
            border transition-colors duration-200
            ${selected === deck.id
              ? "bg-primary text-primary-foreground border-primary glow-primary-sm"
              : "bg-card border-border text-card-foreground hover:border-primary/50"
            }
          `}
        >
          <span className="mr-1.5">{deck.icon}</span>
          {deck.name}
        </motion.button>
      ))}
    </div>
  );
}
