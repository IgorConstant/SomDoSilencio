// Este arquivo registra os controllers do Chart.js para uso com ng2-charts
import { registerables } from 'chart.js';
import { Chart } from 'chart.js';

Chart.register(...registerables);
