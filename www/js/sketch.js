/*
Denke beim Zeichnen an die "invertierte" y-Achse
 */

const minDistance = 3;
const growFactor = 0.3;

let fails = 0;
const maxFails = 100;


var squares = [];
var img;


function preload() {
    img = loadImage("assets/image600.jpg");
    //img.loadPixels();
}

var sqr;

function setup() {
    const factor = img.width / 16;
    createCanvas(16 * factor, 9 * factor);

    let p1 = createVector(1, 1);
    let p2 = createVector(1, 0);
    console.log(p5.Vector.angleBetween(p1, p2))
    console.log(p5.Vector.angleBetween(p2, p1))
    console.log(p5.Vector.cross(p1, p2))
    console.log(p5.Vector.cross(p2, p1))

    background(0);

    sqr = new Square(100, 100, (1 / 4) * PI);
    sqr.size = 50;
    console.log(sqr);


    //noLoop();
}

function draw() {
    background(0);
    sqr.angle += 0.01;
    drawSquare(sqr);

    stroke(0, 2);
    fill(255, 0, 255);
    let a = sqr.a();
    let b = sqr.b();
    let c = sqr.c();
    let d = sqr.d();

    textSize(24);
    text("A", a.x, a.y);
    text("B", b.x, b.y);
    text("C", c.x, c.y);
    text("D", d.x, d.y);

    // console.log(a);
    // console.log(b);
    // console.log(c);
    // console.log(d);

    console.log(sqr.pointIsInSquare(createVector(1, 1)));

    //image(img, 0, 0, width,height);

    // let sqr;

    // if (fails < maxFails) {
    //     for (let i = 0; i < 25; i++) {
    //         sqr = new Square(random(0, width), random(0, height), random(0, 2 * PI));
    //         if (sqr.canGrow(squares)) {
    //             squares.push(sqr);
    //             fails = 0;
    //             // console.log(sqr);
    //         }
    //         else {
    //             fails++;
    //         }
    //     }

    // }
    // else {
    //     noLoop();
    //     console.log("too many fails");
    // }

    for (let i = 0; i < squares.length; i++) {
        drawSquare(squares[i]);
        squares[i].grow(squares);
    }

    // console.log(`There are ${squares.length} squares`);
}

function drawSquare(square) {
    push();
    fill(255);
    translate(square.pos.x, square.pos.y);
    rotate(square.angle);
    rectMode(CENTER);
    rect(0, 0, square.size, square.size);
    pop();
}


function Square(posX, posY, angle) {
    this.size = 1;
    this.pos = createVector(posX, posY);
    this.angle = angle;

    this.getDiagonalLength = (nextSize) => {
        const sz = nextSize || this.size;
        return sqrt(2) * sz
    }

    this.a = (nextSize) => {
        // Vektoren rechnen nicht wie unsere Grafik (umgedrehte y-Achse)
        const directionFromPos = p5.Vector.fromAngle((5 / 4) * PI + this.angle);
        const directionMag = this.getDiagonalLength(nextSize) / 2;
        const posToPoint = p5.Vector.mult(directionFromPos, directionMag);

        // console.log(directionFromPos );
        // console.log(directionMag);
        // console.log(posToPoint);

        return p5.Vector.add(this.pos, posToPoint);
    }

    this.b = (nextSize) => {
        const directionFromPos = p5.Vector.fromAngle((7 / 4) * PI + this.angle);
        const directionMag = this.getDiagonalLength(nextSize) / 2;
        const posToPoint = p5.Vector.mult(directionFromPos, directionMag);

        return p5.Vector.add(this.pos, posToPoint);
    }

    this.c = (nextSize) => {
        const directionFromPos = p5.Vector.fromAngle((1 / 4) * PI + this.angle);
        const directionMag = this.getDiagonalLength(nextSize) / 2;
        const posToPoint = p5.Vector.mult(directionFromPos, directionMag);

        return p5.Vector.add(this.pos, posToPoint);
    }

    this.d = (nextSize) => {
        const directionFromPos = p5.Vector.fromAngle((3 / 4) * PI + this.angle);
        const directionMag = this.getDiagonalLength(nextSize) / 2;
        const posToPoint = p5.Vector.mult(directionFromPos, directionMag);

        return p5.Vector.add(this.pos, posToPoint);
    }

    this.pointIsInSquare = (vectorToPoint, nextSize) => {
        return p5.Vector.cross(p5.Vector.fromAngle(this.angle),
            p5.Vector.sub(vectorToPoint, this.a(nextSize)));
    }

    this.grow = (sqares) => {
        if (this.canGrow(sqares)) {
            this.size += growFactor;
        }
    }

    this.canGrow = (squares) => {
        for (let i = 0; i < squares.length; i++) {
            let sqr = squares[i];
            if (sqr !== this) {
                let dist = sqr.pos.dist(this.pos);
                if (dist < sqr.size + (this.size + growFactor) + minDistance) {
                    return false;
                }
            }
        }
        return true;
    };
}
