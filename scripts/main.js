import {  world , system, Player, Container, ItemStack } from "@minecraft/server";
import "damage.js"
import "scriptevents.js"
import "chat.js"
import "spawn.js"

/*
world.beforeEvents.dataDrivenEntityTriggerEvent.subscribe(ev=>{
    const { id, entity } = ev;
    if(id == `minecraft:crystal_explode`) {
        world.sendMessage(`aaa`)
        ev.cancel = true;
    }
})*/

/*world.afterEvents.itemStartUseOn.subscribe((ev) => {
    if(ev.itemStack.typeId === `minecraft:brush` && ev.block.typeId.includes(`coral`)) {
        world.sendMessage(`startuse`)
    }
})

world.afterEvents.itemStopUseOn.subscribe((ev) =>{
    if(ev.itemStack.typeId === `minecraft:brush` && ev.block.hasTag(`ore`)) {
        
    }

})

*/

world.afterEvents.chatSend.subscribe((ev) => {
    if(ev.message.startsWith("score")) {
        const guilds = world.scoreboard.getObjective(`guildname`).getScores()
        let guildNumber = null
        world.sendMessage(`§b${Number(ev.message.split(` `)[1])}`)
        for(let i = 0;i < guilds.length;i++){
            world.sendMessage(`${guilds[i].score}`)
            if(guilds[i].score === Number(ev.message.split(` `)[1])) {
                guildNumber = i
            }
        }
        world.sendMessage(`§a${guildNumber}`)
        world.sendMessage(`${guilds[guildNumber].participant.displayName}`)
        if(guildNumber === null) return;
        const newGuildNumber = guilds[guildNumber].score
        world.scoreboard.getObjective(`guildname`).removeParticipant(guilds[guildNumber].participant.displayName)
        world.scoreboard.getObjective(`guildname`).setScore(`${ev.message.split(` `)[2]}`,newGuildNumber)
        world.sendMessage(`${guilds[i].score}`)
    }
})

