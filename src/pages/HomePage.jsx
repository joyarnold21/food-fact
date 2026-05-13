import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
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
  const { results, loading, error, searchFood } = useFoodSearch()
  const navigate = useNavigate()

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
    await performSearch(query)
  }

  function handleSelectProduct(code) {
    navigate(`/product/${code}`)
  }

  const showRecent = !loading && results.length === 0 && !error && query === ''

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="body2" component="p" sx={{ color: '#6b7280', fontWeight: 600, mb: 1 }}>
          SEARCH FOOD FACTS
        </Typography>
        <Typography variant="h1" sx={{ mb: 2 }}>
          Find nutrition details by product name or barcode.
        </Typography>
        <Typography variant="body1" sx={{ color: '#6b7280', mb: 4 }}>
          Search the Open Food Facts dataset, explore products, and save items for later review.
        </Typography>
      </Box>

      {/* Search Section */}
      <Box sx={{ mb: 6 }}>
        <SearchBar value={query} onChange={handleChange} onSubmit={handleSubmit} disabled={loading} />
        <ErrorMessage message={validation || error} />
        {error && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleRetry}
            sx={{ mt: 2 }}
          >
            Try again
          </Button>
        )}
      </Box>

      {/* Recent Searches */}
      {showRecent && recent.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 600 }}>
              RECENT SEARCHES
            </Typography>
            <Button
              size="small"
              onClick={() => {
                clearRecentSearches()
                setRecent([])
              }}
              sx={{
                textTransform: 'none',
                color: '#6b7280',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Clear
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {recent.map((term) => (
              <Chip
                key={term}
                label={term}
                onClick={() => handleRecentClick(term)}
                variant="outlined"
                color="primary"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Results Section */}
      <Box>
        {loading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid key={i} xs={12} sm={6} md={4}>
                <LoadingCard />
              </Grid>
            ))}
          </Grid>
        ) : results.length === 0 && !error ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              backgroundColor: '#f9fafb',
              borderRadius: 2,
              border: '1px solid #e5e7eb',
            }}
          >
            <Typography variant="body1" color="textSecondary">
              Start a search to discover food products.
            </Typography>
          </Box>
        ) : null}

        {results.length > 0 ? (
          <Grid container spacing={3}>
            {results.map((product) => (
              <Grid key={product.code} xs={12} sm={6} md={4}>
                <FoodCard
                  product={product}
                  onClick={() => handleSelectProduct(product.code)}
                />
              </Grid>
            ))}
          </Grid>
        ) : null}
      </Box>
    </Container>
  )
}
