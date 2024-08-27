const Pool = require("pg").Pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = new Pool({
    user: 'postgres',
    password: 'root',
    host: 'localhost',
    port: 5432,
    database: 'dashboard',
})
const constant=require('./util/constant')
const secretKey = constant.secretKey; 

const saltRounds = 10;

const hashPassword = async (password) => {
    try {
      const hash = await bcrypt.hash(password, saltRounds);
      return hash;
    } catch (error) {
      console.error('Error hashing password:', error);
    }
}

const findUserByEmail = async (email) => {
    let sqlQuery = `SELECT id,name,email,password FROM users WHERE email = '${email}'`;
    let result = await pool.query(sqlQuery);
    return result.rows[0];
}

const getUserByToken = async (request, response) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, secretKey);
      const user = await findUserByEmail(decoded.email);
      return response.status(200).json({ user});
    } catch (error) {
        return response.status(401).json({ message: 'Invalid token' });
    }
  }

const authenticateUser = async (request, response) => {
    let { email,password } = request.body;
     try {
      const user = await findUserByEmail(email);
      if (!user) {
        return response.status(401).json({ message: 'Invalid credentials' });
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return response.status(401).json({ message: 'Invalid credentials' });
      }
      // Generate JWT token
      const token = jwt.sign({ email: user.email }, secretKey);
      return response.status(200).json({ token });
    } catch (error) {
      return response.status(500).json({ message: 'Server error' });
    }
};

// GET ALL USERS
const getUsers = (request, response) => {
    pool.query("SELECT id,name,email FROM users", function (error, results) {
        if (error) {
            throw error
        }
        return response.status(200).json(results.rows);
    })
}

// GET USER BY ID
const getUserById = (request, response) => {
    let id = +(request.params.id);
    pool.query(`SELECT * FROM users where id = ${id}`, function (error, results) {
        if (error) {
            throw error
        }
        return response.status(200).json(results.rows[0]);
    })
}

// DELETE USER BY ID
const deleteUserById = (request, response) => {
    let id = +(request.params.id);
    pool.query(`DELETE FROM users where id = ${id}`, function (error, results) {
        if (error) {
            throw error
        }
        return response.status(200).json({ message: `Deleted User Id: ${id}` });
    })
}

// REGISTER NEW USER
const registerUser = async (request, response) => {
    let { name, email,password } = request.body;
    const user = await findUserByEmail(email);
    if (user) {
        return response.status(400).json({ message: 'User with the email already exists' });
    }
    const hashedPassword = await hashPassword(password);
    let sqlQuery = `INSERT INTO users(name, email,password) VALUES ('${name}', '${email}', '${hashedPassword}')`;
    pool.query(sqlQuery, function (error, results) {
        if (error) {
            throw error
        }
        return response.status(200).json({ message: 'User Registered' });
    })
}
// ADD NEW USER
const addUser = async (request, response) => {
    let { name, email } = request.body;

    const hashedPassword = await hashPassword(password);
    let sqlQuery = `INSERT INTO users(name, email,password) VALUES ('${name}', '${email}')`;
    pool.query(sqlQuery, function (error, results) {
        if (error) {
            throw error
        }
        return response.status(200).send({ message: 'Added User' });
    })
}

// UPDATE EXISTING USER
const updateUser = (request, response) => {
    let id = +(request.params.id);
    let { name, email } = request.body;
    pool.query(`UPDATE users SET name='${name}', email='${email}' where id = ${id}`, function (error, results) {
        if (error) {
            throw error
        }
        return response.status(200).send({'message':`Update User Id: ${id}`});
    })
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