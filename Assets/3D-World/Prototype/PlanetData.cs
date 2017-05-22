
using UnityEngine;

public class PlanetData : MonoBehaviour
{
    public float planetCost;
    public int resourcesCount;
    public float resourcesForwardSpeed;
    public float resourcesTurnSpeed;

    public GameObject resourceObject;

    public void Init()
    {
        for (int i = 0; i < resourcesCount; i++)
        {
            Vector3 direction = Random.onUnitSphere;
            GameObject resourceGO = GameObject.Instantiate(resourceObject) as GameObject;

            resourceGO.GetComponent<ResourceOrbit>().LandOnPlanet(this);
        }
    }
}
