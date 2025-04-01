import { createApp } from 'vue'
import App from './App.vue'
import {Line} from 'vue-chartjs'
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, BarController, Title, Tooltip, Legend} from 'chart.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircle, faPause, faDownload, faEye, faTrash, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import FloatingVue from 'floating-vue'

import "./styles.css"; // Import the main stylesheet
import 'floating-vue/dist/style.css' // Import the default style for the tooltips

library.add(faCircle, faPause, faDownload, faEye, faTrash, faCaretUp, faCaretDown);

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, BarController, Title, Tooltip, Legend)


createApp(App)
    .use(FloatingVue)
    .component('chart', Line)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
