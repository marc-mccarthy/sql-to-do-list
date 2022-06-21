const express = require('express');
const taskRouter = express.Router();
const pool = require('./pool');
const luxon = require('luxon');
const dateTime = luxon.DateTime;

// inputs into database
taskRouter.post('/sendTask', (req, res) => {
    console.log('POST sendTask Server');
    let queryString = 'INSERT INTO tasks (complete, task, start_date, end_date, priority, progress, username) VALUES ($1, $2, $3, $4, $5, $6, $7);';
    let values = [req.body.complete, req.body.task, transformDate(req.body.startDate), transformDate(req.body.endDate), req.body.priority, req.body.progress, req.body.username];
    pool.query(queryString, values).then(result => {
        res.sendStatus(200);
    }).catch(error => {
        console.log(error);
    })
})

//----- INCLUDED: feature-ordering-task-query -----//
// gets from database
taskRouter.get('/getTasks', (req, res) => {
    console.log('GET getTasks Server');
    let queryString;
    if (req.query.sort === 'ASC') {
        queryString = 'SELECT * FROM tasks ORDER BY id ASC;';
    } else if (req.query.sort === 'DESC') {
        queryString = 'SELECT * FROM tasks ORDER BY id DESC;';
    }
    pool.query(queryString).then(result => {
        res.send(result.rows);
    }).catch(error => {
        console.log(error);
        res.sendStatus(500);
    })
})

//----- INCLUDED: feature-time-completed -----//
// updates into database
taskRouter.put('/updateComplete', (req, res) => {
    console.log('PUT updateComplete Server');
    let queryString;
    let values = [];
    if (req.query.completed === 'No') {
        queryString = `UPDATE tasks SET complete = $1, finish_date = $2 WHERE id = $3;`;
        values = [req.query.completed, 'Incomplete', req.query.id]
    } else {
        queryString = `UPDATE tasks SET complete = $1, finish_date = $2 WHERE id = $3;`;
        values = [req.query.completed, transformDate(new Date().toJSON()), req.query.id]
    }
    pool.query(queryString, values).then(result => {
        res.sendStatus(200);
    }).catch(error => {
        console.log(error);
        res.sendStatus(500);
    })
})

// deletes from database
taskRouter.delete('/deleteTask', (req, res) => {
    console.log('DELETE deleteTask Server');
    let queryString = `DELETE FROM tasks WHERE id = $1;`;
    let values = [req.query.id]
    pool.query(queryString, values).then(result => {
        res.sendStatus(200);
    }).catch(result => {
        res.sendStatus(500);
    })
})

// transforms dates into mm-dd-yy format on function call
function transformDate(date) {
    let time = dateTime.fromISO(date);
    let year = `${time.year}`;
    let slice = year.slice(2);
    return `${time.month}/${time.day}/${slice}`;
}

module.exports = taskRouter
