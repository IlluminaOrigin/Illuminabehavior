import * as MC from "@minecraft/server"
import { ChatRename } from "functions.js"

const banList = []

const whiteListPlayers = [`Aria3918`,`kino 1963`,`Shaopipi2525`,`Kitune6073`,`LitheGrain2489`,`IamMavericK777`,`neboko`,`RaRachan1117075`,`Urashima7777`,`ThreeStraw3094`,`Banna6955`,`Nodokaaaaa`,`clare0918`,`polloguff3033`,`Karon8442`,`VeryUmbrella639`,`damenaito0066`,`kurou7524875`,`Youtyan13`,`FartherSuzume`,`syautana`,`oskworkshop8`,`Onebit4405`]
const PlayerNames = new Map()

for(const p of MC.world.getPlayers({tags:[`hatu`]})) {
    PlayerNames.set(p.name , `${ChatRename(p.nameTag)}`)
    p.runCommandAsync(`title @s subtitle join ${p.name}"${name(p.nameTag)}`)
}

MC.world.afterEvents.playerSpawn.subscribe((ev)=>{
    const { player } = ev;
    if(ev.initialSpawn) {
        const dates = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000))
        if(!whiteListPlayers.includes(player.name)){
            MC.world.sendMessage(`§cホワリスに入ってないプレイヤーです : ${player.name}`)
            player.runCommandAsync(`kick "${player.name}" "§cあなたはホワイトリストに入っていません`)
        }
        player.addEffect(`resistance`,20000000,{amplifier: 250,showParticles: false})
        if(player.hasTag(`hatu`)) {
            PlayerNames.set(player.name , `${ChatRename(player.nameTag)}`)
            MC.world.sendMessage(`[${dates.getHours()}:${zeroMessage}${dates.getMinutes()}] ${ChatRename(player.nameTag)} §r§eがログイン`)
            MC.world.scoreboard.getObjective(`party`).setScore(player,0)
            MC.world.getDimension(`overworld`).runCommandAsync(`title @p subtitle join ${player.name}"${name(player.nameTag)}`)
        }
    }
})

MC.world.afterEvents.playerLeave.subscribe((ev)=>{
    if(!PlayerNames.get(ev.playerName)) return;
    const dates = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000))
    MC.world.sendMessage(`[${dates.getHours()}:${zeroMessage}${dates.getMinutes()}] ${ChatRename(PlayerNames.get(ev.playerName))} §r§eがログアウト`)
})

function name(playersNameArray){
    let p4 = []
    let p = playersNameArray.split(/\n/)
    if(p.length > 2) p.shift()
    for(let i = 0;i < p.length - 1;i++){
      if(i > 0) p4 += `\n`
      let p2 = p[i].split(`§`)
      for(let i2 = 0;i2 < p2.length;i2++){
        let p3 = p2[i2].substr(1,p2[i2].length)
        p4 += p3
      }
    }
    if(p4.length === 0) p4[0] = playersNameArray
    const p6 = p4.toString()
    return p6;
  } 