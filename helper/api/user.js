async function getUser(userid, client) {
    const user = await axios.get(`${client.config.apiurl}/users/${userid}`);
    return user.data;
}

module.exports = {
    getUser
}