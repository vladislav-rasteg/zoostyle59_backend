const ApiError = require('../error/ApiError')
const { User, Appointment, AppointmentService, Service, Client, Pet } = require('../models/models')

class CalendarController {

    async list(req, res, next) {
        let {date} = req.query

        try {
            const users = await User.findAll({where: {isDeleted: false}, order: [['surname', 'ASC']]})
            const calendar = await Promise.all(users.map(async (user) => {
                const appointments = await Appointment.findAll({
                    include: [
                        { model: Client, required: true },
                        { model: Pet, required: true },
                        {
                            model: AppointmentService,
                            required: true,
                            include: [
                                {
                                    model: Service,
                                    required: true,
                                }
                            ]
                        }
                    ], 
                    where: {date, userId: user.id, isDeleted: false}})

                appointments.sort((a, b) => {
                    return a.time.localeCompare(b.time);
                });

                return { user, appointments }
            }))

            const services = await Service.findAll()

            return res.json({calendar, services})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new CalendarController()