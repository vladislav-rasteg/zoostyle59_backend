const ApiError = require('../error/ApiError')
const { 
    Appointment, 
    AppointmentService, 
    Client, 
    Service, 
    ServiceProduct, 
    Product 
} = require('../models/models')

class AppointmentController {
    // Получение всех приемов
    async fetch(req, res, next) {
        try {
            const appointments = await Appointment.findAll({ order: [['date', 'ASC'], ['time', 'ASC']] })
            return res.json(appointments)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // Создание нового приема
    async create(req, res, next) {
        try {
            // Ожидаем в теле запроса: userId, clientId, date, time, endTime, note, petId, procedures (массив объектов { serviceId })
            const { userId, clientId, date, time, endTime, note, petId, procedures } = req.body

            if (!procedures || !Array.isArray(procedures) || procedures.length === 0) {
                return next(ApiError.badRequest("No procedures provided"))
            }

            // Вычисляем общую сумму услуг для приема (суммируются цены всех выбранных услуг)
            let totalSum = 0
            for (const proc of procedures) {
                const service = await Service.findOne({ where: { id: proc.serviceId } })
                if (!service) {
                    return next(ApiError.badRequest(`Service with id ${proc.serviceId} not found`))
                }
                totalSum += service.price
            }

            // Создаем прием
            const appointment = await Appointment.create({ userId, clientId, date, time, endTime, note, petId })

            // Создаем записи процедур приема и списываем расходники
            for (const proc of procedures) {
                // Создаем связь между приемом и услугой
                await AppointmentService.create({ appointmentId: appointment.id, serviceId: proc.serviceId })

                // Получаем расходники, заложенные в услугу
                const serviceProducts = await ServiceProduct.findAll({ where: { serviceId: proc.serviceId } })
                for (const sp of serviceProducts) {
                    const product = await Product.findOne({ where: { id: sp.productId } })
                    if (product) {
                        if (product.quantity >= sp.quantity) {
                            await Product.decrement({ quantity: sp.quantity }, { where: { id: product.id } })
                        } else {
                            const residueQuantity = sp.quantity - product.quantity
                            await Product.decrement({ count: 1 }, { where: { id: product.id } })
                            await Product.decrement({ quantity: residueQuantity }, { where: { id: product.id } })
                        }
                    }
                }
            }
            
            // Обновляем поле total у клиента: прибавляем сумму услуг
            await Client.increment({ total: totalSum }, { where: { id: clientId } })

            return res.json(appointment)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // Обновление приема (обратите внимание, что изменения клиентского total и продуктовых запасов не откатываются)
    async update(req, res, next) {
        try {
            const { id } = req.query
            const { userId, clientId, date, time, endTime, note, petId, procedures } = req.body

            const appointment = await Appointment.findOne({ where: { id } })
            if (!appointment) {
                return next(ApiError.badRequest("Appointment not found"))
            }

            // Вычисляем сумму новых процедур
            let newTotalSum = 0
            for (const proc of procedures) {
                const service = await Service.findOne({ where: { id: proc.serviceId } })
                if (!service) {
                    return next(ApiError.badRequest(`Service with id ${proc.serviceId} not found`))
                }
                newTotalSum += service.price
            }

            // Обновляем данные приема (без отмены предыдущих списаний)
            await Appointment.update({ userId, clientId, date, time, endTime, note, petId }, { where: { id } })

            // Удаляем старые записи процедур (без возврата списанных расходников)
            await AppointmentService.destroy({ where: { appointmentId: id } })

            // Создаем новые записи процедур и списываем расходники для новых услуг
            for (const proc of procedures) {
                await AppointmentService.create({ appointmentId: id, serviceId: proc.serviceId })
                const serviceProducts = await ServiceProduct.findAll({ where: { serviceId: proc.serviceId } })
                for (const sp of serviceProducts) {
                    const product = await Product.findOne({ where: { id: sp.productId } })
                    if (product) {
                        if (product.quantity >= sp.quantity) {
                            await Product.decrement({ quantity: sp.quantity }, { where: { id: product.id } })
                        } else {
                            await Product.decrement({ count: 1 }, { where: { id: product.id } })
                        }
                    }
                }
            }

            // Обновляем total у клиента (новая сумма прибавляется, без учета предыдущей)
            await Client.increment({ total: newTotalSum }, { where: { id: clientId } })

            const updatedAppointment = await Appointment.findOne({ where: { id } })
            return res.json(updatedAppointment)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // Удаление приема (обратите внимание, что возврат списанных расходников не реализован)
    async delete(req, res, next) {
        try {
            const { id } = req.query

            // Удаляем записи процедур приема
            await AppointmentService.destroy({ where: { appointmentId: id } })
            // Удаляем сам прием
            await Appointment.destroy({ where: { id } })

            return res.json("Deleted successfully")
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // Check-запрос для проверки наличия товара на складе и свободного времени у сотрудника
    async check(req, res, next) {
        try {
            // Ожидаем параметры: userId, date, time, endTime, procedures (массив объектов { serviceId })
            const { userId, date, time, endTime, procedures } = req.body

            // 1. Проверка занятости времени у сотрудника
            const appointments = await Appointment.findAll({ where: { userId, date } })
            const newStart = new Date(`${date}T${time}`)
            const newEnd = new Date(`${date}T${endTime}`)

            for (const appt of appointments) {
                const existingStart = new Date(`${appt.date}T${appt.time}`)
                const existingEnd = new Date(`${appt.date}T${appt.endTime}`)
                // Если интервалы пересекаются: newStart < existingEnd и newEnd > existingStart
                if (newStart < existingEnd && newEnd > existingStart) {
                    return res.json({ available: false, message: "Сотрудник занят в выбранное время" })
                }
            }

            // 2. Проверка наличия товара на складе для всех процедур
            for (const proc of procedures) {
                const serviceProducts = await ServiceProduct.findAll({ where: { serviceId: proc.serviceId } })
                for (const sp of serviceProducts) {
                    const product = await Product.findOne({ where: { id: sp.productId } })
                    if (product) {
                        // Если количества на складе недостаточно и дополнительная единица отсутствует, возвращаем ошибку
                        if (product.quantity * product.count < sp.quantity && product.count <= 0) {
                            return res.json({ available: false, message: `Недостаточно товара ${product.name}` })
                        }
                    } else {
                        return res.json({ available: false, message: `Товар с id ${sp.productId} не найден` })
                    }
                }
            }

            return res.json({ available: true, message: "All checks passed" })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new AppointmentController()
