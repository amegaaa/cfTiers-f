import { Link } from 'react-router-dom'
import './Home.css'

const SECTIONS = [
  {
    id: 'tierlist',
    title: 'Тирлист игроков',
    icon: '🏆',
    description: 'Рейтинг игроков сервера Cristalix по общему зачёту. Распределение по тирам от T1 до T5 на основе статистики и калибровок.',
    link: '/',
    color: 'gold',
  },
  {
    id: 'modes',
    title: 'Режимы',
    icon: '⚔️',
    description: 'Топы игроков по игровым режимам: 1x2, 2x2, 4x2. Сравнивай скилл в разных форматах игры.',
    link: '/#modes',
    color: 'diamond',
  },
  {
    id: 'updates',
    title: 'Обновления CF',
    icon: '📰',
    description: 'История изменений тирлиста: ребалансы, новые игроки, обновления механик. Будь в курсе всех изменений!',
    link: '/updates',
    color: 'emerald',
  },
  {
    id: 'guides',
    title: 'Гайды',
    icon: '📚',
    description: 'Полезные материалы и руководства по игре. Советы от топовых игроков и разборы механик.',
    link: '#',
    color: 'blue',
    soon: false,
  },
]

const SOON_SECTIONS = [
  {
    id: 'tournaments',
    title: 'Турниры',
    icon: '🎮',
    description: 'Информация о предстоящих и прошедших турнирах. Результаты, призовые, расписание.',
    link: '#',
    color: 'purple',
    soon: true,
  },
  {
    id: 'calibration',
    title: 'Калибровка',
    icon: '🎯',
    description: 'Система калибровки игроков. Как попасть в тирлист, требования, процесс подтверждения.',
    link: '#',
    color: 'red',
    soon: true,
  },
]

function Home() {
  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="logo-emoji">🏰</span> CFTiers
          </h1>
          <p className="hero-subtitle">
            Официальный тирлист игроков сервера <span className="accent">Cristalix</span>
          </p>
          <p className="hero-description">
            Добро пожаловать на CFTiers — проект для отслеживания рейтинга игроков по различным режимам игры.
            Здесь ты найдёшь актуальные топы, историю изменений и полезную информацию об игровом процессе.
          </p>
        </div>
      </div>

      <div className="sections-container">
        <h2 className="sections-title">📖 Оглавление</h2>
        
        <div className="sections-grid">
          {SECTIONS.map(section => (
            <SectionCard key={section.id} {...section} />
          ))}
        </div>
      </div>

      <div className="soon-container">
        <h2 className="soon-title">🚧 В разработке</h2>
        <p className="soon-description">
          Эти разделы скоро появятся на сайте. Следите за обновлениями!
        </p>
        
        <div className="sections-grid">
          {SOON_SECTIONS.map(section => (
            <SectionCard key={section.id} {...section} />
          ))}
        </div>
      </div>
    </div>
  )
}

function SectionCard({ title, icon, description, link, color, soon = false }) {
  const CardWrapper = soon ? 'div' : Link
  
  return (
    <CardWrapper 
      to={link} 
      className={`section-card ${color} ${soon ? 'soon' : ''}`}
    >
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        {soon && <span className="soon-badge">Soon</span>}
      </div>
      
      <h3 className="card-title">{title}</h3>
      
      <p className="card-description">{description}</p>
      
      {!soon && (
        <div className="card-action">
          <span className="card-link-text">Перейти →</span>
        </div>
      )}
    </CardWrapper>
  )
}

export default Home
