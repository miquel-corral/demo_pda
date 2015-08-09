function UpdateText(sheet,place,dataFile){
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
			if(eval('data.feed.entry['+i+'].gsx$estat')){
				switch(eval('data.feed.entry['+i+'].gsx$estat.$t')){
					case 'Vermell':
						tmp.estat='redPoint.png';
						break;
					case 'Verd':
						tmp.estat='greenPoint.png';
						break;
					case 'Groc':
						tmp.estat='yellowPoint.png';
						break;
					case 'Finalitzat':
						tmp.estat='okPoint.png';
						break;
					case 'No iniciat':
						tmp.estat='niPoint.png';
						break;
					case 'Stop':
						tmp.estat='stopPoint.png';
						break;
					case 'Sense informar':
						tmp.estat='siPoint.png';
						break;
					case 'Res':
						tmp.estat='naPoint.png';
						break;
					default:
						tmp.estat='';
				};			
			};
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


function UpdateChart2(sheet, place, dataFile, titol, maxim, minim, interval_y, labels){
	var newData;
	var valors = [];
	var Yaxis = [];
	var idx=0;
	var resultsArray = [];
	var XLabels=[];
	var multiAxi=false;
	var axi=0;
	var intervalY;
	var maxCols;
		
	var url = "https://spreadsheets.google.com/feeds/list/"+dataFile+"/"+sheet+"/public/values?alt=json";
	console.log('Init Chart: Sheet('+sheet+') ChartNum ('+place+') URL ('+url+')');

	$.getJSON(url, function(datag) {
		for (var j=0;j<100;j++){
			var fl='datag.feed.entry[0].gsx$c'+j;
			if(eval(fl)){
				XLabels.push(eval(fl+'.$t'));
			}
			else{
				maxCols=j;
				j=100;
			}
		}
		console.log("Categories: "+XLabels);
		for( var i=1;i<datag.feed.entry.length;i++){
			var Ytmp=new Object();
			var Vtmp=new Object();
			
			Vtmp.name=eval('datag.feed.entry['+i+'].gsx$serie.$t');
			Vtmp.type=eval('datag.feed.entry['+i+'].gsx$tipus.$t');
			Vtmp.unitats=eval('datag.feed.entry['+i+'].gsx$unitats.$t');
			Vtmp.eix= (eval('datag.feed.entry['+i+'].gsx$eix.$t')=='TRUE')? 'TRUE':null;
//			Vtmp.datagLabels={enabled: true, allowOverlap: true, color: '#222222', style: { fontSize: '8px',textShadow: "0px 0px 5px #eeeeee", fontWeight: "normal"}, shadow: false, formatter: function() {if (this.y != 0) { return this.y.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} else { return null; }};
			Vtmp.intervalY=parseFloat(eval('datag.feed.entry['+i+'].gsx$marks.$t').replace('.',''));
			Vtmp.dataLabels={
				enabled: (eval('datag.feed.entry['+i+'].gsx$labels.$t')=="TRUE")? true: false,
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

			Ytmp.title={text : Vtmp.unitats, style: { color: colorbrewer[colorPalette][colorPick][axi]}};
			Ytmp.id=axi;
			Ytmp.tickInterval=Vtmp.intervalY;
			Ytmp.labels={format:'{value:,.0f}',style: {color: colorbrewer[colorPalette][colorPick][axi]}};
			if ( eval('datag.feed.entry['+i+'].gsx$max.$t')!='') {
				Ytmp.max=parseFloat(eval('datag.feed.entry['+i+'].gsx$max.$t').replace('.',''));
			}
			if ( eval('datag.feed.entry['+i+'].gsx$min.$t')!='') {
				Ytmp.min=parseFloat(eval('datag.feed.entry['+i+'].gsx$min.$t').replace('.',''));
			}
			if ( i>1) {
				Ytmp.opposite=true;
			}
			if ( Vtmp.eix||(i==1) ) {
				Vtmp.yAxis=axi;
				Yaxis.push(Ytmp) ;
			}
			else Vtmp.yAxis=0;

			axi++;
			console.log("Serie:"+Vtmp.name);
			Vtmp.data=[];
			for (var j=0;j<maxCols;j++){
				var fl='datag.feed.entry['+i+'].gsx$c'+j;
				if(eval(fl)){
					var str=eval(fl+'.$t').replace('.','');
					str=str.replace(',','.');
					if( Vtmp.type!='pie'){
						Vtmp.data.push(parseFloat( str));
					} 
					else{
						Vtmp.data.push({y:parseFloat( str),name:XLabels[j]});
					}
					console.log(fl+'.$t = '+Vtmp.data[j]);
				}
			}
			valors.push(Vtmp);
			console.log(valors[i-1]);
		};

		console.log(place);
		$(place).highcharts({
			chart: {
				height:'300',
			},
			credits: {
				enabled: false
			},
			title: {
				text: titol,
				style: { fontSize: titleFontSize, fontWeight: "bold", color:titleColor},
			},
			colors: colorbrewer[colorPalette][colorPick].slice(),
			xAxis: {
				categories: XLabels
			},
			//yAxis: Yaxis,

			plotOptions: {
				series:{
					dataLabels: {
						enabled: true,
						color: '#ff0000',
						shadow:true,
						formatter: function() {
							return "pospdops";
/*							if (this.y != 0) {
							  return "addd";//this.name+':'+this.y.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
							} else {
							  return "fddffdf";//null;
							}*/
						}
					}
				},
				pie: {
					dataLabels: {
						enabled:true,
						distance:0,
						color: '#00ff00',
						style: {"color": "#ff00ff", "fontSize": "11px", "fontWeight": "bold", "textShadow": "0 0 6px contrast, 0 0 3px contrast" },
						useHTML:true,
						format: '<b>{point.name}</b>: {point.y:.1f}',					
					},
					showInLegend:true,
				}
			},
			legend:{
				itemStyle: {  cursor: 'pointer', fontSize: legendFontSize, fontWeight: 'normal' }
			},
			tooltip: {
			  pointFormat: '{series.name}: <b>{point.y}</b>',
			  shared: true
			},
			series: valors,
		});
	});
	console.log('end config HighChart');
};


function SetWidth( elem, ample ){
	document.getElementById(elem).style.width = ample;
}

function resizeiframecent(ifid, oldx, oldy) {
    var actualwidth = document.getElementById(ifid).offsetWidth;
    var proporcion = actualwidth / oldx;
    newheight=proporcion * oldy;
    var newheight2 = Math.ceil(newheight);
    document.getElementById(ifid).height = newheight2;
}



