# Nexus Gateway prototype

Interactive UI prototype: login, workspace, analytics, and artifacts gallery.
All data is mock data and no backend is called.

## Run

```
npm install
npm run dev
```

Then open http://localhost:3000. Any email and password signs you in.

## Structure

```
app/
  layout.tsx              Next.js shell, loads globals.css
  page.tsx                renders <App />
src/
  App.tsx                 isAuthenticated + currentView, shared state, view switch
  styles/globals.css      Tailwind directives and colour variables
  components/
    Sidebar.tsx           logo, new chat, navigation, history, usage, account
    TopBar.tsx            page title and "Multi-agent active" pill
    ChatInput.tsx         composer: text area, attach, mic, Auto-Route, send
    MultiAgentIndicator.tsx  animated supervisor status
    Logo.tsx              NG mark
    ArtifactThumb.tsx     image / PDF / slides placeholder thumbnail
    BarStat.tsx           stat card with progress bar
    BrandIcons.tsx        Google and GitHub marks
  views/
    LoginView.tsx
    WorkspaceView.tsx
    AnalyticsView.tsx
    GalleryView.tsx
  hooks/
    useAgentSimulation.ts 3-second multi-agent run
    useTimers.ts          auto-cleared timeouts
  lib/
    types.ts  data.ts  ui.ts
tailwind.config.ts        canvas and surface colours, font stacks
```
