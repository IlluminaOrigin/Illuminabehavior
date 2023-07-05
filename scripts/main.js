import {  world , system , ItemStack, Vector} from "@minecraft/server";
import { getScore } from "getscore2.js";
const dimension = world.getDimension(`overworld`)

let name = ""
let mhp = ""
let thp
system.events.scriptEventReceive.subscribe(ev => {
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
                if( typeof item == 'undefined') continue;
                const price = item.getLore()
                if( typeof price[0] == 'undefined' || price[0] == `` || Number(price[0].split(`:`)[1].replace(`円`,``)) == null) continue;
                finalyPrice += Number(price[0].split(`:`)[1].replace(`円`,``)) * item.amount
            }
            //ケース1 合計が0で売却ボタンを押したとき、何も表示せず売却ボタンをプレイヤーから消す
            if(typeof block.getItem(0) == 'undefined' && finalyPrice == 0) {
                dimension.runCommandAsync(`clear @p[x=${ln.x},y=${ln.y},z=${ln.z}] karo:sell`)
                block.setItem(0 , sellButton)
            } else 
            //ケース2 普通に売却ボタンを押したとき、売却メッセージと共に処理
            if (typeof block.getItem(0) == 'undefined') {
                dimension.runCommandAsync(`scoreboard players add @p[x=${ln.x},y=${ln.y},z=${ln.z}] money ${finalyPrice}`)
                dimension.runCommandAsync(`tellraw @p[x=${ln.x},y=${ln.y},z=${ln.z}] {"rawtext":[{"text":"§l§a${finalyPrice}円手に入れた"}]}`)
                dimension.runCommandAsync(`clear @p[x=${ln.x},y=${ln.y},z=${ln.z}] karo:sell`)
                for(let i = 1; i < 27; i++) {
                    let item = block.getItem(i)
                    if( typeof item == 'undefined') continue;
                    const price = item.getLore()
                    if( typeof price[0] == 'undefined' || price[0] == `` || Number(price[0].split(`:`)[1].replace(`円`,``)) == null) continue;
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
                    if( typeof item == 'undefined') continue;
                    const price = item.getLore()
                    if( typeof price[0] == 'undefined' || price[0] == `` || Number(price[0].split(`:`)[1].replace(`円`,``)) == null) continue;
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
        case "karo:name": {
            for (const entity of dimension.getEntities()) {
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
    
                let entityScore = getScore(entity, 'hp') / getScore(entity, 'maxhp')
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
                            let atname = "§l§6LV[" + getScore(entity, 'lv') + "] §r" + pn[1]
                            if (entity.getTags().find(x => x.match("SYOGOD_"))) atname = entity.getTags().find(x => x.match("SYOGOD_")).split(/(?<=^[^_]+?)_/)[1] + `\n` + atname
                            if (entity.hasTag(`toku`)) atname = `§b情報非公開のプレイヤー`
                           
                            entity.nameTag = `${atname} ${mhp}`
                            health.setCurrent(thp)
                            const px = getScore(entity, 'rx');
                            const py = getScore(entity, 'ry');
                            const pz = getScore(entity, 'rz');
                            if (entity.hasTag(`death`)) {
                                if (entity.hasTag(`toku`)) pn[1] = `情報非公開のプレイヤー`
                                const location = new Vector(entity.location.x, entity.location.y, entity.location.z)
                                const as2 = dimension.getEntities({
                                    location: location,
                                    type: "karo:tamasii",
                                    name: `${pn[1]}`,
                                    closest: 1,
                                    maxDistance: 5
                                })
                                if ([...as2].length == 0) {
                                    entity.runCommandAsync(`gamemode a @s`)
                                    entity.teleport({
                                        x: Number(px) + 0.5,
                                        y: Number(py) + 0.5,
                                        z: Number(pz) + 0.5
                                    }, dimension, 0, 0, false)
                                    entity.runCommandAsync(`scoreboard players operation @s hp = @s maxhp`)
                                    entity.removeTag(`death`)
                                    break;
                                }
    
                                for (const as of dimension.getEntities({
                                        location: location,
                                        type: "karo:tamasii",
                                        name: `${pn[1]}`,
                                        closest: 1,
                                        maxDistance: 5
                                    })) {
                                    entity.teleport(as.location, dimension, 0, 0, false)
                                }
                            }
                            break;
                        }
                    default:
                        {
                            if (entity.typeId === "minecraft:item" || entity.typeId === "karo:tamasii" || entity.typeId === "karo:message" || entity.typeId === "minecraft:npc" || entity.typeId === "minecraft:arrow" || entity.typeId === "minecraft:chest_minecart" || entity.typeId === "minecraft:command_block_minecart" || entity.typeId === "minecraft:egg" || entity.typeId === "minecraft:falling_block" || entity.typeId === "minecraft:eye_of_ender_signal" || entity.typeId === "minecraft: evocation_fang" || entity.typeId === "minecraft:fireball" || entity.typeId === "minecraft:fishing_hook" || entity.typeId === "minecraft:firewarks_rocket" || entity.typeId === "minecraft:hopper_minecart" || entity.typeId === "minecraft:ender_pearl" || entity.typeId === "minecraft:lighting_bolt" || entity.typeId === "minecraft:lingering_potion" || entity.typeId === "minecraft:moving_block" || entity.typeId === "minecraft:painting" || entity.typeId === "minecraft:shulker_bullet" || entity.typeId === "minecraft:small_fireball" || entity.typeId === "minecraft:llama_spit" || entity.typeId === "minecraft:minecart" || entity.typeId === "minecraft:splash_potion" || entity.typeId === "minecraft:xp_bottle" || entity.typeId === "minecraft:xp_orb" || entity.typeId === "minecraft:wither_skull_dangerous" || entity.typeId === "minecraft:wither_skull" || entity.typeId === "minecraft:tnt" || entity.typeId === "karo:damage") break;
                            const atname = `§l§6LV[${getScore(entity, 'lv')}]§r ${name}`
                            entity.nameTag = `${atname} ${mhp}`
                            break;
                        }
                }
            }
            break;
        }
    }
})

