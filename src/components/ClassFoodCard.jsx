import React, { Component } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'

/**
 * ClassFoodCard
 * 
 * Learning reference: Class-based React component
 * Demonstrates lifecycle methods: constructor, componentDidMount, componentWillUnmount, render
 * This component is NOT used in production UI, kept only as documentation reference.
 */
class ClassFoodCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
    }
    console.log('[ClassFoodCard] constructor called for:', props.product?.product_name || 'Unknown')
  }

  componentDidMount() {
    console.log('[ClassFoodCard] componentDidMount called for:', this.props.product?.product_name || 'Unknown')
  }

  componentWillUnmount() {
    console.log('[ClassFoodCard] componentWillUnmount called for:', this.props.product?.product_name || 'Unknown')
  }

  handleExpandClick = () => {
    this.setState((prevState) => {
      const newState = !prevState.expanded
      console.log('[ClassFoodCard] expanded state toggled to:', newState)
      return { expanded: newState }
    })
  }

  render() {
    const { product } = this.props
    const { expanded } = this.state

    const name = product?.product_name || 'Unknown product'
    const brand = product?.brands || product?.brand || 'Unknown brand'
    const image = product?.image_front_thumb_url || 'https://via.placeholder.com/200'

    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardHeader
          action={
            <IconButton
              onClick={this.handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          }
          title={name}
          subheader={brand}
        />
        <CardMedia
          component="img"
          image={image}
          alt={`Photo of ${name}`}
          sx={{
            height: 200,
            objectFit: 'cover',
            backgroundColor: '#f0f0f0',
          }}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            Code: <strong>{product?.code}</strong>
          </Typography>
        </CardContent>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent sx={{ bgcolor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" display="block" sx={{ color: '#6b7280', mb: 1 }}>
                Component Type: Class-based React Component
              </Typography>
              <Typography variant="caption" display="block" sx={{ color: '#6b7280', mb: 2 }}>
                Purpose: Learning Reference - Demonstrates lifecycle methods
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ mb: 1, color: '#374151' }}>
              <strong>Lifecycle Methods Demonstrated:</strong>
            </Typography>
            <ul style={{ margin: '0 0 12px 16px', color: '#374151', fontSize: '0.875rem' }}>
              <li>constructor() - Called during class instantiation</li>
              <li>componentDidMount() - Called after component renders</li>
              <li>componentWillUnmount() - Called before component is removed</li>
              <li>render() - Returns JSX to display</li>
            </ul>

            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.75rem', fontStyle: 'italic' }}>
              💡 Check browser console to see lifecycle method logs for this component.
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    )
  }
}

export default ClassFoodCard
