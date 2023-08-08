import { Entity, world ,ItemStack, BlockWaterContainerComponent} from "@minecraft/server";
import { Name } from "functions.js";
import * as UI from "@minecraft/server-ui"

world.afterEvents.itemUseOn.subscribe((ev)=>{
  const {source , block , itemStack} = ev;
  if(itemStack.typeId === "karo:master_key" && block.typeId === "minecraft:iron_door" && block.location.y === source.location.y) {
    if(block.permutation.getState(`direction`) === 0) { source.teleport({ x: block.location.x + 3.5, y: block.location.y , z: block.location.z + 0.5})}
    if(block.permutation.getState(`direction`) === 1) { source.teleport({ x: block.location.x +0.5, y: block.location.y , z: block.location.z + 3.5})}
    if(block.permutation.getState(`direction`) === 2) { source.teleport({ x: block.location.x - 2.5, y: block.location.y , z: block.location.z + 0.5})}
    if(block.permutation.getState(`direction`) === 3) { source.teleport({ x: block.location.x + 0.5, y: block.location.y , z: block.location.z - 2.5}) }
  }
})

world.afterEvents.itemUse.subscribe((ev)=>{
    switch(ev.itemStack.typeId){
        case "karo:guildinvite":{
            if(isNaN(Number(ev.itemStack.getLore()[0])) || Number(ev.itemStack.getLore()[0]) == 0) {
              ev.source.sendMessage(`§c招待が無効です。`)
              ev.source.getComponent(`inventory`).container.setItem(ev.source.selectedSlot)
              return;
            }
            const guilds = world.scoreboard.getObjective(`guildname`).getScores()
            let guildCheck = "No"
            for(let i = 0;i < guilds.length;i++){
              if(guilds[i].score === Number(ev.itemStack.getLore()[0])) guildCheck = "OK"
            }
            if(guildCheck === "No") {
              ev.source.sendMessage(`§c招待が無効です。`)
              ev.source.getComponent(`inventory`).container.setItem(ev.source.selectedSlot)
              return;
            }
            if(world.scoreboard.getObjective(`playerguild`).getScore(ev.source) !== 0) {
              ev.source.sendMessage(`§c既に別のギルドに加入中の為使えません。`)
              ev.source.getComponent(`inventory`).container.setItem(ev.source.selectedSlot)
              return;
            }
            world.scoreboard.getObjective(`playerguild`).setScore(ev.source,Number(ev.itemStack.getLore()[0]))
            ev.source.sendMessage(`§aギルドに加入しました。`)
            ev.source.removeTag(`guildAdmin`)
            ev.source.getComponent(`inventory`).container.setItem(ev.source.selectedSlot)
            break;
        }
        case "karo:guildcreate":{
            if(world.scoreboard.getObjective(`playerguild`).getScore(ev.source) !== 0) {
                ev.source.sendMessage(`§c既に別のギルドに加入中の為使えません。`)
                return;
            }
            GuildCreateForm(ev.source)
            break;
        }
        case "karo:guildadmin":{
            if(!world.scoreboard.getObjective(`playerguild`).getScore(ev.source) || world.scoreboard.getObjective(`playerguild`).getScore(ev.source) === 0) return;
            GuildAdminForm(ev.source)
            break;
        }
        default: return;
    }
})


/**********************************************************************************************************************
 * ギルド関係の関数たち　　　　　　　　                                                                                *
 *                                                                                                                    *
 **********************************************************************************************************************/

