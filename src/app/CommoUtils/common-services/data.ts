import { ChartType } from './apex.model';
import indiaMap from './indiaMap';

const sparklineData = [47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46];

const randomizeArray = (arg: any) => {
    const array = arg.slice();
    // tslint:disable-next-line: one-variable-per-declaration
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

function generateDayWiseTimeSeries(baseval: any, count: any, yrange: any) {
    let i = 0;
    const series = [];
    while (i < count) {
        const x = baseval;
        const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        series.push([x, y]);
        baseval += 86400000;
        i++;
    }
    return series;
}

function generateData(baseval: any, count: any, yrange: any) {
    let i = 0;
    const series = [];
    while (i < count) {
        const x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
        const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
        const z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

        series.push([x, y, z]);
        baseval += 86400000;
        i++;
    }
    return series;
}

const linewithDataChart: ChartType = {
    chart: {
        height: 380,
        type: 'line',
        zoom: {
            enabled: false
        },
        toolbar: {
            show: false
        }
    },
    colors: ['#3bafda', '#1abc9c'],
    dataLabels: {
        enabled: false,
    },
    stroke: {
        width: [3, 3],
        // curve: 'smooth'
    },
    series: [{
        name: 'High - 2018',
        data: [1, 5, 10, 0, 1]
    },
    {
        name: 'Low - 2018',
        data: [10, 15, 0, 1, 2]
    }
    ],
    markers: {
        style: 'inverted',
        size: 6
    },
    xaxis: {
        type: 'datetime',
        categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000', '7/11/2000', '8/11/2000', '9/11/2000', '10/11/2000', '11/11/2000', '12/11/2000', '1/11/2001', '2/11/2001', '3/11/2001', '4/11/2001', '5/11/2001', '6/11/2001'],
        axisBorder: {
            show: true,
            color: '#dddddd'
        }
    },
    yaxis: {
        text: ['₹ 05 L', '₹ 10 L', '₹ 15 L', '₹ 20 L', '₹ 25 L', '₹ 30 L'],
        axisBorder: {
            show: true,
            color: '#dddddd'
        },
        axisTicks: {
            show: true,
        },
    },
    legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
    },
    responsive: [{
        breakpoint: 600,
        options: {
            chart: {
                toolbar: {
                    show: false
                }
            },
            legend: {
                show: false
            },
        }
    }]
};

const linewithDataChart1: ChartType = {
    chart: {
        height: 380,
        type: 'line',
        zoom: {
            enabled: false
        },
        toolbar: {
            show: false
        }
    },
    colors: ['#1ABC9C', '#F1556C'],
    dataLabels: {
        enabled: false,
    },
    stroke: {
        width: [3, 3],
        // curve: 'smooth'
    },
    title: {
        text: 'Product Trends by Month',
        align: 'left',
        offsetX: 0,
        offsetY: 0,
        style: {
            color: '#343A40',
            fontSize: '14px',
            fontFamily: 'Nunito Sans, sans-serif',
            fontWeight: 600,
            cssClass: 'apexcharts-yaxis-title',
        },
    },
    series: [{
        name: 'High price',
        data: [1, 5, 10, 0, 1]
    },
    {
        name: 'Low price',
        data: [10, 15, 0, 1, 2]
    }
    ],
    markers: {
        style: 'inverted',
        size: 6
    },
    xaxis: {
        type: 'datetime',
        categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000', '7/11/2000', '8/11/2000', '9/11/2000', '10/11/2000', '11/11/2000', '12/11/2000', '1/11/2001', '2/11/2001', '3/11/2001', '4/11/2001', '5/11/2001', '6/11/2001'],
        axisBorder: {
            show: true,
            color: '#dddddd'
        }
    },
    yaxis: {
        text: ['₹ 05 L', '₹ 10 L', '₹ 15 L', '₹ 20 L', '₹ 25 L', '₹ 30 L'],
        axisBorder: {
            show: true,
            color: '#dddddd'
        },
        axisTicks: {
            show: true,
        },
    },
    legend: {
        position: 'top',
        horizontalAlign: 'right',
    },
    responsive: [{
        breakpoint: 600,
        options: {
            chart: {
                toolbar: {
                    show: false
                }
            },
            legend: {
                show: false
            },
        }
    }]
};

