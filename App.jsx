import { useState, useEffect } from "react";
import "./App.css";
 
const LOCATIONS = ["Chicago, IL", "Brooklyn, NY", "Austin, TX", "Portland, OR", "Seattle, WA", "Denver, CO", "Atlanta, GA", "Miami, FL", "Oakland, CA", "Detroit, MI"];
const CATEGORIES = ["🌱 Environment", "🤝 Community", "📚 Education", "🏥 Health", "🏠 Housing", "🌍 Global Aid"];
 
function generateDate(id) {
  const now = new Date();
  const offset = (id % 20) - 8;
  const d = new Date(now);
  d.setDate(d.getDate() + offset * 5);
  return d;
}
 
function mapPostToEvent(post) {
  const date = generateDate(post.id);
  return {
    id: post.id,
    title: post.title.charAt(0).toUpperCase() + post.title.slice(1, 52).replace(/\s+\S*$/, "") + " Initiative",
    description: post.body.slice(0, 90) + "…",
    date,
    location: LOCATIONS[post.id % LOCATIONS.length],
    category: CATEGORIES[post.id % CATEGORIES.length],
    spots: 15 + (post.id % 35),
  };
}
 
const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const isUpcoming = (d) => d >= new Date();
 
export default function App() {
  const [events, setEvents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((r) => r.json())
      .then((posts) => {
        setEvents(posts.slice(0, 20).map(mapPostToEvent));
        setLoading(false);
      });
  }, []);
 
  const filtered = events.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(searchText.toLowerCase()) ||
      e.location.toLowerCase().includes(searchText.toLowerCase()) ||
      e.category.toLowerCase().includes(searchText.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "upcoming" ? isUpcoming(e.date) : !isUpcoming(e.date));
    return matchSearch && matchFilter;
  });
 
  const toggle = (id) => {
    setRegisteredEvents((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
 
  return (
    <>
      <header className="masthead">
        <div className="logo">Impact<span>Hub</span></div>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search events, locations, causes…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="badge">{registeredEvents.size} Registered</div>
      </header>
 
      <section className="hero">
        <span className="hero-tag">Social Impact Events</span>
        <h1>Make your <em>mark</em> on the world around you.</h1>
        <p>Discover volunteer opportunities, community drives, and grassroots initiatives near you.</p>
      </section>
 
      <div className="controls">
        {[["all", "All Events"], ["upcoming", "Upcoming"], ["past", "Past"]].map(([val, label]) => (
          <button
            key={val}
            className={`pill ${filter === val ? "active" : ""}`}
            onClick={() => setFilter(val)}
          >
            {label}
          </button>
        ))}
      </div>
 
      <div className="divider">{loading ? "Loading" : `${filtered.length} events`}</div>
 
      <div className="grid">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skel-card skeleton" style={{ animationDelay: `${i * 0.07}s` }} />
            ))
          : filtered.length === 0
          ? (
            <div className="empty">
              <h3>No events found</h3>
              <p>Try adjusting your search or filter.</p>
            </div>
          )
          : filtered.map((event, i) => {
              const past = !isUpcoming(event.date);
              const registered = registeredEvents.has(event.id);
              return (
                <div
                  key={event.id}
                  className={`card ${past ? "past" : ""}`}
                  style={{ animationDelay: `${(i % 12) * 0.04}s` }}
                >
                  <div className="card-accent" />
                  <div className="card-body">
                    <div className="card-meta">
                      <span className="category">{event.category}</span>
                      {past && <span className="past-label">Past</span>}
                    </div>
                    <h2>{event.title}</h2>
                    <p className="card-desc">{event.description}</p>
                    <div className="card-info">
                      <div className="info-row">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        {fmt(event.date)}
                      </div>
                      <div className="info-row">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                          <circle cx="12" cy="9" r="2.5"/>
                        </svg>
                        {event.location}
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <span className="spots">{event.spots} spots left</span>
                    <button
                      className={`btn-register ${registered ? "registered" : ""}`}
                      onClick={() => !past && toggle(event.id)}
                      disabled={past && !registered}
                    >
                      {registered ? "Registered ✅" : past ? "Ended" : "Register →"}
                    </button>
                  </div>
                </div>
              );
            })}
      </div>
    </>
  );
}