const axios = require('axios');

async function getUser(userid) {
    const user = await axios.get(`${process.env.API_URL}/users/${userid}`);
    return user.data;
}

async function registerUser(username) {
    try {
        const newUser = await axios.post(`${process.env.API_URL}/users`, {
            username: username
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