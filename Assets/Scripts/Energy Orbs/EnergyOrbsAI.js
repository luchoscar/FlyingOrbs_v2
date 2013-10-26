/********************************************************
 * By Luis Saenz										*	
 * Script to control Energy Ball movement, collision	*
 * and destrution										*
 * When destroied, they create a instantiate the 		* 
 * Particle_Explosion prefab to create sparkles			*
 ********************************************************/	
 
#pragma strict

var Particle_Explosion : Transform;
var explosion_speed = 20.0f;					//speed applyed to other obrs when this one dies
var velocity : Vector3 = Vector3.zero;	//no initial direction of motion
var Energ_Orb_In : Transform;					//variable to hold orbs to apply force to
var mass : float = 1.0;

//wall variables for limits collision
var x_pos : float;
var z_pos : float;
var wall_thickness : float;
var MAX_SPEED : float = 75.0;					//max speed/velocity magnitude an energy orb can have

//if energy ball is created within the Ship start area, then move energy orb 
function Start () 
{
	x_pos = transform.GetComponent(GlobalVariablesHolder).X_LIMIT;
	z_pos = transform.GetComponent(GlobalVariablesHolder).Z_LIMIT;
	wall_thickness = transform.GetComponent(GlobalVariablesHolder).WALL_THIKNES;
}


function Update () 
{
	if (velocity.magnitude > 0.0)
	{
		//truncate when max speed has been reached
		if (velocity.magnitude == MAX_SPEED)
		{
			velocity.Normalize();
			velocity *= MAX_SPEED;
		}
		
		var movement : Vector3 = velocity * Time.deltaTime;
		
		//ray cast ahead to not skip colliding objects
		var hit : RaycastHit;
		
		if (Physics.Raycast(transform.position, velocity.normalized, hit, Mathf.Infinity))
		{
			if (movement.magnitude >= hit.distance)
			{
				CheckCollision(hit.transform);
			}
		}
		
		transform.position += movement;
	}
	
	//check for world limits
	LimitsCollision();	
}


function OnTriggerEnter (otherObj: Collider)
{
	CheckCollision(otherObj.transform);
}

//check what type of collision to perfornm
//takes in the transform of the object enetering this collider
function CheckCollision(otherObj_In : Transform)
{
	if (otherObj_In.tag == "Ship")	//ship --> point/energy gained
	{
		ExploteOrb(true);
	}
	else if (otherObj_In.tag == "Hock")	//energy hook --> no point/energy gained
	{
		ExploteOrb(false);
	}
	else if (otherObj_In.tag != "Wall")	//energy orb
	{
		//prevent double calculation of collision between same objects type
		if (otherObj_In.tag == transform.tag)
		{
			if (transform.gameObject.GetInstanceID() < otherObj_In.gameObject.GetInstanceID())
			{
				CalculateVelocity(otherObj_In.gameObject);
			}
		}
		else
		{
			CalculateVelocity(otherObj_In.gameObject);
		}
	}
}

//calculate collision
//takes in GameObject component of object colliding with
function CalculateVelocity(otherGameObject: GameObject)
{
	//move object to be tangent to colliding object
	// calculate velocities due to collision
	var v_act : Vector3 = otherGameObject.transform.position - transform.position;  // direction of act-line
	v_act = v_act.normalized;   // make it a unit vector
	transform.position = otherGameObject.transform.position;
	transform.position -= v_act * (transform.localScale.z * 0.5 + otherGameObject.transform.localScale.z * 0.5); 
	
	//other variables for collision
	var v1 : Vector3 = velocity;	//hold addition of velocity components after collision
	var v_perp : Vector3;			//perpendicular axis to v_act and up vector --> provide axis for second velocity component
	var v1_act : float;				//resultant velocity component vector along v_act
	var v1_perp : float;			//resultant velocity component vector along v_perp
	
	//calculate for energy orb on energy orb
	if(otherGameObject.tag == "EnergyOrb")
	{
		var m1:float = mass;		// this object mass
	
		var scriptTmp: EnergyOrbsAI = otherGameObject.GetComponent("EnergyOrbsAI");  // get the script of collided energy orb
	
		var v2:Vector3 = scriptTmp.velocity;  //velocity of colliding orb
		var m2:float = scriptTmp.mass; 		  //mass of colliding orb
	
		v_perp = Vector3.Cross(v_act, Vector3.up); // generate a vector perpendicular to v_act
	
		// decompose v1 and v2 to the direction of v_act and v_perp
		v1_act = Vector3.Dot(v1, v_act);   // projection of v1 on v_act
		v1_perp = Vector3.Dot(v1, v_perp);  // projection of v1 on v_prep
	
		var v2_act: float = Vector3.Dot(v2, v_act);   // projection of v2 on v_act
		var v2_perp:float = Vector3.Dot(v2, v_perp);  // projection of v2 on v_prep	
	
		// energy exchanging happens only in the direction of v_act. Use the formula in the book and assume
		// elastic coefficient between energy orbs = 1.2
		var elasticity : float = 1.2;
	
		var v1_act_new :float = ( (m1-m2)*v1_act + (1 + elasticity)*m2*v2_act )/ (m1+m2);
		var v2_act_new :float = ( (1 + elasticity)*m1*v1_act + (m2-m1)*v2_act )/ (m1+m2);
	
		// calculate the new velocities after the collision
		v1 = v1_act_new * v_act + v1_perp * v_perp;  
		v2 = v2_act_new * v_act + v2_perp * v_perp;  
	
		// reset velocities for both balls
		velocity = v1;  
		scriptTmp.velocity = v2;  
	}
	//calculate for hockable orbs - energy orbs reflect from hockable orbs
	else
	{
		//calculate normalized coordinate system of linear collision & break down velocity or energy orb
		v_act = otherGameObject.transform.position - transform.position;  // direction of act-line oposite to collision direction
		v_act.Normalize();
		v_perp = Vector3.Cross(v_act, Vector3.up);
		
		v1_act = Vector3.Dot(v1, v_act);   // projection of v1 on v_act
		v1_perp = Vector3.Dot(v1, v_perp);  // projection of v1 on v_prep
		v_act = v_act * v1_act * (-1.0);
		v_perp = v_perp * v1_perp;
		
		v1 = v_act + v_perp;
		velocity = v1;  
	}
}

