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
let loadError = null

/**
 * Проверка работоспособности API
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/api/cristalix/health`, {
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) return false
    const data = await response.json()
    return data.status === 'ok'
  } catch (error) {
    console.warn('Cristalix health check failed:', error.message)
    return false
  }
}

/**
 * Загрузить ВСЕ скины одним запросом к /api/cristalix/skins
 * Вызывается один раз при старте приложения
 */
export async function preloadAllSkins() {
  if (isLoaded || isLoading) return
  isLoading = true

  try {
    const response = await fetch(`${API_URL}/api/cristalix/skins`, {
      signal: AbortSignal.timeout(30000),
    })

    if (!response.ok) {
      console.warn(`Failed to preload skins: ${response.status}`)
      loadError = `HTTP ${response.status}`
      return
    }

    const data = await response.json()

    // data.skins = { "ник": { uuid, skinUrl }, ... }
    if (data.skins && Object.keys(data.skins).length > 0) {
      Object.entries(data.skins).forEach(([username, profile]) => {
        if (profile?.skinUrl) {
          skinCache.set(username.toLowerCase(), profile.skinUrl)
        }
      })
    }

    console.log(`Cristalix: загружено ${skinCache.size} из ${data.total} скинов`)
    isLoaded = true

  } catch (error) {
    console.error('Cristalix preload error:', error.message)
    loadError = error.message
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

  // Fallback: индивидуальный запрос (только если API работает)
  if (!loadError || loadError === null) {
    try {
      const response = await fetch(`${API_URL}/api/cristalix/skin/${username}`, {
        signal: AbortSignal.timeout(10000),
      })
      if (!response.ok) return null

      const data = await response.json()
      const skinUrl = data?.skinUrl

      if (skinUrl) {
        skinCache.set(username.toLowerCase(), skinUrl)
      }

      return skinUrl || null
    } catch (error) {
      console.error(`Cristalix fallback error for ${username}:`, error.message)
      loadError = error.message
      return null
    }
  }

  return null
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
  loadError = null
}

/**
 * Получить статус загрузки
 */
export function getLoadStatus() {
  return { isLoaded, isLoading, error: loadError, cacheSize: skinCache.size }
}