
/**
 * Space Invaders formation movement
 */

//% color="#287B9A" icon="\uf0e7" block="Space Invaders"
namespace spaceInvaders {

    /**
     * Move a formation of enemies left and right.
     * Enemies descend whenever they reach a wall.
     */
    //% blockId=space_invaders_start_movement
    //% block="start enemy formation movement | enemies $enemies speed $speed drop $dropDistance"
    //% speed.defl=30
    //% speed.min=1
    //% dropDistance.defl=8
    //% dropDistance.min=0
    //% weight=100
    export function startMovement(
        enemies: Sprite[],
        speed: number,
        dropDistance: number
    ): void {

        // 0 = right
        // 1 = drop and reverse left
        // 2 = left
        // 3 = drop and reverse right
        let movementState = 0

        speed = Math.abs(speed)

        // Start all enemies moving right
        for (let enemy of enemies) {
            enemy.vx = speed
        }

        game.onUpdate(function () {

            if (enemies.length == 0) {
                return
            }

            if (movementState == 0) {

                // Moving right
                for (let enemy of enemies) {
                    if (enemy.right >= scene.screenWidth()) {
                        movementState = 1
                        break
                    }
                }

            } else if (movementState == 1) {

                // Move the whole formation inside the right edge
                let overflow = 0

                for (let enemy of enemies) {
                    if (enemy.right > scene.screenWidth()) {
                        overflow = Math.max(
                            overflow,
                            enemy.right - scene.screenWidth()
                        )
                    }
                }

                for (let enemy of enemies) {
                    enemy.x -= overflow
                    enemy.y += dropDistance
                    enemy.vx = -speed
                }

                movementState = 2

            } else if (movementState == 2) {

                // Moving left
                for (let enemy of enemies) {
                    if (enemy.left <= 0) {
                        movementState = 3
                        break
                    }
                }

            } else if (movementState == 3) {

                // Move the whole formation inside the left edge
                let overflow = 0

                for (let enemy of enemies) {
                    if (enemy.left < 0) {
                        overflow = Math.max(
                            overflow,
                            -enemy.left
                        )
                    }
                }

                for (let enemy of enemies) {
                    enemy.x += overflow
                    enemy.y += dropDistance
                    enemy.vx = speed
                }

                movementState = 0
            }
        })
    }
}

