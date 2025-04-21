const ApiError = require('../error/ApiError')
const { User, Sale, Client, SaleProduct } = require('../models/models')

class SellController {
    async fetch(req, res, next) {
        try {
            const sales = await Sale.findAndCountAll({ include: [{model: Client, required: false}], order: [['id', 'ASC']]})
            return res.json(sales)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            const { userId, clientId, sum, products } = req.body

            const sale = await Sale.create({ userId, clientId, sum })

            if (products && Array.isArray(products)) {
                for (const prod of products) {
                    await SaleProduct.create({
                        saleId: sale.id,
                        productId: prod.productId,
                        count: prod.count,
                    })
                }
            }

            return res.json(sale)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // Обновление продажи
    async update(req, res, next) {
        try {
            const { id } = req.query
            const { userId, clientId, sum, products } = req.body

            // Находим существующую продажу
            const sale = await Sale.findOne({ where: { id } })
            if (!sale) {
                return next(ApiError.badRequest('Sale not found'))
            }

            const updatedSale = await Sale.update({ userId, clientId, sum }, { where: { id }, returning: true })

            await SaleProduct.destroy({ where: { saleId: id } })
            
            if (products && Array.isArray(products)) {
                for (const prod of products) {
                    await SaleProduct.create({
                        saleId: id,
                        productId: prod.id,
                        count: prod.count,
                    })
                }
            }

            return res.json(updatedSale[1][0])
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // Удаление продажи
    async delete(req, res, next) {
        try {
            const { id } = req.query

            const sale = await Sale.findOne({ where: { id } })
            if (!sale) {
                return next(ApiError.badRequest('Sale not found'))
            }

            await Sale.update({isDeleted: true}, {where: {id}})

            return res.json("Deleted successfully")
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new SellController()
