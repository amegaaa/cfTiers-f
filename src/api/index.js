const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337'

export const api = {
  players: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/api/players?sort=points:desc&populate=*&pagination[limit]=100`)
      return response.json()
    },
  },
  modePlayers: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/api/mode-players?sort=points:desc&populate=*&pagination[limit]=100`)
      return response.json()
    },
  },
  updates: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/api/updates?sort=date:desc&populate=*&pagination[limit]=100`)
      return response.json()
    },
  },
  tierlistChangelog: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/api/tierlist-changelogs?sort=date:desc&populate=*&pagination[limit]=100`)
      return response.json()
    },
  },
}

export default api