/************************************************
 * By Luis Saenz								*
 * In game global variables 
 ************************************************/
 
var default_Energy_Orbs : int = 10;			//value to be used on the first level
var default_Hook_Orbs : int = 4;			//value to be used on the first level

static var TOTAL_ENERGY_ORBS : int;			//total number of energy orbs on the level
static var TOTAL_HOCK_ORBS : int;			//total number of hock orbs on the level
static var SCORE : int = 0;					//player score
static var EnergyOrbs = new Array();		//array to hold Energy Orbs transforms
static var ENERGY : float = 100.00;			//remaining energy to use energy hock
static var ENERGY_GAIN : float = 5.0;		//amount of energy gain when collecting an energy orb

//game world limits
static var X_LIMIT : float = 125.0;			
static var Z_LIMIT : float = 80.0;

static var WALL_THIKNES : float = 2.5;		//wall thiknes
static var SHIP_AREA : float = 20.0;		//area where ship is placed at start (origin)
static var END_LEVEL : boolean = false;		//flag to indicate end of level
static var LEVEL_COUNT : int = 4 ;			//level counter - start at Scene 4 = Level 1

static var WIN_LOSE : boolean;				//flag to track whether player wins or loses level
static var SURVIVAL_MODE : boolean = false;	//flag to indicate type of game mode