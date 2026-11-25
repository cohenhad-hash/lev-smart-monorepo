import { NavLink } from "react-router-dom";

export default function AppLayout({ children }) {
  return (
    <div className="app-shell" dir="rtl">
      <header className="topbar">
        <NavLink to="/" className="brand" aria-label="LEV Smart - Home">
          <span className="brand-mark">ל</span><span>LEV <strong>Smart</strong></span>
        </NavLink>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <span className="nav-icon">⌂</span><span>דף הבית</span>
          </NavLink>
          <NavLink to="/chat" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <span className="nav-icon">✦</span><span>עוזר AI</span>
          </NavLink>
          <NavLink to="/courses/create" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <span className="nav-icon">▤</span><span>קורס חדש</span>
          </NavLink>
        </nav>
        <div className="topbar-note">סביבת למידה חכמה</div>
      </header>
      <main className="main-content">{children}</main>
      <footer className="footer"><span>LEV Smart</span><span>לומדים חכם יותר</span></footer>
    </div>
  );
}
