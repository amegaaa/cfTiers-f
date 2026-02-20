import { useState, useEffect } from 'react'
import { getSkinByUsername } from '../utils/cristalix'
import './PlayerHead.css'

// Дефолтная заглушка (серая текстура)
const DEFAULT_AVATAR = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect fill="%234a4a4a" width="64" height="64"/%3E%3Ctext x="32" y="40" text-anchor="middle" fill="%23888" font-size="24" font-family="Arial"%3E?%3C/text%3E%3C/svg%3E'

function PlayerHead({ username, size = 64 }) {
  const [skinUrl, setSkinUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let mounted = true

    async function loadSkin() {
      if (!username) {
        setError(true)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(false)

        const url = await getSkinByUsername(username)

        if (mounted) {
          if (url) {
            setSkinUrl(url)
            setError(false)
          } else {
            // Игрок не найден или API недоступно - показываем заглушку
            setSkinUrl(DEFAULT_AVATAR)
            setError(false) // Не ошибка, просто нет данных
          }
        }
      } catch (err) {
        console.error('Error loading skin:', err)
        if (mounted) {
          // При ошибке тоже показываем заглушку
          setSkinUrl(DEFAULT_AVATAR)
          setError(false)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadSkin()
    return () => { mounted = false }
  }, [username])

  if (loading) {
    return (
      <div className="player-head-loading" style={{ width: size, height: size }}>
        <div className="spinner" />
      </div>
    )
  }

  // Показываем скин или заглушку
  return (
    <div
      className="player-head"
      style={{
        backgroundImage: `url(${skinUrl || DEFAULT_AVATAR})`,
        width: size,
        height: size,
        backgroundSize: `${size * 8}px ${size * 8}px`,
        backgroundPosition: `-${size}px -${size}px`,
      }}
      title={username}
    />
  )
}

export default PlayerHead