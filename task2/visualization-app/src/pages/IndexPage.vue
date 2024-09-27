<template>
  <q-page class="flex flex-center">
    <div>
      <h2>Advanced Data Visualization</h2>
      <div id="chart" class="flex flex-center">
        <apexchart type="pie" width="550" :options="chartOptions" :series="series"></apexchart>
      </div>
      <q-btn @click="startDynamicFetch" label="Start Dynamic Fetch" class="q-mt-md" style="margin-right: 20px;" />
      <q-btn @click="goToDataTable" label="View User Data Table" color="primary" class="q-mt-md" />
      <q-btn @click="goToCRUDIndexedDB" label="Start CRUD" class="q-mt-md" style="margin-left: 20px;" />
    </div>
  </q-page>
</template>

<script>
import WebSocketService from '../websocketService'; // Ensure to adjust the path as necessary

export default {
  data() {
    return {
      series: [],
      chartOptions: {
        chart: {
          width: 380,
          type: 'pie',
        },
        labels: [],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 380,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      },
      dynamicFetchActive: false,
    };
  },
  mounted() {
    this.loadInitialData();
  },
  methods: {
    async loadInitialData() {
      try {
        const response = await fetch('/pieChart.json'); // Update the path as needed
        const data = await response.json();
        this.updateChartData(data);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    },
    updateChartData(data) {
      this.series = data.map(item => item.numInstalls);
      const labels = data.map(item => item.year);
      for (let i = 0; i < labels.length; i++) {
        this.chartOptions.labels[i] = labels[i];
      }
    },
    startDynamicFetch() {
      if (!this.dynamicFetchActive) {
        this.dynamicFetchActive = true;
        WebSocketService.connect('ws://localhost:8080');
        WebSocketService.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.updateChartData(data);
        };
      }
    },
    goToDataTable() {
      this.$router.push('/data-table'); // Navigate to the data table page
    },
    goToCRUDIndexedDB() {
      
    },
  },
};
</script>