const lineColumAreaChart: ChartType = {
    chart: {
        height: 380,
        type: 'bar',
        padding: {
            right: 0,
            left: 0
        },
        stacked: false,
        toolbar: {
            show: false
        }
    },
    stroke: {
        width: [0, 2, 4],
        curve: 'smooth'
    },
    plotOptions: {
        bar: {
            columnWidth: '50%',
            dataLabels: {
                position: 'top'
            },
        }
    },
    dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
            fontSize: "16px",
            colors: ['#303D9D'],
        }
    },
    colors: ['#303D9D','#45AA5C','#8064C3','#CB4B4B','#FF9900','#898F95'],
    series: [{
        name: 'Count',
        type: 'column',
        data: [40,35,30,25,20]
    }],
    fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
            inverseColors: false,
            shade: 'light',
            type: 'vertical',
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100]
        }
    },
    // tslint:disable-next-line: max-line-length
    // labels:
    markers: {
        size: 0
    },
    legend: {
        offsetY: -10,
    },
    xaxis: {
        type: 'category',
        categories: ['All Subsidy Claims', 'Approved', 'Send To Nodal', 'Hold', 'Rejected'],
        // axisBorder: {
        //     show: true,
        //     color: '#dddddd'
        // },
    },
    yaxis: {
        categories: ['₹ 05 L', '₹ 10 L', '₹ 15 L', '₹ 20 L', '₹ 25 L'],
        axisBorder: {
            show: true,
            color: '#dddddd'
        },
        axisTicks: {
            show: true,
        },
    },
    tooltip: {
        shared: false,
        intersect: false,
        y: {
            formatter(y: any) {
                if (typeof y !== 'undefined') {
                    return y.toFixed(0) + ' points';
                }
                return y;

            }
        }
    },
    // grid: {
    //     borderColor: '#f1f3fa'
    // }
};

const lineColumAreaChartDash: ChartType = {
    chart: {
        height: 380,
        type: 'bar',
        padding: {
            right: 0,
            left: 0
        },
        stacked: false,
        toolbar: {
            show: false
        }
    },
    stroke: {
        width: [0, 2, 4],
        curve: 'smooth'
    },
    plotOptions: {
        bar: {
            columnWidth: '50%'
        }
    },
    colors: ['#303D9D','#45AA5C','#8064C3','#CB4B4B','#FF9900','#898F95','#32C5FF','#0091FF'],
    series: [{
        name: 'Team A',
        type: 'column',
        data: [25,20,15,10,5]
    }],
    fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
            inverseColors: false,
            shade: 'light',
            type: 'vertical',
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100]
        }
    },
    // tslint:disable-next-line: max-line-length
    // labels:
    markers: {
        size: 0
    },
    legend: {
        offsetY: -10,
    },
    xaxis: {
        type: 'category',
        categories: ['Approved Proposal', 'Sanctioned', 'Disbursed', 'Rejected', 'On Hold'],
        // axisBorder: {
        //     show: true,
        //     color: '#dddddd'
        // },
    },
    yaxis: {
        categories: ['₹ 05 L', '₹ 10 L', '₹ 15 L', '₹ 20 L', '₹ 25 L', '₹ 30 L'],
        // axisBorder: {
        //     show: true,
        //     color: '#dddddd'
        // },
        // axisTicks: {
        //     show: true,
        // },
    },
    tooltip: {
        shared: false,
        intersect: false,
        y: {
            formatter(y: any) {
                if (typeof y !== 'undefined') {
                    return y.toFixed(0) + ' points';
                }
                return y;

            }
        }
    },
    // grid: {
    //     borderColor: '#f1f3fa'
    // }
};


const lineColumAreaTSVChart: ChartType = {
    chart: {
        height: 150,
        type: 'line',
        padding: {
            right: 0,
            left: 0
        },
        stacked: false,
        toolbar: {
            show: false
        }
    },
    stroke: {
        width: [0, 2, 4],
        curve: 'smooth'
    },
    plotOptions: {
        bar: {
            columnWidth: '50%'
        }
    },
    colors: ['#0FAC37'],
    series: [{
        name: 'Team A',
        type: 'column',
        data: [5, 8, 11]
    }],
    fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
            inverseColors: false,
            shade: 'light',
            type: 'vertical',
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100]
        }
    },
    // tslint:disable-next-line: max-line-length
    // labels:
    markers: {
        size: 0
    },
    legend: {
        offsetY: -10,
    },
    xaxis: {
        type: 'datetime',
        categories: ['2016', '2017', '2018'],
        axisBorder: {
            show: true,
            color: '#dddddd'
        },
    },
    yaxis: {
        categories: ['₹ 05 L', '₹ 10 L', '₹ 15 L'],
        axisBorder: {
            show: true,
            color: '#dddddd'
        },
        axisTicks: {
            show: true,
        },
    },
    tooltip: {
        shared: false,
        intersect: false,
        y: {
            formatter(y: any) {
                if (typeof y !== 'undefined') {
                    return y.toFixed(0) + ' points';
                }
                return y;

            }
        }
    },
    // grid: {
    //     borderColor: '#f1f3fa'
    // }
};

