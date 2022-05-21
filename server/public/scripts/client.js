$(document).ready(() => {
    setupClickListeners();
    getList();
})

function setupClickListeners() {
    $('#addTaskButton').on('click', checkAddTask);
}

function checkAddTask() {
    let taskIn = $('#taskIn').val();
    let startDateIn = $('#startDateIn').val();
    let endDateIn = $('#endDateIn').val();
    let priorityIn = $('#priorityIn').val();
    let progressIn = $('#progressIn').val();
    let userIn = $('#userIn').val();
    addTask(taskIn, startDateIn, endDateIn, priorityIn, progressIn, userIn);
    emptyInputs();
}

function addTask(taskIn, startDateIn, endDateIn, priorityIn, progressIn, userIn) {
    let newTask = {
        task: taskIn,
        startDate: startDateIn,
        endDate: endDateIn,
        priority: priorityIn,
        progress: progressIn,
        user: userIn
    }
    sendTask(newTask);
}

function sendTask(task) {
    $.ajax({
        method: 'POST',
        url: '/list',
        data: task
    }).then(response => {
        console.log('POST Then');
        console.log(response);
    }).catch(error => {
        console.log('POST Error')
    })
}

function getList() {
    console.log('GET /list');
    $.ajax({
        method: 'GET',
        url: '/list'
    }).then(response => {
        console.log('GET Then');
        appendsList(response);
    }).catch(error => {
        console.log('GET Error');
    })
}

function appendsList(tasks) {
    console.log('Appends List');
    let el = $('#taskOutputsBody');
    el.empty();
    for (i = 0; i < tasks.length; i++) {
        el.append(`<tr><td class="task">${tasks[i].task}</td>
            <td class="taskStartDate">${tasks[i].start_date}</td>
            <td class="taskEndDate">${tasks[i].end_date}</td>
            <td class="taskPriority">${tasks[i].priority}</td>
            <td class="taskProgress">${tasks[i].progress}</td>
            <td class="taskUser">${tasks[i].user}</td></tr>`)
    }
}

function emptyInputs() {
    $('#taskIn').val('');
    $('#startDateIn').val('');
    $('#endDateIn').val('');
    $('#priorityIn').val('');
    $('#progressIn').val('');
    $('#userIn').val('');
}
