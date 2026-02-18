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
      <h2>📝 Changelog</h2>

      <div className="filters">
        <div className="category-filters">
          <button data-cat="all"      className={`filter-btn ${filter === 'all'      ? 'active' : ''}`} onClick={() => setFilter('all')}>Все</button>
          <button data-cat="ребаланс" className={`filter-btn ${filter === 'ребаланс' ? 'active' : ''}`} onClick={() => setFilter('ребаланс')}>⚖️ Ребаланс</button>
          <button data-cat="игра"     className={`filter-btn ${filter === 'игра'     ? 'active' : ''}`} onClick={() => setFilter('игра')}>🎮 Игра</button>
          <button data-cat="багфикс"  className={`filter-btn ${filter === 'багфикс'  ? 'active' : ''}`} onClick={() => setFilter('багфикс')}>🐛 Багфикс</button>
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

      <div className="updates-list">
        {filteredUpdates.map(update => (
          <UpdateCard
            key={update.documentId}
            update={update}
            isOpen={openId === update.documentId}
            onToggle={() => setOpenId(openId === update.documentId ? null : update.documentId)}
          />
        ))}
      </div>
    </div>
  )
}

function UpdateCard({ update, isOpen, onToggle }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  const getCategoryLabel = (cat) => {
    const labels = { 'ребаланс': 'Ребаланс', 'игра': 'Игра', 'багфикс': 'Багфикс' }
    return labels[cat] || cat
  }

  return (
    <div className="update-card">
      <div className="update-header" onClick={onToggle}>
        <div className="update-meta">
          <span className="update-version">{update.version}</span>
          <span className={`update-category ${update.updateType}`}>
            {getCategoryLabel(update.updateType)}
          </span>
        </div>
        <div className="update-right">
          <span className="update-date">{formatDate(update.date)}</span>
          <button className="accordion-btn">{isOpen ? '▲' : '▼'}</button>
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

export default Updates