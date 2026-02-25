import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import api from '../api'
import './Changelog.css'

function Changelog() {
  const [changelogs, setChangelogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadChangelogs()
  }, [])

  const loadChangelogs = async () => {
    try {
      setLoading(true)
      const data = await api.tierlistChangelog.getAll()
      const sortedData = (data.data || []).sort((a, b) => new Date(b.date) - new Date(a.date))
      setChangelogs(sortedData)
    } catch (error) {
      console.error('Error loading changelogs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Загрузка истории...</div>
  if (changelogs.length === 0) return <div className="empty">История пуста</div>

  const filteredChangelogs = changelogs.filter(log => {
    const searchLower = search.toLowerCase()
    const changesText = Array.isArray(log.changes) 
      ? log.changes.map(b => b.children?.map(c => c.text).join('')).join(' ')
      : (log.changes || '')
    
    return log.version?.toLowerCase().includes(searchLower) ||
           changesText.toLowerCase().includes(searchLower)
  })

  return (
    <div className="changelog-page">
      <div className="changelog-header">
        <h1>
          <span className="changelog-icon">📜</span>
          История тирлиста
        </h1>
        <p className="changelog-subtitle">Все изменения и обновления тирлиста</p>
      </div>

      <div className="changelog-search">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Поиск по версии или тексту..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="changelog-timeline">
        {filteredChangelogs.map((log, index) => (
          <ChangelogCard key={log.documentId} log={log} isLatest={index === 0} />
        ))}
      </div>
    </div>
  )
}

function ChangelogCard({ log, isLatest }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Поддерживаем оба формата: blocks (старые) и richtext (новые)
  const renderChanges = () => {
    if (Array.isArray(log.changes)) {
      // Strapi Blocks формат
      const markdown = log.changes.map(block => {
        if (block.type === 'paragraph') {
          return block.children?.map(child => child.text || '').join('')
        }
        if (block.type === 'heading') {
          return `## ${block.children?.map(child => child.text || '').join('')}`
        }
        if (block.type === 'list') {
          return block.children?.map(item => 
            `- ${item.children?.map(child => child.text || '').join('')}`
          ).join('\n')
        }
        return ''
      }).join('\n\n')
      
      return <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{markdown}</ReactMarkdown>
    }
    
    // Richtext (Markdown) формат
    return <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{log.changes}</ReactMarkdown>
  }

  return (
    <div className={`changelog-card ${isLatest ? 'latest' : ''}`}>
      <div className="changelog-marker" style={{ backgroundColor: '#00b4d8' }} />
      
      <div className="changelog-header-card">
        <div className="changelog-meta">
          <span className="changelog-version">{log.version}</span>
        </div>
        <span className="changelog-date">{formatDate(log.date)}</span>
      </div>

      <div className="changelog-content">
        {renderChanges()}
      </div>
    </div>
  )
}

export default Changelog
