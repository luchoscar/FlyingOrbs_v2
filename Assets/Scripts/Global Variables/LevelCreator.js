/********************************************************
 * By Luis Saenz										*	
 * Script attached to an Empty Game Object				*
 * Script to create each level on the fly				*
 * It handles the logic to create each level and when  	*
 * to move to the next level 							*
 ********************************************************/

#pragma strict

var Energy_Orb_prefab : Transform;
var Hock_Orb_prefab : Transform;

//variables to be populated from GlobalVariablesScript
var x_pos : float;					//holds world x-limits (+/-)
var z_pos : float;					//holds world z-limits (+/-)
var wall_thickness : float;			//holds wall thickness
var ship_area : float;				//holds area where energy/hockable orbs cannot be placed
var Score : GUIText;				//object that displays player score
var Energy : GUIText;				//object that displays player remaining energy

var LightWater : Transform;	
var DarkWatter : Transform;

var last_level : boolean = false;	//flag to track whether this is the last level

//get variables to create level
function Awake () 
{    
	DontDestroyOnLoad (this.gameObject);
	transform.GetComponent(GlobalVariablesHolder).TOTAL_ENERGY_ORBS = transform.GetComponent(GlobalVariablesHolder).default_Energy_Orbs;
	transform.GetComponent(GlobalVariablesHolder).TOTAL_HOCK_ORBS = transform.GetComponent(GlobalVariablesHolder).default_Hook_Orbs;		
	transform.GetComponent(GlobalVariablesHolder).SCORE = 0;				
	transform.GetComponent(GlobalVariablesHolder).EnergyOrbs = new Array();	
	
	transform.GetComponent(GlobalVariablesHolder).END_LEVEL = false;
	x_pos = transform.GetComponent(GlobalVariablesHolder).X_LIMIT;
	z_pos = transform.GetComponent(GlobalVariablesHolder).Z_LIMIT;
	wall_thickness = transform.GetComponent(GlobalVariablesHolder).WALL_THIKNES;
	ship_area = transform.GetComponent(GlobalVariablesHolder).SHIP_AREA;
}

//set flag to indicate level has not ended
function Start () 
{
	transform.GetComponent(GlobalVariablesHolder).END_LEVEL = false;
}

//track status of END_LEVEL flag
function Update () 
{
	if (transform.GetComponent(GlobalVariablesHolder).END_LEVEL)
	{
		//load next level
		transform.GetComponent(GlobalVariablesHolder).END_LEVEL = false;
		NextLevel();
	}
}

