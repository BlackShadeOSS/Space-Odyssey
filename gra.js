const timer = document.getElementById("stopwatch");
const milisec = document.getElementById("milisekundy");
const napis = document.getElementById("napis");
var jet = document.getElementById("jet");
var board = document.getElementById("board");
var dopalacz = document.getElementById("fuel");
var odlegloscelement = document.getElementById("odleglosc");
var predoscelement = document.getElementById("predkosc");
var zebranesate = document.getElementById("zebranesate");

var hr = 0;
var min = 0;
var sec = 0;
var mili = 0;
var koniec = false;
var stoptime = true;
var intervalmove = 450;
var dopalaczilosc = 0;
var distance = 0;
var prendosc = 500 - intervalmove;
var zebranesatelity = 0;
var wszystkiedopalacze = 0;
var wynikkoncowy = 0;
var mnoznik = 1;
var ifcookieexists = false;
var scoreCookie = [];

let timeout;
let timeoutmoverock;
let timeoutgeneraterocks;
let timeoutupdatedopalacz;
let timeoutgeneratedopalacz;
let timeoutmovedopalacz;
let timeoutmoveasteroids;
let timeoutgenerateasteroids;
let timeoutupdatedistance;
let timeoutupdateprendosc;
let timeoutmovesatelites;
let timeoutgeneratesatelites;
let timeoutupdatezebranesate;

window.onload = function () {
    checkCookie("score");
    downloadcookie();
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

function startGry() {
    if (stoptime == true && koniec == false) {
        stoptime = false;
        timerCycle();
        napis.style.visibility = "hidden";
        moverocks();
        generaterocks();
        updatedopalacz();
        generatedopalacz();
        movedopalacz();
        generateasteroids();
        moveasteroids();
        updateprendkosc();
        updatedistance();
        generatesatelites();
        movesatelites();
        updatezebranesate();
    }
}
function koniecGry() {
    if (stoptime == false) {
        stoptime = true;
        napis.style.visibility = "visible";
        napis.innerHTML =
            "Rozbiłeś się <br> Twój wynik to <br>" +
            Math.round(podliczwynik()) +
            "<br><br>Aby zrestartować naciśnij <br>R";
        board.style.filter = "blur(5px)";
        let nick;
        while (true) {
            nick = prompt("Podaj nazwę gracza:");
            if (nick) {
                if (nick.trim().length > 0) {
                    break;
                }
            }
            alert("Nie podano nazwy gracza!");
        }
        scoreCookie.push([nick, Math.round(podliczwynik())]);
        setCookie("score", JSON.stringify(scoreCookie));
        koniec = true;
    }
}

function getPos(el) {
    const rect = el.getBoundingClientRect();
    return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: el.offsetWidth,
        height: el.offsetHeight,
    };
}

function doesCollide(a, b) {
    const aBox = getPos(a);
    const bBox = getPos(b);
    return (
        isInside({ x: aBox.x, y: aBox.y }, bBox) ||
        isInside({ x: aBox.x + aBox.width, y: aBox.y }, bBox) ||
        isInside({ x: aBox.x, y: aBox.y + aBox.height }, bBox) ||
        isInside({ x: aBox.x + aBox.width, y: aBox.y + aBox.height }, bBox) ||
        isInside({ x: bBox.x, y: bBox.y }, aBox) ||
        isInside({ x: bBox.x + bBox.width, y: bBox.y }, aBox) ||
        isInside({ x: bBox.x, y: bBox.y + bBox.height }, aBox) ||
        isInside({ x: bBox.x + bBox.width, y: bBox.y + bBox.height }, aBox)
    );
}

