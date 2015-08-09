function MapaBarris(sheet, place, dataFile, titol){
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
	var categ=[];	
	var url = "https://spreadsheets.google.com/feeds/list/"+dataFile+"/"+sheet+"/public/values?alt=json";
	console.log('Init ChartArea: Sheet('+sheet+') ChartNum ('+place+') URL ('+url+')');
	
	$.getJSON('http://sitroom.bcn.cat/widget/KPIsHU/img/barrisBCN.js', function (geojson) {
		$.getJSON(url, function(data) {
			for (var j=0;j<100;j++){
				var fl='data.feed.entry[0].gsx$c'+j;
				if(eval(fl)){
					categ.push(eval(fl+'.$t'));
				}
			}
			console.log("Categories: "+categ);
			var infoBox="";
			for (var j=0;j<100;j++){
				var tmp=new Object();
//				tmp.name=eval('data.feed.entry['+i+'].gsx$serie.$t');
//				console.log("Serie:"+tmp.name);
				for( var i=1;i<data.feed.entry.length;i++){
//					name=eval('data.feed.entry['+i+'].gsx$serie.$t');
					if((j==0)&&(eval('data.feed.entry['+i+'].gsx$serie.$t')!='value')) infoBox=infoBox+eval('data.feed.entry['+i+'].gsx$serie.$t')+':<b>{point.'+eval('data.feed.entry['+i+'].gsx$serie.$t')+'}</b><br/>';
					var fl='data.feed.entry['+i+'].gsx$c'+j;
					if(eval(fl)){
						var str=eval(fl+'.$t').replace('.','');
						str=str.replace(',','.');
						if(str==''){ str='0';};
						var value=parseFloat( str);
						if( !value ) value=eval(fl+'.$t');
						tmp[eval('data.feed.entry['+i+'].gsx$serie.$t')]=value;
					}
				}
				valors.push(tmp);
				console.log(valors[i-1]);
			};

			// Initiate the chart
			$(place).highcharts('Map', {
				chart : {
				},
				title : {
					text : titol
				},

				legend: {
					layout: 'horizontal',
					borderWidth: 0,
					backgroundColor: 'rgba(255,255,255,0.85)',
					floating: true,
					verticalAlign: 'bottom',
					align: 'center',
					y: 0
				},
				mapNavigation: {
					enabled: false
				},

				colorAxis: {
					min: 1,
					type: 'logarithmic',
					minColor: '#eefff1',
					maxColor: '#000022',
					stops: [[0, '#effff5'],
							[0.67, '#61ae0e'],
							[1, '#000022']]
				},
				tooltip: {
					pointFormat: infoBox,
				},
				series : [{
					data: valors,
					mapData: geojson,
					joinBy: ['C_Barri', 'C_Barri'],
				}]
			});
		});
	});
	console.log('end config HighChart');
};
