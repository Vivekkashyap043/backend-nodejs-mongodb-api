const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

const users = []
const exercises = []

app.post('/api/users', (req, res) => {
  const username = req.body.username
  if (!username) return res.status(400).send('Username is required')

  const user = { username, _id: new Date().getTime().toString() }
  users.push(user)
  res.json(user)
})

app.get('/api/users', (req, res) => {
  res.json(users)
})

app.post('/api/users/:_id/exercises', (req, res) => {
  const userId = req.params._id
  const user = users.find(u => u._id === userId)
  if (!user) return res.status(404).send('User not found')

  const description = req.body.description
  const duration = parseInt(req.body.duration)
  let date = req.body.date ? new Date(req.body.date) : new Date()

  if (!description || isNaN(duration)) {
    return res.status(400).send('Invalid input')
  }

  if (isNaN(date.getTime())) {
    return res.status(400).send('Invalid date format')
  }

  date = date.toDateString()

  const exercise = {
    _id: user._id,
    username: user.username,
    description,
    duration,
    date
  }

  exercises.push(exercise)

  res.json({
    _id: user._id,
    username: user.username,
    description,
    duration,
    date
  })
})

app.get('/api/users/:_id/logs', (req, res) => {
  const userId = req.params._id
  const user = users.find(u => u._id === userId)
  if (!user) return res.status(404).send('User not found')

  let log = exercises
    .filter(e => e._id === userId)
    .map(e => ({
      description: e.description,
      duration: e.duration,
      date: e.date
    }))

  if (req.query.from) {
    const fromDate = new Date(req.query.from)
    log = log.filter(e => new Date(e.date) >= fromDate)
  }

  if (req.query.to) {
    const toDate = new Date(req.query.to)
    log = log.filter(e => new Date(e.date) <= toDate)
  }

  if (req.query.limit) {
    const limit = parseInt(req.query.limit)
    log = log.slice(0, limit)
  }

  res.json({
    _id: user._id,
    username: user.username,
    count: log.length,
    log
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
