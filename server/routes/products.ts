import express from 'express'
import * as db from '../db/index.ts'

const router = express.Router()

// GET /api/v1/artists/compare?q=apple
// 核心接口：返回搜索后的商品及其在各超市的价格对比
router.get('/compare', async (req, res) => {
  const searchTerm = req.query.q as string || ''
  try {
    const products = await db.getComparePrices(searchTerm)
    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

// GET /api/v1/artists
// 获取所有商品列表（用于首页展示）
router.get('/', async (req, res) => {
  try {
    const products = await db.getProducts()
    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

// (保留 DELETE 路由作为示例)
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
