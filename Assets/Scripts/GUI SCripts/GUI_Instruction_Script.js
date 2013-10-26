/********************************************************
 * By Luis Saenz										*	
 * Script attached to Camera							*
 * Script to return to Intro level						*
 ********************************************************/
 
 #pragma strict

function Awake()
{

}

function Update () {

}

function OnGUI ()
{
	//GUI.matrix = CameraRes.guiMatrix;
	
	//create button to load next level
	if (GUI.Button (Rect (150, 500,100, 50), "Back To Intro"))
	{
		Destroy(GameObject.Find("LevelCreator").gameObject);
		Application.LoadLevel(0);
	}
}

