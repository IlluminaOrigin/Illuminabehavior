import { world } from '@minecraft/server';

/**
 * @param {import('@minecraft/server').Player|import('@minecraft/server').Entity|string} target
 * @param {string} objective
 * @returns {number|null|boolean}
 */
export function getScore(target,objective) {
    try {
        if (typeof target === 'string') return world.scoreboard.getObjective(objective).getScores().find(({ participant }) => participant.displayName === target).score;
        return world.scoreboard.getObjective(objective).getScore(target.scoreboardIdentity);
    }
    catch(e){return true;}
}
