// YOUR BOT HERE

const distance = (x1, y1, x2, y2) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
const run = (x1, x2, speed) => x2 !== x1 ? x2 > x1 ? Math.min(x1 + speed, x2) : Math.max(x1 - speed, x2) : x1;

const { x, y } = API.getCurrentPosition();

// find nearest enemy
const enemies = API.getEnemies();
const nearest = enemies
    .sort((a, b) => {
    return distance(x, y, a.position.x, a.position.y) > distance(x, y, b.position.x, b.position.y) ? 1 : -1;
})[0];

// find new position
const distanceToEnemy = Math.floor(distance(x, y, nearest.position.x, nearest.position.y));

let nextX = x;
let nextY = y;

// enemy is far away? RUN
if (distanceToEnemy > 3) {
    nextX = run(x, nearest.position.x, 2);
    nextY = run(y, nearest.position.y, 2);

// enemy in 3 grids? walk slow to attack
} else if (distanceToEnemy === 3) {
    nextX = run(x, nearest.position.x, 1);
    nextY = run(y, nearest.position.y, 1);

// enemy in 2 grids? ATTACK
} else if (distanceToEnemy === 2) {
    nextX = run(x, nearest.position.x, 2);
    nextY = run(y, nearest.position.y, 2);

// enemy in 1 grids ATTACK!
} else if (distanceToEnemy === 1) {
    nextX = run(x, nearest.position.x, 1);
    nextY = run(y, nearest.position.y, 1);
}

// check new position
let distanceAfterMove = Math.floor(distance(nextX, nextY, nearest.position.x, nearest.position.y));
const enemiesNearbyAfterMove = enemies
    .filter((a) => Math.floor(distance(nextX, nextY, a.position.x, a.position.y)) === 1);

// enemy after move in 1 grids? CHOPY VALIM!
if (distanceAfterMove === 1 || enemiesNearbyAfterMove.length > 0) {
    nextX = run(nextX, nearest.position.x, -1);
    nextY = run(nextY, nearest.position.y, -1);
}

//apply new position
API.move(nextX, nextY);
