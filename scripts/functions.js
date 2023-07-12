export function rename(playersName){
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

export function ItemLock(player){
    if(!player.getComponent(`inventory`).container.getSlot(player.selectedSlot)) return;
    let lock = player.getComponent(`inventory`).container.getSlot(player.selectedSlot).lockMode
    if(lock === `inventory`) {
        lock.none
    } else if(lock === `none`) {
        lock.inventory
    }
}

export function Lore(ItemStack, 武器種, 相場価格, 等級, 耐久値, 攻撃力, 命中率, ドロップ率, 強化レベル, 使用可能レベル, 属性) {
    return ItemStack.setLore([ `§l§s===============`, `§l§p- §f種類:武器(${武器種})`, `§l§p- §f相場価格:${相場価格}円`, `§l§p- §f等級:${等級}`, `§l§p- §f属性:${属性}`, `§l§t---------------`, `§l§u- §f耐久値:(${耐久値}/${耐久値})`, `§l§u- §f攻撃力:${攻撃力}`, `§l§u- §f命中率:${命中率}%`, `§l§u- §fドロップ率:${ドロップ率}`, `§l§u- §f強化レベル:+${強化レベル}`, `§l§u- §f使用可能レベル:Lv.${使用可能レベル}`,`§l§t---------------`, `§l§m- §f<エンチャント1>`, `§l§m- §f<エンチャント2>`, `§l§m- §f<エンチャント3>`, `§l§q- §f<スキルスロット1>`, `§l§q- §f<スキルスロット2>`, ``, `§l§s===============` ])
}

export function Damage(攻撃力,命中率,攻撃した人のレベル,攻撃された人のレベル,防御力,回避率,属性効果){
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

export function Name(playersName){
    let p4 = []
    let p = playersName.split(/\n/)
    if(p.length >= 3) return p[1];
    for(let i = 0;i < p.length - 1;i++){
      if(i > 0) p4 += `\n`
    }
    if(p4.length === 0) p4[0] = playersName
    const p6 = p4.toString()
    return p6;
}