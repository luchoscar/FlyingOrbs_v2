#pragma strict

private var score_str : String;

//do not destroy score on new level
function Awake () 
{    
	DontDestroyOnLoad (this.gameObject);
}

function Start () {

}

function Update () 
{
	//format SCORE to 2 decimal places
	if (transform.GetComponent(GlobalVariablesHolder).ENERGY >= 100.00)
	{
		transform.GetComponent(GlobalVariablesHolder).ENERGY = 100.00;
	}
	
	transform.GetComponent(GlobalVariablesHolder).ENERGY = Mathf.Floor(transform.GetComponent(GlobalVariablesHolder).ENERGY * 100) / 100;
	score_str = transform.GetComponent(GlobalVariablesHolder).ENERGY.ToString();
	score_str = TrunckateString(score_str);
	
	transform.GetChild(0).GetComponent.<GUIText>().text =  score_str + "%";
}

function TrunckateString(string_In : String) : String
{
	var size : int = string_In.length;
	
	/*if (string_In[size - 2] == ".")
	{
		//Debug.Log(string_In);
		string_In += "0";
		//Debug.Log(string_In);
	}
	else if (size <= 3)
	{
		string_In += ".00";
	}
	*/
	return string_In;
}