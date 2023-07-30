import {  world , system } from "@minecraft/server";
let startVector = new Map()
let endVector = new Map()

world.afterEvents.blockBreak.subscribe((ev)=>{
    if(ev.player.getComponent(`inventory`).container.getItem(ev.player.selectedSlot).typeId === `karo:we_axe`){
        ev.dimension.fillBlocks(ev.block.location,ev.block.location,ev.brokenBlockPermutation)
        startVector.set(ev.player.name ,`${ev.block.location.x} ${ev.block.location.y} ${ev.block.location.z}`)
        ev.player.sendMessage(`始点座標を (${startVector.get(ev.player.name)}) にしました`)
    }
})

world.afterEvents.itemUse.subscribe((ev)=>{
    if(ev.source.getComponent(`inventory`).container.getItem(ev.source.selectedSlot).typeId === `karo:we_axe`){
        endVector.set(ev.source.name ,`${ev.source.getBlockFromViewDirection().block.location.x} ${ev.source.getBlockFromViewDirection().block.location.y} ${ev.source.getBlockFromViewDirection().block.location.z}`)
        ev.source.sendMessage(`終点座標を (${endVector.get(ev.source.name)}) にしました`)
    }
})