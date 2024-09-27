const axios = require('axios');
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');
const rateLimit = require('rate-limiter-flexible').RateLimiterMemory;
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const { Transform } = require('stream');
const path = require('path');
const WebSocket = require('ws');


const uri = "mongodb+srv://mock95200:VPyvvmJTAMHkKNK3@clusterdb.vhi30.mongodb.net/"; // MongoDB connection URI
const client = new MongoClient(uri);

// Function to encrypt users.json file using AES
const encryptFile = (users, password) => {
    const jsonString = JSON.stringify(users);
    const key = crypto.createHash('sha256').update(password).digest(); // 32-byte key
    const iv = crypto.randomBytes(16); // Random IV

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(jsonString, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Store IV with encrypted data for decryption
    const ivHex = iv.toString('hex');
    const encryptedData = { iv: ivHex, data: encrypted };

    fs.writeFileSync('users.json', JSON.stringify(encryptedData));
};

  // Function to decrypt the users.json file
const decryptFile = (password) => {
    const encryptedData = JSON.parse(fs.readFileSync('users.json', 'utf8'));
    const key = crypto.createHash('sha256').update(password).digest(); // 32-byte key
    const iv = Buffer.from(encryptedData.iv, 'hex'); // Use the stored IV

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted;
    try {
        decrypted = decipher.update(encryptedData.data, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
    } catch (error) {
        console.error('Decryption failed:', error.message);
        return null; // Return null on failure
    }

    return JSON.parse(decrypted);
};

// async function createIndexes() {
//     try {
//         await client.connect();
//         const db = client.db('test');
//         const collection = db.collection('uniqueUsers');

//         // Create compound index on department, designation, and reportsTo
//         await collection.createIndex({ department: 1, designation: 1, reportsTo: 1 });
//         console.log('Indexes created');
//     } catch (error) {
//         console.error('Error creating indexes:', error);
//     } finally {
//         await client.close();
//     }
// }

// Simulate Secure Login Form Submission
const simulateSecureLogin = async () =>  {
    console.log("Simulating secure login...");
    // Initialize rate limiting to allow 5 attempts per minute
    const rateLimiter = new rateLimit({
        points: 5, // max number of requests
        duration: 60, // per minute
    });
    
    // Create an HTTPS agent
    const agent = new https.Agent({  
        rejectUnauthorized: false // Skip self-signed cert errors (ONLY FOR TESTING; IN PRODUCTION, VALIDATE SSL)
    });
    
    // Form data to be submitted
    const formData = {
        username: 'murunwasigidi1@gmail.com',
        password: '93700E834D1',
        action: 'LOGIN',
    };

    // Simulate form submission
    async function submitForm() {
        try {
            await rateLimiter.consume(formData.username); // Apply rate limiting
            
            const response = await axios.post(
                'https://challenge.sedilink.co.za:12022', 
                formData, 
                { httpsAgent: agent }
            );
            
            // Assuming response contains JSON with session token and list of users
            const { token, users } = response.data;
            
            // Save users array to users.json (encrypted)
            // const encryptionPassword = bcrypt.hashSync(formData.password, 10); // Use bcrypt hash of password for encryption
            encryptFile(users, formData.password);
            
            // console.log('Login successful:', token);
            return token;
            // Call the processUsers function
            // postUserData(token)
            // .then(() => {
            //     console.log('User data posting completed.');
            // })
            // .catch(error => {
            //     console.error('Error during user data posting:', error.message);
            // });
        } catch (err) {
            if (err.response && err.response.status === 429) {
                console.error('Rate limit exceeded. Try again later.');
            } else {
                // console.error('Error during form submission:', err.message);
                console.error('Error during form submission:', err.response ? err.response.data : err.message);
            }
        }
    }

    return submitForm();
    
};

const createCSVWithUserDuplicates = (password) => {
    const outputPath = path.join(__dirname, 'users.csv');
    const users = decryptFile(password);
    if (!Array.isArray(users)) {
      console.error("Decryption failed or users is not an array.");
      return;
    }
  
    const userCounts = {};
  
    // Count occurrences
    users.forEach(user => {
      const key = `${user.name}|${user.surname}`; 
      if (userCounts[key]) {
        userCounts[key].count += 1;
      } else {
        userCounts[key] = {
          name: user.name,
          surname: user.surname,
          count: 1,
        };
      }
    });
  
    // Create a write stream
    const writeStream = fs.createWriteStream(outputPath);
    
    // Write CSV header
    writeStream.write('Name,Surname,Number of Times Duplicated\n');
  
    // Create a transform stream to convert userCounts to CSV format
    const csvTransform = new Transform({
      transform(chunk, encoding, callback) {
        const user = userCounts[chunk];
        const csvLine = `${user.name},${user.surname},${user.count}\n`;
        this.push(csvLine);
        callback();
      },
      writableObjectMode: true,
    });
  
    // Write userCounts to CSV
    Object.keys(userCounts).forEach(key => {
      csvTransform.write(key); // Push each key (unique user) to transform
    });
  
    // Pipe transform stream to write stream
    csvTransform.pipe(writeStream).on('finish', () => {
      console.log(`CSV file created at ${outputPath}`);
    });
  
    // Error handling
    writeStream.on('error', (error) => {
      console.error('Error writing CSV:', error);
    });
};

// Data Handling, Deduplication, and Performance Optimization
const createUniqueUsers  = async (password) => {
    const users = decryptFile(password);
    if (!Array.isArray(users)) {
        console.error("Decryption failed or users is not an array.");
        return;
    }

    const uniqueUsersSet = new Set(); // To track unique identifiers
    const uniqueUsersArray = []; // To store unique user objects

    // Process each user in the decrypted array
    for (const user of users) {
        // Create a composite unique key
        const compositeKey = `${user.name}|${user.surname}|${user.department}|${user.designation}`;
        
        if (!uniqueUsersSet.has(compositeKey)) {
        uniqueUsersSet.add(compositeKey);
        const newUser = { ...user, id: uuidv4() }; // Add UUID for unique users
        uniqueUsersArray.push(newUser); // Collect unique users
        }
    }

    // Create or overwrite the uniqueUsers.json file
    const outputFilePath = 'uniqueUsers.json';

    // Write to the file
    fs.writeFileSync(outputFilePath, JSON.stringify({ uniqueUsers: uniqueUsersArray }, null, 2));

    console.log('Created/Updated uniqueUsers.json with unique users only based on composite keys.');
    createCSVWithUserDuplicates(password);
    // console.log('Created/Updated uniqueUsers.json with unique and duplicate users.');
};

// Simulate Secure User Data Posting
const simulateSecureUserPosting = async (token) => {
    // Load and parse uniqueUsers.json
    const uniqueUsersData = JSON.parse(fs.readFileSync('uniqueUsers.json', 'utf8'));
    const uniqueUsers = uniqueUsersData.uniqueUsers;

    for (const user of uniqueUsers) {
        // Construct the payload
        const payload = {
            name: user.name,
            surname: user.surname,
            designation: user.designation,
            department: user.department,
            id: user.id,
            token: token, // Use the token received during login
            action: "ADDUSER"
        };

        // Implementing retries and error handling
        const maxRetries = 3;
        let attempts = 0;
        let success = false;

        while (attempts < maxRetries && !success) {
            try {
                // Ensure HTTPS protocol is used
                const response = await axios.post('https://challenge.sedilink.co.za:12022', payload, {
                    headers: {
                        'Content-Type': 'application/json', // Ensure correct content type
                    },
                });
                console.log(`Successfully posted user: ${user.name} ${user.surname}, Response:`, response.data);
                success = true; // Exit the loop on success
            } catch (error) {
                attempts++;
                console.error(`Failed to post user: ${user.name} ${user.surname}. Attempt: ${attempts}`, error.message, error.response.data);

                // If the maximum number of retries is reached, log an error
                if (attempts >= maxRetries) {
                    console.error(`Error posting user after ${maxRetries} attempts:`, error.message);
                }

                // Optionally implement a short delay before retrying to avoid overwhelming the server
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
            }
        }
    }
};

// Engineering Department Reporting
const countReporteesToMichaelPhalane = async () => {
    try {
        await client.connect();
        const db = client.db('test');
        const collection = db.collection('uniqueUsers');

        await collection.createIndex({ department: 1, designation: 1});

        // Query to find mechanics and mechanic assistants in Engineering department reporting to Michael Phalane
        const query = {
            department: 'ENGINEERING',
            designation: { $in: ['MECHANIC', 'MECHANIC ASSISTANT'] }
        };
  
        // Count documents matching the query
        const reporteeCount = await collection.countDocuments(query);
  
        console.log(`Total number of people reporting to Michael Phalane: ${reporteeCount}`);
        return reporteeCount;
    } catch (error) {
        console.error('Error querying data:', error);
    } finally {
        await client.close();
    }
};

// WebSocket Client - Placeholder Function
const startWebSocketClient = (user_input) => {
    console.log("Starting WebSocket client...");
    // Replace this with the string you want to send
    const originalString = String(user_input);

    // Create a WebSocket client and connect to the server
    const ws = new WebSocket('wss://challenge.sedilink.co.za:3006');

    ws.on('open', function open() {
        console.log('WebSocket connection established.');
        
        // Send the original string
        ws.send(originalString);
        console.log(`Sent: ${originalString}`);
    });

    ws.on('message', function incoming(data) {
        console.log(`Received: ${data}`);
        
        // Reverse the original string
        const reversedString = originalString.split('').reverse().join('');
        console.log(`deb. ${reversedString}`);
        // Verify the returned string matches the reversed version
        if (String(data) === String(reversedString)) {
            console.log('The received string matches the expected reversed string.');
        } else {
            console.error('Mismatch: The received string does not match the expected reversed string.');
        }
        
        // Close the connection after receiving the message
        ws.close();
    });

    ws.on('error', function (error) {
        console.error(`WebSocket error: ${error.message}`);
    });

    ws.on('close', function () {
        console.log('WebSocket connection closed.');
        console.log("=======================================");
    });
};

module.exports = {
    simulateSecureLogin,
    createUniqueUsers,
    simulateSecureUserPosting,
    countReporteesToMichaelPhalane,
    startWebSocketClient
};
