/*
Denke beim Zeichnen an die "invertierte" y-Achse
 */

const minDistance = 1;
const growFactor = 1;

let fails = 0;
const maxFails = 150;

var bColor = 0;

var squares = [];
var img;

var testPoint;

function preload() {
    img = loadImage("assets/DortmundPanorama_600.jpg");
}

// var sqr;

var s1;
var s2;

function setup() {
    createCanvas(img.width, img.height);

    bColor = getAverageColor();
    addCanvasFullscreenButton();

    fillImage(100);
}

function draw() {
    // background(bColor);
    // testRotatingSquare();
    //image(img, 0, 0, width,height);

    // if (!s1) {
    //     s1 = s1 || new Square(100, 150, (1 / 4) * PI);
    //     s1.size = 35;
    //     squares.push(s1);
    // }
    // if (!s2) {
    //     s2 = s2 || new Square(100, 100, (4 / 4) * PI);
    //     s2.size = 35;
    //     squares.push(s2);
    // }

    // drawSquare(s1);
    // drawSquare(s2);

    // s1.grow(squares);
    // s2.grow(squares);

    fillImage(25);
}


function fillImage(iterations) {
    image(img, 0, 0);
    background(0, 100);

    let sqr;

    if (fails < maxFails) {
        iterations = iterations || 1;
        for (let i = 0; i < iterations; i++) {
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


function getAverageColor() {

    img.loadPixels();
    let pixels = img.pixels;
    let pixelCount = floor(pixels.length / 4)

    let r = 0;
    let g = 0;
    let b = 0;
    let a = 0;

    for (let i = 0; i < pixelCount; i++) {
        let idx = i * 4;
        r += pixels[idx] / 255;
        g += pixels[idx + 1] / 255;
        b += pixels[idx + 2] / 255;
        a += pixels[idx + 3] / 255;
    }

    r = floor((r / pixelCount) * 255);
    g = floor((g / pixelCount) * 255);
    b = floor((b / pixelCount) * 255);
    a = floor((a / pixelCount) * 255);

    return color(r, g, b, a)
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
