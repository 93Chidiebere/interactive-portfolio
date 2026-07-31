# Cinematic Portfolio Boilerplate Template

Welcome to the **Cinematic Portfolio**! This is a unique, video-like interactive portfolio template built with **React (Vite)** and styled with **Vanilla CSS**. 

Visitors to your site can watch it play automatically like a documentary, pausing at any time to deep-dive into code, charts, and repository links. It is designed to be highly customizable, modular, and easy for any developer or creator to deploy as their own.

---

## 🛠️ How to Customize this Template

You do not need to rewrite the player code. Almost all customizations happen in a single configuration file:
👉 **[src/data/projectsData.js](file:///C:/Users/Chidiebere/Documents/interactive-portfolio/src/data/projectsData.js)**

### 1. Customizing Categories
At the top of `projectsData.js`, you'll find the `categories` array:
```javascript
export const categories = [
  { id: 'software-engineering', name: 'Software Engineering', color: 'var(--accent-blue)' },
  { id: 'academic-research', name: 'Academic Research', color: 'var(--accent-teal)' }
  // Add or remove categories here
];
```
* **How to delete a category**: Simply delete its object from the array.
* **How to filter out empty categories**: The app's timeline and seek bar will automatically hide any categories that don't have any projects associated with them!

### 2. Customizing Projects
The `projects` array contains the list of your work. You can assign each project to a category using its `categoryId`:
```javascript
export const projects = [
  {
    id: 'my-project-id',
    categoryId: 'software-engineering', // Must match an ID in categories
    title: 'My Custom App Name',
    duration: 80, 
    tagline: 'Short catchy tagline...',
    scenes: [
      {
        title: 'Overview',
        text: 'This is what the app does...',
        metric: { label: 'Performance Gain', value: '+45%' },
        audioPath: '' // Optional (see voiceover guide below)
      },
      // Every project must have exactly 4 scenes: Overview, Why, Challenges, Solution
    ],
    deepDive: {
      description: 'More detailed technical summary for the slide-out inspector...',
      codeSnippet: '// Custom code block...',
      architecture: 'Frontend -> Backend -> DB',
      githubLink: 'https://github.com/username/project',
      liveLink: 'https://project.com'
    }
  }
];
```
* **How to drop categories you don't need**: If you only want to showcase "Software Engineering", just delete all other projects and delete their categories from the `categories` array. The player will automatically adjust its timelines and chapter selections.

### 3. Customizing Accent Colors
Each category is styled dynamically with a CSS variable color (e.g. `var(--accent-blue)`).
To change colors or define a new one:
1. Open **[src/index.css](file:///C:/Users/Chidiebere/Documents/interactive-portfolio/src/index.css)** and find the `:root` variables block at the top.
2. Edit existing values or add yours:
   ```css
   --accent-blue: #00d9ff;  /* Neon Cyan */
   --accent-purple: #c300ff; /* Neon Purple */
   --accent-mycolor: #ffaa00; /* Your customized color */
   ```
3. Map this color to your category in `projectsData.js`:
   ```javascript
   { id: 'my-category', name: 'My Cat', color: 'var(--accent-mycolor)' }
   ```

---

## 🎙️ Voiceover & Narrations Guide

The template supports a **Hybrid Narration Engine**:

### Option A: Standard Text-To-Speech (Default)
Out of the box, the browser will read the scene texts aloud using its built-in speech engine.
* It announces the **Project Title + Overview** on the first slide.
* On subsequent slides, it announces the chapter context, e.g., *"Why It Was Built. [text]"*, keeping it highly professional.

### Option B: Your Real Voice (Recommended)
You can replace the robotic voice with your own recorded voice:
1. Record yourself reading the text for a scene (keep it clear and short).
2. Save it as an MP3 file (e.g., `supply-chain-overview.mp3`) inside the `public/audio/` directory.
3. Link it in your project scene object inside `projectsData.js`:
   ```javascript
   scenes: [
     {
       title: 'Overview',
       text: 'A real-time supply chain analytics...',
       metric: { ... },
       audioPath: '/audio/supply-chain-overview.mp3' // Link to your file
     }
   ]
   ```
The player will automatically detect the file, play your recording instead of the TTS voice, and advance the slide immediately when you finish speaking!

---

## 🎵 Background Music
You can swap the default ambient track with any instrumental loop:
1. Drop your mp3 file (e.g. `enya-track.mp3`) into the `public/` directory.
2. Open **[src/context/PortfolioContext.jsx](file:///C:/Users/Chidiebere/Documents/interactive-portfolio/src/context/PortfolioContext.jsx)**.
3. Edit the URL constant at the top:
   ```javascript
   const AMBIENT_MUSIC_URL = '/enya-track.mp3';
   ```

---

## 🚀 Deployment

Since this is a static single-page application, you can deploy it for free in minutes:
1. Run `npm run build` in your terminal. This creates a `dist/` folder containing optimized HTML, CSS, and JS.
2. Upload the `dist/` folder to high-performance free hosts:
   * **Vercel** or **Netlify** (Just drag-and-drop the `dist` folder or link your Github repository).
   * **GitHub Pages** (Deploy directly from your repo settings).
