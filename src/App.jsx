import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Tierlist from './pages/Tierlist'
import Updates from './pages/Updates'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <h1>🏰 CF Tierlist</h1>
          <nav className="nav">
            <Link to="/">Тирлист</Link>
            <Link to="/updates">Обновления</Link>
          </nav>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Tierlist />} />
            <Route path="/updates" element={<Updates />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>CF Tierlist v2.0 • Данные обновляются автоматически</p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
