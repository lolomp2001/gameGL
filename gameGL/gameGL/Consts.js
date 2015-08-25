var GAME_FPS = 60;

var MAP_TILE_WIDTH = 32;
var MAP_TILE_HEIGHT = 16;

var MAP_TILE_FACTOR =  MAP_TILE_WIDTH/MAP_TILE_HEIGHT;

var BACKGROUND_TEXTURE_WIDTH = 128;
var BACKGROUND_TEXTURE_HEIGHT = 64;

var BACKGROUND_CHARACTER_WIDTH = 128;
var BACKGROUND_CHARACTER_HEIGHT = 256;

var INTERFACE_TEXTURE_WIDTH = 512;
var INTERFACE_TEXTURE_HEIGHT = 64;

var DIJKSTRA_INFINITE_WEIGTH = 1000000;
var DIJKSTRA_SIDE_WEIGTH = MAP_TILE_WIDTH;
var DIJKSTRA_DIAG_WEIGHT = Math.pow(Math.pow(MAP_TILE_WIDTH/2,2)+Math.pow(MAP_TILE_HEIGHT*0.75,2), 0.5);