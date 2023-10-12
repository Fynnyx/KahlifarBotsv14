const {kahlifarApiAxios} = require('../../../loader/axios')
const moment = require('moment')

async function getAllQuotes() {
    try {
        const response = await kahlifarApiAxios.get(`${process.env.API_URL}/quotes`)
        return response.data
    } catch (e) {
        return { isError: true, message: e.message }
    }
}

async function getQuoteById(id) {
    try {
        const response = await kahlifarApiAxios.get(`/quotes/${id}`)
        return response.data
    } catch (e) {
        return { isError: true, message: e.message }
    }
}

async function createQuote(quote) {
    try {
        quote.date = moment(new Date(quote.date), 'DD.MM.YYYY', true).format('YYYY-MM-DD')
        const response = await kahlifarApiAxios.post(`/quotes`, quote)
        return response.data
    } catch (e) {
        return { isError: true, message: e.message }
    }
}

module.exports = {
    getAllQuotes,
    getQuoteById,
    createQuote
}
