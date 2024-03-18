const { kahlifarCmsAxios } = require('../../loader/axios');

async function getCMSSocials(name = undefined) {
  const socialsData = await kahlifarCmsAxios.get(`${process.env.CMS_URL}/api/socials?populate=*${name ? `&filters[Name][$eq]=${name}` : ''}`);
  return socialsData.data;
}


module.exports = {
  getCMSSocials
}
