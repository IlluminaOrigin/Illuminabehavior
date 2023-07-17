import { world } from "@minecraft/server";
import * as UI from "@minecraft/server-ui"
import { GuildCreate,GuildDelete,GuildNameChange,GuildAddMember,GuildRemoveMember,GuildAddAdmin,GuildRemoveAdmin,GuildOwnerChange } from "functions.js";

export function GuildCreateForm(source){
    const form = new UI.ModalFormData()
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
        GuildCreate(source,rs.formValues[0])
    })
}

