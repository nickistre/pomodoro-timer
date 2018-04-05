/**
 *
 * @param pollFunc Function that will trigger on each timer update.  Current timer values and status will be provided
 * as a single object parameter.
 * @constructor
 */
function PomodoroTimer(pollFunc) {

    // Internal classes.

    /**
     * Class to use for each round
     *
     * TODO: Move this functionality into main class!
     *
     * @param workTime
     * @param restMinTime
     * @param restMaxTime
     * @param pollFunc Returns the current RoundTimer
     * @constructor
     */
    function RoundTimer(workTime, restMinTime, restMaxTime, pollFunc) {
        // Constants used internally by the timer
        var STATUS_START = 0;
        var STATUS_WORK = 1;
        var STATUS_REST = 2;
        var STATUS_COMPLETE = 3;

        var STATUS_STRINGS = {
            0: 'paused',
            1: 'work',
            2: 'rest',
            3: 'complete'
        };

        var status = STATUS_START;

        // Public parameters
        this.workTime = workTime;
        this.restMinTime = restMinTime;
        this.restMaxTime = restMaxTime;
        this.timer = null;
        this.canStartNextRound = false;

        this.minutes = null;
        this.seconds = null;

        this.displayMinutes = null;
        this.displaySeconds = null;

        // Public Methods
        this.reset = function() {
            this.status = STATUS_START;
            this.canStartNextRound = false;
        };

        this.statusString = function() {
            return STATUS_STRINGS[status];
        };

        /**
         * Modified much of this function from this jsfiddle: http://jsfiddle.net/wr1ua0db/17/
         */
        this.start = function () {
            status = STATUS_WORK;
            this.timer = this.workTime;
            this.canStartNextRound = false;

            this.resume();
        };

        this.resume = function() {
            var self = this;
            var intervalId = window.setInterval(function()
            {
                self.minutes = parseInt(self.timer / 60, 10)
                self.seconds = parseInt(self.timer % 60, 10);

                self.displayMinutes = self.minutes < 10 ? "0" + self.minutes : self.minutes.toString();
                self.displaySeconds = self.seconds < 10 ? "0" + self.seconds : self.seconds.toString();

                pollFunc(self);

                if (--self.timer <= 0) {
                    if (status == STATUS_WORK) {
                        // Reset for restMaxTime
                        status = STATUS_REST;
                        self.timer = self.restMaxTime;
                    }
                    else if (status == STATUS_REST) {
                        // We are done, start the next round!
                        status = STATUS_COMPLETE;
                        window.clearInterval(intervalId);
                        // Trigger the poll timer for the complete status
                        pollFunc(self);
                    }
                }

                // If in rest mode, check for if we can start the next round once restMinTime was reached.
                if (status == STATUS_REST) {
                    // Check if timer is less than the difference between restMaxTime and restMinTime
                    if (self.timer < (self.restMaxTime - self.restMinTime)) {
                        self.canStartNextRound = true;
                    }
                }
            }, 1000)
        };

        // Init
        this.reset();
    }

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
    /**
     * @type {RoundTimer}
     */
    this.currentRoundTimer = null;

    // Internal Methods
    /**
     * Should only run on reset or when needing to go to the next round.
     */
    this.updateCurrentRoundTimer = function()
    {
        this.roundCount++;

        var patternIndex = this.roundCount % this.timerPatterns.length;
        var pattern = this.timerPatterns[patternIndex];

        var self = this;
        currentRoundTimer = new RoundTimer(pattern.workTime, pattern.restMinTime, pattern.restMaxTime, function (roundTimer) {
            // If complete, need to move to the next round
            if (roundTimer.statusString() == 'complete') {
                self.updateCurrentRoundTimer();
            }
            else {
                var currentStatus = {
                    minutes: roundTimer.minutes,
                    seconds: roundTimer.seconds,
                    displayMinutes: roundTimer.displayMinutes,
                    displaySeconds: roundTimer.displaySeconds,
                    totalSeconds: roundTimer.timer,
                    canStartNextRound: roundTimer.canStartNextRound,
                    status: roundTimer.statusString(),
                    roundCount: self.roundCount
                }

                pollFunc(currentStatus);
            }
        });
    }


    // Public Methods

    this.reset = function() {
        roundCount = 0;
    }

    /**
     *
     * @returns {string}
     */
    this.status = function() {
        return currentRoundTimer.status();
    }

    this.start = function() {
        this.updateCurrentRoundTimer();
        this.reset();
        currentRoundTimer.start();
    }

    // Init instance
    this.reset();
}