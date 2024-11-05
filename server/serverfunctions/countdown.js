const { io } = require('./socket.js');


const fixedTime = 3; // Set default timer (e.g., 300 seconds)
let timerInterval = null; // To store the interval ID
let timer = fixedTime; // Start with the default fixedTime

exports.countDown = function (socket) {
    timer = fixedTime;
    let second = timer;
    // Emit initial time to the client
    socket.emit('countDown', second);


    // If the timer is already running, reset it
    if (timerInterval) {
        clearInterval(timerInterval); // Stop the current timer
    }

    // Start counting down every second
    timerInterval = setInterval(() => {
        if (timer > 1) {
            timer--;
            second = timer;
            io.emit('countDown', second ); // Emit updated time to all clients
            console.log("Count Down:",second);

        } else {
            clearInterval(timerInterval); // Stop the timer when it reaches 0
            timerInterval=null;
            console.log("Count Down end");
            io.emit('countDownEnd'); 
        }
    }, 1000);

    socket.on('resetCountDown', () => {
        exports.resetCountDown();
    });
};

exports.resetCountDown = function(){
    clearInterval(timerInterval); // Stop the current interval
    timerInterval = null; // Reset interval ID
    timer = fixedTime; // Reset the timer to fixedTime
    io.emit('countDown',  second ); // Emit reset time to all clients
}


exports.isCountDownRunning = function(){
    return timerInterval !== null;
}
