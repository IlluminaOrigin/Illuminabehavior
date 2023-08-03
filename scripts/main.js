import * as MC from "@minecraft/server";
import "damage.js"
import "scriptevents.js"
import "chat.js"
import "spawn.js"
import "useitem.js"
import "worldedit.js"
import "whitelist.js"

MC.world.afterEvents.dataDrivenEntityTriggerEvent.subscribe((ev)=>{
    if(ev.id === "open") MC.world.sendMessage(`aa`)
})
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

/*
    MC.world.afterEvents.entityDie.subscribe((ev)=>{
    if(ev.deadEntity.typeId !== `minecraft:player` || ev.deadEntity.hasTag(`keepInventory`)) return;
    /** 
    * @type { MC.Container } 
    */
/*/*    let playerContainer = ev.deadEntity.getComponent(`inventory`).container
    for(let i = 0; i < 36;i++) {
        if(typeof playerContainer.getItem(i) === 'undefined') continue;
        MC.world.getDimension(`overworld`).spawnItem(playerContainer.getItem(i),ev.deadEntity.location)
    }
    /** 
    * @type { MC.EntityEquipmentInventoryComponent } 
    */
/*    let playerEquipment = ev.deadEntity.getComponent("equipment_inventory")
    const slotNames = ["chest" , "head" , "feet" , "legs" , "offhand"]
    for(let i = 0; i < 5;i++) {
        if(typeof playerEquipment.getEquipment(slotNames[i]) === 'undefined') continue;
        MC.world.getDimension(`overworld`).spawnItem(playerEquipment.getEquipment(slotNames[i]),ev.deadEntity.location)
    }
    ev.deadEntity.runCommandAsync(`clear @s`)
})
*/

/* 特殊ブロック
MC.world.getDimension(`overworld`).fillBlocks(MC.world.getPlayers()[0].location,MC.world.getPlayers()[0].location,MC.MinecraftBlockTypes.glowingobsidian)
*/

/*
MC.world.afterEvents.blockBreak.subscribe((ev)=>{
    ev.dimension.fillBlocks(ev.block.location,ev.block.location,ev.brokenBlockPermutation)
})

MC.world.afterEvents.blockPlace.subscribe((ev)=>{
    ev.dimension.fillBlocks(ev.block.location,ev.block.location,MC.MinecraftBlockTypes.air)
})*/

MC.world.beforeEvents.explosion.subscribe((ev)=>{
    ev.cancel = true
})