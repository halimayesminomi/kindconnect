const API_BASE = typeof window !== "undefined"
  ? "/api"
  : (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes("localhost:5000")
      ? process.env.NEXT_PUBLIC_API_URL
      : "/api");

async function request(endpoint, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("kindconnect_token") : null;
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.message || "Something went wrong");
      error.status = res.status;
      throw error;
    }
    return data;
  } catch (err) {
    if (err.name === "TypeError" || (err.message && err.message.toLowerCase().includes("fetch"))) {
      const error = new Error("Cannot connect to backend server. The API server is currently unreachable from this device.");
      error.isNetworkError = true;
      throw error;
    }
    throw err;
  }
}

export const api = {
  // Auth
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  socialLogin: (body) => request("/auth/social", { method: "POST", body: JSON.stringify(body) }),
  googleLogin: (credential, userInfo) => request("/auth/google", { method: "POST", body: JSON.stringify({ credential, userInfo }) }),
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
  respondEmergencyRequest: (id, body = {}) => request(`/emergency/${id}/respond`, { method: "POST", body: JSON.stringify(body) }),
  verifyEmergencyRequest: (id, body) => request(`/emergency/${id}/verify`, { method: "PATCH", body: JSON.stringify(body) }),

  // Admin Control Panel
  getAdminStats: () => request("/admin/stats"),
  getAdminUsers: (params = "") => request(`/admin/users${params ? `?${params}` : ""}`),
  updateUserRole: (id, body) => request(`/admin/users/${id}/role`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: "DELETE" }),
  getAdminEvents: () => request("/admin/events"),
  deleteAdminEvent: (id) => request(`/admin/events/${id}`, { method: "DELETE" }),
  getAdminEmergency: () => request("/admin/emergency"),
  verifyAdminEmergency: (id, body) => request(`/admin/emergency/${id}/verify`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteAdminEmergency: (id) => request(`/admin/emergency/${id}`, { method: "DELETE" }),
  getAdminRegistrations: () => request("/admin/registrations"),

  // Community & Event Chat
  getChatEvents: () => request("/chat/my-events"),
  getEventMessages: (eventId) => request(`/chat/events/${eventId}/messages`),
  sendEventMessage: (eventId, text) => request(`/chat/events/${eventId}/messages`, { method: "POST", body: JSON.stringify({ text }) }),
  getDirectAdminChat: () => request("/chat/direct/admin"),
  sendDirectAdminMessage: (text) => request("/chat/direct/admin", { method: "POST", body: JSON.stringify({ text }) }),
  getAdminConversations: () => request("/chat/direct/conversations"),
  getAdminUserChat: (userId) => request(`/chat/direct/user/${userId}`),
  sendAdminUserMessage: (userId, text) => request(`/chat/direct/user/${userId}`, { method: "POST", body: JSON.stringify({ text }) }),
};
