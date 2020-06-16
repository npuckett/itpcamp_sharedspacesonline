/*
 * Creation & Computation - Digital Futures, OCAD University
 * Kate Hartman / Nick Puckett
 * 
 * Introduces the grid of clickable objects we will use in the next exampl
 * Example of dealing with simple classes in javascript
 * 
 * takes the coordinates of everyone's mouse that is connected and draws the average
 */

// server variables
let dataServer;
let pubKey = 'insert your pub key';
let subKey = 'insert your sub key';
let channelName = "cursors";


let cursors = [];
let clicks = [];
let avgX = 0;
let avgY = 0;
function setup() 
{

  createCanvas(600,1200);
  

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

  cursors.push(new Allcursors(mouseX,mouseY,dataServer.getUUID()));
  console.log(dataServer.getUUID());
setInterval(wheresMyCursor, 300);
}

function draw() 
{
  background(255);
  //wheresMyCursor();
  let totalX = 0;
  let totalY = 0;
 ///draw all the cursors 
  for(let i = 0; i<cursors.length;i++)
  {
    cursors[i].drawCursor();
    totalX+=cursors[i].xpos;
    totalY+=cursors[i].ypos;
  }
//calculate the average  
avgX = totalX/cursors.length;
avgY = totalY/cursors.length;
//draw lines from the cursors to the average
  for(let i = 0; i<cursors.length;i++)
  {
    stroke(255,105,180);
    strokeWeight(2);
    line(cursors[i].xpos,cursors[i].ypos,avgX,avgY);
  }


///draw the average cursor point
fill(255,0,0,150);
noStroke()
ellipse(avgX,avgY,20,20);

///draw the clicks

  for(let i = 0; i<clicks.length;i++)
  {
    clicks[i].drawClick();
  }



}



///uses built in mouseClicked function to send the data to the pubnub server
function mouseClicked() 
{
clicks.push(new Clickpoints(avgX,avgY));

}

function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               // this works becsuse we subscribed to the channel in setup()
   //console.log(inMessage.publisher);
  if(inMessage.channel == channelName)
  {
    let whoAreYou = inMessage.publisher;
    let clickX = inMessage.message.x;
    let clickY = inMessage.message.y;
      //console.log(whoAreYou);
      //console.log("  "+dataServer.getUUID());
      console.log(cursors.length);


 let newinput = true;
  for(let i = 0; i<cursors.length;i++)
  {
    if(whoAreYou==cursors[i].who)
    {
      cursors[i].xpos = clickX;
      cursors[i].ypos = clickY;
      newinput = false;   
    }
  }
  if(newinput)
  {
    cursors.push( new Allcursors(clickX,clickY,whoAreYou));

  }


   
  }
}


function wheresMyCursor()
{

  //only publish a new position if it has changed
  if(dist(mouseX,mouseY,cursors[0].xpos,cursors[0].ypos)>1)
  {
        dataServer.publish(
      {
        channel: channelName,
        message: 
        {       //set the message objects property name and value combos    
          x: mouseX,
          y: mouseY 
        }
      });

  }
  else
  {
    //console.log('same!');
  }
}


///this is the class that draws everyone connected's cursor as a + sign
function Allcursors(x,y,who)
{
this.xpos = x;
this.ypos = y;
this.who = who;

this.prevX = x;
this.prevY = y;

  this.drawCursor = function()
  {
  //draw a + sign for each of the cursors
  stroke(0);
  strokeWeight(1);
  line(this.xpos,this.ypos-5,this.xpos,this.ypos+5);
  line(this.xpos-5,this.ypos,this.xpos+5,this.ypos);

  }
}

//This class is for drawing the circles where you have clicked
function Clickpoints(x,y)
{
this.xpos = x;
this.ypos = y;

  this.drawClick = function()
  {
  noFill();
  stroke(255,0,0);
  strokeWeight(2);
  ellipse(this.xpos,this.ypos,20,20);

  }

}



