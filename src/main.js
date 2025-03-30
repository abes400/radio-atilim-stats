import { createApp } from 'vue'
import App from './App.vue'
import {Line} from 'vue-chartjs'
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, BarController, Title, Tooltip, Legend} from 'chart.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircle, faPause, faDownload, faEye, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import "./styles.css"; // Import the main stylesheet

library.add(faCircle, faPause, faDownload, faEye, faTrash);

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, BarController, Title, Tooltip, Legend)


createApp(App)
    .component('chart', Line)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
