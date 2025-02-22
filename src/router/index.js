import { createRouter, createWebHistory } from 'vue-router'
import MaintenanceView from "@/views/MaintenanceView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: MaintenanceView },
  ],
})

export default router
