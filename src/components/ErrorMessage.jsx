import Alert from '@mui/material/Alert'

export default function ErrorMessage({ message }) {
  if (!message) return null

  return (
    <Alert severity="error" sx={{ my: 2 }} role="alert">
      {message}
    </Alert>
  )
}
