const { kahlifarCmsAxios } = require('../../loader/axios');
const { SelectMenuBuilder, RoleSelectMenuBuilder, StringSelectMenuBuilder } = require('discord.js');

async function getCMSSelect(name) {
    const select = await kahlifarCmsAxios.get(`${process.env.CMS_URL}/api/selects?populate=*&filters[Name][$eq]=${name}`);
    return select.data.data;
}

async function createCMSSelect(data, type) {

    let select
    //! Discord Api doesn't support role select menu option yet
    // switch (type.toLowerCase()) {
    //     case 'roles':
    //         select = new RoleSelectMenuBuilder()
    //             .setCustomId(data.data.customId)
    //             .setPlaceholder(data.data.Placeholder)
    //             .setMinValues(data.data.MinValues)
    //             .setMaxValues(data.data.MaxValues)
    //             .setDisabled(data.data.Disabled)
    //         select.
    //         break;
    //     default:
    //         select = new StringSelectMenuBuilder(baseSelect)
    //         for (const option of data.options) {
    //             select.addOptions({
    //                 label: option.Label,
    //                 value: option.Value,
    //                 description: option.Description,
    //                 default: option.default
    //             })
    //         }                    
    //         break;
    // }

    select = new StringSelectMenuBuilder()
        .setCustomId(data.data.customId)
        .setPlaceholder(data.data.Placeholder)

    if (data.data.MaxValues != null) {
        if (data.data.MaxValues == 0) {
            data.data.MaxValues = data.options.length
        }
        select.setMaxValues(data.data.MaxValues)
    }
    if (data.data.MinValues) select.setMinValues(data.data.MinValues)
    if (data.data.Disabled) select.setDisabled(data.data.Disabled)

    for (const option of data.options) {
        select.addOptions({
            label: option.Label,
            value: option.Value,
            description: option.Description,
            default: option.default
        })
    }
    return select;
}

module.exports = {
    getCMSSelect,
    createCMSSelect
}