//function called function to destroy energy orb
function ExploteOrb(point_In : boolean)
{
	DestroyEnergyOrb(point_In);
}

//function to check if energy orb crosses the world limits
function LimitsCollision()
{
	//x-collision
	if (transform.position.x >= ((x_pos - wall_thickness * 0.5) - transform.localScale.x * 0.5) || transform.position.x <= ((wall_thickness * 0.5 - x_pos) + transform.localScale.x * 0.5))
	{
		if (transform.position.x < 0)
			transform.position.x = (wall_thickness * 0.5 - x_pos) + transform.localScale.x * 0.5;
		else
			transform.position.x = (x_pos - wall_thickness * 0.5) - transform.localScale.x * 0.5;
			
		velocity.x *= -1.0;
	}
	
	//z-collision
	if (transform.position.z >= ((z_pos - wall_thickness * 0.5) - transform.localScale.z * 0.5) || transform.position.z <= ((wall_thickness * 0.5 - z_pos) + transform.localScale.z * 0.5))
	{
		if (transform.position.z < 0)
			transform.position.z = (wall_thickness * 0.5 - z_pos) + transform.localScale.z * 0.5;
		else
			transform.position.z = (z_pos - wall_thickness * 0.5) - transform.localScale.z * 0.5;
		
		velocity.z *= -1.0;
	}
}

//function to handle destruction of energy orb logic
function DestroyEnergyOrb(point_In : boolean)
{
	//remove orb from energy orb array & affect all remaining orbs
	var orb = 0;
	for(var i = 0; i < transform.GetComponent(GlobalVariablesHolder).EnergyOrbs.length; i++)
	{
		var temp_trans : Transform = transform.GetComponent(GlobalVariablesHolder).EnergyOrbs[i];
		if (temp_trans != null && temp_trans.name != transform.name)
		{
			var direction : Vector3 = temp_trans.position - transform.position;
			
			var hit : RaycastHit;
			if (Physics.Raycast(transform.position, direction.normalized, hit, direction.magnitude))
			{
				if (hit.transform.tag == "EnergyOrb")
				{
					var speed : float = temp_trans.GetComponent(EnergyOrbsAI).explosion_speed;
					temp_trans.GetComponent(EnergyOrbsAI).velocity += speed * direction.normalized;
				}
			}
		}
		else
		{
			orb = i;
		}
	}
	
	//if player gains point, increase energy and score
	if (point_In)
	{
		transform.GetComponent(GlobalVariablesHolder).ENERGY += transform.GetComponent(GlobalVariablesHolder).ENERGY_GAIN;
		transform.GetComponent(GlobalVariablesHolder).SCORE++;
	}
	
	//if there are more orbs to collect, remove this orb from the orb array
	if (transform.GetComponent(GlobalVariablesHolder).EnergyOrbs.length > 0)
	{
		transform.GetComponent(GlobalVariablesHolder).EnergyOrbs.RemoveAt(orb);
	}
	//else the player won the level
	if (transform.GetComponent(GlobalVariablesHolder).EnergyOrbs.length == 0)
	{
		transform.GetComponent(GlobalVariablesHolder).WIN_LOSE = true;
		transform.GetComponent(GlobalVariablesHolder).END_LEVEL = true;
	}
	
	var temp_explosion : Transform = Instantiate(Particle_Explosion, transform.position, Quaternion.identity);
	temp_explosion.position.y += 67.0;
	Destroy(temp_explosion.gameObject, 2.0);
	Destroy(this.gameObject);
}