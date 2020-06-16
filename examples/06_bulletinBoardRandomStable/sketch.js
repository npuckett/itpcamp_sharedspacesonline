/*
Randomizes the position/size of incoming text, but only updates on new messages.
 */


// server variables for apps to communicate they must use THE SAME KEYS
//get these keys from your PubNub account
//within your group, you will use 1 of your accounts for the project

let dataServer;
let pubKey = 'pub-c-8db19b5d-f1de-4ece-a16d-5e464169e380';
let subKey = 'sub-c-5ed17662-acc7-11ea-8210-c6b11d1b7ea4';



//name used to sort your messages. used like a radio station. can be called anything
let channelName = "textChannel";

let incomingText = ""; //variable that will hold the incoming message text
let randPosX = 0;
let randPosY = 0;
let randSize = 0;

function setup() 
{
  
  createCanvas(1000,700);
  background(255);
  
  

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

  //create the text fields for the message to be sent
  sendText = createInput();
  sendText.position(5,height-100);

  sendButton = createButton('Post Message');
  sendButton.position(sendText.x + sendText.width,height-100);
  sendButton.mousePressed(sendTheMessage);


  fill(0, 100);
}

function draw() 
{
    //background(255);
    noStroke();
    
    textSize(randSize)
    text(incomingText,randPosX, randPosY);

}


///uses built in mouseClicked function to send the data to the pubnub server
function sendTheMessage() {
 

  // Send Data to the server to draw it in all other canvases
  dataServer.publish(
    {
      channel: channelName,
      message: 
      {
        messageText: sendText.value()       //get the value from the text box and send it as part of the message   
      }
    });

}

function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               // this works becsuse we subscribed to the channel in setup()
  
  // simple error check to match the incoming to the channelName
  if(inMessage.channel == channelName)
  {
  incomingText = inMessage.message.messageText;
  randPosX = random(5,width-100);
  randPosY = random(5,height-20);
  randSize = random(10,100);
  }
}
