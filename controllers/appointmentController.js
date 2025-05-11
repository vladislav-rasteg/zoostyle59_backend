const ApiError = require('../error/ApiError')
const { 
    Appointment, 
    AppointmentService,  
    Service,
    Pet,
    Client,
    User
} = require('../models/models')

class AppointmentController {
    async fetch(req, res, next) {
        try {
            let {page, limit, employeeId, date} = req.query

            page = page || 1
            limit = limit || 1000
            let offset = page * limit - limit
            
            const where = {
                isDeleted: false,
                ...(employeeId ? {userId: employeeId} : {}),
                ...(date ? {date} : {}),
            }

            const appointments = await Appointment.findAndCountAll({ 
                include: [
                    {
                        model: AppointmentService,
                        required: true,
                        attributes: ["id"],
                        include: [
                            {
                                model: Service,
                                required: true,
                            },
                        ],
                    },
                    {model: User, required: true},
                    {model: Client, required: true},
                    {model: Pet, required: true},
                    { model: User, required: true },
                    {
                        model: AppointmentService,
                        required: false,
                        attributes: ["id"],
                        include: [
                            {
                                model: Service,
                                required: true,
                            },
                        ],
                    },
                ],
                where,
                order: [['date', 'DESC'], ['time', 'DESC']],
                limit, 
                offset
            })
            return res.json(appointments)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async fetchOne(req, res, next) {
        try {
            const {id} = req.params
            const appointment = await Appointment.findOne({ 
                where: {id},
                include: [
                    {model: User, required: true},
                    {model: Client, required: true},
                    {model: Pet, required: true},
                    {
                        model: AppointmentService,
                        required: true,
                        attributes: ["id"],
                        include: [
                            {
                                model: Service,
                                required: true,
                            },
                        ],
                    },
                ],
            })
            return res.json(appointment)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    
    async fetchByClient(req, res, next) {
        try {
            const {id} = req.params
            const appointments = await Appointment.findAll({ 
                where: {clientId: id},
                include: [
                    {model: User, required: true},
                    {model: Client, required: true},
                    {model: Pet, required: true},
                    {
                        model: AppointmentService,
                        required: true,
                        attributes: ["id"],
                        include: [
                            {
                                model: Service,
                                required: true,
                            },
                        ],
                    },
                ],
                order: [['date', 'DESC'], ['time', 'DESC']] 
            })
            return res.json(appointments)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            const { userId, clientId, date, time, endTime, note, petId, procedures, sum } = req.body

            if (!procedures || !Array.isArray(procedures) || procedures.length === 0) {
                return next(ApiError.badRequest("No procedures provided"))
            }

            let totalSum = 0
            for (const proc of procedures) {
                const service = await Service.findOne({ where: { id: proc.id } })
                if (!service) {
                    return next(ApiError.badRequest(`Service with id ${proc.id} not found`))
                }
                totalSum += service.price
            }

            const appointment = await Appointment.create({ userId, clientId, date, time, endTime, note, petId, sum })

            for (const proc of procedures) {
                await AppointmentService.create({ appointmentId: appointment.id, serviceId: proc.id })
            }

            return res.json(appointment)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params
            const { userId, clientId, date, time, endTime, note, petId, procedures, sum } = req.body

            const appointment = await Appointment.findOne({ where: { id } })
            if (!appointment) {
                return next(ApiError.badRequest("Appointment not found"))
            }

            let newTotalSum = 0
            for (const proc of procedures) {
                const service = await Service.findOne({ where: { id: proc.id } })
                if (!service) {
                    return next(ApiError.badRequest(`Service with id ${proc.id} not found`))
                }
                newTotalSum += service.price
            }

            await Appointment.update({ userId, clientId, date, time, endTime, note, petId, sum }, { where: { id } })

            await AppointmentService.destroy({ where: { appointmentId: id } })

            for (const proc of procedures) {
                await AppointmentService.create({ appointmentId: id, serviceId: proc.id })
            }

            const updatedAppointment = await Appointment.findOne({ where: { id } })
            return res.json(updatedAppointment)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // Удаление приема (обратите внимание, что возврат списанных расходников не реализован)
    async delete(req, res, next) {
        try {
            const { id } = req.params
            await Appointment.update({isDeleted: true}, { where: { id } })

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

            return res.json({ available: true, message: "All checks passed" })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new AppointmentController()
