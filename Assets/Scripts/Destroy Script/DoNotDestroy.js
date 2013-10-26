#pragma strict
/********************************************************
 * By Luis Saenz										*
 * Script to not destroy objects on scene laod			*
 * Attached to LevelCreator and Ship_Holder objects 	*
 * Script has been removed from all Ship_Holder objects *
 * that are not on playable scenes (Intro and Info		*
 ********************************************************/

function Awake () 
{
	DontDestroyOnLoad (this.gameObject);
}

