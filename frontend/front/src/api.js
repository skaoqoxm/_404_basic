const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const getToken = () => localStorage.getItem('access_token')

async function request(path, options = {}) {
  const headers = new Headers(options.headers)
  const token = getToken()

  if (options.body && !(options.body instanceof URLSearchParams)) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message = typeof data === 'object' && data?.detail
      ? data.detail
      : `请求失败（${response.status}）`
    throw new Error(message)
  }

  return data
}

export const authApi = {
  register: (payload) => request('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  login: async (username, password) => {
    const data = await request('/api/v1/auth/login', {
      method: 'POST',
      body: new URLSearchParams({ username, password }),
    })
    localStorage.setItem('access_token', data.access_token)
    return data
  },

  me: () => request('/api/v1/auth/me'),

  users: () => request('/api/v1/auth/users'),

  update: (userId, payload) => request(`/api/v1/auth/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }),

  remove: (userId) => request(`/api/v1/auth/users/${userId}`, {
    method: 'DELETE',
  }),

  logout: () => {
    localStorage.removeItem('access_token')
  },
}

export const itemApi = {
  list: () => request('/api/v1/auth/items'),

  getById: (itemId) => request(`/api/v1/auth/${itemId}`),

  create: (payload) => request('/api/v1/auth/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  update: (itemId, payload) => request(`/api/v1/auth/ut/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }),

  remove: (itemId) => request(`/api/v1/auth/del/${itemId}`, {
    method: 'DELETE',
  }),
}

export { API_BASE_URL }
