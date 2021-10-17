import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const __dirname = path.resolve()

const uploadPath = path.join(__dirname, '/uploads/')

const app = express()

function mimeTypesFilter(mimeTypes) {
  return (req, file, cb) => {
    if (mimeTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('File mime type error'))
    }
  }
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    fs.mkdir(uploadPath, (err) => {
      if (err) {
        throw new Error('You need to create the upload dir: "uploads" in the root folder')
      }

      callback(null, uploadPath)
    })
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname)
  },
})

const mimeTypes = ['audio/mp3', 'audio/acc', 'audio/mpeg', 'audio/wav']

const upload = multer({
  storage: storage,
  fileFilter: mimeTypesFilter(mimeTypes),
}).any()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/api/music', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err)
      return res.end(`Error uploading file.`)
    }

    res.end('File is uploaded')
  })
})

app.listen(9000, () => {
  console.info('> App is started on port 9000')
  console.info('> Click here to open the link: http://localhost:9000')
})
