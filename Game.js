
import { randomIntFromRange, distance } from "./utils.js"
import { Player, Projectile, Enemy, Particle } from "./Constructors.js"


const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const c = canvas.getContext('2d')

// * ----------  Variables and Constants --------------------

const playerPosition = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

const projectile_SpawnPosition = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

const projectile_velocity_amplification_factor = 5
const explosion_amplification_factor = 6
const friction = 0.98



let projectile_array = []
let enemies_array = []
let particles_array = []
let player
let score


const ScoreElement = document.getElementById('ScoreEle')
const StartbtnElement = document.getElementById('StartBtn')
const modalElement = document.getElementById('modalEl')
const modalPoints = document.getElementById('modalPoints')

// * --------------------  Event Listeners Functions  ----------------------

function HandleClick(event) {
    // ^ Finding the angle between the mousepointer and the player
    const x_dist = event.x - playerPosition.x
    const y_dist = event.y - playerPosition.y
    // ^ returns the angle (in radians) within -pi to +pi
    const angle = Math.atan2(y_dist, x_dist)

    const velocity = {
        x: Math.cos(angle) * projectile_velocity_amplification_factor,
        y: Math.sin(angle) * projectile_velocity_amplification_factor
    }

    projectile_array.push(new Projectile(c, projectile_SpawnPosition.x,
        projectile_SpawnPosition.y,
        5,
        'white',
        velocity
    ))

    console.log(projectile_array)

}

function ResizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    console.log('resizing')
}

function StartGame() {
    modalElement.style.display = 'none'

    Initialize()
    animate()
    spawnEnemies()

    // console.log('start')
}


// * --------------------  Event Listeners  --------------------------------

window.addEventListener('click', HandleClick)

window.addEventListener('resize', ResizeCanvas)

StartbtnElement.addEventListener('click', StartGame)


function Initialize() {
    player = new Player(c, playerPosition.x, playerPosition.y, 15, 'white')
    ScoreElement.innerHTML = 0
    modalPoints.innerHTML = 0
    score = 0

    projectile_array = []
    enemies_array = []
    particles_array = []
}







// * --------------------  Other Functions  ----------------------

function spawnEnemies() {
    setInterval(() => {
        const radius = randomIntFromRange(5, 30)
        let x
        let y

        // & To spawn enemies outside the canvas
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? - radius : canvas.width + radius
            y = Math.random() * canvas.height
        }
        else {
            y = Math.random() < 0.5 ? - radius : canvas.height + radius
            x = Math.random() * canvas.width
        }

        // & Finding the angle between the enemy and the player
        const x_dist = playerPosition.x - x
        const y_dist = playerPosition.y - y
        const angle = Math.atan2(y_dist, x_dist)
        const hue = Math.random() * 360

        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        enemies_array.push(new Enemy(c, x, y, radius, `hsl(${hue} 50% 50%)`, velocity))
        // console.log(enemies_array)
    }, 2000)

}






let animationId

// * ------  Animation Loop ------------

function animate() {
    animationId = window.requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0, 0, 0 , 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    // ^ Drawing the player after drawing the rectangle so that player does not get erased with time 
    player.draw()

    particles_array.forEach((particle, particle_index) => {
        if (particle.alpha <= 0) {
            particles_array.splice(particle_index, 1)
        }
        else {
            particle.update()
        }


    })

    projectile_array.forEach((projectile, projectile_index) => {

        // ^ Remove projectiles from array on moving out of canvas
        if (projectile.x + projectile.radius <= 0 ||
            projectile.x - projectile.radius >= canvas.width ||
            projectile.y + projectile.radius <= 0 ||
            projectile.y - projectile.radius >= canvas.height
        ) {
            projectile_array.splice(projectile_index, 1)
        }
        else {
            projectile.update()
        }


    })

    enemies_array.forEach((enemy, enemy_index) => {
        enemy.update()

        const enemy_player_center_dist = distance(enemy.x, enemy.y, player.x, player.y)
        // & End Game
        if (enemy_player_center_dist <= enemy.radius + player.radius) {
            cancelAnimationFrame(animationId)
            modalElement.style.display = 'flex'
            modalPoints.innerHTML = score
        }


        // & Checking the collision of each enemy with all projectiles
        projectile_array.forEach((projectile, Projectile_index) => {

            const enemy_projectile_center_dist = distance(enemy.x, enemy.y, projectile.x, projectile.y)

            if (enemy_projectile_center_dist <= enemy.radius + projectile.radius) {

                //  & Create Particle Explosions
                for (let i = 0; i < enemy.radius * 2; i++) {
                    const radius = Math.random() * 2
                    const x = (Math.random() - 0.5) * explosion_amplification_factor
                    const y = (Math.random() - 0.5) * explosion_amplification_factor
                    const velocity = {
                        x: x,
                        y: y
                    }
                    particles_array.push(new Particle(c, friction, projectile.x, projectile.y, radius, enemy.color, velocity))
                }



                if (enemy.radius > 15) {
                    score += 1
                    ScoreElement.innerHTML = score
                    // enemy.radius -= 10
                    // ^ Animating the lowering of radius using 'gsap' 
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    projectile_array.splice(Projectile_index, 1)
                } else {
                    score += 3
                    ScoreElement.innerHTML = score
                    //  ^ On collision removing both the projectile and the particle from respective array
                    //  ^ setTimeout is used : To remove the flashing effect of enemies
                    setTimeout(() => {
                        enemies_array.splice(enemy_index, 1)
                        projectile_array.splice(Projectile_index, 1)
                    }, 0)
                }

            }
        })
    })
}



