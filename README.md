# 🃏 ScrumPoker - Planning Poker para Squads Ágeis

> Uma aplicação web moderna e responsiva para facilitiar cerimônias de Planning Poker em tempo real, sem complicações.

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Features](#features)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Como Começar](#como-começar)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Baralhos Disponíveis](#baralhos-disponíveis)
- [Modo Quick Session](#modo-quick-session)
- [Desenvolvimento](#desenvolvimento)
- [Testes](#testes)
- [Contribuindo](#contribuindo)

---

## 🎯 Visão Geral

**ScrumPoker** é uma plataforma de Planning Poker projetada para equipes ágeis executarem cerimônias de estimativa com eficiência e sem fricção.

O projeto foi desenvolvido com foco em **MVP funcional** e **experiência do usuário**, oferecendo um modo "Quick Session" que permite que qualquer pessoa comece a usar em segundos, sem necessidade de autenticação ou configuração complexa.

### Motivação

- **Sem atrito**: Quick Session permite começar instantaneamente
- **Sem dependências**: Funciona localmente após carregar a página
- **Foco no essencial**: Interface limpa que não distrai da tarefa
- **Responsivo**: Funciona em desktop e mobile

---

## ⚡ Features

### MVP - Implementado ✅

- **🚀 Quick Session (Sem Login)**
  - Criar nova sessão em 3 cliques
  - Entrar em sessão existente com código
  - Geradores de avatares aleatórios
  - ID de sessão único e compartilhável

- **🃏 Múltiplos Baralhos**
  - Fibonacci: `0, 1, 2, 3, 5, 8, 13, 21, ?, ☕`
  - T-Shirt: `XS, S, M, L, XL, XXL, ?, ☕`
  - Powers of 2: `0, 1, 2, 4, 8, 16, 32, 64, ?, ☕`
  - Custom: Baralho personalizado por sessão

- **📊 Cerimônia em Tempo Real**
  - Seleção privada de cartas pelos participantes
  - Botão "Revelar" para mostrar todas as estimativas simultaneamente
  - Lista de participantes com presença em tempo real
  - Histórico de rodadas

- **📈 Cálculos Estatísticos**
  - Média das estimativas
  - Mediana
  - Moda (valor mais frequente)
  - Detecção automática de discrepâncias

- **🎨 Interface Moderna**
  - Design responsivo (mobile-first)
  - Modo dark/light
  - Animações suaves (Framer Motion)
  - Componentes acessíveis (shadcn/ui + Radix UI)

### Futuro - Roadmap 🚧

- [ ] Autenticação (email/senha + social login)
- [ ] Persistência de dados (Supabase)
- [ ] Times/Squads e gerenciamento de salas
- [ ] Integração com Jira e Azure DevOps
- [ ] Chat/Discussão contextual
- [ ] Exportação de resultados (CSV/JSON)
- [ ] Telemetria e análises
- [ ] i18n completo (pt-BR, en-US)
- [ ] Histórico de sessões

---

## 🛠 Stack Tecnológico

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - Components
- **Framer Motion** - Animações
- **React Query** - State & caching
- **React Router** - Routing

### Backend & Services
- **Supabase** - BaaS (PostgreSQL + Auth)
- **WebSocket** (via Supabase Realtime) - Real-time updates

### Testes & QA
- **Vitest** - Unit testing
- **Playwright** - E2E testing

### DevTools
- **ESLint** - Code linting
- **PostCSS** - CSS processing

---

## 🏗 Arquitetura do Projeto

### Padrão de Arquitetura

A aplicação segue a abordagem **component-driven** com separação clara de responsabilidades:

```
┌─────────────────────────────────────┐
│         Pages (Rotas)               │
│  - Index.tsx (Landing)              │
│  - QuickSession.tsx (App Principal) │
│  - NotFound.tsx (404)               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Components (UI Compostos)        │
│  ├── poker/                         │
│  │   ├── CardDeck.tsx               │
│  │   ├── DeckSelector.tsx           │
│  │   ├── ParticipantList.tsx        │
│  │   ├── PokerCard.tsx              │
│  │   └── RevealResults.tsx          │
│  ├── ui/ (shadcn/ui)                │
│  └── NavLink.tsx                    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Hooks & Utilities                │
│  ├── hooks/                         │
│  │   ├── use-mobile.tsx             │
│  │   └── use-toast.ts               │
│  ├── lib/                           │
│  │   ├── poker.ts (lógica)          │
│  │   └── utils.ts (helpers)         │
│  └── integrations/                  │
│      └── supabase/                  │
└─────────────────────────────────────┘
```

### Fluxo de Estado

```
QuickSession (Container)
├── Estado de Lobby (antes de entrar)
│   ├── name (nome do participante)
│   ├── squad (nome do time)
│   └── sessionCode (código de entrada)
│
└── Estado de Sessão (durante a partida)
    ├── participants (lista de participantes)
    ├── myVote (seu voto atual)
    ├── revealed (votação revelada?)
    ├── deckType (tipo de baralho)
    ├── sessionId (ID único da sala)
    └── rounds (histórico de rodadas)
```

---

## 🚀 Como Começar

### Pré-requisitos

- **Node.js 18+** (recomendado + npm/yarn/pnpm)
- **Git**

### Instalação

```bash
# 1. Clone o repositório
git clone <seu-repo>
cd poker-scrum

# 2. Instale dependências
npm install

# 3. Configure variáveis de ambiente (se necessário)
cp env.txt .env.local
# Edite .env.local com suas configurações

# 4. Inicie o servidor de desenvolvimento
npm run dev

# A aplicação estará disponível em: http://localhost:5173
```

Observações sobre variáveis de ambiente:

- O arquivo [env.txt](env.txt) é apenas um template versionado. Não mantenha valores reais nele.
- Em produção, configure as variáveis no provedor de hospedagem, como Netlify ou Vercel.
- Variáveis com prefixo `VITE_` são embutidas no frontend no build. Use esse prefixo apenas para valores públicos, como `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Nunca exponha chaves sensíveis, como `service_role`, no frontend ou em variáveis com prefixo `VITE_`.

### Build para Produção

```bash
# Build otimizado
npm run build

# Preview local do build
npm run preview

# Build para desenvolvimento (com source maps)
npm run build:dev
```

---

## 📁 Estrutura de Pastas

```
poker-scrum/
├── public/                    # Assets estáticos
│   └── robots.txt
│
├── src/
│   ├── components/           # Componentes React
│   │   ├── pokemon/          # ⭐ Componentes do Poker
│   │   │   ├── CardDeck.tsx
│   │   │   ├── DeckSelector.tsx
│   │   │   ├── ParticipantList.tsx
│   │   │   ├── PokerCard.tsx
│   │   │   └── RevealResults.tsx
│   │   ├── ui/               # shadcn/ui components
│   │   └── NavLink.tsx
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── integrations/         # Integrações externas
│   │   └── supabase/
│   │       ├── client.ts     # Supabase client
│   │       └── types.ts      # TypeScript types
│   │
│   ├── lib/                  # Utilitários e lógica
│   │   ├── poker.ts          # ⭐ Lógica de baralhos e stats
│   │   └── utils.ts
│   │
│   ├── pages/                # ⭐ Rotas principais
│   │   ├── Index.tsx         # Landing page
│   │   ├── QuickSession.tsx  # App principal
│   │   └── NotFound.tsx
│   │
│   ├── test/                 # Testes
│   │   ├── example.test.ts
│   │   └── setup.ts
│   │
│   ├── App.tsx               # Root component
│   ├── main.tsx              # Entry point
│   ├── index.css
│   └── App.css
│
├── supabase/                 # Supabase config
│   ├── config.toml
│   └── migrations/
│
├── vite.config.ts            # Configuração Vite
├── vitest.config.ts          # Configuração testes
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # TailwindCSS config
├── postcss.config.js         # PostCSS config
├── eslint.config.js          # ESLint rules
└── package.json              # Dependências

```

### Arquivos-chave ⭐

| Arquivo | Descrição |
|---------|-----------|
| `QuickSession.tsx` | Aplicação principal com estado e lógica |
| `poker.ts` | Presets de baralhos, cálculos de stats, tipos |
| `CardDeck.tsx` | Grade de cartas para seleção |
| `ParticipantList.tsx` | Lista de participantes com presença |
| `RevealResults.tsx` | Tela de resultados com estatísticas |

---

## 🃏 Baralhos Disponíveis

### 1. Fibonacci (Padrão)
Sequência de Fibonacci com café break:
```
0, 1, 2, 3, 5, 8, 13, 21, ?, ☕
```
**Uso**: Ideal para a maioria dos times, oferece granularidade progressiva.

### 2. T-Shirt Sizing
Tamanhos intuitivos:
```
XS, S, M, L, XL, XXL, ?, ☕
```
**Uso**: Útil quando a complexidade é mais importante que estimativas numéricas exatas.

### 3. Powers of 2
Potências de dois:
```
0, 1, 2, 4, 8, 16, 32, 64, ?, ☕
```
**Uso**: Bom para equipes que trabalham com arquitetura e escalabilidade.

### 4. Custom
Permite criar um baralho personalizado durante a sessão:
```
Configurável pelo facilitador
```
**Uso**: Máxima flexibilidade para casos específicos.

### Cartas Especiais

- **`?`** = Não sei / Preciso de mais informações
- **`☕`** = Vamos fazer um café (pausa longa)

---

## 🎮 Modo Quick Session

O modo **Quick Session** é o core da aplicação. Permite que qualquer pessoa comece sem autenticação.

### Fluxo do Usuário

```
┌─────────────────┐
│   Landing Page  │
│  (Index.tsx)    │
└────────┬────────┘
         │ [Click "Quick Session"]
         ▼
┌─────────────────────┐
│  Lobby              │
│  - Criar sessão     │
│  - Entrar com código│
└────────┬────────────┘
         │
    ┌────┴─────┐
    ▼          ▼
[CREATE]    [JOIN]
    │          │
    ▼          ▼
[Name]      [Session Code]
    │          │
    └────┬─────┘
         ▼
┌──────────────────────┐
│  Session Ativa       │
│  - Selecionar carta  │
│  - Revelar rodada    │
│  - Ver estatísticas  │
│  - Re-votar          │
└──────────────────────┘
```

### Features da Quick Session

✅ **Sem autenticação** - Entre imediatamente com um nome
✅ **Código compartilhável** - ID único de 6 caracteres (ex: `ABC123`)
✅ **Avatares aleatórios** - Emoji automaticamente atribuído
✅ **Presença em tempo real** - Veja quem saiu e entrou
✅ **Privacidade** - Votos apenas revelados quando o facilitador clicar

---

## 💻 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor Vite com HMR

# Build
npm run build        # Build otimizado (produção)
npm run build:dev    # Build com source maps

# Testes
npm run test         # Executa testes um vez
npm run test:watch   # Modo watch para desenvolvimento

# Lint
npm run lint         # Verifica erros de código

# Preview
npm run preview      # Visualiza build local
```

### Padrões de Código

#### Componentes
```typescript
// Use functional components com hooks
import { FC } from "react";

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export const MyComponent: FC<MyComponentProps> = ({ title, onAction }) => {
  return <div>{title}</div>;
};
```

#### Estados Complexos
```typescript
// Prefira múltiplos useState ao invés de Redux para simplicidade
const [count, setCount] = useState(0);
const [isLoading, setIsLoading] = useState(false);
```

#### Tipos
```typescript
// Defina tipos explícitos em lib/poker.ts
export type DeckType = 'fibonacci' | 'tshirt' | 'powers2' | 'custom';

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  vote: string | null;
}
```

---

## 🧪 Testes

### Testes Unitários

```bash
npm run test
npm run test:watch
```

Arquivos de teste devem seguir o padrão: `*.test.ts` ou `*.spec.ts`

Localização: `src/test/`

### Testes E2E

```bash
# Ainda não configurado, será usada para:
# - Fluxo de criar sessão
# - Fluxo de entrar com código
# - Revelação de votos
# - Cálculos de estatísticas
```

Configuração: `playwright.config.ts`

---

## 🤝 Contribuindo

### Processo de Contribuição

1. **Fork** este repositório
2. **Crie uma branch** para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. **Abra um Pull Request** com descrição clara

### Boas Práticas

- ✅ Escreva commits semânticos
- ✅ Mantenha componentes pequenos e focados (< 200 linhas)
- ✅ Use TypeScript - sem `any` sem razão
- ✅ Teste funcionalidades críticas
- ✅ Documente componentes complexos

---

## 📊 Roadmap

### Fase 1: MVP ✅ (Atual)
- [x] Quick Session
- [x] Múltiplos baralhos
- [x] Revelação em tempo real
- [x] Cálculos estatísticos
- [x] Interface responsiva

### Fase 2: Persistência 📋
- [ ] Autenticação
- [ ] Banco de dados (Supabase)
- [ ] Histórico de sessões
- [ ] Dados de usuário

### Fase 3: Colaboração 🚀
- [ ] Teams/Squads
- [ ] Gerenciamento de salas persistentes
- [ ] Chat/Discussão
- [ ] Re-votação assistida

### Fase 4: Integrações 🔗
- [ ] Jira
- [ ] Azure DevOps
- [ ] Exportação (CSV/JSON)
- [ ] Webhooks

### Fase 5: Analytics & UX 📊
- [ ] Telemetria
- [ ] i18n completo
- [ ] Modo dark totalmente polido
- [ ] Acessibilidade WCAG AA

---

## 📝 Licença

Este projeto foi desenvolvido com [Lovable](https://lovable.art/) e está disponível sob tratativa a definir.

---

## 📞 Suporte & Feedback

- 🐛 **Reporte bugs** via GitHub Issues
- 💡 **Sugira features** com contexto claro
- 🎨 **Melhore o design** com PRs bem documentadas

---

**Desenvolvido com ❤️ para squads ágeis**
