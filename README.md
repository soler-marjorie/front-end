# Choisir son environnement de dev : vite ou Next:
![Choisir entre vite et next](/src/assets/image.png)
![Choisir entre vite et next suite](/src/assets/image-1.png)

On va choisir vite + React ici.

# React + Vite

## Création d'un projet React avec vite.js 
```
npm create vite@latest mon-projet -- --template react
cd mon-projet
npm install 
```

## Démarrer le serveur
```
npm run dev
```

## Installation du router
1. Installer le router via npm
```
npm install react-router-dom
```

2. Ajouter dans main.js : 
```
import { BrowserRouter, Routes, Route } from 'react-router-dom';
```

On place ```<BrowserRouter></BrowserRouter>``` autour de App pour activer le routing

```
<StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>
</StrictMode>,
```

1. Créer un fichier Router.jsx
```
import { Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  );
}
```

## Installation des dépendances

### Tailwind
1. Installer avec npm
```
npm install tailwindcss @tailwindcss/vite
```
2. Dans vite.config.js:
```
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite' //👈 Ajouter cette ligne

export default defineConfig({
  plugins: [
    tailwindcss(), //👈 Ajouter cette ligne
  ],
})
```
3. Dans index.css 
```
@import "tailwindcss";
```
/!\ @Apply fonctionne malgrès l'erreur sur vscode

### Dompurify
```
npm install dompurify
```

### Nivo/circle
```
npm install @nivo/circle-packing @nivo/core
```

### MathLive
```
npm install mathlive
```

### mathml-to-latex
```
npm install mathml-to-latex
```


## Création des dossiers (Vite ne le fait pas automatiquement)
Dans src créer les dossiers Pages et Composants puis créer les pages à intégrées dans les link de la route.