const lineAnnotationsColumAreaChart: ChartType = {
    series: [{
        name: 'High - 2018',
        data: [1, 5, 10, 0, 1]
    },
    {
        name: 'Low - 2018',
        data: [10, 15, 0, 1, 2]
    }
    ],
    colors: ['#F1BB1B', 'var(--primaryColor)'],
    chart: {
        height: 380,
        type: 'line',
        zoom: {
            enabled: false
        },
        toolbar: {
            show: false
        }
    },
    annotations: {
        yaxis: [
            {
                y: 13,
                borderColor: "#F1BB1B",
                label: {
                    // borderColor: "#00E396",
                    style: {
                        fontSize: "14px",
                        color: "#F1BB1B",
                    },
                    text: "Median TAT"
                }
            },
            {
                y: 10,
                // y2: 5,
                borderColor: "var(--primaryColor)",
                // fillColor: "#FEB019",
                label: {
                    // borderColor: "var(--primaryColor)",
                    style: {
                        fontSize: "14px",
                        color: "var(--primaryColor)",
                    },
                    text: "Avg. TAT"
                }
            }
        ],
        stroke: {
            width: 5,
            show: true,
            lineCap: 'butt',
            dashArray: [5]
        },

    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        width: 3,
        show: true,
    },
    xaxis: {
        type: 'datetime',
        categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000', '7/11/2000', '8/11/2000', '9/11/2000', '10/11/2000', '11/11/2000', '12/11/2000', '1/11/2001', '2/11/2001', '3/11/2001', '4/11/2001', '5/11/2001', '6/11/2001'],
        axisBorder: {
            show: true,
            color: '#dddddd'
        }
    },
    yaxis: {
        text: ['₹ 05 L', '₹ 10 L', '₹ 15 L', '₹ 20 L', '₹ 25 L', '₹ 30 L'],
        axisBorder: {
            show: true,
            color: '#dddddd'
        },
        axisTicks: {
            show: true,
        },
    },
    legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
    },
    responsive: [{
        breakpoint: 600,
        options: {
            chart: {
                toolbar: {
                    show: false
                }
            },
            legend: {
                show: false
            },
        }
    }]
};


const lineAnnotationsColumAreaChart1: ChartType = {
    series: [{
        name: 'High - 2018',
        data: [1, 5, 10, 0, 1]
    },
    {
        name: 'Low - 2018',
        data: [10, 15, 0, 1, 2]
    }
    ],
    colors: ['#F1BB1B', 'var(--primaryColor)'],
    chart: {
        height: 380,
        type: 'line',
        zoom: {
            enabled: false
        },
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        width: 3,
        show: true,
    },
    markers: {
        style: 'inverted',
        size: 6
    },
    xaxis: {
        type: 'datetime',
        categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000', '7/11/2000', '8/11/2000', '9/11/2000', '10/11/2000', '11/11/2000', '12/11/2000', '1/11/2001', '2/11/2001', '3/11/2001', '4/11/2001', '5/11/2001', '6/11/2001'],
        axisBorder: {
            show: true,
        }
    },
    yaxis: {
        text: ['₹ 05 L', '₹ 10 L', '₹ 15 L', '₹ 20 L', '₹ 25 L', '₹ 30 L'],
        axisBorder: {
            show: true
        },
        axisTicks: {
            show: true,
        },
    },
    legend: {
        position: "top",
        horizontalAlign: "right",
        offsetX: 40,
        offsetY: 0,
    },
    responsive: [{
        breakpoint: 600,
        options: {
            chart: {
                toolbar: {
                    show: false
                }
            },
            legend: {
                show: false
            },
        }
    }]
};

const DebtorsAnalysisChart: ChartType = {
    chart: {
        height: 380,
        type: 'bar',
        events: {
            draw: (data: any) => {
                if (data.type === 'bar') {
                    data.element.attr({
                        style: 'stroke-width: 30px'
                    });
                }
            }
        },
        padding: {
            right: 0,
            left: 0
        },
        stacked: true,
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: [0, 2, 4],
        curve: 'smooth'
    },
    plotOptions: {
        bar: {
            columnWidth: '50%',
        },
    },
    colors: ['#1ABC9C', '#FF9900', '#F1556C'],
    series: [{
        name: 'Less than 90 Days',
        type: 'column',
        data: [30, 25, 27, 20, 13, 18, 5, 7, 12, 10, 11, 10]
    },
    {
        name: 'Between 90 to 180 days',
        type: 'column',
        data: [30, 25, 27, 20, 13, 18, 11, 7, 12, 10, 11, 10]
    },
    {
        name: 'More than 180 Days',
        type: 'column',
        data: [30, 25, 27, 20, 13, 18, 30, 7, 12, 10, 11, 10]
    }
    ],
    fill: {
        opacity: [1, 1, 1],
        gradient: {
            inverseColors: false,
            shade: 'light',
            type: 'vertical',
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100]
        }
    },
    // tslint:disable-next-line: max-line-length
    //labels: ['12/01/2019', '01/01/2020', '02/01/2020', '03/01/2020', '04/01/2020', '05/01/2020', '06/01/2020', '07/01/2020', '08/01/2020', '9/01/2020', '10/01/2020', '11/01/2020', '12/01/2020'],
    markers: {
        size: 0
    },
    legend: {
        position: "top",
        horizontalAlign: "right",
        offsetX: 40,
        offsetY: 0,
    },
    xaxis: {
        type: 'datetime',
        categories: ['12/01/2019', '01/01/2020', '02/01/2020', '03/01/2020', '04/01/2020', '05/01/2020', '06/01/2020', '07/01/2020', '08/01/2020', '9/01/2020', '10/01/2020', '11/01/2020', '12/01/2020'],
        axisBorder: {
            show: true,
            color: '#dddddd'
        },
    },
    yaxis: {
        categories: ['₹ 05 L', '₹ 10 L', '₹ 15 L', '₹ 20 L', '₹ 25 L', '₹ 30 L'],
        labelInterpolationFnc: (value: any) => {
            return '₹' + (value / 1000) + 'L';
        },
        axisBorder: {
            show: true,
            color: '#dddddd'
        },
        axisTicks: {
            show: true,
        },
    },
    tooltip: {
        shared: false,
        intersect: false,
        y: {
            formatter: function (val: any) {
                return val + "K";
            }
        }
    },
    // grid: {
    //     borderColor: '#f1f3fa'
    // }
};

