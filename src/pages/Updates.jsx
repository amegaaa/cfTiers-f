import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import api from '../api'
import './Updates.css'

const CATEGORIES = {
  'ребаланс': { icon: '⚖️', label: 'Ребаланс', color: '#FFC107', gradient: 'linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 152, 0, 0.1))', borderColor: '#FFC107' },
  'игра': { icon: '🎮', label: 'Игра', color: '#4FC3F7', gradient: 'linear-gradient(135deg, rgba(79, 195, 247, 0.2), rgba(41, 182, 246, 0.1))', borderColor: '#4FC3F7' },
  'багфикс': { icon: '🐛', label: 'Багфикс', color: '#FF7043', gradient: 'linear-gradient(135deg, rgba(255, 112, 67, 0.2), rgba(244, 81, 30, 0.1))', borderColor: '#FF7043' },
}

const UPDATE_IMAGE = '/update.jpg'

function Updates() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [updates, setUpdates] = useState([])
  const [selectedUpdate, setSelectedUpdate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadUpdates()
  }, [])

  useEffect(() => {
    if (id) {
      const update = updates.find(u => u.documentId === id)
      setSelectedUpdate(update || null)
    } else {
      setSelectedUpdate(null)
    }
  }, [id, updates])

  const loadUpdates = async () => {
    try {
      setLoading(true)
      const data = await api.updates.getAll()
      const updatesData = (data.data || []).sort((a, b) => new Date(b.date) - new Date(a.date))
      setUpdates(updatesData)
    } catch (error) {
      console.error('Error loading updates:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Загрузка обновлений...</div>

  if (selectedUpdate) {
    return (
      <UpdateDetail
        update={selectedUpdate}
        onBack={() => navigate('/updates')}
      />
    )
  }

  const filteredUpdatesList = updates.filter(update => {
    const updateTypes = update.updateType?.map(t => t.type) || []
    const matchesCategory = filter === 'all' || updateTypes.some(t => t === filter)
    return matchesCategory
  })

  return (
    <div className="updates-page">
      <div className="updates-hero">
        <div className="updates-hero-content">
          <h1 className="updates-hero-title">Обновления</h1>
          <p className="updates-hero-subtitle">История изменений и патчи игры</p>
        </div>
        <div className="updates-hero-filters">
          <button
            className={`hero-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Все
          </button>
          {Object.entries(CATEGORIES).map(([key, config]) => (
            <button
              key={key}
              className={`hero-filter-btn ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(key)}
              style={{ borderColor: filter === key ? config.color : 'rgba(255,255,255,0.2)' }}
            >
              {config.icon} {config.label}
            </button>
          ))}
        </div>
      </div>

      <div className="updates-grid">
        {filteredUpdatesList.map((update) => (
          <UpdateCard
            key={update.documentId}
            update={update}
            onClick={() => navigate(`/updates/${update.documentId}`)}
          />
        ))}
      </div>

      {filteredUpdatesList.length === 0 && (
        <div className="empty-state">
          <p>Обновления не найдены</p>
        </div>
      )}
    </div>
  )
}

function UpdateCard({ update, onClick }) {
  const updateTypes = update.updateType?.map(t => t.type) || []

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="update-card-grid" onClick={onClick}>
      <div className="update-card-image" style={{ backgroundImage: `url(${UPDATE_IMAGE})` }}>
        <div className="update-card-overlay" />
      </div>
      <div className="update-card-body">
        <div className="update-card-content-wrapper">
          <div className="update-card-tags">
            {updateTypes.map(type => {
              const config = CATEGORIES[type] || CATEGORIES['ребаланс']
              return (
                <span
                  key={type}
                  className="update-card-tag"
                  data-cat={type}
                  style={{ borderColor: config.color, color: config.color }}
                >
                  {config.icon} {config.label}
                </span>
              )
            })}
          </div>
          <h3 className="update-card-version-large">{update.version}</h3>
        </div>
        <div className="update-card-footer">
          <span className="update-card-date">
            📅 {formatDate(update.date)}
          </span>
          <button className="update-card-read">
            <span>Читать</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3.33301 8H12.6663" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.66699 3.33334L12.667 8.00001L8.66699 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function UpdateDetail({ update, onBack }) {
  const updateTypes = update.updateType?.map(t => t.type) || []
  
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const primaryType = updateTypes[0] || 'ребаланс'
  const config = CATEGORIES[primaryType] || CATEGORIES['ребаланс']

  return (
    <div className="update-detail">
      <button className="back-btn" onClick={onBack}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Назад к списку
      </button>
      
      <div className="detail-header">
        <div className="detail-left">
          <h1 className="detail-version">{update.version}</h1>
          <span className="detail-date">{formatDate(update.date)}</span>
        </div>
        
        <div className="detail-types">
          {updateTypes.map(type => {
            const catConfig = CATEGORIES[type] || CATEGORIES['ребаланс']
            return (
              <span
                key={type}
                className="detail-type-badge"
                data-cat={type}
                style={{ color: catConfig.color }}
              >
                {catConfig.icon} {catConfig.label}
              </span>
            )
          })}
        </div>
      </div>
      
      <div className="detail-content">
        <UpdateContent update={update} />
      </div>
    </div>
  )
}

function UpdateContent({ update, preview = false }) {
  const sections = []
  
  if (update.game) {
    sections.push({ key: 'game', title: '🎮 Игра', content: update.game })
  }
  if (update.rebalance) {
    sections.push({ key: 'rebalance', title: '⚖️ Ребаланс', content: update.rebalance })
  }
  if (update.bugfix) {
    sections.push({ key: 'bugfix', title: '🐛 Багфикс', content: update.bugfix })
  }
  
  if (sections.length === 0) {
    return update.content ? (
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {update.content}
      </ReactMarkdown>
    ) : null
  }
  
  return (
    <>
      {sections.map((section, index) => (
        <div key={section.key} className="update-section">
          {index > 0 && <div className="section-divider" />}
          <h3 className="section-title">{section.title}</h3>
          <div className="section-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {section.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </>
  )
}

export default Updates
