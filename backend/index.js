const express = require('express')
const cors = require ('cors')
const myconn = require('express-myconnection')
const app = express()
const mysql = require('mysql2')
const path = require('path')

app.use(myconn(mysql, {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'images'
}))

app.use(cors())
app.use(express.static(path.join(__dirname, 'dbImages')))

app.use(require('./routes/routes'))

app.listen(9000, () => {
    console.log('Server running on', 'http://localhost:' + 9000)
})