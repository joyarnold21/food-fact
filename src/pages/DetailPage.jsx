import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import ErrorMessage from '../components/ErrorMessage.jsx'

export default function DetailPage({ saved, dispatch }) {
  const { barcode } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isSaved = saved.some((item) => item.code === barcode)

  useEffect(() => {
    let cancelled = false

    async function loadProduct() {
      setLoading(true)
      setError('')
      setProduct(null)

      try {
        const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`, {
          timeout: 10000,
        })

        if (cancelled) return

        if (!response.data || response.data.status !== 1) {
          setError('Product not found. Please check the barcode and try again.')
          return
        }

        setProduct(response.data.product)
      } catch (err) {
        if (cancelled) return

        if (axios.isAxiosError(err)) {
          if (err.response) {
            setError('Server error fetching product details. Please try again later.')
          } else if (err.request) {
            setError('Network connection failed. Check your internet connection.')
          } else {
            setError('Unexpected error occurred while loading product details.')
          }
        } else {
          setError('Unknown error occurred while loading product details.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    if (barcode) {
      loadProduct()
    } else {
      setError('No barcode provided for this product.')
      setLoading(false)
    }

    return () => {
      cancelled = true
    }
  }, [barcode])

  function handleToggleSave() {
    if (!product) return

    if (isSaved) {
      dispatch({ type: 'REMOVE', payload: { code: product.code } })
    } else {
      dispatch({ type: 'ADD', payload: product })
    }
  }

  const nutriments = product?.nutriments || {}
  const nutritionRows = [
    { label: 'Energy', value: nutriments['energy-kcal_serving'] || nutriments['energy-kcal'] || nutriments.energy_kcal || 'N/A' },
    { label: 'Fat', value: nutriments.fat || 'N/A' },
    { label: 'Saturated Fat', value: nutriments['saturated-fat'] || nutriments['fat-saturated'] || 'N/A' },
    { label: 'Carbohydrates', value: nutriments.carbohydrates || 'N/A' },
    { label: 'Sugars', value: nutriments.sugars || 'N/A' },
    { label: 'Proteins', value: nutriments.proteins || 'N/A' },
    { label: 'Salt', value: nutriments.salt || nutriments['salt_100g'] || 'N/A' },
  ]

  return (
    <main className="page-shell detail-page">
      <section className="content-block detail-header">
        <button type="button" className="button secondary" onClick={() => navigate(-1)}>
          Back
        </button>
        <div>
          <p className="eyebrow">Product details</p>
          <h1>Barcode {barcode}</h1>
        </div>
      </section>

      {loading ? (
        <div className="status-panel">Loading product details…</div>
      ) : error ? (
        <ErrorMessage message={error} />
      ) : product ? (
        <article className="detail-card">
          <div className="detail-image-wrap">
            <img
              className="detail-image"
              src={product.image_front_thumb_url || product.image_front_url}
              alt={product.product_name || 'Product image'}
            />
          </div>
          <div className="detail-content">
            <div className="detail-meta">
              <p className="eyebrow">{product.brands || 'Brand unknown'}</p>
              <h2>{product.product_name || 'Unnamed product'}</h2>
              <p className="product-subtitle">{product.generic_name || product.categories || 'No additional description available.'}</p>
            </div>

            <div className="detail-actions">
              <button type="button" className="button primary" onClick={handleToggleSave}>
                {isSaved ? 'Remove Item' : 'Save Item'}
              </button>
              <span className="detail-status">{isSaved ? 'Saved in your list' : 'Not saved yet'}</span>
            </div>

            <section className="nutrition-grid">
              {nutritionRows.slice(0, 6).map((item) => (
                <div className="nutrition-item" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </section>
          </div>
        </article>
      ) : null}
    </main>
  )
}
