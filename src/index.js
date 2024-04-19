const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + '/public'));
app.use(cors("*"));

// Create a port
const port = new SerialPort({
    path: 'COM3',
    baudRate: 9600,
});

// Create a parser: eso es pa eso de los saltos de línea que se envían desde el Arduino
const parser = new ReadlineParser({ delimiter: '\r\n' });
port.pipe(parser);
// Creating the parser and piping can be shortened to:
// const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))

// Write data to the port

let counter = 0;

io.on('connection', (socket) => {
    parser.on('data', (data) => {
        console.log('Data:', data);
        socket.emit('updatecounter', data);
    });

    socket.on('resetcounter', () => {
        counter = data; //esto saldrá mal pq es un string pero ajá
        console.log('Counter updated');
    });
});



parser.write("START\n");


app.get('/', (req, res) => {
    res.json({ message: 'Server running' });
});

app.get('/counter', (req, res) => {    
    // Enviar mensaje serial a Arduino

    res.json({ response: counter });

    /*port.write("GET_COUNTER\n", (err) => {
        if (err) {
            console.error('Error al enviar mensaje a Arduino:', err.message);
            return res.status(500).send('Error al enviar mensaje a Arduino');
        }
    });
    // Esperar respuesta de Arduino
    parser.once('data', (data) => {
        console.log('Respuesta al mensaje:', data);            
        res.json({ response: data});
    });*/
});


// detect errors
port.on('error', (err) => {
    console.log('Error: ', err.message);
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});