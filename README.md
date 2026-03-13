# 🌍 ImpactHub — Social Impact Events

A React app where users can discover and register for social impact events in their community.

## 🚀 Live Demo
> Run locally with `npm run dev` → open http://localhost:5173

---

## 📸 Features

- 🔍 **Search** events by name, location, or category
- 📅 **Filter** by All / Upcoming / Past events
- ✅ **Register** for events — button updates to "Registered ✅"
- 🔢 **Live counter** showing total registered events
- ⏳ **Skeleton loading** while data is being fetched

---

## 🛠️ Tech Stack

| Tech | Usage |
|------|-------|
| React 18 | UI Framework |
| Vite | Build Tool |
| JSONPlaceholder API | Mock event data |
| CSS (App.css) | Styling |

---

## 📁 Project Structure
```
src/
├── App.jsx       # Main component — all logic lives here
├── App.css       # All styles
└── main.jsx      # Entry point
```

---

## ⚙️ Getting Started
```bash
# 1. Clone the repo
git clone https://github.com/your-username/impacthub.git

# 2. Go into the folder
cd impacthub

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

---

## 🧠 Concepts Used

- `useState` — managing events, search text, filters, and registrations
- `useEffect` — fetching data from API on component mount
- Conditional rendering — loading state, empty state, past/upcoming badges
- Array filtering — search and filter logic
- Event handling — register button, search input, filter pills

---

## 📡 API Used

[JSONPlaceholder](https://jsonplaceholder.typicode.com/posts) — free fake REST API.  
Posts are mapped to events with generated dates, locations, and categories.

---

## 👤 Author

Sneha Aggarwal
