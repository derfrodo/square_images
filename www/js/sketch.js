/*
Denke beim Zeichnen an die "invertierte" y-Achse
 */

const minDistance = 2;
const growFactor = 0.3;

let fails = 0;
const maxFails = 100;


var squares = [];
var img;

var testPoint;

function preload() {
    img = loadImage("assets/image600.jpg");
    img.loadPixels();
}

function getImageColorAtPoint(img, vectorToPoint) {
    let d = pixelDensity();
    img.loadPixels();
    let pixels = img.pixels;
    let r = [];
    let g = [];
    let b = [];
    let alpha = [];

    let x = floor(vectorToPoint.x);
    let y = floor(vectorToPoint.y);

    for (var i = 0; i < d; i++) {
        for (var j = 0; j < d; j++) {
            // loop over
            const idx = 4 * ((y * d + j) * width * d + (x * d + i));
            r.push(pixels[idx]);
            g.push(pixels[idx + 1]);
            b.push(pixels[idx + 2]);
            alpha.push(pixels[idx + 3]);
        }
    }

    let rv = r[0];
    let gv = g[0];
    let bv = b[0];
    let av = alpha[0];
    return color(rv, gv, bv, av);

}

// var sqr;

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

    // sqr = new Square(100, 100, (1 / 4) * PI);
    // sqr.size = 50;
    // console.log(sqr);

    testPoint = createVector(80, 80);

    let s1 = new Square(100, 100, (1 / 4) * PI);
    let s2 = new Square(150, 100, (1 / 4) * PI);

    s1.size = 100;
    // s2.size = 100;

    // squares.push(s1);
    // console.log(s2.canGrow(squares));

    drawSquare(s1);
    drawSquare(s2);
    // noLoop();
}

function draw() {
    background(0);
    // testRotatingSquare();
    //image(img, 0, 0, width,height);

    let sqr;

    if (fails < maxFails) {
        for (let i = 0; i < 25; i++) {
            sqr = new Square(random(0, width), random(0, height), random(0, 2 * PI));
            if (sqr.canGrow(squares)) {
                sqr.color = getImageColorAtPoint(img, sqr.pos);
                squares.push(sqr);
                fails = 0;
                // console.log(sqr);
            }
            else {
                fails++;
            }
        }

    }
    else {
        noLoop();
        console.log("too many fails");
    }

    for (let i = 0; i < squares.length; i++) {
        drawSquare(squares[i]);
        squares[i].grow(squares);
    }

    // console.log(`There are ${squares.length} squares`);
}

function drawSquare(square) {
    push();
    fill(square.color);
    translate(square.pos.x, square.pos.y);
    rotate(square.angle);
    rectMode(CENTER);
    rect(0, 0, square.size, square.size);
    pop();
}


function Square(posX, posY, angle) {
    this.color = color(random(0, 255));
    this.size = 3;
    this.pos = createVector(posX, posY);
    this.angle = angle;
    this.fullGrown = false;

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
        let distanceToAB = p5.Vector.cross(
            p5.Vector.fromAngle(this.angle),
            p5.Vector.sub(vectorToPoint,
                this.a(nextSize)));

        if (distanceToAB.z < 0 || distanceToAB.z > nextSize) {
            return false;
        }

        let distanceToBC = p5.Vector.cross(
            p5.Vector.fromAngle(this.angle + (1 / 2) * PI),
            p5.Vector.sub(vectorToPoint,
                this.b(nextSize)));

        if (distanceToBC.z < 0 || distanceToBC.z > nextSize) {
            return false;
        }

        let distanceToCD = p5.Vector.cross(
            p5.Vector.fromAngle(this.angle + PI),
            p5.Vector.sub(vectorToPoint,
                this.c(nextSize)));

        // console.log(distanceToCD);

        if (distanceToCD.z < 0 || distanceToCD.z > nextSize) {
            return false;
        }

        let distanceToDA = p5.Vector.cross(
            p5.Vector.fromAngle(this.angle + (3 / 2) * PI),
            p5.Vector.sub(vectorToPoint,
                this.d(nextSize)));

        if (distanceToDA.z < 0 || distanceToDA.z > nextSize) {
            return false;
        }

        return distanceToAB.z >= 0 && distanceToBC.z >= 0 && distanceToCD.z >= 0 && distanceToDA.z >= 0;
    }

    this.grow = (squares) => {
        if (!this.fullGrown) {
            if (this.canGrow(squares)) {
                this.size += growFactor;
            }
            else {
                this.fullGrown = true;
            }
        }

    }

    this.canGrow = (squares) => {
        for (let i = 0; i < squares.length; i++) {
            let sqr = squares[i];
            if (sqr !== this) {
                let dist = sqr.pos.dist(this.pos);
                let nextSize = (this.size + growFactor);

                if (dist < (sqr.size + nextSize) / 2 + minDistance) {
                    return false;
                }

                if (dist < sqrt(2) * (sqr.size + nextSize) + minDistance) {
                    let noOverlapping = !this.pointIsInSquare(sqr.a(), nextSize) &&
                        !this.pointIsInSquare(sqr.b(), nextSize) &&
                        !this.pointIsInSquare(sqr.c(), nextSize) &&
                        !this.pointIsInSquare(sqr.d(), nextSize) &&
                        !sqr.pointIsInSquare(this.a(nextSize)) &&
                        !sqr.pointIsInSquare(this.b(nextSize)) &&
                        !sqr.pointIsInSquare(this.c(nextSize)) &&
                        !sqr.pointIsInSquare(this.d(nextSize));

                    if (!noOverlapping) {
                        return noOverlapping;
                    }
                }
            }
        }
        // console.log(squares)
        return true;
    };
}



function testRotatingSquare() {
    // sqr.angle += 0.01;
    // drawSquare(sqr);

    // stroke(0, 2);
    // fill(255, 0, 255);
    // let a = sqr.a();
    // let b = sqr.b();
    // let c = sqr.c();
    // let d = sqr.d();

    // textSize(24);
    // text("A", a.x, a.y);
    // text("B", b.x, b.y);
    // text("C", c.x, c.y);
    // text("D", d.x, d.y);

    // // console.log(a);
    // // console.log(b);
    // // console.log(c);
    // // console.log(d);

    // console.log(sqr.pointIsInSquare(testPoint));
    // ellipse(testPoint.x, testPoint.y, 10);


}