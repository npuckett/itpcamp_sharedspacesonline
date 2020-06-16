
/*
Send canvas over PubNub
Based on: https://www.pubnub.com/blog/diy-snapchat-clone-capture-send-images-javascript-tutorial/

Press the spacebar to send 
*/

let dataServer;
let pubKey = 'pub-c-8db19b5d-f1de-4ece-a16d-5e464169e380';
let subKey = 'sub-c-5ed17662-acc7-11ea-8210-c6b11d1b7ea4';


//name used to sort your messages. used like a radio station. can be called anything
let channelName = "imageSend";




function setup() 
{
createCanvas(300, 300);
background(220);

  
    dataServer = new PubNub(
  {
    publish_key   : pubKey,  //get these from the pubnub account online
    subscribe_key : subKey,  
    ssl: true,  
  });
  

 
}

function draw() 
{

ellipse(mouseX,mouseY,30);
  
}



function keyPressed()
{

  if(key === ' ')
  {
   sendCanvas();
  }
   
  
}




function sendCanvas()
{
    canvasImage = compressImage(canvas,30);
    clear();
    background(220);
  
    if (canvasImage == null) {
        
        console.log("couldn't compress image");
        return;
    }  
    else
    {
         dataServer.publish(
        {
          channel: channelName,
          message: 
          {
            image: canvasImage,
            mx: mouseX,
            my: mouseY
          }
        });
      
    }
  
}


function compressImage(canvas, size) {
    var compression = 1.0;
    while(compression > 0.01) {
        var dataURL = canvas.toDataURL('image/jpeg', compression);
        if (dataURL.length/1012 < size) return dataURL;
        if (compression <= 0.1) {
            compression -= 0.01;
        } else {
            compression -= 0.1;
        }
    }
    return null;
}
