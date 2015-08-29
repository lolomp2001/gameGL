function Builder() {
	this.arrayData = [];
}

Builder.prototype.exportData = function(arrayData) {
	var serializedArr = JSON.stringify(arrayData);
	this.downloadData(serializedArr);
}

Builder.prototype.downloadData = function(data) {
	var blob = new Blob([data], {type : "application/json"});
	
	var aElement = document.getElementById("data");
	var url = URL.createObjectURL(blob);
	aElement.href = url;
	aElement.name = "mapData.raw";
	aElement.download = aElement.name;
	aElement.innerHTML = "mapData";
}

Builder.prototype.loadData = function (dataFile) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET","data/"+dataFile, false);
	xhr.send(null);
	var serializedArr = xhr.responseText;
	var arrayData = JSON.parse(serializedArr);
	
	return arrayData;
}