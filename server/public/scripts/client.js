$(document).ready(() => {
   setupClickListeners();
   getList();
})

function setupClickListeners() {
   $('#addTaskButton').on('click', checkAddTask)
}

function checkAddTask() {
   let taskIn = $('#taskIn').val()
   let startDateIn = $('#startDateIn').val()
   let endDateIn = $('#endDateIn').val()
   let priorityIn = $('#priorityIn').val()
   let progressIn = $('#progressIn').val()
   let userIn = $('#userIn').val()
   addTask(taskIn, startDateIn, endDateIn, priorityIn, progressIn, userIn)
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

function appendsList(response) {
   console.log('Appends List')
}

function emptyInputs() {
   $('#taskIn').val('')
   $('#startDateIn').val('')
   $('#endDateIn').val('')
   $('#priorityIn').val('')
   $('#progressIn').val('')
   $('#userIn').val('')
}