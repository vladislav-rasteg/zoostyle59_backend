const ApiError = require('../error/ApiError')
const { User, Sale, Client, SaleProduct } = require('../models/models')

class SellController {
    // Получение всех продаж
    async fetch(req, res, next) {
        try {
            // Здесь можно изменить сортировку по необходимости
            const sales = await Sale.findAll({ order: [['id', 'ASC']] })
            return res.json(sales)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // Создание новой продажи
    async create(req, res, next) {
        try {
            // Ожидаем в теле запроса: userId, clientId, sum, а также массив товаров (products)
            const { userId, clientId, sum, products } = req.body

            // Создаем продажу
            const sale = await Sale.create({ userId, clientId, sum })

            // Если переданы товары продажи, добавляем их
            if (products && Array.isArray(products)) {
                for (const prod of products) {
                    await SaleProduct.create({
                        saleId: sale.id,
                        productId: prod.productId,
                        count: prod.count,
                    })
                }
            }

            // Мутируем поле total клиента: прибавляем сумму продажи
            await Client.increment({ total: sum }, { where: { id: clientId } })

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

            // Если clientId изменился, то необходимо скорректировать total у обоих клиентов
            if (sale.clientId !== clientId) {
                // У старого клиента вычитаем старую сумму
                await Client.decrement({ total: sale.sum }, { where: { id: sale.clientId } })
                // У нового клиента прибавляем новую сумму
                await Client.increment({ total: sum }, { where: { id: clientId } })
            } else {
                // Если тот же клиент, вычисляем разницу и прибавляем её к total
                const diff = sum - sale.sum
                await Client.increment({ total: diff }, { where: { id: clientId } })
            }

            // Обновляем данные продажи
            await Sale.update({ userId, clientId, sum }, { where: { id } })

            // Если переданы товары, обновляем их: сначала удаляем старые, затем создаем новые
            if (products && Array.isArray(products)) {
                await SaleProduct.destroy({ where: { saleId: id } })
                for (const prod of products) {
                    await SaleProduct.create({
                        saleId: id,
                        productId: prod.productId,
                        count: prod.count,
                    })
                }
            }

            const updatedSale = await Sale.findOne({ where: { id } })
            return res.json(updatedSale)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // Удаление продажи
    async delete(req, res, next) {
        try {
            const { id } = req.query

            // Находим продажу
            const sale = await Sale.findOne({ where: { id } })
            if (!sale) {
                return next(ApiError.badRequest('Sale not found'))
            }

            // Корректируем поле total у клиента: вычитаем сумму продажи
            await Client.decrement({ total: sale.sum }, { where: { id: sale.clientId } })

            // Удаляем связанные записи товаров продажи
            await SaleProduct.destroy({ where: { saleId: id } })

            // Удаляем саму продажу
            await Sale.destroy({ where: { id } })

            return res.json("Deleted successfully")
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new SellController()
