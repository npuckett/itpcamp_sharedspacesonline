/*
 * 
 * 
 * 
 * This is a simple vote / tally system
 * It also uses a responsive canvas and shows one method for recording clicks on different
 * screen sizes and translate it into a single tally
 * 
 * "Voting" is done by clicking on the box
 */

// server variables

let dataServer;
let pubKey = 'insert your pub key';
let subKey = 'insert your sub key';



let yesCount = 0;
let noCount = 0;

let colorYes;
let colorNo;

let choice;

//name used to sort your messages. used like a radio station. can be called anything
let channelName = "theVote";

function setup() 
{
  getAudioContext().resume();
  createCanvas(windowWidth,windowHeight);
  background(255);
  
  
  colorYes = color(random(0,255),random(0,255),random(0,255));
  colorNo = color(random(0,255),random(0,255),random(0,255));

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

}

function draw() 
{
background(255);
noStroke();

//draw the box for Yes
fill(colorYes);
quad(0,0,0,height,width/2,height,width/2,0);

//draw the box for No
fill(colorNo);
quad(width/2,0,width/2,height,width,height,width,0);

//draw the text
fill(255);
textSize(40);
textAlign(CENTER, CENTER);

//draw yes and count
text("YES",width*0.25,(height/2)-60);
text(yesCount,width*0.25,(height/2)+60);
//draw no and count
text("NO",width*0.75,(height/2)-60);
text(noCount,width*0.75,(height/2)+60);

}


///uses built in mouseClicked function to send the data to the pubnub server
function sendTheMessage() {
 

  // Send Data to the server to draw it in all other canvases
  dataServer.publish(
    {
      channel: channelName,
      message: 
      {
        vote: choice       //get the value from the text box and send it as part of the message   
      }
    });

}

function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               // this works becsuse we subscribed to the channel in setup()
  
  // simple error check to match the incoming to the channelName
  if(inMessage.channel == channelName)
  {
      if(inMessage.message.vote == "yes")
      {
        yesCount+=1;
      }
      if(inMessage.message.vote == "no")
      {
        noCount+=1;
      }
  }
}

function mousePressed()
{
  if(mouseX<=width/2)
  {
    choice = "yes";
  }

  else
  {
    choice = "no";
  }

sendTheMessage();

}


function windowResized() 
{
  resizeCanvas(windowWidth, windowHeight);
}