const axios = require('axios');

async function getCMSText(name) {
    const text = await axios.get(`${process.env.CMS_URL}/api/texts?populate=*&filters[Name][$eq]=${name}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.CMS_TOKEN}`
            }
        }
    );
    return text.data.data;
}


module.exports = {
    getCMSText
}