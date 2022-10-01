var ifcookieexists = false;
var ifcookieisempty = false;
var scoreCookie = [];

window.onload = function () {
    checkCookie("score");
    downloadcookie();
    scoreCookie.sort(compareSecondColumn);
    createTable(scoreCookie);
    hidetableifempty();
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
        if (cookie == "[]") {
            ifcookieisempty = true;
        } else {
            ifcookieisempty = false;
            ifcookieexists = true;
        }
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

function hidetableifempty() {
    if (ifcookieisempty == true || ifcookieexists == false) {
        document.getElementById("tabelka").style.visibility = "hidden";
        document.getElementById("napis").style.visibility = "visible";
    }
}

function createTable(tableData) {
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

function compareSecondColumn(a, b) {
    if (a[1] === b[1]) {
        return 0;
    } else {
        return a[1] > b[1] ? -1 : 1;
    }
}
