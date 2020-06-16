/*
PubNub  
 * Receiver file that cycles through images based on the input from the controller 
 */


// server variables for apps to communicate they must use THE SAME KEYS
//get these keys from your PubNub account
//within your group, you will use 1 of your accounts for the project

let dataServer;



let subKey = 'sub-c-5ed17662-acc7-11ea-8210-c6b11d1b7ea4';

//name used to sort your messages. used like a radio station. can be called anything
let channelName = "powerpoint";


//image variables
let img = [];
let totalImages = 4;
let slideNumber = 0;


function preload() 
{
  //rather than making separate variables we are loading them all into an array
  for (let i = 0; i<totalImages; i++) 
  {
    img[i] = loadImage("load/img" + (i+1) + ".jpg");
  }

}


function setup() 
{
  getAudioContext().resume();
  createCanvas(windowWidth, windowHeight);
  background(255);
  


   // initialize pubnub
  dataServer = new PubNub(
  {
    subscribe_key : subKey,  
    ssl: true  //enables a secure connection. This option has to be used if using the OCAD webspace
  });
  
  //attach callbacks to the pubnub object to handle messages and connections
  dataServer.addListener({ message: readIncoming });
  dataServer.subscribe({channels: [channelName]});


    //display a waiting message
    background(255);
    noStroke();
    fill(0);  
    textSize(30)
    text("Waiting", width/2, height/2);

}

function draw() 
{
    background(255);
    image(img[slideNumber],0,0); //show the image corresponds to the slide number in the array

}

function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               
    
    slideNumber = inMessage.message.slide;
}

