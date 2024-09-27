const readline = require('readline');


const password = '93700E834D1'; //In production will be store in enviroment variables

// Import the functions for each task
const {
    simulateSecureLogin,
    createUniqueUsers,
    simulateSecureUserPosting,
    countReporteesToMichaelPhalane,
    startWebSocketClient
} = require('./components/module_funtions.js');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Main function to display menu and handle user input
const mainMenu = async () => {
    let exit = false; // Flag to control the loop
    let token = ""; // Store token for user authentication

    do {
        console.log("Which action do you want to perform?");
        console.log("1. Simulate Secure Login Form Submission");
        console.log("2. Data Handling, Deduplication, and Performance Optimization");
        console.log("3. Simulate Secure User Data Posting");
        console.log("4. Engineering Department Reporting");
        console.log("5. WebSocket Client");
        console.log("6. Exit");

        const choice = await new Promise(resolve => {
            rl.question("Enter your choice: ", answer => {
                resolve(answer);
            });
        });

        switch (choice) {
            case '1':
                token = await simulateSecureLogin(); // Await the login process
                console.log(`Login successful. Token: ${token}`);
                console.log("=======================================");
                await new Promise(resolve => setTimeout(resolve, 1000));
                break;
            case '2':
                // const password = await new Promise(resolve => {
                //     rl.question("Enter password to decrypt users.json: ", answer => {
                //         resolve(answer);
                //     });
                // });
                await createUniqueUsers(password); // Await the user creation process
                console.log("=======================================");
                await new Promise(resolve => setTimeout(resolve, 1000));
                break;
            case '3':
                token = await simulateSecureLogin();
                if (!token) {
                    console.log("Please login first to obtain a token.");
                    break;
                }
                await simulateSecureUserPosting(token); // Await posting process
                console.log("=======================================");
                await new Promise(resolve => setTimeout(resolve, 1000));
                break;
            case '4':
                await countReporteesToMichaelPhalane(); // Await the reporting process
                console.log("=======================================");
                await new Promise(resolve => setTimeout(resolve, 1000));
                break;
            case '5':
                const user_input = await new Promise(resolve => {
                    rl.question("Enter string (to be reversed): ", answer => {
                        resolve(answer);
                    });
                });
                const inputAsString = String(user_input);
                startWebSocketClient(inputAsString);
                await new Promise(resolve => setTimeout(resolve, 1000));
                break;
            case '6':
                console.log("Exiting...");
                exit = true; // Set the exit flag to true to break the loop
                break;
            default:
                console.log("Invalid choice. Please try again.");
        }
    } while (!exit); // Continue looping until exit flag is true

    rl.close(); // Close the readline interface
};

// Start the console application
mainMenu();
