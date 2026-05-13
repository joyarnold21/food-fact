import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Box from '@mui/material/Box'

export default function LoadingCard() {
  return (
    <Card>
      <Skeleton
        variant="rectangular"
        width="100%"
        height={200}
        sx={{ bgcolor: '#e0e0e0' }}
      />
      <CardContent>
        <Box sx={{ mt: 1 }}>
          <Skeleton variant="text" width="80%" sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />
          <Skeleton variant="text" width="40%" />
        </Box>
      </CardContent>
    </Card>
  )
}