export function GuildTaxSetting(source) {
  if(!source.hasTag(`guildOwner`)) return;
  const guilds1 = world.scoreboard.getObjective(`guildmoneyper`).getScores()
  let guildMoney = 0
  for(let i = 0;i < guilds1.length;i++){
    if(guilds1[i].participant.displayName === `${world.scoreboard.getObjective(`playerguild`).getScore(source)}`) guildMoney = guilds1[i].score
  }
  const guilds2 = world.scoreboard.getObjective(`guildxpper`).getScores()
  let guildXP = 0
  for(let i = 0;i < guilds2.length;i++){
    if(guilds2[i].participant.displayName === `${world.scoreboard.getObjective(`playerguild`).getScore(source)}`) guildXP = guilds2[i].score
  }
  const form = new UI.ModalFormData()
  form.title(`§l徴収率変更`)
  form.slider(`金徴収率`,0,100,1,guildMoney)
  form.slider(`経験値徴収率`,0,100,1,guildXP)
  form.show(source).then((rs)=>{
    if(rs.canceled) return;
    world.scoreboard.getObjective(`guildmoneyper`).setScore(`${world.scoreboard.getObjective(`playerguild`).getScore(source)}`,rs.formValues[0])
    world.scoreboard.getObjective(`guildxpper`).setScore(`${world.scoreboard.getObjective(`playerguild`).getScore(source)}`,rs.formValues[1])
    source.sendMessage(`§a徴収率変更\n金: ${rs.formValues[0]} パーセント \n経験値: ${rs.formValues[1]} パーセント`)
  })
}

export function GuildTresureWithdraw(source) {
  if(!source.hasTag(`guildOwner`)) return;
  const guilds1 = world.scoreboard.getObjective(`guildmoney`).getScores()
  let guildMoney = 0
  for(let i = 0;i < guilds1.length;i++){
    if(guilds1[i].participant.displayName === `${world.scoreboard.getObjective(`playerguild`).getScore(source)}`) guildMoney = guilds1[i].score
  }
  const guilds2 = world.scoreboard.getObjective(`guildxp`).getScores()
  let guildXP = 0
  for(let i = 0;i < guilds2.length;i++){
    if(guilds2[i].participant.displayName === `${world.scoreboard.getObjective(`playerguild`).getScore(source)}`) guildXP = guilds2[i].score
  }
  const form = new UI.ModalFormData()
  form.title(`§lギルド財産引き出し`)
  form.slider(`金引き出し`,0,guildMoney,1)
  form.slider(`経験値引き出し`,0,guildXP,1)
  form.show(source).then((rs)=>{
    if(rs.canceled) return;
    world.scoreboard.getObjective(`money`).setScore(source,world.scoreboard.getObjective(`money`).getScore(source) + rs.formValues[0])
    world.scoreboard.getObjective(`hasxp`).setScore(source,world.scoreboard.getObjective(`hasxp`).getScore(source) + rs.formValues[1])
    world.scoreboard.getObjective(`guildmoney`).setScore(`${world.scoreboard.getObjective(`playerguild`).getScore(source)}`,world.scoreboard.getObjective(`guildmoney`).getScore(`${world.scoreboard.getObjective(`playerguild`).getScore(source)}`) - rs.formValues[0])
    world.scoreboard.getObjective(`guildxp`).setScore(`${world.scoreboard.getObjective(`playerguild`).getScore(source)}`,world.scoreboard.getObjective(`guildxp`).getScore(`${world.scoreboard.getObjective(`playerguild`).getScore(source)}`) - rs.formValues[1])
    source.sendMessage(`金: +${rs.formValues[0]}\n経験値: +${rs.formValues[1]}`)
  })
}

export function GuildCreateForm(source){
    const form = new UI.ModalFormData()
    form.title(`ギルド作成`)
    form.textField(`ギルド名を決めて作成してください`,`ギルド名を入力`,`ギルド`)
    form.show(source).then((rs)=>{
        if(rs.canceled) return;
        GuildCreate(source,rs.formValues[0])
    })
}

export function GuildAdminForm(source){
    const form = new UI.ActionFormData()
    form.title(`§l§0ギルド管理`)
    form.body(`§l§f何をしますか？`)
    form.button(`§l§0メンバー追加`)
    form.button(`§l§0メンバー削除`)
    form.button(`§l§0幹部追加`)
    form.button(`§l§0幹部削除`)
    form.button(`§l§0ギルド財産引き出し`)
    form.button(`§l§0ギルド徴収割合変更`)
    form.button(`§l§0ギルド名変更`)
    form.button(`§l§0オーナー変更`)
    form.button(`§l§0ギルド削除`)
    form.show(source).then((rs)=>{
        if(rs.canceled) return;
        switch(rs.selection){
            case 0: {
                GuildAddMember(source)
                break;
            }
            case 1: {
                GuildRemoveMember(source)
                break;
            }
            case 2: {
                GuildAddAdmin(source)
                break;
            }
            case 3: {
                GuildRemoveAdmin(source)
                break;
            }
            case 4: {
                GuildTresureWithdraw(source)
                break;
            }
            case 5: {
                GuildTaxSetting(source)
                break;
            }
            case 6: {
                GuildNameChangeForm(source)
                break;
            }
            case 7: {
                GuildOwnerChange(source)
                break;
            }
            case 8: {
                GuildDeleteForm(source)
                break;
            }
        }
    })
}

