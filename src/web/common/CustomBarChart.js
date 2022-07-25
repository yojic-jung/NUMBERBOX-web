import React, {useEffect } from 'react';


const CustomBarChart = ({barArr})=>{
    
	useEffect(() => {
        if(window.customBarChart !== undefined) window.customBarChart.destroy();
        let labelsList = [];
        let dataList = [];
        let backgroundColorList =  [];
        for(let i=0; i<barArr.length; i++){
            labelsList.push(barArr[i].labelName);
            dataList.push(barArr[i].value);
            backgroundColorList.push(barArr[i].backgroundColor);
        }

        const barChartConfig = {
            type: 'bar',
            data: {
                labels: labelsList,
                datasets: [{
                    label: { display: false},
                    data: dataList,
                    backgroundColor:backgroundColorList,
                }]
            },
            options: {
                events:false,
                plugins: {
                    labels: {
                        render: () => {}
                    }
                },
                legend: {
                    display: false,
                    
                },
                responsive: false,
                tooltips: {
                    enabled: false,
                },
                hover: {
                    animationDuration: 0,
                    backgroundColor: backgroundColorList,
                },
                animation: {
                    duration: 1,
                    onComplete: function () {
                        var chartInstance = this.chart,
                            ctx = chartInstance.ctx;
                            ctx.font = "12px 'jejuGothic'";
                            ctx.fillStyle = 'rgb(13, 53, 149, 0.7)';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
    
                        this.data.datasets.forEach(function (dataset, i) {
                            var meta = chartInstance.controller.getDatasetMeta(i);
                            meta.data.forEach(function (bar, index) {
                                var data = dataset.data[index];							
                                ctx.fillText(data, bar._model.x, bar._model.y);
                            });
                        });
                    }
                },
                scales: {
                    xAxes: [{
                        gridLines: { display: false},
                        ticks: {
                            fontColor:'rgb(13, 53, 149, 0.7)',
                            fontSize : 12,
                            fontFamily:'jejUGothic'
                        }
                    }],
                    yAxes: [{
                        display: false,
                        gridLines: { display: false},
                        visible:false,
                        ticks: {
                            beginAtZero: true,
                            stepSize:2,
                        }
                    }]
                },
                layout: {
                    padding: {
                        top:20,
                        bottom:0,
                        right:0,
                        left: 0,
                    }
                }
            }
        }

        var ctx = document.getElementById('barChart');
        let barChart = new window.Chart(ctx, barChartConfig);
        window.customBarChart = barChart;
	},);


   

return (
    <span id="barChartWrap">
        <canvas id="barChart" className='barChart'></canvas>
    </span>
       
    )
}

export default CustomBarChart;