/*

Gets your UUID from pubnub and displays it on the canvas
 */


// server variables for apps to communicate they must use THE SAME KEYS
//get these keys from your PubNub account
//within your group, you will use 1 of your accounts for the project

let dataServer;
let pubKey = 'pub-c-8db19b5d-f1de-4ece-a16d-5e464169e380';
let subKey = 'sub-c-5ed17662-acc7-11ea-8210-c6b11d1b7ea4';
let myuuid;

let textToSend = "This is test Text";
let numberToSend = 300;

//name used to sort your messages. used like a radio station. can be called anything
let channelName = "messageChannel";

function setup() 
{
  
  createCanvas(1000,700);
  background(255);
  
  myuuid = PubNub.generateUUID(); //generates a unique user id

   // initialize pubnub
  dataServer = new PubNub(
  {
    publish_key   : pubKey,  //get these from the pubnub account online
    subscribe_key : subKey,  
    ssl: true,  //enables a secure connection. 
    uuid: myuuid  //this is the id attached to the publisher parameter of all messages you send
  });
  
  //attach callbacks to the pubnub object to handle messages and connections
  dataServer.addListener({ message: readIncoming});
  dataServer.subscribe({channels: [channelName]});

  //get your id that is generated automatically
  myuuid = dataServer.getUUID();

}

function draw() 
{
background(0);
fill(255);
textAlign(CENTER,CENTER);
textSize(50);
text("Hi! my name is", width/2, (height/2)-55);  
text(myuuid,width/2,height/2);

}


///uses built in mouseClicked function to send the data to the pubnub server
function mouseClicked() {
 

  // Send Data to the server to draw it in all other canvases
  dataServer.publish(
    {
      channel: channelName,
      message: 
      {
        messageText: textToSend,
        messageNumber: numberToSend       //get the value from the text box and send it as part of the message   
      }
    });

}

function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               // this works becsuse we subscribed to the channel in setup()
  
  // simple error check to match the incoming to the channelName
  if(inMessage.channel == channelName)
  {
    //open the console to see what it says
    console.log(inMessage);
  }
}