function isInside({ x, y }, box) {
    return (
        x > box.x &&
        x < box.x + box.width &&
        y > box.y &&
        y < box.y + box.height
    );
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function timerCycle() {
    if (stoptime == false) {
        mili = parseInt(mili);
        sec = parseInt(sec);
        min = parseInt(min);
        hr = parseInt(hr);

        mili = mili + 1;

        if (mili == 100) {
            sec = sec + 1;
            mili = 0;
            distance = distance + prendosc;
            if (intervalmove > 10) {
                intervalmove = intervalmove - 1;
                prendosc = 500 - intervalmove;
            }
        }

        if (sec == 60) {
            min = min + 1;
            sec = 0;
        }
        if (min == 60) {
            hr = hr + 1;
            min = 0;
            sec = 0;
        }

        if (sec < 10 || sec == 0) {
            sec = "0" + sec;
        }
        if (min < 10 || min == 0) {
            min = "0" + min;
        }
        if (hr < 10 || hr == 0) {
            hr = "0" + hr;
        }

        timer.innerHTML = "T+" + hr + ":" + min + ":" + sec;
        milisec.innerHTML = mili;

        timeout = setTimeout("timerCycle()", 10);
    }
}

function reset() {
    /*
    timer.innerHTML = "T+00:00:00";
    milisec.innerHTML = "00";
    napis.style.visibility = "visible";
    napis.innerHTML = "Aby rozpocząć gre naciśnij <br> dowolny przycisk";
    stoptime = true;
    hr = 0;
    min = 0;
    sec = 0;

    clearTimeout(timeout);*/

    document.location.reload();
}

document.addEventListener("keydown", (event) => {
    if (event.key === "r") {
        reset();
    } else {
        startGry();
    }
});

window.addEventListener("keydown", (e) => {
    if (koniec == true) {
        return;
    } else {
        var left = parseInt(
            window.getComputedStyle(jet).getPropertyValue("left")
        );
        if (e.key == "ArrowLeft" && left > 0) {
            jet.style.left = left - 25 + "px";
            //board width - jet width
        } else if (e.key == "ArrowRight" && left <= 1350) {
            jet.style.left = left + 25 + "px";
        } else if (e.key == "ArrowUp") {
            if (dopalaczilosc > 0) {
                if (intervalmove > 10) {
                    intervalmove = intervalmove - 25;
                    dopalaczilosc = dopalaczilosc - 1;
                }
            } else {
                return;
            }
        }
    }
});

function generaterocks() {
    if (stoptime == true) {
        return;
    } else {
        var rock = document.createElement("div");
        rock.classList.add("rocks");
        rock.style.visibility = "visible";
        //board width - rock width
        rock.style.left = Math.floor(Math.random() * 1260) + "px";

        board.appendChild(rock);
    }
    timeoutgeneraterocks = setTimeout("generaterocks()", intervalmove + 200);
}

function moverocks() {
    var rocks = document.getElementsByClassName("rocks");
    if (stoptime == true) {
        return;
    }

    if (rocks != undefined) {
        for (var i = 0; i < rocks.length; i++) {
            var rock = rocks[i];
            var rocktop = parseInt(
                window.getComputedStyle(rock).getPropertyValue("top")
            );

            rock.style.visibility = "visible";

            if (doesCollide(jet, rock) === true) {
                koniecGry();
            }

            //boardheight - rockheight + 25
            if (rocktop >= 775) {
                rock.remove();
                continue;
            }

            rock.style.top = rocktop + 25 + "px";
        }
    }

    timeoutmoverock = setTimeout("moverocks()", intervalmove);
}

function updatedopalacz() {
    if (dopalaczilosc == 1) {
        dopalacz.style.background = 'url("./photos/booster1.png")';
        dopalacz.style.backgroundSize = "contain";
        dopalacz.style.backgroundRepeat = "no-repeat";
    } else if (dopalaczilosc == 2) {
        dopalacz.style.background = 'url("./photos/booster2.png")';
        dopalacz.style.backgroundSize = "contain";
        dopalacz.style.backgroundRepeat = "no-repeat";
    } else if (dopalaczilosc == 3) {
        dopalacz.style.background = 'url("./photos/booster3.png")';
        dopalacz.style.backgroundSize = "contain";
        dopalacz.style.backgroundRepeat = "no-repeat";
    } else if (dopalaczilosc == 4) {
        dopalacz.style.background = 'url("./photos/booster4.png")';
        dopalacz.style.backgroundSize = "contain";
        dopalacz.style.backgroundRepeat = "no-repeat";
    } else if (dopalaczilosc == 5) {
        dopalacz.style.background = 'url("./photos/booster5.png")';
        dopalacz.style.backgroundSize = "contain";
        dopalacz.style.backgroundRepeat = "no-repeat";
    } else {
        dopalacz.style.background = 'url("./photos/booster.png")';
        dopalacz.style.backgroundSize = "contain";
        dopalacz.style.backgroundRepeat = "no-repeat";
    }

    timeoutupdatedopalacz = setTimeout("updatedopalacz()", 100);
}

function generatedopalacz() {
    if (stoptime == true) {
        return;
    } else {
        var hydrogen = document.createElement("div");
        hydrogen.classList.add("hydrogen");
        hydrogen.style.visibility = "visible";

        //board width - rock width
        hydrogen.style.left = Math.floor(Math.random() * 1260) + "px";

        board.appendChild(hydrogen);
    }
    timeoutgeneratedopalacz = setTimeout("generatedopalacz()", 20000);
}

function movedopalacz() {
    var hydrogen = document.getElementsByClassName("hydrogen");
    if (stoptime == true) {
        return;
    }

    if (hydrogen != undefined) {
        for (var i = 0; i < hydrogen.length; i++) {
            var hydrogen1 = hydrogen[i];
            var hydrogen1top = parseInt(
                window.getComputedStyle(hydrogen1).getPropertyValue("top")
            );

            if (doesCollide(jet, hydrogen1) === true) {
                dopalaczilosc = dopalaczilosc + 1;
                wszystkiedopalacze = wszystkiedopalacze + 1;
                hydrogen1.remove();
                continue;
            }

            //boardheight - rockheight + 25
            if (hydrogen1top >= 775) {
                hydrogen1.remove();
                continue;
            }

            hydrogen1.style.top = hydrogen1top + 25 + "px";
        }
    }

    timeoutmovedopalacz = setTimeout("movedopalacz()", intervalmove);
}

function generateasteroids() {
    if (stoptime == true) {
        return;
    } else {
        var asteroids = document.createElement("div");
        asteroids.classList.add("asteroids");
        asteroids.style.visibility = "visible";

        //board width - rock width
        asteroids.style.left = Math.floor(Math.random() * 1260) + "px";

        board.appendChild(asteroids);
    }
    timeoutgenerateasteroids = setTimeout(
        "generateasteroids()",
        randomNumber(10000, 50000)
    );
}

function moveasteroids() {
    var asteroids = document.getElementsByClassName("asteroids");
    if (stoptime == true) {
        return;
    }

    if (asteroids != undefined) {
        for (var i = 0; i < asteroids.length; i++) {
            var asteroid = asteroids[i];
            var asteroidtop = parseInt(
                window.getComputedStyle(asteroid).getPropertyValue("top")
            );

            if (doesCollide(jet, asteroid) === true) {
                koniecGry();
            }

            //boardheight - rockheight + 25
            if (asteroidtop >= 775) {
                asteroid.remove();
                continue;
            }

            asteroid.style.top = asteroidtop + 25 + "px";
        }
    }

    timeoutmoveasteroids = setTimeout("moveasteroids()", 50);
}

function updatedistance() {
    odlegloscelement.innerHTML = "Odległość: <br>" + distance + " Km";
    timeoutupdatedistance = setTimeout("updatedistance()", 100);
}

function updateprendkosc() {
    predoscelement.innerHTML = "Prędkość: <br>" + prendosc + " Km/s";
    timeoutupdateprendosc = setTimeout("updateprendkosc()", 100);
}

function updatezebranesate() {
    zebranesate.innerHTML = "Zebrane <br> Satelity: <br>" + zebranesatelity;
    timeoutupdatezebranesate = setTimeout("updatezebranesate()", 100);
}

function generatesatelites() {
    if (stoptime == true) {
        return;
    } else {
        var satelites = document.createElement("div");
        satelites.classList.add("satelites");
        satelites.style.visibility = "visible";

        //board width - rock width
        satelites.style.left = Math.floor(Math.random() * 1260) + "px";

        board.appendChild(satelites);
    }
    timeoutgeneratesatelites = setTimeout(
        "generatesatelites()",
        randomNumber(10000, 30000)
    );
}

function movesatelites() {
    var satelites = document.getElementsByClassName("satelites");
    if (stoptime == true) {
        return;
    }

    if (satelites != undefined) {
        for (var i = 0; i < satelites.length; i++) {
            var satelite = satelites[i];
            var satelitetop = parseInt(
                window.getComputedStyle(satelite).getPropertyValue("top")
            );

            if (doesCollide(jet, satelite) === true) {
                zebranesatelity = zebranesatelity + 1;
                satelite.remove();
                continue;
            }

            //boardheight - rockheight + 25
            if (satelitetop >= 775) {
                satelite.remove();
                continue;
            }

            satelite.style.top = satelitetop + 25 + "px";
        }
    }

    timeoutmovesatelites = setTimeout("movesatelites()", intervalmove);
}

function podliczwynik() {
    mnoznik = mnoznik + zebranesatelity * 0.1 + wszystkiedopalacze * 0.025;
    wynikkoncowy = distance * mnoznik;
    return wynikkoncowy;
}
