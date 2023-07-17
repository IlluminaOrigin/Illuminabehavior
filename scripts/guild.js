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

export function GuildNameChangeForm(source){
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