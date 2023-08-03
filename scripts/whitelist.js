import * as MC from "@minecraft/server"

const whiteListPlayers = [`Karon8442`,`VeryUmbrella639`,`damenaito0066`,`kurou7524875`,`Youtyan13`]

MC.world.afterEvents.playerJoin.subscribe((ev)=>{
    const { playerName } = ev;
    MC.world.sendMessage(`名前:${playerName}\nMCID:${MC.world.getPlayers({name: playerName})[0].name}\nネームタグ:${MC.world.getPlayers({name: playerName})[0].nameTag}`)
    if(!MC.world.getPlayers({name: playerName})[0].name.includes(whiteListPlayers)) MC.world.sendMessage(`§cホワリスに入ってないプレイヤー`)
    //MC.world.getPlayers({name: playerName})[0].runCommandAsync(`kick "${MC.world.getPlayers({name: playerName})[0].name}"`)
})
