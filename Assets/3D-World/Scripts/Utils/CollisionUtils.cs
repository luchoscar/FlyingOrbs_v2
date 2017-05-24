
using UnityEngine;

public class CollisionUtils
{
    public static bool OrbitCollision(
        Quaternion p_resource1, 
        Quaternion p_resource2, 
        float p_minAngle
    )
    {
        float angleDiff = 
            Quaternion.Angle(p_resource1, p_resource2) * Mathf.Deg2Rad;

        return angleDiff <= p_minAngle;
    }

    public static Quaternion GetOrbitalRotation(Vector3 p_pivot, Vector3 p_point)
    {
        Vector3 direction = p_point - p_pivot;

        return Quaternion.LookRotation(direction.normalized, Vector3.up);
    }
}
