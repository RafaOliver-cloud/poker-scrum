import { motion } from "framer-motion";

interface PokerCardProps {
  value: string;
  isSelected?: boolean;
  isRevealed?: boolean;
  isHidden?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const sizeClasses = {
  sm: "w-12 h-16 text-sm",
  md: "w-16 h-22 text-lg",
  lg: "w-20 h-28 text-2xl",
};

export function PokerCard({
  value,
  isSelected = false,
  isRevealed = false,
  isHidden = false,
  onClick,
  size = "md",
  disabled = false,
}: PokerCardProps) {
  return (
    <motion.button
      whileHover={!disabled ? { y: -6, scale: 1.05 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      animate={isSelected ? { y: -8 } : { y: 0 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        relative rounded-lg font-display font-bold
        flex items-center justify-center
        transition-colors duration-200
        cursor-pointer select-none
        border-2
        ${isSelected
          ? "bg-primary border-primary text-primary-foreground glow-primary-sm"
          : isHidden
            ? "bg-card-hidden border-border text-muted-foreground"
            : "bg-card border-border text-card-foreground hover:border-primary/50 hover:bg-card-hover"
        }
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        card-shadow
      `}
    >
      {isHidden ? (
        <div className="w-6 h-6 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs">
          ?
        </div>
      ) : (
        <span>{value}</span>
      )}
      {isSelected && (
        <motion.div
          layoutId="card-indicator"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary"
          initial={false}
        />
      )}
    </motion.button>
  );
}
