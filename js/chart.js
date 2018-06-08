


ttfCircle = new ProgressBar.SemiCircle('.ttfText', {
    strokeWidth: 6,
    color: '#FFEA82',
    trailColor: '#4B4B4B',
    trailWidth: 2,
    easing: 'easeInOut',
    duration: 1400,
    svgStyle: null,
    text: {
    value: '',
      alignToBottom: false
    },
    from: {color: '#FFEA82'},
    to: {color: '#ED6A5A'},
    step: (state, bar) => {
      bar.path.setAttribute('stroke', state.color);
      bar.setText('')
      bar.text.style.color = state.color;
    }
  });
  ttfCircle.text.style.fontFamily = '"Roboto", sans-serif';
  ttfCircle.text.style.fontSize = '1.7rem';

  ttfCircle.timeScale = "days";

  ttfCircle._progressPath._opts.step = function(state, bar) {
      bar.path.setAttribute('stroke', state.color);
      var value = bar.value();
      // var timeScale = this.timeScale;
      // if (timeScale === "days") {
      //   // days
      // } else {
      //   //hours
      //
      // }

      bar.setText(ttfCircle.timeScale);





      // var value = bar.value()
      // if (value <= 0.000001) {
      //   bar.setText('')
      // } else {
      //   var days = 10 - (Math.round(value * 10));
      //   if (days === 1) {
      //     bar.setText(days + " day")
      //   } else if (days === 0) {
      //     days
      //     bar.setText("Today")
      //   } else {
      //     bar.setText(days + " days")
      //   }
      // }
      // this.getTimeScale()
      bar.text.style.color = state.color;
  }



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

function loadJSONPred(callback) {
  var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
  xobj.open('GET', '/data/predictedTrimmed.json', true); // Replace 'my_data' with the path to your file
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
var rangeSlider = document.getElementById("range-slider");

var actualGs = {
  label: "Peak Fault (G's)",
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
  label: 'Overall Vibration (in/sec)',
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
var sliderChange;
var resetButtonClick;

loadJSON(function(res) {
  loadJSONPred(function(resPred) {
    var predJSONData = JSON.parse(resPred);
    var jsonData = JSON.parse(res);

    config.data.labels = jsonData.map(obj => {

      return obj.time;
    });
    var myLineChart = new Chart(ctx, config);

    var runningSimulation = false;
    var indexOfTimeline = 0;
    var maxGs = -1;
    var warningLevel = 0.2;
    var ttfLevel = 0.2;
    var trueTTF = 7;
    var interval;
    var speedOfGraph = 110;

    function manageMaxGs(input) {
      if (input > maxGs) {
        maxGs = input;
      }
    }

    function manageTTF(input) {
      if (input !== trueTTF) {
        trueTTF = input
      }
    }

    resetButtonClick = function() {
      clearInterval(interval);
      document.getElementById("switch").checked = false;
      runningSimulation =  false;
      indexOfTimeline = 0;
      maxGs = -1;
      warningLevel = 0.2;
      actualPk.data = [];
      actualGs.data = [];
      myLineChart.update();
      warningCircle.animate(0);
      ttfCircle.animate(0);
        ttfCircle.timeScale = '';
      ttfCircle.text.innerText = '';
      warningCircle.text.innerText = '';
    }

    function endOfSimulation() {
      clearInterval(interval);
      // alertify
      // .alert("Simulation Finished!").setHeader('<em> Notice: </em> ');
      // alertify.confirm('Confirm Title', 'Confirm Message', function(){
      //   alertify.success('Ok') }
      //             , function(){ alertify.error('Cancel')});
      alertify
      .alert("Simulation Finished!", function(){
        // alertify.message('OK');
        document.getElementById("switch").checked = false;
        runningSimulation =  false;
        indexOfTimeline = 0;
        maxGs = -1;
        warningLevel = 0.2;
        trueTTF = 7;
        actualPk.data = [];
        actualGs.data = [];
        myLineChart.update();
        warningCircle.animate(0);
        ttfCircle.animate(0);
        ttfCircle.timeScale = '';
        ttfCircle.text.innerText = '';
        warningCircle.text.innerText = '';
      });

    }

    function manageTTFMeter(hours) {
      if (hours !== trueTTF) {
        trueTTF = hours;
        // trueTTF is now updated!
        ttfCircle.animate(1 - trueTTF/10);
        // ttfLevel.
      }
    }


    function manageWarningMeter() {
      var newLevel;
      if (maxGs >= 38) {
        // CRITICAL
        newLevel = 1;
      } else if (maxGs >= 28) {
        // HIGH
        newLevel = 0.7;
        // text = "HIGH";
      } else if (maxGs >= 23) {
        // MEDIUM
        newLevel = 0.4;
      } else {
        // LOW
        newLevel = 0.1;
      }

      if (newLevel !== warningLevel) {
        warningLevel = newLevel;
        warningCircle.animate(warningLevel);
      }
    }

    toggleSimulation = function() {
      // sliderChange = function(sliderValue) {
        runningSimulation =  !runningSimulation;
        if (runningSimulation) {
          interval = setInterval(function() {

            var predObj = predJSONData[indexOfTimeline];
            if (predObj == null) {

            } else {
              var step = predObj.ttf;
              var minutes = Math.trunc(step) * 15;
              var hours = minutes/60;
              var days = hours/24;
              if (days > 2) {
                ttfCircle.timeScale = Math.round(days) + " days"
              } else {
                hours = Math.trunc(hours);
                if (hours <= 7) {
                  ttfCircle.timeScale = 0 + " hours"
                } else {
                  ttfCircle.timeScale = hours + " hours"
                }
              }
              manageTTFMeter(Math.round(days));
            }



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
          }, speedOfGraph);
        } else {
          myLineChart.update();
          clearInterval(interval);
        }
      // }
    }

    sliderChange = function(val) {
      speedOfGraph = 111 - val ;
      if (runningSimulation) {
        toggleSimulation();
        toggleSimulation();
      }
    }

  });
});
