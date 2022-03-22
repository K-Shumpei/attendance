// モジュール
const http = require("http")
const express = require("express")
const socketIO = require("socket.io")

// オブジェクト
const app = express()
const server = http.Server(app)
const io = socketIO(server)

// 定数
const PORT = process.env.PORT || 2000

// 公開フォルダの指定
app.use(express.static(__dirname))

// サーバーの起動
server.listen(PORT, () => {
    console.log("server starts on port: %d", PORT)
})

// 出席データ
var attendanceData = []

// 接続時の処理
io.on("connection", function(socket) {

    // 現在の出席状況の送信
    socket.on("current", function() {
        io.emit("data", attendanceData)
    })


    // 名前の新規登録
    socket.on("newPlayer", function(name) {
        attendanceData.push({name: name, number: 0})
        io.emit("data", attendanceData)
    })

    // 出席登録
    socket.on("attendance", function(num) {
        attendanceData[num].number += 1
        io.emit("data", attendanceData)
    })

    // データの削除
    socket.on("delete", function(num) {
        attendanceData.splice(num, 1)
        io.emit("data", attendanceData)
    })
})