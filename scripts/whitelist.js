import * as MC from "@minecraft/server"
import { ChatRename } from "functions.js"

const whiteListPlayers = [`Karon8442`,`VeryUmbrella639`,`damenaito0066`,`kurou7524875`,`Youtyan13`,`FartherSuzume`,`syautana`]
const PlayerNames = new Map()

for(const p of MC.world.getPlayers({tags:[`hatu`]})) {
    PlayerNames.set(p.name , `${ChatRename(p.nameTag)}`)
}

MC.world.afterEvents.playerJoin.subscribe((ev)=>{
    const { playerName } = ev;
    MC.world.sendMessage(`名前:${playerName}`)
    MC.system.runTimeout(()=>{
        MC.world.sendMessage(`名前:${playerName}\nMCID:${MC.world.getPlayers({name: playerName})[0].name}\nネームタグ:${MC.world.getPlayers({name: playerName})[0].nameTag}`)
        if(!MC.world.getPlayers({name: playerName})[0].name.includes(whiteListPlayers)) MC.world.sendMessage(`§cホワリスに入ってないプレイヤーです`)
        //MC.world.getPlayers({name: playerName})[0].runCommandAsync(`kick "${MC.world.getPlayers({name: playerName})[0].name}"`)
        if(MC.world.getPlayers({name: playerName})[0].hasTag(`hatu`)) {
            PlayerNames.set(playerName , `${ChatRename(MC.world.getPlayers({name: playerName})[0].nameTag)}`)
            MC.world.sendMessage(`${ChatRename(MC.world.getPlayers({name: playerName})[0].nameTag)} §r§eが世界に来た`)
        }
    },100)
})

MC.world.afterEvents.playerLeave.subscribe((ev)=>{
    if(!PlayerNames.get(ev.playerName)) return;
    MC.world.sendMessage(`${ChatRename(PlayerNames.get(ev.playerName))} §r§eがログアウト`)
})

