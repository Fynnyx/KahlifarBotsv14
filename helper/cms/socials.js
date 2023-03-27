const axios = require('axios');

async function getCMSSocials(name = undefined) {
  const socialsData = await axios.get(`${process.env.CMS_URL}/api/socials?populate=*${name ? `&filters[Name][$eq]=${name}` : ''}`, {
    headers: {
      Authorization: `Bearer ${process.env.CMS_TOKEN}`
    }
  });
  return socialsData.data;
}


module.exports = {
  getCMSSocials
}
