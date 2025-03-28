const ApiError = require('../error/ApiError')
const {User, Category, Product} = require('../models/models')

class CategoryController {
    async fetch(req, res, next) {
        try {
            const categories = await Category.findAll({where: {isDeleted: false}, order: [['name', 'ASC']]})
            return res.json(categories)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new CategoryController()