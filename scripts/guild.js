import { DynamicPropertiesDefinition, world } from "@minecraft/server"

world.afterEvents.worldInitialize.subscribe((ev) => {
    let guildAmount = new DynamicPropertiesDefinition()
    guildAmount.defineNumber("guildAmount",0)
    ev.propertyRegistry.registerWorldDynamicProperties(guildAmount);
    for(let i = 1;i < world.getDynamicProperty("guildAmount") + 1;i++){
        guildAmount.defineString(`guild${i}`)
    }
});



let dp = 
    dp.defineNumber("d");
   