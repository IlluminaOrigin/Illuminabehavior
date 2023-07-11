import { world } from '@minecraft/server';

/**
 * @param {import('@minecraft/server').Player|import('@minecraft/server').Entity|string} target
 * @param {string} objective
 * @returns {number|null}
 */
export function getScore(objective,target) {
    try {
        if (typeof target === 'string') return world.scoreboard.getObjective(objective).getScores().find(({ participant }) => participant.displayName === target).score;
        return world.scoreboard.getObjective(objective).getScore(target.scoreboardIdentity);
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
        if (typeof target === 'string') return world.scoreboard.getObjective(objective).getScores().find(({ participant }) => participant.displayName === target).score;
        return target.scoreboardIdentity.setScore(world.scoreboard.getObjective(objective),number)
    }
    catch(e){return true;}
}