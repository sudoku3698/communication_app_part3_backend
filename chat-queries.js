const Pool = require("pg").Pool;
const constant=require("./util/constant")
const pool = new Pool(constant.databaseConfig)
const Chat = require('./models/chat');

const getChats = (request, response) => {
    Chat.findAll({
        attributes: ['username', 'message', 'date'],
        order: [['date', 'DESC']]
    }).then(results => {
            return response.status(200).json(results);
        })
        .catch(error => {
            throw error
        })
}

const getChatById = (request, response) => {
    let id = +(request.params.id);
    Chat.findOne({
        where: { id: id },
        attributes: ['username', 'message', 'date']
    }).then(result => {
            if (!result) {
                return response.status(404).send({ message: 'Chat not found' });
            }
            return response.status(200).json(result);
        })
        .catch(error => {
            throw error
        })
}

const addChat = (request, response) => {
    let { username, message, date } = request.body;
    Chat.create({
        username,
        message,
        date
    }).then(result => {
            return response.status(200).json({ message: 'Added Chat', data: result });
        })
        .catch(error => {
            throw error
        })
}

const updateChat = (request, response) => {
    let id = +(request.params.id);
    let { username, message, date } = request.body;
    Chat.update({
        username,
        message,
        date
    }, {
            where: { id: id }
        })
        .then(result => {
            return response.status(200).send({ 'message': `Update Chat Id: ${id}` });
        })
        .catch(error => {
            throw error
        })
}

const deleteChatById = (request, response) => {
    let id = +(request.params.id);
    Chat.destroy({
        where: { id: id }
    }).then(result => {
            return response.status(200).send({ 'message': `Deleted Chat ID:${id}` });
        })
        .catch(error => {
            throw error
        })
}

module.exports = {
    getChats,
    getChatById,
    addChat,
    updateChat,
    deleteChatById
}
