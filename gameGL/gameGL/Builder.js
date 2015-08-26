function Builder() {
}

Builder.prototype.exportBinary = function(data) {
	
}

Builder.prototype.downloadBinary = function(binData) {
	var blob = new Blob(binData, {type : "application/octet-binary"});
	
	var aElement = document.getElementById("binData");
	var url = URL.createObjectURL(blob);
	aElement.href = url;
	aElement.name = "binData";
	aElement.download = aElement.name;
	aElement.innerHTML = aElement.name;
}