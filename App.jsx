import { useState, useEffect } from "react";
import "./App.css";
 
const LOCATIONS = ["Chicago, IL", "Brooklyn, NY", "Austin, TX", "Portland, OR", "Seattle, WA"];
const CATEGORIES = ["🌱 Environment", "🤝 Community", "📚 Education", "🏥 Health", "🏠 Housing"];
 
export default function App() {
  const [events, setEvents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [filter, setFilter] = useState("all");
 
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.slice(0, 20).map((post) => {
          const date = new Date();
          date.setDate(date.getDate() + (post.id % 20 - 8) * 5);
          return {
            id: post.id,
            title: post.title.slice(0, 50),
            description: post.body.slice(0, 100) + "...",
            date: date,
            location: LOCATIONS[post.id % LOCATIONS.length],
            category: CATEGORIES[post.id % CATEGORIES.length],
          };
        });
        setEvents(mapped);
      });
  }, []);
 
  const handleRegister = (id) => {
    if (!registeredEvents.includes(id)) {
      setRegisteredEvents([...registeredEvents, id]);
    }
  };
 
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "upcoming" && event.date >= new Date()) ||
      (filter === "past" && event.date < new Date());
    return matchesSearch && matchesFilter;
  });
 
  return (
    <div>
      <header className="masthead">
        <div className="logo">Impact<span>Hub</span></div>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search events..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="badge">{registeredEvents.length} Registered</div>
      </header>
 
      <section className="hero">
        <span className="hero-tag">Social Impact Events</span>
        <h1>Make your <em>mark</em> on the world around you.</h1>
        <p>Discover volunteer opportunities and community events near you.</p>
      </section>
 
      <div className="controls">
        <button className={`pill ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All Events</button>
        <button className={`pill ${filter === "upcoming" ? "active" : ""}`} onClick={() => setFilter("upcoming")}>Upcoming</button>
        <button className={`pill ${filter === "past" ? "active" : ""}`} onClick={() => setFilter("past")}>Past</button>
      </div>
 
      <div className="divider">{filteredEvents.length} events</div>
 
      <div className="grid">
        {filteredEvents.map((event) => {
          const isPast = event.date < new Date();
          const isRegistered = registeredEvents.includes(event.id);
          return (
            <div key={event.id} className={`card ${isPast ? "past" : ""}`}>
              <div className="card-accent" />
              <div className="card-body">
                <div className="card-meta">
                  <span className="category">{event.category}</span>
                  {isPast && <span className="past-label">Past</span>}
                </div>
                <h2>{event.title}</h2>
                <p className="card-desc">{event.description}</p>
                <div className="card-info">
                  <div className="info-row">
                    📅 {event.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                  <div className="info-row">
                    📍 {event.location}
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <button
                  className={`btn-register ${isRegistered ? "registered" : ""}`}
                  onClick={() => handleRegister(event.id)}
                  disabled={isPast || isRegistered}
                >
                  {isRegistered ? "Registered ✅" : isPast ? "Ended" : "Register →"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
