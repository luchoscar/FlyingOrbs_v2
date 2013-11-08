/************************************************************
 * By Luis Saenz											*
 * Script attached to Ship object							*
 * Script to control ship movements							*
 * By default Ship object has linear foward velocity but 	*
 * it can create a perpendicular or parallel force by		*
 * utilizing the energy hock								*
 * Script also handels logic for ship destruction 			*
 ************************************************************/
 
#pragma strict

var velocity_mag : float = 20.0;
var velocity : Vector3;
var tension_force : float = 50.0;
var mass : float = 1.0;
var tension_point : Vector3;			//point on space where the energy hock connects to generate a tension force
var create_tension : boolean = false;	//flag to track when tension is calculated
var Energy_Hook_Obj : Transform;
var direction : Vector3 = Vector3.zero;	//direction of force/acceleration
var energy_wave : float = 25.0f;		
var energy_wave_force : float = 30.5f;
var Ship_Crash : Transform;				//explosion prefab
var doubleTouch : boolean = false;

private var applyForce : boolean = false;

function Awake () 
{
	transform.position = transform.parent.position;
	velocity = transform.parent.forward * velocity_mag * 0.5;
}

function Start () 
{
	#if UNITY_ANDROID
	Camera.main.transform.eulerAngles.y = 90;
	Camera.main.camera.orthographicSize = 147.54;
	#endif
}

function Update () 
{
	transform.parent.position += velocity * Time.deltaTime;
	
	//only create tenstion and hock animation if ship has energy
	if(transform.GetComponent(GlobalVariablesHolder).ENERGY > 0.0)
	{
		//only create tension if no key is down
		if (create_tension)
		{
		
//			if (applyForce)
//			{
//				direction = Camera.main.ScreenPointToRay (Input.GetTouch(0).position).origin;
//				direction.y = transform.position.y;
//				direction -= transform.position;
//				var temp : String = " " +  direction.x + " " + direction.y + " " + direction.z;
//				GUI.Button (Rect (50, 50,100, 100), temp);
//				
//			}
			
			Debug.Log("Mouse pos = " + Input.mousePosition);
			direction = Camera.main.ScreenPointToRay (Input.mousePosition).origin;
			
			#if UNITY_ANDROID
			direction = Camera.main.ScreenPointToRay (Input.GetTouch(0).position).origin;
			#endif
			
			direction.y = transform.position.y;
			direction -= transform.position;
			
			Debug.Log("Direction = " + direction);
			GetTangetPoint(direction.normalized);
			
//			#if UNITY_ANDROID
//			//if (Input.touchCount > 0 && (Input.GetTouch(0).phase == TouchPhase.Stationary || Input.GetTouch(0).phase == TouchPhase.Began) && !create_tension)
//			//if (Input.touchCount == 1 && (Input.GetTouch(0).phase == TouchPhase.Began || Input.GetTouch(0).phase == TouchPhase.Moved))// && !create_tension)
//			if (Input.touchCount == 1 && (Input.GetTouch(0).phase == TouchPhase.Moved || Input.GetTouch(0).phase == TouchPhase.Stationary))
//			{
//				doubleTouch = false;
//				applyForce = true;
//			}
//			#endif
			
		}		
	}
	else
	{
		Energy_Hook_Obj.GetComponent(HookAnimation).Reset();
	}
	
	if (Input.GetMouseButton(0))
	{
		doubleTouch = false;
		create_tension = true;
		Debug.Log("Mouse down");
	}
	else// if (Input.GetMouseButtonUp(0))
	{
		Debug.Log("Mouse not down");
		doubleTouch = false;
		//applyForce = false;
		Energy_Hook_Obj.GetComponent(HookAnimation).Reset();
	}
	
	#if UNITY_ANDROID
	//if (Input.touchCount > 0 && (Input.GetTouch(0).phase == TouchPhase.Stationary || Input.GetTouch(0).phase == TouchPhase.Began) && !create_tension)
	//if (Input.touchCount == 1 && (Input.GetTouch(0).phase == TouchPhase.Began || Input.GetTouch(0).phase == TouchPhase.Moved))// && !create_tension)
	if (Input.touchCount == 1 && (Input.GetTouch(0).phase == TouchPhase.Moved || Input.GetTouch(0).phase == TouchPhase.Stationary))
	{
		doubleTouch = false;
		create_tension = true;
	}
	else// if (Input.touchCount == 0)//1 Input.GetTouch(0).phase == TouchPhase.Ended && !doubleTouch)
	{
		create_tension = false;
		create_tension = false;
		Energy_Hook_Obj.GetComponent(HookAnimation).Reset();
	}
	#endif
	
	//create energy wave when pressing space bar
	if (transform.GetComponent(GlobalVariablesHolder).ENERGY >= energy_wave)
	{
		if(Input.GetKeyDown("space"))
    	{
	        CreateEnergyWave();
    	}
    	
    	#if UNITY_ANDROID
			if (Input.touchCount == 2 && Input.GetTouch(0).phase == TouchPhase.Began && Input.GetTouch(1).phase == TouchPhase.Began)
			{
				doubleTouch = true;
				CreateEnergyWave();
			}
		#endif
	}
	
	//if player releases key, the set flag to allow tension force next time a key is press
	if (Input.GetKeyUp("d") || Input.GetKeyUp("s") || Input.GetKeyUp("a") || Input.GetKeyUp("w"))
	{
		create_tension = false;
		Energy_Hook_Obj.GetComponent(HookAnimation).Reset();
	}
	
	//create tension force is flag is set
	if (create_tension)
	{
		CreateTensionForce(direction);
	}
}

