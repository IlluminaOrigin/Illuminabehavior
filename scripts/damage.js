import { system, world, ItemStack, Vector, Container, ItemTypes, MinecraftItemTypes, BlockType, MinecraftBlockTypes, BlockPermutation, MinecraftEntityTypes } from "@minecraft/server";
import { getScore,setScore } from "getscore.js"; 
const overworld = world.getDimension('overworld')
const weaponNumbers = {短剣: [1 , "tanken"],長剣: [2 , "tyouken"],杖:[3 , "tue"],槍:[4 , "yari"],斧:[5 , "斧"]}



//ダメージをエンティティが受けた時に発火
world.afterEvents.entityHurt.subscribe(entityHurt => { 
    //攻撃者、被ダメ者、ダメージ値、原因を取得
    const { damageSource, hurtEntity: sufferer, damage } = entityHurt;
    const { damagingEntity: attacker ,cause} = damageSource;
    if(!attacker || !sufferer || !attacker.getComponent(`inventory`).container.getItem(attacker.selectedSlot) || !attacker.getComponent(`inventory`).container.getItem(attacker.selectedSlot).getLore()[1] || !attacker.getComponent(`inventory`).container.getItem(attacker.selectedSlot).getLore()[1].split(`：`)[1].startsWith(`武器`)) return;
    world.sendMessage(`ok`)

    let suffererLevel = getScore(`lv`,sufferer);
    let attackerLevel = getScore(`lv`,attacker);
    let attackerHealth = getScore(`hp`, attacker);
    let suffererHealth = getScore(`hp`, sufferer);
    let sufferDefensePower = getScore(``,sufferer)


    //プレイヤーがプレイヤー以外に攻撃
    if (attacker?.typeId === "minecraft:player" && sufferer?.typeId !== "minecraft:player") {
        let damageFactor = suffererLevel > attackerLevel ? 2 : 1;
    
        //武器の取得
        /** @type { Container } */
        const container = attacker.getComponent("inventory").container;
        const item = container.getItem(attacker.selectedSlot);
        const lore = item.getLore();
        
        let weaponDurability = { name: lore[5].split('(')[0],value: Number(lore[5].split('(')[1].split(/\//)[0]), max: Number(lore[5].split('(')[1].split(/\//)[0].split(`)`)[1]) };
        const weaponType = { type: lore[1].split(`(`)[1].split(`)`)[0] };
        const attackPower = { name: lore[6].split('：')[0], value: Number(lore[6].split('：')[1]) };
        const weaponInfo = {命中率: Number(lore[7].split('：')[1].split(`%`)[0]),ドロップ率: Number(lore[8].split('：')[1]), 強化レベル: Number(lore[9].split('：')[1].split(`+`)[1]),使用可能レベル:Number(lore[10].split('：')[1].split(`~`)[0])}
        const weaponEnchants = {enchant1: lore[12].split((/(?<=^[^ ]+?) /))[1] , enchant1: lore[13].split((/(?<=^[^ ]+?) /))[1] , enchant1: lore[14].split((/(?<=^[^ ]+?) /))[1]}
        const weaponSkills = {skill1: lore[15].split((/(?<=^[^ ]+?) /))[1] , skill2: lore[16].split((/(?<=^[^ ]+?) /))[1]}
        lore[5] = `${weaponDurability.name}(${weaponDurability.value - 1}/${weaponDurability.max})`;
        system.run(() => { 
            item.setLore(lore);
            container.setItem(attacker.selectedSlot, item);
            if (weaponDurability.value < 1) container.clearItem(attacker.selectedSlot);
        });
        let zokusei = 1
        let hurtValue = Damage(attackPower.value + attackerAttackPower, weaponInfo.命中率 + hitRate,attackerLevel,suffererLevel,defensePower + playerDefensePower,suffererAvoidance + weaponInfo.強化レベル,zokusei)
        sufferer.dimension.spawnEntity("karo:damage", {x: sufferer.location.x+0.5, y: sufferer.location.y+0.5, z: sufferer.location.z+0.5}).nameTag = `§a${hurtValue}`;

        suffererHealth -= hurtValue;
        setScore(`hp`,sufferer,suffererHealth);
        let xp = getScore(`xp`,sufferer);
        let col = getScore(`money`,sufferer);
        if (suffererHealth <= 0) {
            if (suffererLevel > attackerLevel) xp *= 0.7
                else if(suffererLevel < attackerLevel){
                    attackerLevel -= suffererLevel;
                    if (attackerLevel > 30) xp = 1;
                        else if (attackerLevel > 20) xp /= 4; 
                        else if (attackerLevel > 15) xp /= 2;
            } 
            xp = Math.round(xp)
            if (xp <= 0) xp = 1;
            const attackerID = attacker.getTags().find(x => x.match("ID_")).split(/(?<=^[^_]+?)_/);
            if(attacker.hasTag(`toku`)) attackerID[1] = "情報非公開のプレイヤー";
            const entity = overworld.spawnEntity(
                "karo:message",
                {x: sufferer.location.x, y: sufferer.location.y, z: sufferer.location.z}
            );
            entity.nameTag = `${attackerID[1]}\n${xp}XP\n${col}Col`;
            let j = getScore(`juku${weaponType.value}`,attacker);
            setScore(`juku${weaponType.value}`,attacker,j + 1);
            container.addItem(new ItemStack(MinecraftItemTypes.dirt, xp));
            let money = getScore(`money`,attacker);
            setScore(`money`,attacker,money + col);
            //ドロップアイテムとか今後はここに書く
            const loot = sufferer.getTags().find(x => x.match("loot_")).split(/(?<=^[^_]+?)_/);
            sufferer.runCommandAsync(`loot spawn ~ ~ ~ loot ${loot[1]}`);
            sufferer.runCommandAsync(`kill @s`)
        }
    } else if (attacker && attacker.typeId == "minecraft:player" && sufferer.typeId !== "minecraft:player") {
        let suffererLevel = getScore(`lv`,sufferer), attackerLevel = getScore(`lv`,attacker), damageFactor = 1;

        if(suffererLevel < attackerLevel){
            damageFactor = 1.2
        }
        let hurtValue = Damage(attackerAttackPower, hitRate,attackerLevel,suffererLevel,sufferDefensePower,suffererAvoidance,zokusei)
        if(attack2 < 1){
            attack2 = 1
        }
        attack2 = Math.round(attack2);
        sufferer.dimension.spawnEntity("karo:damage", {x: sufferer.location.x+0.5, y: sufferer.location.y+0.5, z: sufferer.location.z+0.5}).nameTag = `§c${attack2}`;

        let php = getScore(`hp`,sufferer);
        php -= attack2
        setScore(`hp`,sufferer,php)
        //hpが0の場合

        if(php <= 0){
            
            let killer = attacker.nameTag
            var killer2 = killer.split('\n');
            killer2.pop();
            const pn = sufferer.getTags().find(x => x.match("name_")).split(/(?<=^[^_]+?)_/)
            if(sufferer.hasTag(`toku`)) pn[1] = "情報非公開のプレイヤー"
            const de = overworld.spawnEntity(
                "karo:tamasii",
                new Vector(sufferer.location.x, sufferer.location.y,sufferer.location.z)
              );
            de.nameTag = `${pn[1]}`
            world.sendMessage(`§4§lDeath§r\n§l§6LV[Lv.${suffererLevel}]§r ${pn[1]}§r§a§l は§r ${killer2}§r§a§lに倒された`); 
            sufferer.addTag(`death`)
            sufferer.runCommandAsync(`gamemode spectator @s`)
            
        }
    } else if (attacker?.typeId == "minecraft:player" && sufferer?.typeId == "minecraft:player") {
        //武器の取得
        /** @type { Container } */
        const container = attacker.getComponent("inventory").container;
        const item = container.getItem(attacker.selectedSlot);
        const lore = item.getLore();
        
        const attackPower = { name: lore[4].split(':')[0], value: Number(lore[4].split(':')[1]) };
        let weaponDurability = { name: lore[5].split(':')[0], value: Number(lore[5].split(':')[1]) };
        const weaponType = { name: lore[6].split(':')[0], value: lore[6].split(':')[1] };

        if(lore[0] === "§a種類:武器"){

            lore[5] = `${weaponDurability.name}:${weaponDurability.value - 1}`;
            system.run(() => { 
                item.setLore(lore);
                container.setItem(attacker.selectedSlot, item);
                if (weaponDurability.value < 1) container.clearItem(attacker.selectedSlot);
            });
        }
        let hurtValue = (attackPower.value + getScore(`atk`,attacker)) * 200;
        let defensePower = getScore(`def`,sufferer) * 2 + 200;

        hurtValue = Math.round(hurtValue / defensePower / damageFactor);
        if (hurtValue < 1) hurtValue = 1;

        let suffererHealth = getScore(`hp`, sufferer);
        sufferer.dimension.spawnEntity("karo:damage", {x: sufferer.location.x+0.5, y: sufferer.location.y+0.5, z: sufferer.location.z+0.5}).nameTag = `§a${hurtValue}`;
        suffererHealth -= hurtValue;
        setScore(`hp`,sufferer,suffererHealth);
        if(suffererHealth <= 0){
            const pn = sufferer.getTags().find(x => x.match("name_")).split(/(?<=^[^_]+?)_/)
            const tn = attacker.getTags().find(x => x.match("name_")).split(/(?<=^[^_]+?)_/)
            if(sufferer.hasTag(`toku`)) pn[1] = "情報非公開のプレイヤー"
            if(attacker.hasTag(`toku`)) tn[1] = "情報非公開のプレイヤー"
            const de = overworld.spawnEntity(
                "karo:tamasii",
                new Vector({x: sufferer.location.x, y: sufferer.location.y, z: sufferer.location.z})
              );
            de.nameTag = `${pn[1]}`
            sufferer.runCommandAsync(`gamemode spectator @s`)
            world.sendMessage(`§4§lDeath§r\n§l§6LV[Lv.${suffererLevel}]§r ${pn[1]}§r§a§l は§r §l§6LV[Lv.${attackerLevel}]§r ${tn[1]}§r§a§lに倒された`); 
            sufferer.addTag(`death`)
            let j = getScore(`juku${weaponType.value}`,attacker)
            setScore(`juku${weaponType.value}`,attacker, j + 30)
            if(!sufferer.hasTag("killer")){
                attacker.addTag(`killer`)
                let k = getScore(`killc`,attacker)
                setScore(`killc`,attacker,k + 1)
            }
            if(sufferer.hasTag("killer")){
                let kill = getScore(sufferer, `killc`);
                attacker.sendMessage(`§a殺人鬼を倒した！`)
                let m = getScore(`money`,attacker)
                setScore(`money`,attacker,money + (kill * 20))
            }
        }
    } else {
        let hp = getScore(`hp`,sufferer)
        hp -= entityHurt.damage
        setScore(`hp`,sufferer,hp)

        //HPが0の場合
        if(sufferer?.typeId == "minecraft:attacker"){
            if(hp <= 0){
                const pn = sufferer.getTags().find(x => x.match("name_")).split(/(?<=^[^_]+?)_/)
                if(sufferer.hasTag(`toku`)) tn[1] = "情報非公開のプレイヤー"
                const de = overworld.spawnEntity(
                    "karo:tamasii",
                    new Vector({x: sufferer.location.x, y: sufferer.location.y, z: sufferer.location.z})
                  );
                de.nameTag = `${pn[1]}`
                sufferer.runCommandAsync(`gamemode spectator @s`)
                world.sendMessage(`§4§lDeath§r\n§l§6LV[Lv.${suffererLevel}]§r ${pn[1]}§r§a§l は死んだ`);
                sufferer.addTag(`death`)
            }
        }
    }
})


const coordinates = new Map();
world.afterEvents.blockBreak.subscribe(ev => {
    const { brokenBlockPermutation: block , player } = ev;
    
    /** @type { Container} */
    const container = player.getComponent("inventory").container;
    const item = container.getItem(player.selectedSlot) || null;
    if (item && item.typeId === "minecraft:shears") {

        if (!coordinates.has(player.name)) {
            coordinates.set(player.name, block.location);

            player.sendMessage(`始点座標を ${Object.values(block.location).join(" ")} に設定しました。`);

        } else if (coordinates.has(player.name)) {
            player.dimension.fillBlocks(block.location, coordinates.get(player.name), MinecraftBlockTypes.unknown,{matchingBlock: BlockPermutation.resolve(MinecraftBlockTypes.air.id)});
            player.dimension.fillBlocks({ x: block.location.x, y: block.location.y -1, z: block.location.z }, { x: coordinates.get(player.name).x, y: coordinates.get(player.name).y - 1, z: coordinates.get(player.name).z }, MinecraftBlockTypes.stone,{matchingBlock: BlockPermutation.resolve(MinecraftBlockTypes.air.id)});
            coordinates.delete(player.name);
        }
    }
})

/*world.events.beforeItemUseOn.subscribe(ev => {
    const { source } = ev;
    let location = ev.getBlockLocation();
    const block = source.dimension.getBlock(location);
    if(source.hasTag(`admin`)) return
    if(block.typeId == "minecraft:iron_trapdoor" || block.typeId == "minecraft:flower_pot" || block.typeId == "minecraft:crafting_table" || block.typeId == "minecraft:anvil" || block.typeId == "minecraft:trapdoor" || block.typeId == "minecraft:spruce_trapdoor" || block.typeId == "minecraft:birch_trapdoor" || block.typeId == "minecraft:jungle_trapdoor" || block.typeId == "minecraft:acacia_trapdoor" || block.typeId == "minecraft:dark_oak_trapdoor" || block.typeId == "minecraft:crimson_trapdoor" || block.typeId == "minecraft:warped_trapdoor" || block.typeId == "minecraft:mangrove_trapdoor" ) ev.cancel = true
})*/

world.afterEvents.entityHit.subscribe(entityHit => {
    const { entity: player, hitBlock: block, hitEntity: entity } = entityHit;

    if (entity) {
        if (!player.clicks) player.clicks = [];
        player.clicks.push(Date.now());
        player.clicks = player.clicks.filter(v => Date.now() - v <= 1000);

        if (!player.combos) player.combos = [];
        if (Date.now() - Math.max(...player.combos) > 5000 / player.combos.length) player.combos = [];
        player.combos.push(Date.now());

        player.onScreenDisplay.setActionBar(`CPS: ${player.clicks.length}\nCombos: ${player.combos.length}`)
    }

});

function Damage(攻撃力,命中率,攻撃した人のレベル,攻撃された人のレベル,防御力,回避率,属性効果){
    let level = 攻撃された人のレベル / 攻撃した人のレベル
    if(level > 1.4) level = 1.4
    if(level < 0.6) level = 0.6
    let max = (Math.ceil(命中率 / 100) / 10 + (命中率 / 200))
    if(max < 1) max = 1
    let min = (Math.ceil(命中率 / 100) / 10 - (命中率 / 200))
    if(min < 1) min = 1
    let damage = Math.round((攻撃力 * (Math.random() * ( max - min) + min) * level - (防御力 + (回避率 - 命中率))) * 属性効果)
    if(damage < 1) damage = 1
    return damage;
}