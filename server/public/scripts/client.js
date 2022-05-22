$(document).ready(() => {
    setupClickListeners();
    getTasks();
})

function setupClickListeners() {
    $('#addTaskButton').on('click', createTask);
    $('#taskOutputsBody').on('click', '.deleteTaskButton', deleteTask);
    $('#taskOutputsBody').on('change', '.taskCheckboxInput', checkboxToggle)
}

function createTask() {
    let newTask = {
        complete: 'No',
        task: $('#taskIn').val(),
        startDate: $('#startDateIn').val(),
        endDate: $('#endDateIn').val(),
        priority: $('#priorityIn').val(),
        progress: $('#progressIn').val(),
        username: $('#usernameIn').val()
    }
    emptyInputs();
    if (checkNewTask(newTask)) {
        sendTask(newTask);
    } else {
        return false;
    }
}

function checkNewTask(newTask) {
    if (newTask.progress < 0 || newTask.progress > 100) {
        alert('Not a valid percentage');
        return false;
    } else if (newTask.startDate > newTask.endDate) {
        alert('The date values are not valid');
        return false;
    }
    for (const prop in newTask) {
        if (prop === '') {
            alert('Missed something');
            return false;
        }
    }
    return true
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
        console.log(allTasks[i].complete)
        let isChecked = '';
        let isGrey = '';
        if (allTasks[i].complete) {
            isChecked = 'checked';
            isGrey = "style='background-color:grey'"
        }
        el.append(`<tr ${isGrey}><td class="taskCheckbox"><input class="taskCheckboxInput" type="checkbox" data-id="${allTasks[i].id}" ${isChecked}></td>
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
