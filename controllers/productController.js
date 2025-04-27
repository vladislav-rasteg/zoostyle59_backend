const ApiError = require('../error/ApiError')
const { slugify } = require('transliteration');
const {Product} = require('../models/models')
const { fn, col, literal } = require('sequelize');
const {sequelize} = require('../db')

class ProductController {
    async fetch(req, res, next) {
        try {
            let {page, limit, search} = req.query

            page = page || 1
            limit = limit || 1000
            let offset = page * limit - limit

            const engSearch = (search && search.length > 1) ? slugify(search.toLowerCase(), {separator: " "}) : null;
            
            let where = {isDeleted: false}

            const options = {
                subQuery: false,
                where,
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
          
            const count = await Product.count({ where: options.where, distinct: true, col: 'id' })
            const products = await Product.findAndCountAll(options);
            products.count = count;
            return res.json(products);
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
    
            const nameEng = slugify(name, {separator: " "})

            const product = await Product.create({name, nameEng, price, count, isForService});
    
            return res.json(product)
        } catch (e) {
            console.log(e)
            next(ApiError.badRequest(e.message));
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params;
            const {name, price, count, isForService} = req.body;

            const nameEng = slugify(name, {separator: " "})
    
            const product = await Product.update({name, nameEng, price, count, isForService}, {where: {id}, returning: true});
    
            return res.json(product[1][0])
        } catch (e) {
            console.log(e)
            next(ApiError.badRequest(e.message));
        }
    }

    async delete (req, res, next) {
        try {
            let {id} = req.params;
            await Product.update({isDeleted: true}, {where: {id}})
            return res.json("Deleted successfully");
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ProductController()