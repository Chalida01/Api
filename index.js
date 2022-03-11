const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const knex = require('knex')

const db = knex({
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASS || '',
    database: process.env.MYSQL_DB || 'e1',
    supportBigNumber: true,
    timezone: '+7:00',
    dateStrings: true,
    charset: 'utf8mb4_unicode_ci',
  },
})
const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send({ ok: 1 })
})
app.post('/Save', async (req, res) => {
  console.log('data=', req.body)
  try {
    let row = await db('register').insert({
      fullname: req.body.username,
      becount: req.body.bankcount,
      tel: req.body.tel,
      email: req.body.email,
      passwd: req.body.passwd,
    })
    res.send({
      status: 1,
    })
  } catch (e) {
    console.log('error')
    console.log(e.message)
    res.send({
      status: 0,
      error: e.message,
    })
  }
})
app.get('/list', async (req, res) => {
  console.log('list')
  let row = await db('register').where({r_id: req.query.rid})
  res.send({
    datas: row[0],
    status: 1,
  })
})
app.get('/list_user', async (req, res) => {
  console.log(req.query.user)
  console.log(req.query.pass)
  try {
    let row = await db('users_student')
      .where({ student_id: req.query.user, major_id: req.query.pass })
      .then(rows => rows[0])
    if (!row) {
      throw new Error('user / pass ไม่ถูกต้อง')
    }
    res.send({
      status: 1,
      data: row,
    })
  } catch (e) {
    console.log('error')
    console.log(e.message)
    res.send({
      status: 0,
      error: e.message,
    })
  }
})

app.listen(7001, () => {
  console.log('ready:7001')
})
