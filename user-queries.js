const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const constant=require("./util/constant")
const secretKey = constant.secretKey; 
const User = require('./models/user');

const saltRounds = 10;

const hashPassword = async (password) => {
    try {
      const hash = await bcrypt.hash(password, saltRounds);
      return hash;
    } catch (error) {
    }
}

const authenticateUser = async (request, response) => {
    const { email, password } = request.body;
    const user = await User.findOne({
        where: { email }
    });
    if (!user) {
        return response.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return response.status(401).json({ message: 'Invalid password' });
    }
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
    return response.status(200).json({ token });
}

const getUserByToken = async (request, response) => {
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) {
        return response.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }
        return response.status(200).json({user});
    } catch (error) {
        return response.status(401).json({ message: error.message });
    }
}

const { Op } = require('sequelize');

const getUsers = async (request, response) => {
    const users = await User.findAll({
        attributes: ['id', 'name', 'email']
    });
    return response.status(200).json(users);
}

const getUserById = async (request, response) => {
    const id = +(request.params.id);
    const user = await User.findByPk(id);
    if (!user) {
        return response.status(404).json({ message: 'User not found' });
    }
    return response.status(200).json(user);
}

const deleteUserById = async (request, response) => {
    const id = +(request.params.id);
    const user = await User.findByPk(id);
    if (!user) {
        return response.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    return response.status(200).json({ message: `Deleted User Id: ${id}` });
}

const registerUser = async (request, response) => {
    let { name, email,password } = request.body;
    const user = await User.findOne({
        where: { email }
    });
    if (user) {
        return response.status(400).json({ message: 'User with the email already exists' });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword
    });
    return response.status(200).json({ message: 'User Registered' });
}

const addUser = async (request, response) => {
    let { name, email } = request.body;

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword
    });
    return response.status(200).json({ message: 'Added User' });
}

const updateUser = async (request, response) => {
    let id = +(request.params.id);
    let { name, email } = request.body;
    const user = await User.findByPk(id);
    if (!user) {
        return response.status(404).json({ message: 'User not found' });
    }
    await user.update({
        name,
        email
    });
    return response.status(200).json({ message: `Updated User Id: ${id}` });
}

module.exports = {
    getUsers,
    getUserById,
    deleteUserById,
    addUser,
    updateUser,
    registerUser,
    authenticateUser,
    getUserByToken
}