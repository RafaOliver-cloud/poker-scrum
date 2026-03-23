import { motion } from "framer-motion";
import type { VoteStats } from "@/lib/poker";

interface RevealResultsProps {
  stats: VoteStats;
  isRevealed: boolean;
}

export function RevealResults({ stats, isRevealed }: RevealResultsProps) {
  if (!isRevealed || stats.average === null) return null;

  const metrics = [
    { label: "Média", value: stats.average, icon: "📊" },
    { label: "Mediana", value: stats.median, icon: "📈" },
    { label: "Moda", value: stats.mode, icon: "🎯" },
    { label: "Concordância", value: `${stats.agreement}%`, icon: "🤝" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {stats.hasDiscrepancy && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive flex items-center gap-2"
        >
          <span>⚠️</span>
          <span>Alta discrepância detectada — considere discutir antes de re-votar.</span>
        </motion.div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-lg bg-surface-elevated border border-border text-center"
          >
            <div className="text-lg mb-1">{m.icon}</div>
            <div className="text-2xl font-display font-bold text-foreground">{m.value ?? '—'}</div>
            <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
