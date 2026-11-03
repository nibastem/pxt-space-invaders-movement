
/**
 * Space Invaders Movement Extension
 * Version 2
 *
 * Formation movement, speed control,
 * stop movement and bottom detection.
 */

// Fixed Arcade screen resolution.
// This is a compile-time configuration.
namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 360
    export const ARCADE_SCREEN_HEIGHT = 320
}

//% color="#287B9A" icon="\uf0e7" block="Space Invaders"
namespace spaceInvaders {

    // Shared formation settings
    let formationEnemies: Sprite[] = []
    let formationSpeed = 30
    let formationDrop = 8
    let formationDirection = 1

    let movementActive = false
    let updateRegistered = false
    let bottomReached = false

    /**
     * Start or restart an enemy formation.
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

        // Stop any previous formation.
        stopMovement()

        formationEnemies = enemies
        formationSpeed = Math.abs(speed)
        formationDrop = Math.max(0, dropDistance)
        formationDirection = 1

        bottomReached = false
        movementActive = true

        // Start all enemies moving right.
        for (let enemy of formationEnemies) {
            enemy.setFlag(SpriteFlag.AutoDestroy, false)
            enemy.setFlag(SpriteFlag.DestroyOnWall, false)
            enemy.vx = formationSpeed
        }

        // Register the update loop only once.
        if (!updateRegistered) {
            updateRegistered = true

            game.onUpdate(function () {
                updateFormation()
            })
        }
    }

    /**
     * Internal movement state machine.
     * Not exposed as a block.
     */
    function updateFormation(): void {

        if (!movementActive) {
            return
        }

        if (formationEnemies.length == 0) {
            movementActive = false
            return
        }

        // Find formation boundaries.
        let leftEdge = scene.screenWidth()
        let rightEdge = 0
        let bottomEdge = 0

        for (let enemy of formationEnemies) {

            if (enemy.left < leftEdge) {
                leftEdge = enemy.left
            }

            if (enemy.right > rightEdge) {
                rightEdge = enemy.right
            }

            if (enemy.bottom > bottomEdge) {
                bottomEdge = enemy.bottom
            }
        }

        // Detect when enemies reach the bottom.
        if (bottomEdge >= scene.screenHeight()) {
            bottomReached = true
            stopMovement()
            return
        }

        // Moving right: reached right wall.
        if (formationDirection == 1 &&
            rightEdge >= scene.screenWidth()) {

            let correction =
                rightEdge - scene.screenWidth()

            for (let enemy of formationEnemies) {
                enemy.x -= correction
                enemy.y += formationDrop
                enemy.vx = -formationSpeed
            }

            formationDirection = -1

        // Moving left: reached left wall.
        } else if (formationDirection == -1 &&
                   leftEdge <= 0) {

            let correction = -leftEdge

            for (let enemy of formationEnemies) {
                enemy.x += correction
                enemy.y += formationDrop
                enemy.vx = formationSpeed
            }

            formationDirection = 1
        }

        // Check again after dropping the formation.
        for (let enemy of formationEnemies) {
            if (enemy.bottom >= scene.screenHeight()) {
                bottomReached = true
                stopMovement()
                return
            }
        }
    }

    /**
     * Stop the current enemy formation.
     */
    //% blockId=space_invaders_stop_movement
    //% block="stop enemy formation movement"
    //% weight=90
    export function stopMovement(): void {

        movementActive = false

        for (let enemy of formationEnemies) {
            enemy.vx = 0
        }
    }

    /**
     * Set horizontal movement speed.
     */
    //% blockId=space_invaders_set_speed
    //% block="set enemy formation speed to $speed"
    //% speed.defl=30
    //% speed.min=0
    //% weight=80
    export function setSpeed(speed: number): void {

        formationSpeed = Math.abs(speed)

        if (movementActive) {
            for (let enemy of formationEnemies) {
                enemy.vx =
                    formationDirection * formationSpeed
            }
        }
    }

    /**
     * Check whether the formation has
     * reached the bottom of the screen.
     */
    //% blockId=space_invaders_bottom_reached
    //% block="enemy formation reached bottom?"
    //% weight=70
    export function hasReachedBottom(): boolean {
        return bottomReached
    }

    /**
     * Verify the expected game resolution.
     */
    //% blockId=space_invaders_screen_correct
    //% block="screen is 360 x 320?"
    //% weight=60
    export function isScreenSizeCorrect(): boolean {

        return scene.screenWidth() == 360 &&
               scene.screenHeight() == 320
    }
}
