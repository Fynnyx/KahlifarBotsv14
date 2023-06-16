const { birthdayTask } = require('./birthday');

// Start all jobs
function startJobs() {
    birthdayTask.start();
    return 1
}

// Export
module.exports = { startJobs };