function OnTriggerEnter (otherObj: Collider)
{
	//only check collision against hockable objects
	if (otherObj.transform.tag == "Wall" || otherObj.transform.tag == "Hockable")
	{
		transform.GetComponent(GlobalVariablesHolder).END_LEVEL = true;
		
		//if there are no more energy orbs, then player wins level and do not destroy ship
		if (transform.GetComponent(GlobalVariablesHolder).EnergyOrbs.length > 0)
		{
			transform.GetComponent(GlobalVariablesHolder).WIN_LOSE = false;
			
			var temp_explosion : Transform = Instantiate(Ship_Crash, transform.position, Quaternion.identity);
			Destroy(temp_explosion.gameObject, 2.0);
			
			yield WaitForSeconds(0.0125);
			Destroy(transform.parent.gameObject);
		}
		else
		{
			transform.GetComponent(GlobalVariablesHolder).WIN_LOSE = true;
		}
	}
}

//ray cast on desired direction to get tension point
function GetTangetPoint(direction_In : Vector3)
{
	//calculate axis of rotation to create tension force
	var hit : RaycastHit;
		
	//ray cast and ignore colliders on Collectable layer
	var layerMask = 1 << 9;
	layerMask = ~layerMask;
	
	if (Physics.Raycast(transform.position, direction_In, hit, Mathf.Infinity, layerMask))
	{
		//use ray cast hit point if colliding with wall
		if (hit.transform.tag == "Wall")
		{
			SetTensionPoint(hit.point);
		}
		//else use hock_orb position
		else
		{
			SetTensionPoint(hit.transform.position);
		}
	}
}

//set flag to create tension force and animate energy hock
function SetTensionPoint(tension_Pont_In : Vector3)
{
	tension_point = tension_Pont_In;
	create_tension = true;
	Energy_Hook_Obj.GetComponent(HookAnimation).SetEndHock(tension_point);
}

//calculate tension point
function CreateTensionForce(direction_In : Vector3)
{
	//calculate force direction
	var direction : Vector3 = direction_In.normalized;
		
	//calculate acceleration
	var acceleration = tension_force / mass;
	
	//calculate velocity
	velocity += acceleration * direction * Time.deltaTime;
	
	var angl_cos : float = Vector3.Dot(direction.normalized, velocity.normalized);
	if (angl_cos != 1.0 && angl_cos != -1.0)
		transform.parent.forward += velocity.normalized;		
}

//function to apply a force from the ship object to all energy orbs
function CreateEnergyWave()
{
	var distance : Vector3;
	
	for (var orb_cnt : int = 0; orb_cnt < transform.GetComponent(GlobalVariablesHolder).EnergyOrbs.length; orb_cnt++)
	{
		var orb_temp_tran : Transform = transform.GetComponent(GlobalVariablesHolder).EnergyOrbs[orb_cnt];
		distance = orb_temp_tran.position - transform.position;
		distance.Normalize();
		
		//find force
		distance *= energy_wave_force;
		
		//find acceleration
		distance /= orb_temp_tran.GetComponent(EnergyOrbsAI).mass;
		orb_temp_tran.GetComponent(EnergyOrbsAI).velocity += distance;
	}
	
	transform.GetComponent(GlobalVariablesHolder).ENERGY -= energy_wave;
}

function OnLevelWasLoaded(level : int)
{
	#if UNITY_ANDROID
	
	if (level == 4 || level == 5)
	{
		Camera.main.transform.eulerAngles.y = 90;
		Camera.main.camera.orthographicSize = 147.54;
	}
	#endif
}