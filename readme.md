# Snake Game

### Project online using GitHub Pages **[here](https://stefanopuloz.github.io/Snake-Game/)**

Simple snake game we all know and love done using Javascript. This is one of my first projects and I have focused here mainly on programing aspect so UI is bare minimum. I plan to get to it some day and make it awesome as this game surley deserves it. 

Features:

- Three level sizes: 6x6, 9x9 and 12x12
- 9 dynamicaly changing speed levels
    - Starting speed and level size are customizable from options before game start
- All standard rules for snake movment, growth and proper randomization of pray appearence apply
- Functional pause option
- Highscore

## Logic and Code

Snake is moving through grid where each square is object with properties telling program what it contains.

    pray: 0,
    snake: 0,
    head: 0,
    obstacle: 0

Value of 0 is none, while other values indicate something is there.

Each grid tile has x,y coordinates. Program is following position of head separatley as it is the only one that can eat pray and run into obstacles be it and of the area or its own body. Each body part is kept as a value from 1 moving upwards. When head of the snake moves, new tile gets filled with a value of 1, last one gets deleted and all the rest get their value increased by 1. That is, if the move is valid, if it is not, appropriate alert appeares. When snake has eaten pray, same thing is done with the exeption of the last snake body tile, that does not get deleted as snake has gained in size.

Method for finding head of the snake in a table:

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

Here, we get x,y cooridinates returned which we are later using in calculations.

Calculation for snake movment:

    if (direction === "left") {
        checkObstacles(table[x], y - 1);
        table[x][y - 1].snake = 1;
        table[x][y - 1].head = 1;
    };

Here we are moving snake in the left direction and checking obstacles with checkObstacles method which will end game automatically if there is invalid move or increase snake size if pray has been eaten.

## Tehnologies

All logic is in .js file using pure javascript. No back end here. Highscore is kept using Locale Storage. Beside simple css and html nothing else worth nothing has been used here.

### Created by Stefan Deak