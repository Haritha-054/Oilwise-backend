// In-memory DB
const users = {};
const profiles = {};
const logs = [];
const certs = [];

// Seed demo user/profile/logs if empty
if (!users['u1']) {
  users['u1'] = { id: 'u1', name: 'Asha', age: 29, heightCm: 162, weightKg: 62, locale: 'en' };
}

if (!profiles['u1']) {
  profiles['u1'] = { userId: 'u1', points: 120, badges: [] };
}

// Seed a demo log
if (logs.length === 0) {
  logs.push({ id: 'log1', userId: 'u1', dateISO: new Date().toISOString(), amountMl: 20 });
}

// Exports
module.exports = {
  users,
  profiles,
  logs,
  certs,
  getUser: (id) => users[id],
  upsertUser: (u) => (users[u.id] = u),
  listLogs: (userId) => logs.filter(l => l.userId === userId),
  insertLog: (entry) => logs.push(entry),
  getProfile: (userId) => profiles[userId],
  upsertProfile: (p) => (profiles[p.userId] = p),
  insertCert: (c) => certs.push(c),
  findCert: (code) => certs.find(c => c.code === code),
  leaderboard: () => Object.entries(profiles).map(([id, p]) => ({ userId: id, points: p.points || 0 }))
};
