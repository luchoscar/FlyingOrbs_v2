
using UnityEngine;

public abstract class OrbitMovement : MonoBehaviour
{
    public abstract void LandOnPlanet(PlanetData p_planet);

    protected void _forwardOrbitPlanet(int p_direction)
    {
        if (p_direction == 0)
            return;

        transform.RotateAround(
            _pivotPoint,
            transform.right,
            _currentForwardSpeed * Time.deltaTime * p_direction
        );
    }

    protected void _turnOrbitPlanet(int p_direction)
    {
        if (p_direction == 0)
            return;

        transform.RotateAround(
            _pivotPoint,
            transform.up,
            _currentTurningSpeed * Time.deltaTime * p_direction
        );
    }

    protected float _currentForwardSpeed;
    protected float _currentTurningSpeed;

    [SerializeField]
    protected Vector3 _pivotPoint;
}
