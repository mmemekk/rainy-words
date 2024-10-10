// const fixedTime = time;  // time in seconds
// let timerInterval = null;  // To store the interval ID

// exports.trackTime = function(socket) {
//     var timer = fixedTime;   // Start with the default fixedTime
//     let minute = Math.floor(timer/60);
//     let second = timer % 60;

//     // Emit initial time to the client
//     socket.emit('counter', { minute, second });

//     // Listen for 'startTimer' event when the start button is clicked
//     socket.on('startButton', () => {
//         // If the timer is already running, prevent multiple intervals
//         if (timerInterval) {
//             return;
//         }

//         // Start counting down every second
//         timerInterval = setInterval(() => {
//             if (timer > 0) {
//                 timer--;
//                 minute = Math.floor(timer / 60);
//                 second = timer % 60;
//                 socket.emit('counter', { minute, second });  // Emit updated time to client
//             } else {
//                 clearInterval(timerInterval);  // Stop the timer when it reaches 0
//                 socket.emit('timesUp');  // Notify the client that time's up
//             }
//         }, 1000);
//     });

//     // Optional: If you need a stop button or pause functionality
//     socket.on('stopTimer', () => {
//         clearInterval(timerInterval);
//         timerInterval = null;  // Reset interval ID
//     });

//     // Reset timer when reset button is clicked
//     socket.on('resetTimer', () => {
//         clearInterval(timerInterval);  // Stop the current interval
//         timerInterval = null;          // Reset interval ID
//         timer = fixedTime;             // Reset the timer to fixedTime
//         minute = Math.floor(timer / 60);
//         second = timer % 60;
//         socket.emit('counter', { minute, second });  // Emit reset time
//     });
// };

//----------------------------------------------------------------

const { io } = require('../serverfunctions/socket.js'); // Ensure this path is correct

const fixedTime = 300; // Set default timer (e.g., 300 seconds)
let timerInterval = null; // To store the interval ID
let timer = fixedTime; // Start with the default fixedTime

exports.trackTime = function (socket) {
    let minute = Math.floor(timer / 60);
    let second = timer % 60;

    // Emit initial time to the client
    socket.emit('counter', { minute, second });

    socket.on('startButton', () => {
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
    });

    socket.on('resetTimer', () => {
        clearInterval(timerInterval); // Stop the current interval
        timerInterval = null; // Reset interval ID
        timer = fixedTime; // Reset the timer to fixedTime
        minute = Math.floor(timer / 60);
        second = timer % 60;
        io.emit('counter', { minute, second }); // Emit reset time to all clients
    });
};
