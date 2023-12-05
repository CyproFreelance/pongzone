const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const Lobby = require('./src/components/test2/lobby.js');
const RoomManager = require('./src/components/test2/room_manager.js');

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '166750811137-et1b6hjpveudcbk6n5p3913dpfu7fd7e.apps.googleusercontent.com'; // Replace with your Google Client ID
const client = new OAuth2Client(CLIENT_ID);

app.use(express.json());

// Add Firebase
const admin = require('firebase-admin');
const serviceAccount = require('./src/components/test2/ponggame-406712-firebase-adminsdk-24o90-60da6c9930.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://ponggame-406712.firebaseio.com',
});

const db = admin.firestore();

app.post('/google-signin', async (req, res) => {
    const { id_token, userId, userName, userEmail } = req.body || {};

    try {
        // Verify the Google Sign-In token
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: "166750811137-et1b6hjpveudcbk6n5p3913dpfu7fd7e.apps.googleusercontent.com",
        });

        // Check if the user is already signed in or add them to the database
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            // If not, add the user to the database
            await db.collection('users').doc(userId).set({
                username: userName,
                wins: 0,
                losses: 0,
                streak: 0
            });
        }

        // Send the userId along with the success response to the client
        res.json({ success: true, message: 'Google Sign-In successful', userId });
    } catch (error) {
        // Handle errors
        console.error('Error verifying Google Sign-In token:', error);
        res.status(500).json({ success: false, message: 'Error verifying Google Sign-In token' });
    }
});

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/game.html');
});

app.get('/get-user-data', async (req, res) => {
    const userId = req.query.userId;

    try {
        // Retrieve user data from the Realtime Database based on the userId
        const userDoc = await db.collection('users').doc(userId).get();

        if (userDoc.exists) {
            const userData = userDoc.data();
            res.json(userData);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).json({ message: 'Error retrieving user data' });
    }
});

let username = "default";
let room_code = "";
app.get('/public/:username', (req, res) => {
    res.sendFile(__dirname + '/game.html');
    username = req.params.username;
    room_code = "public";
});

let room_codes = {};
app.get('/private/:room_code/:username', (req, res) => {
    res.sendFile(__dirname + '/game.html');
    username = req.params.username;
    room_code = req.params.room_code;
});

app.get('/game.html', (req, res) => {
    res.sendFile(__dirname + '/game.html');
});

let mode = "public";
var menu_io = io.of('/menu');
menu_io.on('connection', async (socket) => {
    console.log(socket.id + " joined menu");
    let validate = 0;
    let message = "";

    let login = new Promise((resolve, reject) => {
        socket.on('join_public', (username) => {
            message = "public";
            validate = 1;
            socket.emit('public_validation', validate, message);
            socket.broadcast.emit('public_start');
        });

        socket.on('create_private', (username, room_code) => {
            if (room_codes[room_code] >= 1) {
                message = room_code + " already exists!";
                reject(message);
            } else {
                room_codes[room_code] = 1;
                validate = 1;
                socket.emit('create_validation', validate, message);
            }
        });

        socket.on('join_private', (username, room_code) => {
            if (room_codes[room_code] == null) {
                message = room_code + " does not exist!";
                reject(message);
            } else if (room_codes[room_code] === 1) {
                room_codes[room_code]++;
                validate = 1;
                socket.emit('join_validation', validate, message);
            } else if (room_codes[room_code] > 1) {
                message = "Room is full!";
                reject(message);
            }
        });

        resolve(message);
    });

    mode = await login;

    socket.on('user_signed_in', async (userData) => {
        const { username, id } = userData;

        const userDoc = await db.collection('users').doc(id).get();
        if (!userDoc.exists) {
            await db.collection('users').doc(id).set({ username, wins: 0, losses: 0, streak: 0 });
        }

        const userSnapshot = await db.collection('users').doc(id).get();
        const userDataFromDB = userSnapshot.data();
        playersData[id] = userDataFromDB;

        socket.emit('user_signed_in_success');
    });

    socket.on('game_over', ({ winner, loser }) => {
        playersData[winner].wins++;
        playersData[loser].losses++;

        io.emit('update_player_data', playersData);
    });
});

const playersData = {};

