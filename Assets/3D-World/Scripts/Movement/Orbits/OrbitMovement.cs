
using System;
using UnityEngine;

public abstract class OrbitMovement : OrbitalObject
{
    public Transform collisionSphere;

    public float forwardVelocity
    {
        get { return _forwardDirection * _currentForwardSpeed; }
    }

    public float turningVelocity
    {
        get { return _turningDirection * _currentTurningSpeed; }
    }

    public Vector3 forwardMovmentAxis {  get { return _forwardMovementAxis; } }

    public override void LandOnPlanet(PlanetData p_planet)
    {
        collisionSphere.localScale = new Vector3(
            collisionRadius,
            collisionRadius,
            collisionRadius
        );
    }

    //--- Protected Implementation --------------------------------------------

    protected void _forwardOrbitPlanet()
    {
        if (_forwardDirection == 0)
            return;

        transform.RotateAround(
            _pivotPoint,
            _forwardMovementAxis,
            _currentForwardSpeed * Time.deltaTime * _forwardDirection
        );
    }

    protected void _turnOrbitPlanet()
    {
        if (_turningDirection == 0)
            return;

        transform.RotateAround(
            _pivotPoint,
            transform.up,
            _currentTurningSpeed * Time.deltaTime * _turningDirection
        );
    }

    protected float _currentForwardSpeed;
    protected int _forwardDirection;

    protected float _currentTurningSpeed;
    protected int _turningDirection;
    protected Vector3 _forwardMovementAxis;

    [SerializeField]
    protected Vector3 _pivotPoint;
}
