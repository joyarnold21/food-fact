import { NavLink } from 'react-router-dom'

export default function NavBar({ savedCount }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">FoodFacts</div>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink to="/saved" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Saved Items
            {savedCount > 0 ? <span className="nav-badge">{savedCount}</span> : null}
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
