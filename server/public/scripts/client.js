$(document).ready(() => {
    setupClickListeners();
    getTasks();
})

function setupClickListeners() {
    $('#addTaskButton').on('click', checkAddTask);
    $('#taskOutputsBody').on('click', '.deleteTaskButton', deleteTask);
    $('#taskOutputsBody').on('change', '.taskCheckboxInput', checkboxToggle)
}

function checkAddTask() {
    let taskIn = $('#taskIn').val();
    let startDateIn = $('#startDateIn').val();
    let endDateIn = $('#endDateIn').val();
    let priorityIn = $('#priorityIn').val();
    let progressIn = $('#progressIn').val();
    let usernameIn = $('#usernameIn').val();
    newTask(taskIn, startDateIn, endDateIn, priorityIn, progressIn, usernameIn);
    emptyInputs();
}

function newTask(taskIn, startDateIn, endDateIn, priorityIn, progressIn, usernameIn) {
    let newTask = {
        complete: 'No',
        task: taskIn,
        startDate: startDateIn,
        endDate: endDateIn,
        priority: priorityIn,
        progress: progressIn,
        username: usernameIn
    }
    sendTask(newTask);
}

function sendTask(newTask) {
    $.ajax({
        method: 'POST',
        url: '/list/sendTask',
        data: newTask
    }).then(response => {
        console.log('POST sendTask Then');
        getTasks();
    }).catch(error => {
        console.log(`POST sendTask Error: ${error}`);
    })
}

function getTasks() {
    console.log('GET /list/getTasks');
    $.ajax({
        method: 'GET',
        url: '/list/getTasks'
    }).then(response => {
        console.log('GET getTasks Then');
        appendsTasks(response);
    }).catch(error => {
        console.log(`GET getTasks Error: ${error}`);
    })
}

function appendsTasks(allTasks) {
    console.log('Appends Tasks');
    let el = $('#taskOutputsBody');
    el.empty();
    for (i = 0; i < allTasks.length; i++) {
        el.append(`<tr><td class="taskCheckbox"><input class="taskCheckboxInput" type="checkbox" data-id="${allTasks[i].id}"/></td>
            <td class="task">${allTasks[i].task}</td>
            <td class="taskStartDate">${allTasks[i].start_date}</td>
            <td class="taskEndDate">${allTasks[i].end_date}</td>
            <td class="taskPriority">${allTasks[i].priority}</td>
            <td class="taskProgress">${allTasks[i].progress}</td>
            <td class="taskUser">${allTasks[i].username}</td>
            <td class="updateTask"><button class="updateTaskButton">Update</button></td>
            <td class="deleteTask"><button class="deleteTaskButton" data-id="${allTasks[i].id}">Delete</button></td></tr>`)
    }
}

function updateComplete(id, isChecked) {
    $.ajax({
        method: 'PUT',
        url: `/list/updateComplete?id=${id}&completed=${isChecked}`
    }).then(response => {
        console.log('PUT updateComplete Then');
        getTasks();
    }).catch(error => {
        console.log(`PUT updateComplete Error: ${error}`);
    })
}

function deleteTask() {
    $.ajax({
        method: 'DELETE',
        url: `/list/deleteTask?id=${$(this).data('id')}`
    }).then(response => {
        console.log('DELETE deleteTask Then');
        getTasks();
    }).catch(error => {
        console.log(`DELETE deleteTask Error: ${error}`);
    })
}

function checkboxToggle() {
    let id = $(this).data('id')
    let isChecked = 'No';
    if ($(this).is(':checked')) {
        $(this).closest('tr').css('background-color', 'grey');
        isChecked = 'Yes';
    } else {
        $(this).closest('tr').css('background-color', 'inherit');
    }
    updateComplete(id, isChecked);
}   

function emptyInputs() {
    $('#taskIn').val('');
    $('#startDateIn').val('');
    $('#endDateIn').val('');
    $('#priorityIn').val('');
    $('#progressIn').val('');
    $('#usernameIn').val('');
}
