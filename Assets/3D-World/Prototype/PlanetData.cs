using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlanetData : MonoBehaviour
{
    public float planetCost;
    public int resourcesCount;

    public GameObject resourceObject;

    public void Init()
    {
        for (int i = 0; i < resourcesCount; i++)
        {
            Vector3 direction = Random.onUnitSphere;
            GameObject resourceGO = GameObject.Instantiate(resourceObject) as GameObject;
            Transform resourceTran = resourceGO.transform;

            resourceTran.position = transform.position +
                direction * transform.localScale.x * 0.5f;

            resourceTran.up = direction;
        }
    }
}
