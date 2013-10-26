/************************************************************
 * By Luis Saenz											*
 * Script attached to Energy_Orb_Prefab						*
 * Script to initialize particle system with random colors	*
 ************************************************************/
 
 #pragma strict

function Awake () 
{
	transform.particleSystem.startColor = Color(Random.Range(0.0,1.0),Random.Range(0.0,1.0), Random.Range(0.0,1.0));
}

function Update () {

}