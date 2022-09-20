const express = require('express')
const multer = require ('multer')
const path = require('path')
const fs = require ('fs')

const router = express.Router()

const diskStorage = multer.diskStorage({
    destination: path.join(__dirname, '../images'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

const fileUpload = multer({
    storage: diskStorage
}).single('image')

router.get('/', (req, res) => {
    res.send('Welcome to my image app')
})

router.post('/images/post', fileUpload, (req, res) => {

    req.getConnection((err, conn) => {
        if(err) return res.status(500).send('Error del servidor')

        const type = req.file.mimetype
        const name = req.file.originalname
        const data = fs.readFileSync(path.join(__dirname, '../images/' + req.file.filename))

        conn.query('INSERT INTO image set ?', [{type, name, data}], (err, rows) => {
            if(err) return res.status(500).send('Error del servidor')

            res.send('Imagen guardada')
        })
    })
})

router.get('/images/get', (req, res) => {

    req.getConnection((err, conn) => {
        if(err) return res.status(500).send('Error del servidor')

        conn.query('SELECT * FROM image', (err, rows) => {
            if(err) return res.status(500).send('Error del servidor')

            rows.map(img => {
                fs.writeFileSync(path.join(__dirname, '../dbImages/' + img.id + '.png'), img.data)
            })

            const imgDir = fs.readdirSync(path.join(__dirname, '../dbImages/'))

            res.json(imgDir)
        })
    })
})

router.delete('/images/delete/:id', (req, res) => {

    req.getConnection((err, conn) => {
        if(err) return res.status(500).send('Error del servidor')

        conn.query('DELETE FROM image WHERE id = ?', [req.params.id], (err, rows) => {
            if(err) return res.status(500).send('Error del servidor')

            fs.unlinkSync(path.join(__dirname, '../dbImages/' + req.params.id + '.png'))

            res.send('Imagen eliminada')
        })
    })
})

module.exports = router