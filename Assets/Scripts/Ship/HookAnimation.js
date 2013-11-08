/************************************************************
 * By Luis Saenz											*
 * Script attached to Energy_Hock							*
 * Script to animate energy hock							*
 ************************************************************/
 
 #pragma strict

var animate : boolean = false;			//flag to track when animation should be performed
var End_Hock_Object : Transform;
var Ship_Object : Transform;
var distance : Vector3;					//local z-distance for hock to expand
var default_scale_z : float;			//default local z-scale of hock
var Hook_Position : Vector3;			//where the hock end attaches 
var position_offset : float;			//off set of hock pivot point with respect to the ship object
var energy_rate : float = 7.25;			//energy consumed per second when the energy hock is used
private var Hook_Collider : Collider;	//collider component added on the fly to this object
										//this is performed in order to avoid raycast from within the ship to
										//collide with the energy hock

function Start () 
{
	default_scale_z = transform.localScale.z;
	position_offset = (transform.position - transform.parent.position).magnitude;
}

//animate hock
function Update () 
{
	if (animate)
	{
		End_Hock_Object.position = Hook_Position;
		distance = End_Hock_Object.position - transform.position;
		transform.localScale.z = 2.5 * distance.magnitude + default_scale_z;
		transform.LookAt(End_Hock_Object);
		
		if (transform.GetComponent(GlobalVariablesHolder).ENERGY >= 0.0)
		{
			transform.GetComponent(GlobalVariablesHolder).ENERGY -= energy_rate * Time.deltaTime;;
		}
		else
		{
			transform.GetComponent(GlobalVariablesHolder).ENERGY = 0.0;
		}
	}
}

//function to set the position where the hock object will connect
//takes in the point where a raycast hits (when colliding with wall)
//or the position of the object that the raycast hit (when colliding with Hock_Orb)
function SetEndHock(position_In : Vector3)
{
	Hook_Position = position_In;
	animate = true;
	
	if (transform.collider == null)
		transform.gameObject.AddComponent(BoxCollider);	//add collider component to this object
		
	transform.collider.isTrigger = animate;
}

//function to set energy hock back to default values when animation is over
function Reset()
{
	transform.position = Ship_Object.position - Ship_Object.parent.forward * position_offset;
	transform.forward = Ship_Object.parent.forward;
	End_Hock_Object.position = Ship_Object.position;
	animate = false;
	Destroy(transform.collider);		//remove collider component
	transform.localScale.z = default_scale_z;
}