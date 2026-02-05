# 💼 JobTracker

> **Busca inteligente de vagas de emprego em tecnologia** 🚀

Uma ferramenta moderna e completa para otimizar sua busca por vagas, gerenciar aplicações e acompanhar seu progresso profissional.

---

## ✨ Funcionalidades

### 🔍 Motor de Busca Inteligente
- **Google Dorks automáticos** - Gera queries otimizadas com operadores avançados
- **30+ sites de vagas** pré-configurados:
  - **ATS Globais**: Greenhouse, Lever, Workable, SmartRecruiters, BambooHR
  - **Brasil**: Gupy, Vagas.com, Catho, InfoJobs, Trampos
  - **Startups & Remoto**: AngelList, RemoteOK, WeWorkRemotely, FlexJobs
  - **Big Tech**: LinkedIn, Indeed, Glassdoor
  - E muitos outros!
- **Filtros avançados**:
  - Cargo/Posição
  - Localização (opcional)
  - Data (últimas 24h, semana, mês, ano)
  - Seleção múltipla de sites com agrupamento por categoria
- **Integração automática com blocklist** - Exclui empresas indesejadas das buscas

### 🚫 Blocklist Manager
- Adicione empresas que você **não quer ver** nas buscas
- Importar/Exportar listas via JSON
- Visual limpo com badges removíveis
- Exclusão automática nas queries do Google

### 📊 Analytics Dashboard
- **Gráfico visual** dos 5 cargos mais buscados (Recharts)
- **Estatísticas em tempo real**:
  - Total de buscas realizadas
  - Número de sites explorados
  - Cargo mais procurado em destaque
- Aparece automaticamente após 3+ buscas

### 📜 Histórico de Buscas
- **50 últimas buscas** salvas automaticamente
- Reaplicar qualquer busca com 1 clique
- Timestamps formatados
- Botão para limpar histórico

### ⭐ Presets de Busca
- Salve suas **configurações favoritas**
- Nomeie cada preset (ex: "Frontend Remote", "Data Analyst SP")
- Aplicar instantaneamente
- Gerenciar e deletar presets

### 📋 Kanban Board - Minhas Vagas
- **5 colunas de status**:
  - 💾 Salvas
  - ✉️ Aplicadas
  - 💬 Entrevista
  - 🎉 Oferta
  - ❌ Rejeitadas
- **Drag & Drop funcional** 
- Adicionar vagas manualmente (cargo + empresa)
- Editar notas em cada vaga
- Deletar vagas
- **Badge dinâmico** mostrando total de aplicações
- Ordenação automática por data de atualização

### 🎨 Tema Dark/Light
- **Alternância suave** entre temas claro e escuro
- Preferência salva no LocalStorage
- Design glassmorphism e gradientes premium
- Todos os componentes otimizados para ambos os temas

### 💾 Persistência Total
- **LocalStorage** para todos os dados:
  - Tema selecionado
  - Blocklist
  - Histórico de buscas
  - Presets salvos
  - Aplicações no Kanban
- **Sobrevive a refresh** - Seus dados nunca são perdidos

---

## 🛠️ Tecnologias

### Frontend
- **React 19** - Biblioteca UI moderna
- **TypeScript** - Type safety e melhor DX
- **Vite** - Build tool ultra-rápido
- **TailwindCSS** - Utility-first CSS framework

## 📂 Estrutura do Projeto

```
jobtracker/
├── src/
│   ├── components/          # Componentes React
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── BlocklistManager.tsx
│   │   ├── Header.tsx
│   │   ├── JobCard.tsx
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   ├── SearchEngine.tsx
│   │   ├── SearchHistoryList.tsx
│   │   └── SearchPresets.tsx
│   ├── hooks/               # Custom hooks
│   │   └── useLocalStorage.ts
│   ├── lib/                 # Utilitários
│   │   └── utils.ts
│   ├── types/               # TypeScript types
│   │   └── job.ts
│   ├── App.tsx              # Componente principal
│   ├── App.css              # Estilos do App
│   ├── index.css            # Estilos globais + Tailwind
│   └── main.tsx             # Entry point
├── public/                  # Assets estáticos
├── index.html               # HTML base
├── package.json
├── tailwind.config.js       # Configuração do Tailwind
├── tsconfig.json            # Configuração do TypeScript
└── vite.config.ts           # Configuração do Vite
```

---

## 🎯 Próximas Melhorias Planejadas

- [ ] Exportar/Importar dados completos (backup JSON)
- [ ] Busca direta por site individual
- [ ] Modal completo para adicionar vagas (com URL, salário, deadline)
- [ ] Filtros e busca no Kanban
- [ ] Gráfico de timeline de buscas
- [ ] Heatmap de sites mais usados
- [ ] Notificações de follow-up
- [ ] PWA (Progressive Web App)
- [ ] Integração com LinkedIn API

---

## 👤 Autor

**Thiago J.**

- 💼 LinkedIn: [@ithiagojs](https://www.linkedin.com/in/ithiagojs/)
- 🐙 GitHub: [@ithiagojs](https://github.com/ithiagojs)

---

## 📝 Licença

Este projeto foi criado com ❤️ para a turma de Dados.

---

## 🙏 Agradecimentos Meu Vilão Preferido


