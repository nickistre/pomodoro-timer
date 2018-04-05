function splitTimer(timer) {
    return {
        minutes: parseInt(timer / 60, 10),
        seconds: parseInt(timer % 60, 10)
    };
}

/**
 *
 * @param number
 * @param size
 * @returns {string}
 * {@link https://stackoverflow.com/a/2998822/1946899|Modifed from Source}
 */
function zeroPad(number, size) {
    var s=number+'';
    while (s.length < size) {
        s = '0' + s;
    }

    return s;
}

/**
 *
 * @param string
 * @returns {string}
 * {@link https://stackoverflow.com/a/1026087/1946899|Source}
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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
    if (currentStatus.canStartNextRound) {
        // Enable next button
        jQuery('#next-round-btn').prop('disabled', false);
    }
    else {
        jQuery('#next-round-btn').prop('disabled', true);
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