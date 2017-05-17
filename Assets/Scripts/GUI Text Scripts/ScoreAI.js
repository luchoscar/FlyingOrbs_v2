#pragma strict

//do not destroy score on new level
function Awake () 
{    
	DontDestroyOnLoad (this.gameObject);
}

function Start () {

}

function Update () 
{
	transform.GetChild(0).GetComponent.<GUIText>().text = transform.GetComponent(GlobalVariablesHolder).SCORE.ToString();
}