function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function addData(chart, dt) {
    chart.data.labels.push(dt.toUTCString());
    chart.data.datasets[0].data.push(getRandomInt(30));
    chart.update();
}

function init() {
  var dt = new Date();
  var ctx = document.getElementById('myChart').getContext('2d');
  var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
          labels: ["1","1","1","1","1","1","1","1","1","1","1","1","1"],
          datasets: [{
              label: "My First dataset",
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: [0],
          }]
      },

      // Configuration options go here
      options: {}
  });

  window.setInterval(() => {addData(chart, dt)}, 3000);

}

init();
