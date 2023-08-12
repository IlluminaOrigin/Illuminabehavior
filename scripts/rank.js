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
let lvObj = new Object
world.afterEvents.playerSpawn.subscribe((ev)=>{
    if(ev.initialSpawn && first === 0) {
        
        lvObj = `${JSON.parse(world.getDynamicProperty('lvObject'))}`
        first = 1
    }    
})

system.runInterval(()=>{
    if(!world.getDimension(`overworld`).getEntities({tags: [`LvRank`]})[0]) return;
    for(const p of world.getAllPlayers()){
        let playerLv= {[p.name]: p.level}
        lvObj = Object.assign({}, lvObj, playerLv);
    }
    world.setDynamicProperty(`lvObject`,`${JSON.stringify(lvObj)}`)
    const dataArray = Object.entries(lvObj).sort((a, b) => b[1] - a[1]);

    let rankName = `§6Lvランキング`
    // 上位10個を抽出して整形して表示
    for (let i = 0; i < Math.min(Object.keys(lvObj).length, 10); i++) {
        const entry = dataArray[i];
        rankName += `\n§a${i + 1}位 §r${entry[0]} §r: ${entry[1]}`
    }
    for (const entity of world.getDimension(`overworld`).getEntities({tags: [`LvRank`]})) {
        entity.nameTag = rankName
    }
},200)