import { world , DynamicPropertiesDefinition , system} from '@minecraft/server';

//DynamicPropertyの登録
world.afterEvents.worldInitialize.subscribe(({ propertyRegistry }) => {
  const property = new DynamicPropertiesDefinition();
  /* 文字列用 最大文字数: world = 1MB, entity = 128KB */
  property.defineString('lvObject', 1000000, '{}');
  /* worldに登録 */
  propertyRegistry.registerWorldDynamicProperties(property);
})

let first = 0
let lvObj = new Object()
system.runTimeout(()=>{
    if(first === 0) {
        world.sendMessage(`${world.getDynamicProperty(`lvObject`)}`)
        lvObj = JSON.parse(world.getDynamicProperty('lvObject'))
    }
},20)

world.afterEvents.playerSpawn.subscribe((ev)=>{
    if(ev.initialSpawn && first === 0) {
        world.sendMessage(`LVダイプロ\n${world.getDynamicProperty(`lvObject`)}`)
        lvObj = JSON.parse(world.getDynamicProperty('lvObject'))
        first = 1
    }    
})

system.runInterval(()=>{
    if(!world.getDimension(`overworld`).getEntities({tags: [`LvRank`]})[0]) return;
    for(const p of world.getPlayers({tags:[`hatu`]})){
        if(p.hasTag(`toku`)) {
            world.sendMessage(`消しました`)
            delete lvObj[RawName(p.nameTag)]
            continue;
        }
        let playerLv= {[RawName(p.nameTag)]: world.scoreboard.getObjective(`lv`).getScore(p)}
        world.sendMessage(`${p.nameTag}`)
        lvObj = Object.assign({}, lvObj, playerLv);
    }
    system.runTimeout(()=>{
        world.setDynamicProperty(`lvObject`,`${JSON.stringify(lvObj)}`)
        const dataArray = Object.entries(lvObj).sort((a, b) => b[1] - a[1]);

        let rankName = `§6Lvランキング`
        // 上位10個を抽出して整形して表示
        for (let i = 0; i < Math.min(dataArray.length, 10); i++) {
            const entry = dataArray[i];
            rankName += `\n§a${i + 1}位 §r${entry[0]} §r: ${entry[1]}`
        }
        for (const entity of world.getDimension(`overworld`).getEntities({tags: [`LvRank`]})) {
            entity.nameTag = rankName
        }
    },5)
},200)

function RawName(playersName){
    let p4 = []
    let p = playersName.split(/\n/)
    if(p.length > 2) p.shift()
    let raw =  p[0].split(/(?<=^[^ ]+?) /)[1]
    return raw;
} 