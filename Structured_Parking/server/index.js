import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
const app = express();
const server = http.createServer(app);
import pkg from 'pg';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import router from './routes/peymentRoute.js';
import { redisClient } from './lib/redis.js';
const { Pool } = pkg;
const pool = new Pool({

    connectionString: 'postgres://avnadmin:AVNS_fgsGNmaM544_Y92AKZY@pg-245a8768-esi-94e6.l.aivencloud.com:23876/defaultdb',
    ssl: {
        rejectUnauthorized: false
    }
});




await redisClient.connect();


pool.connect((err) => {
    if (err) {
        console.error('Connection error', err.stack);
    }
    else {
        console.log('Connected to the database');
    }
})

const io = new Server(server, {
  cors: {
    origin: "*",       
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors());

app.post('/data', async (req, res) => {
    await redisClient.set("chakib", "chakib");
    const value = await redisClient.get("chakib");
    console.log(value);
    res.send('Data received');

})


io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    pool.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error(err);}
        })
    socket.emit('welcome', {
        message: 'Welcome to the WebSocket server!'
    });
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    })
})

app.use('/', router);



server.listen(3000, () => {
    console.log('Server is running on port 3000');
})