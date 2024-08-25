const getChats = (request, response) => {
    let sqlQuery = `SELECT username, message, date FROM chats ORDER BY date DESC`;
    pool.query(sqlQuery, function (error, results) {
        if (error) {
            throw error
        }
        return response.status(200).json(results.rows);
    })
}

const getChatById = (request, response) => {
    let id = +(request.params.id);
    let sqlQuery = `SELECT username, message, date FROM chats WHERE id = ${id}`;
    pool.query(sqlQuery, function (error, results) {
        if (error) {
            throw error
        }
        return response.status(200).json(results.rows[0]);
    })
}

const addChat = (request, response) => {
    let { username, message, date } = request.body;
    let sqlQuery = `INSERT INTO chats(username, message, date) VALUES ('${username}', '${message}', '${date}')`;
    pool.query(sqlQuery, function (error, results) {
        if (error) {
            throw error
        }
        return response.status(200).send({"meesage":"Added Chat"});
    })
}

const updateChat = (request, response) => {
    let id = +(request.params.id);
    let { username, message, date } = request.body;
    let sqlQuery = `UPDATE chats SET username='${username}', message='${message}', date='${date}' where id = ${id}`;
    pool.query(sqlQuery, function (error, results) {
        if (error) {
            throw error
        }
        return response.status(200).send({'message':`Update Chat Id: ${id}`});
    })
}

const deleteChatById = (request, response) => {
    let id = +(request.params.id);
    let sqlQuery = `DELETE FROM chats where id = ${id}`;
    pool.query(sqlQuery, function (error, results) {
        if (error) {
            throw error
        }
        return response.status(200).send({'message':`Deleted Chat ID:${id}`});
    })
}

module.exports = {
    getChats,
    getChatById,
    addChat,
    updateChat,
    deleteChatById
}
