
using UnityEngine;

public class ResourceOrbit : OrbitMovement
{
    public override void LandOnPlanet(PlanetData p_planet)
    {
        _forwardSpeed = p_planet.resourcesForwardSpeed;
        _turnSpeed = p_planet.resourcesTurnSpeed;

        _currentForwardSpeed = _forwardSpeed;
        _pivotPoint = p_planet.transform.position;

        Vector3 direction = Random.onUnitSphere.normalized;

        Transform planetTransform = p_planet.transform;
        transform.position = planetTransform.position +
                direction * planetTransform.localScale.x * 0.5f;

        transform.up = direction;

        transform.parent = planetTransform;
    }

    private void Update()
    {
        _forwardOrbitPlanet(1);

        Debug.DrawRay(transform.position, transform.forward * 2.0f, Color.yellow, 2.0f);
    }

    private float _forwardSpeed;
    private float _turnSpeed;
}
