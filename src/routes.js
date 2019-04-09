import VueRouter from 'vue-router'
import News from './pages/news.vue'  
import Photos from './pages/photo.vue'  
import Rusttreniya from './pages/rusttreniya.vue'  
import Services from './pages/services.vue'  


export default new VueRouter({
    routes: [
        {
            path: '',
            component: Rusttreniya
        },
        {
            path: '/news',
            component: News
        },
        {
            path: '/gallery',
            component: Photos
        },
        {
            path: '/services',
            component: Services
        }
    ],
    mode: 'history'
}) 
