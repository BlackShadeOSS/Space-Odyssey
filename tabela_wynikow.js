var ifcookieexists = false;
var ifcookieisempty = false;
var scoreCookie = [];

window.onload = function () {
    checkCookie("score");
    downloadcookie();
    createTable(scoreCookie);
};

function downloadcookie() {
    if (ifcookieexists == true) {
        scoreCookie = Object.values(JSON.parse(getCookie("score")));
    }
}

function checkCookie(name) {
    let cookie = getCookie(name);
    if (cookie == "") {
        ifcookieexists = false;
    } else {
        ifcookieexists = true;
    }
}

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";" + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function createTable(tableData) {
    var table = document.getElementById("table");
    var tableBody = document.querySelector("tbody");

    tableData.forEach(function (rowData) {
        var row = document.createElement("tr");

        rowData.forEach(function (cellData) {
            var cell = document.createElement("td");
            cell.appendChild(document.createTextNode(cellData));
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}
