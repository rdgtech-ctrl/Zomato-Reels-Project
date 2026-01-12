import React, { useState } from 'react'
import AppRoutes from './routes/AppRoutes'
import './styles/auth-shared.css'
import './styles/bottom-nav.css'
import './styles/create-food.css'
import './styles/profile.css'
import './styles/reels.css'
import './styles/theme.css'




function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AppRoutes />
    </>
  )
}

export default App
