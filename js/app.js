function poll(currentStatus) {
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

var pomodoroTimer = new PomodoroTimer(poll);

// Debug timer system with alternate timings
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
    })
});