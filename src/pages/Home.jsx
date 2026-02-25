import { Link } from 'react-router-dom'
import './Home.css'

const SECTIONS = [
  {
    id: 'tierlist',
    title: 'Тирлист игроков',
    icon: '🏆',
    description: 'Официальный тирлист игроков по режиму CastleFight сервера Cristalix. Распределение игроков по тирам с помощью уникальной поинтовой системы, основанной на результатах турниров.',
    link: '/tierlist',
    color: 'gold',
  },
  {
    id: 'points',
    title: 'Поинтовая система',
    icon: '📊',
    description: 'Как начисляются очки за турниры, формулы расчёта, коэффициенты сложности и базовые значения.',
    link: '/tierlist/points',
    color: 'cyan',
  },
  {
    id: 'updates',
    title: 'Обновления CF',
    icon: '📰',
    description: 'Удобная история патчей режима: ребалансы, обновления механик, обновления визуала, багфиксы.',
    link: '/updates',
    color: 'blue',
  },
]

const SOON_SECTIONS = [
  {
    id: 'tournaments',
    title: 'Турниры',
    icon: '🎮',
    description: 'Информация о предстоящих и прошедших турнирах, учитываемых в поинтовой системе. Результаты, призовые, расписание.',
    link: '#',
    color: 'purple',
    soon: true,
  },
  {
    id: 'calibration',
    title: 'Калибровка',
    icon: '🎯',
    description: 'Система калибровки игроков. Основной способ попадания в тирлист, критерии оценивания.',
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
            CFTiers
          </h1>
          <p className="hero-subtitle">
            Сайт проекта по режиму <span className="accent">СastleFight</span>
          </p>
          <p className="hero-description">
            Добро пожаловать на CFTiers — проект для отслеживания альтернативного турнирного рейтинга игроков по различным режимам игры. Здесь ты найдёшь актуальный тирлист, информацию об обновлениях CF, всю информацию об актуальных турнирах  режима.
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
          <span className="card-link-btn">
            Перейти
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      )}
    </CardWrapper>
  )
}

export default Home
