import { useNavigate } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage.jsx'

export default function SavedPage({ saved, dispatch }) {
  const navigate = useNavigate()

  function handleRemove(code) {
    dispatch({ type: 'REMOVE', payload: { code } })
  }

  function handleView(code) {
    navigate(`/product/${code}`)
  }

  return (
    <main className="page-shell">
      <section className="content-block detail-header">
        <div>
          <p className="eyebrow">Saved items</p>
          <h1>Your saved products</h1>
          <p className="hero-copy">Keep your favorite products in one place and jump straight to details.</p>
        </div>
      </section>

      {saved.length === 0 ? (
        <div className="status-panel">No saved items yet. Search for a product and save it from the detail view.</div>
      ) : (
        <div className="saved-list">
          {saved.map((product) => (
            <article key={product.code} className="saved-card">
              <div>
                <h3>{product.product_name || 'Unnamed product'}</h3>
                <p className="food-card-brand">{product.brands || 'Unknown brand'}</p>
              </div>
              <div className="saved-card-actions">
                <button type="button" className="button secondary" onClick={() => handleView(product.code)}>
                  View Details
                </button>
                <button type="button" className="button danger" onClick={() => handleRemove(product.code)}>
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      {saved.length > 0 ? <ErrorMessage message="You can remove saved items or review their details." /> : null}
    </main>
  )
}
