import React, {useEffect } from 'react';

const CustomPieChart = ({pieArr})=>{
    
	useEffect(() => {
        if(window.customPieChart !== undefined) window.customPieChart.destroy();
        let labelsList = [];
        let dataList = [];
        let backgroundColorList =  [];
        let labelsClassNameList =  [];
        for(let i=0; i<pieArr.length; i++){
            labelsList.push(pieArr[i].labelName);
            dataList.push(pieArr[i].value);
            backgroundColorList.push(pieArr[i].backgroundColor);
            labelsClassNameList.push(pieArr[i].className);
        }

        const pieChartConfig = {
            type: 'pie',    
            data: {
                labels: labelsList,
                datasets: [{
                    data: dataList,
                    backgroundColor: backgroundColorList,
                    
                }]
            },
            options: {
                legend:{display:false},
                responsive: false,
                maintainAspectRatio: true,
                tooltips:{enabled:false},
                animation: {
                    duration: 0,
                },
                plugins: {
                    labels: {
                        render: 'value',
                        fontColor: ['rgb(13, 53, 149, 0.7)', 'white'],
                        fontSize: 20,
                        position: 'inside'
                        }
                    
                },
            },
        }
        
        var canvas = document.getElementById('pieChart');
        let customPieChart = new window.Chart(canvas, pieChartConfig);
        window.customPieChart = customPieChart;

	},);


    const pieLable = pieArr.map( (pieData, idx) => {
        return (
            <span key={idx}>
                <span className={pieData.className}>{pieData.labelName}</span><br/>
            </span>
        );
    });

return (
    <>
        <canvas id="pieChart" className='pieChart'></canvas>
        <div className='pieLabelWrap'>{pieLable}</div>
    </>
    
    )
}

export default CustomPieChart;