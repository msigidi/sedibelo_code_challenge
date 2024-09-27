<template>
  <q-page class="q-pa-md">
    <q-btn @click="addUser" label="Add User" color="primary" />
    <q-btn @click="getUser" label="Get User" color="secondary" />
    <q-btn @click="updateUser" label="Update User" color="warning" />
    <q-btn @click="deleteUser" label="Delete User" color="negative" />
  </q-page>
</template>

<script>
import { addData, getData, updateData, deleteData } from '../services/indexedDBService';

export default {
  methods: {
    async addUser() {
      const userData = { name: 'John Doe', email: 'john.doe@example.com' };
      await addData(userData);
      console.log('User added');
    },

    async getUser() {
      const userId = 1; // Example user ID
      const user = await getData(userId);
      console.log('User data:', user);
    },

    async updateUser() {
      const userId = 1; // Example user ID
      const updatedData = { name: 'Jane Doe', email: 'jane.doe@example.com' };
      await updateData(userId, updatedData);
      console.log('User updated');
    },

    async deleteUser() {
      const userId = 1; // Example user ID
      await deleteData(userId);
      console.log('User deleted');
    },
  },
};
</script>
