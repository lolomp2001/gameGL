function Dijkstra() {
	this.worldGraph = [[]];
	this.pathArray = [];
	this.itemsList = [];
}

Dijkstra.prototype.initializeGraph = function (iXMin, iYmin, iXMax, iYMax){
	
	for (var i=iXMin; i<=iXMax; i++) {
		this.worldGraph[i] = [];
		
		for (var j=iYmin; j<=iYMax; j++) {
			this.worldGraph[i][j] = {checked: false, weigth: DIJKSTRA_INFINITE_WEIGTH, parentItem: []};
		}
	}
}

Dijkstra.prototype.initializeFirstItem = function (iXStartPos, iYStartPos) {
	var items = {x: iXStartPos, y: iYStartPos, weigth: 0};
	this.itemsList.push(items);
	
	this.worldGraph[iXStartPos][iYStartPos] = {checked: false, weigth: 0, parentItem: items};
}

Dijkstra.prototype.getPath = function (iXMin, iYmin, iXMax, iYMax, iXStartPos, iYStartPos, iXDestination, iYDestination) {
	var startItem = {x: iXStartPos, y: iYStartPos};
	var lastItem = {x: iXDestination, y: iYDestination};
	
	if (startItem.x!=lastItem.x || startItem.y!=lastItem.y) {
		this.checkItem(iXMin, iYmin, iXMax, iYMax, iXStartPos, iYStartPos);
		
		var tempListItem = [];
		
		while (this.indexOfItemsArray(tempListItem, lastItem)<0) {
			tempListItem = this.itemsList.slice(0);
			
			for (var i=0; i<tempListItem.length; i++) {
					this.checkItem(iXMin, iYmin, iXMax, iYMax, tempListItem[i].x, tempListItem[i].y);
			}
		}
		var i = iXDestination;
		var j = iYDestination;
		
		while (this.worldGraph[i][j].parentItem[0].x!=iXStartPos || this.worldGraph[i][j].parentItem[0].y!=iYStartPos) {
			var items = this.getRandomParent(this.worldGraph[i][j].parentItem);
			this.pathArray.splice(0, 0, items);
			
			i = items.x;
			j = items.y;
		}
		
		this.pathArray.push(lastItem);
	}
	
	else {
		this.pathArray.push(lastItem);
	}
	
	this.pathArray.splice(0, 0, startItem);
	
	return this.pathArray;
}

