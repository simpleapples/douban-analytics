var USERNAME = 'simpleapples';
var YEAR = 2013;

var http = require('http');

var url = 'http://api.douban.com/v2/book/user/' + USERNAME + '/collections?status=read&from=' + YEAR + '-01-01T00:00:00+08:00&to=' + (YEAR + 1) + '-01-01T00:00:00+08:00';
var bookHolder = [];
var total = 0;

getReadBook();

function getReadBook() {
	fetchUrl(url, function (data) {
		var obj = JSON.parse(data);
		total = obj.total;
		var page = Math.round(total / 100);
	
		for (var i = 0; i < page + 1; i++) {
			var start = i * 100;
			fetchUrl(url + '&count=100&start=' + start, function (data) {
				var jsonObj = JSON.parse(data);
				for (var i = 0; i < jsonObj.collections.length; i++) {
					var item = jsonObj.collections[i];
					var book = {};
					book.name = item.book.title;
					book.time = item.updated;
					bookHolder.push(book);
					if (bookHolder.length == total) {
						displayData();
					}
				}
			});
		}
	});
}

function fetchUrl(url, callback) {
	http.get(url, function(res) {
		var data = '';
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function() {
			callback(data);
		});
	}).on('error', function() {
		callback(null);
	});
}

function displayData() {
	var monthCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var i = 0;
	var j = 0;
	var max = 0;
	for (i= 0; i < bookHolder.length; i++) {
		var date = new Date(Date.parse(bookHolder[i].time));
		monthCount[date.getMonth()] += 1;
		if (monthCount[date.getMonth()] > max) {
			max = monthCount[date.getMonth()];
		}
	}

	var strArr = [];

	for (var i = 0; i < monthCount.length; i++) {
		var monthArr = [];
		for (j = 0; j < monthCount[i]; j++) {
			monthArr[j] = '||';
		}
		monthArr[j++] = '__';
		monthArr[j++] = fillZero(monthCount[i]);
		for (j; j < max + 2; j++) {
			monthArr[j] = '  ';
		}
		strArr.push(monthArr);
	}


	for (i = max + 1; i >= 0; i--) {
		var str = '';
		for (j = 0; j < monthCount.length; j++) {
			str += (strArr[j][i] + ' ');
			// console.log(strArr[i][j]);
		}
		console.log(str);
	}
	console.log('== == == == == == == == == == == ==');
	console.log(' 1  2  3  4  5  6  7  8  9 10 11 12 Month');
}

function fillZero(val) {
	var str = '';
	if (val < 10) {
		str = ' ' + val;
	} else {
		str = '' + val;
	}
	return str;
}