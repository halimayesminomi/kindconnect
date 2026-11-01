const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("kindconnect_token") : null;
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || "Something went wrong");
    error.status = res.status;
    throw error;
  }
  return data;
}

export const api = {
  // Auth
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  socialLogin: (body) => request("/auth/social", { method: "POST", body: JSON.stringify(body) }),
  getUser: () => request("/auth/user"),

  // Events
  getEvents: (params = "") => request(`/events${params ? `?${params}` : ""}`),
  getRecentEvents: () => request("/events/recent"),
  getRecommendations: () => request("/events/recommendations"),
  getEvent: (id) => request(`/events/${id}`),
  createEvent: (body) => request("/events", { method: "POST", body: JSON.stringify(body) }),
  updateEvent: (id, body) => request(`/events/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteEvent: (id) => request(`/events/${id}`, { method: "DELETE" }),
  getMyEvents: () => request("/events/user/my-events"),

  // Registrations
  joinEvent: (eventId) => request("/registrations", { method: "POST", body: JSON.stringify({ eventId }) }),
  cancelRegistration: (eventId) => request(`/registrations/${eventId}`, { method: "DELETE" }),
  getMyRegistrations: () => request("/registrations/my-registrations"),
  getEventRegistrations: (eventId) => request(`/registrations/event/${eventId}`),

  // QR Attendance
  getCheckInCode: (eventId) => request(`/attendance/code/${eventId}`),
  checkInAttendance: (eventId, code) => request("/attendance/check-in", { method: "POST", body: JSON.stringify({ eventId, code }) }),
  getMyAttendance: () => request("/attendance/my-attendance"),
  getEventAttendees: (eventId) => request(`/attendance/event/${eventId}`),

  // Notifications
  getNotifications: () => request("/notifications"),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllNotificationsRead: () => request("/notifications/mark-all-read", { method: "POST" }),

  // Emergency Help & Relief
  getEmergencyRequests: (params = "") => request(`/emergency${params ? `?${params}` : ""}`),
  createEmergencyRequest: (body) => request("/emergency", { method: "POST", body: JSON.stringify(body) }),
  respondEmergencyRequest: (id) => request(`/emergency/${id}/respond`, { method: "POST" }),
  verifyEmergencyRequest: (id, body) => request(`/emergency/${id}/verify`, { method: "PATCH", body: JSON.stringify(body) }),
};
