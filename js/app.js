function refreshTimer(currentStatus) {
    console.log(currentStatus);

    if (currentStatus.status == PomodoroTimer.STATUS_PAUSED) {
        jQuery('#control-btn').html('Start');
        jQuery('#timer-container').removeClass('running');
        jQuery('#timer-container').addClass('paused');
    }
    else {
        jQuery('#control-btn').html('Pause');
        jQuery('#timer-container').removeClass('paused');
        jQuery('#timer-container').addClass('running');
    }

    // Update main timer display
    var timerSplit = splitTimer(currentStatus.totalSeconds);
    jQuery('#main-timer .minutes').html(zeroPad(timerSplit.minutes, 2));
    jQuery('#main-timer .seconds').html(zeroPad(timerSplit.seconds, 2));

    // Show mode
    if (currentStatus.status == PomodoroTimer.STATUS_PAUSED) {
        jQuery('#mode-display').html('<em>Timer Paused</em>')
    }
    else {
        jQuery('#mode-display').html(capitalizeFirstLetter(currentStatus.modeString));
    }

    // Setup next button and effects
    if (currentStatus.mode == PomodoroTimer.MODE_REST) {
        jQuery('#next-round-btn').show();
        if (!currentStatus.canStartNextRound) {
            // Enable next button
            jQuery('#next-round-btn').prop('disabled', true);
            if (currentStatus.minRestTimer !== null) {
                var nextTimerSplit = splitTimer(currentStatus.totalMinRestSeconds);
                jQuery('#next-round-btn').html('Rest for at least: ' + zeroPad(nextTimerSplit.minutes, 2)+':'+zeroPad(nextTimerSplit.seconds, 2));
            }

        }
        else {
            jQuery('#next-round-btn').prop('disabled', false);
            jQuery('#next-round-btn').html('Start Next Round');
        }
    }
    else {
        jQuery('#next-round-btn').hide();
    }

}

var pomodoroTimer = new PomodoroTimer(refreshTimer);

// Debug timer system with alternate timings
// pomodoroTimer.setTimerPatterns([
//     {
//         workTime: 10,
//         restMinTime: 5,
//         restMaxTime: 10
//     },
//     {
//         workTime: 10,
//         restMinTime: 5,
//         restMaxTime: 10
//     },
//     {
//         workTime: 10,
//         restMinTime: 5,
//         restMaxTime: 10
//     },
//     {
//         workTime: 10,
//         restMinTime: 20,
//         restMaxTime: 30
//     }
// ]);

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
        $todoSection.html('<small><em>No todo tasks!  Fill in your first task in the text field above</em></small>');
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

    jQuery('#control-btn').click(function() {
        if (pomodoroTimer.getStatus() == PomodoroTimer.STATUS_PAUSED) {
            pomodoroTimer.resume();
        }
        else {
            pomodoroTimer.pause();
        }
    });

    jQuery('#reset-btn').click(function() {
        pomodoroTimer.reset();
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
});