const StockAnalysisChart: ChartType = {
    chart: {
        height: 380,
        type: 'bar',
        padding: {
            right: 0,
            left: 0
        },
        stacked: true,
        stackType: "₹ 30 L",
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: [0, 2, 4],
        curve: 'smooth'
    },
    plotOptions: {
        bar: {
            columnWidth: '50%',
        },
    },
    colors: ['#03045E', '#0077B6', '#00B4D8'],
    series: [{
        name: 'Less than 90 Days',
        type: 'column',
        data: [30, 25, 27, 20, 13, 18, 5, 7, 12, 10, 11, 10]
    },
    {
        name: 'Between 90 to 180 days',
        type: 'column',
        data: [30, 25, 27, 20, 13, 18, 11, 7, 12, 10, 11, 10]
    },
    {
        name: 'More than 180 Days',
        type: 'column',
        data: [30, 25, 27, 20, 13, 18, 30, 7, 12, 10, 11, 10]
    }
    ],
    fill: {
        opacity: [1, 1, 1],
        gradient: {
            inverseColors: false,
            // shade: 'light',
            type: 'vertical',
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100]
        }
    },
    // tslint:disable-next-line: max-line-length
    //labels: ['12/01/2019', '01/01/2020', '02/01/2020', '03/01/2020', '04/01/2020', '05/01/2020', '06/01/2020', '07/01/2020', '08/01/2020', '9/01/2020', '10/01/2020', '11/01/2020', '12/01/2020'],
    markers: {
        size: 0
    },
    legend: {
        position: "top",
        horizontalAlign: "right",
        offsetX: 40,
        offsetY: 0,
    },
    xaxis: {
        categories: ['12/01/2019', '01/01/2020', '02/01/2020', '03/01/2020', '04/01/2020', '05/01/2020', '06/01/2020', '07/01/2020', '08/01/2020', '9/01/2020', '10/01/2020', '11/01/2020', '12/01/2020'],
        type: 'datetime',
        axisBorder: {
            show: true,
            color: '#dddddd'
        },
    },
    yaxis: {
        categories: ['₹ 05 L', '₹ 10 L', '₹ 15 L', '₹ 20 L', '₹ 25 L', '₹ 30 L'],
        labelInterpolationFnc: (value: any) => {
            return '₹' + (value / 1000) + 'L';
        },
        axisBorder: {
            show: true,
            color: '#dddddd'
        },
        axisTicks: {
            show: true,
        },
    },
    tooltip: {
        shared: false,
        intersect: false,
        y: {
            formatter: function (val: any) {
                return val + "K";
            }
        }
    },
    // grid: {
    //     borderColor: '#f1f3fa'
    // }
};

const multipleYAxisChart: ChartType = {
    chart: {
        height: 380,
        type: 'line',
        stacked: false,
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: [0, 0, 3]
    },
    series: [{
        name: 'Income',
        type: 'column',
        data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6]
    }, {
        name: 'Cashflow',
        type: 'column',
        data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5]
    }, {
        name: 'Revenue',
        type: 'line',
        data: [20, 29, 37, 36, 44, 45, 50, 58]
    }],
    colors: ['#3bafda', '#ebf2f6', '#f1556c'],
    xaxis: {
        categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
    },
    yaxis: [{
        axisTicks: {
            show: true,
        },
        axisBorder: {
            show: true,
            color: '#675db7'
        },
        labels: {
            style: {
                color: '#675db7',
            }
        },
        title: {
            text: 'Income (thousand crores)'
        },
    },

    {
        axisTicks: {
            show: true,
        },
        axisBorder: {
            show: true,
            color: '#23b397'
        },
        labels: {
            style: {
                color: '#23b397',
            },
            offsetX: 10
        },
        title: {
            text: 'Operating Cashflow (thousand crores)',
        },
    },
    {
        opposite: true,
        axisTicks: {
            show: true,
        },
        axisBorder: {
            show: true,
            color: '#e36498'
        },
        labels: {
            style: {
                color: '#e36498',
            }
        },
        title: {
            text: 'Revenue (thousand crores)'
        }
    },

    ],
    tooltip: {
        followCursor: true,
        y: {
            formatter(y: any) {
                if (typeof y !== 'undefined') {
                    return y + ' thousand crores';
                }
                return y;
            }
        }
    },
    grid: {
        borderColor: '#f1f3fa'
    },
    legend: {
        offsetY: -10,
    },
    responsive: [{
        breakpoint: 600,
        options: {
            yaxis: {
                show: false
            },
            legend: {
                show: false
            }
        }
    }]
};


