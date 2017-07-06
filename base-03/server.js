/**
 * Created by wyq on 17/7/6.
 */
var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use('/', express.static(__dirname + '/public'));

server.listen(3000, function () {
	console.log('Express server listening on port 3000');
});

//socket部分
io.on('connection', function (socket) {
	console.log("socket.handshake.query: %j", socket.handshake.query);
	//接收并处理客户端的hi事件
	if (!socket.handshake.query.uid) {
		socket.emit("err", "=========== no uid =========== ");
	}
	else {
		socket.join(socket.handshake.query.uid, function () {
			// console.log("========== rooms-key: %j, rooms: %j", Object.keys(socket.rooms), socket.rooms);
		});
	}
	//断开事件
	socket.on('disconnect', function (data) {
		console.log(`${socket.handshake.query.uid} disconnect ${data}`);
	});
});

app.get("/emit", function (req, res) {
	let roomId = req.query.rid;
	if (roomId) {
		io.to(roomId).emit("rmsg", `room ${roomId} send msg`);
	}
	else {
		io.emit('gb', "这是一条广播消息");
	}
	return res.send("ok");
});