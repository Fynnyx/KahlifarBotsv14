const axios = require('axios');

exports.checkUsername = async (username, client) => {
    console.log("Checking username " + username);
    try {
        const response = await axios.get(`https://api.ashcon.app/mojang/v2/user/${username}`);
        switch (response.status) {
            case 200:
                return response.data;
            case 404:
                return { isError: true, message: "Username is invalid" };
            case 500:
                return { isError: true, message: "External Service Error" };
            default:
                return { isError: true, message: "Unknown Error" };
        }
    } catch (error) {
        client.logger.error("Error on minecraft.checkUsername " + error)
    }
}