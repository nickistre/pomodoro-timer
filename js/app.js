// Set this to true to use a shortened timer pattern
var debugMode = true;

function refreshTimer(currentStatus) {
    console.log(currentStatus);

    var $controlBtn = jQuery('#control-btn');
    var $timerContainer = jQuery('#timer-container');

    if (currentStatus.status === PomodoroTimer.STATUS_PAUSED) {
        $controlBtn.html('Start');
        $timerContainer.removeClass('running');
        $timerContainer.addClass('paused');
    }
    else {
        $controlBtn.html('Pause');
        $timerContainer.removeClass('paused');
        $timerContainer.addClass('running');
    }

    // Update main timer display
    var timerSplit = splitTimer(currentStatus.totalSeconds);
    jQuery('#main-timer .minutes').html(zeroPad(timerSplit.minutes, 2));
    jQuery('#main-timer .seconds').html(zeroPad(timerSplit.seconds, 2));

    // Show mode
    jQuery('#mode-display').html('<strong>Mode: </strong>' + capitalizeFirstLetter(currentStatus.modeString));



    // Setup next button and effects
    var $nextRoundBtn = jQuery('#next-round-btn');
    if (currentStatus.status === PomodoroTimer.STATUS_PAUSED) {
        jQuery('#status').html('<em>Timer Paused</em>');
        $nextRoundBtn.hide();
    }
    else {
        jQuery('#status').html('');
        if (currentStatus.mode === PomodoroTimer.MODE_REST) {
            $nextRoundBtn.show();
            if (!currentStatus.canStartNextRound) {
                // Enable next button
                $nextRoundBtn.prop('disabled', true);
                if (currentStatus.minRestTimer !== null) {
                    var nextTimerSplit = splitTimer(currentStatus.totalMinRestSeconds);
                    $nextRoundBtn.html('Rest for at least: ' + zeroPad(nextTimerSplit.minutes, 2)+':'+zeroPad(nextTimerSplit.seconds, 2));
                }

            }
            else {
                $nextRoundBtn.prop('disabled', false);
                $nextRoundBtn.html('Start Next Round Now');
            }
        }
        else {
            $nextRoundBtn.hide();
        }
    }


    // Display round count
    jQuery('#round-count').html(currentStatus.roundCount);

    // Show some alerts if the mode changed
    if (currentStatus.status) {
        if (currentStatus.mode !== refreshTimer.oldMode) {
            if (currentStatus.mode === PomodoroTimer.MODE_REST) {
                showAlert('<strong>Take a break!</strong> Get up, walk around, get some coffee, and rest up for the next round.', 'danger');
            }
            else if (currentStatus.mode === PomodoroTimer.MODE_WORK) {
                showAlert('<strong>Continue Working!</strong> Keep knocking out those tasks!', 'success');
            }
        }
    }

    refreshTimer.oldStatus = currentStatus.status;
    refreshTimer.oldMode = currentStatus.mode;

}

// Setup some static variables on the refreshTimer call
refreshTimer.oldMode = null;
refreshTimer.oldStatus = null;

var pomodoroTimer = new PomodoroTimer(refreshTimer);

function refreshTodo(currentList) {
    console.log(currentList);

    // Update todo section
    var $todoSection = jQuery('#list-todo');

    $todoSection.html('');

    if (currentList.todo.length > 0) {
        for (var todoIndex in currentList.todo) {
            var todo = currentList.todo[todoIndex];

            var todoId = 'list-item-' + todo.index;

            var todoHtml = "<div class='list-item'><input id='" + todoId + "' class='list-item-chkbox' type='checkbox' data-id='" + todo.index + "'><label for='" + todoId + "'>" + escapeHtml(todo.item.text) + "</label></div>";

            $todoSection.append(todoHtml);
        }
    }
    else {
        $todoSection.html('<small><em>No todo tasks!  Create a task with the text field above</em></small>');
    }

    // Update complete section
    var $completeSection = jQuery('#list-complete');

    $completeSection.html('');

    if (currentList.completed.length > 0) {
        for (var completeIndex in currentList.completed) {
            var complete = currentList.completed[completeIndex];

            var completeId = 'list-item-' + complete.index;

            var completeHtml = "<div class='list-item'><input id='" + completeId + "' class='list-item-chkbox' type='checkbox' data-id='" + complete.index + "' checked='checked'><label for='" + completeId + "'>" + escapeHtml(complete.item.text) + "</label></div>";

            $completeSection.append(completeHtml);
        }
    }
    else {
        $completeSection.html('<small><em>No completed tasks!  Tasks will be moved here as they are checked off above</em></small>');
    }
}

var todoList = new Todo.List(refreshTodo);

// Will just use basic jQuery

jQuery(function() {
    // Debug timer system with alternate timings
    if (debugMode) {
        pomodoroTimer.setTimerPatterns([
            {
                workTime: 10,
                restMinTime: 5,
                restMaxTime: 10
            },
            {
                workTime: 10,
                restMinTime: 5,
                restMaxTime: 10
            },
            {
                workTime: 10,
                restMinTime: 5,
                restMaxTime: 10
            },
            {
                workTime: 10,
                restMinTime: 20,
                restMaxTime: 30
            }
        ]);
    }

    jQuery('#control-btn').click(function() {
        if (pomodoroTimer.getStatus() == PomodoroTimer.STATUS_PAUSED) {
            pomodoroTimer.resume();

            // Show alert depending on mode
            if (pomodoroTimer.getMode() === PomodoroTimer.MODE_WORK) {
                showAlert('<strong>Start Working!</strong> Create some tasks and knock them out!', 'success');
            }
            else {
                showAlert('<strong>Take a break!</strong> Get up, walk around, get some coffee, and rest up for the next round.', 'danger');
            }
        }
        else {
            pomodoroTimer.pause();
            showAlert('<strong>Timer Paused!</strong> Click on the Start button to resume the timer.', 'info');
        }
    });

    jQuery('#reset-btn').click(function() {
        pomodoroTimer.reset();
        showAlert('<strong>Timer Reset!</strong> Click on the Start button to start the timer.', 'info');
    });

    jQuery('#next-round-btn').click(function () {
        pomodoroTimer.next();
    });


    /**
     * {@link https://stackoverflow.com/a/12518467/1946899|Modified from Source}
     */
    jQuery('#add-todo-field').keypress(function(e) {
        if (e.which == 13) {
            var $addTodoField = jQuery('#add-todo-field');
            var newTodo = $addTodoField.val();

            if (newTodo) {
                todoList.add(newTodo);
            }
            $addTodoField.val('');
        }
    });

    jQuery('.todo-list').on('change', '.list-item-chkbox', {}, function(e) {
        console.log(e);

        var complete = e.currentTarget.checked;
        var index = parseInt(jQuery(e.currentTarget).data('id'));

        todoList.markComplete(index, complete);
    })

    // Setup initial alert
    showAlert('<strong>Welcome!</strong> Create some initial todo tasks and click on the Start button to start the timer.', 'primary');
});