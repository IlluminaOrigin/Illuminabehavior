import {  world , system } from "@minecraft/server";
import "damage.js"
import "scriptevents.js"

world.beforeEvents.chatSend.subscribe((ev) => {
    const {sender , message} = ev;
    ev.sendToTargets = true
    switch(true) {
        case message.startsWith(`!name`): world.sendMessage(`${sender.nameTag}`); break;
        case message.startsWith(`!lore`): {
            let item = sender.getComponent(`inventory`).container.getItem(sender.selectedSlot)
            system.run(()=>{
                Lore(item,"短剣",100,"E",120,20,100,20,19,10)
                sender.getComponent(`inventory`).container.setItem(sender.selectedSlot,item)
            })
            break;
        }
        case message.startsWith(`!item`): {
            sender.sendMessage(`${JSON.stringify(sender.getTags())}`)
            sender.runCommandAsync(`title @s subtitle "[{\"text\":\"${sender.name.replace(/"/,/\"/)}\"},{\"tekitou\":\"zzz\"}]"`)
            break;
        }
        case message.startsWith(`!saveitem`): {
            let lore = ``
            for(let i = 0;i < sender.getComponent(`minecraft:inventory`).container.getSlot(sender.selectedSlot).getLore().length;i++){
                if(i === 0) lore = `${lore}${sender.getComponent(`minecraft:inventory`).container.getSlot(sender.selectedSlot).getLore()[0]}`
                if(i > 0) lore = `${lore},${sender.getComponent(`minecraft:inventory`).container.getSlot(sender.selectedSlot).getLore()[i]}`
            }
            sender.runCommandAsync(`title @s subtitle "{\"saveItem\":{\"typeId\":\"${sender.getComponent(`minecraft:inventory`).container.getSlot(sender.selectedSlot).typeId}\",\"setLore\":[\"${lore}\"],\"itemname\":\"${sender.getComponent(`minecraft:inventory`).container.getSlot(sender.selectedSlot).nameTag}\"}}"`)
            break;
        }
        case message.startsWith(`!lock`): ItemLock(sender)
        case message.startsWith(`!createitem`): sender.runCommandAsync(`title ${message.split(` `)[2]} subtitle "createItem ${message.split(` `)[1]} ${sender.name}"`); break;
        default : {
            if(message.startsWith(`!`)) break;
            if(sender.hasTag(`toku`)) {
                world.sendMessage(`§b情報非公開のプレイヤー §r: ${message}`);
                break;
            }
            if(sender.hasTag(`killer`)){
                world.sendMessage(`§c${rename(sender.nameTag)} §r: ${message}`);
                break;
            } 
            if(!sender.hasTag(`killer`)){
                world.sendMessage(`§a${rename(sender.nameTag).replace()} §r: ${message}`);
                break;
            } 

        }

    }
})

function rename(playersName){
    let p4 = []
    let p = playersName.split(/\n/)
    if(p.length > 2) p.shift()
    for(let i = 0;i < p.length - 1;i++){
      if(i > 0) p4 += ` `
      let p2 = p[i].split(`§`)
      for(let i2 = 0;i2 < p2.length;i2++){
        let p3 = p2[i2].substr(1,p2[i2].length)
        p4 += p3
      }
    }
    if(p4.length === 0) p4[0] = playersName
    const p6 = p4.toString()
    return p6;
  } 


/*
world.beforeEvents.dataDrivenEntityTriggerEvent.subscribe(ev=>{
    const { id, entity } = ev;
    if(id == `minecraft:crystal_explode`) {
        world.sendMessage(`aaa`)
        ev.cancel = true;
    }
})
*/

world.afterEvents.itemStartUseOn.subscribe((ev) => {
    world.sendMessage(`${ev.block.typeId}`)
    if(ev.itemStack.typeId === `minecraft:brush` && ev.block.typeId.includes(`coral`)) {
        world.sendMessage(`startuse`)
    }
})

world.afterEvents.itemStopUseOn.subscribe((ev) =>{
    if(ev.itemStack.typeId === `minecraft:brush` && ev.block.hasTag(`ore`)) {
        
    }

})

function ItemLock(player){
    if(!player.getComponent(`inventory`).container.getSlot(player.selectedSlot)) return;
    let lock = player.getComponent(`inventory`).container.getSlot(player.selectedSlot).lockMode
    if(lock === `inventory`) {
      lock.none
    } else if(lock === `none`) {
      lock.inventory
    }
  }

  function Lore(ItemStack, 武器種, 相場価格, 等級, 耐久値, 攻撃力, 命中率, ドロップ率, 強化レベル, 使用可能レベル) {
    return ItemStack.setLore([ `§l§s===============`, `§l§p- §f種類:武器(${武器種})`, `§l§p- §f相場価格:${相場価格}円`, `§l§p- §f等級:${等級}`, `§l§t---------------`, `§l§u- §f耐久値:(${耐久値}/${耐久値})`, `§l§u- §f攻撃力:${攻撃力}`, `§l§u- §f命中率:${命中率}%`, `§l§u- §fドロップ率:${ドロップ率}`, `§l§u- §f強化レベル:+${強化レベル}`, `§l§u- §f使用可能レベル:Lv.${使用可能レベル}`, `§l§t---------------`, `§l§q- §f<エンチャント1>`, `§l§q- §f<エンチャント2>`, `§l§q- §f<エンチャント3>`, `§l§q- §f<スキルスロット1>`, `§l§q- §f<スキルスロット2>`, ``, `§l§s===============` ])
  }