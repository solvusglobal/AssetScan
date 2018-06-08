function loadJSON(callback) {

   var xobj = new XMLHttpRequest();
       xobj.overrideMimeType("application/json");
   xobj.open('GET', '/data/trimed2.json', true); // Replace 'my_data' with the path to your file
   xobj.onreadystatechange = function () {
         if (xobj.readyState == 4 && xobj.status == "200") {
           // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
           callback(xobj.responseText);
         }
   };
   xobj.send(null);
}

var ctx = document.getElementById("graph").getContext('2d');
var warningCircleText = document.getElementsByClassName("warningCircleText");

var actualGs = {
  label: 'G Force',
  xAxisID: "time-x",
  yAxisID: "G-y",
  borderColor: '#2196F3',
  backgroundColor: '#2196F3',
  data: [],
  borderWidth: 2,
  pointRadius: 0,
  fill: false,
}

var actualPk = {
  label: 'Pk',
  xAxisID: "time-x",
  yAxisID: "Pk-y",
  borderColor: '#00874D',
  backgroundColor: '#00874D',
  data: [],
  borderWidth: 2,
  pointRadius: 0,
  fill: false,
}

// var predicted = {
//   label: 'Predicted',
//   borderColor: '#006AA7',
//   backgroundColor: '#006AA7',
//   fill: false,
//   data: [1, 4, 6, 7, 8, 3, 9, 10, 11, 15, 19, 12],
// }

var failure = {
  label: 'Failure',
  data: Array.apply(null, new Array(70)).map(Number.prototype.valueOf, 35),
  fill: false,
  radius: 0,
  backgroundColor: "#FF8985",
  borderColor: "#FF8985"
}

var times = [];

for (var i = 0; i < 900; i++) {
  times.push(i);
}

// loadJSON(function(res) {
//   var data = JSON.parse(res);
//   times = data.map(obj => {
//     return obj.time;
//   })
//   console.log(times.length);
// });




var config = {
			type: 'line',
			data: {
				labels: times,
				datasets: [ actualGs, actualPk]
			},
			options: {
        // scaleShowHorizontalLines: false,
        legend: {
          position: 'bottom',
          labels: {
            fontSize: 20
          }
        },
        annotation: {
        	annotations: [{
            borderColor: 'red',
            borderDash: [2, 2],
            borderWidth: 2,
            mode: 'vertical',
            type: 'line',
            value: 1,
            scaleID: 'time-x'
          }, {
            borderColor: 'red',
            borderDash: [2, 2],
            borderWidth: 2,
            mode: 'horizontal',
            type: 'line',
            value: 50,
            scaleID: 'G-y'
          }]
        },
        responsive: true,
        maintainAspectRatio: false,
				// tooltips: {
        //   enabled: false,
				// 	mode: 'index',
				// 	intersect: false
				// },
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
            id: "time-x",
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Time',
              fontSize: 15
						},
            ticks: {
              fontSize: 15,
              fontColor: "#707070",
            }
					}],
					yAxes: [{
            id: "G-y",
						display: true,
            position: 'left',
            gridLines: {
              drawOnChartArea: false
            },
						scaleLabel: {
							display: true,
							labelString: 'G Force',
              fontSize: 15
						},
            ticks: {
              // beginAtZero: true,
              // max: 0.4,
              suggestedMin: 3,
              fontSize: 15,
              fontColor: "#2196F3",
            }
					},
          {
            id: "Pk-y",
            display: true,
            position: 'right',
            gridLines: {
              drawOnChartArea: false
            },
            scaleLabel: {
              display: true,
              labelString: 'Pk',
              fontSize: 15
            },
            ticks: {
              max: 0.2,
              fontSize: 15,
              fontColor: "#00874D",
            }
          }]
				}
			}
		};

var toggleSimulation;

loadJSON(function(res) {
  var jsonData = JSON.parse(res);

  config.data.labels = jsonData.map(obj => {

    return obj.time;
  });
  var myLineChart = new Chart(ctx, config);



  var runningSimulation = false;
  var indexOfTimeline = 0;
  var maxGs = -1;
  var warningLevel = 0.2;
  var interval;

  function manageMaxGs(input) {
    if (input > maxGs) {
      maxGs = input;
    }
  }

  function endOfSimulation() {
    clearInterval(interval);
    document.getElementById("switch").checked = true;
    indexOfTimeline = 0;
    maxGs = -1;
    warningLevel = 0.2;
    alertify
    .alert("Simulation Finished!").setHeader('<em> Notice: </em> ');
    actualPk.data = [];
    actualGs.data = [];
  }

  function manageWarningMeter() {
    var newLevel;
    var text;
    if (maxGs >= 30) {
      // CRITICAL
      newLevel = 1;
      // text = "CRITICAL";
    } else if (maxGs >= 25) {
      // HIGH
      newLevel = 0.7;
      // text = "HIGH";
    } else if (maxGs >= 20) {
      // MEDIUM
      newLevel = 0.4;
      // text = "MEDIUM";
    } else {
      // LOW
      newLevel = 0.1;
      // text = "LOW";
    }

    if (newLevel !== warningLevel) {
      warningLevel = newLevel;
      // warningCircleText.innerHTML=text;
      // console.log(warningCircleText);
      // warningCircle.text.innerText = text;
      console.log(warningCircle);
      warningCircle.animate(warningLevel);
    }
  }

  toggleSimulation = function() {
    runningSimulation =  !runningSimulation;
    if (runningSimulation) {
      interval = setInterval(function() {

        var obj = jsonData[indexOfTimeline];
        if (obj == null) {
          endOfSimulation();
        } else {
          var time = obj.time;
          var Pk = obj.Pk;
          var Gs = obj.Gs;
          // Finds if new value is max
          manageMaxGs(Gs);
          actualGs.data.push({x: time, y: Gs});
          actualPk.data.push({x: time, y: Pk});
          myLineChart.update();
          manageWarningMeter();
          indexOfTimeline++;
        }
      }, 40);
    } else {
      myLineChart.update();
      clearInterval(interval);
    }
  }


});
