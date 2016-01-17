var Chart = function(server){
    var io = require('socket.io')(server);
    io.on('connection', this.onConnection);
}

Chart.prototype.onConnection = function(socket){
    socket.on('message', function(data, callback){
        socket.broadcast.emit('message', data);
        console.log("Broadcast: %j", data);
        callback('');
    });
}

module.exports = Chart;