// maze.js

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getGridSize(n) {
    return (1 << n + 1) - 2;
}

export class MazeGenerator {

    constructor(n, ctx, cellSize) {
        this.size = getGridSize(n);
        this.n = n;
        this.ctx = ctx;
        this.cellSize = cellSize;

        this.depth = 0;
        this.x = 0;
        this.y = 0;
        this.step = 0;
        this.new_max = 0;
        this.pos_shift = 0;
        this.done = false;
    }

    random_uneven(max_value) {
        let rndm = randomInt(1, max_value);
        let even_value = rndm % 2;
        if (even_value == 0) {
            return rndm - 1;
        } else {
            return rndm;
        }
    }


    nextStep() {
        if (this.done) return false;

        if (this.x < this.new_max) {
            this.x += this.step;
            this.create_cross(this.x, this.y, this.pos_shift);
        } else if (this.y < this.new_max) {
            this.x = this.pos_shift;
            this.y += this.step;
            this.create_cross(this.x, this.y, this.pos_shift);
        } else if (this.depth < this.n) {
            this.step = this.pos_shift + 1;
            this.depth++;
            this.pos_shift = Math.floor(this.size / Math.pow(2, this.depth));
            this.x = this.pos_shift;
            this.y = this.pos_shift;
            this.create_cross(this.x, this.y, this.pos_shift);
            this.new_max = this.size - this.pos_shift;
        } else {
            this.done = true;
            return false;
        }

        return true;
    }

    create_cross(x, y, length) {
    const ctx = this.ctx;
    const CELL_SIZE = this.cellSize;
    let dir = randomInt(0, 3);

 
    let lx = 1;
    let ly = 1;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, lx * CELL_SIZE, ly * CELL_SIZE);

    if (dir != 0) {
        let rl = this.random_uneven(length);
        lx = rl - 1;
        ctx.fillRect((x + 1) * CELL_SIZE, y * CELL_SIZE, lx * CELL_SIZE, ly * CELL_SIZE);
        lx = length - rl;
        ctx.fillRect((x + 1 + rl) * CELL_SIZE, y * CELL_SIZE, lx * CELL_SIZE, ly * CELL_SIZE);
    } else {
        lx = length;
        ctx.fillRect((x + 1) * CELL_SIZE, y * CELL_SIZE, lx * CELL_SIZE, ly * CELL_SIZE);
    }

    if (dir != 1) {
        let rl = this.random_uneven(length);
        lx = -1 * (rl - 1);
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, lx * CELL_SIZE, ly * CELL_SIZE);
        lx = -1 * (length - rl);
        ctx.fillRect((x - rl) * CELL_SIZE, y * CELL_SIZE, lx * CELL_SIZE, ly * CELL_SIZE);
    } else {
        lx = -1 * length;
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, lx * CELL_SIZE, ly * CELL_SIZE);
    }

    lx = 1;
    if (dir != 2) {
        let rl = this.random_uneven(length);
        ly = rl - 1;
        ctx.fillRect(x * CELL_SIZE, (y + 1) * CELL_SIZE, lx * CELL_SIZE, ly * CELL_SIZE);
        ly = length - rl;
        ctx.fillRect(x * CELL_SIZE, (y + 1 + rl) * CELL_SIZE, lx * CELL_SIZE, ly * CELL_SIZE);
    } else {
        ly = length;
        ctx.fillRect(x * CELL_SIZE, (y + 1) * CELL_SIZE, lx * CELL_SIZE, ly * CELL_SIZE);
    }

    if (dir != 3) {
        let rl = this.random_uneven(length);
        ly = -1 * (rl - 1);
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, lx * CELL_SIZE, ly * CELL_SIZE);
        ly = -1 * (length - rl);
        ctx.fillRect(x * CELL_SIZE, (y - rl) * CELL_SIZE, lx * CELL_SIZE, ly * CELL_SIZE);
    } else {
        ly = -1 * length;
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, lx * CELL_SIZE, ly * CELL_SIZE);
    }
}
}