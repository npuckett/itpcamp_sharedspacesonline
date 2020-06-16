/*
Read canvas images from PubNub messages, store them in an array and display them in a 6X6 grid
images are shifted in the array as they come in 
Based on: https://www.pubnub.com/blog/diy-snapchat-clone-capture-send-images-javascript-tutorial/
*/

let dataServer;
let pubKey = 'insert your pub key';
let subKey = 'insert your sub key';
let imageList = [];
let colWidth = 6;
let maxImages = 36;
let imgSize = 150;

//name used to sort your messages. used like a radio station. can be called anything
let channelName = "imageSend";


function setup() 
{
createCanvas(900,900);
 background(220); 
    dataServer = new PubNub(
  {
    publish_key   : pubKey,  //get these from the pubnub account online
    subscribe_key : subKey,  
    ssl: true,  
  });
  
  //attach callbacks to the pubnub object to handle messages and connections
    dataServer.addListener({ message: readIncoming}); 
  dataServer.subscribe({channels: [channelName]}); //subscribe to messages on the channel
//callback for incoming messages
  
}

function draw() 
{

  if(imageList.length>0)
  {
    let totalImages = (imageList.length<maxImages) ? imageList.length : maxImages;
    for(let i=0;i<totalImages;i++)
    {  
    showImageMessage(imageList[i],imgSize*(i%colWidth),floor(i/colWidth)*imgSize,imgSize,imgSize);
    } 
  }
  
}


function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               // this works becsuse we subscribed to the channel in setup()
  
  // simple error check to match the incoming to the channelName
  if(inMessage.channel == channelName)
  {
    imageList.unshift(inMessage.message.image);
  }
}


//based on this example: https://github.com/processing/p5.js/issues/3055
function showImageMessage(messageData, locationX, locationY, imgSizeX, imgSizeY)
{
    let imageData = new Image();
    imageData.src=messageData; // base64 data here
    imageData.onload = function() {
  
    img = createImage(imageData.width, imageData.height);
    img.drawingContext.drawImage(imageData, 0, 0);
    image(img,locationX,locationY,imgSizeX,imgSizeY); 
  }
    
}


