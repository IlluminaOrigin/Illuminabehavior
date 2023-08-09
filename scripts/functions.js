import { world , Container, ItemLockMode,system, ItemStack } from '@minecraft/server'
import * as UI from "@minecraft/server-ui"

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

export function ChatRename(playersName){
    let p4 = []
    let p = playersName.split(/\n/)
    if(p.length > 2) p.shift()
    for(let i = 0;i < p.length - 1;i++){
      if(i > 0) p4 += ` `
      p4 += p[i]
      /*let p2 = p[i].split(`§`)
      for(let i2 = 0;i2 < p2.length;i2++){
        let p3 = p2[i2].substr(1,p2[i2].length)
        p4 += p3
      }*/
    }
    if(p4.length === 0) p4[0] = playersName
    const p6 = p4.toString()
    return p6;
} 

/**
 * 
 * @param {import('@minecraft/server').Player} player 
 * @returns 
 */
export function ItemLock(player){
    if(!player.getComponent(`inventory`).container.getItem(player.selectedSlot)) return;
/**
 * @type { Container } container  
 */
    let container = player.getComponent(`inventory`).container
    let item = container.getItem(player.selectedSlot)
    if(item.lockMode === `inventory`) {
        system.run(()=>{item.lockMode = `none`})
    } else if(item.lockMode === `none`) {
        system.run(()=>{item.lockMode = `inventory`})
    }
    system.run(()=>{container.setItem(player.selectedSlot,item)})
}

export function Lore(ItemStack, 武器種, 相場価格, 等級, 耐久値, 攻撃力, 命中率, ドロップ率, 強化レベル, 使用可能レベル, 属性) {
    return ItemStack.setLore([ `§l§s===============`, `§l§p- §f種類:武器(${武器種})`, `§l§p- §f相場価格:${相場価格}円`, `§l§p- §f等級:${等級}`, `§l§p- §f属性:${属性}`, `§l§t---------------`, `§l§u- §f耐久値:(${耐久値}/${耐久値})`, `§l§u- §f攻撃力:${攻撃力}`, `§l§u- §f命中率:${命中率}%`, `§l§u- §fドロップ率:${ドロップ率}`, `§l§u- §f強化レベル:+${強化レベル}`, `§l§u- §f使用可能レベル:Lv.${使用可能レベル}`,`§l§t---------------`, `§l§m- §f<エンチャント1>`, `§l§m- §f<エンチャント2>`, `§l§m- §f<エンチャント3>`, `§l§q- §f<スキルスロット1>`, `§l§q- §f<スキルスロット2>`, ``, `§l§s===============` ])
}

export function Damage(攻撃力,命中率,攻撃した人のレベル,攻撃された人のレベル,防御力,回避率,属性効果){
    let level = 攻撃された人のレベル / 攻撃した人のレベル
    if(level > 1.4) level = 1.4
    if(level < 0.6) level = 0.6
    let max = (Math.ceil(命中率 / 100) * 4 + (命中率 / 200))
    if(max < 1.5) max = 1.5
    let min = (Math.ceil(命中率 / 100) / 2 - (命中率 / 200))
    if(min < 0.5) min = 0.5
    let damage = Math.round(((攻撃力 + (Math.random() * ( max - min) + min)) * level - (防御力 + (回避率 - 命中率))) * 属性効果)
    if(damage < 1) damage = 1
    return damage;
}

/**
 * @param {string} playerName 
 * @returns 
 */
export function Name(playerName){
    let returnName = ``
    let p = playerName.split(/\n/)
    for(let i = 0;i < p.length - 1;i++){
        returnName += p[i]
        if(i < p.length - 2) returnName += `\n`
    }
    return returnName
}