const basicRadialBarChart: ChartType = {
    chart: {
        height: 180,
        type: 'radialBar',
    },
    plotOptions: {
        radialBar: {
            startAngle: -185,
            endAngle: 185,
            hollow: {
                size: '50%',
            },
            dataLabels: {
                enabled: true,
                name: {
                    fontSize: '16px',
                    color: "#000000",
                    offsetY: 30
                },
                value: {
                    offsetY: -10,
                    fontSize: '20px',
                    color:"#028AFF",
                    // formatter(val:any) {
                    //     return val;
                    // }
                },               
                                
            }

        },

    },
    colors: ['#27AF47'],
    series: [50],
    labels: [''],
};

const multipleRadialBars = {
    chart: {
        height: 350,
        type: 'radialBar',
    },
    plotOptions: {
        radialBar: {
            dataLabels: {
                name: {
                    fontSize: '22px',
                },
                value: {
                    fontSize: '16px',
                },
                total: {
                    show: true,
                    label: 'Total',
                    formatter(w: any) {
                        // tslint:disable-next-line: max-line-length
                        // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                        return 249;
                    }
                }
            }
        }
    },
    colors: ['#56c2d6', '#e36498', '#23b397', '#4a81d4'],
    series: [44, 55, 67, 83],
    labels: ['Apples', 'Oranges', 'Bananas', 'Berries'],
};

const basicBarChart: ChartType = {
    chart: {
        height: 380,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: true,
            dataLabels: {
                position: 'top'
            },
        }
    },
    dataLabels: {
        enabled: true,
        style: {
            colors: ['#fff']
        },
        offsetX: 35
    },
    tooltip: {
        enabled: true,
    },
    series: [
        {
            name: 'Proprietorship',
            data: [28.13],
        },
        {
            name: 'Partnership',
            data: [19.54],
        },
        {
            name: 'Associates',
            data: [15.45],
        },
        {
            name: 'LLP',
            data: [13.58],
        },
        {
            name: 'Pvt. Ltd. Company',
            data: [11.47],
        },
        {
            name: 'Ltd. Company',
            data: [10.49],
        },
        {
            name: 'Others',
            data: [4.55],
        },


    ],
    stroke: {
        width: 5,
        colors: ['none']
      },
    colors: ['var(--primaryColor)', '#466BAB', '#8A9744', '#82639E', '#1BB884', '#FFB555', '#8D99A0'],
    xaxis: {
        // tslint:disable-next-line: max-line-length
        categories: ['Proprietorship', 'Partnership', 'Associates', 'LLP', 'Pvt. Ltd. Company', 'Ltd. Company', 'Others'],
    },
    yaxis: {
        // tslint:disable-next-line: max-line-length
        label: ['10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%',],
    },
    states: {
        hover: {
            filter: 'none'
        }
    },
    grid: {
        borderColor: '#f1f3fa',
        border: 0
    }
};

const AgingReportBarChart: ChartType = {
    chart: {
        height: 380,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: true,
            dataLabels: {
              position: 'top'
            },
        }
    },
    dataLabels: {
        enabled: true,
        // offsetX: -6,
        style: {
            colors: ['#333']
        },
        offsetX: 30
    },
  
    colors: ['#FF6C6C', '#FFB555', '#27AF47'],

    series: [
        {
            name: '115 Applications',
            data: [10],
            height: '15px',
            colors: ['#fff']
        },
        {
            name: '115 Applications',
            data: [20],
            height: '15px'
        },
        {
            name: '115 Applications',
            data: [30],
            height: '15px'
        }
    ],
    stroke: {
        width: 5,
        colors: ['none']
      },
    xaxis: {
        // tslint:disable-next-line: max-line-length
        categories: ['Above 30 Days', '11-20 Days', '0-10 Days'],
    },
    states: {
        hover: {
            filter: 'none'
        }
    },
    grid: {
        borderColor: '#f1f3fa',
        border: 0
    }
};
const AgingReportBarChartDash: ChartType = {
    chart: {
        height: 300,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: true,
            dataLabels: {
              position: 'top'
            },
        }
    },
    dataLabels: {
        enabled: true,
        // offsetX: -6,
        // textAnchor: "start",
        style: {
            fontSize: "16px",
            colors: ["#ffffff"]
          },
        offsetX: 30
    },
  
    colors: ['#FF6C6C', '#FFB555', '#27AF47'],

    series: [
        {
            name: '115 Applications',
            data: [10],
            height: '15px',
            colors: ['#fff']
        },
        {
            name: '115 Applications',
            data: [20],
            height: '15px'
        },
        {
            name: '115 Applications',
            data: [30],
            height: '15px'
        }
    ],
    stroke: {
        width: 2,
        colors: ['transparent']
      },
    xaxis: {
        // tslint:disable-next-line: max-line-length
        categories: ['Above 30 Days', '11-20 Days', '0-10 Days'],
    },
    states: {
        hover: {
            filter: 'none'
        }
    },
    grid: {
        borderColor: '#f1f3fa',
        border: 0
    }
};

