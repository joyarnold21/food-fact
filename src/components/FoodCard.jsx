export default function FoodCard({ product, onClick }) {
  const name = product.product_name || 'Unknown product'
  const brand = product.brands || product.brand || 'Unknown brand'

  return (
    <button type="button" className="food-card" onClick={onClick}>
      <div className="food-card-image-wrap">
        <img
          className="food-card-image"
          src={product.image_front_thumb_url}
          alt={`Photo of ${name}`}
          loading="lazy"
        />
      </div>
      <div className="food-card-body">
        <div>
          <h3>{name}</h3>
          <p className="food-card-brand">{brand}</p>
        </div>
        <span className="food-card-code">{product.code}</span>
      </div>
    </button>
  )
}
