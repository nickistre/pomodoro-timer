// Will just use basic jQuery
jQuery(function() {
    function poll(currentStatus) {
        console.log(currentStatus);
    }

    var pomodoroTimer = new PomodoroTimer(poll);

    // Debug timer system with alternate timings
    pomodoroTimer.timerPatterns = [
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
    ];

    pomodoroTimer.start();
});