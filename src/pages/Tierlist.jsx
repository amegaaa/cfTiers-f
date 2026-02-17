import { useState, useEffect } from 'react'
import api from '../api'
import PlayerHead from '../components/PlayerHead'
import { preloadAllSkins } from '../utils/cristalix'
import './Tierlist.css'

function Tierlist() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadPlayers()
  }, [])

  const loadPlayers = async () => {
    try {
      setLoading(true)
      const data = await api.players.getAll()
      const playerList = data.data || []
      console.log('Players loaded:', playerList)
      setPlayers(playerList)

      // Один пакетный запрос для всех скинов после загрузки игроков
      preloadAllSkins()

    } catch (error) {
      console.error('Error loading players:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPlayers = players.filter(player => {
    const matchesTier = filter === 'all' || player.tier === filter
    const matchesSearch = player.username?.toLowerCase().includes(search.toLowerCase())
    return matchesTier && matchesSearch
  })

  const playersWithPositions = filteredPlayers
    .sort((a, b) => b.points - a.points)
    .map((player, index) => ({
      ...player,
      position: index + 1
    }))

  const groupedByTier = playersWithPositions.reduce((acc, player) => {
    const tier = player.tier || 'T5'
    if (!acc[tier]) acc[tier] = []
    acc[tier].push(player)
    return acc
  }, {})

  console.log('Grouped by tier:', groupedByTier)

  if (loading) {
    return <div className="loading">Загрузка тирлиста...</div>
  }

  return (
    <div className="tierlist-page">
      <div className="filters">
        <div className="tier-filters">
          {['all', 'T1', 'T2', 'T3', 'T4', 'T5'].map(tier => (
            <button
              key={tier}
              className={`filter-btn ${filter === tier ? 'active' : ''}`}
              onClick={() => setFilter(tier)}
            >
              {tier === 'all' ? 'Все' : tier}
            </button>
          ))}
        </div>

        <input
          type="text"
          className="search-input"
          placeholder="🔍 Поиск по никнейму..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="tierlist-container">
        {['T1', 'T2', 'T3', 'T4', 'T5'].map(tier => {
          const tierPlayers = groupedByTier[tier]
          if (!tierPlayers || tierPlayers.length === 0) return null

          return (
            <div key={tier} className="tier-section">
              <div className={`tier-badge ${tier.toLowerCase()}`}>{tier}</div>
              <div className="tier-players">
                {tierPlayers.map(player => (
                  <PlayerCard key={player.documentId} player={player} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PlayerCard({ player }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // ФИКС: было confirmationStatus, теперь playerStatus
  const statusClass = player.playerStatus === 'Подтверждён' ? 'confirmed' :
                      player.playerStatus === 'Не подтверждён' ? 'unconfirmed' : 'pending'

  return (
    <div className={`player-card ${player.tier?.toLowerCase()}`}>
      <div className="player-header">
        <div className="player-position">#{player.position}</div>
        <div className="player-points">{player.points}</div>
      </div>

      <div className="player-main">
        <PlayerHead username={player.username} size={64} />
        <div className="player-username">{player.username}</div>
      </div>

      <div className="player-info">
        <div className="player-date">📅 {formatDate(player.confirmationDate)}</div>
        {/* ФИКС: было confirmationStatus, теперь playerStatus */}
        <div className={`player-status ${statusClass}`}>{player.playerStatus}</div>
      </div>

      {player.lastUpdate && (
        <div className="player-update">📦 {player.lastUpdate}</div>
      )}

      {player.updateNote && (
        <div className="player-note">💡 {player.updateNote}</div>
      )}

      {player.videoLink && (
        <a
          href={player.videoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="player-video-link"
        >
          🎥 Видео калибровки
        </a>
      )}
    </div>
  )
}

export default Tierlist