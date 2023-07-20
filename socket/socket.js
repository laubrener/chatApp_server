const { io } = require('../index');
const { checkJWT } = require('../helpers/jwt');
const { userConnected, userDesonnected, saveMessage } = require('../controllers/socket');

// mensaje de sockets
io.on('connection', client => {
    console.log('Client connected');
    const [ valid, uid ] = checkJWT(client.handshake.headers['x-token']);

    console.log(valid, uid);

    // verificar autenticacion
    if (!valid) { return client.disconnect(); }

    // cliente autenticado
    userConnected(uid);

    // ingresar al usuario a una sala en particular
    client.join( uid );

    // escuchar mensaje personal
    client.on('personal-message', async (payload) => {
        console.log(payload);
        await saveMessage(payload);
        io.to( payload.to ).emit('personal-message', payload);
    })

    // client.to( uid ).emit('');

    client.on('disconnect', ( )=> {
        console.log('Client desconnected');
        userDesonnected(uid);
    });
});