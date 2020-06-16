/*
Receive cursorData
 */


// server variables for apps to communicate they must use THE SAME KEYS
//get these keys from your PubNub account
//within your group, you will use 1 of your accounts for the project

let dataServer;


let subKey = 'insert your sub key';

//name used to sort your messages. used like a radio station. can be called anything
let channelName = "cursor";

let cursorX = 0;
let cursorY = 0;

function setup() 
{
  
  createCanvas(windowWidth,windowHeight);
  background(255);
  
  

   // initialize pubnub
  dataServer = new PubNub(
  {
    subscribe_key : subKey,  
    ssl: true  //enables a secure connection. This option has to be used if using the OCAD webspace
  });
  
  //attach callbacks to the pubnub object to handle messages and connections
  dataServer.addListener({ message: readIncoming});
  dataServer.subscribe({channels: [channelName]});

}

function draw() 
{
   background(0,255,0);
   fill(0);
   ellipse(cursorX,cursorY, 40,40);

}


function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               // this works becsuse we subscribed to the channel in setup()
  
  // simple error check to match the incoming to the channelName
  if(inMessage.channel == channelName)
  {
    cursorX = inMessage.message.x;
    cursorY = inMessage.message.y;

  }
}