export function GuildNameChangeForm(source){
    if(!source.hasTag(`guildOwner`)) return;
    const form = new UI.ModalFormData()
    form.title(`ギルド名変更`)
    form.textField(`変更後のギルド名を入力`,`新しいギルド名を入力`,`ギルド`)
    form.show(source).then((rs)=>{
        if(rs.canceled) return;
        GuildNameChange(source,rs.formValues[0])
    })
}

export function GuildDeleteForm(source) {
    if(!source.hasTag(`guildOwner`)) return;
    const form = new UI.ActionFormData()
    form.title(`ギルド削除`)
    form.body(`削除すると元には戻せません。本当に削除しますか？`)
    form.button(`§l§0キャンセル`)
    form.button(`§l§c削除する`)
    form.show(source).then((rs)=>{
        if(rs.canceled) return;
        if(rs.selection === 1) GuildDelete(source)
    })
}

/**
 * 
 * @param {import('@minecraft/server').Player|Entity} source 
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
      return;
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
      return;
    }
    const GuildMaxNumber = Math.max(...guildsAmount)
    source.sendMessage(`§aギルド§r「 ${guildName} §r」§aを作成しました。`)
    source.runCommandAsync(`title @s subtitle "createGuild ${guildName}"`)
    source.addTag(`guildOwner`)
    const guildAdminItem = new ItemStack(`karo:guildadmin`)
    /**
     * @type {Container} selectSlot
     */
    const selectSlot = source.getComponent(`inventory`).container
    selectSlot.setItem(source.selectedSlot,guildAdminItem)
    world.scoreboard.getObjective(`guildmoney`).setScore(`${GuildMaxNumber + 1}`,0)
    world.scoreboard.getObjective(`guildxp`).setScore(`${GuildMaxNumber + 1}`,0)
    world.scoreboard.getObjective(`guildmoneyper`).setScore(`${GuildMaxNumber + 1}`,1)
    world.scoreboard.getObjective(`guildxpper`).setScore(`${GuildMaxNumber + 1}`,1)
    world.scoreboard.getObjective(`guildname`).setScore(`${guildName}`,GuildMaxNumber + 1)
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
        if(members[i].score === sourceGuild) world.scoreboard.getObjective(`playerguild`).setScore(members[i].participant,0)
    }
    source.runCommandAsync(`title @s subtitle "deleteGuild ${guilds[guildNumber].participant.displayName}"`)
    if(guildNumber === null) return;
    source.sendMessage(`§aあなたのギルドが削除されました。`)
    source.removeTag(`guildOwner`)
    source.removeTag(`guildAdmin`)
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
    if(newName.length > 15) {
        source.sendMessage(`§cギルド名は15文字以内にしてください。`)
        return;
    }
    const guilds = world.scoreboard.getObjective(`guildname`).getScores()
    let guildNames = []
    for(let i = 0;i < guilds.length;i++){
      guildNames[guildNames.length] = guilds[i].participant.displayName
    }
    if(guildNames.indexOf(newName) !== -1) {
      source.sendMessage(`§cその名前は使えません`)
      return;
    }
    let guildNumber = null
    for(let i = 0;i < guilds.length;i++){
      if(guilds[i].score === sourceGuild) {
        guildNumber = i
      }
    }
    if(guildNumber === null) return;
    const newGuildNumber = guilds[guildNumber].score
    source.sendMessage(`§aあなたのギルドの名前を§r ${guilds[guildNumber].participant.displayName} §r§aから§r ${newName} §r§aに変更しました。`)
    source.runCommandAsync(`title @s subtitle "changeNameGuild ギルド「**${guilds[guildNumber].participant.displayName}**」は、ギルド「**${newName}**」に名前が変わった"`)
    world.scoreboard.getObjective(`guildname`).removeParticipant(guilds[guildNumber].participant.displayName)
    world.scoreboard.getObjective(`guildname`).setScore(`${newName}`,newGuildNumber)
}

