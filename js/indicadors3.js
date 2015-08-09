
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
function UpdateChart2(sheet, place, dataFile, intervalY, unitatsY, labels, multiAxi){
// sheet: sheet del full de càlcul
// place: etiqueta HTML a substituir
// dataFile: GoogleDrive
// intervalY: cada quantes unitats va una divisió Y
// unitatsY: ARRAY de etiquetes per cada eix de cada SERIE ( si multiAxis=TRUE )
// labels: TRUE/FALSE si posa etiquetes o no
// multiAxi: TRUE/FALSE si es vol múltiple eix Y
	var newData;
	var valors = [];
	var Yaxis = [];
	var idx=0;
	var resultsArray = [];
	var XLabels=[];
	
	
//	var url = "https://spreadsheets.google.com/feeds/list/"+dataFile+"/od6/public/values?alt=json";
	var url = "https://spreadsheets.google.com/feeds/list/"+dataFile+"/"+sheet+"/public/values?alt=json";
	//https://spreadsheets.google.com/feeds/list/' + urlLocation + '/od6/public/values?alt=json';
	console.log('Init Chart: Sheet('+sheet+') ChartNum ('+place+') URL ('+url+')');

	$.getJSON(url, function(data) {
		for (var j=0;j<25;j++){
			var fl='data.feed.entry[0].gsx$c'+j;
			if(eval(fl)){
				XLabels.push(eval(fl+'.$t'));
			}
		}
		console.log("Categories: "+XLabels);
		for( var i=1;i<data.feed.entry.length;i++){
			var Ytmp=new Object();
			var Vtmp=new Object();
			
			Vtmp.name=eval('data.feed.entry['+i+'].gsx$serie.$t');
			Vtmp.type=eval('data.feed.entry['+i+'].gsx$tipus.$t');
//			Vtmp.dataLabels={enabled: true, allowOverlap: true, color: '#222222', style: { fontSize: '8px',textShadow: "0px 0px 5px #eeeeee", fontWeight: "normal"}, shadow: false, formatter: function() {if (this.y != 0) { return this.y.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} else { return null; }};
			Vtmp.dataLabels={
						enabled: (eval('data.feed.entry['+i+'].gsx$etiquetes.$t')=="TRUE")? true: false,
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
					};

			//{enabled:eval('data.feed.entry['+i+'].gsx$etiquetes.$t')};
			if ( multiAxi ) Vtmp.yAxis=i-1;
			else Vtmp.yAxis=0;
			Ytmp.title={text : unitatsY[i-1], style: { color: colorbrewer[colorPalette][colorPick][i-1]}};
			Ytmp.id=i-1;
			Ytmp.tickInterval=intervalY;
			Ytmp.labels={format:'{value:,.0f}',style: {color: colorbrewer[colorPalette][colorPick][i-1]}};
			if ( i>1) {
				Ytmp.opposite=true;
			}
			console.log("Serie:"+Vtmp.name);
			Vtmp.data=[];
			for (var j=0;j<25;j++){
				var fl='data.feed.entry['+i+'].gsx$c'+j;
				if(eval(fl)){
					var str=eval(fl+'.$t').replace('.','');
					str=str.replace(',','.');
					if(str==''){str='0';j=25}
					else{
						Vtmp.data[j]=parseFloat( str);
						console.log(fl+'.$t = '+Vtmp.data[j]);
					};
				}
			}
			valors.push(Vtmp);
			if(multiAxi||(i==1)) { 
				Yaxis.push(Ytmp) ;
			};
			console.log(valors[i-1]);
		};

		console.log(place);
		$(place).highcharts({
			chart: {
//				type: 'line',
				height:'300',
			},
			credits: {
				enabled: false
			},
			title: {
				text: data.feed.title.$t,
				style: { fontSize: titleFontSize, fontWeight: "bold", color:titleColor},
			},
			colors: colorbrewer[colorPalette][colorPick].slice(),
			xAxis: {
				categories: XLabels
			},
			yAxis: Yaxis,
			/*{
				title: {
					text: unitatsY
				},
				tickInterval: intervalY,
				labels: {
					format: '{value:,.0f}'
				}
			},*/
			plotOptions: {
				line: {
					dataLabels: {
						enabled: false,
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
				itemStyle: {  cursor: 'pointer', fontSize: legendFontSize, fontWeight: 'normal' }
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

function UpdateChartStackedColumn(sheet, place, dataFile, intervalY, unitatsY, labels){
	var newData;
	var valors = [];
	var idx=0;
	var resultsArray = [];
	var categ=[];
	
	
//	var url = "https://spreadsheets.google.com/feeds/list/"+dataFile+"/od6/public/values?alt=json";
	var url = "https://spreadsheets.google.com/feeds/list/"+dataFile+"/"+sheet+"/public/values?alt=json";
	//https://spreadsheets.google.com/feeds/list/' + urlLocation + '/od6/public/values?alt=json';
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
					if(str==''){ str='0';};
					tmp.data[j]=parseFloat( str);
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
				tickInterval: intervalY/10,
				max: intervalY,
				labels: {
					format: '{value:,.0f}'
				}
			},
			plotOptions: {
				column: {
					stacking: 'normal',
					//padding: 0,
					dataLabels: {
						enabled: true,
						allowOverlap: true,
						color: '#000000',
						style: { fontSize: '8px',textShadow: "0 0 2px #ffffff, 0 0 5px #ffffff, 0 0 10px #ffffff", fontWeight: "normal"},
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
				itemStyle: { color: '#333333', cursor: 'pointer', fontSize: legendFontSize, fontWeight: 'normal' },
				align:'center'
			},
			tooltip: {
			  pointFormat: '{series.name}: <b>{point.y}</b><br/>',
			},
			series: valors
		});
	});
	console.log('end config HighChart');
};

function UpdateChartLines(sheet, place, dataFile, intervalY, unitatsY, labels, multiAxi){
// sheet: sheet del full de càlcul
// place: etiqueta HTML a substituir
// dataFile: GoogleDrive
// intervalY: cada quantes unitats va una divisió Y
// unitatsY: ARRAY de etiquetes per cada eix de cada SERIE ( si multiAxis=TRUE )
// labels: TRUE/FALSE si posa etiquetes o no
// multiAxi: TRUE/FALSE si es vol múltiple eix Y
	var newData;
	var valors = [];
	var Yaxis = [];
	var idx=0;
	var resultsArray = [];
	var XLabels=[];
	
	
//	var url = "https://spreadsheets.google.com/feeds/list/"+dataFile+"/od6/public/values?alt=json";
	var url = "https://spreadsheets.google.com/feeds/list/"+dataFile+"/"+sheet+"/public/values?alt=json";
	//https://spreadsheets.google.com/feeds/list/' + urlLocation + '/od6/public/values?alt=json';
	console.log('Init Chart: Sheet('+sheet+') ChartNum ('+place+') URL ('+url+')');

	$.getJSON(url, function(data) {
		for (var j=0;j<25;j++){
			var fl='data.feed.entry[0].gsx$c'+j;
			if(eval(fl)){
				XLabels.push(eval(fl+'.$t'));
			}
		}
		console.log("Categories: "+XLabels);
		for( var i=1;i<data.feed.entry.length;i++){
			var Ytmp=new Object();
			var Vtmp=new Object();
			
			Vtmp.name=eval('data.feed.entry['+i+'].gsx$serie.$t');
			if ( multiAxi ) Vtmp.yAxis=i-1;
			else Vtmp.yAxis=0;
			Vtmp.type='line';
			Ytmp.title={text : unitatsY[i-1], style: { color: colorbrewer[colorPalette][colorPick][i-1]}};
			Ytmp.id=i-1;
			Ytmp.tickInterval=intervalY;
			Ytmp.labels={format:'{value:,.0f}',style: {color: colorbrewer[colorPalette][colorPick][i-1]}};
			if ( i>1) {
				Ytmp.opposite=true;
			}
			console.log("Serie:"+Vtmp.name);
			Vtmp.data=[];
			for (var j=0;j<25;j++){
				var fl='data.feed.entry['+i+'].gsx$c'+j;
				if(eval(fl)){
					var str=eval(fl+'.$t').replace('.','');
					str=str.replace(',','.');
					if(str==''){str='0';j=25}
					else{
						Vtmp.data[j]=parseFloat( str);
						console.log(fl+'.$t = '+Vtmp.data[j]);
					};
				}
			}
			valors.push(Vtmp);
			if(multiAxi||(i==1)) { 
				Yaxis.push(Ytmp) ;
			};
			console.log(valors[i-1]);
		};

		console.log(place);
		$(place).highcharts({
			chart: {
				type: 'line',
				height:'300',
			},
			credits: {
				enabled: false
			},
			title: {
				text: data.feed.title.$t,
				style: { fontSize: titleFontSize, fontWeight: "bold", color:titleColor},
			},
			colors: colorbrewer[colorPalette][colorPick].slice(),
			xAxis: {
				categories: XLabels
			},
			yAxis: Yaxis,
			/*{
				title: {
					text: unitatsY
				},
				tickInterval: intervalY,
				labels: {
					format: '{value:,.0f}'
				}
			},*/
			plotOptions: {
				line: {
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
				itemStyle: {  cursor: 'pointer', fontSize: legendFontSize, fontWeight: 'normal' }
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

function UpdateChartAreas(sheet, place, dataFile, intervalY, unitatsY, labels, multiAxi){
// sheet: sheet del full de càlcul
// place: etiqueta HTML a substituir
// dataFile: GoogleDrive
// intervalY: cada quantes unitats va una divisió Y
// unitatsY: ARRAY de etiquetes per cada eix de cada SERIE ( si multiAxis=TRUE )
// labels: TRUE/FALSE si posa etiquetes o no
// multiAxi: TRUE/FALSE si es vol múltiple eix Y
	var newData;
	var valors = [];
	var Yaxis = [];
	var idx=0;
	var resultsArray = [];
	var XLabels=[];
	
	
//	var url = "https://spreadsheets.google.com/feeds/list/"+dataFile+"/od6/public/values?alt=json";
	var url = "https://spreadsheets.google.com/feeds/list/"+dataFile+"/"+sheet+"/public/values?alt=json";
	//https://spreadsheets.google.com/feeds/list/' + urlLocation + '/od6/public/values?alt=json';
	console.log('Init ChartArea: Sheet('+sheet+') ChartNum ('+place+') URL ('+url+')');

	$.getJSON(url, function(data) {
		for (var j=0;j<25;j++){
			var fl='data.feed.entry[0].gsx$c'+j;
			if(eval(fl)){
				XLabels.push(eval(fl+'.$t'));
			}
		}
		console.log("Categories: "+XLabels);
		for( var i=1;i<data.feed.entry.length;i++){
			var Ytmp=new Object();
			var Vtmp=new Object();
			
			Vtmp.name=eval('data.feed.entry['+i+'].gsx$serie.$t');
			if ( multiAxi ) Vtmp.yAxis=i-1;
			else Vtmp.yAxis=0;
			Vtmp.type='area';
			Ytmp.title={text : unitatsY[i-1], style: { color: colorbrewer[colorPalette][colorPick][i-1]}};
			Ytmp.id=i-1;
			Ytmp.tickInterval=intervalY;
			Ytmp.labels={format:'{value:,.0f}',style: {color: colorbrewer[colorPalette][colorPick][i-1]}};
			if ( i>1) {
				Ytmp.opposite=true;
			}
			console.log("Serie:"+Vtmp.name);
			Vtmp.data=[];
			for (var j=0;j<25;j++){
				var fl='data.feed.entry['+i+'].gsx$c'+j;
				if(eval(fl)){
					var str=eval(fl+'.$t').replace('.','');
					str=str.replace(',','.');
					if(str==''){str='0';j=25}
					else{
						Vtmp.data[j]=parseFloat( str);
						console.log(fl+'.$t = '+Vtmp.data[j]);
					};
				}
			}
			valors.push(Vtmp);
			if(multiAxi||(i==1)) { 
				Yaxis.push(Ytmp) ;
			};
			console.log(valors[i-1]);
		};

		console.log(place);
		$(place).highcharts({
			chart: {
				type: 'area',
				height:'300',
			},
			credits: {
				enabled: false
			},
			title: {
				text: data.feed.title.$t,
				style: { fontSize: titleFontSize, fontWeight: "bold", color:titleColor},
			},
			colors: colorbrewer[colorPalette][colorPick].slice(),
			xAxis: {
				categories: XLabels
			},
			yAxis: Yaxis,
			/*{
				title: {
					text: unitatsY
				},
				tickInterval: intervalY,
				labels: {
					format: '{value:,.0f}'
				}
			},*/
			plotOptions: {
				area: {
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
				itemStyle: {  cursor: 'pointer', fontSize: legendFontSize, fontWeight: 'normal' }
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


function UpdateChartPie3D(sheet, place, dataFile, intervalY, unitatsY, labels){
	var newData;
	var valors = [];
	var idx=0;
	var resultsArray = [];
	var categ=[];
	
	
//	var url = "https://spreadsheets.google.com/feeds/list/"+dataFile+"/od6/public/values?alt=json";
	var url = "https://spreadsheets.google.com/feeds/list/"+dataFile+"/"+sheet+"/public/values?alt=json";
	//https://spreadsheets.google.com/feeds/list/' + urlLocation + '/od6/public/values?alt=json';
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
			var fl='data.feed.entry['+i+'].gsx$c0';
			if(eval(fl)){
				var str=eval(fl+'.$t').replace('.','');
				str=str.replace(',','.');
				if(str==''){tmp.y=0;}
				else{tmp.y=parseFloat( str);};
			}
			valors.push(tmp);
			console.log(valors[i-1]);
		};

		console.log(place);
		$(place).highcharts({
			chart: {
				type: 'pie',
				options3d: {
					enabled: true,
					alpha: 45,
					beta: 0
				},
				height:'300',
			},
			credits: {
				enabled: false
			},
			title: {
				text: data.feed.title.$t,
				style: { fontSize: titleFontSize, fontWeight: "bold", color:titleColor},
			},
			colors: colorbrewer[colorPalette][colorPick].slice(),
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            },			
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					depth: 35,
					showInLegend: true,
					dataLabels: {
						enabled: false,
					}
				}
			},
			legend: {
				labelFormat: '{name} ({y:.2f})',
				borderWidth: 0,
				itemStyle: { color: '#333333', cursor: 'pointer', fontSize: legendFontSize, fontWeight: 'normal',fontSize:'8px' }
			},
			tooltip: {
			  pointFormat: '{name}: <b>{point.y}</b><br/>',
			},
			series: [{
				type: 'pie',
				name: data.feed.title.$t,
				data: valors
			}]
		});
	});
	console.log('end config HighChart');
};



function resizeiframecent(ifid, oldx, oldy) {
    var actualwidth = document.getElementById(ifid).offsetWidth;
    var proporcion = actualwidth / oldx;
    newheight=proporcion * oldy;
    var newheight2 = Math.ceil(newheight);
    document.getElementById(ifid).height = newheight2;
}


