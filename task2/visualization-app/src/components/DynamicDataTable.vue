<template>
    <q-page class="flex flex-center">
      <div>
        <h2>User Data Table</h2>
  
        <q-input
          filled
          v-model="globalSearch"
          label="Global Search"
          class="q-mb-md"
        />
  
        <q-select
            filled
            v-model="selectedDesignation"
            :options="designationOptions"
            label="Filter by Designation"
            @input="filterData"
            class="q-mb-md"
            emit-value 
            map-options 
        />
  
        <q-table
          :rows="paginatedUsers"
          :columns="columns"
          row-key="id"
          :loading="loading"
        >
          <template v-slot:top-right>
            <q-pagination
              v-model="pagination.page"
              :max="maxPage"
              @update:model-value="page => pagination.page = page"
              class="q-mb-md"
            />
          </template>
        </q-table>
      </div>
    </q-page>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        users: [],
        filteredUsers: [],
        globalSearch: '',
        selectedDesignation: null,
        designationOptions: [],
        pagination: {
          page: 1,
          rowsPerPage: 10,
        },
        loading: true,
      };
    },
    computed: {
      columns() {
        return [
          { name: 'id', label: 'ID', align: 'left', field: 'id' },
          { name: 'name', label: 'Name', align: 'left', field: 'name' },
          { name: 'designation', label: 'Designation', align: 'left', field: 'designation' },
          { name: 'department', label: 'Department', align: 'left', field: 'department' },
        ];
      },
      maxPage() {
        return Math.ceil(this.filteredUsers.length / this.pagination.rowsPerPage);
      },
      paginatedUsers() {
        const start = (this.pagination.page - 1) * this.pagination.rowsPerPage;
        const end = start + this.pagination.rowsPerPage;
        return this.filteredUsers.slice(start, end);
      },
    },
    watch: {
      globalSearch() {
        this.filterData();
      },
      selectedDesignation() {
        this.filterData();
      },
    },
    methods: {
      async fetchData() {
        try {
          const response = await axios.get('/users.json'); // Adjust the path if necessary
          this.users = response.data;
          this.filteredUsers = this.users; // Initial filtering
          this.setDesignationOptions();
          this.loading = false;
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      },
      setDesignationOptions() {
        const designations = new Set(this.users.map(user => user.designation));
        this.designationOptions = Array.from(designations).map(d => ({ label: d, value: d }));
      },
      filterData() {
        this.filteredUsers = this.users.filter(user => {
          // Check if global search is empty
          const matchesSearch = this.globalSearch === '' || user.name.toLowerCase().includes(this.globalSearch.toLowerCase());
            var matchesDesignation;
          // Matches designation only if selectedDesignation is not null
        //   const matchesDesignation = this.selectedDesignation ? user.designation === this.selectedDesignation : true;
          if(user.designation == this.selectedDesignation){
            matchesDesignation = true;
          }else{
            matchesDesignation = false;
          }
        //   console.log(`User Desg: ${user.designation} vs selected Desg: ${this.selectedDesignation}`);
        //     console.log(matchesDesignation)
          return matchesSearch && matchesDesignation;
        });
  
        // Reset pagination to the first page whenever filtering occurs
        this.pagination.page = 1;
      },
    },
    mounted() {
      this.fetchData();
    },
  };
  </script>
  
  <style scoped>
  .q-page {
    padding: 20px;
  }
  </style>
  