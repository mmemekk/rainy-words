const { io } = require('../serverfunctions/socket.js');

const fixedTime = 5; // Set default timer (e.g., 300 seconds)
let timerInterval = null; // To store the interval ID
let timer = fixedTime; // Start with the default fixedTime

exports.trackTime = function (socket) {
    let minute = Math.floor(timer / 60);
    let second = timer % 60;

    // Emit initial time to the client
    socket.emit('counter', { minute, second });


    // If the timer is already running, reset it
    if (timerInterval) {
        clearInterval(timerInterval); // Stop the current timer
        timer = fixedTime; // Reset the timer to fixedTime
    }

    // Start counting down every second
    timerInterval = setInterval(() => {
        if (timer > 0) {
            timer--;
            minute = Math.floor(timer / 60);
            second = timer % 60;
            io.emit('counter', { minute, second }); // Emit updated time to all clients
        } else {
            clearInterval(timerInterval); // Stop the timer when it reaches 0
            io.emit('timesUp'); // Notify all clients that time's up
        }
    }, 1000);


    socket.on('resetTimer', () => {
        clearInterval(timerInterval); // Stop the current interval
        timerInterval = null; // Reset interval ID
        timer = fixedTime; // Reset the timer to fixedTime
        minute = Math.floor(timer / 60);
        second = timer % 60;
        io.emit('counter', { minute, second }); // Emit reset time to all clients
    });
};