/**
 * 
 * @param {import('@minecraft/server').Player} source 
 * @returns 
 */
export function GuildAddMember(source){
    if(!source.hasTag(`guildOwner`) && !source.hasTag(`guildAdmin`)) return;
    const sourceGuild = world.scoreboard.getObjective(`playerguild`).getScore(source)
    if(typeof sourceGuild === 'undefined') return;
    const players = world.getDimension(`overworld`).getPlayers({tags:["hatu"]}).filter(p => world.scoreboard.getObjective(`playerguild`).getScore(p) === 0)
    if(players.length === 0) {NotPlayerIs(source); return;}
    let buttons = []
    for(const p of players){
      buttons[buttons.length] = Name(p.nameTag)
    }
    const form = new UI.ModalFormData
    form.title(`メンバー追加`)
    form.dropdown(`追加メンバーを選択`,buttons)
    form.show(source).then((rs)=>{
      if(rs.canceled) return;
      const item = new ItemStack(`karo:guildinvite`)
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
  if(!source.hasTag(`guildOwner`) && !source.hasTag(`guildAdmin`)) return;
  const sourceGuild = world.scoreboard.getObjective(`playerguild`).getScore(source)
  if(typeof sourceGuild === 'undefined') return;
  let players 
  if(source.hasTag("guildAdmin")) players = world.getDimension(`overworld`).getPlayers({tags:["hatu"],excludeTags:["guildOwner","guildAdmin"]}).filter(p => world.scoreboard.getObjective(`playerguild`).getScore(p) === world.scoreboard.getObjective(`playerguild`).getScore(source))
  if(source.hasTag("guildOwner")) players = world.getDimension(`overworld`).getPlayers({tags:["hatu"],excludeTags:["guildOwner"]}).filter(p => world.scoreboard.getObjective(`playerguild`).getScore(p) === world.scoreboard.getObjective(`playerguild`).getScore(source))
  if(players.length === 0) {NotPlayerIs(source); return;}
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
    players[rs.formValues[0]].sendMessage(`${Name(source.nameTag)} §r§cによりギルドから削除されました。`)
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
  if(players.length === 0) {NotPlayerIs(source); return;}
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
  if(players.length === 0) {NotPlayerIs(source); return;}
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

/**
 * 
 * @param {import('@minecraft/server').Player} source 
 * @returns 
 */
export function GuildOwnerChange(source){
  if(!source.hasTag(`guildOwner`)) return;
  const sourceGuild = world.scoreboard.getObjective(`playerguild`).getScore(source)
  if(typeof sourceGuild === 'undefined') return;
  const players = world.getDimension(`overworld`).getPlayers({tags:["hatu"],excludeTags:["guildOwner"]}).filter(p => world.scoreboard.getObjective(`playerguild`).getScore(p) === world.scoreboard.getObjective(`playerguild`).getScore(source))
  if(players.length === 0) {NotPlayerIs(source); return;}
  let buttons = []
  for(const p of players){
    buttons[buttons.length] = Name(p.nameTag)
  }
  const form = new UI.ModalFormData
  form.title(`ギルドオーナー変更`)
  form.dropdown(`ギルドオーナーにするメンバーを選択`,buttons)
  form.show(source).then((rs)=>{
    if(rs.canceled) return;
    players[rs.formValues[0]].addTag(`guildOwner`)
    players[rs.formValues[0]].removeTag(`guildAdmin`)
    source.removeTag(`guildOwner`)
    players[rs.formValues[0]].sendMessage(`${Name(source.nameTag)} §r§aによってギルドオーナーになりました。`)
    source.sendMessage(`${buttons[rs.formValues]} §r§aをギルドオーナーにしました。`)
  })
}

export function NotPlayerIs(source){
    const form = new UI.ActionFormData()
    form.title(`§lお知らせ`)
    form.body(`§l§c対象に合うプレイヤーがいません。`)
    form.button(`§lOK`)
    form.show(source)
}