var game_io = io.of('/game');
let lobby = new Lobby();
let room_manager = new RoomManager(game_io);
game_io.on('connection', (socket) => {
    console.log(socket.id + " joined game");
    lobby.add_player(socket.id, username, room_code);

    if (lobby.get_num_player() % 2 == 0 && lobby.get_num_player() > 0) {
        let player1 = lobby.public_queue.shift();
        let player2 = lobby.public_queue.shift();
        room_manager.create_room(player1, player2);
    }
    if (lobby.get_num_private_players(room_code) == 2) {
        let player1 = lobby.private_players[room_code].shift();
        let player2 = lobby.private_players[room_code].shift();
        room_manager.create_room(player1, player2);
    }
    const playerWinStreaks = {};
    let gameEndTime;

    socket.on('game_over', ({ winner, loser }) => {
        playerWinStreaks[winner] = (playerWinStreaks[winner] || 0) + 1;

        io.emit('update_win_streaks', playerWinStreaks);

        gameEndTime = Date.now() + 24 * 60 * 60 * 1000;

        io.emit('update_game_end_time', gameEndTime);
    });

    socket.on('disconnect', () => {
        const room = room_manager.find_room(socket.id);
        if (room != null) {
            room.disconnect(socket.id);
        }
        if (room_codes[room_code] != null) {
            delete room_codes[room_code];
            delete lobby.private_players[room_code];
        }
        lobby.remove_player(socket.id);
    });

    socket.on('keydown', (keycode) => {
        if (room_manager.num_rooms > 0) {
            let user = room_manager.find_user(socket.id);
            if (user != null) {
                if (keycode != 32) {
                    room_manager.find_user(socket.id).keypress[keycode] = true;
                }
            }
        }
    });

    socket.on('keyup', (keycode) => {
        if (room_manager.num_rooms > 0) {
            let user = room_manager.find_user(socket.id);
            if (user != null) {
                room_manager.find_user(socket.id).keypress[keycode] = false;
            }
        }
    });

    socket.on('score', (score_user, playerIds) => {
        console.log('received id ', playerIds);
        console.log(score_user);

        if (score_user == "ST_RIGHTBALL" || score_user == "ST_LEFTBALL") {
            ball.speed = initialSpeed;
            revealPercentage1 += 125;
            revealBlocks(revealPercentage1);
            revealPercentage2 += 125;
            revealBlocks(revealPercentage2);
        }
    });

    socket.on('update_win_streaks', (winStreaks) => {
        const winStreakElement = document.getElementById('winStreak');
        winStreakElement.textContent = winStreaks[playerIds[1]] || 0; // Assuming playerIds[1] is the winner
    });

    socket.on('update_game_end_time', (endTime) => {
        const timeRemainingElement = document.getElementById('timeRemaining');

        function updateTimer() {
            const currentTime = Date.now();
            const timeDiff = endTime - currentTime;

            if (timeDiff > 0) {
                const hours = Math.floor(timeDiff / (60 * 60 * 1000));
                const minutes = Math.floor((timeDiff % (60 * 60 * 1000)) / (60 * 1000));
                const seconds = Math.floor((timeDiff % (60 * 1000)) / 1000);

                timeRemainingElement.textContent = `${hours}:${minutes}:${seconds}`;
            } else {
                timeRemainingElement.textContent = 'Time expired';
            }
        }

        setInterval(updateTimer, 1000);

        updateTimer();
    });

    socket.on('space_event', (space) => {
        if (room_manager.num_rooms > 0) {
            let user = room_manager.find_user(socket.id);
            const SPACE = 32;
            if (user != null) {
                if (space == 1) {
                    room_manager.find_user(socket.id).keypress[SPACE] = true;
                } else if (space == 0) {
                    room_manager.find_user(socket.id).keypress[SPACE] = false;
                }
            }
        }
    });
});

app.use((req, res, next) => {
    if (req.path === '/') {
        res.redirect('/loading');
    } else {
        next();
    }
});

var update = setInterval(() => {
    room_manager.update();
}, 30);

const port = 3001;
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
  });
http.listen(port, async () => {
    const url = `http://localhost:${port}`;
    const { default: open } = await import('open');
    await open(url)
    console.log("listening on port " + port);
});
