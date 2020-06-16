/*
PubNub  
 * Receiver file that changes the shape of a polygon
 */


// server variables for apps to communicate they must use THE SAME KEYS
//get these keys from your PubNub account
//within your group, you will use 1 of your accounts for the project

let dataServer;

let subKey = 'sub-c-5ed17662-acc7-11ea-8210-c6b11d1b7ea4';

//name used to sort your messages. used like a radio station. can be called anything
let channelName = "powerpoint";

let sides = 3  //default number of sides to start


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



}

function draw() 
{
  background(255);

  //draws and rotates the polygon
    push();
    fill(255);
    stroke(0);
    strokeWeight(10);
    translate(width/2, height/2);
    rotate(frameCount / -100.0);
    polygon(0, 0, 300, sides); 
    pop();

}

function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               
   
    sides = inMessage.message.slide +4; //take the number from the message and assign it to the sides variable

}

//draws a regular polygon. from P5 examples
function polygon(x, y, radius, npoints) 
{
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) 
  {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

