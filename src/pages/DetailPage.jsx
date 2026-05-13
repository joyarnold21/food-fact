import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'
import ErrorMessage from '../components/ErrorMessage.jsx'
import NutritionRow from '../components/NutritionRow.jsx'
import { addItem, removeItem } from '../store/savedSlice.js'

function formatNutrient(value, nutrientName) {
  if (!value || value === 'N/A') return null

  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(numValue)) return null

  const rounded = numValue.toFixed(1)

  const unitMap = {
    energy: 'kcal',
    'energy-kcal': 'kcal',
    'energy-kj': 'kJ',
    fat: 'g',
    'saturated-fat': 'g',
    'trans-fat': 'g',
    carbohydrates: 'g',
    sugars: 'g',
    fiber: 'g',
    proteins: 'g',
    salt: 'g',
    sodium: 'mg',
  }

  const unit = unitMap[nutrientName.toLowerCase()] || 'g'
  return { value: rounded, unit }
}

export default function DetailPage() {
  const { barcode } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const savedItems = useSelector((state) => state.saved.items)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isSaved = savedItems.some((item) => item.code === barcode)

  useEffect(() => {
    let cancelled = false

    async function loadProduct() {
      setLoading(true)
      setError('')
      setProduct(null)

      try {
        const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`, {
          timeout: 10000,
        })

        if (cancelled) return

        if (!response.data || response.data.status !== 1) {
          setError('Product not found. Please check the barcode and try again.')
          return
        }

        setProduct(response.data.product)
      } catch (err) {
        if (cancelled) return

        if (axios.isAxiosError(err)) {
          if (err.response) {
            setError('Server error fetching product details. Please try again later.')
          } else if (err.request) {
            setError('Network connection failed. Check your internet connection.')
          } else {
            setError('Unexpected error occurred while loading product details.')
          }
        } else {
          setError('Unknown error occurred while loading product details.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    if (barcode) {
      loadProduct()
    }

    return () => {
      cancelled = true
    }
  }, [barcode])

  function handleToggleSave() {
    if (!product) return

    if (isSaved) {
      dispatch(removeItem(product.code))
    } else {
      dispatch(addItem(product))
    }
  }

  const nutriments = product?.nutriments || {}
  const nutritionRows = [
    { label: 'Energy', key: 'energy' },
    { label: 'Fat', key: 'fat' },
    { label: 'Saturated Fat', key: 'saturated-fat' },
    { label: 'Carbohydrates', key: 'carbohydrates' },
    { label: 'Sugars', key: 'sugars' },
    { label: 'Proteins', key: 'proteins' },
    { label: 'Salt', key: 'salt' },
  ].map((item) => {
    let value = nutriments[item.key]

    if (!value) {
      const altKey = `${item.key}_100g`
      value = nutriments[altKey]
    }

    const formatted = formatNutrient(value, item.key)
    return {
      label: item.label,
      value: formatted?.value || null,
      unit: formatted?.unit || null,
    }
  })

  return (
    <Container component="main" maxWidth="md" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{
          textTransform: 'none',
          mb: 3,
        }}
      >
        Back
      </Button>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 600, mb: 1 }}>
          PRODUCT DETAILS
        </Typography>
        <Typography variant="h2">Barcode {barcode}</Typography>
      </Box>

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <ErrorMessage message={error} />
      ) : product ? (
        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                overflow: 'hidden',
                backgroundColor: '#f9fafb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '1',
              }}
            >
              <img
                src={product.image_front_thumb_url || product.image_front_url || 'https://via.placeholder.com/400'}
                alt={product.product_name || 'Product image'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Paper>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={8}>
            <Box>
              <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 600, mb: 1 }}>
                {product.brands || 'Brand unknown'}
              </Typography>
              <Typography variant="h4" sx={{ mb: 2 }}>
                {product.product_name || 'Unnamed product'}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
                {product.generic_name || product.categories || 'No additional description available.'}
              </Typography>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Button
                  variant="contained"
                  color={isSaved ? 'error' : 'primary'}
                  startIcon={isSaved ? <DeleteIcon /> : <SaveIcon />}
                  onClick={handleToggleSave}
                >
                  {isSaved ? 'Remove from Saved' : 'Save Item'}
                </Button>
              </Box>

              {/* Saved Status */}
              <Typography
                variant="body2"
                sx={{
                  color: isSaved ? '#10b981' : '#6b7280',
                  fontWeight: 500,
                  mb: 4,
                }}
              >
                {isSaved ? '★ Saved in your list' : 'Not saved yet'}
              </Typography>

              {/* Nutrition Section */}
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                Nutrition per 100g
              </Typography>
              <Paper variant="outlined">
                {nutritionRows.map((item, index) => (
                  <NutritionRow
                    key={index}
                    label={item.label}
                    value={item.value}
                    unit={item.unit}
                  />
                ))}
              </Paper>
            </Box>
          </Grid>
        </Grid>
      ) : null}
    </Container>
  )
}
