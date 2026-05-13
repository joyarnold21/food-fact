import { Routes, Route } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import NavBar from './components/NavBar.jsx'
import HomePage from './pages/HomePage.jsx'
import DetailPage from './pages/DetailPage.jsx'
import SavedPage from './pages/SavedPage.jsx'

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <NavBar />

      <Box component="main" sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:barcode" element={<DetailPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e5e7eb',
          py: 3,
          mt: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
            FoodFacts - Powered by OpenFoodFacts API
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default App
