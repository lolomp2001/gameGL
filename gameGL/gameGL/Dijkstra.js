function Dijkstra() {
	this.worldGraph = [[]];
	this.pathArray = [];
	this.itemsList = [];
}

Dijkstra.prototype.initializeGraph = function (iXMin, iYmin, iXMax, iYMax){
	
	for (var i=iXMin; i<=iXMax; i++) {
		this.worldGraph[i] = [];
		
		for (var j=iYmin; j<=iYMax; j++) {
			this.worldGraph[i][j] = {checked: false, weigth: DIJKSTRA_INFINITE_WEIGTH, parentItem: null};
		}
	}
}

Dijkstra.prototype.initializeFirstItem = function (iXNextPos, iYNextPos) {
	var items = {x: iXNextPos, y: iYNextPos};
	this.itemsList.push(items);
	
	this.worldGraph[iXNextPos][iYNextPos] = {checked: false, weigth: 0, parentItem: items};
}

Dijkstra.prototype.getPath = function (iXMin, iYmin, iXMax, iYMax, iXNextPos, iYNextPos, iXDestination, iYDestination) {

	this.checkItem(iXMin, iYmin, iXMax, iYMax, iXNextPos, iYNextPos);
	
	var startItem = {x: iXNextPos, y: iYNextPos};
	var lastItem = {x: iXDestination, y: iYDestination};
	
	var tempListItem = [];
	
	while (this.indexOfItemsArray(tempListItem, lastItem)<0) {
		tempListItem = this.itemsList.slice(0);
		
		for (var i=0; i<tempListItem.length; i++) {
				this.checkItem(iXMin, iYmin, iXMax, iYMax, tempListItem[i].x, tempListItem[i].y);
		}
	}
	
	console.log(iXDestination,iYDestination);
	
	this.pathArray.push(lastItem);
	
	var i = iXDestination;
	var j = iYDestination;
	
	while (this.worldGraph[i][j].parentItem.x!=iXNextPos || this.worldGraph[i][j].parentItem.y!=iYNextPos) {
		var items = {x: this.worldGraph[i][j].parentItem.x, y: this.worldGraph[i][j].parentItem.y};
		this.pathArray.splice(0, 0, items);
		
		i = items.x;
		j = items.y;
	}
	
	this.pathArray.splice(0, 0, startItem);
	
	return this.pathArray;
}

