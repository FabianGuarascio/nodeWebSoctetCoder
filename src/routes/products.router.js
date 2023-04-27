import { Router } from 'express'
import { ProductManager } from '../ProductManager.js'

const router = Router()
const pm = new ProductManager()

router.get('/', async (req, res) => {
  const products = await pm.getProducts()
  const { limit } = req.query
  let sendProducts = []
  if (limit > 0) {
    sendProducts = products.slice(0, limit)
  } else {
    sendProducts = [...products]
  }
  return res.status(200).send(sendProducts)
})

router.get('/:pid', async (req, res) => {
  
  const products = await pm.getProducts()
  const pid = Number(req.params.pid)
  const product = products.find((prod) => prod.id === pid)
  const io = req.app.get('socketio')
  if (product == undefined) {
    const err = new Error('No existe un producto con ese ID')
    return res.status(400).json({ error: err.message })
  } else {
    io.sockets.emit('get_p_id',product)
    return res.status(200).send(product)
  }
})

router.post('/', (req, res) => {
  const product = req.body
  const io = req.app.get('socketio')

  try {
    const newProduct = pm.addProduct(product)
    io.sockets.emit('add_product',newProduct)
    return res.status(201).send(newProduct)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.put('/:pid', async (req, res) => {
  const pid = Number(req.params.pid)
  const product = req.body
  try {
    const updatedProduct = pm.updateProduct(pid, product)

    return res.status(200).send(updatedProduct)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.delete('/:pid', async (req, res) => {
  const pid = Number(req.params.pid)

  try {
    pm.deleteProduct(pid)
    const io = req.app.get('socketio')
    
    io.sockets.emit('delete_product',pid)
    return res.status(200).send(`Producto con id ${pid} borrado con exito`)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

export default router
