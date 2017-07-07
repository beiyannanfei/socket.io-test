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

/*
1).向所有客户端广播：socket.broadcast.emit('broadcast message');
2).进入一个房间（非常好用！相当于一个命名空间，可以对一个特定的房间广播而不影响在其他房间或不在房间的客户端）：socket.join('your room name');
3).向一个房间广播消息（发送者收不到消息）：socket.broadcast.to('your room name').emit('broadcast room message');
4).向一个房间广播消息（包括发送者都能收到消息）（这个API属于io.sockets）：io.sockets.in('another room name').emit('broadcast room message');
5).强制使用WebSocket通信：（客户端）socket.send('hi')，（服务器）用socket.on('message', function(data){})来接收。
Socket.IO的进阶用法介绍基本就到这里。个人感觉在日常使用的时候这些基本API已经够用了，这也体现了Socket.IO极其简洁易用的设计哲学。本文只是抛砖引玉，当在实际运用中遇到解决不了的问题时，再去查看官方详细的WIKI会比较好。
*/