const IndiaCharts: ChartType = {
    chart: {
        map: indiaMap
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          alignTo: "spacingBox"
        }
      },
      legend: {
        enabled: true
      },
      colorAxis: {
        min: 0
      },
      series: [
        {
          type: "map",
          name: "Random data",
          states: {
            hover: {
              color: "#BADA55"
            }
          },
          dataLabels: {
            enabled: true,
            format: "{point.name}"
          },
          allAreas: false,
          data: [["in", 5]]
        }
      ]
};
const revenueRadialChart: ChartType = {
    chart: {
        height: 120,
        type: 'radialBar',
    },
    plotOptions: {
        radialBar: {
            hollow: {
                size: '45%',
            },
            dataLabels: {
                name: {
                    show: false
                },
                value: {
                    fontSize: '24px',
                    color: 'rgb(241, 85, 108)',
                    offsetY: 10,
                    formatter: (val: any) => {
                        return val + '';
                    }
                }
            }
        }
    },
    colors: ['rgb(241, 85, 108)'],
    series: [60],
    stroke: {
        lineCap: 'round',
    },
};

const revenueRadialChart1: ChartType = {
    chart: {
        height: 150,
        type: 'radialBar',
    },
    plotOptions: {
        radialBar: {
            hollow: {
                size: '50%',
            },
            dataLabels: {
                name: {
                    show: false
                },
                value: {
                    fontSize: '20px',
                    color: '#343A40',
                    offsetY: 10,
                    formatter: (val: any) => {
                        return val + '';
                    }
                }
            }
        }
    },
    colors: ['#0FAC37'],
    series: [60],
    stroke: {
        lineCap: 'round',
    },
};


const totalUsersPieChart: ChartType = {
    type: 'pie',
    series: [20, 60, 20,],
    option: {
        pie: {
            expandOnClick: false
        }
    },
    height: 300,
    colors: ['#1BB884', 'var(--primaryColor)', '#FFB555',],
    dataLabels: {
        enabled: true,
        textAnchor: 'center',
        style: {
            fontSize: '14px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            colors: undefined
        },

    },
    legend: {
        show: false,
    },
    tooltip: {
        x: {
            show: false
        }
    },
    grid: {
        show: false,
        padding: {
            top: 30,
            left: 0,
            right: 0,
            bottom: 0
        }
    },
};
const NA_AR_NP_PieChartSC: ChartType = {
    type: 'pie',
    series: [30, 10, 20, 60,20],
    option: {
        pie: {
            expandOnClick: false
        }
    },
    height: 350,
    colors: ['var(--primaryColor)', '#D59C39', '#E8CF54','#FF9A9A','#F559F0'],
    dataLabels: {
        enabled: false,
        textAnchor: 'center',
        style: {
            fontSize: '14px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            colors: undefined
        },

    },
    legend: {
        show: true,
        position: "bottom"
    },
    tooltip: {
        x: {
            show: true
        }
    },
    grid: {
        show: false,
        padding: {
            top: 30,
            left: 0,
            right: 0,
            bottom: 0
        }
    },
    labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
};
const NA_AR_NP_PieChartFIC: ChartType = {
    type: 'pie',
    series: [20, 60, 20,],
    option: {
        pie: {
            expandOnClick: false
        }
    },
    height: 350,
    colors: ['#1BB884', 'var(--primaryColor)', '#FFB555',],
    dataLabels: {
        enabled: false,
        textAnchor: 'center',
        style: {
            fontSize: '14px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            colors: undefined
        },

    },
    legend: {
        show: true,
        position: "bottom"
    },
    tooltip: {
        x: {
            show: false
        }
    },
    grid: {
        show: false,
        padding: {
            top: 30,
            left: 0,
            right: 0,
            bottom: 0
        }
    },
    labels: ['Team A', 'Team B', 'Team C'],
};


const averagetimeBarChart: ChartType = {
    chart: {
        height: 330,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            columnWidth: '51%',
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    colors: ['#00B4D8', '#03045E'],
    series: [{
        name: 'Net Sales',
        data: [100, 75, 50, 75, 50, 75, 100]
    },
    {
        name: 'Profit After Tax',
        data: [90, 65, 40, 65, 40, 65, 90]
    }],
    xaxis: {
        categories: ['2012', '2013', '2014', '2015', '2016', '2017', '2018'],
        axisBorder: {
            show: true,
            color: '#dddddd'
        },
        axisTicks: {
            show: true,
        },
    },
    legend: {
        show: true,
        position: "top",
        horizontalAlign: "right",
        offsetX: 40,
        offsetY: 0,
    },
    fill: {
        opacity: 1,
        gradient: {
            inverseColors: false,
            shade: 'light',
            type: 'vertical',
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100]
        }
    },
};
const averagetimeBarChart1: ChartType = {
    chart: {
        height: 330,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            columnWidth: '51%',
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    colors: ['#1ABC9C', '#F1556C'],
    series: [{
        name: 'Net SalesCredit Transactions',
        data: [100, 75, 50, 75, 50, 75, 100]
    },
    {
        name: 'Debit Transactions',
        data: [90, 65, 40, 65, 40, 65, 90]
    }],
    xaxis: {
        categories: ['2012', '2013', '2014', '2015', '2016', '2017', '2018'],
        axisBorder: {
            show: true,
            color: '#dddddd'
        },
        axisTicks: {
            show: true,
        },
    },
    legend: {
        show: true,
        position: "top",
        horizontalAlign: "right",
        offsetX: 40,
        offsetY: 0,
    },
    fill: {
        opacity: 1,
        gradient: {
            inverseColors: false,
            shade: 'light',
            type: 'vertical',
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100]
        }
    },
};

