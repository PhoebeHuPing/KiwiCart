import express from 'express'
import * as db from '../db/index.ts'

const router = express.Router()

router.get('/compare', async (req, res) => {
  const searchTerm = (req.query.q as string) || ''
  try {
    const products = await db.getComparePrices(searchTerm)
    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

router.get('/', async (req, res) => {
  try {
    const products = await db.getProducts()
    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    await db.deleteProductById(id)
    res.sendStatus(200)
  } catch (error) {
    res.status(500).send('Something went wrong')
  }
})

export default router
