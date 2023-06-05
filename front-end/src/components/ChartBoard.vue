<template>
    <div>
      <canvas ref="burndownChart"></canvas>
    </div>
  </template> 

<script lang="ts">
import { Chart as ChartJS } from 'chart.js/auto'

export default {
  data() {
    return {
      sprintData: [
        { day: 'Jour 1', remainingEstimate: 0 },
        { day: 'Jour 2', remainingEstimate: 0 },
        { day: 'Jour 3', remainingEstimate: 0 },
        { day: 'Jour 4', remainingEstimate: 0 },
        { day: 'Jour 5', remainingEstimate: 0 },
        { day: 'Jour 6', remainingEstimate: 0 },
        { day: 'Jour 7', remainingEstimate: 0 }
      ]
    };
  },

  mounted() {
      const userStories = [
        { estimation: 150 },
        { estimation: 120 } 
      ];
      const sprintData = [
        { day: 'Jour 1', remainingEstimate: 250 },
        { day: 'Jour 2', remainingEstimate: 200 }
       
      ];
  
  
      this.updateSprintData(userStories);
      this.generateBurndownChart();
    },
  

    methods: {
      updateSprintData(userStories) {
        const totalEstimation = userStories.reduce((total, story) => total + story.estimation, 0);
        const estimationPerDay = Math.ceil(totalEstimation / 7);
  
        let remainingEstimate = totalEstimation;
        for (let i = 0; i < this.sprintData.length; i++) {
          if (remainingEstimate >= estimationPerDay) {
            this.sprintData[i].remainingEstimate = remainingEstimate;
            remainingEstimate -= estimationPerDay;
          } else {
            this.sprintData[i].remainingEstimate = remainingEstimate;
            remainingEstimate = 0;
          }
        }
      },

      generateBurndownChart() {
        const chartData = {
          labels: this.sprintData.map(data => data.day),
          datasets: [{
            label: 'Estimation restante',
            data: this.sprintData.map(data => data.remainingEstimate),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        };
    const chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Jours'
              }
            },
         y: {
              display: true,
              title: {
                display: true,
                text: 'Estimation restante (minutes)'
              }
            }
          }
        };
  
         const ctx = this.$refs.burndownChart.getContext('2d');
         new ChartJS(ctx, {
          type: 'line',
          data: chartData,
          options: chartOptions
        });
      }
    }
  }
  </script>
  
  <style>
  canvas {
    width: 100%;
    height: 400px;
  }
  </style>