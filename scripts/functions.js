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
    a: 'ア', i: 'イ', u: 'ウ', e: 'エ', o: 'オ',
    k: {
      a: 'カ', i: 'キ', u: 'ク', e: 'ケ', o: 'コ',
      y: { a: 'キャ', i: 'キィ', u: 'キュ', e: 'キェ', o: 'キョ' },
    },
    s: {
      a: 'サ', i: 'シ', u: 'ス', e: 'セ', o: 'ソ',
      h: { a: 'シャ', i: 'シ', u: 'シュ', e: 'シェ', o: 'ショ' },
      y: { a: 'シャ', i: 'シィ', u: 'シュ', e: 'シェ', o: 'ショ' },
    },
    t: {
      a: 'タ', i: 'チ', u: 'ツ', e: 'テ', o: 'ト',
      h: { a: 'テャ', i: 'ティ', u: 'テュ', e: 'テェ', o: 'テョ' },
      y: { a: 'チャ', i: 'チィ', u: 'チュ', e: 'チェ', o: 'チョ' },
      s: { a: 'ツァ', i: 'ツィ', u: 'ツ', e: 'ツェ', o: 'ツォ' },
    },
    c: {
      a: 'カ', i: 'シ', u: 'ク', e: 'セ', o: 'コ',
      h: { a: 'チャ', i: 'チ', u: 'チュ', e: 'チェ', o: 'チョ' },
      y: { a: 'チャ', i: 'チィ', u: 'チュ', e: 'チェ', o: 'チョ' },
    },
    q: {
      a: 'クァ', i: 'クィ', u: 'ク', e: 'クェ', o: 'クォ',
    },
    n: {
      a: 'ナ', i: 'ニ', u: 'ヌ', e: 'ネ', o: 'ノ', n: 'ン',
      y: { a: 'ニャ', i: 'ニィ', u: 'ニュ', e: 'ニェ', o: 'ニョ' },
    },
    h: {
      a: 'ハ', i: 'ヒ', u: 'フ', e: 'ヘ', o: 'ホ',
      y: { a: 'ヒャ', i: 'ヒィ', u: 'ヒュ', e: 'ヒェ', o: 'ヒョ' },
    },
    f: {
      a: 'ファ', i: 'フィ', u: 'フ', e: 'フェ', o: 'フォ',
      y: { a: 'フャ', u: 'フュ', o: 'フョ' },
    },
    m: {
      a: 'マ', i: 'ミ', u: 'ム', e: 'メ', o: 'モ',
      y: { a: 'ミャ', i: 'ミィ', u: 'ミュ', e: 'ミェ', o: 'ミョ' },
    },
    y: { a: 'ヤ', i: 'イ', u: 'ユ', e: 'イェ', o: 'ヨ' },
    r: {
      a: 'ラ', i: 'リ', u: 'ル', e: 'レ', o: 'ロ',
      y: { a: 'リャ', i: 'リィ', u: 'リュ', e: 'リェ', o: 'リョ' },
    },
    w: { a: 'ワ', i: 'ウィ', u: 'ウ', e: 'ウェ', o: 'ヲ' },
    g: {
      a: 'ガ', i: 'ギ', u: 'グ', e: 'ゲ', o: 'ゴ',
      y: { a: 'ギャ', i: 'ギィ', u: 'ギュ', e: 'ギェ', o: 'ギョ' },
    },
    z: {
      a: 'ザ', i: 'ジ', u: 'ズ', e: 'ゼ', o: 'ゾ',
      y: { a: 'ジャ', i: 'ジィ', u: 'ジュ', e: 'ジェ', o: 'ジョ' },
    },
    j: {
      a: 'ジャ', i: 'ジ', u: 'ジュ', e: 'ジェ', o: 'ジョ',
      y: { a: 'ジャ', i: 'ジィ', u: 'ジュ', e: 'ジェ', o: 'ジョ' },
    },
    d: {
      a: 'ダ', i: 'ヂ', u: 'ヅ', e: 'デ', o: 'ド',
      h: { a: 'デャ', i: 'ディ', u: 'デュ', e: 'デェ', o: 'デョ' },
      y: { a: 'ヂャ', i: 'ヂィ', u: 'ヂュ', e: 'ヂェ', o: 'ヂョ' },
    },
    b: {
      a: 'バ', i: 'ビ', u: 'ブ', e: 'ベ', o: 'ボ',
      y: { a: 'ビャ', i: 'ビィ', u: 'ビュ', e: 'ビェ', o: 'ビョ' },
    },
    v: {
      a: 'ヴァ', i: 'ヴィ', u: 'ヴ', e: 'ヴェ', o: 'ヴォ',
      y: { a: 'ヴャ', i: 'ヴィ', u: 'ヴュ', e: 'ヴェ', o: 'ヴョ' },
    },
    p: {
      a: 'パ', i: 'ピ', u: 'プ', e: 'ペ', o: 'ポ',
      y: { a: 'ピャ', i: 'ピィ', u: 'ピュ', e: 'ピェ', o: 'ピョ' },
    },
    x: {
      a: 'ァ', i: 'ィ', u: 'ゥ', e: 'ェ', o: 'ォ',
      y: {
        a: 'ャ', i: 'ィ', u: 'ュ', e: 'ェ', o: 'ョ',
      },
      t: {
        u: 'ッ',
        s: {
          u: 'ッ',
        },
      },
    },
    l: {
      a: 'ァ', i: 'ィ', u: 'ゥ', e: 'ェ', o: 'ォ',
      y: {
        a: 'ャ', i: 'ィ', u: 'ュ', e: 'ェ', o: 'ョ',
      },
      t: {
        u: 'ッ',
        s: {
          u: 'ッ',
        },
      },
    },
  };
  
  export function convertRomanToKana(original) {
    const str = original.replace(/[Ａ-Ｚａ-ｚ]/, s => String.fromCharCode(s.charCodeAt(0) - 65248)).toLowerCase(); // 全角→半角→小文字
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
          push(prev === 'n' ? 'ン' : 'ッ', false);
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