/********************************************************
 * By Luis Saenz										*
 * Script attached to Camera							*
 * Introduction GUI										*
 * Allows to start one of the game modes:       		*
 * 	1. 	Normal Mode --> Complete all available  		*
 *		levels											*
 *	2.	Survival Mode --> Levels are auto-generated		*
 *		after player finishes one						*
 * Loads first playable level 							*
 ********************************************************/

#pragma strict

var LevelCreator : Transform;
var SpaceShip : Transform;

function Awake()
{
	#if UNITY_ANDROID
	Camera.main.fov = 104;
	#endif
}

function Start () 
{
	SpaceShip.GetComponent(ShipAI).velocity = Vector3.zero;
	transform.LookAt(SpaceShip);
	
	var w : float = Screen.width;
	var h : float = Screen.height;
	var aspectRation : float = w / h;
	Debug.Log(w);
	Debug.Log(h);
	Debug.Log(aspectRation);
	
	Camera.main.aspect = aspectRation;
	
	//Camera.main.rect = new Rect(0f, 0.125f, 1f, 0.75f);
}

function Update () {

}

function OnGUI ()
{
	GUI.matrix = CameraRes.guiMatrix;//GetGUIMatrix();

	//create button to start normal mode game
	if (GUI.Button (Rect (200, 50,100, 50), "Normal Mode"))
	{
		LevelCreator.GetComponent(GlobalVariablesHolder).SURVIVAL_MODE = false;
		Destroy(GameObject.Find("Ship_Holder").gameObject);
		Application.LoadLevel(4);
	}
	
	//create button to start survival mode game
	if (GUI.Button (Rect (350, 50,100, 50), "Survival Mode"))
	{
		LevelCreator.GetComponent(GlobalVariablesHolder).SURVIVAL_MODE = true;
		Destroy(GameObject.Find("Ship_Holder").gameObject);
		Application.LoadLevel(4);
	}
	
	//create button to load game info
	if (GUI.Button (Rect (500, 50,100, 50), "Instructions"))
	{
		#if UNITY_ANDROID
		Application.LoadLevel(6);
		#else
		Application.LoadLevel(1);
		#endif
	}
}

//function to destroy all objects
function DestroyObjects()
{
	Destroy(GameObject.Find("Ship_Holder").gameObject);
}