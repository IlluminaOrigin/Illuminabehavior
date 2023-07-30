import {  world , system } from "@minecraft/server";

world.afterEvents.blockBreak.subscribe((ev)=>{
    ev.brokenBlockPermutation.clone()
    //ev.dimension.fillBlocks(ev.block.location,ev.block.location,)
    //ev.block.location
})