// Zoekbalk — tekst zoekt op naam, alleen cijfers gaan direct naar een TMDB-id
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SearchBar({ className = '' }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    // Alleen cijfers? Dan is het waarschijnlijk een TMDB film-id
    if (/^\d+$/.test(trimmed)) {
      navigate(`/movie/${trimmed}`)
      return
    }

    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <form className={`search-bar ${className}`.trim()} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Zoek (naam, TMDB)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Zoek</button>
    </form>
  )
}

export default SearchBar
