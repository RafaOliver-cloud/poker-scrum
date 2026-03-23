import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardDeck } from "@/components/poker/CardDeck";
import { ParticipantList } from "@/components/poker/ParticipantList";
import { RevealResults } from "@/components/poker/RevealResults";
import { DeckSelector } from "@/components/poker/DeckSelector";
import {
  DECK_PRESETS,
  calculateStats,
  type DeckType,
  type Participant,
} from "@/lib/poker";
import { Eye, RotateCcw, Copy, Users, Hash, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AVATARS = ['🦊', '🐱', '🐶', '🐼', '🦁', '🐸', '🐵', '🦄', '🐲', '🐺', '🦅', '🐙'];

function getRandomAvatar() {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}

function generateSessionId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

interface LobbyProps {
  onJoin: (squad: string, name: string, sessionId: string | null) => void;
}

function Lobby({ onJoin }: LobbyProps) {
  const [squad, setSquad] = useState("");
  const [name, setName] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  const [mode, setMode] = useState<"create" | "join">("create");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (mode === "create" && !squad.trim()) return;
    if (mode === "join" && !sessionCode.trim()) return;

    onJoin(
      mode === "create" ? squad.trim() : "",
      name.trim(),
      mode === "join" ? sessionCode.trim().toUpperCase() : null
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            🃏 Quick Session
          </h1>
          <p className="text-muted-foreground">
            Sessão rápida de Planning Poker — sem login necessário
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("create")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              mode === "create"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Criar sessão
          </button>
          <button
            onClick={() => setMode("join")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              mode === "join"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Entrar com código
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
              Seu nome
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: João Silva"
              className="w-full px-4 py-3 rounded-lg bg-surface-elevated border border-border text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/50"
              autoFocus
            />
          </div>

          {mode === "create" ? (
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                Nome do Squad
              </label>
              <input
                type="text"
                value={squad}
                onChange={e => setSquad(e.target.value)}
                placeholder="Ex: Squad Payments"
                className="w-full px-4 py-3 rounded-lg bg-surface-elevated border border-border text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                Código da sessão
              </label>
              <input
                type="text"
                value={sessionCode}
                onChange={e => setSessionCode(e.target.value.toUpperCase())}
                placeholder="Ex: A1B2C3"
                maxLength={6}
                className="w-full px-4 py-3 rounded-lg bg-surface-elevated border border-border text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/50 text-center text-lg tracking-widest font-mono"
              />
            </div>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-lg glow-primary transition-all"
          >
            <LogIn className="w-5 h-5" />
            {mode === "create" ? "Criar sessão" : "Entrar na sessão"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

interface SessionState {
  squadName: string;
  sessionId: string;
  deckType: DeckType;
  isRevealed: boolean;
  round: number;
  currentIssue: string;
}

export default function QuickSession() {
  const [joined, setJoined] = useState(false);
  const [myId] = useState(() => crypto.randomUUID());
  const [myName, setMyName] = useState("");
  const [myAvatar] = useState(() => getRandomAvatar());
  const [isFacilitator, setIsFacilitator] = useState(false);

  const [sessionState, setSessionState] = useState<SessionState>({
    squadName: "",
    sessionId: "",
    deckType: "fibonacci",
    isRevealed: false,
    round: 1,
    currentIssue: "",
  });

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isObserver, setIsObserver] = useState(false);

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const deck = DECK_PRESETS[sessionState.deckType];
  const stats = calculateStats(participants, deck);
  const votedCount = participants.filter(p => !p.isObserver && p.vote).length;
  const voterCount = participants.filter(p => !p.isObserver).length;

  // Join handler from lobby
  const handleJoinLobby = useCallback((squad: string, name: string, code: string | null) => {
    const sessionId = code || generateSessionId();
    const isFac = !code; // creator is facilitator

    setMyName(name);
    setIsFacilitator(isFac);
    setSessionState(prev => ({
      ...prev,
      squadName: squad || "Quick Session",
      sessionId,
    }));
    setJoined(true);
  }, []);

  // Setup Realtime channel
  useEffect(() => {
    if (!joined) return;

    const channelName = `quick-session-${sessionState.sessionId}`;
    const channel = supabase.channel(channelName, {
      config: { presence: { key: myId } },
    });

    channelRef.current = channel;

    // Track presence
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const parts: Participant[] = [];

      Object.entries(state).forEach(([key, presences]) => {
        const p = (presences as any[])[0];
        if (p) {
          parts.push({
            id: key,
            name: p.name || "Anônimo",
            avatar: p.avatar || "🦊",
            vote: p.vote || null,
            isOnline: true,
            isObserver: p.isObserver || false,
            isFacilitator: p.isFacilitator || false,
          });
        }
      });

      // Sort: facilitator first, then by name
      parts.sort((a, b) => {
        if (a.isFacilitator) return -1;
        if (b.isFacilitator) return 1;
        return a.name.localeCompare(b.name);
      });

      setParticipants(parts);
    });

    // Listen for broadcast events (reveal, new round, deck change, issue change)
    channel.on("broadcast", { event: "session-update" }, ({ payload }) => {
      if (payload) {
        setSessionState(prev => ({ ...prev, ...payload }));
        if (payload.isRevealed === false) {
          // New round: reset my vote and update presence
          setSelectedCard(null);
          channel.track({
            name: myName,
            avatar: myAvatar,
            vote: null,
            isObserver: isObserver,
            isFacilitator: isFacilitator,
          });
        }
      }
    });

    channel
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            name: myName,
            avatar: myAvatar,
            vote: null,
            isObserver: isObserver,
            isFacilitator: isFacilitator,
          });
        }
      });

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [joined, sessionState.sessionId, myId, myName, myAvatar, isFacilitator, isObserver]);

  // Update presence when vote or observer status changes
  const updatePresence = useCallback((vote: string | null, observer?: boolean) => {
    channelRef.current?.track({
      name: myName,
      avatar: myAvatar,
      vote,
      isObserver: observer ?? isObserver,
      isFacilitator,
    });
  }, [myName, myAvatar, isObserver, isFacilitator]);

  const handleSelectCard = useCallback((value: string) => {
    if (sessionState.isRevealed) return;
    const newVal = selectedCard === value ? null : value;
    setSelectedCard(newVal);
    updatePresence(newVal);
  }, [sessionState.isRevealed, selectedCard, updatePresence]);

  const handleReveal = useCallback(() => {
    const update = { isRevealed: true };
    setSessionState(prev => ({ ...prev, ...update }));
    channelRef.current?.send({
      type: "broadcast",
      event: "session-update",
      payload: update,
    });
  }, []);

  const handleNewRound = useCallback(() => {
    const update = { isRevealed: false, round: sessionState.round + 1 };
    setSessionState(prev => ({ ...prev, ...update }));
    setSelectedCard(null);
    updatePresence(null);
    channelRef.current?.send({
      type: "broadcast",
      event: "session-update",
      payload: update,
    });
  }, [sessionState.round, updatePresence]);

  const handleDeckChange = useCallback((dt: DeckType) => {
    const update = { deckType: dt, isRevealed: false, round: 1 };
    setSessionState(prev => ({ ...prev, ...update }));
    setSelectedCard(null);
    updatePresence(null);
    channelRef.current?.send({
      type: "broadcast",
      event: "session-update",
      payload: update,
    });
  }, [updatePresence]);

  const handleIssueChange = useCallback((issue: string) => {
    setSessionState(prev => ({ ...prev, currentIssue: issue }));
    if (isFacilitator) {
      channelRef.current?.send({
        type: "broadcast",
        event: "session-update",
        payload: { currentIssue: issue },
      });
    }
  }, [isFacilitator]);

  const toggleObserver = useCallback(() => {
    const newObs = !isObserver;
    setIsObserver(newObs);
    setSelectedCard(null);
    updatePresence(null, newObs);
  }, [isObserver, updatePresence]);

  const copySessionCode = useCallback(() => {
    navigator.clipboard.writeText(sessionState.sessionId);
    toast.success("Código copiado!");
  }, [sessionState.sessionId]);

  // Lobby
  if (!joined) {
    return <Lobby onJoin={handleJoinLobby} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface-elevated/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-xl font-display font-bold text-primary">
              🃏 ScrumPoker
            </a>
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
              {sessionState.squadName}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" />
              <span>Rodada {sessionState.round}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{votedCount}/{voterCount} votaram</span>
            </div>
            <button
              onClick={copySessionCode}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted hover:bg-muted/80 text-foreground transition-colors font-mono text-xs tracking-wider"
              title="Copiar código da sessão"
            >
              <Copy className="w-3.5 h-3.5" />
              {sessionState.sessionId}
            </button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Issue / Topic */}
        <div className="space-y-3">
          <input
            type="text"
            value={sessionState.currentIssue}
            onChange={e => handleIssueChange(e.target.value)}
            placeholder={isFacilitator ? "Descreva a história ou tarefa a estimar..." : "Aguardando o facilitador definir a tarefa..."}
            disabled={!isFacilitator}
            className="w-full text-lg sm:text-xl font-display font-semibold bg-transparent border-none outline-none placeholder:text-muted-foreground/50 text-foreground disabled:opacity-70"
          />
          {isFacilitator && (
            <DeckSelector selected={sessionState.deckType} onSelect={handleDeckChange} />
          )}
        </div>

        {/* Observer toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleObserver}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              isObserver
                ? "bg-accent/10 border-accent text-accent"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            👁 {isObserver ? "Observando" : "Participando"}
          </button>
          <span className="text-xs text-muted-foreground">
            {myAvatar} {myName} {isFacilitator && "★ Facilitador"}
          </span>
        </div>

        {/* Participants Table */}
        <ParticipantList participants={participants} isRevealed={sessionState.isRevealed} />

        {/* Results */}
        <RevealResults stats={stats} isRevealed={sessionState.isRevealed} />

        {/* Action Buttons */}
        <div className="flex justify-center gap-3">
          {isFacilitator && !sessionState.isRevealed && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleReveal}
              className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-lg glow-primary transition-all"
            >
              <Eye className="w-5 h-5" />
              Revelar Cartas
            </motion.button>
          )}
          {isFacilitator && sessionState.isRevealed && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNewRound}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-8 py-3 rounded-lg bg-secondary text-secondary-foreground font-display font-semibold text-lg border border-border transition-all hover:bg-secondary/80"
            >
              <RotateCcw className="w-5 h-5" />
              Nova Rodada
            </motion.button>
          )}
          {!isFacilitator && !sessionState.isRevealed && (
            <p className="text-sm text-muted-foreground">
              Aguardando o facilitador revelar as cartas...
            </p>
          )}
        </div>

        {/* Card Selection */}
        {!isObserver && (
          <div className="bg-surface-elevated border border-border rounded-xl p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Sua estimativa</h3>
            <CardDeck
              deck={DECK_PRESETS[sessionState.deckType]}
              selectedCard={selectedCard}
              onSelectCard={handleSelectCard}
              disabled={sessionState.isRevealed}
            />
          </div>
        )}
      </main>
    </div>
  );
}
