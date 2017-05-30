using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public abstract class OrbitalObject : MonoBehaviour
{
    public enum ObjectType
    {
        SHIP,
        RESOURCE
    }

    public abstract ObjectType objectType { get; }
    public abstract float collisionRadius { get; } 
    public abstract void LandOnPlanet(PlanetData p_planet);

    public bool Killed {  get { return _killed; } }
    public virtual void Kill()
    {
        _killed = true;
    }

    protected bool _killed = false;
}
