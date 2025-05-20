const { Op } = require("sequelize");
const { Notification, Appointment, Client, Pet, AppointmentService, Service, User } = require("../models/models");
const { NewReceptionMail } = require("./mail");

const sendNotificationMails = async () => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setMinutes(startDate.getMinutes() - 2)
    const notifications = await Notification.findAll({where: {
        isSent: false,
        dateTime: {[Op.between]: [startDate, endDate]}
    }})

    if(notifications && notifications.length > 0){
        await Promise.all(notifications.map(async (notification) => {
            const appointment = await Appointment.findByPk(notification.appointmentId, {include: [
                {model: Client}, {model: Pet}, {model: User}, {model: AppointmentService, include: [{model: Service}]}
            ]})
            NewReceptionMail(
                appointment.client.mail,
                `${appointment.client.firstName} ${appointment.client.middleName}`,
                "Зоостиль 59",
                "Пермь",
                "Юрша 25",
                `${appointment.user.surname} ${appointment.user.firstName} ${appointment.user.middleName}`,
                appointment.appointmentServices.map((as) => as.service.name),
                appointment.date,
                appointment.time,
                appointment.endTime
            )
            await Notification.update({isSent: true}, {where: {id: notification.id}})
        }))
    }
}

module.exports = sendNotificationMails;