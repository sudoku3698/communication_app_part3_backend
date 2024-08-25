const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const Pool = require("pg").Pool;
const pool = new Pool({
    user: 'postgres',
    password: 'root',
    host: 'localhost',
    port: 5432,
    database: 'dashboard',
})

const getFiles = (request, response) => {
    pool.query("SELECT * FROM uploads", function (error, results) {
        if (error) {
            throw error
        }
        return response.json(results.rows);
    })
}

const getFileById = (request, response) => {
    let id = +(request.params.id);
    pool.query(`SELECT * FROM uploads where id = ${id}`, function (error, results) {
        if (error) {
            throw error
        }
        return response.status(200).json(results.rows);
    })
}

const deleteFileById = (request, response) => {
    let id = +(request.params.id);
    pool.query(`SELECT filename FROM uploads where id = ${id}`, function (error, results) {
        if (error) {
            throw error
        }
        let filename = results.rows[0].filename;
        fs.unlink(filename, (err) => {
            if (err) {
                throw err
            }
            pool.query(`DELETE FROM uploads where id = ${id}`, function (error, results) {
                if (error) {
                    throw error
                }
                return response.status(200).json({'message':`Deleted File ID:${id}`});
            })
        })
    })
}

const addFile = (request, response) => {
    const form = new formidable.IncomingForm();
    form.parse(request, (err, fields, files) => {
        if (err) {
        next(err);
        return;
        }
        console.log(fields, files)
        var oldpath = files.filetoupload[0].filepath;
        var fileExtension = files.filetoupload[0].originalFilename.split('.').pop();
        var newpath =   "uploads/" + Math.random().toString(36).substring(2, 10) + '.' + fileExtension;
            fs.copyFile(oldpath, newpath, function (err) { // 1st approach
                if (err) throw err;
                let label = fields.label;
                let filename = newpath;
    
                let sqlQuery = `INSERT INTO uploads(label, filename) VALUES ('${label}', '${filename}')`;
                pool.query(sqlQuery, function (error, results) {
                    if (error) {
                        throw error
                    }
                    return response.status(200).send({"message":"Added File"});
                })
            })    
    })
}

const updateFile = (request, response) => {
    const form = new formidable.IncomingForm();
    form.parse(request, async (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        let id = +(request.params.id);
        let label = fields.label;
        let filename = null;
        if (files.filetoupload) {
            let oldpath = files.filetoupload[0].filepath;
            let fileExtension = files.filetoupload[0].originalFilename.split('.').pop();
            let newpath =   "uploads/" + Math.random().toString(36).substring(2, 10) + '.' + fileExtension;
            try {
                await new Promise((resolve, reject) => {
                    fs.copyFile(oldpath, newpath, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
                filename = newpath;
            } catch (err) {
                throw err;
            }
        }
        let sqlQuery = `UPDATE uploads SET label='${label}'`;
        if (filename) {
            sqlQuery += `, filename='${filename}'`;
        }
        sqlQuery += ` where id = ${id}`;
        pool.query(sqlQuery, function (error, results) {
            if (error) {
                throw error
            }
            return response.status(200).send({"message":`Update File Id: ${id}`});
        })
    })
}



module.exports = {
    getFiles,
    getFileById,
    deleteFileById,
    addFile,
    updateFile
}
