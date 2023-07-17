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

/**
 * 
 * @param {import('@minecraft/server').Player} source 
 * @param {String} guildName 
 * @returns 
 */

function GuildCreate(source, guildName) {
  const sourceGuild = world.scoreboard.getObjective(`playerguild`).getScore(source)
  if(typeof sourceGuild === 'undefined' || sourceGuild !== 0) {
    source.sendMessage(`§c既にギルドに所属している場合、作成することは出来ません。`)
  }
  if(guildName.length > 15) {
    source.sendMessage(`§cギルド名は15文字以内にしてください。`)
  }
  const guilds = world.scoreboard.getObjective(`guildname`).getScores()
  let guildNumber = null
  let guildsAmount = []
  let guildNames = []
  for(let i = 0;i < guilds.length;i++){
    guildsAmount[guildsAmount.length] = guilds[i].score
    guildNames[guildNames.length] = guilds[i].participant.displayName
  }
  if(guildNames.indexOf(guildName) !== -1) {
    source.sendMessage(`§cその名前は使えません`)
  }
  const GuildMaxNumber = Math.max(...guildsAmount)
  source.sendMessage(`§aギルド§r「 ${guilds[guildNumber].participant.displayName} §r」§aを作成しました。`)
  source.addTag(`guildOwner`)
  const guildAdminItem = new ItemStack(`karo:guildAdmin`)
  /**
   * @type {Container} selectSlot
   */
  const selectSlot = source.getComponent(`inventory`).container
  selectSlot.setItem(source.selectedSlot,guildAdminItem)
  world.scoreboard.getObjective(`guildname`).setScore(`${newName}`,GuildMaxNumber + 1)
  world.scoreboard.getObjective(`playerguild`).setScore(source,GuildMaxNumber + 1)
}

/**
 * 
 * @param {import('@minecraft/server').Player} source
 * @returns 
 */
function GuildDelete(source) {
  const sourceGuild = world.scoreboard.getObjective(`playerguild`).getScore(source)
  if(typeof sourceGuild === 'undefined') return;
  if(!source.hasTag(`guildOwner`)) return;
  const guilds = world.scoreboard.getObjective(`guildname`).getScores()
  const members = world.scoreboard.getObjective(`playerguild`).getScores()

  let guildNumber = null
  for(let i = 0;i < guilds.length;i++){
    if(guilds[i].score === sourceGuild) {
      guildNumber = i
    }
  }
  for(let i = 0;i < members.length;i++){
    if(members[i].score === sourceGuild) world.scoreboard.getObjective(`playerguild`).removeParticipant(members[i].participant)
  }
  source.runCommandAsync(`title @s subtitle `)
  if(guildNumber === null) return;
  source.sendMessage(`§aあなたのギルドが削除されました。`)
  world.scoreboard.getObjective(`guildname`).removeParticipant(guilds[guildNumber].participant.displayName)
}