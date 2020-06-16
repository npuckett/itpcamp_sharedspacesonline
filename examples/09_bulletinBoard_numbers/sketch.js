/*ONly listen to the channel and display the number of letters in each message
 */


// server variables for apps to communicate they must use THE SAME KEYS
//get these keys from your PubNub account
//within your group, you will use 1 of your accounts for the project

let dataServer;
let subKey = 'sub-c-5ed17662-acc7-11ea-8210-c6b11d1b7ea4';



//name used to sort your messages. used like a radio station. can be called anything
let channelName = "textChannel";

let incomingText; //variable that will hold the incoming message text
let totalLetters; //variable that will hold the number of letters

function setup() 
{
  
  createCanvas(1000,700);
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



}

function draw() 
{
    background(255);
    noStroke();
    fill(0);  //read the color values from the message
    textAlign(CENTER, CENTER);
    textSize(height/10)
    text(totalLetters, width/2, height/2);

}



function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               // this works becsuse we subscribed to the channel in setup()
  
  // simple error check to match the incoming to the channelName
  if(inMessage.channel == channelName)
  {
  incomingText = inMessage.message.messageText;
  totalLetters = incomingText.length;
  }
}
