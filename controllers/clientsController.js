const ApiError = require('../error/ApiError')
const { slugify } = require('transliteration');
const {Client, Appointment, Sale, User, AppointmentService, Service} = require('../models/models')
const { fn, col, literal } = require('sequelize');
const {sequelize} = require('../db')

class ClientsController {
    async fetch(req, res, next) {
        try {
            let {page, limit, search} = req.query

            page = page || 1
            limit = limit || 1000
            let offset = page * limit - limit

            const engSearch = (search && search.length > 1) ? slugify(search.toLowerCase(), {separator: " "}) : null;

            const options = {
                subQuery: false,
                where: {isDeleted: false},
                group: ['client.id'],
                order: [['surname', 'ASC']],
                limit, 
                offset
              };

            if (engSearch) {
                const SIM_THRESHOLD = 0.05;
            
                options.where = literal(
                    `similarity("fullNameEng", ${sequelize.escape(engSearch)}) >= ${SIM_THRESHOLD}`,
                );
            
                options.order = [
                    [
                    literal(
                        `similarity("fullNameEng", ${sequelize.escape(engSearch)})`,
                    ),
                    'DESC',
                    ],
                ];
            }          
          
            const count = await Client.count({ where: options.where, order: [['surname', 'ASC']], distinct: true, col: 'id' })
            const clients = await Client.findAndCountAll(options);
            
            clients.rows = await Promise.all(clients.rows.map(async (client) => {
                
                client.appointments = await Appointment.findAll({where: { clientId: client.id, isDeleted: false }})
                client.sales = await Sale.findAll({where: { clientId: client.id, isDeleted: false }})

                let appointmentsTotal = 0
                let salesTotal = 0
                if(client.appointments){
                    appointmentsTotal = client.appointments.reduce((accum, item) => accum + item.sum, 0)
                    client.dataValues.appointmentsTotal = appointmentsTotal
                }
                if(client.sales){
                    salesTotal = client.sales.reduce((accum, item) => accum + item.sum, 0)
                    client.dataValues.salesTotal = salesTotal
                }
                client.dataValues.total = appointmentsTotal + salesTotal

                return client
            }))
            clients.count = count;
            return res.json(clients);
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    
    async fetchOne(req, res, next) {
        try {
            const { id } = req.params;
            const client = await Client.findByPk(id)
            
            const appointments = await Appointment.findAll({
                where: {clientId: client.id, isDeleted: false},
                include: [
                    { model: User, required: true },
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
                ]
            })

            const appointmentsTotal = appointments.reduce((accum, item) => accum + item.sum, 0)
            const sales = await Sale.findAll({where: {clientId: client.id, isDeleted: false}})
            const salesTotal = sales.reduce((accum, item) => accum + item.sum, 0)
            const total = appointmentsTotal + salesTotal

            return res.json({client, total, appointments})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            const {surname, firstName, middleName, birth, mail, phone} = req.body

            if (!surname) {
                return next(ApiError.badRequest("Фамилия клиента не указана"))
            }

            const fullNameEng = slugify(`${surname}${firstName ? ' ' + firstName : ''}${middleName ? ' ' + middleName : ''}`, {separator: " "})

            const client = await Client.create({surname, firstName, middleName, fullNameEng, birth, mail, phone})
            return res.json(client)
        } catch (e) {
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }
    async update(req, res, next) {
        try {
            const {id} = req.params;
            const {surname, firstName, middleName, birth, mail, phone} = req.body

            const fullNameEng = slugify(`${surname}${firstName ? ' ' + firstName : ''}${middleName ? ' ' + middleName : ''}`, {separator: " "})

            const client = await Client.update({surname, firstName, middleName, fullNameEng, birth, mail, phone}, {where: {id}, returning: true})
            
            return res.json(client[1][0])
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete (req, res, next) {
        try {
            let {id} = req.params;
            await Client.update({isDeleted: true}, {where: {id}})
            return res.json("Deleted successfully");
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ClientsController()