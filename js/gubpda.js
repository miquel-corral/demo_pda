function UpdateText(sheet,place,dataFile, opt){
	console.log('Init Text:'+place+"/"+dataFile);
	var content = {linia:[]};
	
	var url = "https://spreadsheets.google.com/feeds/list/"+dataFile+"/"+sheet+"/public/values?alt=json";
	console.log('Init Text: Sheet('+sheet+') TextNum ('+place+') URL ('+url+')');

	$.getJSON(url, function(data) {
		for( var i=0;i<data.feed.entry.length;i++){
			var tmp=new Object();
			var columns=0;
			if(eval('data.feed.entry['+i+'].gsx$field1')){tmp.field1=eval('data.feed.entry['+i+'].gsx$field1.$t');columns++;};
			if(eval('data.feed.entry['+i+'].gsx$field2')){tmp.field2=eval('data.feed.entry['+i+'].gsx$field2.$t');columns++;};
			if(eval('data.feed.entry['+i+'].gsx$field3')){tmp.field3=eval('data.feed.entry['+i+'].gsx$field3.$t');columns++;};
			if(eval('data.feed.entry['+i+'].gsx$field4')){tmp.field4=eval('data.feed.entry['+i+'].gsx$field4.$t');columns++;};
			if(eval('data.feed.entry['+i+'].gsx$field5')){tmp.field5=eval('data.feed.entry['+i+'].gsx$field5.$t');columns++;};
			if(eval('data.feed.entry['+i+'].gsx$nivell')){tmp.nivell=eval('data.feed.entry['+i+'].gsx$nivell.$t');};
			if(eval('data.feed.entry['+i+'].gsx$estat')){tmp.estat=eval('data.feed.entry['+i+'].gsx$estat.$t');};
			tmp.columns=columns;
			content.linia.push(tmp);
			console.log("TEXT: "+content.linia[i-1]);
		};
		var template = $('#text-template').html();
		var info = Mustache.to_html(template, content);
		$(place).html(info);

	}); 
	console.log('end Text List');
};


function UpdateChart(sheet, place, dataFile, intervalY, unitatsY, labels){
	var newData;
	var valors = [];
	var idx=0;
	var resultsArray = [];
	var categ=[];
	
	var url = "https://spreadsheets.google.com/feeds/list/"+dataFile+"/"+sheet+"/public/values?alt=json";
	console.log('Init Chart: Sheet('+sheet+') ChartNum ('+place+') URL ('+url+')');

	$.getJSON(url, function(data) {
		for (var j=0;j<25;j++){
			var fl='data.feed.entry[0].gsx$c'+j;
			if(eval(fl)){
				categ.push(eval(fl+'.$t'));
			}
		}
		console.log("Categories: "+categ);
		for( var i=1;i<data.feed.entry.length;i++){
			var tmp=new Object();
			tmp.name=eval('data.feed.entry['+i+'].gsx$serie.$t');
			console.log("Serie:"+tmp.name);
			tmp.data=[];
			for (var j=0;j<25;j++){
				var fl='data.feed.entry['+i+'].gsx$c'+j;
				if(eval(fl)){
					var str=eval(fl+'.$t').replace('.','');
					str=str.replace(',','.');
					tmp.data[j]=parseFloat( str);
					//tmp.data[j]=parseInt(eval(fl+'.$t'));
					console.log(fl+'.$t = '+tmp.data[j]);
				}
			}
			valors.push(tmp);
			console.log(valors[i-1]);
		};

		console.log(place);
		$(place).highcharts({
			chart: {
				type: 'column',
				height:'300',
			},
			colors: colorbrewer[colorPalette][colorPick].slice(),
			credits: {
				enabled: false
			},
			title: {
				text: data.feed.title.$t,
				style: { fontSize: titleFontSize, fontWeight: "bold", color: titleColor},
			},
			xAxis: {
				categories: categ
			},
			yAxis: {
				title: {
					text: unitatsY
				},
				tickInterval: intervalY,			
				labels: {
					format: '{value:,.0f}'
				}
			},
			plotOptions: {
				column: {
					pointPadding: 0.2,
					borderWidth: 0,
					dataLabels: {
						enabled: labels,
						allowOverlap: true,
						color: '#222222',
						style: { fontSize: '8px',textShadow: "0px 0px 5px #eeeeee", fontWeight: "normal"},
						shadow: false,
					    formatter: function() {
							if (this.y != 0) {
							  return this.y.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
							} else {
							  return null;
							}
						}
					}
				}
			},			
			legend:{
				itemStyle: { color: '#333333', cursor: 'pointer', fontSize: legendFontSize, fontWeight: 'normal' }
			},
			tooltip: {
			  pointFormat: '{series.name}: <b>{point.y}</b><br/>',
			  shared: true
			},
			series: valors
		});
	});
	console.log('end config HighChart');
};

