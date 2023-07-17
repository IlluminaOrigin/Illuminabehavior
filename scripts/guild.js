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
    const form = new UI.ModalFormData()

    form.show(source).then((rs)=>{
        if(rs.canceled) return;
        GuildCreate(source,rs.formValues[0])
    })
}

