let testSpeed = 0;
let prayEaten = false;
let score = 0;
let time = 0;
let minutes = 0;
let timeCounter = 0;
let startTime = new Date();
let paused = true;
let table = [];
let directionKeys = {right: 'left', left: 'right', up: 'down', down: 'up'};
let currentDirection = 'right';
let oppositeDirection = directionKeys[currentDirection];
let config = {
    tileColor: '#ccc',
    snakeColor: '#f33',
    prayColor: '#f33',
    tableWidth: 6,
    tableHeight: 6,
    snakeLength: 3,
    speed: 500
};
let snakeGameLength = config.snakeLength;
let snakeMove;
let highScore = [];

document.getElementById("start-game-btn").addEventListener("click", startGame);
document.getElementById("submit-yo").addEventListener("click", function (event) {
    event.preventDefault();
    testSpeed = document.getElementById("snake-speed").value;
    if (testSpeed > 0 && testSpeed < 10) {
        config.speed = (10 - testSpeed) * 100;
        config.tableWidth = parseInt(document.querySelector('input[name="table-size"]:checked').value);
        config.tableHeight = parseInt(document.querySelector('input[name="table-size"]:checked').value);
        alert("Changes accepted.");
    } else alert("Not a valid speed number!");
});

if (JSON.parse(localStorage.getItem("HighScore")) !== null) {
    highScore = JSON.parse(localStorage.getItem("HighScore"));
} else localStorage.setItem("HighScore", JSON.stringify(highScore));
document.getElementById("hide-options-btn").addEventListener("click", function () {
    hideBox("options-wrapper");
});

document.getElementById("hide-options-btn").addEventListener("click", function () {
    hideBox("options-wrapper");
});

document.getElementById("options-btn").addEventListener("click", function () {
    showBox("options-wrapper");
});

document.getElementById("high-score-btn").addEventListener("click", viewHighScore);
document.getElementById("hide-high-score-btn").addEventListener("click", function () {
    hideBox("high-score-wrapper");
});

//////////////// Methods //////////////////////////

function createTable(width, height) {
    for (let i = 0; i < width; i++) {
        table.push([]);

        for (let j = 0; j < height; j++) {
            table[i].push({
                pray: 0,
                empty: 0,
                snake: 0,
                head: 0,
                obstacle: 0,
                visual: function () {
                    if (this.head !== 0) return "head";
                    else if (this.snake !== 0) return "snake";
                    else if (this.pray !== 0) return "pray";
                    else return "blank";
                }
            });
        };
    };
};

function highScoreInput(player, score) {
    highScore.push({
        player: player,
        score: score
    });
    highScore.sort(function (a, b) {
        return b.score - a.score;
    });
    let jsonHighScore = JSON.stringify(highScore);
    localStorage.setItem("HighScore", jsonHighScore);
};

function viewHighScore() {
    highScore = JSON.parse(localStorage.getItem("HighScore"));
    let scoreTest = "<table id=high-score-table><th>Player</th><th>Score</th>";
    for (let i = 0; i < highScore.length; i++) {
        scoreTest += `<tr><td>${highScore[i].player}</td><td>${highScore[i].score}</td></tr>`;
    };
    document.getElementById("high-score").innerHTML = scoreTest + "</table>";
    showBox("high-score-wrapper");
};

function showBox(id) {
    document.getElementById(id).classList.remove("hidden");
    document.getElementById(id).classList.add("visible");
};

function hideBox(id) {
    document.getElementById(id).classList.remove("visible");
    document.getElementById(id).classList.add("hidden");
};

function moveTime() {
    if (snakeGameLength === config.tableHeight * config.tableWidth - 1) {
        paused = true;
        alert("You have a humongous snake! Congratulations!");
        gameEnd();
    };

    if (!paused) {
        moveSnake(currentDirection);
        timeSpeedCheck();
    };
};

function timeSpeedCheck() {
    if (time >= 30) {
        time = time % 30;
        timeCounter += 30;
        if (config.speed > 100) {
            config.speed -= 100;
            clearInterval(snakeMove);
            snakeMove = setInterval(moveTime, config.speed);
        };
        document.getElementById("speed").innerHTML = "Speed: " + (10 - (config.speed / 100));
    } else time += config.speed / 1000;
    document.getElementById("time").innerHTML = "Time: " + (timeCounter + time).toFixed(1) + "s";
};

function drawTable() {
    let visibleTable = "<table id='table'>";
    for (let i = 0; i < table.length; i++) {
        visibleTable += "<tr>";
        for (let j = 0; j < table[i].length; j++) {
            visibleTable += "<td id=tile-" + i + j + " class=" + table[i][j].visual() + ">" + "</td>";
        };
        visibleTable += "</tr>";
    };
    document.getElementById("game-area").innerHTML = visibleTable;
};

function createSnake() {
    for (let i = 0; i < config.snakeLength; i++) {
        table[1][i + 1].snake = config.snakeLength - i;
    };
    table[1][config.snakeLength].head = 1;
};

