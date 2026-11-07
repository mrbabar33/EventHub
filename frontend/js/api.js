const API_URL = 'http://localhost:5000/api';

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');

  const res = await fetch(API_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

const EventsAPI = {
  getAll: (category = 'all', search = '') => {
    const params = new URLSearchParams();
    if (category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    const qs = params.toString();
    return apiFetch('/events' + (qs ? '?' + qs : ''));
  },
  getOne: (id) => apiFetch('/events/' + id)
};

const BookingsAPI = {
  create: (eventId, tickets) =>
    apiFetch('/bookings', { method: 'POST', body: JSON.stringify({ eventId, tickets }) }),
  mine: () => apiFetch('/bookings/my'),
  getOne: (id) => apiFetch('/bookings/' + id)
};