const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/userModel')

usersRouter.get('/', async(req, res)=> {
    const users = await User.find({}).populate('notes', { content: 1, important: 1})
    res.json(users)
})
usersRouter.post('/', async(req, res) =>{
    const {username ,name, password} = req.body
    const setRounds = 10
    const passwordHash = await bcrypt.hash(password, setRounds)

    const user = new User({
        username,
        name, 
        passwordHash
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
})

module.exports = usersRouter