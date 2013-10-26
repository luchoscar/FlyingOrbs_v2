/********************************************************
 * By Luis Saenz										*	
 * Script attached to Camera							*
 * Script to reload Intro scene							*
 ********************************************************/
 
#pragma strict

var Level_Load : GlobalVariablesHolder;

//destroy any remaining objects from playable levels
function Awake () 
{
	Level_Load = GameObject.Find("LevelCreator").transform.GetComponent(GlobalVariablesHolder);
	Level_Load.WIN_LOSE = false;
	Level_Load.END_LEVEL = false;
	Time.timeScale = 0.0;
}

function Update () {

}

function OnGUI ()
{
	GUI.matrix = CameraRes.guiMatrix;
	
	//create button to go back to start game
	//destroy all remaining objects and reset global variables
	if (GUI.Button (Rect (400, 50,100, 50), "Play Again"))
	{
		Level_Load.ENERGY = 100.00;
		
		for (var cnt : int = 0; cnt < Level_Load.EnergyOrbs.length; cnt++)
		{
			var temp_transform : Transform = Level_Load.EnergyOrbs[cnt];
			if (temp_transform != null)
				Destroy(temp_transform.gameObject);
		}
		
		Level_Load.EnergyOrbs = new Array();
		
		if (GameObject.Find("Ship_Holder") != null)
		{
			Destroy(GameObject.Find("Ship_Holder"));
		}
		
		if (GameObject.Find("LevelCreator") != null)
		{
			Destroy(GameObject.Find("LevelCreator"));
		}
		
		if (GameObject.Find("Score_lbl") != null)
		{
			Destroy(GameObject.Find("Score_lbl"));
		}
		
		if (GameObject.Find("Energy_lbl") != null)
		{
			Destroy(GameObject.Find("Energy_lbl"));
		}
		
		while (GameObject.Find("Wall") != null)
		{
			Destroy(GameObject.Find("Wall"));
		}
		
		Time.timeScale = 1.0;
		Application.LoadLevel(0);
	}
}	