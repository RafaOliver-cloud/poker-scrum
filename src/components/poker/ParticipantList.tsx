import { motion, AnimatePresence } from "framer-motion";
import type { Participant } from "@/lib/poker";
import { PokerCard } from "./PokerCard";

interface ParticipantListProps {
  participants: Participant[];
  isRevealed: boolean;
}

export function ParticipantList({ participants, isRevealed }: ParticipantListProps) {
  const voters = participants.filter(p => !p.isObserver);
  const observers = participants.filter(p => p.isObserver);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Participantes ({voters.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <AnimatePresence mode="popLayout">
            {voters.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center gap-2 p-3 rounded-lg bg-surface-elevated border border-border"
              >
                <div className="relative">
                  <div className="text-2xl">{p.avatar}</div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-surface-elevated ${p.isOnline ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
                </div>
                <span className="text-xs font-medium truncate max-w-full">
                  {p.name}
                  {p.isFacilitator && <span className="ml-1 text-primary">★</span>}
                </span>
                <div className="mt-1">
                  {p.vote ? (
                    <PokerCard
                      value={isRevealed ? p.vote : ""}
                      isHidden={!isRevealed}
                      isSelected={isRevealed}
                      size="sm"
                      disabled
                    />
                  ) : (
                    <div className="w-12 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">...</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {observers.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            👁 Observadores ({observers.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {observers.map(p => (
              <div key={p.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm">
                <span>{p.avatar}</span>
                <span className="text-muted-foreground">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