function UpdateStackedChartPercen(sheet, place, dataFile, intervalY, unitatsY, labels){
	var newData;
	var valors = [];
	var idx=0;
	var resultsArray = [];
	var categ=[];
	
	var url = "https://spreadsheets.google.com/feeds/list/"+dataFile+"/"+sheet+"/public/values?alt=json";
	console.log('Init Chart: Sheet('+sheet+') ChartNum ('+place+') URL ('+url+')');

	$.getJSON(url, function(data) {
		for (var j=0;j<25;j++){
			var fl='data.feed.entry[0].gsx$c'+j;
			if(eval(fl)){
				categ.push(eval(fl+'.$t'));
			}
		}
		console.log("Categories: "+categ);
		for( var i=1;i<data.feed.entry.length;i++){
			var tmp=new Object();
			tmp.name=eval('data.feed.entry['+i+'].gsx$serie.$t');
			console.log("Serie:"+tmp.name);
			tmp.data=[];
			for (var j=0;j<25;j++){
				var fl='data.feed.entry['+i+'].gsx$c'+j;
				if(eval(fl)){
					var str=eval(fl+'.$t').replace('.','');
					str=str.replace(',','.');
					tmp.data[j]=parseFloat( str);
					//tmp.data[j]=parseInt(eval(fl+'.$t'));
					console.log(fl+'.$t = '+tmp.data[j]);
				}
			}
			valors.push(tmp);
			console.log(valors[i-1]);
		};

		console.log(place);
		$(place).highcharts({
			chart: {
				type: 'column',
				height:'300',
			},
			colors: colorbrewer[colorPalette][colorPick].slice(),
			credits: {
				enabled: false
			},
			title: {
				text: data.feed.title.$t,
				style: { fontSize: titleFontSize, fontWeight: "bold", color: titleColor},
			},
			xAxis: {
				categories: categ
			},
			yAxis: {
				title: {
					text: unitatsY
				},
				//tickInterval: intervalY,			
				labels: {
					format: '{value:,.0f}'
				}
			},
			plotOptions: {
			  column: {
            stacking: 'percent'
        },				  
				pointPadding: 0.2,
				borderWidth: 0,
				dataLabels: {
					enabled: labels,
					allowOverlap: true,
					color: '#222222',
					style: { fontSize: '8px',textShadow: "0px 0px 5px #eeeeee", fontWeight: "normal"},
					shadow: false,
				    formatter: function() {
						if (this.y != 0) {
						  return this.y.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
						} else {
						  return null;
						}
					}
				}
			},			
			legend:{
				itemStyle: { color: '#333333', cursor: 'pointer', fontSize: legendFontSize, fontWeight: 'normal' }
			},
			tooltip: {
			  pointFormat: '{series.name}: <b>{point.y}</b><br/>',
			  shared: true
			},
			series: valors
		});
	});
	console.log('end config HighChart');
};

function UpdateStackedChartNormal(sheet, place, dataFile, intervalY, unitatsY, labels){
	var newData;
	var valors = [];
	var idx=0;
	var resultsArray = [];
	var categ=[];
	
	var url = "https://spreadsheets.google.com/feeds/list/"+dataFile+"/"+sheet+"/public/values?alt=json";
	console.log('Init Chart: Sheet('+sheet+') ChartNum ('+place+') URL ('+url+')');

	$.getJSON(url, function(data) {
		for (var j=0;j<25;j++){
			var fl='data.feed.entry[0].gsx$c'+j;
			if(eval(fl)){
				categ.push(eval(fl+'.$t'));
			}
		}
		console.log("Categories: "+categ);
		for( var i=1;i<data.feed.entry.length;i++){
			var tmp=new Object();
			tmp.name=eval('data.feed.entry['+i+'].gsx$serie.$t');
			console.log("Serie:"+tmp.name);
			tmp.data=[];
			for (var j=0;j<25;j++){
				var fl='data.feed.entry['+i+'].gsx$c'+j;
				if(eval(fl)){
					var str=eval(fl+'.$t').replace('.','');
					str=str.replace(',','.');
					tmp.data[j]=parseFloat( str);
					//tmp.data[j]=parseInt(eval(fl+'.$t'));
					console.log(fl+'.$t = '+tmp.data[j]);
				}
			}
			valors.push(tmp);
			console.log(valors[i-1]);
		};

		console.log(place);
		$(place).highcharts({
			chart: {
				type: 'column',
				height:'300',
			},
			colors: colorbrewer[colorPalette][colorPick].slice(),
			credits: {
				enabled: false
			},
			title: {
				text: data.feed.title.$t,
				style: { fontSize: titleFontSize, fontWeight: "bold", color: titleColor},
			},
			xAxis: {
				categories: categ
			},
			yAxis: {
				title: {
					text: unitatsY
				},
				//tickInterval: intervalY,			
				labels: {
					format: '{value:,.0f}'
				}
			},
			plotOptions: {
			  column: {
            stacking: 'normal'
        },				  
				pointPadding: 0.2,
				borderWidth: 0,
				dataLabels: {
					enabled: labels,
					allowOverlap: true,
					color: '#222222',
					style: { fontSize: '8px',textShadow: "0px 0px 5px #eeeeee", fontWeight: "normal"},
					shadow: false,
				    formatter: function() {
						if (this.y != 0) {
						  return this.y.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
						} else {
						  return null;
						}
					}
				}
			},			
			legend:{
				itemStyle: { color: '#333333', cursor: 'pointer', fontSize: legendFontSize, fontWeight: 'normal' }
			},
			tooltip: {
			  pointFormat: '{series.name}: <b>{point.y}</b><br/>',
			  shared: true
			},
			series: valors
		});
	});
	console.log('end config HighChart');
};