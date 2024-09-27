const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '', 
        component: () => import('pages/IndexPage.vue') 
      },
      { 
        path: 'data-table', // Define the path for the data table
        component: () => import('components/DynamicDataTable.vue') // Load the DynamicDataTable component
      },
      { 
        path: 'CRUD', // Define the path for the data table
        component: () => import('components/indexedDB.vue') // Load the DynamicDataTable component
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes;
