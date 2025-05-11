const ApiError = require('../error/ApiError')
const { slugify } = require('transliteration');
const {Appointment, User, AppointmentService, Service, Pet, Client} = require('../models/models')
const { fn, col, literal } = require('sequelize');
const {sequelize} = require('../db')

class PetsController {
    async fetch(req, res, next) {
        try {
            let {page, limit, search, clientId} = req.query

            page = page || 1
            limit = limit || 1000
            let offset = page * limit - limit

            const engSearch = (search && search.length > 1) ? slugify(search.toLowerCase(), {separator: " "}) : null;
            
            let where = {isDeleted: false}

            if(clientId){
                where.clientId = clientId
            }

            const options = {
                subQuery: false,
                where,
                include: [
                    {
                        model: Client
                    },
                    {
                        model: Appointment,
                        attributes: [],
                        required: false,
                        where: { isDeleted: false },
                    },
                ],
                attributes: {
                  include: [
                    [fn('COALESCE', fn('SUM', col('appointments.sum')), 0), 'appointmentsTotal'],
                  ],
                },
                group: ['pet.id', 'client.id'],
                order: [['name', 'ASC']],
                limit, 
                offset
              };

            if (engSearch) {
                const SIM_THRESHOLD = 0.05;
            
                options.where = literal(
                    `similarity("nameEng", ${sequelize.escape(engSearch)}) >= ${SIM_THRESHOLD}`,
                );
            
                options.order = [
                    [
                    literal(
                        `similarity("nameEng", ${sequelize.escape(engSearch)})`,
                    ),
                    'DESC',
                    ],
                ];
            }          
          
            const count = await Pet.count({ where: options.where, distinct: true, col: 'id' })
            const pets = await Pet.findAndCountAll(options);
            pets.count = count;
            return res.json(pets);
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    
    async fetchOne(req, res, next) {
        try {
            const { id } = req.params;
            const pet = await Pet.findByPk(id)
            
            const appointments = await Appointment.findAll({
                where: {petId: pet.id, isDeleted: false},
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

            const total = appointments.reduce((accum, item) => accum + item.sum, 0)

            return res.json({pet, total, appointments})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            const {name, sex, birth, type, breed, feautures, clientId} = req.body

            if (!name) {
                return next(ApiError.badRequest("Имя питомца не указано"))
            }

            const nameEng = slugify(name, {separator: " "})

            const pet = await Pet.create({name, nameEng, sex, birth, type, breed, feautures, clientId})
            return res.json(pet)
        } catch (e) {
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }
    async update(req, res, next) {
        try {
            const {id} = req.params;
            const {name, sex, birth, type, breed, feautures, clientId} = req.body

            const nameEng = slugify(name, {separator: " "})

            const pet = await Pet.update({name, nameEng, sex, birth, type, breed, feautures, clientId}, {where: {id}, returning: true})
            
            return res.json(pet[1][0])
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete (req, res, next) {
        try {
            let {id} = req.params;
            await Pet.update({isDeleted: true}, {where: {id}})
            return res.json("Deleted successfully");
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new PetsController()