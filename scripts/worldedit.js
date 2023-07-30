import {  world , system } from "@minecraft/server";
let startVector = new Map()
let endVector = new Map()
world.afterEvents.blockBreak.subscribe((ev)=>{
    if(typeof ev.player.getComponent(`inventory`).container.getItem(ev.player.selectedSlot) === 'undefined') return
    if(ev.player.getComponent(`inventory`).container.getItem(ev.player.selectedSlot).typeId === `karo:we_axe`){
        ev.dimension.fillBlocks(ev.block.location,ev.block.location,ev.brokenBlockPermutation)
        startVector.set(ev.player.name ,`${ev.block.location.x} ${ev.block.location.y} ${ev.block.location.z}`)
        ev.player.sendMessage(`§a始点座標を (${startVector.get(ev.player.name)}) にしました`)
    }
})

world.afterEvents.itemUse.subscribe((ev)=>{
    if(ev.source.getComponent(`inventory`).container.getItem(ev.source.selectedSlot).typeId === `karo:we_axe`){
        endVector.set(ev.source.name ,`${ev.source.getBlockFromViewDirection().block.location.x} ${ev.source.getBlockFromViewDirection().block.location.y} ${ev.source.getBlockFromViewDirection().block.location.z}`)
        ev.source.sendMessage(`§a終点座標を (${endVector.get(ev.source.name)}) にしました`)
    }
})

world.afterEvents.chatSend.subscribe((ev)=>{
    if(ev.message.startsWith(`\\\\`)) {
        if(ev.message.startsWith(`\\\\copy`)) {
            if(typeof startVector.get(ev.sender.name) === 'undefined' || typeof endVector.get(ev.sender.name) === 'undefined') {
                ev.sender.sendMessage(`§c範囲を選択できていません。`)
                return;
            }
            ev.sender.runCommandAsync(`structure save "${ev.sender.name}" ${startVector.get(ev.sender.name)} ${endVector.get(ev.sender.name)}`)
            ev.sender.sendMessage(`§a(${startVector.get(ev.sender.name)}) から (${endVector.get(ev.sender.name)}) をコピーしました`)
        }
        if(ev.message.startsWith(`\\\\paste`)) {
            ev.sender.runCommandAsync(`structure load "${ev.sender.name}" ${ev.sender.location.x} ${ev.sender.location.y} ${ev.sender.location.z}`)
            ev.sender.sendMessage(`§a貼り付けました`)
        }
    }
})