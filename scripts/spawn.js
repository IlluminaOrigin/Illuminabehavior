import { system, world, Vector } from "@minecraft/server";

world.afterEvents.entitySpawn.subscribe(ev => {
  const dimension = world.getDimension('overworld');
  const entity = ev.entity
  const score = ["lv","hp","maxhp","atk","def","xp","money","hit","agi","mdef"]
  let st = [1,30,30,2,2,3,1,1,1]
  let loot
  if (entity.typeId === "minecraft:player" || entity.typeId === "karo:tamasii" || entity.typeId === "karo:damage" || entity.typeId === "karo:message" || entity.typeId === "minecraft:armor_stand" || entity.typeId === "minecraft:item" || entity.typeId === "minecraft:npc" || entity.typeId === "minecraft:arrow" || entity.typeId === "minecraft:chest_minecart" || entity.typeId === "minecraft:command_block_minecart" || entity.typeId === "minecraft:egg" || entity.typeId === "minecraft:falling_block" || entity.typeId === "minecraft:eye_of_ender_signal" || entity.typeId === "minecraft: evocation_fang" || entity.typeId === "minecraft:fireball" || entity.typeId === "minecraft:fishing_hook" || entity.typeId === "minecraft:firewarks_rocket" || entity.typeId === "minecraft:hopper_minecart" || entity.typeId === "minecraft:ender_pearl" || entity.typeId === "minecraft:lighting_bolt" || entity.typeId === "minecraft:lingering_potion" || entity.typeId === "minecraft:moving_block" || entity.typeId === "minecraft:painting" || entity.typeId === "minecraft:shulker_bullet" || entity.typeId === "minecraft:small_fireball" || entity.typeId === "minecraft:llama_spit" || entity.typeId === "minecraft:minecart" || entity.typeId === "minecraft:splash_potion" || entity.typeId === "minecraft:xp_bottle" || entity.typeId === "minecraft:xp_orb" || entity.typeId === "minecraft:wither_skull_dangerous" || entity.typeId === "minecraft:wither_skull" || entity.typeId === "minecraft:tnt" || entity.typeId === "karo:damage" ) return;
  const location = new Vector(entity.location.x, entity.location.y, entity.location.z)
  for(const as of dimension.getEntities({location: location,closest: 1, type: "armor_stand",excludeNames:[``]}) ){
      const name = as.nameTag;
      switch(name) {
        case "M1":{
         st = [1,30,30,2,2,3,1,1,1,2]
         loot = "slime"
         break;
        }
        case "M2":{
         st = [5,50,50,5,5,5,3,1,1,2]
         loot = "a"
         break;
        }
        default:{
        break;
        }
      } 
      for (let i = 0; i < score.length; i++) {
        entity.runCommandAsync(`scoreboard players set @s ${score[i]} ${st[i]}`)
      }
      entity.addTag(`loot_${loot}`)
      entity.addTag(`${name}`)
  }
});