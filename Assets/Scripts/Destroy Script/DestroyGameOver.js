#pragma strict




function Start () 
{
	

}

function Update () {

}

function OnLevelWasLoaded (level : int) 
{
	if (level == 2)
	{
		Destroy(transform.gameObject);
	}
	
}