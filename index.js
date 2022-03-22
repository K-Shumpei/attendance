window.onload = function() {
    var socketio = io()
    socketio.emit("current", {})
    return false
}

function inputName() {
    document.getElementById("registerButton").style.display = "none"
    document.getElementById("deleteButton").style.display = "none"
    document.getElementById("register").style.display = "block"
}

function cancelRegister() {
    document.getElementById("newPlayer").value = ""
    document.getElementById("registerButton").style.display = "block"
    document.getElementById("deleteButton").style.display = "block"
    document.getElementById("register").style.display = "none"
}

function deleteName() {
    document.getElementById("deleteButton").style.display = "none"
    document.getElementById("registerButton").style.display = "none"
    document.getElementById("delete").style.display = "block"

    let deleteTable = document.getElementById("deleteTable")
    deleteTable.innerHTML = ""
    let table = document.getElementById("table")
    for ( let i = 0; i < table.rows.length - 1; i++ ) {
        let row = deleteTable.insertRow(-1)
        let cell1 = row.insertCell(-1)
        cell1.innerHTML = table.rows[i+1].cells[0].textContent
        let cell2 = row.insertCell(-1)
        cell2.innerHTML = "<input type='button' value='削除' onclick=deleteData("+i+")>"
    }
}

function cancelDelete() {
    document.getElementById("deleteButton").style.display = "block"
    document.getElementById("registerButton").style.display = "block"
    document.getElementById("delete").style.display = "none"
}

function attendance(num) {
    const name = document.getElementById("table").rows[num+1].cells[0].textContent
    const result = window.confirm(`${name} は出席しますか？`)
    
    if ( result ) {
        var socketio = io()
        socketio.emit("attendance", num)
        return false
    }
}

function deleteData(num) {
    const name = document.getElementById("table").rows[num+1].cells[0].textContent
    const result = window.confirm(`${name} の情報を削除しますか？`)
    
    if ( result ) {
        var socketio = io()
        socketio.emit("delete", num)
        cancelDelete()
        return false
    }
}


$(function () {
    var socketio = io()

    // 名前登録
    $("#registerForm").submit(function() {
        const newPlayer = document.getElementById("newPlayer").value
        socketio.emit("newPlayer", newPlayer)
        cancelRegister()
        return false
    })

    // 出席状況
    socketio.on("data", function(data) {
        // 出席状況の表
        let table = document.getElementById("table")
        while ( table.rows.length > 1 ) {
            table.deleteRow(table.rows.length - 1)
        }
        for ( let i = 0; i < data.length; i++ ) {
            let row = table.insertRow(-1)
            let cell1 = row.insertCell(-1)
            cell1.innerHTML = data[i].name
            let cell2 = row.insertCell(-1)
            cell2.innerHTML = data[i].number
            let cell3 = row.insertCell(-1)
            cell3.innerHTML = "<input type='button' value='出席' onclick=attendance("+i+")>"
        }
    })
})