const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const Pool = require("pg").Pool;
const constant=require("./util/constant")
const pool = new Pool(constant.databaseConfig)
const Upload = require('./models/uploads');

const { Op } = require('sequelize');

const getFiles = async (request, response) => {
    const files = await Upload.findAll();
    return response.json(files);
}

const getFileById = async (request, response) => {
    const id = +(request.params.id);
    const file = await Upload.findByPk(id);
    if (!file) {
        return response.status(404).json({ message: 'File not found' });
    }
    return response.json(file);
}

const deleteFileById = async (request, response) => {
    const id = +(request.params.id);
    const file = await Upload.findByPk(id);
    if (!file) {
        return response.status(404).json({ message: 'File not found' });
    }
    await file.destroy();
    return response.status(200).json({ message: `Deleted File Id: ${id}` });
}

const addFile = async (request, response) => {
    const form = new formidable.IncomingForm();
    let newpath = '';
    form.parse(request, async (err, fields, files) => {
        if (err) {
            return;
        }
        const label = Array.isArray(fields.label) ? fields.label[0] : fields.label;
        let oldpath = files.filetoupload[0].filepath;
        let fileExtension = files.filetoupload[0].originalFilename.split('.').pop();
        newpath =   "uploads/" + Math.random().toString(36).substring(2, 10) + '.' + fileExtension;
        await new Promise((resolve, reject) => {
            fs.copyFile(oldpath, newpath, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        const filename = newpath;
        const file = await Upload.create({ label, filename });
        return response.status(200).json({ message: 'Added File', filename: newpath, data: file });
    });
}

const updateFile = async (request, response) => {
    const form = new formidable.IncomingForm({});
    let newpath = '';
    form.parse(request, async (err, fields, files) => {
        if (err) {
            return;
        }
        let id = +(request.params.id);
        const label = Array.isArray(fields.label) ? fields.label[0] : fields.label;
        let filename = null;
        if (files.filetoupload) {
            let oldpath = files.filetoupload[0].filepath;
            let fileExtension = files.filetoupload[0].originalFilename.split('.').pop();
            newpath =   "uploads/" + Math.random().toString(36).substring(2, 10) + '.' + fileExtension;
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
        const file = await Upload.update({ label, filename }, {
            where: {
                id: {
                    [Op.eq]: id
                }
            }
        });
        return response.status(200).send({ message: `Update File Id: ${id}`, filename: newpath });
    });
}


module.exports = {
    getFiles,
    getFileById,
    deleteFileById,
    addFile,
    updateFile
}
