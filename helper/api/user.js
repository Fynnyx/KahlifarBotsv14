const axios = require('axios');

async function getUser(userid) {
    const user = await axios.get(`${process.env.API_URL}/users/${userid}`, {
        headers: {
            API_KEY: process.env.API_KEY
        }
    });
    return user.data;
}

async function registerUser(username) {
    try {
        const newUser = await axios.post(`${process.env.API_URL}/users`, {
            username: username
        },
            {
                headers: {
                    API_KEY: process.env.API_KEY
                }
            });
        return newUser.data;
    } catch (error) {
        return {
            isError: true,
            message: error.response.data.message
        };
    }
}


module.exports = {
    getUser,
    registerUser
}