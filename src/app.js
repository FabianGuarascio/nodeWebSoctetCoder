import express from 'express'
import handlebars from 'express-handlebars'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewrouter from './routes/views.router.js'
import { __dirname } from './utils.js'
import { Server } from 'socket.io'

const app = express()

const PORT = 8080
app.use(express.json())

app.use(express.static(`${__dirname}/public`))
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')
app.use('/',viewrouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

export const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
const io = new Server(server)
app.set('socketio',io)
io.on('delete_from_front',(data)=>{
  console.log("delete front end",data)
})
// io.on('connection',socket =>{
//   console.log("hola")
//   socket.on('message',(data)=>{
//     console.log(data)
//   })
//   socket.emit('evento_server',"te manda saludos el server")
// })
