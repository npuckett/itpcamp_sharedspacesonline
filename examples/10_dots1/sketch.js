/*

send mouse clicks
 */


// server variables for apps to communicate they must use THE SAME KEYS
//get these keys from your PubNub account
//within your group, you will use 1 of your accounts for the project

let dataServer;
let pubKey = 'pub-c-8db19b5d-f1de-4ece-a16d-5e464169e380';
let subKey = 'sub-c-5ed17662-acc7-11ea-8210-c6b11d1b7ea4';

//name used to sort your messages. used like a radio station. can be called anything
let channelName = "clickChannel";


let inmouseX;
let inmouseY;


function setup() 
{
  
  createCanvas(windowWidth,windowHeight);
  background(255);
  
  

   // initialize pubnub
  dataServer = new PubNub(
  {
    publish_key   : pubKey,  //get these from the pubnub account online
    subscribe_key : subKey,  
    ssl: true  //enables a secure connection. This option has to be used if using the OCAD webspace
  });
  
  //attach callbacks to the pubnub object to handle messages and connections
  dataServer.addListener({ message: readIncoming});
  dataServer.subscribe({channels: [channelName]});


}

function draw() 
{
fill(0);
ellipse(inmouseX,inmouseY,50,50);

}


///uses built in mouseClicked function to send the data to the pubnub server
function mouseClicked() {
 

  // Send Data to the server to draw it in all other canvases
  dataServer.publish(
    {
      channel: channelName,
      message: 
      {
        sx: mouseX,
        sy: mouseY 
      }
    });

}

function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               // this works becsuse we subscribed to the channel in setup()
  
  // simple error check to match the incoming to the channelName
  if(inMessage.channel == channelName)
  {
    console.log(inMessage.message);
    inmouseX = inMessage.message.sx;
    inmouseY = inMessage.message.sy;
  }
}
