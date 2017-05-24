
using UnityEngine;

public class GameManager : MonoBehaviour
{

    public PlanetData planet;
    public PlanetOrbitting ship;

	// Use this for initialization
	void Start () {
        planet.Init();
        ship.LandOnPlanet(planet);
    }
	
	// Update is called once per frame
	void Update () {
		
	}
}
