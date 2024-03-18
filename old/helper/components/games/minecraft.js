const axios = require('axios');

exports.checkUsername = async (username, client) => {
    try {
        const response = await axios.get(`https://api.ashcon.app/mojang/v2/user/${username}`);
        return response.data;
    } catch (error) {
        switch (error.response.status) {
            case 404:
            case 400:
                return { isError: true, message: "Username is invalid" };
            case 500:
                return { isError: true, message: "External Service Error" };
            default:
                return { isError: true, message: "Unknown Error" };
        }
    }
}