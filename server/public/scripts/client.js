$(document).ready(() => {
    setupClickListeners();
    getTasks();
})

function setupClickListeners() {
    $('#addTaskButton').on('click', createTask);
    $('#taskOutputsBody').on('click', '.deleteTaskButton', deleteTaskAlert);
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
    checkNewTask(newTask)
}

function checkNewTask(newTask) {
    for (const prop in newTask) {
        if (newTask[prop] === '') {
            Swal.fire({
                title: 'Forgot something',
                imageUrl: '../images/scottForgot.gif',
                imageWidth: '240px',
                imageHeight: 'auto',
                confirmButtonText: 'Ok',
            })
            return false
        }
    }
    if (newTask.progress < 0 || newTask.progress > 100) {
        Swal.fire({
            title: 'What is a percentage anyway?',
            imageUrl: '../images/noMath.gif',
            imageWidth: '240px',
            imageHeight: 'auto',
            confirmButtonText: 'Ok',
        })
        return false;
    } else if (newTask.startDate > newTask.endDate) {
        Swal.fire({
            title: 'Your dates are backwards',
            imageUrl: '../images/garfieldBackwards.gif',
            imageWidth: '240px',
            imageHeight: 'auto',
            confirmButtonText: 'Ok',
        })
        return false
    } else {
        sendTask(newTask);
    }
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
        let isChecked = '';
        let isGrey = '';
        let isPriority = '';
        if (allTasks[i].complete) {
            isChecked = 'checked';
            isGrey = "style='background-color:grey'"
        }
        if (allTasks[i].priority) {
            isPriority = '../images/checkTrue.png'
        } else {
            isPriority = '../images/checkFalse.png'
        }
        el.append(`<tr ${isGrey}><td class="taskCheckbox"><input class="taskCheckboxInput" type="checkbox" data-id="${allTasks[i].id}" ${isChecked}></td>
            <td class="task">${allTasks[i].task}</td>
            <td class="taskStartDate">${allTasks[i].start_date}</td>
            <td class="taskEndDate">${allTasks[i].end_date}</td>
            <td class="taskPriority"><img class="taskPriorityImage" src="${isPriority}"</td>
            <td class="taskProgress">${allTasks[i].progress}</td>
            <td class="taskUser">${allTasks[i].username}</td>
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

function deleteTaskAlert() {
    let id = $(this).data('id')
    Swal.fire({
        title: 'Are you sure?',
        showClass: {
            popup: 'animate__animated animate__backInUp',
            backdrop: 'swal2-backdrop-show',
        },
        hideClass: {
            popup: 'animate__animated animate__backOutUp',
        },
        imageUrl: '../images/goAhead.gif',
        imageWidth: '240px',
        imageHeight: 'auto',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
        footer: "A footer because I like talking",
    }).then(result => {
        if (result.isConfirmed) {
            deleteTask(id);
        } else if (result.isDenied) {
            return false;
        }
    })
}

function deleteTask(id) {    
    $.ajax({
        method: 'DELETE',
        url: `/list/deleteTask?id=${id}`
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
