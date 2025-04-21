const ApiError = require('../error/ApiError')
const { s3 } = require('../db');
const sharp = require('sharp');
const {Category, Product} = require('../models/models')

class ProductController {
    async fetch(req, res, next) {
        try {
            let {page, limit} = req.query
            page = page || 1
            limit = limit || 1000
            let offset = page * limit - limit
            const products = await Product.findAndCountAll({limit, offset, order: [['name', 'ASC']]})
            return res.json(products)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async fetchOne(req, res, next) {
        try {
            const { id } = req.params;
            const product = await Product.findOne({where: {id}})
            return res.json(product)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            const {name, price, count, isForService} = req.body;
    
            const product = await Product.create({name, price, count, isForService});
    
            return res.json(product)
        } catch (e) {
            console.log(e)
            next(ApiError.badRequest(e.message));
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.query;
            const {name, price, count, isForService} = req.body;
    
            const product = await Product.update({name, price, count, isForService}, {where: {id}, returning: true});
    
            return res.json(product[1][0])
        } catch (e) {
            console.log(e)
            next(ApiError.badRequest(e.message));
        }
    }

    async delete (req, res, next) {
        try {
            let {id} = req.query;
            await Product.update({isDeleted: true}, {where: {id}})
            return res.json("Deleted successfully");
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ProductController()