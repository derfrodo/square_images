

function drawSquare(square) {
    push();
    fill(square.color);
    strokeWeight(1);
    stroke(0);
    translate(square.pos.x, square.pos.y);
    rotate(square.angle);
    rectMode(CENTER);
    rect(0, 0, square.size, square.size);
    pop();
}

function Square(posX, posY, angle) {
    this.color = color(random(0, 255));
    this.size = 5;
    this.pos = createVector(posX, posY);
    this.angle = angle;
    this.fullGrown = false;


    this.pointIsInSquare = (vectorToPoint, nextSize) => {
        let distanceToAB = p5.Vector.cross(
            p5.Vector.fromAngle(this.angle),
            p5.Vector.sub(vectorToPoint,
                this.a(nextSize)));

        if (distanceToAB.z < -minDistance) {
            return false;
        }

        let distanceToBC = p5.Vector.cross(
            p5.Vector.fromAngle(this.angle + (1 / 2) * PI),
            p5.Vector.sub(vectorToPoint,
                this.b(nextSize)));

        if (distanceToBC.z < -minDistance) {
            return false;
        }

        let distanceToCD = p5.Vector.cross(
            p5.Vector.fromAngle(this.angle + PI),
            p5.Vector.sub(vectorToPoint,
                this.c(nextSize)));

        if (distanceToCD.z < -minDistance) {
            return false;
        }

        let distanceToDA = p5.Vector.cross(
            p5.Vector.fromAngle(this.angle + (3 / 2) * PI),
            p5.Vector.sub(vectorToPoint,
                this.d(nextSize)));

        if (distanceToDA.z < -minDistance) {
            return false;
        }

        let isIn = distanceToAB.z > -minDistance &&
            distanceToBC.z > -minDistance &&
            distanceToCD.z > -minDistance &&
            distanceToDA.z > -minDistance;

        return isIn;
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
        let nextSize = (this.size + growFactor);

        if (maxSize > 0 && nextSize >= maxSize) {
            return false;
        }


        squares = squares || [];
        for (let i = 0; i < squares.length; i++) {
            let sqr = squares[i];
            if (sqr !== this) {
                let dist = sqr.pos.dist(this.pos);

                if (dist < (sqr.size + nextSize) / 2) {
                    return false;
                }

                if (dist < sqrt(2) * ((sqr.size + nextSize))) {
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


    this.getDiagonalLength = (nextSize) => {
        const sz = nextSize || this.size;
        return sqrt(2) * sz
    }

    this.a = (nextSize) => {
        // Vektoren rechnen nicht wie unsere Grafik (umgedrehte y-Achse)
        return this.getCornerPoint((5 / 4) * PI, nextSize);
    }

    this.b = (nextSize) => {
        return this.getCornerPoint((7 / 4) * PI, nextSize);
    }

    this.c = (nextSize) => {
        return this.getCornerPoint((1 / 4) * PI, nextSize);

    }

    this.d = (nextSize) => {
        return this.getCornerPoint((3 / 4) * PI, nextSize);
    }

    this.getCornerPoint = (cornerPointVector, nextSize) => {
        const directionFromPos = p5.Vector.fromAngle(cornerPointVector + this.angle);
        const directionMag = this.getDiagonalLength(nextSize) / 2;
        const posToPoint = p5.Vector.mult(directionFromPos, directionMag);

        return p5.Vector.add(this.pos, posToPoint);
    }

}