world.afterEvents.blockBreak.subscribe((ev) => {
    const { brokenBlockPermutation , player } = ev;
    if(player.hasTag(`testt`) && brokenBlockPermutation.hasTag(`log`)) {
        player.sendMessage(`木を壊した`);
    }
})

world.beforeEvents.chatSend.subscribe((ev) => {
    const {sender , message} = ev;
    ev.sendToTargets = true
    switch(true) {
        case message.startsWith(`!name`): world.sendMessage(`${sender.nameTag}`); break;
        case message.startsWith(`!item`): {
            sender.sendMessage(`${JSON.stringify(sender.getTags())}`)
            sender.runCommandAsync(`title @s subtitle "[{\"text\":\"${sender.name.replace(/"/,/\"/)}\"},{\"tekitou\":\"zzz\"}]"`)
            break;
        }
        case message.startsWith(`!saveitem`): {
            let lore = ``
            for(let i = 0;i < sender.getComponent('minecraft:inventory').container.getSlot(sender.selectedSlot).getLore().length;i++){
                if(i === 0) lore = `${lore}${sender.getComponent('minecraft:inventory').container.getSlot(sender.selectedSlot).getLore()[0]}`
                if(i > 0) lore = `${lore},${sender.getComponent('minecraft:inventory').container.getSlot(sender.selectedSlot).getLore()[i]}`
            }
            sender.runCommandAsync(`title @s subtitle "{\"saveItem\":{\"typeId\":\"${sender.getComponent('minecraft:inventory').container.getSlot(sender.selectedSlot).typeId}\",\"setLore\":[\"${lore}\"],\"itemname\":\"${sender.getComponent('minecraft:inventory').container.getSlot(sender.selectedSlot).nameTag}\"}}"`)
            break;
        }
        case message.startsWith(`!createitem`): sender.runCommandAsync(`title ${message.split(` `)[2]} subtitle "createItem ${message.split(` `)[1]} ${sender.name}"`); break;
        default : {
            if(message.startsWith(`!`)) break;
            if(sender.hasTag(`toku`)) {
                world.sendMessage(`§b情報非公開のプレイヤー §r: ${message}`);
                break;
            }
            if(sender.hasTag(`killer`)){
                world.sendMessage(`§c${rename(sender.nameTag)} §r: ${message}`);
                break;
            } 
            if(!sender.hasTag(`killer`)){
                world.sendMessage(`§a${rename(sender.nameTag).replace()} §r: ${message}`);
                break;
            } 

        }

    }
})

function rename(playersName){
    let p4 = []
    let p = playersName.split(/\n/)
    if(p.length > 2) p.shift()
    for(let i = 0;i < p.length - 1;i++){
      if(i > 0) p4 += ` `
      let p2 = p[i].split(`§`)
      for(let i2 = 0;i2 < p2.length;i2++){
        let p3 = p2[i2].substr(1,p2[i2].length)
        p4 += p3
      }
    }
    if(p4.length === 0) p4[0] = playersName
    const p6 = p4.toString()
    return p6;
  } 

world.afterEvents.entityHit.subscribe((ev) => {
    const {entity , hitBlock , hitEntity} = ev;
    if(!entity.hasTag(`combo`)) return;
    if(hitBlock){
        world.sendMessage(`a`)
    }
})

world.beforeEvents.dataDrivenEntityTriggerEvent.subscribe(ev=>{
    const { id, entity } = ev;
    if(id == `minecraft:crystal_explode`) {
        world.sendMessage(`aaa`)
        ev.cancel = true;
    }
})

world.afterEvents.itemStartUseOn.subscribe((ev) => {
    world.sendMessage(`bbb`)
})

world.afterEvents.itemStartCharge.subscribe((ev) => {
    world.sendMessage(`ddd`)
})