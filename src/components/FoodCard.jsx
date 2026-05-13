import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'

export default function FoodCard({ product, onClick }) {
  const name = product.product_name || 'Unknown product'
  const brand = product.brands || product.brand || 'Unknown brand'

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardActionArea onClick={onClick} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          image={product.image_front_thumb_url || 'https://via.placeholder.com/200'}
          alt={`Photo of ${name}`}
          sx={{
            height: 200,
            objectFit: 'cover',
            backgroundColor: '#f0f0f0',
          }}
        />
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
              {name}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {brand}
            </Typography>
          </Box>
          <Chip label={product.code} size="small" variant="outlined" />
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
