import express from 'express'
import cors from 'cors'

const app = express()
const PORT = Number(process.env.PORT) || 3000

// ---------- Middleware ----------
app.use(cors()) // اجازه‌ی درخواست از فرانت‌اند
app.use(express.json())

// ---------- Routes ----------
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'robosim-backend',
    time: new Date().toISOString(),
  })
})

// ریشه‌ی API — فهرست مسیرهای موجود
app.get('/api', (_req, res) => {
  res.json({
    name: 'RoboSim API',
    version: '0.0.0',
    endpoints: ['/api/health'],
  })
})

// ---------- Start ----------
app.listen(PORT, () => {
  console.log(`🤖 RoboSim backend running at http://localhost:${PORT}`)
})
