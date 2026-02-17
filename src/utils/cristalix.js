/**
 * Cristalix утилита для фронтенда
 * Загружает ВСЕ скины ОДНИМ запросом при загрузке страницы
 * Никаких индивидуальных запросов - не превышаем лимит API
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337'

// Локальный кэш: ник → skinUrl
const skinCache = new Map()

// Статус загрузки
let isLoading = false
let isLoaded = false

/**
 * Загрузить ВСЕ скины одним запросом к /api/cristalix/skins
 * Вызывается один раз при старте приложения
 */
export async function preloadAllSkins() {
  if (isLoaded || isLoading) return
  isLoading = true

  try {
    const response = await fetch(`${API_URL}/api/cristalix/skins`)

    if (!response.ok) {
      console.warn(`Failed to preload skins: ${response.status}`)
      return
    }

    const data = await response.json()

    // data.skins = { "ник": { uuid, skinUrl }, ... }
    if (data.skins) {
      Object.entries(data.skins).forEach(([username, profile]) => {
        skinCache.set(username.toLowerCase(), profile.skinUrl)
      })
    }

    console.log(`Cristalix: загружено ${skinCache.size} из ${data.total} скинов`)
    isLoaded = true

  } catch (error) {
    console.error('Cristalix preload error:', error)
  } finally {
    isLoading = false
  }
}

/**
 * Получить URL скина игрока из кэша
 * Если не загружено - запрашивает индивидуально
 */
export async function getSkinByUsername(username) {
  if (!username) return null

  // Сначала смотрим в кэш
  const cached = skinCache.get(username.toLowerCase())
  if (cached) return cached

  // Если предзагрузка ещё не выполнена - запускаем
  if (!isLoaded && !isLoading) {
    await preloadAllSkins()
    const afterLoad = skinCache.get(username.toLowerCase())
    if (afterLoad) return afterLoad
  }

  // Fallback: индивидуальный запрос
  try {
    const response = await fetch(`${API_URL}/api/cristalix/skin/${username}`)
    if (!response.ok) return null

    const data = await response.json()
    const skinUrl = data?.skinUrl

    if (skinUrl) {
      skinCache.set(username.toLowerCase(), skinUrl)
    }

    return skinUrl || null
  } catch (error) {
    console.error(`Cristalix fallback error for ${username}:`, error)
    return null
  }
}

/**
 * Получить прямой URL скина по UUID
 */
export function getSkinUrl(uuid) {
  if (!uuid) return null
  return `https://webdata.c7x.dev/textures/skin/${uuid}.png`
}

/**
 * Сбросить кэш (для отладки)
 */
export function clearCache() {
  skinCache.clear()
  isLoaded = false
}