import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import api from '../api'
import './Updates.css'

function Updates() {
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadUpdates()
  }, [])

  const loadUpdates = async () => {
    try {
      setLoading(true)
      const data = await api.updates.getAll()
      const updatesData = (data.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setUpdates(updatesData)
      if (updatesData.length > 0) {
        setOpenId(updatesData[0].documentId)
      }
    } catch (error) {
      console.error('Error loading updates:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Загрузка обновлений...</div>
  if (updates.length === 0) return <div className="empty">Пока нет обновлений</div>

  const filteredUpdates = updates.filter(update => {
    const matchesCategory = filter === 'all' || update.updateType === filter
    const cleanContent = update.content
      ?.replace(/!\[.*?\]\(.*?\)/g, '')
      ?.replace(/\[.*?\]\(.*?\)/g, '')
      ?.replace(/```[\s\S]*?```/g, '')
      ?.replace(/`.*?`/g, '')
      ?.toLowerCase() || ''
    const matchesSearch =
      update.version?.toLowerCase().includes(search.toLowerCase()) ||
      cleanContent.includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="updates-page">
      <div className="updates-header">
        <h1>История изменений и обновлений Castle Fight</h1>
      </div>

      <div className="filters">
        <div className="filters-top">
          <div className="category-filters">
            <button
              data-cat="all"
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Все
            </button>
            <button
              data-cat="ребаланс"
              className={`filter-btn ${filter === 'ребаланс' ? 'active' : ''}`}
              onClick={() => setFilter('ребаланс')}
            >
              ⚖️ Ребаланс
            </button>
            <button
              data-cat="игра"
              className={`filter-btn ${filter === 'игра' ? 'active' : ''}`}
              onClick={() => setFilter('игра')}
            >
              🎮 Игра
            </button>
            <button
              data-cat="багфикс"
              className={`filter-btn ${filter === 'багфикс' ? 'active' : ''}`}
              onClick={() => setFilter('багфикс')}
            >
              🐛 Багфикс
            </button>
          </div>

          <div className="search-wrapper-updates">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Поиск по версии или тексту..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="timeline">
        {filteredUpdates.map((update, index) => (
          <UpdateCard
            key={update.documentId}
            update={update}
            isOpen={openId === update.documentId}
            isLatest={index === 0}
            onToggle={() => setOpenId(openId === update.documentId ? null : update.documentId)}
          />
        ))}
      </div>
    </div>
  )
}

function UpdateCard({ update, isOpen, isLatest, onToggle }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getCategoryConfig = (cat) => {
    const configs = {
      'ребаланс': { icon: '⚖️', color: '#FFC107', bg: 'rgba(255,193,7,0.15)' },
      'игра': { icon: '🎮', color: '#4FC3F7', bg: 'rgba(79,195,247,0.15)' },
      'багфикс': { icon: '🐛', color: '#FF7043', bg: 'rgba(255,112,67,0.15)' },
    }
    return configs[cat] || { icon: '📌', color: '#90e0ef', bg: 'rgba(144,224,239,0.15)' }
  }

  const config = getCategoryConfig(update.updateType)

  return (
    <div className={`update-card ${isOpen ? 'open' : ''} ${isLatest ? 'latest' : ''}`}>
      <div className="update-timeline-marker" style={{ borderColor: config.color }} />
      
      <div className="update-header" onClick={onToggle}>
        <div className="update-left">
          <span className="update-badge" data-cat={update.updateType} style={{ color: config.color }}>
            {config.icon} {getCategoryLabel(update.updateType)}
          </span>
          <span className="update-version">{update.version}</span>
        </div>
        
        <div className="update-right">
          <span className="update-date">{formatDate(update.date)}</span>
          <button className={`accordion-btn ${isOpen ? 'open' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="update-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {update.content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}

function getCategoryLabel(cat) {
  const labels = { 'ребаланс': 'Ребаланс', 'игра': 'Игра', 'багфикс': 'Багфикс' }
  return labels[cat] || cat
}

export default Updates
