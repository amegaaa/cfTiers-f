// Хранилище маппинга username → tier
const tierMap = new Map()

// Установить тир для игрока
export function setPlayerTier(username, tier) {
  if (!username) return
  tierMap.set(username.toLowerCase(), tier)
}

// Получить тир игрока
export function getPlayerTier(username) {
  if (!username) return null
  return tierMap.get(username.toLowerCase())
}

// Установить несколько игроков сразу
export function setPlayersTiers(players) {
  players.forEach(player => {
    if (player.username && player.tier) {
      setPlayerTier(player.username, player.tier)
    }
  })
}

// Очистить хранилище
export function clearTierMap() {
  tierMap.clear()
}

// Получить CSS класс цвета для тира
export function getTierColorClass(tier) {
  if (!tier) return ''
  const tierLower = tier.toLowerCase()
  if (tierLower === 't1') return 'tier-color-t1'
  if (tierLower === 't2') return 'tier-color-t2'
  if (tierLower === 't3') return 'tier-color-t3'
  if (tierLower === 't4') return 'tier-color-t4'
  if (tierLower === 't5') return 'tier-color-t5'
  return ''
}

// Получить цвет ника на основе сохранённого тира
export function getUsernameColorClass(username) {
  const tier = getPlayerTier(username)
  return getTierColorClass(tier)
}
