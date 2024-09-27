import { boot } from 'quasar/wrappers';
import VueApexCharts from 'vue3-apexcharts';

export default boot(({ app }) => {
  // Register ApexCharts globally
  app.use(VueApexCharts);
});
