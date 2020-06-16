

//basic server example using pubnub
//
//Based on Shiffman Coding Rainbow#30
//multiuser tool
//each client is assigned a random color + random size
//click within the frame to create a circle of your size/color
//all other clicks will also be shown in your canvas
//uses pubnub instead of writing a NODE server


// server variables
let dataServer;
let pubKey = 'pub-c-8db19b5d-f1de-4ece-a16d-5e464169e380';
let subKey = 'sub-c-5ed17662-acc7-11ea-8210-c6b11d1b7ea4';


let in_mouseX;
let in_mouseY;
let in_imgNum;

//size of the active area
let cSizeX = 1000;
let cSizeY = 800;

//name used to sort your messages. used like a radio station. can be called anything
let channelName = "clickChannel";


//image variables
let tiles = [];
let totalImages = 4;
let myimg;


function preload() 
{
  //rather than making separate variables we are loading them all into an array
  for (let i = 0; i<totalImages; i++) 
  {
    tiles[i] = loadImage("collage/tile" + (i+1) + ".jpg");
  }

}



function setup() 
{

  createCanvas(cSizeX, cSizeY);
  
  
   // initialize pubnub
  dataServer = new PubNub(
  {
    publish_key   : pubKey,  //get these from the pubnub account online
    subscribe_key : subKey,  
    ssl: true  //enables a secure connection. This option has to be used if using the OCAD webspace
  });
  
  //attach callbacks to the pubnub object to handle messages and connections
  dataServer.addListener({ message: readIncoming });
  dataServer.subscribe({channels: [channelName]});

myimg = floor(random(0,(totalImages-0.1)));
in_imgNum = myimg;
in_mouseX = width/2;
in_mouseY = height/2;

imageMode(CENTER);
}

function draw() 
{
///all the drawing is happing in the readIncoming function
image(tiles[in_imgNum],in_mouseX,in_mouseY,100,100);

}


///uses built in mouseClicked function to send the data to the pubnub server
function mouseClicked() {
  // Send Data to the server to draw it in all other canvases
  dataServer.publish(
    {
      channel: channelName,
      message: 
      {       //set the message objects property name and value combos    
        x: mouseX,
        y: mouseY,
        imgNumber: myimg

      }
    });

}

function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               // this works becsuse we subscribed to the channel in setup()
  
  // draw a circle on the screen if the user is someone else
  if(inMessage.channel == channelName)
  {
    //assign the data from the message to the variables
  
    in_mouseX = inMessage.message.x;
    in_mouseY = inMessage.message.y;
    in_imgNum = inMessage.message.imgNumber;

  }
}

