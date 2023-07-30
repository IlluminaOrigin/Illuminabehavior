import {  world , system } from "@minecraft/server";
const startVector = new Map()
world.afterEvents.blockBreak.subscribe((ev)=>{
    if(ev.player.getComponent(`inventory`).container.getItem(ev.player.selectedSlot).typeId === `karo:we_axe`){
        ev.dimension.fillBlocks(ev.block.location,ev.block.location,ev.brokenBlockPermutation)
        startVector(ev.player.name ,ev.block.location)
        world.sendMessage(`${startVector(ev.player.name)}`)
    }
})