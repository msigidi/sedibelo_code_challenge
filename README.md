Fullstack Developer Assessment
This project demonstrates secure user data handling and reporting through a console-based application, along with a full-stack web application using Node.js and Quasar for user data management, real-time updates, and reporting. The solution covers encryption, NoSQL database integration, scalable data processing, and optimized frontend/backend architecture.

Features
1. Console-Based Application (Node.js)
    Simulate Secure Login Form Submission: Users can securely submit login information.
    Data Handling, Deduplication & Performance Optimization: User data is deduplicated and optimized for performance.
    Simulate Secure User Data Posting: Submit encrypted user data.
    Engineering Department Reporting: Generate reports on the engineering department's user data.
    WebSocket Client Simulation: Simulates real-time communication with WebSockets.
2. Fullstack Web Application
    Dynamic Data Table: Displays user data with global search, designation filtering, and pagination.
    Real-Time Pie Chart: Visualizes dynamic user data updates via WebSockets.
    Secure IndexedDB Operations: Data stored in IndexedDB is encrypted to ensure privacy.
    RESTful API: Manages user data via JSON-based endpoints for adding, updating, and displaying users.
   
Tech Stack
1. Node.js: Backend server for API, WebSockets, and console app logic.
2. Quasar Framework (Vue.js): Frontend framework for user data management and visualization.
3. MongoDB: NoSQL databases for scalable and efficient data storage.
4. bcrypt: For secure password encryption.
5. crypto-js: For secure file encryption (alternative to crypto).
6. uuid: To generate unique IDs for users.
7. axios: To handle API requests.
8. csv-writer: For generating CSV reports from user data.

How To Run the Program

Task 1: Running the Node.js Application
1. Extract the project zip file to your desired folder.
2. Open the extracted folder in a terminal.
3. Install the necessary dependencies:
    npm install
4. Run the Node.js application:
    node app.js
   
Task 2: Running the Quasar Frontend Application
Step-by-Step Instructions
1. Open a terminal.
2. Navigate to the visualization-app folder within the project:
    cd task2/visualization-app
3. Install the necessary dependencies:
    npm install
4. Run the backend server (required for data handling):
    node task4-server.js
5. Start the Quasar frontend development environment:
    quasar dev



Console-Based Application Operations
Simulate Login Submission: Encrypt user credentials using bcrypt and send them to the backend.
Deduplication: Handle large user datasets efficiently, removing duplicates before storage.
Secure Data Posting: Securely post user data using AES-256 encryption.
Department Reporting: Retrieve and display user data filtered by the engineering department.
WebSocket Simulation: Simulate real-time communication with WebSocket clients.
Web Application API Endpoints
/uniqueUsers: Display the unique users stored in uniqueUsers.json.
/orderedUsers: Display users ordered by department and designation.
/addUser: Add a new user (POST request with user details).
/updateUser: Update an existing user (PUT request).
Security & Optimization
Encryption: All sensitive user data is encrypted using AES-256 both in the console application and frontend IndexedDB storage.
Rate Limiting & Retry Mechanisms: Protect the API from brute-force attacks and retry failed requests for idempotency.
Data Streaming: Optimized for handling large datasets with minimal memory usage.
NoSQL Optimization: Efficient querying and deduplication for large datasets using MongoDB/ArangoDB.
WebSocket Integration: Ensures real-time communication without page reloads.
Performance Considerations
Pagination and Lazy Loading: Frontend data tables use pagination and lazy loading to handle large datasets efficiently.
IndexedDB Security: Data stored on the client-side is encrypted for privacy.
Real-Time Updates: WebSockets provide instant updates between backend and frontend for data changes.
Scalability Considerations
NoSQL Database: The use of MongoDB/ArangoDB ensures the solution can scale horizontally as the dataset grows.
Microservice Architecture: The modular API design can be easily separated into services for better scalability.
Containerization: The application can be Dockerized for easier deployment in cloud environments.
Notes
Ensure MongoDB/ArangoDB is installed and running for database operations.
Retry mechanisms for failed API requests ensure reliable data handling.
The application is built to scale, with security and performance optimizations at every step.
Conclusion
This project showcases the implementation of a secure, scalable, and optimized full-stack solution. It combines secure data handling, encryption, and real-time updates, ensuring efficient user management. The modular structure allows for easy future enhancements and scalability as needed.
