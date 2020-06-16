/*

Blank pubnub sketch
 */


// server variables for apps to communicate they must use THE SAME KEYS
//get these keys from your PubNub account
//within your group, you will use 1 of your accounts for the project
/*

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


}

function draw() 
{


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

*/
///////////////////////////////////////////////
let dataServer;
let pubKey = 'pub-c-8db19b5d-f1de-4ece-a16d-5e464169e380';
let subKey = 'sub-c-5ed17662-acc7-11ea-8210-c6b11d1b7ea4';
let myuuid;

let textToSend = "This is test Text";
let numberToSend = 300;

//name used to sort your messages. used like a radio station. can be called anything
let channelName = "messageChannel";




let bubbles =[]; 
function setup() {
  createCanvas(800, 600);
  for (let i = 0; i < 1; i++){
  	bubbles[i] = new Bubble(random(width),random(400,800));
  }

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
   



}

function draw() {
  background(0,0,100);
  for (let i = 0; i < bubbles.length; i++){
  bubbles[i].show();
  bubbles[i].move();
  }
}

function mousePressed(){
  //append(bubbles, new Bubble(mouseX,mouseY));
  
  dataServer.publish(
    {
      channel: channelName,
      message: 
      {
        mx: mouseX,
        my: mouseY       //get the value from the text box and send it as part of the message   
      }
    });

}

class Bubble {
	constructor(tempx,tempy){
  	this.x = tempx;
    this.y = tempy;
    this.size = random(20,50);
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
  }
  
  move(){
  	this.x += random(-4,4);
  	this.y += random(-5,-3);
    if (this.y < 0){
        this.y = random(height,height+100);
        }
    if (this.x>width){
        this.x = 0;
        }
    if (this.x < 0){
    	this.x = width;
    }
  }
  
  show(){
  	stroke(255);
  	strokeWeight(3);
  	fill(this.r,this.g,this.b,100);
  	ellipse(this.x,this.y,this.size,this.size);
  }
}



function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               // this works becsuse we subscribed to the channel in setup()
  
  // simple error check to match the incoming to the channelName
  if(inMessage.channel == channelName)
  {
    //open the console to see what it says
    console.log(inMessage);

    append(bubbles, new Bubble(inMessage.message.mx,inMessage.message.my));
  }
}