/**
 *
 * @param updateCallback Function that will trigger on each timer update.  Current timer values and status will be provided
 * as a single object parameter.
 * @constructor
 */
function PomodoroTimer(updateCallback) {
    // Internal variables
    this.mode = null;
    this.status = null;
    this.intervalId = null;
    this.updateCallback = updateCallback;

    // Public parameters
    /**
     *
     * @type {*[]}
     */
    this.timerPatterns = [
        {
            workTime: 25*60,
            restMinTime: 3*60,
            restMaxTime: 5*60
        },
        {
            workTime: 25*60,
            restMinTime: 3*60,
            restMaxTime: 5*60
        },
        {
            workTime: 25*60,
            restMinTime: 3*60,
            restMaxTime: 5*60
        },
        {
            workTime: 25*60,
            restMinTime: 15*60,
            restMaxTime: 30*60
        }
    ];

    /**
     *
     * @type {number}
     */
    this.roundCount = 0;

    this.workTime = null;
    this.restMinTime = null;
    this.restMaxTime = null;
    this.timer = null;
    this.canStartNextRound = false;

    this.minRestTimer = null;


    // Init instance
    this.reset();
}

// Constants
PomodoroTimer.MODE_WORK = 0;
PomodoroTimer.MODE_REST = 1;

PomodoroTimer.MODE_STRINGS = {
    0: 'work',
    1: 'rest'
};

PomodoroTimer.STATUS_PAUSED = 0;
PomodoroTimer.STATUS_RUNNING = 1;

PomodoroTimer.STATUS_STRINGS = {
    0: 'paused',
    1: 'running'
};

// Internal Methods
/**
 * Should only run on reset or when needing to go to the next round.
 */
PomodoroTimer.prototype.setupNextRound = function()
{
    this.roundCount++;

    var patternIndex = (this.roundCount - 1) % this.timerPatterns.length;
    var pattern = this.timerPatterns[patternIndex];

    this.workTime = pattern.workTime;
    this.restMinTime = pattern.restMinTime;
    this.restMaxTime = pattern.restMaxTime;

    this.timer = this.workTime;
    this.mode = PomodoroTimer.MODE_WORK;
};

PomodoroTimer.prototype.runPollCallback = function() {
    var currentStatus = {
        totalSeconds: this.timer,
        totalMinRestSeconds: this.minRestTimer,
        canStartNextRound: this.canStartNextRound,
        mode: this.getMode(),
        modeString: this.modeString(),
        status: this.getStatus(),
        statusString: this.statusString(),
        roundCount: this.roundCount
    };

    this.updateCallback(currentStatus);
};

PomodoroTimer.prototype.internalPause = function() {
    this.status = PomodoroTimer.STATUS_PAUSED;
    if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }
};

PomodoroTimer.prototype.internalReset = function() {
    this.roundCount = 0;
    this.canStartNextRound = false;
    this.mode = null;
    this.status = PomodoroTimer.STATUS_PAUSED;
    this.setupNextRound();
};


// Public Methods

PomodoroTimer.prototype.setTimerPatterns = function(timerPatterns) {
    this.timerPatterns = timerPatterns;
    this.reset();
};

PomodoroTimer.prototype.reset = function() {
    this.internalPause();
    this.internalReset();
    this.runPollCallback();
};

PomodoroTimer.prototype.getMode = function() {
    return this.mode;
};

PomodoroTimer.prototype.modeString = function() {
    return PomodoroTimer.MODE_STRINGS[this.mode];
};

PomodoroTimer.prototype.getStatus = function() {
    return this.status;
};

PomodoroTimer.prototype.statusString = function() {
    return PomodoroTimer.STATUS_STRINGS[this.status];
};

PomodoroTimer.prototype.start = function() {
    this.internalReset();
    this.resume();
};

PomodoroTimer.prototype.pause = function() {
    this.internalPause();
    this.runPollCallback();
};

PomodoroTimer.prototype.resume = function() {
    this.status = PomodoroTimer.STATUS_RUNNING;
    this.runPollCallback();
    if (!this.intervalId) {
        var self = this;
        this.intervalId = window.setInterval(function () {

            if (--self.timer <= 0) {
                if (self.mode === PomodoroTimer.MODE_WORK) {
                    // Reset for restMaxTime
                    self.mode = PomodoroTimer.MODE_REST;
                    self.timer = self.restMaxTime;
                }
                else if (self.mode === PomodoroTimer.MODE_REST) {
                    // We are done, start the next round!
                    self.setupNextRound();
                }
            }

            // If in rest mode, check for if we can start the next round once restMinTime was reached.
            // Check if timer is less than the difference between restMaxTime and restMinTime
            self.canStartNextRound = self.mode === PomodoroTimer.MODE_REST && self.timer <= (self.restMaxTime - self.restMinTime);

            // Calculate min rest times
            if (self.mode === PomodoroTimer.MODE_REST) {
                if (self.timer > self.restMinTime) {
                    self.minRestTimer = self.timer - self.restMinTime;
                }
                else {
                    self.minRestTimer = 0;
                }
            }
            else {
                self.minRestTimer = null;
            }

            self.runPollCallback();
        }, 1000);
    }
};

PomodoroTimer.prototype.next = function() {
    this.setupNextRound();
}