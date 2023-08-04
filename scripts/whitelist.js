import * as MC from "@minecraft/server"
import { ChatRename } from "functions.js"

const banList = [
    "",
    ""
]

const whiteListPlayers = [`Banna6955`,`Nodokaaaaa`,`clare0918`,`polloguff3033`,`Karon8442`,`VeryUmbrella639`,`damenaito0066`,`kurou7524875`,`Youtyan13`,`FartherSuzume`,`syautana`,`oskworkshop8`,`Onebit4405`]
const PlayerNames = new Map()

for(const p of MC.world.getPlayers({tags:[`hatu`]})) {
    PlayerNames.set(p.name , `${ChatRename(p.nameTag)}`)
}

MC.world.afterEvents.playerJoin.subscribe((ev)=>{
    const { playerName } = ev;
    MC.system.runTimeout(()=>{
        if(!whiteListPlayers.includes(MC.world.getPlayers({name: playerName})[0].name)){
            MC.world.sendMessage(`§cホワリスに入ってないプレイヤーです : ${MC.world.getPlayers({name: playerName})[0].nameTag}`)
            MC.world.getPlayers({name: playerName})[0].runCommandAsync(`kick "${MC.world.getPlayers({name: playerName})[0].name}" "§cあなたはホワイトリストに入っていません`)
        } 
        
        if(MC.world.getPlayers({name: playerName})[0].hasTag(`hatu`)) {
            PlayerNames.set(playerName , `${ChatRename(MC.world.getPlayers({name: playerName})[0].nameTag)}`)
            MC.world.sendMessage(`${ChatRename(MC.world.getPlayers({name: playerName})[0].nameTag)} §r§eがログイン`)
        }
    },150)
})

MC.world.afterEvents.playerLeave.subscribe((ev)=>{
    if(!PlayerNames.get(ev.playerName)) return;
    MC.world.sendMessage(`${ChatRename(PlayerNames.get(ev.playerName))} §r§eがログアウト`)
})