function snakeControls(event) {
    if (!paused && event.key === "p") {
        paused = true;
    };
    
    
    
    if (event.key === "ArrowLeft" && checkValidDirection("left")) {
        currentDirection = "left";
        paused = false;
    } else if (event.key === "ArrowRight" && checkValidDirection("right")) {
        currentDirection = "right";
        paused = false;
    } else if (event.key === "ArrowUp" && checkValidDirection("up")) {
        currentDirection = "up";
        paused = false;
    } else if (event.key === "ArrowDown" && checkValidDirection("down")) {
        currentDirection = "down";
        paused = false;
    };
};

function checkValidDirection(newDirection) {
    if (newDirection === oppositeDirection) {
        return false;
    };

    return true;
};

function findPositionOfHead() {
    let headPosition = [];
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].length; j++) {
            if (table[i][j].snake === 1) {
                headPosition.push([i, j]);
            };
        };
    };

    return headPosition;
};

function findSnakeBodyPosition() {
    let bodyPosition = [];
    for (let k = 0; k < snakeGameLength; k++) {
        for (let i = 0; i < table.length; i++) {
            for (let j = 0; j < table[i].length; j++) {
                if (table[i][j].snake === (k + 1)) {
                    bodyPosition.push([i, j]);
                };
            };
        };
    };
    return bodyPosition;
};

function moveSnake(direction) {
    let x = findPositionOfHead(table)[0][0];
    let y = findPositionOfHead(table)[0][1];
    let bodyTest = findSnakeBodyPosition();

    if (direction === "left") {
        checkObstacles(table[x], y - 1);
        table[x][y - 1].snake = 1;
        table[x][y - 1].head = 1;
    } else if (direction === "right") {
        checkObstacles(table[x], y + 1);
        table[x][y + 1].snake = 1;
        table[x][y + 1].head = 1;
    } else if (direction === "up") {
        checkObstacles(table[x - 1], y);
        table[x - 1][y].snake = 1;
        table[x - 1][y].head = 1;
    } else if (direction === "down") {
        checkObstacles(table[x + 1], y);
        table[x + 1][y].snake = 1;
        table[x + 1][y].head = 1;
    };

    oppositeDirection = directionKeys[direction];

    table[x][y].head = 0;

    for (i = 0; i < bodyTest.length; i++) {
        x = bodyTest[i][0];
        y = bodyTest[i][1];
        if (i === bodyTest.length - 1 && !prayEaten) table[x][y].snake = 0;
        else if (i === bodyTest.length - 1) {
            table[x][y].snake += 1;
            prayEaten = false;
            createPray("+");
        } else table[x][y].snake += 1;
    };

    drawTable();
};

function checkObstacles(tile, type) {
    if (tile === undefined || tile[type] === undefined || tile[type].snake !== 0) {
        paused = true;
        alert("Auch!");
        gameEnd();
    } else if (tile[type].pray !== 0) {
        eatPray(tile[type]);
    };
};

function eatPray(tile) {
    tile.pray = 0;
    ++snakeGameLength;
    prayEaten = true;
    score += Math.floor(10000 / config.speed + 100);
    document.getElementById("score").innerHTML = "Score: " + score;
};

function createPray(prayType) {
    let i = 0;
    let test = 0;
    let prayX = 0;
    let prayY = 0;

    while (i < 1) {
        prayX = randomNumber((config.tableWidth - 1), 0);
        prayY = randomNumber((config.tableHeight - 1), 0);
        ++test;

        if (table[prayX][prayY].snake === 0 && table[prayX][prayY].pray === 0) {
            table[prayX][prayY].pray = prayType;
            ++i;
        };
    };
};

function gameEnd() {
    let playerScore = score;
    let playerName;
    playerName = prompt("Your score is:" + playerScore + "\nEnter name:");
    document.body.removeEventListener("keydown", snakeControls);
    highScoreInput(playerName, playerScore);
    viewHighScore();
    resetGame();
};

function resetGame() {
    table = [];
    prayEaten = false;
    score = 0;
    time = 0;
    timeCounter = 0;
    startTime = new Date();
    paused = true;
    currentDirection = 'right';
    speed = config.speed;
    snakeGameLength = config.snakeLength;
    clearInterval(snakeMove);
    document.getElementById("score").innerHTML = "Score: 0";
    document.getElementById("time").innerHTML = "Time: 0s";
    document.getElementById("speed").innerHTML = "Speed: " + (10 - config.speed / 100);
};

function startGame() {
    resetGame();
    document.getElementById("speed").innerHTML = "Speed: " + (10 - config.speed / 100);
    snakeMove = setInterval(moveTime, config.speed);
    document.body.addEventListener("keydown", snakeControls);
    createTable(config.tableWidth, config.tableHeight);
    createSnake(config.snakeLength);
    createPray("+");
    drawTable();
};

function randomNumber(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
