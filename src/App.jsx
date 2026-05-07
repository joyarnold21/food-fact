import { useReducer, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import HomePage from './pages/HomePage.jsx'
import DetailPage from './pages/DetailPage.jsx'
import SavedPage from './pages/SavedPage.jsx'

const SAVED_ITEMS_KEY = 'foodfacts_saved_items'

function getSavedFromLocalStorage() {
  try {
    const stored = localStorage.getItem(SAVED_ITEMS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function savedReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const exists = state.some((item) => item.code === action.payload.code)
      return exists ? state : [...state, action.payload]
    }
    case 'REMOVE':
      return state.filter((item) => item.code !== action.payload.code)
    case 'HYDRATE':
      return action.payload
    default:
      return state
  }
}

function App() {
  const [saved, dispatch] = useReducer(savedReducer, [], getSavedFromLocalStorage)

  useEffect(() => {
    localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(saved))
  }, [saved])

  return (
    <div className="app-shell">
      <NavBar savedCount={saved.length} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:barcode" element={<DetailPage saved={saved} dispatch={dispatch} />} />
        <Route path="/saved" element={<SavedPage saved={saved} dispatch={dispatch} />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  )
}

export default App
