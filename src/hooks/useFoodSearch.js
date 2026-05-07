import { useState } from 'react'
import axios from 'axios'

export default function useFoodSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function searchFood(searchTerm) {
    setLoading(true)
    setError('')
    setResults([])

    try {
      const params = {
        search_terms: searchTerm,
        search_simple: 1,
        action: 'process',
        json: 1,
      }

      const response = await axios.get('https://world.openfoodfacts.org/cgi/search.pl', { params, timeout: 10000 })
      const products = Array.isArray(response.data.products) ? response.data.products : []
      const filtered = products.filter(
        (product) => product?.product_name && product?.image_front_thumb_url,
      )

      if (filtered.length === 0) {
        setResults([])
        setError('No products found for this search.')
      } else {
        setResults(filtered)
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError('Server returned an error while searching. Please try again later.')
        } else if (err.request) {
          setError('Unable to connect. Check your internet connection and try again.')
        } else {
          setError('An unexpected error occurred during search.')
        }
      } else {
        setError('An unknown error occurred during search.')
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    results,
    loading,
    error,
    searchFood,
  }
}
