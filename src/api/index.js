const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337'

export const api = {
  players: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/api/players?sort=points:desc&populate=*`)
      return response.json()
    },
  },
  updates: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/api/updates?sort=date:desc&populate=*`)
      return response.json()
    },
  },
}

export default api