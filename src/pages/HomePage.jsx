import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar.jsx'
import FoodCard from '../components/FoodCard.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import useFoodSearch from '../hooks/useFoodSearch.js'

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [validation, setValidation] = useState('')
  const { results, loading, error, searchFood } = useFoodSearch()
  const navigate = useNavigate()

  function handleChange(event) {
    const value = event.target.value
    setQuery(value)

    if (validation && value.trim().length >= 2) {
      setValidation('')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmed = query.trim()

    if (!trimmed) {
      setValidation('Please enter a search term.')
      return
    }

    if (trimmed.length < 2) {
      setValidation('Search term must be at least 2 characters.')
      return
    }

    setValidation('')
    await searchFood(trimmed)
  }

  function handleSelectProduct(code) {
    navigate(`/product/${code}`)
  }

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
      </section>

      <section className="content-block">
        {loading ? (
          <div className="status-panel">Loading products…</div>
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