Dijkstra.prototype.checkItem = function (iXMin, iYmin, iXMax, iYMax, iXStartPos, iYStartPos) {
	var itemChecked = {x: iXStartPos, y: iYStartPos};
	this.itemsList.splice(this.indexOfItemsArray(this.itemsList, itemChecked), 1);
	var itemWeigth = this.worldGraph[iXStartPos][iYStartPos].weigth;
	
	// sommet 1 sur 6 (-1, -1)
	if ((iXStartPos-(1-iYStartPos & 1))>=iXMin && (iYStartPos-1)>=iYmin && !this.worldGraph[(iXStartPos-(1-iYStartPos & 1))][iYStartPos-1].checked) {
		var currentWeigth = this.worldGraph[(iXStartPos-(1-iYStartPos & 1))][iYStartPos-1].weigth;
		this.worldGraph[(iXStartPos-(1-iYStartPos & 1))][iYStartPos-1].weigth = Math.min(DIJKSTRA_DIAG_WEIGHT+itemWeigth,currentWeigth);
		
		if (currentWeigth>=this.worldGraph[(iXStartPos-(1-iYStartPos & 1))][iYStartPos-1].weigth) {
			var newParentItem = {x: iXStartPos, y: iYStartPos, weigth: itemWeigth};
			this.worldGraph[(iXStartPos-(1-iYStartPos & 1))][iYStartPos-1].parentItem.push(newParentItem);
		}
		
		var items = {x: (iXStartPos-(1-iYStartPos & 1)), y: iYStartPos-1};
		
		if (this.indexOfItemsArray(this.itemsList, items)<0) {
			this.itemsList.push(items);
		}
		
	}
	// sommet 2 sur 6 (1, -1)
	if ((iXStartPos+(iYStartPos & 1))<=iXMax && (iYStartPos-1)>=iYmin && !this.worldGraph[iXStartPos+(iYStartPos & 1)][iYStartPos-1].checked) {
		var currentWeigth = this.worldGraph[iXStartPos+(iYStartPos & 1)][iYStartPos-1].weigth;
		this.worldGraph[iXStartPos+(iYStartPos & 1)][iYStartPos-1].weigth = Math.min(DIJKSTRA_DIAG_WEIGHT+itemWeigth,currentWeigth);
		
		if (currentWeigth>=this.worldGraph[iXStartPos+(iYStartPos & 1)][iYStartPos-1].weigth) {
			var newParentItem = {x: iXStartPos, y: iYStartPos, weigth: itemWeigth};
			this.worldGraph[iXStartPos+(iYStartPos & 1)][iYStartPos-1].parentItem.push(newParentItem);
		}
		
		var items = {x: iXStartPos+(iYStartPos & 1), y: iYStartPos-1};

		if (this.indexOfItemsArray(this.itemsList, items)<0) {
			this.itemsList.push(items);
		}
	}
	// sommet 3 sur 6 (1, 0)
	if ((iXStartPos+1)<=iXMax && !this.worldGraph[iXStartPos+1][iYStartPos].checked) {
		var currentWeigth = this.worldGraph[iXStartPos+1][iYStartPos].weigth;
		this.worldGraph[iXStartPos+1][iYStartPos].weigth = Math.min(DIJKSTRA_SIDE_WEIGTH+itemWeigth,currentWeigth);
		
		if (currentWeigth>=this.worldGraph[iXStartPos+1][iYStartPos].weigth) {
			var newParentItem = {x: iXStartPos, y: iYStartPos, weigth: itemWeigth};
			this.worldGraph[iXStartPos+1][iYStartPos].parentItem.push(newParentItem);
		}
		
		var items = {x: iXStartPos+1, y: iYStartPos};
		
		if (this.indexOfItemsArray(this.itemsList, items)<0) {
			this.itemsList.push(items);
		}
	}
	// sommet 4 sur 6 (1, 1)
	if ((iXStartPos+(iYStartPos & 1))<=iXMax && (iYStartPos+1)<=iYMax && !this.worldGraph[iXStartPos+(iYStartPos & 1)][iYStartPos+1].checked) {
		var currentWeigth = this.worldGraph[iXStartPos+(iYStartPos & 1)][iYStartPos+1].weigth;
		this.worldGraph[iXStartPos+(iYStartPos & 1)][iYStartPos+1].weigth = Math.min(DIJKSTRA_DIAG_WEIGHT+itemWeigth,currentWeigth);
		
		if (currentWeigth>=this.worldGraph[iXStartPos+(iYStartPos & 1)][iYStartPos+1].weigth) {
			var newParentItem = {x: iXStartPos, y: iYStartPos, weigth: itemWeigth};
			this.worldGraph[iXStartPos+(iYStartPos & 1)][iYStartPos+1].parentItem.push(newParentItem);
		}
		
		var items = {x: iXStartPos+(iYStartPos & 1), y: iYStartPos+1};

		if (this.indexOfItemsArray(this.itemsList, items)<0) {
			this.itemsList.push(items);
		}
	}
	// sommet 5 sur 6 (-1, 1)
	if ((iXStartPos-(1-iYStartPos & 1))>=iXMin && (iYStartPos+1)<=iYMax && !this.worldGraph[(iXStartPos-(1-iYStartPos & 1))][iYStartPos+1].checked) {
		var currentWeigth = this.worldGraph[(iXStartPos-(1-iYStartPos & 1))][iYStartPos+1].weigth;
		this.worldGraph[(iXStartPos-(1-iYStartPos & 1))][iYStartPos+1].weigth = Math.min(DIJKSTRA_DIAG_WEIGHT+itemWeigth,currentWeigth);
		
		if (currentWeigth>=this.worldGraph[(iXStartPos-(1-iYStartPos & 1))][iYStartPos+1].weigth) {
			var newParentItem = {x: iXStartPos, y: iYStartPos, weigth: itemWeigth};
			this.worldGraph[(iXStartPos-(1-iYStartPos & 1))][iYStartPos+1].parentItem.push(newParentItem);
		}
		
		var items = {x: (iXStartPos-(1-iYStartPos & 1)), y: iYStartPos+1};

		if (this.indexOfItemsArray(this.itemsList, items)<0) {
			this.itemsList.push(items);
		}
	}
	// sommet 6 sur 6 (-1, 0)
	if ((iXStartPos-1)>=iXMin && !this.worldGraph[iXStartPos-1][iYStartPos].checked) {
		var currentWeigth = this.worldGraph[iXStartPos-1][iYStartPos].weigth;
		this.worldGraph[iXStartPos-1][iYStartPos].weigth = Math.min(DIJKSTRA_SIDE_WEIGTH+itemWeigth,currentWeigth);
		
		if (currentWeigth>=this.worldGraph[iXStartPos-1][iYStartPos].weigth) {
			var newParentItem = {x: iXStartPos, y: iYStartPos, weigth: itemWeigth};
			this.worldGraph[iXStartPos-1][iYStartPos].parentItem.push(newParentItem);
		}
		
		var items = {x: iXStartPos-1, y: iYStartPos};

		if (this.indexOfItemsArray(this.itemsList, items)<0) {
			this.itemsList.push(items);
		}
	}
	
	this.worldGraph[iXStartPos][iYStartPos].checked = true;
}

Dijkstra.prototype.indexOfItemsArray = function (itemsArray, item) {
	var iIndex = -1;
	for (var i=0; i<itemsArray.length; i++) {
		if (itemsArray[i].x==item.x && itemsArray[i].y==item.y) {
			iIndex = i;
			break;
		}
	}
	
	return iIndex;
}

Dijkstra.prototype.getRandomParent = function (parentItems) {
	parentItems.sort(function(a, b) {
		
		if (a.weigth < b.weigth) {
			return -1;
		}
		
		if (a.weigth > b.weigth) {
			return 1;
		}
		
		return 0;
	});
	
	var resultParents = [];
	var minWiegth = parentItems[0].weigth;
	
	for (var i=0; i<parentItems.length; i++) {
		var weigth = parentItems[i].weigth;
		
		if (weigth<minWiegth+DIJKSTRA_DIAG_WEIGHT) {
			resultParents.push(parentItems[i])
		}
		
		else {
			break;
		}
	}
	
	var rand = Math.floor(Math.random()*resultParents.length);
	
	return resultParents[rand];
}