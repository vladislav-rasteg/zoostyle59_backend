const ApiError = require('../error/ApiError')
const { User, Purchase, Client, SaleProduct, Product, PurchaseProduct } = require('../models/models')

class PurchaseController {
    async fetch(req, res, next) {
        try {
            let {page, limit} = req.query

            page = page || 1
            limit = limit || 1000
            let offset = page * limit - limit

            const purchases = await Purchase.findAndCountAll({ 
                include: [
                    {model: User, required: false},
                    {model: PurchaseProduct, required: false, include: [{model: Product, required: false}]},
                ], 
                where: {isDeleted: false},
                order: [['id', 'ASC']], 
                limit, 
                offset
            })
            return res.json(purchases)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            const { userId, note, sum, products } = req.body

            const purchase = await Purchase.create({ userId, note, sum })

            if (products && Array.isArray(products)) {
                for (const prod of products) {
                    await PurchaseProduct.create({
                        purchaseId: purchase.id,
                        productId: prod.productId,
                        count: prod.count,
                    })

                    await Product.increment({count: prod.count}, {where: {id: prod.productId}})
                }
            }

            return res.json(purchase)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // Обновление продажи
    async update(req, res, next) {
        try {
            const { id } = req.params
            const { userId, note, sum, products } = req.body

            // Находим существующую продажу
            const purchase = await Purchase.findOne({ where: { id } })
            if (!purchase) {
                return next(ApiError.badRequest('Purchase not found'))
            }

            const updatedPurchase = await Purchase.update({ userId, note, sum }, { where: { id }, returning: true })

            const purchaseProducts = await PurchaseProduct.findAll({ where: { purchaseId: id } })
            for (const prod of purchaseProducts) {
                await Product.decrement({count: prod.count}, {where: {id: prod.productId}})
            }

            await PurchaseProduct.destroy({ where: { purchaseId: id } })
            
            if (products && Array.isArray(products)) {
                for (const prod of products) {
                    await PurchaseProduct.create({
                        purchaseId: id,
                        productId: prod.productId,
                        count: prod.count,
                    })
                    await Product.increment({count: prod.count}, {where: {id: prod.productId}})
                }
            }

            return res.json(updatedPurchase[1][0])
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // Удаление продажи
    async delete(req, res, next) {
        try {
            const { id } = req.params

            const sale = await Purchase.findOne({ where: { id } })
            if (!sale) {
                return next(ApiError.badRequest('Sale not found'))
            }

            await Purchase.update({isDeleted: true}, {where: {id}})

            return res.json("Deleted successfully")
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new PurchaseController()