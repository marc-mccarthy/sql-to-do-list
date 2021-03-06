$(document).ready(() => {
    setupClickListeners();
    getTasks();
})

// listen for button clicks and changes
function setupClickListeners() {
    $('#addTaskButton').on('click', createTask);
    $('#taskOutputsBody').on('click', '.deleteTaskButton', deleteTaskAlert);
    $('#taskOutputsBody').on('change', '.taskSwitchInput', checkboxToggle);
}

// create a task object, send to check validity when done
function createTask() {
    let newTask = {
        complete: 'No',
        task: $('#taskIn').val(),
        startDate: $('#startDateIn').val(),
        endDate: $('#endDateIn').val(),
        priority: $('#priorityIn').val(),
        progress: $('#progressIn').val(),
        username: $('#usernameIn').val(),
    }
    emptyInputs();
    checkNewTask(newTask);
}

// validate all properties in newTask, throw alerts if bad input
function checkNewTask(newTask) {
    for (const prop in newTask) {
        if (newTask[prop] === '') {
            Swal.fire({
                title: 'Forgot something',
                showClass: {
                    popup: 'animate__animated animate__rotateIn',
                    backdrop: 'swal2-backdrop-show',
                },
                hideClass: {
                    popup: 'animate__animated animate__rotateOut',
                },
                imageUrl: '../images/scottForgot.gif',
                imageWidth: '240px',
                imageHeight: 'auto',
                confirmButtonText: 'Ok',
            })
            return false;
        }
    }
    if (newTask.progress < 0 || newTask.progress > 100) {
        Swal.fire({
            title: 'What is a percentage anyway?',
            showClass: {
                popup: 'animate__animated animate__backInDown',
                backdrop: 'swal2-backdrop-show',
            },
            hideClass: {
                popup: 'animate__animated animate__backOutDown',
            },
            imageUrl: '../images/noMath.gif',
            imageWidth: '240px',
            imageHeight: 'auto',
            confirmButtonText: 'Ok',
        })
        return false;
    } else if (newTask.startDate > newTask.endDate) {
        Swal.fire({
            title: 'Your dates are backwards',
            showClass: {
                popup: 'animate__animated animate__bounceIn',
                backdrop: 'swal2-backdrop-show',
            },
            hideClass: {
                popup: 'animate__animated animate__bounceOut',
            },
            imageUrl: '../images/garfieldBackwards.gif',
            imageWidth: '240px',
            imageHeight: 'auto',
            confirmButtonText: 'Ok',
        })
        return false;
    } else {
        sendTask(newTask);
    }
}

// post newTask to server, get tasks from server when done
function sendTask(newTask) {
    console.log('POST sendTask');
    $.ajax({
        method: 'POST',
        url: '/list/sendTask',
        data: newTask,
    }).then(response => {
        getTasks();
    }).catch(error => {
        console.log(`POST sendTask Error: ${error}`);
    })
}

//----- INCLUDED: feature-ordering-task-query -----//
// get tasks from server, send to be appended when done
function getTasks() {
    console.log('GET getTasks');
    $.ajax({
        method: 'GET',
        url: '/list/getTasks?sort=DESC',
    }).then(response => {
        appendsTasks(response);
    }).catch(error => {
        console.log(`GET getTasks Error: ${error}`);
    })
}

// appends all tasks to DOM after checking for 'checks' and 'completed'
function appendsTasks(allTasks) {
    console.log('Appends Tasks');
    let el = $('#taskOutputsBody');
    el.empty();
    for (i = 0; i < allTasks.length; i++) {
        let isChecked = '';
        let isGrey = '';
        let isBlue = '';
        let isPriority = '';
        if (allTasks[i].complete) {
            isChecked = 'checked';
            isGrey = "style='background-color:grey'";
            isBlue = "style='background-color:lightblue'"
        }
        if (allTasks[i].priority) {
            isPriority = '../images/checkTrue.png';
        } else {
            isPriority = '../images/checkFalse.png';
        }
        el.append(
            `<tr class="taskRow" ${isGrey}>
                <td class="form-switch">
                    <input class="form-check-input taskSwitchInput" role="switch" type="checkbox" data-id="${allTasks[i].id}" ${isChecked}>
                </td>
                <td class="task">${allTasks[i].task}</td>
                <td class="taskStartDate">${allTasks[i].start_date}</td>
                <td class="taskEndDate">${allTasks[i].end_date}</td>
                <td class="taskPriority"><img class="taskPriorityImage" src="${isPriority}"</td>
                <td class="taskProgress">${allTasks[i].progress}%</td>
                <td class="taskUser">${allTasks[i].username}</td>
                <td class="taskFinishDate" ${isBlue}>${allTasks[i].finish_date}</td>
                <td class="deleteTask"><button class="deleteTaskButton form-control btn btn-danger" data-id="${allTasks[i].id}">Delete</button></td>
            </tr>`
        );
    }
}

// toggles checkbox css formatting, sends to be updated when done
function checkboxToggle() {
    let id = $(this).data('id');
    let isChecked = 'No';
    if ($(this).is(':checked')) {
        $(this).closest('tr').css('background-color', 'grey');
        isChecked = 'Yes';
    } else {
        $(this).closest('tr').css('background-color', 'inherit');
    }
    updateComplete(id, isChecked);
}

// put task to server with query params, get tasks from server when done
function updateComplete(id, isChecked) {
    console.log('PUT updateComplete');
    $.ajax({
        method: 'PUT',
        url: `/list/updateComplete?id=${id}&completed=${isChecked}`,
    }).then(response => {
        getTasks();
    }).catch(error => {
        console.log(`PUT updateComplete Error: ${error}`);
    })
}

//----- INCLUDED: feature-confirm-delete -----//
// delete task popup confirmation with confirmation, send to delete if confirmed 
function deleteTaskAlert() {
    let id = $(this).data('id');
    Swal.fire({
        title: 'Are you sure?',
        showClass: {
            popup: 'animate__animated animate__fadeIn',
            backdrop: 'swal2-backdrop-show',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOut',
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

// delete task with query param, get tasks back from server when done
function deleteTask(id) {
    console.log('DELETE deleteTask')  ;
    $.ajax({
        method: 'DELETE',
        url: `/list/deleteTask?id=${id}`,
    }).then(response => {
        getTasks();
    }).catch(error => {
        console.log(`DELETE deleteTask Error: ${error}`);
    })
}

// empties DOM inputs on function call
function emptyInputs() {
    $('#taskIn').val('');
    $('#startDateIn').val('');
    $('#endDateIn').val('');
    $('#progressIn').val('');
    $('#usernameIn').val('');
}
