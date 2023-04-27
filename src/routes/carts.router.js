import { Router } from 'express'
import { ProductManager } from '../ProductManager.js'
import { ChartManager } from '../ChartManager.js'

const pm = new ProductManager()
const cm = new ChartManager()

const router = Router()

router.get('/', async (req, res) => {
  const charts = cm.getCharts()
  res.send(charts)
})

router.post('/', async (req, res) => {
  const { body } = req

  const chartAdded = cm.addCharts(body)
  res.send(chartAdded)
})

router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params
  const product = pm.existProduct(pid)
  const chart = cm.existChart(cid)
  if (!chart || !product) {
    res.status(404).send('El carrito o  el producto con ese id no existe')
  } else {
    cm.addProductToChartById(Number(cid), Number(pid))
    const carritos = cm.getCharts()
    res.send(carritos)
  }
})

router.get('/:cid', async (req, res) => {
  const { cid } = req.params
  if (cm.existChart(cid)) {
    const chart = cm.getChartById(cid)
    res.send(chart)
  } else {
    res.status(404).send('Carrito con ese id no existe')
  }
})

export default router
