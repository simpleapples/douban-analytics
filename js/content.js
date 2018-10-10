async function fetchUrl(url) {
    const axiosInstance = axios.create({
        timeout: 1000,
        method: 'GET',
        headers: {
            referrerPolicy: 'no-referrer-when-downgrade',
        },
    });
    try {
        const res = await axiosInstance.get(url);
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject();
    }
}

async function getBookData(url) {
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    const resData = await fetchUrl(url);
    total = resData.total;
    let count = 0;
    const page = Math.round(total / 100);
    for (let i = 0; i < page + 1; i++) {
        const start = i * 100;
        const resData = await fetchUrl(url + '&count=100&start=' + start);
        for (let i = 0; i < resData.collections.length; i++) {
            const item = resData.collections[i];                    
            const date = new Date(Date.parse(item.updated));
            data[date.getMonth()] += 1;
            count += 1;
            if (count === total) {
                return Promise.resolve(data);
            }
        }
    }
    return Promise.reject();
}

function showChart(currentMonth, yData) {
    const monthData = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const xAxis = monthData.slice(currentMonth - 12).concat(monthData.slice(0, currentMonth - 12));
    const yAxis = yData.slice(currentMonth - 12).concat(yData.slice(0, currentMonth - 12));

    const readingChartOption = {
        itemStyle: {
            color: '#83BF73',
        },
        grid: {
            top: '5%',
            bottom: '15%',
        },
        xAxis: {
            data: xAxis,
        },
        yAxis: {
            minInterval: 1,
        },
        series: [{
            type: 'bar',
            data: yAxis,
        }],
    };

    const titleEle = document.querySelector('#db-usr-profile div.info h1');
    const username = titleEle.innerText.split('\n')[0].trim();

    const readingEle = document.createElement('div');
    readingEle.id = 'reading';

    const readingTitle = document.createElement('h2');
    readingTitle.innerHTML = username + '最近一年读书统计';

    const readingChartEle = document.createElement('div');
    readingChartEle.id = 'reading-chart';

    readingEle.appendChild(readingTitle);
    readingEle.appendChild(readingChartEle);

    const profileEle = document.querySelector('div.aside #profile');
    profileEle.after(readingEle);

    const readingChart = echarts.init(document.querySelector('div.aside #reading #reading-chart'));
    readingChart.setOption(readingChartOption);
}

async function getDataAndDisplay(username, currentYear, currentMonth) {
    const url = ['https://api.douban.com/v2/book/user/', username, '/collections?status=read&from=', currentYear - 1, '-', currentMonth + 1, '-01T00:00:00+08:00&to=', currentYear, '-', currentMonth + 1, '-01T00:00:00+08:00'].join('');
    try {
        const data = await getBookData(url);
        showChart(currentMonth, data);
    } catch(err) {
    }
}

async function main() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const username = window.location.href.replace('https://www.douban.com/people/', '').replace('/', '');
    
    await getDataAndDisplay(username, currentYear, currentMonth);
}

main();
