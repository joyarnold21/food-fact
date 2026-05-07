import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar.jsx'
import FoodCard from '../components/FoodCard.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import LoadingCard from '../components/LoadingCard.jsx'
import useFoodSearch from '../hooks/useFoodSearch.js'

const RECENT_SEARCHES_KEY = 'foodfacts_recent_searches'
const MAX_RECENT = 6

function getRecentSearches() {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveRecentSearch(query) {
  const recent = getRecentSearches()
  const filtered = recent.filter((q) => q !== query)
  const updated = [query, ...filtered].slice(0, MAX_RECENT)
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_SEARCHES_KEY)
}

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [validation, setValidation] = useState('')
  const [recent, setRecent] = useState(getRecentSearches())
  const [retryCount, setRetryCount] = useState(0)
  const { results, loading, error, searchFood } = useFoodSearch()
  const navigate = useNavigate()

  useEffect(() => {
    setRecent(getRecentSearches())
  }, [])

  function handleChange(event) {
    const value = event.target.value
    setQuery(value)

    if (validation && value.trim().length >= 2) {
      setValidation('')
    }
  }

  async function performSearch(searchTerm) {
    const trimmed = searchTerm.trim()

    if (!trimmed) {
      setValidation('Please enter a search term.')
      return
    }

    if (trimmed.length < 2) {
      setValidation('Search term must be at least 2 characters.')
      return
    }

    setValidation('')
    setRetryCount(0)
    await searchFood(trimmed)
    saveRecentSearch(trimmed)
    setRecent(getRecentSearches())
  }

  async function handleSubmit(event) {
    event.preventDefault()
    await performSearch(query)
  }

  async function handleRecentClick(term) {
    setQuery(term)
    await performSearch(term)
  }

  async function handleRetry() {
    setRetryCount((c) => c + 1)
    await performSearch(query)
  }

  function handleSelectProduct(code) {
    navigate(`/product/${code}`)
  }

  const showRecent = !loading && results.length === 0 && !error && query === ''

  return (
    <main className="page-shell">
      <section className="home-hero">
        <div>
          <p className="eyebrow">Search Food Facts</p>
          <h1>Find nutrition details by product name or barcode.</h1>
          <p className="hero-copy">
            Search the Open Food Facts dataset, explore products, and save items for later review.
          </p>
        </div>
      </section>

      <section className="content-block">
        <SearchBar value={query} onChange={handleChange} onSubmit={handleSubmit} disabled={loading} />
        <ErrorMessage message={validation || error} />
        {error && (
          <button type="button" className="button secondary" onClick={handleRetry} style={{ marginTop: '12px' }}>
            Try again
          </button>
        )}
      </section>

      {showRecent && recent.length > 0 && (
        <section className="content-block">
          <div className="recent-searches">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <p className="eyebrow">Recent searches</p>
              <button
                type="button"
                className="button-link"
                onClick={() => {
                  clearRecentSearches()
                  setRecent([])
                }}
              >
                Clear
              </button>
            </div>
            <div className="recent-chips">
              {recent.map((term) => (
                <button
                  key={term}
                  type="button"
                  className="chip"
                  onClick={() => handleRecentClick(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="content-block">
        {loading ? (
          <div className="grid-list">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : results.length === 0 && !error ? (
          <div className="status-panel">Start a search to discover food products.</div>
        ) : null}

        {results.length > 0 ? (
          <div className="grid-list">
            {results.map((product) => (
              <FoodCard
                key={product.code}
                product={product}
                onClick={() => handleSelectProduct(product.code)}
              />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  )
}
