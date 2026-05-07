export default function SearchBar({ value, onChange, onSubmit, disabled }) {
  return (
    <form className="search-form" onSubmit={onSubmit} noValidate>
      <label className="search-label" htmlFor="food-search">
        Search for food products by name or keyword
      </label>
      <div className="search-controls">
        <input
          id="food-search"
          type="search"
          value={value}
          onChange={onChange}
          placeholder="e.g. pizza, cereal, chocolate"
          className="search-input"
          aria-label="Food search"
          disabled={disabled}
        />
        <button type="submit" className="button primary" disabled={disabled}>
          Search
        </button>
      </div>
    </form>
  )
}
