<template>
  <div class="h-56"> <!-- control height from the container -->
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { Bar } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title,
  } from 'chart.js'

  ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

  const props = defineProps({
    labels: { type: Array, default: () => ['Pizza', 'Burritos', 'Sushi'] },
    values: { type: Array, default: () => [12, 8, 5] },
    title:  { type: String, default: 'Live results (demo)' },
  })

  const chartData = computed(() => ({
    labels: props.labels,
    datasets: [{
      label: 'Votes',
      data: props.values,
      borderRadius: 8,
      barThickness: 36,
    }],
  }))

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: props.title },
      tooltip: { intersect: false, mode: 'index' },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 2 } },
    },
  }
</script>
