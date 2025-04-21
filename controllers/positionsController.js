const ApiError = require('../error/ApiError')
const {Position, Service} = require('../models/models')

class PositionsController {

    async add(req, res, next) {
        try {
            const {name} = req.body
            const position = await Position.create({name: name})
            return res.json({position})
        } catch (e) {
            next(ApiError.badRequest(e.message))   
        } 
    }

    async update(req, res, next) {
        try {
            const {id} = req.query;
            const {name} = req.body
            await Position.update({name: name}, {where: {id}})
            return res.json("Должность изменена успешно!")
        } catch (e) {
            next(ApiError.badRequest(e.message))   
        } 
    }

    async getAll(req, res, next) {
        let {page, limit} = req.query
        page = page || 1
        limit = limit || 20
        let offset = page * limit - limit
        try {
            const positions = await Position.findAndCountAll({limit, offset, order: [['name', 'ASC']]})
            const services = await Service.findAll()
            positions.services = services
            return res.json({positions})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res, next){
        let {id} = req.query
        try {
            const position = await Position.findOne({where: {id}})
            return res.json({position})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next){
        try {
            const {id} = req.query;
            Position.destroy({
                where: {id}
            }).then(function(rowDeleted){
                if(rowDeleted === 1){
                    return res.json("Deleted successfully");
                }
            }, function(err){
                next(ApiError.badRequest(err))
            });
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new PositionsController()