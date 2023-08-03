import { system, world, ItemStack, Vector, Container, ItemTypes,EquipmentSlot, MinecraftItemTypes, BlockType, MinecraftBlockTypes, BlockPermutation, MinecraftEntityTypes, EntityEquipmentInventoryComponent } from "@minecraft/server";
import { getScore,setScore } from "getscore.js";
import { Damage,Name } from "functions.js";
const overworld = world.getDimension('overworld')
const weaponNumbers = {短剣: [1 , "tanken"],長剣: [2 , "tyouken"],杖:[3 , "tue"],槍:[4 , "yari"],斧:[5 , "斧"]}
const zokuseiNumber = {1:[2,7,"炎"],2:[3,1,"木"],3:[4,2,"雷"],4:[5,3,"水"],5:[6,4,"土"],6:[7,5,"闇"],7:[1,6,"無"]}
const zokuseiType = {"§c炎":[2,1,"炎"],"§a木":[3,2,"木"],"§e雷":[4,3,"雷"],"§b水":[5,4,"水"],"§g土":[6,5,"土"],"§1闇":[7,6,"闇"],"§7無":[1,7,"無"]}

//ダメージをエンティティが受けた時に発火
world.afterEvents.entityHurt.subscribe(entityHurt => { 
    //攻撃者、被ダメ者、ダメージ値、原因を取得
    let { damageSource, hurtEntity: sufferer, damage } = entityHurt;
    let { damagingEntity: attacker ,cause} = damageSource;
    let suffererHealth = getScore(`hp`, sufferer);
    let suffererDefensePower = getScore(`def`,sufferer)
    let suffererMagicDefensePower = getScore(`mdef`,sufferer)
    let suffererName = Name(sufferer.nameTag)
    if(!attacker) {
        suffererHealth -= damage*10
        setScore(`hp`,sufferer,suffererHealth)
        if(sufferer?.typeId === "minecraft:player" && suffererHealth <= 0){
            if(sufferer.hasTag(`toku`)) tn[1] = "情報非公開のプレイヤー"
            const de = overworld.spawnEntity(
                "karo:tamasii",
                new Vector({x: sufferer.location.x , y: sufferer.location.y, z: sufferer.location.z})
              );
            de.nameTag = `${suffererName}`
            sufferer.runCommandAsync(`gamemode spectator @s`)
            world.sendMessage(`§4§lDeath§r\n${suffererName}§r§a§l は死んだ`);
            sufferer.addTag(`death`)
        } else if(suffererHealth <= 0){
            sufferer.runCommandAsync(`kill @s`)
        }
    }

    if(!attacker || !sufferer) return;
    if(attacker.typeId === `minecraft:player` && (!attacker.getComponent(`inventory`).container.getItem(attacker.selectedSlot) || !attacker.getComponent(`inventory`).container.getItem(attacker.selectedSlot).getLore()[1] || !attacker.getComponent(`inventory`).container.getItem(attacker.selectedSlot).getLore()[1].split(`:`)[1].startsWith(`武器`))) return
    let attackerName = Name(attacker.nameTag)
    let suffererLevel = getScore(`lv`,sufferer);
    let attackerLevel = getScore(`lv`,attacker);
    let attackerHealth = getScore(`hp`, attacker);
    let attackerAttackPower = getScore(`atk`,attacker)
    let attackerMagicAttackPower = getScore(`matk`,attacker)
    let hitRate = getScore(`hit`,attacker)
    let suffererAvoidance = getScore(`agi`,sufferer)
    let attackerZokuseiType = getScore(`zokusei`,attacker)
    let suffererZokuseiType = getScore(`zokusei`,sufferer)
    let head = sufferer.getComponent(EntityEquipmentInventoryComponent.componentId).getEquipment(EquipmentSlot.head)
    let chest = sufferer.getComponent(EntityEquipmentInventoryComponent.componentId).getEquipment(EquipmentSlot.chest)
    let legs = sufferer.getComponent(EntityEquipmentInventoryComponent.componentId).getEquipment(EquipmentSlot.legs)
    let feet = sufferer.getComponent(EntityEquipmentInventoryComponent.componentId).getEquipment(EquipmentSlot.feet)
    let suffererOffhand = sufferer.getComponent(EntityEquipmentInventoryComponent.componentId).getEquipment(EquipmentSlot.offhand)
    let attackerOffhand = attacker.getComponent(EntityEquipmentInventoryComponent.componentId).getEquipment(EquipmentSlot.offhand)
    let equipments = [head , chest , legs , feet ]
    let defensePower = 0

    //防具処理
    /** 
    * @type { MC.EntityEquipmentInventoryComponent } 
    */
    let playerEquipment = ev.deadEntity.getComponent(`equipment_inventory`)
    const slotNames = ["chest" , "head" , "feet" , "legs" , "offhand"]
    for(let i = 0; i < 5;i++) {
        if(typeof playerEquipment.getEquipment(slotNames[i]) === 'undefined') continue;
        MC.world.getDimension(`overworld`).spawnItem(playerEquipment.getEquipment(slotNames[i]),ev.deadEntity.location)
    }

    //プレイヤーがプレイヤー以外に攻撃
    if (attacker?.typeId === "minecraft:player" && sufferer?.typeId !== "minecraft:player") {

        //武器の取得
        /** 
         * @type { Container } 
        */
        const container = attacker.getComponent("inventory").container;
        const item = container.getItem(attacker.selectedSlot);
        const lore = item.getLore();
        let weaponZokusei = lore[4].split(`:`)[1]
        let weaponDurability = { name: lore[6].split('(')[0],value: Number(lore[6].split('(')[1].split(/\//)[0]), max: Number(lore[6].split('(')[1].split(/\//)[1].split(`)`)[0]) };
        const weaponType = { type: lore[1].split(`(`)[1].split(`)`)[0] };
        const attackPower = { name: lore[7].split(':')[0], value: Number(lore[7].split(':')[1]) };
        const weaponInfo = {命中率: Number(lore[8].split(':')[1].split(`%`)[0]),ドロップ率: Number(lore[9].split(':')[1]), 強化レベル: Number(lore[10].split(':')[1].split(`+`)[1]),使用可能レベル:Number(lore[11].split(':')[1].split(`~`)[0])}
        const weaponEnchants = {enchant1: lore[13].split((/(?<=^[^ ]+?) /))[1] , enchant1: lore[14].split((/(?<=^[^ ]+?) /))[1] , enchant1: lore[15].split((/(?<=^[^ ]+?) /))[1]}
        const weaponSkills = {skill1: lore[16].split((/(?<=^[^ ]+?) /))[1] , skill2: lore[17].split((/(?<=^[^ ]+?) /))[1]}
        lore[6] = `${weaponDurability.name}(${weaponDurability.value - 1}/${weaponDurability.max})`;
        system.run(() => { 
            item.setLore(lore);
            container.setItem(attacker.selectedSlot, item);
            if (weaponDurability.value < 1) container.setItem(attacker.selectedSlot);
        });
        let zokusei = 1
        //属性効果
        if(suffererZokuseiType === zokuseiType[weaponZokusei][0]) zokusei = 1.2
        if(zokuseiType[weaponZokusei][1] === zokuseiNumber[suffererZokuseiType][1]) zokusei = 0.8
        let hurtValue = Damage(attackPower.value + attackerAttackPower, weaponInfo.命中率 + hitRate,attackerLevel,suffererLevel,defensePower + suffererDefensePower,suffererAvoidance + weaponInfo.強化レベル,zokusei)
        sufferer.dimension.spawnEntity("karo:damage", {x: sufferer.location.x+(Math.random() * (1.1 - -1.1) + -1.1), y: sufferer.location.y+(Math.random() * (1.1 - -1.1) + -1.1), z: sufferer.location.z+(Math.random() * (1.1 - -1.1) + -1.1)}).nameTag = `§a${hurtValue}`;
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
            const entity = overworld.spawnEntity("karo:message",{x: sufferer.location.x, y: sufferer.location.y, z: sufferer.location.z}).nameTag = `${attackerName}\nXP: +${xp}\nMoney: +${col}`;
            let j = getScore(`${weaponNumbers[weaponType.type][1]}`,attacker);
            setScore(`${weaponNumbers[weaponType.type][1]}`,attacker,j + 1);
            let hasxp = getScore(`hasxp`,attacker);
            setScore(`hasxp`,attacker,hasxp + xp);
            let money = getScore(`money`,attacker);
            setScore(`money`,attacker,money + col);
            //ドロップアイテムとか今後はここに書く
            const loot = sufferer.getTags().find(x => x.match("loot_")).split(/(?<=^[^_]+?)_/);
            sufferer.runCommandAsync(`loot spawn ~ ~ ~ loot ${loot[1]}`);
            sufferer.runCommandAsync(`kill @s`)
        }
    } else if (attacker && attacker.typeId !== "minecraft:player" && sufferer.typeId == "minecraft:player") {

        //属性効果
        let zokusei = 1
        if(suffererZokuseiType === zokuseiNumber[attackerZokuseiType][0]) zokusei = 1.2
        if(suffererZokuseiType === zokuseiNumber[attackerZokuseiType][1]) zokusei = 0.8
        let hurtValue = Damage(attackerAttackPower, hitRate,attackerLevel,suffererLevel,suffererDefensePower + defensePower,suffererAvoidance,zokusei)
        //防具エンチャント
        sufferer.dimension.spawnEntity("karo:damage", {x: sufferer.location.x + (Math.random() * (1.1 - -1.1) + -1.1) , y: sufferer.location.y+ (Math.random() * (1.1 - -1.1) + -1.1), z: sufferer.location.z+ (Math.random() * (1.1 - -1.1) + -1.1)}).nameTag = `§c${hurtValue}`;
        suffererHealth -= hurtValue
        setScore(`hp`,sufferer,suffererHealth)
        //hpが0の場合
        if(suffererHealth <= 0){
            if(sufferer.hasTag(`toku`)) suffererName = "情報非公開のプレイヤー"
            const de = overworld.spawnEntity(
                "karo:tamasii",
                new Vector(sufferer.location.x, sufferer.location.y + 1,sufferer.location.z)
              );
            de.nameTag = `${suffererName}`
            world.sendMessage(`§4§lDeath§r\n${suffererName}§r§a§l は§r ${attackerName}§r§a§lに倒された`); 
            sufferer.addTag(`death`)
            sufferer.runCommandAsync(`gamemode spectator @s`)
        }
    } else if (attacker?.typeId == "minecraft:player" && sufferer?.typeId == "minecraft:player") {
        //武器の取得
        /** 
         * @type { Container } 
        */
        const container = attacker.getComponent("inventory").container;
        const item = container.getItem(attacker.selectedSlot);
        const lore = item.getLore();
        
        let weaponDurability = { name: lore[6].split('(')[0],value: Number(lore[6].split('(')[1].split(/\//)[0]), max: Number(lore[6].split('(')[1].split(/\//)[1].split(`)`)[0]) };
        const weaponType = { type: lore[1].split(`(`)[1].split(`)`)[0] };
        const attackPower = { name: lore[7].split(':')[0], value: Number(lore[7].split(':')[1]) };
        const weaponInfo = {命中率: Number(lore[8].split(':')[1].split(`%`)[0]),ドロップ率: Number(lore[9].split(':')[1]), 強化レベル: Number(lore[10].split(':')[1].split(`+`)[1]),使用可能レベル:Number(lore[11].split(':')[1].split(`~`)[0])}
        const weaponEnchants = {enchant1: lore[13].split((/(?<=^[^ ]+?) /))[1] , enchant1: lore[14].split((/(?<=^[^ ]+?) /))[1] , enchant1: lore[15].split((/(?<=^[^ ]+?) /))[1]}
        const weaponSkills = {skill1: lore[16].split((/(?<=^[^ ]+?) /))[1] , skill2: lore[17].split((/(?<=^[^ ]+?) /))[1]}
        lore[6] = `${weaponDurability.name}(${weaponDurability.value - 1}/${weaponDurability.max})`;
        system.run(() => { 
            item.setLore(lore);
            container.setItem(attacker.selectedSlot, item);
            if (weaponDurability.value < 1) container.clearItem(attacker.selectedSlot);
        });
        let zokusei = 1
        //属性効果演算を書く


        let hurtValue = Damage(attackPower.value + attackerAttackPower, weaponInfo.命中率 + hitRate,attackerLevel,suffererLevel,defensePower + suffererDefensePower,suffererAvoidance + weaponInfo.強化レベル,zokusei)
        //エンチャントとかの処理


        sufferer.dimension.spawnEntity("karo:damage", {x: sufferer.location.x+(Math.random() * (1.1 - -1.1) + -1.1), y: sufferer.location.y+(Math.random() * (1.1 - -1.1) + -1.1), z: sufferer.location.z+(Math.random() * (1.1 - -1.1) + -1.1)}).nameTag = `§a${hurtValue}`;
        suffererHealth -= hurtValue;
        setScore(`hp`,sufferer,suffererHealth);
        if(suffererHealth <= 0){
            const pn = sufferer.getTags().find(x => x.match("name_")).split(/(?<=^[^_]+?)_/)
            const tn = attacker.getTags().find(x => x.match("name_")).split(/(?<=^[^_]+?)_/)
            if(sufferer.hasTag(`toku`)) pn[1] = "情報非公開のプレイヤー"
            if(attacker.hasTag(`toku`)) tn[1] = "情報非公開のプレイヤー"
            const de = overworld.spawnEntity("karo:tamasii", new Vector({x: sufferer.location.x, y: sufferer.location.y + 1, z: sufferer.location.z}))
            de.nameTag = `${suffererName}`
            sufferer.runCommandAsync(`gamemode spectator @s`)
            world.sendMessage(`§4§lDeath§r\n${suffererName}§r§a§l は§r ${attackerName}§r§a§lに倒された`); 
            sufferer.addTag(`death`)
            let j = getScore(`${weaponNumbers[weaponType.type][1]}`,attacker)
            setScore(`${weaponNumbers[weaponType.type][1]}`,attacker, j + 30)
            if(!sufferer.hasTag("killer")){
                attacker.addTag(`killer`)
                let k = getScore(`killc`,attacker)
                setScore(`killc`,attacker,k + 1)
            }
            if(sufferer.hasTag("killer")){
                let kill = getScore(sufferer, `killc`);
                attacker.sendMessage(`§a殺人鬼を倒した!`)
                let money = getScore(`money`,attacker)
                setScore(`money`,attacker,money + (kill * 20))
            }
        }
    } 
})


/*const coordinates = new Map();
world.afterEvents.blockBreak.subscribe(ev => {
    const { brokenBlockPermutation: block , player } = ev;
    
    /** @type { Container} */ /*
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
*/


world.afterEvents.entityHitEntity.subscribe(entityHit => {
    const { damagingEntity: player , hitEntity: entity } = entityHit;
    if(player.typeId !== `minecraft:player`) return;
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