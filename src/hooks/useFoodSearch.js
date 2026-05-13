import { useState } from 'react'
import axios from 'axios'

const API_ENDPOINT = 'https://world.openfoodfacts.org/cgi/search.pl'
const API_TIMEOUT = 15000
const MAX_RETRIES = 2

export default function useFoodSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function searchFood(searchTerm, retryAttempt = 0) {
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

      const response = await axios.get(API_ENDPOINT, { params, timeout: API_TIMEOUT })
      const products = Array.isArray(response.data.products) ? response.data.products : []
      const filtered = products.filter(
        (product) => product?.product_name && product?.image_front_thumb_url,
      )

      if (filtered.length === 0) {
        setResults([])
        setError('No products found for this search. Try different keywords.')
      } else {
        setResults(filtered)
      }
    } catch (err) {
      let errorMsg = 'An unknown error occurred during search.'

      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMsg = 'Server returned an error. Please try again later.'
        } else if (err.request) {
          errorMsg = 'Unable to connect. Check your internet connection and try again.'
        } else if (err.code === 'ECONNABORTED') {
          errorMsg = 'Search timed out. Please try again with a simpler search term.'
        }
      }

      setError(errorMsg)

      if (retryAttempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (retryAttempt + 1)))
        return searchFood(searchTerm, retryAttempt + 1)
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
