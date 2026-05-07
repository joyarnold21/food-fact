import { useEffect, useRef } from 'react'

export default function SearchBar({ value, onChange, onSubmit, disabled }) {
  const inputRef = useRef(null)

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <form className="search-form" onSubmit={onSubmit} noValidate>
      <label className="search-label" htmlFor="food-search">
        Search for food products by name or keyword
      </label>
      <div className="search-controls">
        <input
          ref={inputRef}
          id="food-search"
          type="search"
          value={value}
          onChange={onChange}
          placeholder="e.g. pizza, cereal, chocolate (Ctrl+K to focus)"
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