const tree = {
    a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お',
    k: {
        a: 'か', i: 'き', u: 'く', e: 'け', o: 'こ',
        y: { a: 'きゃ', i: 'きぃ', u: 'きゅ', e: 'きぇ', o: 'きょ' },
    },
    s: {
        a: 'さ', i: 'し', u: 'す', e: 'せ', o: 'そ',
        h: { a: 'しゃ', i: 'し', u: 'しゅ', e: 'しぇ', o: 'しょ' },
        y: { a: 'しゃ', i: 'し', u: 'しゅ', e: 'しぇ', o: 'しょ' },
    },
    t: {
        a: 'た', i: 'ち', u: 'つ', e: 'て', o: 'と',
        h: { a: 'てゃ', i: 'てぃ', u: 'てゅ', e: 'てぇ', o: 'てょ' },
        y: { a: 'ちゃ', i: 'ちぃ', u: 'ちゅ', e: 'ちぇ', o: 'ちょ' },
        s: { a: 'つぁ', i: 'つぃ', u: 'つ', e: 'つぇ', o: 'つぉ' },
    },
    c: {
        a: 'か', i: 'し', u: 'く', e: 'せ', o: 'こ',
        h: { a: 'ちゃ', i: 'ち', u: 'ちゅ', e: 'ちぇ', o: 'ちょ' },
        y: { a: 'ちゃ', i: 'ちぃ', u: 'ちゅ', e: 'ちぇ', o: 'ちょ' },
    },
    q: {
        a: 'くぁ', i: 'くぃ', u: 'く', e: 'くぇ', o: 'くぉ',
    },
    n: {
        a: 'な', i: 'に', u: 'ぬ', e: 'ね', o: 'の', n: 'ん',
        y: { a: 'にゃ', i: 'にぃ', u: 'にゅ', e: 'にぇ', o: 'にょ' },
    },
    h: {
        a: 'は', i: 'ひ', u: 'ふ', e: 'へ', o: 'ほ',
        y: { a: 'ひゃ', i: 'ひぃ', u: 'ひゅ', e: 'ひぇ', o: 'ひょ' },
    },
    f: {
        a: 'ふぁ', i: 'ふぃ', u: 'ふ', e: 'ふぇ', o: 'ふぉ',
        y: { a: 'ふゃ', u: 'ふゅ', o: 'ふょ' },
    },
    m: {
        a: 'ま', i: 'み', u: 'む', e: 'め', o: 'も',
        y: { a: 'みゃ', i: 'みぃ', u: 'みゅ', e: 'みぇ', o: 'みょ' },
    },
    y: { a: 'や', i: 'い', u: 'ゆ', e: 'いぇ', o: 'よ' },
    r: {
        a: 'ら', i: 'り', u: 'る', e: 'れ', o: 'ろ',
        y: { a: 'りゃ', i: 'りぃ', u: 'りゅ', e: 'りぇ', o: 'りょ' },
    },
    w: { a: 'わ', i: 'うぃ', u: 'う', e: 'うぇ', o: 'を' },
    g: {
        a: 'が', i: 'ぎ', u: 'ぐ', e: 'げ', o: 'ご',
        y: { a: 'ぎゃ', i: 'ぎぃ', u: 'ぎゅ', e: 'ぎぇ', o: 'ぎょ' },
    },
    z: {
        a: 'ざ', i: 'じ', u: 'ず', e: 'ぜ', o: 'ぞ',
        y: { a: 'じゃ', i: 'じぃ', u: 'じゅ', e: 'じぇ', o: 'じょ' },
    },
    j: {
        a: 'じゃ', i: 'じ', u: 'じゅ', e: 'じぇ', o: 'じょ',
        y: { a: 'じゃ', i: 'じぃ', u: 'じゅ', e: 'じぇ', o: 'じょ' },
    },
    d: {
        a: 'だ', i: 'ぢ', u: 'づ', e: 'で', o: 'ど',
        h: { a: 'でゃ', i: 'でぃ', u: 'でゅ', e: 'でぇ', o: 'でょ' },
        y: { a: 'ぢゃ', i: 'ぢぃ', u: 'ぢゅ', e: 'ぢぇ', o: 'ぢょ' },
    },
    b: {
        a: 'ば', i: 'び', u: 'ぶ', e: 'べ', o: 'ぼ',
        y: { a: 'びゃ', i: 'びぃ', u: 'びゅ', e: 'びぇ', o: 'びょ' },
    },
    v: {
        a: 'ゔぁ', i: 'ゔぃ', u: 'ゔ', e: 'ゔぇ', o: 'ゔぉ',
        y: { a: 'ゔぁ', i: 'ゔぃ', u: 'ゔゅ', e: 'ゔぇ', o: 'ゔょ' },
    },
    p: {
        a: 'ぱ', i: 'ぴ', u: 'ぷ', e: 'ぺ', o: 'ぽ',
        y: { a: 'ぴゃ', i: 'ぴぃ', u: 'ぴゅ', e: 'ぴぇ', o: 'ぴょ' },
    },
    x: {
        a: 'ぁ', i: 'ぃ', u: 'ぅ', e: 'ぇ', o: 'ぉ',
        y: {
            a: 'ゃ', i: 'ぃ', u: 'ゅ', e: 'ぇ', o: 'ょ',
        },
        t: {
            u: 'っ',
            s: {
                u: 'っ',
            },
        },
    },
    l: {
        a: 'ぁ', i: 'ぃ', u: 'ぅ', e: 'ぇ', o: 'ぉ',
        y: {
            a: 'ゃ', i: 'ぃ', u: 'ゅ', e: 'ぇ', o: 'ょ',
        },
        t: {
            u: 'っ',
            s: {
                u: 'っ',
            },
        },
    },
};

export function convertRomanToKana(original) {
    const str = original
    let result = '';
    let tmp = '';
    let index = 0;
    const len = str.length;
    let node = tree;
    const push = (char, toRoot = true) => {
        result += char;
        tmp = '';
        node = toRoot ? tree : node;
    };
    while (index < len) {
        const char = str.charAt(index);
        if (char.match(/[a-z]/)) { // 英数字以外は考慮しない
            if (char in node) {
                const next = node[char];
                if (typeof next === 'string') {
                    push(next);
                } else {
                    tmp += original.charAt(index);
                    node = next;
                }
                index++;
                continue;
            }
            const prev = str.charAt(index - 1);
            if (prev && (prev === 'n' || prev === char)) { // 促音やnへの対応
                push(prev === 'n' ? 'ん' : 'っ', false);
            }
            if (node !== tree && char in tree) { // 今のノードがルート以外だった場合、仕切り直してチェックする
                push(tmp);
                continue;
            }
        }
        push(tmp + char);
        index++;
    }
    tmp = tmp.replace(/n$/, 'ン'); // 末尾のnは変換する
    push(tmp);
    return result;
}