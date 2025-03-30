import { createApp } from 'vue'
import App from './App.vue'
import {Line} from 'vue-chartjs'
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, BarController, Title, Tooltip, Legend} from 'chart.js'
import "./styles.css"; // Import the main stylesheet

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, BarController, Title, Tooltip, Legend)


createApp(App).component('chart', Line).mount('#app')
