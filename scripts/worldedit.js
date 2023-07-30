import {  world , system } from "@minecraft/server";
let startVector = new Map()
let endVector = new Map()
let degrees = new Map()
let featherBlock = new Map()

world.afterEvents.blockBreak.subscribe((ev)=>{
    if(typeof ev.player.getComponent(`inventory`).container.getItem(ev.player.selectedSlot) === 'undefined') return
    if(ev.player.getComponent(`inventory`).container.getItem(ev.player.selectedSlot).typeId === `karo:we_axe`){
        ev.dimension.fillBlocks(ev.block.location,ev.block.location,ev.brokenBlockPermutation)
        startVector.set(ev.player.name ,`${ev.block.location.x} ${ev.block.location.y} ${ev.block.location.z}`)
        ev.player.sendMessage(`§a始点座標を (${startVector.get(ev.player.name)}) にしました`)
    }
    if(ev.player.getComponent(`inventory`).container.getItem(ev.player.selectedSlot).typeId === `karo:we_feather`){
        featherBlock.set(ev.player.name,ev.brokenBlockPermutation)
        ev.dimension.fillBlocks(ev.block.location,ev.block.location,ev.brokenBlockPermutation)
    }
})

world.afterEvents.itemUse.subscribe((ev)=>{
    if(ev.source.getComponent(`inventory`).container.getItem(ev.source.selectedSlot).typeId === `karo:we_axe`){
        endVector.set(ev.source.name ,`${ev.source.getBlockFromViewDirection().block.location.x} ${ev.source.getBlockFromViewDirection().block.location.y} ${ev.source.getBlockFromViewDirection().block.location.z}`)
        ev.source.sendMessage(`§a終点座標を (${endVector.get(ev.source.name)}) にしました`)
    }
    if(ev.source.getComponent(`inventory`).container.getItem(ev.source.selectedSlot).typeId === `karo:we_feather`){
        world.getDimension(`overworld`).fillBlocks(ev.source.getBlockFromViewDirection().block.location,ev.source.getBlockFromViewDirection().block.location,featherBlock.get(ev.source.name))
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
        if(ev.message === `\\\\paste`) {
            if(typeof degrees.get(ev.sender.name) !== 'undefined') ev.sender.runCommandAsync(`structure load "${ev.sender.name}" ${ev.sender.location.x} ${ev.sender.location.y} ${ev.sender.location.z} ${degrees.get(ev.sender.name)}_degrees`)
            if(typeof degrees.get(ev.sender.name) === 'undefined') ev.sender.runCommandAsync(`structure load "${ev.sender.name}" ${ev.sender.location.x} ${ev.sender.location.y} ${ev.sender.location.z}`)
            ev.sender.sendMessage(`§a貼り付けました`)
        }
        if(ev.message.startsWith(`\\\\rotate`)) {
            degrees.set(ev.sender.name,ev.message.split(`-`)[1])
        }
    }
})