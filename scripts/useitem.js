import { world } from "@minecraft/server";
import { GuildAdminForm,GuildCreateForm,GuildNameChangeForm,GuildDeleteForm } from "guild.js";

world.afterEvents.itemStartUseOn.subscribe((ev)=>{
    world.sendMessage(`b`)
    switch(ev.itemStack.typeId){
        case "karo:guildinvite":{
            if(Number(ev.itemStack.getLore()[0]) == NaN || Number(ev.itemStack.getLore()[0]) == 0) return;
            world.scoreboard.getObjective(`playerguild`).setScore(ev.source,Number(ev.itemStack.getLore()[0]))
            ev.source.sendMessage(`§aギルドに加入しました。`)
            ev.source.getComponent(`inventory`).container.setItem(ev.source.selectedSlot)
            break;
        }
        case "karo:guildcreate":{
            GuildCreateForm(ev.source)
            break;
        }
        case "karo:guildadmin":{
            if(!world.scoreboard.getObjective(`playerguild`).getScore(ev.source) || world.scoreboard.getObjective(`playerguild`).getScore(ev.source) === 0) return;
            GuildAdminForm(ev.source)
            break;
        }
        default: return;
    }
})