import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, Users, BarChart3, Shield, ArrowRight } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  const features = [
    { icon: <Zap className="w-5 h-5" />, title: "Quick Session", desc: "Comece a estimar em segundos, sem cadastro." },
    { icon: <Users className="w-5 h-5" />, title: "Tempo Real", desc: "Veja a presença e votos da equipe ao vivo." },
    { icon: <BarChart3 className="w-5 h-5" />, title: "Estatísticas", desc: "Média, mediana, moda e detecção de discrepâncias." },
    { icon: <Shield className="w-5 h-5" />, title: "Seguro", desc: "Salas privadas, convites com expiração e logs." },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border bg-surface-elevated/80 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-display font-bold text-foreground">
            🃏 <span className="text-primary">Scrum</span>Poker
          </span>
          <button
            onClick={() => navigate("/quick")}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition-all hover:opacity-90 glow-primary-sm"
          >
            Quick Session
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
            <Zap className="w-3.5 h-3.5" />
            Planning Poker para squads ágeis
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
            Estime com{" "}
            <span className="text-primary">consenso</span>,{" "}
            <br className="hidden sm:block" />
            não com achismo
          </h1>

          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Crie sessões de estimativa em segundos. Baralhos configuráveis, estatísticas automáticas e presença em tempo real.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/quick")}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-lg glow-primary transition-all"
            >
              Começar Agora
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <span className="text-sm text-muted-foreground">Sem login necessário</span>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto w-full"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="p-5 rounded-xl bg-surface-elevated border border-border card-shadow hover:card-shadow-hover transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                {f.icon}
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        ScrumPoker — Feito para squads que estimam com qualidade.
      </footer>
    </div>
  );
}
