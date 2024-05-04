// * --------------------  Constructors  ----------------------

//  & Player Constructor

function Player(c, x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color

    this.draw = function () {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        c.fillStyle = this.color
        c.fill()
    }
}

// & Projectile Constructor

function Projectile(c, x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity

    this.draw = function () {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        c.fillStyle = this.color
        c.fill()
    }

    this.update = function () {
        this.draw()

        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}



function Enemy(c, x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity

    this.draw = function () {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        c.fillStyle = this.color
        c.fill()
    }

    this.update = function () {
        this.draw()

        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}




function Particle(c, friction, x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
    this.alpha = 1

    this.draw = function () {
        c.save()
        c.beginPath()
        c.globalAlpha = this.alpha
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }

    this.update = function () {
        this.draw()

        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.alpha -= 0.01
    }
}


export {Player , Projectile , Enemy , Particle}