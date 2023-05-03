const axios = require('axios')
const logger = require('./logger')

const defaultAxios = axios.create()
defaultAxios.interceptors.request.use(request => {
    logger.http(`Starting Request: ${request.method} ${request.url}`)
    return request
})

const kahlifarApiAxios = defaultAxios.create({
    baseURL: process.env.API_URL,
    headers: {
        API_KEY: process.env.API_KEY
    }
})

const kahlifarCmsAxios = defaultAxios.create({
    baseURL: process.env.CMS_URL,
    headers: {
        Authorization: `Bearer ${process.env.CMS_TOKEN}`
    }
})


module.exports = {
    defaultAxios,
    kahlifarApiAxios,
    kahlifarCmsAxios
}