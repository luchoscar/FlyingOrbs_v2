
using System.Collections.Generic;
using UnityEngine;

public class CollisionSolver
{
    public static CollisionSolver Instance { get { return _getInstance(); } }
    
    public void ResolveCollisions(PlanetOrbitting p_ship, List<OrbitalObject> p_resources)
    {
        for (int i = 0; i < p_resources.Count; i++)
        {
            OrbitalObject resource = p_resources[i];
            bool checkCollision = _collidingObjects(p_ship, resource);
            if (checkCollision)
                resource.Kill();
        }

        for(int i = 0; i < p_resources.Count; i++)
        {
            OrbitalObject collider = p_resources[i];
            if (collider.Killed)
                continue;

            for(int c = i + 1; c < p_resources.Count; c++)
            {
                OrbitalObject colliding = p_resources[c];

                if (colliding.Killed)
                    continue;

                bool checkCollision = _collisionsRecorded(collider, colliding)
                    || _collidingObjects(collider, colliding);
            }
        }
    }

    //--- Private Implementation ----------------------------------------------

    private bool _collidingObjects(OrbitalObject p_obj1, OrbitalObject p_obj2)
    {
        Vector3 distance = p_obj1.transform.position - p_obj2.transform.position;

        return distance.magnitude <= (p_obj1.collisionRadius + p_obj2.collisionRadius);
    }

    private void _reset()
    {
        _collisionMap = new Dictionary<int, List<int>>();
        _destroiedObjects = new HashSet<int>();
    }

    private void _recordCollisions(OrbitalObject p_obj1, OrbitalObject p_obj2)
    {
        _recordCollision(p_obj1, p_obj2);
        _recordCollision(p_obj2, p_obj1);
    }

    private void _recordCollision(OrbitalObject p_obj1, OrbitalObject p_obj2)
    {
        int id_1 = p_obj1.GetInstanceID();
        int id_2 = p_obj2.GetInstanceID();

        if (!_collisionMap.ContainsKey(id_1))
            _collisionMap.Add(id_1, new List<int>());

        _collisionMap[id_1].Add(id_2);
    }

    private bool _collisionsRecorded(OrbitalObject p_obj1, OrbitalObject p_obj2)
    {
        return _collisionRecorded(p_obj1, p_obj2)
            && _collisionRecorded(p_obj2, p_obj1);
    }

    private bool _collisionRecorded(OrbitalObject p_obj1, OrbitalObject p_obj2)
    {
        int id_1 = p_obj1.GetInstanceID();
        int id_2 = p_obj2.GetInstanceID();

        return _collisionMap.ContainsKey(id_1) && _collisionMap[id_1].Contains(id_2);
    }

    private Dictionary<int, List<int>> _collisionMap;
    private HashSet<int> _destroiedObjects;

    //--- Instance ------------------------------------------------------------
    private CollisionSolver()
    {
        _collisionMap = new Dictionary<int, List<int>>();
        _destroiedObjects = new HashSet<int>();
    }
    
    private static CollisionSolver _getInstance()
    {
        if (_instance == null)
        {
            _instance = new CollisionSolver();
        }

        return _instance;
    }

    private static CollisionSolver _instance = null;
}