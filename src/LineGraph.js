import React,{useEffect,useState}from 'react';
import {buildChartData} from './util';
import numeral from 'numeral';
import {Line} from 'react-chartjs-2';

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          parser: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};


function LineGraph({caseType},...props) {
    const [data,setData] = useState([])
    
    useEffect(() => {
       const  getGraphData = async() => {
        await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const chartData = buildChartData(data,caseType);
            setData(chartData);
             })
        }
    
    getGraphData()
    
    },[caseType])

    return (
        <div className={props.className}>
            {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
        </div>
    )
}

export default LineGraph
