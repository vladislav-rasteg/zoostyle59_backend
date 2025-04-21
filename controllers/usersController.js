const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')
const {User, CartProduct, Product, Position} = require('../models/models')

const generateJwt = (id, surname, firstName, middleName, mail, role) => {
    return jwt.sign({id, surname, firstName, middleName, mail, role}, process.env.SECRET_KEY,{expiresIn: '72h'})
}

class UsersController {
    async login(req, res, next) {
        try {
            const {mail, password} = req.body
            const user = await User.findOne({where: {mail, isDeleted: false}})
            if (!user){
                return next(ApiError.internal('Пользователь с таким логином не найден'))
            }
            let comparePassword = user.password === password;
            if (!comparePassword){
                return next(ApiError.internal('Указан неверный пароль'))
            }

            const token = generateJwt(user.id, user.surname, user.firstName, user.middleName, user.mail, user.role)
            return res.json({token})
        } catch (e) {
            console.log(e)
        }
    }
    
    async create(req, res, next) {
        const {mail, password, positionId, surname, firstName, middleName, phone, birth, role} = req.body
        const user = await User.findOne({where: {mail}})
        if (user){
            return next(ApiError.internal('Пользователь с такой почтой уже существует'))
        }

        const createdUser = await User.create({mail, password, positionId, surname, firstName, middleName, phone, birth, role})
        
        return res.json(createdUser)
    }
    
    async update(req, res, next) {
        const {id} = req.params
        const {mail, password, positionId, surname, firstName, middleName, phone, birth, role} = req.body
        const user = await User.update({mail, password, positionId, surname, firstName, middleName, phone, birth, role}, {where: {id}})
        return res.json(user)
    }
 
    async check(req, res, next) {
        try {
            const user = await User.findOne({where: {id: req.user.id, isDeleted: false}})
            
            if(!user){
                return next(ApiError.internal('Пользователь не существует или удален'))
            }

            const token = generateJwt(user.id, user.surname, user.firstName, user.middleName, user.mail, user.role)
            return res.json({token})
            
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    
    async fetch(req, res, next) {
        try {
            let {page, limit} = req.query
            page = page || 1
            limit = limit || 20
            let offset = page * limit - limit
            const users = await User.findAndCountAll({
                where: {isDeleted: false},
                include: [{model: Position, required: false}], 
                limit, 
                offset, 
                order: [['surname', 'ASC']]
            })

            return res.json(users)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params
            
            await User.update({isDeleted: true}, {where: {id}})

            return res.json("Deleted successfully")
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new UsersController()