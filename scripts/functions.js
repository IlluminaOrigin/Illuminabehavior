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

/**
 * 
 * @param {import('@minecraft/server').Player} source 
 * @param {String} guildName 
 * @returns 
 */

export function GuildCreate(source, guildName) {
    const sourceGuild = world.scoreboard.getObjective(`playerguild`).getScore(source)
    if(typeof sourceGuild === 'undefined' || sourceGuild !== 0) {
      source.sendMessage(`§c既にギルドに所属している場合、作成することは出来ません。`)
    }
    if(guildName.length > 15) {
      source.sendMessage(`§cギルド名は15文字以内にしてください。`)
    }
    const guilds = world.scoreboard.getObjective(`guildname`).getScores()
    let guildNumber = null
    let guildsAmount = [1]
    let guildNames = []
    for(let i = 0;i < guilds.length;i++){
      guildsAmount[guildsAmount.length] = guilds[i].score
      guildNames[guildNames.length] = guilds[i].participant.displayName
    }
    if(guildNames.indexOf(guildName) !== -1) {
      source.sendMessage(`§cその名前は使えません`)
    }
    const GuildMaxNumber = Math.max(...guildsAmount)
    source.sendMessage(`§aギルド§r「 ${guilds[guildNumber].participant.displayName} §r」§aを作成しました。`)
    source.addTag(`guildOwner`)
    const guildAdminItem = new ItemStack(`karo:guildAdmin`)
    /**
     * @type {Container} selectSlot
     */
    const selectSlot = source.getComponent(`inventory`).container
    selectSlot.setItem(source.selectedSlot,guildAdminItem)
    world.scoreboard.getObjective(`guildname`).setScore(`${newName}`,GuildMaxNumber + 1)
    world.scoreboard.getObjective(`playerguild`).setScore(source,GuildMaxNumber + 1)
}
  
  /**
   * 
   * @param {import('@minecraft/server').Player} source
   * @returns 
   */
export function GuildDelete(source) {
    const sourceGuild = world.scoreboard.getObjective(`playerguild`).getScore(source)
    if(typeof sourceGuild === 'undefined') return;
    if(!source.hasTag(`guildOwner`)) return;
    const guilds = world.scoreboard.getObjective(`guildname`).getScores()
    const members = world.scoreboard.getObjective(`playerguild`).getScores()
    let guildNumber = null
    for(let i = 0;i < guilds.length;i++){
        if(guilds[i].score === sourceGuild) {
            guildNumber = i
        }
    }
    for(let i = 0;i < members.length;i++){
        if(members[i].score === sourceGuild) world.scoreboard.getObjective(`playerguild`).removeParticipant(members[i].participant)
    }
    source.runCommandAsync(`title @s subtitle "deleteGuild ${guilds[guildNumber].participant.displayName}"`)
    if(guildNumber === null) return;
    source.sendMessage(`§aあなたのギルドが削除されました。`)
    world.scoreboard.getObjective(`guildname`).removeParticipant(guilds[guildNumber].participant.displayName)
}

/**
 * 
 * @param {import('@minecraft/server').Player} source 
 * @param {String} newName
 * @returns 
 */
export function GuildNameChange(source, newName) {
    const sourceGuild = world.scoreboard.getObjective(`playerguild`).getScore(source)
    if(typeof sourceGuild === 'undefined') return;
    if(!source.hasTag(`guildOwner`)) return;
    let guildNames = []
    for(let i = 0;i < guilds.length;i++){
      guildNames[guildNames.length] = guilds[i].participant.displayName
    }
    if(guildNames.indexOf(newName) !== -1) {
      source.sendMessage(`§cその名前は使えません`)
    }
    const guilds = world.scoreboard.getObjective(`guildname`).getScores()
    let guildNumber = null
    for(let i = 0;i < guilds.length;i++){
      if(guilds[i].score === sourceGuild) {
        guildNumber = i
      }
    }
    if(guildNumber === null) return;
    const newGuildNumber = guilds[guildNumber].score
    source.sendMessage(`§aあなたのギルドの名前を§r ${guilds[guildNumber].participant.displayName} §r§aから§r ${newName} §r§aに変更しました。`)
    world.scoreboard.getObjective(`guildname`).removeParticipant(guilds[guildNumber].participant.displayName)
    world.scoreboard.getObjective(`guildname`).setScore(`${newName}`,newGuildNumber)
}

/**
 * 
 * @param {import('@minecraft/server').Player} source 
 * @returns 
 */
