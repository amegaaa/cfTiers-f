import { useState, useEffect } from 'react'
import api from '../api'
import PlayerHead from '../components/PlayerHead'
import { preloadAllSkins } from '../utils/cristalix'
import { setPlayersTiers, getUsernameColorClass } from '../utils/tierColors'
import './Tierlist.css'

const TABS = [
  { key: 'overall',  label: 'Overall', icon: '🏆' },
  { key: 'mode_1x2', label: '1x2',     icon: '⚔️' },
  { key: 'mode_2x2', label: '2x2',     icon: '🧱' },
  { key: 'mode_4x2', label: '4x2',     icon: '📦' },
]

function Tierlist() {
  const [tab, setTab] = useState('overall')
  const [players, setPlayers] = useState([])
  const [modePlayers, setModePlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    try {
      setLoading(true)
      const [overallData, modeData] = await Promise.all([
        api.players.getAll(),
        api.modePlayers.getAll(),
      ])

      const overallList = (overallData.data || [])
        .sort((a, b) => b.points - a.points)
        .map((p, i) => ({ ...p, position: i + 1 }))

      setPlayers(overallList)
      setModePlayers(modeData.data || [])
      
      // Сохраняем маппинг username → tier для всех игроков из overall
      setPlayersTiers(overallList)
      
      preloadAllSkins()
    } catch (error) {
      console.error('Error loading players:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Загрузка тирлиста...</div>

  return (
    <div className="tierlist-page">
      <div className="tierlist-header">
        <div className="mode-tabs">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              className={`mode-tab ${tab === key ? 'active' : ''}`}
              onClick={() => { setTab(key); setSearch('') }}
            >
              <span className="mode-tab-icon">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        <div className="search-wrapper">
          <div className="search-wrapper-inner">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Поиск по никнейму..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div key={tab} className="tab-content">
        {tab === 'overall' ? (
          <OverallView players={players} search={search} />
        ) : (
          <ModeView players={modePlayers} mode={tab} search={search} />
        )}
      </div>
    </div>
  )
}

function OverallView({ players, search }) {
  const filtered = players.filter(p =>
    p.username?.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = filtered.reduce((acc, p) => {
    const tier = p.tier || 'T5'
    if (!acc[tier]) acc[tier] = []
    acc[tier].push(p)
    return acc
  }, {})

  if (filtered.length === 0) return <div className="empty">Игроки не найдены</div>

  return (
    <div className="tierlist-container">
      {['T1', 'T2', 'T3', 'T4', 'T5'].map(tier => {
        const tierPlayers = grouped[tier]
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
  )
}

function ModeView({ players, mode, search }) {
  const modeList = players
    .filter(p => p.mode === mode)
    .sort((a, b) => b.points - a.points)
    .map((p, i) => ({ ...p, rank: i + 1 }))

  const filtered = modeList.filter(p =>
    p.username?.toLowerCase().includes(search.toLowerCase())
  )

  if (filtered.length === 0) return <div className="empty">Игроки не найдены</div>

  return (
    <div className="mode-table">
      <div className="mode-table-header">
        <span className="col-rank">#</span>
        <span className="col-player">PLAYER</span>
        <span className="col-points">POINTS</span>
      </div>
      {filtered.map((player) => (
        <ModeRow key={player.documentId} player={player} rank={player.rank} />
      ))}
    </div>
  )
}

function ModeRow({ player, rank }) {
  const rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : ''
  const usernameColorClass = getUsernameColorClass(player.username)
  
  return (
    <div className={`mode-row ${rankClass}`}>
      <span className="col-rank">
        <span className={`rank-number ${rankClass}`}>{rank}.</span>
      </span>
      <span className="col-player">
        <PlayerHead username={player.username} size={36} />
        <div className="mode-player-info">
          <span className={`mode-username ${usernameColorClass}`}>{player.username}</span>
        </div>
      </span>
      <span className="col-points">{player.points}</span>
    </div>
  )
}

function PlayerCard({ player }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  const statusClass = player.playerStatus === 'Подтвержден' ? 'confirmed' :
                      player.playerStatus === 'Не подтвержден' ? 'unconfirmed' : 'pending'
  
  const usernameColorClass = getUsernameColorClass(player.username)

  return (
    <div className={`player-card ${player.tier?.toLowerCase()}`}>
      <div className="player-header">
        <div className="player-position">#{player.position}</div>
        <div className="player-points">{player.points} <span className="pts-label">PTS</span></div>
      </div>
      <div className="player-main">
        <PlayerHead username={player.username} size={56} />
        <div className={`player-username ${usernameColorClass}`}>{player.username}</div>
      </div>
      <div className="player-info">
        <div className="player-date">📅 {formatDate(player.confirmationDate)}</div>
        <div className={`player-status ${statusClass}`}>{player.playerStatus}</div>
      </div>
      {player.lastUpdate && <div className="player-update">📦 {player.lastUpdate}</div>}
      {player.updateNote && <div className="player-note">💡 {player.updateNote}</div>}
      {player.videoLink && (
        <a href={player.videoLink} target="_blank" rel="noopener noreferrer" className="player-video-link">
          🎥 Видео калибровки
        </a>
      )}
    </div>
  )
}

export default Tierlist