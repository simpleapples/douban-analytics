function getData(username, currentYear, currentMonth, ) {
    const url = ['https://api.douban.com/v2/book/user/', username, '/collections?status=read&from=', currentYear - 1, '-', currentMonth, '-01T00:00:00+08:00&to=', currentYear, '-', currentMonth, '-01T00:00:00+08:00'].join('');
    axios.get(url).then((response) => {

    });
}

function showChart(currentMonth, yData) {
    const monthData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const xAxis = monthData.slice(currentMonth - 12).concat(monthData.slice(0, currentMonth - 12));

    const readingChartOption = {
        title: {
            text: '阅读的本数',
            textStyle: {
                align: 'center',
            },
        },
        legend: {
            show: false,
        },
        xAxis: {
            data: xAxis,
        },
        yAxis: {},
        series: [{
            type: 'bar',
            data: yData,
        }],
    };

    const readingChartEle = document.createElement('div');
    readingChartEle.id = 'reading-chart';

    const profileEle = document.querySelector('div.aside #profile');
    profileEle.after(readingChartEle);

    const readingChart = echarts.init(document.querySelector('div.aside #reading-chart'));
    readingChart.setOption(readingChartOption);
}

const now = new Date();
const currentMonth = now.getMonth() + 1;

const data = getData('simpleapples', currentYear, currentMonth);
showChart(currentMonth, data);