//function to create a new level
function CreateLevel()
{
	
	var temp_object : Transform;
	
	//create energy orbs
	for (var i : int = 0; i < transform.GetComponent(GlobalVariablesHolder).TOTAL_ENERGY_ORBS; i++)
	{
		temp_object = Instantiate(Energy_Orb_prefab, Vector3(Random.Range((wall_thickness * 0.5 - z_pos), (z_pos - wall_thickness * 0.5)), 0.0, Random.Range((wall_thickness * 0.5 - z_pos), (z_pos - wall_thickness * 0.5))), Quaternion.identity);
		temp_object.name = "Energy_Orb_" + i;
		
		//move away from ship area x-direction
		if (temp_object.position.x >= 0 && temp_object.position.x < ship_area)
		{
			temp_object.position.x = ship_area;
		}
		else if (temp_object.position.x < 0 && temp_object.position.x > (-1.0) * ship_area)
		{
			temp_object.position.x = (-1.0) * ship_area;
		}
		
		//move away from ship area z-direction
		if (temp_object.position.z >= 0 && temp_object.position.z < ship_area)
		{
			temp_object.position.z = ship_area;
		}
		else if (temp_object.position.z < 0 && temp_object.position.z > (-1.0) * ship_area)
		{
			temp_object.position.z = (-1.0) * ship_area;
		}
		
		//error check for duplicated orbs
		var add_energy_ball : boolean = true;
		Debug.Log(temp_object.name + " temp obj");
		for(var cnt : int = 0; cnt < transform.GetComponent(GlobalVariablesHolder).EnergyOrbs.length; cnt++)
		{
			var arrayObj : Transform =  (transform.GetComponent(GlobalVariablesHolder).EnergyOrbs[cnt] as Transform);
			if (temp_object.name == arrayObj.name)
			{
				add_energy_ball = false;
				Destroy(temp_object.gameObject);
			}
		}
		
		if (add_energy_ball)
			transform.GetComponent(GlobalVariablesHolder).EnergyOrbs.push(temp_object);
	}
	
	//create hock orbs
	for (i = 0; i < transform.GetComponent(GlobalVariablesHolder).TOTAL_HOCK_ORBS; i++)
	{
		temp_object = Instantiate(Hock_Orb_prefab, Vector3(Random.Range((wall_thickness * 0.5 - x_pos), (x_pos - wall_thickness * 0.5)), 0.0, Random.Range((wall_thickness * 0.5 - z_pos), (z_pos - wall_thickness * 0.5))), Quaternion.identity);
		temp_object.name = "Hock_Orb_" + i;
		
		if (temp_object.position.x >= 0 && temp_object.position.x < ship_area)
		{
			temp_object.position.x = ship_area;
		}
		else if (temp_object.position.x < 0 && temp_object.position.x > (-1.0) * ship_area)
		{
			temp_object.position.x = (-1.0) * ship_area;
		}
		
		//move away from ship area z-direction
		if (temp_object.position.z >= 0 && temp_object.position.z < ship_area)
		{
			temp_object.position.z = ship_area;
		}
		else if (temp_object.position.z < 0 && temp_object.position.z > (-1.0) * ship_area)
		{
			temp_object.position.z = (-1.0) * ship_area;
		}
	}
}

//function to handle logic when current level has been finished
function NextLevel()
{
	//if player won, check to see if it is the last level
	if (transform.GetComponent(GlobalVariablesHolder).WIN_LOSE)
	{
		transform.GetComponent(GlobalVariablesHolder).WIN_LOSE = false;
		
		yield WaitForSeconds(2.5);
		if (last_level)
		{
			Application.LoadLevel (2);	//load GameOver
		}
		else
		{
			Application.LoadLevel (3);	//load InBetweenLevels
		}
	}
	else
	{
		yield WaitForSeconds(2.5);
		Application.LoadLevel (2);		//load GameOver
	}
}

//create level when scene is laoded
function OnLevelWasLoaded (level : int) 
{
	//set flag for last level based on index of level loaded and play mode
	if (level == 5 && transform.GetComponent(GlobalVariablesHolder).SURVIVAL_MODE == false)
	{
		last_level = true;
	}
	else
	{
		last_level = false;
	}
	
	//increase number of orbs and reset Energy Orb array
	transform.GetComponent(GlobalVariablesHolder).LEVEL_COUNT++;
	transform.GetComponent(GlobalVariablesHolder).TOTAL_ENERGY_ORBS += 5;
	transform.GetComponent(GlobalVariablesHolder).TOTAL_HOCK_ORBS++;
	transform.GetComponent(GlobalVariablesHolder).EnergyOrbs = new Array();
	
	//if level is playable set Ship at origin and see if watter background should be created
	if (level >= 4)
	{
		/*var water_type : float = Random.Range(0.0, 1.0);
		var temp_background : Transform;
		
		if (water_type < 1.5)
		{
			temp_background = Instantiate(LightWater, Vector3(0.0, -10.0, 0.0), Quaternion.identity);
		}
		else if (water_type > 0.85)
		{
			temp_background = Instantiate(DarkWatter, Vector3(0.0, -10.0, 0.0), Quaternion.identity);
		}
		
		temp_background.localScale.x = 300.0;
		temp_background.localScale.z = 300.0;
		*/
		GameObject.Find("Ship_Holder").transform.position = Vector3.zero;
	}
		
	//if level is not Intro or Instruction create dummy level for background
	if (level > 1)
	{
		CreateLevel();
	}
}