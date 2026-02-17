import { useState, useEffect } from 'react'
import { getSkinByUsername } from '../utils/cristalix'
import './PlayerHead.css'

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
          } else {
            setError(true)
          }
        }
      } catch (err) {
        console.error('Error loading skin:', err)
        if (mounted) {
          setError(true)
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

  if (error || !skinUrl) {
    return (
      <div className="player-head-error" style={{ width: size, height: size }}>
        <span>?</span>
      </div>
    )
  }

  // Minecraft скин - 64x64px
  // Голова: x=8, y=8, w=8, h=8 (верхний слой: x=40, y=8)
  // Увеличиваем скин в 8 раз → голова занимает весь контейнер
  // backgroundSize = size * 8 (например 64 * 8 = 512px)
  // backgroundPosition = -size * 1 (голова начинается на 1/8 от края)
  return (
    <div
      className="player-head"
      style={{
        backgroundImage: `url(${skinUrl})`,
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