const StockAnalysisChart1: ChartType = {
    chart: {
        height: 330,
        type: 'bar',
        padding: {
            right: 0,
            left: 0
        },
        stacked: true,
        stackType: "₹ 30 L",
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: [0, 2, 4],
        curve: 'smooth'
    },
    plotOptions: {
        bar: {
            columnWidth: '50%',
        },
    },
    colors: ['#03045E', '#0077B6', '#00B4D8'],
    series: [{
        name: 'Less than 90 Days',
        type: 'column',
        data: [30, 25, 27, 20, 13, 18, 5, 7, 12, 10, 11, 10]
    },
    {
        name: 'Between 90 to 180 days',
        type: 'column',
        data: [30, 25, 27, 20, 13, 18, 11, 7, 12, 10, 11, 10]
    },
    {
        name: 'More than 180 Days',
        type: 'column',
        data: [30, 25, 27, 20, 13, 18, 30, 7, 12, 10, 11, 10]
    }
    ],
    fill: {
        opacity: [1, 1, 1],
        gradient: {
            inverseColors: false,
            // shade: 'light',
            type: 'vertical',
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100]
        }
    },
    // tslint:disable-next-line: max-line-length
    //labels: ['12/01/2019', '01/01/2020', '02/01/2020', '03/01/2020', '04/01/2020', '05/01/2020', '06/01/2020', '07/01/2020', '08/01/2020', '9/01/2020', '10/01/2020', '11/01/2020', '12/01/2020'],
    markers: {
        size: 0
    },
    legend: {
        position: "top",
        horizontalAlign: "right",
        offsetX: 40,
        offsetY: 0,
    },
    xaxis: {
        categories: ['12/01/2019', '01/01/2020', '02/01/2020', '03/01/2020', '04/01/2020', '05/01/2020', '06/01/2020', '07/01/2020', '08/01/2020', '9/01/2020', '10/01/2020', '11/01/2020', '12/01/2020'],
        type: 'datetime',
        axisBorder: {
            show: true,
            color: '#dddddd'
        },
    },
    yaxis: {
        categories: ['₹ 05 L', '₹ 10 L', '₹ 15 L', '₹ 20 L', '₹ 25 L', '₹ 30 L'],
        labelInterpolationFnc: (value: any) => {
            return '₹' + (value / 1000) + 'L';
        },
        axisBorder: {
            show: true,
            color: '#dddddd'
        },
        axisTicks: {
            show: true,
        },
    },
    tooltip: {
        shared: false,
        intersect: false,
        y: {
            formatter: function (val: any) {
                return val + "K";
            }
        }
    },
    // grid: {
    //     borderColor: '#f1f3fa'
    // }
};

const gradientDonutChart: ChartType = {
    chart: {
        height: 320,
        type: 'donut',
    },
    series: [44, 55],
    legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        verticalAlign: 'middle',
        floating: false,
        fontSize: '14px',
        offsetX: 0,
        offsetY: -10
    },
    dataLabels: {
        enabled: false
    },
    labels: ['Principle Loan Amount', 'Interest Payable'],
    colors: ['#5367FF', '#00D09C'],
    responsive: [{
        breakpoint: 600,
        options: {
            chart: {
                height: 240
            },
            legend: {
                show: false
            },
        }
    }],
    fill: {
        type: 'gradient'
    }
};
const strokedCircularGuage: ChartType = {
    chart: {
        height: 180,
        type: 'radialBar',
    },
    plotOptions: {
        radialBar: {
            startAngle: -135,
            endAngle: 135,
            hollow: {
                size: '70%',
            },
            dataLabels: {
                enabled: true,
                colors: [''],
                name: {
                    fontSize: '14px',
                    color: "#000000",
                    offsetY: 30
                },
                value: {
                    offsetY: -20,
                    fontSize: '30px',
                    color:"",
                    formatter(val:any) {
                        return val;
                    }
                },               
                                
            }
        }
    },
    fill: {
        gradient: {
             enabled: true,
            shade: 'dark',
            shadeIntensity: 0.15,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            type: "horizontal",
            gradientToColors: ["#87D4F9"],
            stops: [0, 50, 65, 91]
            
        },
    },
    stroke: {
        lineCap: "butt"
      },
    colors: [''],
    series: [0],
    labels: [''],
    responsive: [{
        breakpoint: 380,
        options: {
            chart: {
                height: 280
            }
        }
    }]
};
const strokedCircularGuage1: ChartType = {
    chart: {
        height: 180,
        type: 'radialBar',
    },
    plotOptions: {
        radialBar: {
            startAngle: -135,
            endAngle: 135,
            hollow: {
                size: '70%',
            },
            dataLabels: {
                enabled: true,
                name: {
                    fontSize: '14px',
                    color: "#000000",
                    offsetY: 30,
                    style: {
                        colors: ['#000000']
                      },
                },
                value: {
                    offsetY: -20,
                    fontSize: '30px',
                    color:"",
                    formatter(val:any) {
                        return val;
                    }
                },               
                                
            }
        }
    },
    fill: {
        // type: "gradient",
        gradient: {
            // enabled: true,
            shade: 'dark',
            shadeIntensity: 0.15,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            type: "horizontal",
            gradientToColors: ["#87D4F9"],
            stops: [0, 50, 65, 91]
            
        },
    },
    stroke: {
        lineCap: "butt"
      },
    colors: [''],
    series: [0],
    labels: [''],
    responsive: [{
        breakpoint: 380,
        options: {
            chart: {
                height: 280
            }
        }
    }]
};

