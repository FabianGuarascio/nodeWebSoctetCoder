import { Router } from 'express'
import { ProductManager } from '../ProductManager.js'
import productsRouter from './products.router.js'
import { Server } from 'socket.io'
// import { io, server } from '../app.js'

const pm = new ProductManager()

const router = Router()

router.get('/', (req, res) => {
  res.render('index', { title: 'main' })
})

router.get('/home', (req, res) => {
  const products = pm.getProducts()
  res.render('home', { prod: products })
})


router.get('/realTimeProducts', (req, res) => {
  const products = pm.getProducts()
  const io = req.app.get('socketio')
  io.on('connection',socket => {
    socket.emit('evento_server',"te manda saludos el server")
   
  })
  res.render('realTimeProducts', { prod: products })
})


export default router
