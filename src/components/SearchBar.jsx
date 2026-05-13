import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

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
    <Box component="form" onSubmit={onSubmit} sx={{ width: '100%' }}>
      <Typography
        variant="body1"
        component="label"
        htmlFor="food-search"
        sx={{
          display: 'block',
          mb: 2,
          fontWeight: 500,
          color: '#374151',
        }}
      >
        Search for food products by name or keyword
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          ref={inputRef}
          id="food-search"
          type="search"
          value={value}
          onChange={onChange}
          placeholder="e.g. pizza, cereal, chocolate (Ctrl+K to focus)"
          variant="outlined"
          disabled={disabled}
          sx={{
            flex: 1,
            minWidth: '250px',
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={disabled}
          sx={{
            height: 56,
            px: 3,
          }}
        >
          Search
        </Button>
      </Box>
    </Box>
  )
}
