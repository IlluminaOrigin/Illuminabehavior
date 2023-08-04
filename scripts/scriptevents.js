import {  world , system , ItemStack, Vector} from "@minecraft/server";
import { getScore } from "getscore.js";
import {Name} from "functions.js"
const dimension = world.getDimension(`overworld`)

let name = ""
let mhp = ""
let thp

system.afterEvents.scriptEventReceive.subscribe(ev => {
    const {id , sourceBlock , message } = ev;
    const ln = sourceBlock?.location
    let sellButton = new ItemStack(`karo:sell`)
    switch(id) {
        //チェスト式換金
        case `karo:sell`:{
            //y座標をチェストの位置にする
            ln.y += 2
            //チェストのコンテナ取得
            let block = dimension.getBlock({x :ln.x , y: ln.y , z: ln.z}).getComponent(`inventory`).container
            //合計金額を0に
            let finalyPrice = 0
            //スロット1~26を参照し空気のところや価格を設定してないアイテムは飛ばし合計金額を出す
            for(let i = 1; i < 27; i++) {
                let item = block.getItem(i)
                if( typeof item == `undefined`) continue;
                const price = item.getLore()
                if( typeof price[0] == `undefined` || price[0] == `` || Number(price[0].split(`:`)[1].replace(`円`,``)) == null) continue;
                finalyPrice += Number(price[0].split(`:`)[1].replace(`円`,``)) * item.amount
            }
            //ケース1 合計が0で売却ボタンを押したとき、何も表示せず売却ボタンをプレイヤーから消す
            if(typeof block.getItem(0) == `undefined` && finalyPrice == 0) {
                dimension.runCommandAsync(`clear @p[x=${ln.x},y=${ln.y},z=${ln.z}] karo:sell`)
                block.setItem(0 , sellButton)
            } else 
            //ケース2 普通に売却ボタンを押したとき、売却メッセージと共に処理
            if (typeof block.getItem(0) == `undefined`) {
                dimension.runCommandAsync(`scoreboard players add @p[x=${ln.x},y=${ln.y},z=${ln.z}] money ${finalyPrice}`)
                dimension.runCommandAsync(`tellraw @p[x=${ln.x},y=${ln.y},z=${ln.z}] {"rawtext":[{"text":"§l§a${finalyPrice}円手に入れた"}]}`)
                dimension.runCommandAsync(`clear @p[x=${ln.x},y=${ln.y},z=${ln.z}] karo:sell`)
                for(let i = 1; i < 27; i++) {
                    let item = block.getItem(i)
                    if( typeof item == `undefined`) continue;
                    const price = item.getLore()
                    if( typeof price[0] == `undefined` || price[0] == `` || Number(price[0].split(`:`)[1].replace(`円`,``)) == null) continue;
                    block.setItem(i)
                }
                block.setItem(0 , sellButton)
            } else
            //ケース3 合計が0円かつ他のアイテムを売却ボタンの位置に置いたときに何も表示せず売却ボタンをプレイヤーから消す
            if(block.getItem(0).typeId !== `karo:sell` && finalyPrice == 0) {
                dimension.runCommandAsync(`clear @p[x=${ln.x},y=${ln.y},z=${ln.z}] karo:sell`)
                const beforeitem = block.getItem(0)
                block.setItem(0 , sellButton)
                block.addItem(beforeitem)

            } else 
            //ケース4 他のアイテムを売却ボタンの位置に置いたときに売却メッセージと共に処理
            if(block.getItem(0).typeId !== `karo:sell`) {
                dimension.runCommandAsync(`scoreboard players add @p[x=${ln.x},y=${ln.y},z=${ln.z}] money ${finalyPrice}`)
                dimension.runCommandAsync(`tellraw @p[x=${ln.x},y=${ln.y},z=${ln.z}] {"rawtext":[{"text":"§l§a${finalyPrice}円手に入れた"}]}`)
                dimension.runCommandAsync(`clear @p[x=${ln.x},y=${ln.y},z=${ln.z}] karo:sell`)
                for(let i = 1; i < 27; i++) {
                    let item = block.getItem(i)
                    if( typeof item == `undefined`) continue;
                    const price = item.getLore()
                    if( typeof price[0] == `undefined` || price[0] == `` || Number(price[0].split(`:`)[1].replace(`円`,``)) == null) continue;
                    block.setItem(i)
                }
                const beforeitem = block.getItem(0)
                block.setItem(0 , sellButton)
                block.addItem(beforeitem)
            } else 
            //ケース5 ボタンが押されなかった場合に合計金額を更新、合計金額が変わらなければ何もせず終了
            if (block.getItem(0).typeId == `karo:sell`) {
                sellButton.setLore([`§l§g合計売却価格:${finalyPrice}円`])
                if (block.getItem(0).getLore().toString() === sellButton.getLore().toString()) break;
                block.setItem(0 , sellButton)
            }
            break;
        }
        case "karo:createItem":{
            let args = message.split(` `)
            const player = world.getPlayers({name: args[0]})[0]
            const item = new ItemStack(args[1])
            if(args[2] !== `undefined`) item.setLore(args[2].replace(/"/g,``).split(`,`))
            if(args[3] !== `undefined`) item.nameTag = args[3]
            player.getComponent(`inventory`).container.addItem(item)
        }
    }
})

system.runInterval((ev)=>{
    for (const entity of dimension.getEntities()) {
        if(getScore(`hp`,entity) === true) continue;
        switch (true) {
            case entity.hasTag("M1"):
            {
                name = "スライム"
                break;
            }
            default:
            {
                name = entity.name
                break;
            }
        }
        let entityScore = getScore(`hp`,entity) / getScore(`maxhp`,entity)
        let str = "";
        let str2 = "■■■■■■■■■■";
        for (let i = 0; i < Math.ceil(entityScore * 10); i++) {
            str += "■";
            str2 = str2.slice(0, -1);
        }
        let c = "";
        if (entityScore > 0.5) {
            c = "§a";
        } else if (entityScore > 0.2) {
            c = "§e";
        } else {
            c = "§c";
        }
        mhp = `\n${c+str}§7${str2}`;
        thp = Math.ceil(entityScore / 0.05);
        if (thp <= 1) thp = 1
        const health = entity.getComponent("health")
        switch (entity.typeId) {
            case "minecraft:armor_stand":
            {
                break;
            }
            case "minecraft:player":
            {
                if (!entity.hasTag(`hatu`)) break;
                const pn = entity.getTags().find(x => x.match("ID_")).split(/(?<=^[^_]+?)_/)
                let atname = "§l§6LV[" + getScore(`lv`,entity) + "] §r" + pn[1]
                if (entity.getTags().find(x => x.match("SYOGOD_"))) atname = entity.getTags().find(x => x.match("SYOGOD_")).split(/(?<=^[^_]+?)_/)[1] + `\n` + atname
                if (entity.hasTag(`toku`)) atname = `§b情報非公開のプレイヤー`
                entity.nameTag = `${atname} ${mhp}`
                health.setCurrentValue(thp)
                const px = getScore(`rx`,entity);
                const py = getScore(`ry`,entity);
                const pz = getScore(`rz`,entity);
                if (entity.hasTag(`death`)) {
                    const location = new Vector(entity.location.x, entity.location.y, entity.location.z)
                    const as2 = dimension.getEntities({
                        location: location,
                        type: "karo:tamasii",
                        name: `${Name(entity.nameTag)}`,
                        closest: 1,
                        maxDistance: 5
                    })
                    if ([...as2].length == 0) {
                        entity.runCommandAsync(`gamemode a @s`)
                        entity.teleport({x: Number(px) + 0.5,y: Number(py) + 0.5,z: Number(pz) + 0.5},{dimension: dimension,rotation:{x:0,y:0},checkForBlocks: false})
                        entity.runCommandAsync(`scoreboard players operation @s hp = @s maxhp`)
                        entity.removeTag(`death`)
                        break;
                    }
                    for (const as of dimension.getEntities({
                        location: location,
                        type: "karo:tamasii",
                        name: `${Name(entity.nameTag)}`,
                        closest: 1,
                        maxDistance: 5
                    })) {
                        entity.teleport(as.location, {dimension: dimension,rotation:{x:0,y:0}})
                    }
                }
                break;
            }
            default:
            {
                if (entity.typeId === "minecraft:item" || entity.typeId === "karo:tamasii" || entity.typeId === "karo:message" || entity.typeId === "minecraft:npc" || entity.typeId === "minecraft:arrow" || entity.typeId === "minecraft:chest_minecart" || entity.typeId === "minecraft:command_block_minecart" || entity.typeId === "minecraft:egg" || entity.typeId === "minecraft:falling_block" || entity.typeId === "minecraft:eye_of_ender_signal" || entity.typeId === "minecraft: evocation_fang" || entity.typeId === "minecraft:fireball" || entity.typeId === "minecraft:fishing_hook" || entity.typeId === "minecraft:firewarks_rocket" || entity.typeId === "minecraft:hopper_minecart" || entity.typeId === "minecraft:ender_pearl" || entity.typeId === "minecraft:lighting_bolt" || entity.typeId === "minecraft:lingering_potion" || entity.typeId === "minecraft:moving_block" || entity.typeId === "minecraft:painting" || entity.typeId === "minecraft:shulker_bullet" || entity.typeId === "minecraft:small_fireball" || entity.typeId === "minecraft:llama_spit" || entity.typeId === "minecraft:minecart" || entity.typeId === "minecraft:splash_potion" || entity.typeId === "minecraft:xp_bottle" || entity.typeId === "minecraft:xp_orb" || entity.typeId === "minecraft:wither_skull_dangerous" || entity.typeId === "minecraft:wither_skull" || entity.typeId === "minecraft:tnt" || entity.typeId === "karo:damage") break;
                const atname = `§l§6LV[${getScore(`lv`,entity)}]§r ${name}`
                entity.nameTag = `${atname} ${mhp}`
                health.setCurrentValue(thp)
                break;
            }
        }
    }
})

system.runInterval(()=>{
    for(const p of world.getPlayers({tags:[`hatu`]})) {
        
            world.scoreboard.getObjective(`nowX`).setScore(p , Math.ceil(p.location.x * 0.31746031746 + 64))
            world.scoreboard.getObjective(`nowZ`).setScore(p , Math.ceil(p.location.z * 0.31746031746 + 64))
    }
    let playersName = []
    for(let i = 0;i < world.getPlayers({tags:[`hatu`]}).length;i++){
        playersName[playersName.length] = world.getPlayers({tags:[`hatu`]})[i].name
    }
    world.getDimension(`overworld`).getPlayers()[0].runCommandAsync(`title @s subtitle "playersList ${playersName.toString()}"`)
},100)