const { kahlifarApiAxios } = require('../../loader/axios');

async function getUser(userid) {
    const user = await kahlifarApiAxios.get(`${process.env.API_URL}/users/${userid}`, {
        headers: {
            API_KEY: process.env.API_KEY
        }
    });
    return user.data;
}

async function searchBirthday(day=null, month=null, year=null) {
    try {
        // Only if the provided paramether is set add it to the query
        params = {};
        if (day) {
            params.day = day;
        }
        if (month) {
            params.month = month;
        }
        if (year) {
            params.year = year;
        }
        const users = await kahlifarApiAxios.get(`${process.env.API_URL}/users/searchBirthday`, {
            params: params
        });
        return users.data;
    } catch (error) {
        return {
            isError: true,
            message: error.response.data.message
        }
    }
}

async function registerUser(username) {
    try {
        const newUser = await kahlifarApiAxios.post(`${process.env.API_URL}/users`, {
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

async function updateUser(id, userdata) {
    try {
        const updatedUser = await kahlifarApiAxios.put(`${process.env.API_URL}/users/${id}`,
            {
                username: userdata.username,
                birthday: userdata.birthday,
                email: userdata.email,
            }
        )
        return updatedUser.data
    } catch(error) {
        return {
            isError: true,
            message: error.response.data.message
        }
    }
}


module.exports = {
    getUser,
    searchBirthday,
    registerUser,
    updateUser
}