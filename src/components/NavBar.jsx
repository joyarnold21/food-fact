import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function NavBar() {
  const savedCount = useSelector((state) => state.saved.items.length)

  return (
    <AppBar position="sticky" sx={{ mb: 4 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 700,
            fontSize: '1.5rem',
            color: 'white',
          }}
        >
          FoodFacts
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={NavLink}
            to="/"
            end
            sx={{
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              '&.active': {
                textDecoration: 'underline',
              },
            }}
          >
            Home
          </Button>

          <Button
            color="inherit"
            component={NavLink}
            to="/saved"
            sx={{
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              '&.active': {
                textDecoration: 'underline',
              },
            }}
          >
            <Badge
              badgeContent={savedCount}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#ef4444',
                  color: '#ef4444',
                },
              }}
            >
              <span>Saved Items</span>
            </Badge>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
