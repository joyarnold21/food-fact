import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { removeItem } from '../store/savedSlice.js'

export default function SavedPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const savedItems = useSelector((state) => state.saved.items)

  function handleRemove(code) {
    dispatch(removeItem(code))
  }

  function handleView(code) {
    navigate(`/product/${code}`)
  }

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="body2" component="p" sx={{ color: '#6b7280', fontWeight: 600, mb: 1 }}>
          SAVED ITEMS
        </Typography>
        <Typography variant="h2" sx={{ mb: 2 }}>
          Your saved products
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Keep your favorite products in one place and jump straight to details.
        </Typography>
      </Box>

      {/* Content */}
      {savedItems.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            backgroundColor: '#f9fafb',
            borderRadius: 2,
            border: '1px solid #e5e7eb',
          }}
        >
          <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
            No saved items yet.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Search for a product and save it from the detail view.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {savedItems.map((product) => (
            <Grid key={product.code} item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <CardContent>
                  <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                    {product.product_name || 'Unnamed product'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {product.brands || 'Unknown brand'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ gap: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleView(product.code)}
                    sx={{ flex: 1 }}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleRemove(product.code)}
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}
