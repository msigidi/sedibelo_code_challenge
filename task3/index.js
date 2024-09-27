const inquirer = require('inquirer').default;
const dbService = require('./dbService');

// Function to handle the selected CRUD operation
function handleCRUDOperation(operation) {
  switch (operation) {
    case 'Add User':
      addUserPrompt();
      break;
    case 'View User':
      viewUserPrompt();
      break;
    case 'Update User':
      updateUserPrompt();
      break;
    case 'Delete User':
      deleteUserPrompt();
      break;
    default:
      console.log('Invalid option');
  }
}

// UI to choose the operation
function chooseOperation() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'operation',
        message: 'Which operation would you like to perform?',
        choices: ['Add User', 'View User', 'Update User', 'Delete User'],
      },
    ])
    .then((answers) => {
      handleCRUDOperation(answers.operation);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Prompt for adding a user
function addUserPrompt() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Enter user ID:',
        validate: (input) => {
          // Ensure the input is a number
          const id = parseInt(input);
          return !isNaN(id) && id > 0 ? true : 'Please enter a valid positive ID';
        },
      },
      {
        type: 'input',
        name: 'name',
        message: 'Enter user name:',
      },
      {
        type: 'input',
        name: 'email',
        message: 'Enter user email:',
      },
    ])
    .then((answers) => {
      dbService.addUser(answers.id, answers.name, answers.email);
      console.log('User added successfully!');
      chooseOperation(); // Go back to menu
    });
}

// Prompt for viewing a user
function viewUserPrompt() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Enter user ID:',
      },
    ])
    .then((answers) => {
      dbService.getUser(parseInt(answers.id));
      setTimeout(() => chooseOperation(), 1000); // Go back to menu after a delay
    });
}

// Prompt for updating a user
function updateUserPrompt() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Enter user ID to update:',
      },
      {
        type: 'input',
        name: 'name',
        message: 'Enter new user name:',
      },
      {
        type: 'input',
        name: 'email',
        message: 'Enter new user email:',
      },
    ])
    .then((answers) => {
      dbService.updateUser(parseInt(answers.id), answers.name, answers.email);
      console.log('User updated successfully!');
      chooseOperation(); // Go back to menu
    });
}

// Prompt for deleting a user
function deleteUserPrompt() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Enter user ID to delete:',
      },
    ])
    .then((answers) => {
      dbService.deleteUser(parseInt(answers.id));
      console.log('User deleted successfully!');
      chooseOperation(); // Go back to menu
    });
}

// Start the application
chooseOperation();