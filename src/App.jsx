import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Tierlist from './pages/Tierlist'
import Updates from './pages/Updates'
import './App.css'

const BG_IMAGE = '/bg.jpg'

function AppLayout() {
  const location = useLocation()

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <h1><span className="logo-emoji">🏰</span> CFTiers</h1>
          <nav className="nav">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Тирлист</Link>
            <Link to="/updates" className={location.pathname === '/updates' ? 'active' : ''}>Изменения CF</Link>
          </nav>
        </div>
      </header>

      <div className="main-wrapper" style={{ '--bg-image': `url(${BG_IMAGE})` }}>
        <main className="main">
          <Routes>
            <Route path="/" element={<Tierlist />} />
            <Route path="/updates" element={<Updates />} />
          </Routes>
        </main>
      </div>

      <footer className="footer">
        <p>CFTiers v2.0 • Данные обновляются автоматически</p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App