export function GuildAddMember(source){
    if(!source.hasTag(`guildOwner` && !source.hasTag(`guildAdmin`))) return;
    const sourceGuild = world.scoreboard.getObjective(`playerguild`).getScore(source)
    if(typeof sourceGuild === 'undefined') return;
    const players = world.getDimension(`overworld`).getPlayers({tags:["hatu"]}).filter(p => world.scoreboard.getObjective(`playerguild`).getScore(p) === 0)
    let buttons = []
    for(const p of players){
      buttons[buttons.length] = Name(p.nameTag)
    }
    const form = new UI.ModalFormData
    form.title(`メンバー追加`)
    form.dropdown(`追加メンバーを選択`,buttons)
    form.show(source).then((rs)=>{
      if(rs.canceled) return;
      const item = new ItemStack(`karo:guildInvite`)
      item.setLore([`${sourceGuild}`])
      players[rs.formValues[0]].getComponent(`inventory`).container.addItem(item)
      players[rs.formValues[0]].sendMessage(`${Name(source.nameTag)} §r§aからギルドへ招待されました。`)
      source.sendMessage(`${buttons[rs.formValues]} §r§aをギルドに招待しました。`)
    })
}

/**
 * 
 * @param {import('@minecraft/server').Player} source 
 * @returns 
 */
export function GuildRemoveMember(source){
  if(!source.hasTag(`guildOwner` && !source.hasTag(`guildAdmin`))) return;
  const sourceGuild = world.scoreboard.getObjective(`playerguild`).getScore(source)
  if(typeof sourceGuild === 'undefined') return;
  let players 
  if(source.hasTag("guildAdmin")) world.getDimension(`overworld`).getPlayers({tags:["hatu"],excludeTags:["guildOwner","guildAdmin"]}).filter(p => world.scoreboard.getObjective(`playerguild`).getScore(p) === world.scoreboard.getObjective(`playerguild`).getScore(source))
  if(source.hasTag("guildOwner")) world.getDimension(`overworld`).getPlayers({tags:["hatu"],excludeTags:["guildOwner"]}).filter(p => world.scoreboard.getObjective(`playerguild`).getScore(p) === world.scoreboard.getObjective(`playerguild`).getScore(source))
  let buttons = []
  for(const p of players){
    buttons[buttons.length] = Name(p.nameTag)
  }
  const form = new UI.ModalFormData
  form.title(`メンバー削除`)
  form.dropdown(`削除するメンバーを選択`,buttons)
  form.show(source).then((rs)=>{
    if(rs.canceled) return;
    world.scoreboard.getObjective(`playerguild`).setScore(players[rs.formValues[0]],0)
    players[rs.formValues[0]].removeTag(`guildAdmin`)
    players[rs.formValues[0]].sendMessage(`${Name(source.nameTag)} §r§cギルドから削除されました。`)
    source.sendMessage(`${buttons[rs.formValues]} §r§aをギルドから削除しました。`)
  })
}

/**
 * 
 * @param {import('@minecraft/server').Player} source 
 * @returns 
 */
export function GuildAddAdmin(source){
  if(!source.hasTag(`guildOwner`)) return;
  const sourceGuild = world.scoreboard.getObjective(`playerguild`).getScore(source)
  if(typeof sourceGuild === 'undefined') return;
  const players = world.getDimension(`overworld`).getPlayers({tags:["hatu"],excludeTags:["guildOwner","guildAdmin"]}).filter(p => world.scoreboard.getObjective(`playerguild`).getScore(p) === world.scoreboard.getObjective(`playerguild`).getScore(source))
  let buttons = []
  for(const p of players){
    buttons[buttons.length] = Name(p.nameTag)
  }
  const form = new UI.ModalFormData
  form.title(`幹部追加`)
  form.dropdown(`幹部にするメンバーを選択`,buttons)
  form.show(source).then((rs)=>{
    if(rs.canceled) return;
    players[rs.formValues[0]].addTag(`guildAdmin`)
    players[rs.formValues[0]].sendMessage(`${Name(source.nameTag)} §r§aによってギルドの幹部になりました。`)
    source.sendMessage(`${buttons[rs.formValues]} §r§aをギルドの幹部にしました。`)
  })
}

/**
 * 
 * @param {import('@minecraft/server').Player} source 
 * @returns 
 */
export function GuildRemoveAdmin(source){
  if(!source.hasTag(`guildOwner`)) return;
  const sourceGuild = world.scoreboard.getObjective(`playerguild`).getScore(source)
  if(typeof sourceGuild === 'undefined') return;
  const players = world.getDimension(`overworld`).getPlayers({tags:["hatu","guildAdmin"],excludeTags:["guildOwner"]}).filter(p => world.scoreboard.getObjective(`playerguild`).getScore(p) === world.scoreboard.getObjective(`playerguild`).getScore(source))
  let buttons = []
  for(const p of players){
    buttons[buttons.length] = Name(p.nameTag)
  }
  const form = new UI.ModalFormData
  form.title(`幹部削除`)
  form.dropdown(`幹部から外すメンバーを選択`,buttons)
  form.show(source).then((rs)=>{
    if(rs.canceled) return;
    players[rs.formValues[0]].removeTag(`guildAdmin`)
    players[rs.formValues[0]].sendMessage(`${Name(source.nameTag)} §r§cによってギルドの幹部権限を剥奪されました。`)
    source.sendMessage(`${buttons[rs.formValues]} §r§aをギルドの幹部から外しました。`)
  })
}