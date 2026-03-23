import { motion, AnimatePresence } from "framer-motion";
import { PokerCard } from "./PokerCard";
import type { DeckConfig } from "@/lib/poker";

interface CardDeckProps {
  deck: DeckConfig;
  selectedCard: string | null;
  onSelectCard: (value: string) => void;
  disabled?: boolean;
}

export function CardDeck({ deck, selectedCard, onSelectCard, disabled = false }: CardDeckProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{deck.icon}</span>
        <span className="text-sm font-medium text-muted-foreground">{deck.name}</span>
      </div>
      <motion.div
        className="flex flex-wrap justify-center gap-2 sm:gap-3"
        layout
      >
        <AnimatePresence mode="popLayout">
          {deck.cards.map((card, i) => (
            <motion.div
              key={card}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
            >
              <PokerCard
                value={card}
                isSelected={selectedCard === card}
                onClick={() => onSelectCard(card)}
                size="lg"
                disabled={disabled}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
