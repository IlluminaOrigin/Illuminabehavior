import * as MC from "@minecraft/server";
import "damage.js"
import "scriptevents.js"
import "chat.js"
import "spawn.js"
import "useitem.js"
import "worldedit.js"

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

MC.world.afterEvents.chatSend.subscribe((ev) => {
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
/*
const dates = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000))
const dayname = ['日','月','火','水','木','金','土']
MC.world.sendMessage(`${dates.getMonth()}月${dates.getDate()}日(${dayname[dates.getDay()]})${dates.getHours()}:${dates.getMinutes()}`)
*/
MC.system.runInterval((ev)=>{
    if(MC.world.getPlayers({tags:[`map`]}).length === 0) return
    if(MC.world.getPlayers({tags:[`map`]})[0].location.x < 1200 && MC.world.getPlayers({tags:[`map`]})[0].location.z < 1600) MC.world.getPlayers({tags:[`map`]})[0].teleport({x: MC.world.getPlayers({tags:[`map`]})[0].location.x + 10,y: MC.world.getPlayers({tags:[`map`]})[0].location.y,z: MC.world.getPlayers({tags:[`map`]})[0].location.z})
    if(MC.world.getPlayers({tags:[`map`]})[0].location.x > 1200 && MC.world.getPlayers({tags:[`map`]})[0].location.z < 1600) MC.world.getPlayers({tags:[`map`]})[0].teleport({x: MC.world.getPlayers({tags:[`map`]})[0].location.x ,y: MC.world.getPlayers({tags:[`map`]})[0].location.y,z: MC.world.getPlayers({tags:[`map`]})[0].location.z + 10})
    if(MC.world.getPlayers({tags:[`map`]})[0].location.x > -1200 && MC.world.getPlayers({tags:[`map`]})[0].location.z > 1600) MC.world.getPlayers({tags:[`map`]})[0].teleport({x: MC.world.getPlayers({tags:[`map`]})[0].location.x - 10,y: MC.world.getPlayers({tags:[`map`]})[0].location.y,z: MC.world.getPlayers({tags:[`map`]})[0].location.z})
    if(MC.world.getPlayers({tags:[`map`]})[0].location.x < -1200 && MC.world.getPlayers({tags:[`map`]})[0].location.z > -1600) MC.world.getPlayers({tags:[`map`]})[0].teleport({x: MC.world.getPlayers({tags:[`map`]})[0].location.x,y: MC.world.getPlayers({tags:[`map`]})[0].location.y,z: MC.world.getPlayers({tags:[`map`]})[0].location.z - 10})
},20)