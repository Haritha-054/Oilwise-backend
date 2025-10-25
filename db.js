// db.js
let users = {};
let profiles = {};
let logs = [];
let certs = [];

exports.getUser = (id) => users[id];
exports.upsertUser = (u) => (users[u.id] = u);
exports.listLogs = (userId) => logs.filter(l => l.userId === userId);
exports.insertLog = (entry) => logs.push(entry);
exports.getProfile = (userId) => profiles[userId];
exports.upsertProfile = (p) => (profiles[p.userId] = p);
exports.insertCert = (c) => certs.push(c);
exports.findCert = (code) => certs.find(c => c.code === code);
exports.leaderboard = () => Object.entries(profiles).map(([id, p]) => ({ userId: id, points: p.points || 0 }));
