import {  world , system } from "@minecraft/server";
import {rename , ItemLock , Lore} from "functions.js"

world.beforeEvents.chatSend.subscribe((ev) => {
    const {sender , message} = ev;
    ev.sendToTargets = true
    switch(true) {
        case message.startsWith(`!name`): world.sendMessage(`${sender.nameTag}`); break;
        case message.startsWith(`!lore`): {
            let item = sender.getComponent(`inventory`).container.getItem(sender.selectedSlot)
            system.run(()=>{
                Lore(item,"短剣",1,"E",1000,1,1,20,19,10,"§c炎")
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

