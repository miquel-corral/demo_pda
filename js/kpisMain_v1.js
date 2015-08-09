function MainKPIs(dataFile){
	var newData;
	var valors = [];
	var Yaxis = [];
	var idx=0;
	var resultsArray = [];
	var XLabels=[];
	var categ=[];	


	var url = "https://spreadsheets.google.com/feeds/list/"+dataFile+"/1/public/values?alt=json";
	console.log(url);
	$.getJSON(url, function(data) {
		for (var j=0;j<20;j++){
			var fl='data.feed.entry['+j+'].gsx$full';
			if(eval(fl)){
				var full=data.feed.entry[j].gsx$full.$t;
				var titol=data.feed.entry[j].gsx$titol.$t;
				var HTMLdesti=data.feed.entry[j].gsx$desti.$t;
				var HTMLample=data.feed.entry[j].gsx$ample.$t;
				var tipusComp=data.feed.entry[j].gsx$tipus.$t;
				var subtitol=data.feed.entry[j].gsx$subtitol.$t;
				var labels=data.feed.entry[j].gsx$labels.$t;
				if(tipusComp=='LlistaProjectes'){ UpdateText(full,'#'+HTMLdesti,dataFile)};
				if(tipusComp=='Grafic'){ 
					UpdateChart2(full, '#'+HTMLdesti, dataFile, titol, subtitol, labels);
					SetWidth(HTMLdesti, HTMLample);
				}
				if(tipusComp=='MapaBarris'){
					MapaBarris(full, '#'+HTMLdesti, dataFile, titol);
					SetWidth(HTMLdesti, HTMLample);
				}
				categ.push(eval(fl+'.$t'));
			}
		}
	});
	console.log('end config HighChart');
};
