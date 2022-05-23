const express = require('express');
const taskRouter = express.Router();
const pool = require('./pool');
const luxon = require('luxon');
const dateTime = luxon.DateTime;

taskRouter.post('/sendTask', (req, res) => {
    console.log('POST sendTask Server');
    console.log(req.body)
    let queryString = 'INSERT INTO tasks (complete, task, start_date, end_date, priority, progress, username) VALUES ($1, $2, $3, $4, $5, $6, $7);';
    let values = [req.body.complete, req.body.task, transformDate(req.body.startDate), transformDate(req.body.endDate), req.body.priority, req.body.progress, req.body.username];
    pool.query(queryString, values)
    .then(result => {
        res.sendStatus(200);
    }).catch(error => {
        console.log(error);
    })
})

taskRouter.get('/getTasks', (req, res) => {
    console.log('GET getTasks Server');
    let queryString = 'SELECT * FROM tasks;';
    pool.query(queryString)
    .then(result => {
        res.send(result.rows);
    }).catch(error => {
        console.log(error);
        res.sendStatus(500);
    })
})

taskRouter.put('/updateComplete', (req, res) => {
    console.log('PUT updateComplete Server');
    console.log(req.query.completed)
    let queryString = `UPDATE tasks SET complete = '${req.query.completed}' WHERE id = ${req.query.id};`
    pool.query(queryString)
    .then(result => {
        res.sendStatus(200);
    }).catch(error => {
        console.log(error);
        res.sendStatus(500);
    })
})

taskRouter.delete('/deleteTask', (req, res) => {
    console.log('DELETE deleteTask Server');
    let queryString = `DELETE FROM tasks WHERE id=${req.query.id}`
    pool.query(queryString)
    .then(result => {
        res.sendStatus(200);
    }).catch(result => {
        res.sendStatus(500);
    })
})

function transformDate(date) {
    let time = dateTime.fromISO(date);
    let year = `${time.year}`;
    let slice = year.slice(2);
    return `${time.month}/${time.day}/${slice}`
}

module.exports = taskRouter
