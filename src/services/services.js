import api from './api'

// ── AUTH ──────────────────────────────────────────────────────────────────
export const authService = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
}

// ── INCIDENTS ─────────────────────────────────────────────────────────────
export const incidentService = {
  getAll:       (params) => api.get('/incidents', { params }),
  getById:      (id)     => api.get(`/incidents/${id}`),
  getMine:      ()       => api.get('/incidents/my'),
  create:       (data)   => api.post('/incidents', data),
  update:       (id, d)  => api.put(`/incidents/${id}`, d),
  updateStatus: (id, d)  => api.patch(`/incidents/${id}/status`, d),
  delete:       (id)     => api.delete(`/incidents/${id}`),
  getHistory:   (id)     => api.get(`/incidents/${id}/history`),
  getComments:  (id)     => api.get(`/incidents/${id}/comments`),
  addComment:   (id, d)  => api.post(`/incidents/${id}/comments`, d),
}

// ── ZONES ─────────────────────────────────────────────────────────────────
export const zoneService = {
  getAll:     ()       => api.get('/zones'),
  getById:    (id)     => api.get(`/zones/${id}`),
  create:     (data)   => api.post('/zones', data),
  update:     (id, d)  => api.put(`/zones/${id}`, d),
  updateRisk: (id, d)  => api.patch(`/zones/${id}/risk`, d),
  delete:     (id)     => api.delete(`/zones/${id}`),
}

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────
export const notificationService = {
  getUnread:   ()   => api.get('/notifications/unread'),
  countUnread: ()   => api.get('/notifications/unread/count'),
  markRead:    (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: ()   => api.patch('/notifications/read-all'),
}

// ── EMERGENCY CONTACTS ────────────────────────────────────────────────────
export const emergencyService = {
  getAll:  ()       => api.get('/emergency-contacts'),
  create:  (data)   => api.post('/emergency-contacts', data),
  update:  (id, d)  => api.put(`/emergency-contacts/${id}`, d),
  delete:  (id)     => api.delete(`/emergency-contacts/${id}`),
}

// ── LOGS ──────────────────────────────────────────────────────────────────
export const logService = {
  getAll: (params) => api.get('/logs', { params }),
}

// ── REPORTS ───────────────────────────────────────────────────────────────
export const reportService = {
  getAll:    (params) => api.get('/reports', { params }),
  generate:  (data)   => api.post('/reports', data),
}