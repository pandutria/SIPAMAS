import { createRouter, createWebHistory } from 'vue-router';


const routes = [
    {
        path: "/",
        name: "Landing Page",
        component: () => import("../page/Landing.vue")
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;