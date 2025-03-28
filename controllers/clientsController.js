const ApiError = require('../error/ApiError')
const {User, Category, Product, Client} = require('../models/models')

class ClientsController {
    async fetch(req, res, next) {
        try {
            const clients = await Client.findAll({order: [['name', 'ASC']]})
            return res.json(clients)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async fetchOne(req, res, next) {
        try {
            const { id } = req.params;
            const client = await Client.findByPk(id)
            return res.json(client)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            const {name, mail, phone} = req.body
            const client = await Client.create({name, mail, phone})
            return res.json(client)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async update(req, res, next) {
        try {
            const {id} = req.query;
            const {name, mail, phone} = req.body
            const client = await Client.update({name, mail, phone}, {where: {id}, returning: true})
            return res.json(client[1][0])
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete (req, res, next) {
        try {
            let {id} = req.query;
            await Client.update({isDeleted: true}, {where: {id}})
            return res.json("Deleted successfully");
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ClientsController()