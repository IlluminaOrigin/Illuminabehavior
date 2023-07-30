import {  world , system, MinecraftBlockTypes, BlockPermutation,Block } from "@minecraft/server";
let startVector = new Map()
let endVector = new Map()
let degrees = new Map()
let featherBlock = new Map()
const airBlock = world.getDimension(`overworld`).getBlock({x:0,y:0,z:0})
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
    if(ev.player.getComponent(`inventory`).container.getItem(ev.player.selectedSlot).typeId === `karo:we_info`){
        ev.player.sendMessage(`§b${ev.brokenBlockPermutation.getItemStack().typeId.split(`:`)[1]}`)
        ev.dimension.fillBlocks(ev.block.location,ev.block.location,ev.brokenBlockPermutation)
    }
})

world.afterEvents.itemUse.subscribe((ev)=>{
    const playerViewLocation = {x: ev.source.getBlockFromViewDirection().block.location.x,y: ev.source.getBlockFromViewDirection().block.location.y,z: ev.source.getBlockFromViewDirection().block.location.z}
    if(ev.source.getComponent(`inventory`).container.getItem(ev.source.selectedSlot).typeId === `karo:we_axe`){
        endVector.set(ev.source.name ,`${playerViewLocation.x} ${playerViewLocation.y} ${playerViewLocation.z}`)
        ev.source.sendMessage(`§a終点座標を (${endVector.get(ev.source.name)}) にしました`)
    }
    if(ev.source.getComponent(`inventory`).container.getItem(ev.source.selectedSlot).typeId === `karo:we_feather`){
        world.getDimension(`overworld`).fillBlocks(ev.source.getBlockFromViewDirection().block.location,ev.source.getBlockFromViewDirection().block.location,featherBlock.get(ev.source.name))
    }
    if(ev.source.getComponent(`inventory`).container.getItem(ev.source.selectedSlot).typeId === `karo:we_airblock`){
        world.getDimension(`overworld`).fillBlocks({x: ev.source.location.x,y: ev.source.location.y - 1,z: ev.source.location.z},{x: ev.source.location.x,y: ev.source.location.y - 1,z: ev.source.location.z},MinecraftBlockTypes.glass)
    }
    if(ev.source.getComponent(`inventory`).container.getItem(ev.source.selectedSlot).typeId === `karo:we_shovel`){
        world.getDimension(`overworld`).fillBlocks({x: playerViewLocation.x + 1,y: playerViewLocation.y + 1,z: playerViewLocation.z + 1},{x: playerViewLocation.x - 1,y: playerViewLocation.y - 1,z: playerViewLocation.z - 1},MinecraftBlockTypes.sand,{matchingBlock: airBlock.permutation})
    }
    if(ev.source.getComponent(`inventory`).container.getItem(ev.source.selectedSlot).typeId === `karo:we_brush`){
        world.getDimension(`overworld`).fillBlocks({x: playerViewLocation.x + 1,y: playerViewLocation.y + 2,z: playerViewLocation.z + 1},{x: playerViewLocation.x - 1,y: playerViewLocation.y - 2,z: playerViewLocation.z - 1},MinecraftBlockTypes.unknown,{matchingBlock:airBlock.permutation})
        world.getDimension(`overworld`).fillBlocks({x: playerViewLocation.x + 2,y: playerViewLocation.y + 1,z: playerViewLocation.z + 1},{x: playerViewLocation.x - 2,y: playerViewLocation.y - 1,z: playerViewLocation.z - 1},MinecraftBlockTypes.unknown,{matchingBlock: airBlock.permutation})
        world.getDimension(`overworld`).fillBlocks({x: playerViewLocation.x + 1,y: playerViewLocation.y + 1,z: playerViewLocation.z + 2},{x: playerViewLocation.x - 1,y: playerViewLocation.y - 1,z: playerViewLocation.z - 2},MinecraftBlockTypes.unknown,{matchingBlock: airBlock.permutation})
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
        if(ev.message.startsWith(`\\\\set`)) {
            if(typeof startVector.get(ev.sender.name) === 'undefined' || typeof endVector.get(ev.sender.name) === 'undefined') {
                ev.sender.sendMessage(`§c範囲を選択できていません。`)
                return;
            }
            if(ev.message.split(` `)[1] !== `0`) ev.sender.runCommandAsync(`fill ${startVector.get(ev.sender.name)} ${endVector.get(ev.sender.name)} ${ev.message.split(/(?<=^[^ ]+?) /)[1]}`)
            ev.sender.sendMessage(`§a(${startVector.get(ev.sender.name)}) から (${endVector.get(ev.sender.name)}) を${ev.message.split(` `)[1]}にしました`)
        }
        if(ev.message.startsWith(`\\\\outline`)) {
            if(typeof startVector.get(ev.sender.name) === 'undefined' || typeof endVector.get(ev.sender.name) === 'undefined') {
                ev.sender.sendMessage(`§c範囲を選択できていません。`)
                return;
            }
            if(ev.message.split(` `)[1] !== `0`) ev.sender.runCommandAsync(`fill ${startVector.get(ev.sender.name)} ${endVector.get(ev.sender.name)} ${ev.message.split(/(?<=^[^ ]+?) /)[1]} outline`)
            ev.sender.sendMessage(`§a(${startVector.get(ev.sender.name)}) から (${endVector.get(ev.sender.name)}) を${ev.message.split(` `)[1]}にしました`)
        }
    }
})