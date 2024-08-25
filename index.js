const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser')
const app = express();
app.use(cors());

const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const usert_queries = require("./user-queries");
const upload_queries = require("./upload-queries");
const authMiddleware=require('./middleware/auth')
const chat_queries = require("./chat-queries");

const secretKey = 'your-secret-key'; 

app.use('/uploads', express.static('uploads'));
// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec))

/**
* @swagger
*   /:
*   get:
*     description: get info message
*     tags:
*       - users
*     produces:
*       - application/json
*     responses:
*       200:
*        description: users
*        schema:
*          $ref: "/"
*
*/
app.get('/', function (req, res) {
    res.send('Hello World');
})

/**
* @swagger
*   /users:
*   get:
*     description: get users list
*     tags:
*       - users
*     produces:
*       - application/json
*     responses:
*       200:
*        description: users
*        schema:
*          $ref: "/users"
*
*/
app.get('/users',authMiddleware.authenticateToken, usert_queries.getUsers);

/**
* @swagger
*   /users/{id}:
*   get:
*     description: return specific user
*     tags:
*       - users
*     produces:
*       - application/json
*     parameters:
*        - name: id
*          description: id of the user to retrieve
*          in: path
*          required: true
*          type: number
*     responses:
*       200:
*        description: users
*        schema:
*          $ref: "/users"
*
*/
app.get('/users/:id',authMiddleware.authenticateToken, usert_queries.getUserById);

/**
* @swagger
*   /users/{id}:
*   delete:
*     description: delete specific user
*     tags:
*       - users
*     produces:
*       - application/json
*     parameters:
*        - name: id
*          description: delte user
*          in: path
*          required: true
*          type: number
*     responses:
*       200:
*        description: users
*        schema:
*          $ref: "/users"
*
*/
app.delete('/users/:id',authMiddleware.authenticateToken, usert_queries.deleteUserById);

/**
* @swagger
* /users:
*   post:
*     description: Create a new user
*     tags:
*       - users
*     requestBody:
*       description: Create user object
*       content:
*           application/json:
*               schema:
*                $ref: '#/components/schemas/User'
*           application/xml:
*               schema:
*                   $ref: '#/components/schemas/User'
*           application/x-www-form-urlencoded:
*               schema:
*                   $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: new user
*         schema:
*           $ref: '/users'
*/
app.post('/users',authMiddleware.authenticateToken, usert_queries.addUser);

/**
* @swagger
*   /users/{id}:
*   put:
*     description: return specific user
*     tags:
*       - users
*     produces:
*       - application/json
*     parameters:
*        - name: id
*          description: id of the user to update
*          in: path
*          required: true
*          type: number
*     requestBody:
*       description: Create user object
*       content:
*           application/json:
*               schema:
*                $ref: '#/components/schemas/User'
*           application/xml:
*               schema:
*                   $ref: '#/components/schemas/User'
*           application/x-www-form-urlencoded:
*               schema:
*                   $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: new user
*         schema:
*           $ref: '/users'
*/
app.put('/users/:id',authMiddleware.authenticateToken, usert_queries.updateUser);

/**
* @swagger
* components:
*   schemas:
*       User:
*           type: object
*           properties:
*               name:
*                   type: string
*                   example: harsh
*               email:
*                   type: string
*                   example: harsh@gmail.com
*/


app.post('/register_users', usert_queries.registerUser);
app.post('/login', usert_queries.authenticateUser);
app.get('/get_auth_user', usert_queries.getUserByToken);
app.get('/uploads',authMiddleware.authenticateToken, upload_queries.getFiles);
app.get('/uploads/:id',authMiddleware.authenticateToken, upload_queries.getFileById);
app.delete('/uploads/:id',authMiddleware.authenticateToken, upload_queries.deleteFileById);

app.post('/uploads',authMiddleware.authenticateToken, upload_queries.addFile);
app.put('/uploads/:id',authMiddleware.authenticateToken, upload_queries.updateFile);

app.post('/chats',authMiddleware.authenticateToken, chat_queries.addChat);
app.get('/chats',authMiddleware.authenticateToken, chat_queries.getChats);

app.listen(4200);