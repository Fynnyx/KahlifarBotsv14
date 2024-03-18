const { kahlifarCmsAxios } = require('../../loader/axios');

async function getCMSCollection(name) {
    const cmsData = await kahlifarCmsAxios.get(`${process.env.CMS_URL}/api/collections?populate=*&filters[Name][$eq]=${name}`, {
        headers: {
            Authorization: `Bearer ${process.env.CMS_TOKEN}`
        }
    })

    return cmsData.data
}

module.exports = {
    getCMSCollection
}