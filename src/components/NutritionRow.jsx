import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function NutritionRow({ label, value, unit }) {
  if (!value || value === 'N/A') return null

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1.5,
        px: 2,
        borderBottom: '1px solid #e5e7eb',
        '&:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: '#2563eb',
        }}
      >
        {value} {unit && <span style={{ color: '#6b7280', fontWeight: 500 }}>{unit}</span>}
      </Typography>
    </Box>
  )
}
