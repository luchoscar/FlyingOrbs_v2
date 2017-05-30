
using System;
using UnityEngine;

public class ResourceOrbit : OrbitMovement
{
    public override ObjectType objectType { get { return ObjectType.RESOURCE; } }
    public override float collisionRadius { get { return _collisionRadius; } }

    public override void LandOnPlanet(PlanetData p_planet)
    {
        _forwardSpeed = p_planet.resourcesForwardSpeed;
        _turnSpeed = p_planet.resourcesTurnSpeed;

        _currentForwardSpeed = _forwardSpeed;
        _pivotPoint = p_planet.transform.position;

        Vector3 direction = UnityEngine.Random.onUnitSphere.normalized;

        Transform planetTransform = p_planet.transform;
        transform.position = planetTransform.position +
                direction * planetTransform.localScale.x * 0.5f;

        transform.up = direction;

        transform.parent = planetTransform;

        _forwardDirection = 1;
        _turningDirection = 0;
        _forwardMovementAxis = transform.right;
    }

    public override void Kill()
    {
        base.Kill();

        //TODO: Kill ship: game over
    }

    //--- Unity ---------------------------------------------------------------

    private void Update()
    {
        _forwardOrbitPlanet();

        Debug.DrawRay(transform.position, transform.forward * 2.0f, Color.yellow, 2.0f);
    }

    //--- Private Implementation ----------------------------------------------

    void OnTriggerEnter(Collider p_collider)
    {
        GameObject colliderObject = p_collider.gameObject;
        OrbitMovement movement = colliderObject.GetComponent<OrbitMovement>();

        if (movement == null)
            return;

        Debug.Log(
            string.Format(
                "Colliding {0} - {1}",
                transform.GetInstanceID(),
                colliderObject.GetInstanceID()
            )
        );

        if (_objectsCannotCollider(movement))
            return;

        Debug.Log(
            string.Format(
                "Process collision {0} - {1}",
                transform.GetInstanceID(),
                colliderObject.GetInstanceID()
            )
        );
    }

    
    private bool _objectsCannotCollider(OrbitMovement p_colliderMovement)
    {
        ObjectType colliderObjectType = p_colliderMovement.objectType;
        if (colliderObjectType == ObjectType.SHIP)
            return true;

        bool lowerInstanceID = p_colliderMovement.gameObject.GetInstanceID() 
            < this.gameObject.GetInstanceID();

        return lowerInstanceID && 
            colliderObjectType == ObjectType.RESOURCE;
    }

    private Vector3 getForwardDirection()
    {
        return Vector3.Cross(
            transform.up,
            _forwardMovementAxis
        ).normalized;
    }

    private float _forwardSpeed;
    private float _turnSpeed;

    [SerializeField]
    private float _collisionRadius = 1.5f;
}
