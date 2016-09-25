using UnityEngine;
using System.Collections;

public class PlayerMovement : MonoBehaviour {
	public float forwardSpeed;
	public float gravity;
	public float speedReduction;
	public float groundHeight;

	public Transform planet;

	void Awake() {
		_movement = new ObjectMovement();
	}

	// Use this for initialization
	void Start () {
		_movement.Init(groundHeight, gravity, planet.position, speedReduction);
		_movement.SetForwardSpeed(forwardSpeed);
	}
	
	// Update is called once per frame
	void Update () {
		transform.position = _movement.GetNewPosition(transform.position, Vector3.up, Time.deltaTime);
		Debug.Log(_movement.ToString());
	}

	private ObjectMovement _movement;
}