Dijkstra.prototype.checkItem = function (iXMin, iYmin, iXMax, iYMax, iXNextPos, iYNextPos) {
	var itemsChecked = {x: iXNextPos, y: iYNextPos};
	this.itemsList.splice(this.indexOfItemsArray(this.itemsList, itemsChecked), 1);
	var itemWeigth = this.worldGraph[iXNextPos][iYNextPos].weigth;
	
	// sommet 1 sur 6 (-1, -1)
	if ((iXNextPos-(1-iYNextPos & 1))>=iXMin && (iYNextPos-1)>=iYmin && !this.worldGraph[(iXNextPos-(1-iYNextPos & 1))][iYNextPos-1].checked) {
		var currentWeigth = this.worldGraph[(iXNextPos-(1-iYNextPos & 1))][iYNextPos-1].weigth;
		this.worldGraph[(iXNextPos-(1-iYNextPos & 1))][iYNextPos-1].weigth = Math.min(DIJKSTRA_DIAG_WEIGTH+itemWeigth,currentWeigth);
		
		if (currentWeigth!=this.worldGraph[(iXNextPos-(1-iYNextPos & 1))][iYNextPos-1].weigth) {
			this.worldGraph[(iXNextPos-(1-iYNextPos & 1))][iYNextPos-1].parentItem = itemsChecked;
		}
		
		var items = {x: (iXNextPos-(1-iYNextPos & 1)), y: iYNextPos-1};
		
		if (this.indexOfItemsArray(this.itemsList, items)<0) {
			this.itemsList.push(items);
		}
		
	}
	// sommet 2 sur 6 (1, -1)
	if ((iXNextPos+(iYNextPos & 1))<=iXMax && (iYNextPos-1)>=iYmin && !this.worldGraph[iXNextPos+(iYNextPos & 1)][iYNextPos-1].checked) {
		var currentWeigth = this.worldGraph[iXNextPos+(iYNextPos & 1)][iYNextPos-1].weigth;
		this.worldGraph[iXNextPos+(iYNextPos & 1)][iYNextPos-1].weigth = Math.min(DIJKSTRA_DIAG_WEIGTH+itemWeigth,currentWeigth);
		
		if (currentWeigth!=this.worldGraph[iXNextPos+(iYNextPos & 1)][iYNextPos-1].weigth) {
			this.worldGraph[iXNextPos+(iYNextPos & 1)][iYNextPos-1].parentItem = itemsChecked;
		}
		
		var items = {x: iXNextPos+(iYNextPos & 1), y: iYNextPos-1};

		if (this.indexOfItemsArray(this.itemsList, items)<0) {
			this.itemsList.push(items);
		}
	}
	// sommet 3 sur 6 (1, 0)
	if ((iXNextPos+1)<=iXMax && !this.worldGraph[iXNextPos+1][iYNextPos].checked) {
		var currentWeigth = this.worldGraph[iXNextPos+1][iYNextPos].weigth;
		this.worldGraph[iXNextPos+1][iYNextPos].weigth = Math.min(DIJKSTRA_SIDE_WEIGTH+itemWeigth,currentWeigth);
		
		if (currentWeigth!=this.worldGraph[iXNextPos+1][iYNextPos].weigth) {
			this.worldGraph[iXNextPos+1][iYNextPos].parentItem = itemsChecked;
		}
		
		var items = {x: iXNextPos+1, y: iYNextPos};
		
		if (this.indexOfItemsArray(this.itemsList, items)<0) {
			this.itemsList.push(items);
		}
	}
	// sommet 4 sur 6 (1, 1)
	if ((iXNextPos+(iYNextPos & 1))<=iXMax && (iYNextPos+1)<=iYMax && !this.worldGraph[iXNextPos+(iYNextPos & 1)][iYNextPos+1].checked) {
		var currentWeigth = this.worldGraph[iXNextPos+(iYNextPos & 1)][iYNextPos+1].weigth;
		this.worldGraph[iXNextPos+(iYNextPos & 1)][iYNextPos+1].weigth = Math.min(DIJKSTRA_DIAG_WEIGTH+itemWeigth,currentWeigth);
		
		if (currentWeigth!=this.worldGraph[iXNextPos+(iYNextPos & 1)][iYNextPos+1].weigth) {
			this.worldGraph[iXNextPos+(iYNextPos & 1)][iYNextPos+1].parentItem = itemsChecked;
		}
		
		var items = {x: iXNextPos+(iYNextPos & 1), y: iYNextPos+1};

		if (this.indexOfItemsArray(this.itemsList, items)<0) {
			this.itemsList.push(items);
		}
	}
	// sommet 5 sur 6 (-1, 1)
	if ((iXNextPos-(1-iYNextPos & 1))>=iXMin && (iYNextPos+1)<=iYMax && !this.worldGraph[(iXNextPos-(1-iYNextPos & 1))][iYNextPos+1].checked) {
		var currentWeigth = this.worldGraph[(iXNextPos-(1-iYNextPos & 1))][iYNextPos+1].weigth;
		this.worldGraph[(iXNextPos-(1-iYNextPos & 1))][iYNextPos+1].weigth = Math.min(DIJKSTRA_DIAG_WEIGTH+itemWeigth,currentWeigth);
		
		if (currentWeigth!=this.worldGraph[(iXNextPos-(1-iYNextPos & 1))][iYNextPos+1].weigth) {
			this.worldGraph[(iXNextPos-(1-iYNextPos & 1))][iYNextPos+1].parentItem = itemsChecked;
		}
		
		var items = {x: (iXNextPos-(1-iYNextPos & 1)), y: iYNextPos+1};

		if (this.indexOfItemsArray(this.itemsList, items)<0) {
			this.itemsList.push(items);
		}
	}
	// sommet 6 sur 6 (-1, 0)
	if ((iXNextPos-1)>=iXMin && !this.worldGraph[iXNextPos-1][iYNextPos].checked) {
		var currentWeigth = this.worldGraph[iXNextPos-1][iYNextPos].weigth;
		this.worldGraph[iXNextPos-1][iYNextPos].weigth = Math.min(DIJKSTRA_SIDE_WEIGTH+itemWeigth,currentWeigth);
		
		if (currentWeigth!=this.worldGraph[iXNextPos-1][iYNextPos].weigth) {
			this.worldGraph[iXNextPos-1][iYNextPos].parentItem = itemsChecked;
		}
		
		var items = {x: iXNextPos-1, y: iYNextPos};

		if (this.indexOfItemsArray(this.itemsList, items)<0) {
			this.itemsList.push(items);
		}
	}
	
	this.worldGraph[iXNextPos][iYNextPos].checked = true;
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