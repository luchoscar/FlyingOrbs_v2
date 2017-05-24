
using UnityEngine;

public class PlanetData : MonoBehaviour
{
    public float planetCost;
    public int resourcesCount;
    public float resourcesForwardSpeed;
    public float resourcesTurnSpeed;
    public float collisionAngle {  get { return m_collisionAngle; } }

    public GameObject resourceObject;

    public void Init()
    {
        for (int i = 0; i < resourcesCount; i++)
        {
            Vector3 direction = Random.onUnitSphere;
            GameObject resourceGO = GameObject.Instantiate(resourceObject) as GameObject;

            resourceGO.GetComponent<ResourceOrbit>().LandOnPlanet(this);
        }

        m_collisionAngle = _calculateResourceCollisionAngle();
    }
    
    private float _calculateResourceCollisionAngle()
    {
        float planetRand = transform.localScale.x * 0.5f;
        float resourceRad = resourceObject.transform.localScale.x * 0.5f;

        float sine = resourceRad / (planetRand + resourceRad);
        return Mathf.Asin(sine) * 2.0f;
    }

    [SerializeField]
    private float m_collisionAngle;
}
