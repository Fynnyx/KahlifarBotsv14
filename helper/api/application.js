const { kahlifarApiAxios } = require("../../loader/axios");
const { getDCUser } = require("./dcuser");

async function getAllApplications() {
    try {
        const response = await kahlifarApiAxios.get(`${process.env.API_URL}/applications`);
        return response.data;
    } catch (error) {
        return { isError: true, message: error.message };
    }
}

async function getApplicationById(id) {
    try {
        const response = await kahlifarApiAxios.get(`${process.env.API_URL}/applications/${id}`);
        return response.data;
    } catch (error) {
        return { isError: true, message: error.message };
    }
}

async function getApplicationByDCUserId(dcuserId) {
    try {
        const dcUser = await getDCUser(dcuserId);
        if (dcUser.isError) return dcUser;
        return dcUser.user.applications;
    } catch (error) {
        return { isError: true, message: error.message };
    }
}

async function createApplication(application) {
    try {
        const response = await kahlifarApiAxios.post(`${process.env.API_URL}/applications`, application);
        return response.data;
    } catch (error) {
        return { isError: true, message: error.message };
    }
}

async function updateApplication(id, application) {
    try {
        const response = await kahlifarApiAxios.put(`${process.env.API_URL}/applications/${id}`, application);
        return response.data;
    } catch (error) {
        return { isError: true, message: error.message };
    }
}

async function deleteApplication(id) {
    try {
        const response = await kahlifarApiAxios.delete(`${process.env.API_URL}/applications/${id}`);
        return response.data;
    } catch (error) {
        return { isError: true, message: error.message };
    }
}

async function findDouplicates(serviceId, value, applications, isOpen=null) {
    try {
        // Search for douplicate. If isOpen is true, only search for open applications else search for all applications
        const douplicates = applications.filter(application => application.serviceId === serviceId && application.value === value && (isOpen != null ? application.isOpen === isOpen : true));
        return douplicates;
    } catch (error) {
        return { isError: true, message: error.message };
    }
}

async function userHasDouplicates(serviceId, value, dcuserId, isOpen=null) {
    try {
        const applications = await getApplicationByDCUserId(dcuserId);
        if (applications.isError) return applications;
        const douplicates = await findDouplicates(serviceId, value, applications, isOpen);
        return douplicates.length > 0;
    } catch (error) {
        return { isError: true, message: error.message };
    }
}

module.exports = {
    getAllApplications,
    getApplicationById,
    getApplicationByDCUserId,
    createApplication,
    updateApplication,
    deleteApplication,
    findDouplicates,
    userHasDouplicates
}