const SOCIAL_CATEGORY_PIE_CHART: ChartType = {
    type: 'pie',
    series: [30, 10, 20, 60,20],
    option: {
        pie: {
            expandOnClick: false
        }
    },
    height: 350,
    colors: ['var(--primaryColor)', '#D59C39', '#E8CF54','#FF9A9A','#F559F0'],
    dataLabels: {
        enabled: false,
        textAnchor: 'center',
        style: {
            fontSize: '14px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            colors: undefined
        },

    },
    legend: {
        show: true,
        position: "bottom"
    },
    tooltip: {
        x: {
            show: true
        }
    },
    grid: {
        show: false,
        padding: {
            top: 30,
            left: 0,
            right: 0,
            bottom: 0
        }
    },
    labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
};

const COURSE_PIE_CHART: ChartType = {
    type: 'pie',
    series: [30, 10, 20, 60,20],
    option: {
        pie: {
            expandOnClick: false
        }
    },
    height: 350,
    colors: ['var(--primaryColor)', '#D59C39', '#E8CF54','#FF9A9A','#F559F0'],
    dataLabels: {
        enabled: false,
        textAnchor: 'center',
        style: {
            fontSize: '14px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            colors: undefined
        },

    },
    legend: {
        show: true,
        position: "bottom"
    },
    tooltip: {
        x: {
            show: true
        }
    },
    grid: {
        show: false,
        padding: {
            top: 30,
            left: 0,
            right: 0,
            bottom: 0
        }
    },
    labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
};

const FAMILY_ICOME_PIE_CHART: ChartType = {
    type: 'pie',
    series: [20, 60, 20,],
    option: {
        pie: {
            expandOnClick: false
        }
    },
    height: 350,
    colors: ['#1BB884', 'var(--primaryColor)', '#FFB555',],
    dataLabels: {
        enabled: false,
        textAnchor: 'center',
        style: {
            fontSize: '14px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            colors: undefined
        },

    },
    legend: {
        show: true,
        position: "bottom"
    },
    tooltip: {
        x: {
            show: false
        }
    },
    grid: {
        show: false,
        padding: {
            top: 30,
            left: 0,
            right: 0,
            bottom: 0
        }
    },
    labels: ['Team A', 'Team B', 'Team C'],
};

const GENDER_PIE_CHART: ChartType = {
    type: 'pie',
    series: [20, 60, 20,],
    option: {
        pie: {
            expandOnClick: false
        }
    },
    height: 350,
    colors: ['#1BB884', 'var(--primaryColor)', '#FFB555',],
    dataLabels: {
        enabled: false,
        textAnchor: 'center',
        style: {
            fontSize: '14px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            colors: undefined
        },

    },
    legend: {
        show: true,
        position: "bottom"
    },
    tooltip: {
        x: {
            show: false
        }
    },
    grid: {
        show: false,
        padding: {
            top: 30,
            left: 0,
            right: 0,
            bottom: 0
        }
    },
    labels: ['Team A', 'Team B', 'Team C'],
};

export {
    // tslint:disable-next-line: max-line-length
    NA_AR_NP_PieChartSC,NA_AR_NP_PieChartFIC,linewithDataChart,lineColumAreaChartDash,AgingReportBarChartDash,strokedCircularGuage,strokedCircularGuage1, lineColumAreaChart, gradientDonutChart, linewithDataChart1, lineColumAreaTSVChart, averagetimeBarChart1, StockAnalysisChart1, lineAnnotationsColumAreaChart, lineAnnotationsColumAreaChart1, multipleYAxisChart, revenueRadialChart, revenueRadialChart1, DebtorsAnalysisChart, StockAnalysisChart, basicRadialBarChart, multipleRadialBars, basicBarChart, totalUsersPieChart, AgingReportBarChart, averagetimeBarChart,SOCIAL_CATEGORY_PIE_CHART,COURSE_PIE_CHART,FAMILY_ICOME_PIE_CHART,GENDER_PIE_CHART
};
