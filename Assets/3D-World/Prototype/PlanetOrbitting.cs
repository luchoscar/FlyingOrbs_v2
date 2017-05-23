
using System;
using UnityEngine;

public class PlanetOrbitting : OrbitMovement
{
    public override ObjectType objectType { get { return ObjectType.SHIP; } }

    public override void LandOnPlanet(PlanetData p_planet)
    {
        _placeOnSurface(p_planet.transform);
        
        _planetFriction = 1.0f - p_planet.planetCost;

        _setMovementCost(DrivingMode.DEFAULT);

        _state = State.ORBITIN;
    }

    // Use this for initialization
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {
        switch (_state)
        {
            case State.ORBITIN:
                _orbitPlanet();
                break;
            default:
                break;
        }
    }

    //--- Private Implementation ----------------------------------------------

    private void _orbitPlanet()
    {
        _forwardMovementAxis = transform.right;

        _forwardDirection = InputManager.GetLinerDirection();
        _forwardOrbitPlanet();

        _turningDirection = InputManager.GetTurnDirection();
        _turnOrbitPlanet();

        Debug.DrawRay(
            transform.position, 
            transform.forward * 2.0f, 
            Color.red, 
            2.0f
        );

        Debug.Log(_currentForwardSpeed + " " + _turnningSpeed);
    }

    private void _placeOnSurface(Transform p_planet)
    {
        _pivotPoint = p_planet.position;

        Vector3 shipDirection = (transform.position - _pivotPoint);
        shipDirection.Normalize();
        
        Vector3 endPosition = 
            p_planet.position + shipDirection * p_planet.localScale.x * 0.5f;

        transform.position = endPosition;
        transform.up = shipDirection;

        _drivingMode = DrivingMode.DEFAULT;
    }

    private void _setMovementCost(DrivingMode p_mode)
    {
        switch (p_mode)
        {
            case DrivingMode.ENERGY_SAVER:
                _setEnergySaverMode();
                break;

            case DrivingMode.OVERDRIVE:
                _setOverdriveMode();
                break;

            default:
                _setDefaultMode();
                break;
        }
    }

    private void _setEnergySaverMode()
    {
        float delta = 1 - _energySavings;
        _modifyProperties(delta);
    }

    private void _setOverdriveMode()
    {
        float delta = 1 + _energySavings;
        _modifyProperties(delta);
    }

    private void _setDefaultMode()
    {
        _modifyProperties(1.0f);
    }

    private void _modifyProperties(float delta)
    {
        _currentForwardSpeed    = delta * _forwardSpeed * _planetFriction;
        _currentTurningSpeed    = delta * _turnningSpeed * _planetFriction;
        _currentEnergyCostDelta = delta * _energyCostDelta * _planetFriction;
    }
    
    [SerializeField]
    private float _forwardSpeed;

    [SerializeField]
    private float _turnningSpeed;

    [SerializeField]
    private float _energyCostDelta;

    [SerializeField]
    private float _energySavings = 0.2f;

    private enum DrivingMode
    {
        DEFAULT,
        ENERGY_SAVER,
        OVERDRIVE
    }
    private DrivingMode _drivingMode = DrivingMode.DEFAULT;

    private float _currentEnergyCostDelta;
    private float _planetFriction;

    private enum State
    {
        IDLE = 0,
        LANDING,
        LANDING_COMPLETED,
        ORBITIN,
        LAUNCHING,
        TRAVELING
    }
    private State _state = State.IDLE;
}
