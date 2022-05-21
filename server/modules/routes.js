const express = require('express');
const listRouter = express.Router();
const pool = require('./pool');

listRouter.post('/', (req, res) => {
    console.log('POST Server In');
    let queryString = 'INSERT INTO tasks (task, startDate, endDate, priority, progress, user) VALUES ($1, $2, $3, $4, $5, $6);';
    let values = [req.body.task, req.body.startDate, req.body.endDate, req.body.priority, req.body.progress, req.body.user];
    pool.query(queryString, values)
    .then(result => {
        res.sendStatus(200);
    }).catch(error => {
        console.log(error);
    })
})

listRouter.get('/', (req, res) => {
    console.log('GET Server In');
    let queryString = 'SELECT * FROM tasks;';
    pool.query(queryString)
    .then(result => {
        console.log(result.rows)
        res.send(result.rows);
    }).catch(error => {
        console.log(error);
        res.sendStatus(500);
    })
})

module.exports = listRouter
