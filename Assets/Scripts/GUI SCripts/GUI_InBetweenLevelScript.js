/********************************************************
 * By Luis Saenz										*	
 * Script attached to Camera							*
 * Script to reload Intro scene							*
 ********************************************************/
 
#pragma strict

var Level_Load : GlobalVariablesHolder;


function Start () 
{
	Level_Load = GameObject.Find("LevelCreator").transform.GetComponent(GlobalVariablesHolder);
	Level_Load.WIN_LOSE = false;
	Level_Load.END_LEVEL = false;
	Time.timeScale = 0.0;
}

function Update () 
{

}

function OnGUI ()
{
	//create button to load a playable level
	if (GUI.Button (Rect (400, 50,100, 50), "To Next Level"))
	{
		var level_to_load : int = Level_Load.LEVEL_COUNT;
		Time.timeScale = 1.0;
		Application.LoadLevel(5);
	}
}