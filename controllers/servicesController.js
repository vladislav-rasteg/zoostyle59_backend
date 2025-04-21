const ApiError = require('../error/ApiError')
const { Service, ServiceProduct, ServicesGroup } = require('../models/models')

class ServiceController {
    async fetch(req, res, next) {
        try {
            const services = await Service.findAll({ where: {isDeleted: false}, order: [['name', 'ASC']] })
            return res.json(services)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async groupedServices(req, res, next) {
        try {
            // Получаем услуги без группы
            const ungroupedServices = await Service.findAll({
                where: {
                    isDeleted: false,
                    servicesGroupId: null
                },
                order: [['name', 'ASC']]
            });
    
            // Получаем группы с вложенными услугами
            const groups = await ServicesGroup.findAll({
                include: [{
                    model: Service,
                    where: {isDeleted: false},
                    required: false
                }],
                order: [['name', 'ASC']]
            });
    
            return res.json({ ungroupedServices, groups });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async create(req, res, next) {
        try {
            const { name, price, duration, groupToAdd = null } = req.body
            const service = await Service.create({ name, price, duration, servicesGroupId: groupToAdd })
            return res.json(service)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async createGroup(req, res, next) {
        const {name, services} = req.body
        try {
            if(!name){
                return next(
                    ApiError.badRequest("Не переданы необходимые параметры")
                );
            }

            const group = await ServicesGroup.create({name})
            if(services){
                services.map(async(service) => {
                    await Service.update({servicesGroupId: group.id}, {where: {id: service.id}})
                })
            }
            return res.json(group)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async updateGroup(req, res, next) {
        const {id, name, services} = req.body
        try {
            if(!name || !id){
                return next(
                    ApiError.badRequest("Не переданы необходимые параметры")
                );
            }
            await Service.update({servicesGroupId: null}, {where: {servicesGroupId: id}})
            await ServicesGroup.update({name}, {where: {id}})
            if(services){
                services.map(async(service) => {
                    await Service.update({servicesGroupId: id}, {where: {id: service.id}})
                })
            }
            return res.json('success')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteGroup(req, res, next) {
        const {id} = req.query
        try {
            if(!id){
                return next(
                    ApiError.badRequest("Не переданы необходимые параметры")
                );
            }
            await Service.update({servicesGroupId: null}, {where: {servicesGroupId: id}})
            await ServicesGroup.destroy({where: {id}})
            return res.json('success')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async move(req, res, next) {
        let {service_id, group_id} = req.body
        try {
            if(!service_id){
                return next(
                    ApiError.badRequest("Не переданы необходимые параметры")
                );
            }
            const service = await Service.findByPk(service_id)
            if(!service){
                return next(
                    ApiError.badRequest("Услуга не найдена")
                );
            }

            service.servicesGroupId = group_id
            await service.save()

            return res.json(service)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.query
            const { name, price, duration } = req.body

            const service = await Service.findOne({ where: { id } })
            if (!service) {
                return next(ApiError.badRequest('Service not found'))
            }

            const updatedService = await Service.update({ name, price, duration }, { where: { id }, returning: true })

            return res.json(updatedService[1][0])
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.query
            
            await Service.update({isDeleted: true}, {where: {id}})

            return res.json("Deleted successfully")
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ServiceController()