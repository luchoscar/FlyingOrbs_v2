
using UnityEngine;

public class InputManager
{
    public static int GetTurnDirection()
    {
        if (Input.GetKey(KeyCode.A))
            return -1;

        if (Input.GetKey(KeyCode.D))
            return 1;

        return 0;
    }

    public static int GetLinerDirection()
    {
        if (Input.GetKey(KeyCode.W))
            return 1;

        if (Input.GetKey(KeyCode.S))
            return -1;

        return 0;
    }
}
