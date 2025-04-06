const ApiError = require('../error/ApiError')
const { Service, ServiceProduct } = require('../models/models')

class ServiceController {
    // Получение всех услуг
    async fetch(req, res, next) {
        try {
            // Опционально можно добавить include для загрузки расходников
            const services = await Service.findAll({ order: [['name', 'ASC']] })
            return res.json(services)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // Создание новой услуги
    async create(req, res, next) {
        try {
            // Ожидаем в теле запроса: name, price, duration и опционально массив продуктов расходников
            const { name, price, duration, products } = req.body
            // Создаем услугу
            const service = await Service.create({ name, price, duration })

            // Если переданы расходники, создаем связанные записи
            if (products && Array.isArray(products)) {
                for (const prod of products) {
                    await ServiceProduct.create({
                        serviceId: service.id, // внешний ключ, добавляемый через ассоциацию
                        productId: prod.productId,
                        quantity: prod.quantity,
                    })
                }
            }

            return res.json(service)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // Обновление услуги
    async update(req, res, next) {
        try {
            const { id } = req.query
            const { name, price, duration, products } = req.body

            // Находим услугу по id
            const service = await Service.findOne({ where: { id } })
            if (!service) {
                return next(ApiError.badRequest('Service not found'))
            }

            // Обновляем данные услуги
            await Service.update({ name, price, duration }, { where: { id } })

            // Если переданы расходники, обновляем связанные записи:
            // сначала удаляем старые, затем создаем новые
            if (products && Array.isArray(products)) {
                await ServiceProduct.destroy({ where: { serviceId: id } })
                for (const prod of products) {
                    await ServiceProduct.create({
                        serviceId: id,
                        productId: prod.productId,
                        quantity: prod.quantity,
                    })
                }
            }

            const updatedService = await Service.findOne({ where: { id } })
            return res.json(updatedService)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // Удаление услуги
    async delete(req, res, next) {
        try {
            const { id } = req.query

            // Удаляем связанные записи расходников
            await ServiceProduct.destroy({ where: { serviceId: id } })

            // Удаляем саму услугу
            await Service.destroy({ where: { id } })

            return res.json("Deleted successfully")
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ServiceController()