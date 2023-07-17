import { world } from "@minecraft/server";
import { GuildAddAdmin,GuildAddMember,GuildCreate,GuildDelete,GuildNameChange,GuildOwnerChange,GuildRemoveAdmin,GuildRemoveMember } from "functions.js";
import { GuildAdminForm,GuildCreateForm,GuildNameChangeForm,GuildDeleteForm } from "guild.js";

world.afterEvents.itemUse.subscribe((ev)=>{
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
            GuildAdminForm(ev.source)
            break;
        }
        default: return;
    }
})