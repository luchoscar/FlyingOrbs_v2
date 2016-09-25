/**
 * ObjectMovement is a base class for all objects movement.  It is in charge of moving
 */
using UnityEngine;
using System.Collections;
using System;

public class ObjectMovement
{
	/**
	 * Initialize private variables
	 * 
	 * @param float groundHeight   Lowest point that the object can reach
	 * @param float gravityMag     Magnitud of gravity
	 * @param Vector3 planetPos    Position of the planet
	 * @param float speedReduction [OPTIONAL] Percent to reduce forward speed after completing movement. Value must 
	 *                             be between 0.0 and 1.0.  Defaults to 1.0
	 */
	public void Init(float groundHeight, float gravityMag, Vector3 planetPos, float speedReduction = 1.0f) {
		_groundHeight = groundHeight;
		_sqrGroundHeight = groundHeight * groundHeight;

		_gravityMag = gravityMag;

		_planetPos = planetPos;

		if (speedReduction > 1.0f || speedReduction < 0.0f) {
			string message = string.Format(
				"speedReduction is set to {0}.  Value must be between 0.0 and 1.0", 
				speedReduction
			);
			throw new ArgumentException (message);
		}

		_speedReduction = speedReduction;
	}

	/**
	 * Set forward speed of object
	 * 
	 * @param float speed   self-explanatory
	 */
	public void SetForwardSpeed(float speed)
	{
		_forwardSpeed = speed;
	}

	/**
	 * Set forward speed of object
	 * 
	 * @param float groundHeight   Lowest point that the object can reach
	 */
	public void SetGroundHeight(float groundHeight)
	{
		_groundHeight = groundHeight;
		_sqrGroundHeight = groundHeight * groundHeight;
	}

	/**
	 * Set vertical speed of object
	 * 
	 * @param float verticalSpeed   self-explanatory
	 */
	public void SetVerticalSpeed(float verticalSpeed)
	{
		_verticalSpeed = verticalSpeed;
	}

	/**
	 * Calculate object position based on its current speed, position, direction, duration of movemet and friction if
	 * applicable
	 * 
	 * @param Vector3 position     The current position of the object
	 * @param Vector3 direction    The current normalized direction of the movement
	 * @param float time           The amount of time, in milliseconds, it will take to complete the movement
	 * 
	 * @return Vector3 as the new position
	 */
	public Vector3 GetNewPosition(Vector3 startPosition, Vector3 direction, float time) {

		float deltaGroundPosition = _calculateDelta(_forwardSpeed, time);
		Vector3 groundPos = startPosition + direction * deltaGroundPosition;

		_forwardSpeed *= _speedReduction;

		Vector3 upDirection = (startPosition - _planetPos).normalized;

		if (_onTheGround(groundPos)) {
			return _resetMovement(groundPos, upDirection);
		}

		_verticalSpeed += _calculateDelta(_gravityMag, time);

		Vector3 airPos = _calculateDelta(_verticalSpeed, time) * upDirection + startPosition;

		Vector3 newPosition = groundPos + airPos;

		if (_onTheGround(groundPos)) {
			return _resetMovement(newPosition, upDirection);
		}

		return newPosition;
	}

	public override string ToString ()
	{
		return string.Format (
			"[ObjectMovement]\n_gravityMag = {0}\n_forwardSpeed = {1}\n_verticalSpeed = {2}\n_groundHeight = {3}\n"
			+ "_sqrGroundHeight = {4}\n_speedReduction = {5}\n_planetPos = {6}",
			_gravityMag, 
			_forwardSpeed, 
			_verticalSpeed, 
			_groundHeight, 
			_sqrGroundHeight, 
			_speedReduction, 
			_planetPos.ToString()
		);
	}

	//------------------------------------------------------------------------------------------------------------------
	// Private Implementation
	//------------------------------------------------------------------------------------------------------------------

	/**
	 * Calculate delta speed of a given speed and delta time
	 * 
	 * @param float value  The value from where to calculate the delta
	 * @param float time   Delta time in milliseconds
	 * 
	 * @return float as distance / time
	 */
	private float _calculateDelta(float value, float time) {
		return value * time;
	}

	/**
	 * Check whether object is on the ground
	 * 
	 * @param Vector3 currentPos  The current position of the object
	 * 
	 * @return bool TRUE if distance from the object to the center of the planet is less or equal than the distance from
	 *              the surface of the planet to its center
	 */
	private bool _onTheGround(Vector3 currentPos) {
		if (_verticalSpeed > 0.0f) {
			return false;
		}

		float sqrDistanceToGround = (currentPos - _planetPos).sqrMagnitude;
		return _sqrGroundHeight >= sqrDistanceToGround;
	}

	/**
	 * Reset vertical speed and position
	 * 
	 * @param Vector3 currentPos    The current position of this obejct
	 * @param Vector3 upDirection   The normalize up direction with respect to the center of the planet
	 * 
	 * @return Vector3 as the on the ground vertical position
	 */
	private Vector3 _resetMovement(Vector3 currentPos, Vector3 upDirection) {
		_verticalSpeed = 0.0f;
		return upDirection * _groundHeight;
	}

	private float _gravityMag 		= 0.0f;
	private float _forwardSpeed 	= 0.0f;
	private float _verticalSpeed 	= 0.0f;
	private float _groundHeight 	= 0.0f;
	private float _sqrGroundHeight 	= 0.0f;
	
	// Percent of speed left after moving an obejct
	private float _speedReduction 	= 0.0f;
	
	private Vector3 _planetPos 	= Vector3.zero;
}