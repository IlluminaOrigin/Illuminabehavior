import { world } from '@minecraft/server';

/**
 * @param {import('@minecraft/server').Player|import('@minecraft/server').Entity|string} target
 * @param {string} objective
 * @returns {number|null}
 */
export function getScore(objective,target) {
    try {
        return world.scoreboard.getObjective(objective).getScore(target);
    }
    catch(e){return true;}
}
/**
 * @param {import('@minecraft/server').Player|import('@minecraft/server').Entity|string} target
 * @param {string} objective
 * @returns {number|null}
 */
export function setScore(objective,target,number) {
    try {
        return world.scoreboard.getObjective(objective).setScore(target,number)
    }
    catch(e){return true;}
}