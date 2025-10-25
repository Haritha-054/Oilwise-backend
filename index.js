const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { randomUUID } = require('crypto');
const { getUser, upsertUser, listLogs, insertLog, getProfile, upsertProfile, insertCert, findCert, leaderboard, users, profiles, logs } = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

// CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(bodyParser.json());

// Static demo data
const dbMem = {
  recipes: [
    { id: 'r1', title: 'Grilled Tofu Salad', cuisine: 'Global', diet: 'Vegetarian', lowOil: true, nutrition: { calories: 320, fat: 9, carbs: 28, protein: 24 }, steps: ['Press tofu','Grill with minimal oil spray','Mix salad and serve'], rating: 4.4, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format' },
    { id: 'r2', title: 'Steamed Fish with Herbs', cuisine: 'Asian', diet: 'Pescatarian', lowOil: true, nutrition: { calories: 280, fat: 7, carbs: 6, protein: 38 }, steps: ['Marinate fish','Steam with herbs','Serve with lemon'], rating: 4.7, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format' },
  ],
  badges: [
    { id: 'b1', name: 'Mindful Eater', points: 100 },
    { id: 'b2', name: 'Oil Saver', points: 250 },
  ],
  campaigns: [
    { id: 'c1', title: 'National Edible Oil Awareness Week', banners: ['/static/banner1.png'],  infographics: ['Choose oils wisely', 'Limit deep frying'], quiz: { questions: [{ id: 'q1', text: 'What is a healthy daily oil limit per adult?', options: ['10-20 ml', '30-50 ml', '80-100 ml'], answerIdx: 1 }] } }
  ]
};

function calculateBmi(weightKg, heightCm) {
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

// Health routes
app.get('/api/health/:userId', (req,res) => {
  const { userId } = req.params;
  const user = getUser(userId);
  if(!user) return res.status(404).json({ error: 'User not found' });
  const bmi = calculateBmi(user.weightKg, user.heightCm);
  const risk = bmi >= 25 ? 'elevated' : 'normal';
  res.json({ user, bmi, risk, tips: risk==='elevated'? ['Reduce fried foods','Use measuring spoons for oil']: ['Keep it up!'] });
});

// Tracker routes
app.get('/api/consumption/:userId', (req,res)=>{
  const { userId } = req.params;
  const userLogs = listLogs(userId);
  res.json({ logs: userLogs });
});

app.post('/api/consumption', (req,res)=>{
  const { userId, dateISO, amountMl } = req.body || {};
  if(!userId || !dateISO || typeof amountMl !== 'number') return res.status(400).json({ error: 'Invalid payload' });
  const entry = { id: randomUUID(), userId, dateISO, amountMl };
  insertLog(entry);
  res.status(201).json(entry);
});

// Other routes (recipes, campaigns, quiz, profile, certifications, leaderboard)...
// You can copy from your existing code since they don't depend on SQLite.

app.get('/', (_req,res)=> res.send('OiloGuard Backend is running') );

app.listen(PORT, ()=> console.log(`Backend listening on port ${PORT}`));
