
async function isRoleSelect (name) {
    if (name.startsWith('roles')) return true;
    return false;
}

module.exports = {
    isRoleSelect
}