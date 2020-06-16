/*

Pubnub app sends/receives 2 text variables in a message
 */


// server variables for apps to communicate they must use THE SAME KEYS
//get these keys from your PubNub account
//within your group, you will use 1 of your accounts for the project

let dataServer;
let pubKey = 'pub-c-8db19b5d-f1de-4ece-a16d-5e464169e380';
let subKey = 'sub-c-5ed17662-acc7-11ea-8210-c6b11d1b7ea4';
let myuuid;

//input variables
let sendText;
let sendButton;
let whoAreYou;
let idbutton;

//name used to sort your messages. used like a radio station. can be called anything
let channelName = "textChannel";

let incomingText = ""; //variable that will hold the incoming message text


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
    ssl: true,  //enables a secure connection. This option has to be used if using the OCAD webspace
    uuid:myuuid
  });
  
  //attach callbacks to the pubnub object to handle messages and connections
  dataServer.addListener({ message: readIncoming });
  dataServer.subscribe({channels: [channelName]});

  //create the text fields for the message to be sent
  
  whoAreYou = createInput('Set a new User ID');
  whoAreYou.position(5,height-140);

  idbutton = createButton('Set New UUID');
  idbutton.position(whoAreYou.x+whoAreYou.width,height-140);
  idbutton.mousePressed(setnewID);

  sendText = createInput('Write a  Message');
  sendText.position(5,height-100);

  sendButton = createButton('Post Message');
  sendButton.position(sendText.x + sendText.width,height-100);
  sendButton.mousePressed(sendTheMessage);
  
  

}

function draw() 
{
    background(255);
    noStroke();
    fill(0);  //read the color values from the message
    textSize(height/25);
    text(incomingText, 5, height/2);
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
  incomingText = inMessage.publisher+" says "+inMessage.message.messageText;
  }
}

function setnewID()
{
dataServer.setUUID(whoAreYou.value());

}
