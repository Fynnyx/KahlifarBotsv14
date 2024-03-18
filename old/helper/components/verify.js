function randomAddSub() {
    // Generate two random numbers between 0 and 100
    const num1 = Math.floor(Math.random() * 101);
    const num2 = Math.floor(Math.random() * 101);

    // Generate a random boolean value to determine whether to add or subtract
    const isAddition = Math.random() < 0.5;

    // Compute the result of the addition or subtraction
    const result = isAddition ? num1 + num2 : num1 - num2;

    // If the result is less than 0 or greater than 100, generate a new problem
    if (result < 0 || result > 100) {
        return randomAddSub();
    }

    // Otherwise, return the problem as a string
    const operator = isAddition ? "+" : "-";


    // Create an array with 4 random numbers between 0 and 100
    // And add the correct answer to the array
    const answers = [result];
    while (answers.length < 5) {
        const randomAnswer = Math.floor(Math.random() * 101);
        if (!answers.includes(randomAnswer)) {
            answers.push(randomAnswer);
        }
    }

    // Shuffle the array
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    const  returnObject = {
        calculation: `${num1} ${operator} ${num2}`,
        result: result,
        answers: answers
    }
    return returnObject;
}

module.exports = {
    randomAddSub
};