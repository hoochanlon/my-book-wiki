<template>
  <ClientOnly>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps<{
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea'
  data: any
  options?: any
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: any = null
let Chart: any = null

const createChart = async () => {
  if (!chartCanvas.value) return
  
  // 动态导入 Chart.js（仅在客户端）
  if (!Chart) {
    const chartModule = await import('chart.js')
    Chart = chartModule.Chart
    
    // 注册所有必要的组件
    Chart.register(
      chartModule.CategoryScale,
      chartModule.LinearScale,
      chartModule.PointElement,
      chartModule.LineElement,
      chartModule.BarElement,
      chartModule.ArcElement,
      chartModule.RadialLinearScale,
      chartModule.Title,
      chartModule.Tooltip,
      chartModule.Legend,
      chartModule.Filler,
      // 注册控制器
      chartModule.LineController,
      chartModule.BarController,
      chartModule.PieController,
      chartModule.DoughnutController,
      chartModule.RadarController,
      chartModule.PolarAreaController
    )
  }
  
  if (chartInstance) {
    chartInstance.destroy()
  }

  const config = {
    type: props.type,
    data: props.data,
    options: props.options || {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
        },
      }
    }
  }

  chartInstance = new Chart(chartCanvas.value, config)
}

onMounted(async () => {
  await nextTick()
  await createChart()
})

watch(() => [props.type, props.data, props.options], async () => {
  await createChart()
}, { deep: true })
</script>

<style scoped>
.chart-container {
  max-width: 100%;
  margin: 1.5rem 0;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

canvas {
  max-width: 100%;
  height: auto;
}
</style>
