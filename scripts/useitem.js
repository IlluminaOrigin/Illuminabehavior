import { Entity, world ,ItemStack} from "@minecraft/server";
import * as UI from "@minecraft/server-ui"

world.afterEvents.itemUse.subscribe((ev)=>{
    switch(ev.itemStack.typeId){
        case "karo:guildinvite":{
            if(isNaN(Number(ev.itemStack.getLore()[0])) || Number(ev.itemStack.getLore()[0]) == 0) return;
            world.scoreboard.getObjective(`playerguild`).setScore(ev.source,Number(ev.itemStack.getLore()[0]))
            ev.source.sendMessage(`§aギルドに加入しました。`)
            ev.source.getComponent(`inventory`).container.setItem(ev.source.selectedSlot)
            break;
        }
        case "karo:guildcreate":{
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
 * ギルド関係の関数たち
 * 
 **********************************************************************************************************************/



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
                GuildNameChangeForm(source)
                break;
            }
            case 5: {
                GuildOwnerChange(source)
                break;
            }
            case 6: {
                GuildDeleteForm(source)
                break;
            }
        }
    })
}

export function GuildNameChangeForm(source){
    const form = new UI.ModalFormData()
    form.title(`ギルド名変更`)
    form.textField(`変更後のギルド名を入力`,`新しいギルド名を入力`,`ギルド`)
    form.show(source).then((rs)=>{
        if(rs.canceled) return;
        GuildNameChange(source,rs.formValues[0])
    })
}

export function GuildDeleteForm(source) {
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
    source.addTag(`guildOwner`)
    const guildAdminItem = new ItemStack(`karo:guildadmin`)
    /**
     * @type {Container} selectSlot
     */
    const selectSlot = source.getComponent(`inventory`).container
    selectSlot.setItem(source.selectedSlot,guildAdminItem)
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
  if(source.hasTag("guildAdmin")) world.getDimension(`overworld`).getPlayers({tags:["hatu"],excludeTags:["guildOwner","guildAdmin"]}).filter(p => world.scoreboard.getObjective(`playerguild`).getScore(p) === world.scoreboard.getObjective(`playerguild`).getScore(source))
  if(source.hasTag("guildOwner")) world.getDimension(`overworld`).getPlayers({tags:["hatu"],excludeTags:["guildOwner"]}).filter(p => world.scoreboard.getObjective(`playerguild`).getScore(p) === world.scoreboard.getObjective(`playerguild`).getScore(source))
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