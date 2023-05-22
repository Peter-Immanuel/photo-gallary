const track = document.getElementById("image-container")

// function to increase image size
function showFullscreenImage(imageUrl) {
    var fullscreenImage = document.createElement("img");
    fullscreenImage.src = imageUrl;
    fullscreenImage.id = "fullscreen-image";

    var existingFullscreenImage = document.getElementById("fullscreen-image");
    if (existingFullscreenImage) {
        existingFullscreenImage.remove();
    }

    document.body.appendChild(fullscreenImage);
}

// function to remove fullscreen image
function exitFullScreenImage() {
    var existingFullscreenImage = document.getElementById("fullscreen-image");
    if (existingFullscreenImage) {
        existingFullscreenImage.remove();
    }
}

window.onmousewheel = () =>{
    exitFullScreenImage()
}


window.onmousedown = e =>{
    track.dataset.mouseDownAt = e.clientX
    console.log("moused pressed")
    console.log(e.clientX)
}

window.onmousemove = e => {
    if(track.dataset.mouseDownAt === "0" || track.dataset.mouseDownAt === undefined) return;

    console.log(track.dataset.mouseDownAt)

    console.log("Mouse moving")
    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX;
    const   maxDelta = window.innerWidth / 2;
    const percentage = (mouseDelta / maxDelta) * -100

    if (track.dataset.prevPercentage === undefined){
        var nextPercentage = percentage
    } else if (track.dataset.prevPercentage != undefined) {
        var nextPercentage = parseFloat(track.dataset.prevPercentage) + percentage
    }

    track.dataset.percentage = nextPercentage
    
    track.style.transform = `translate(${nextPercentage}%, -50% )`
    // track.style.transform= `translate(${percentage}%, -50% )`

    console.log(mouseDelta)
    console.log(maxDelta)
    console.log(nextPercentage)
    
    track.animate(
        {transform: `translate(${nextPercentage}%, -50%)`},
        // {transform: `translate(${percentage}%, -50%)`},
        {duration:1200, fill:"forwards"}
    )
}

window.onmouseup = () => {
    track.dataset.mouseDownAt = "0"
    track.dataset.prevPercentage =  track.dataset.percentage

    console.log("moved released")
    console.log(track.dataset.percentage)
}


// for (const image of track.gtElementsByClassName("image")) {
//     image.animate(
//         {objectPosition:`${100 + nextPercentage}%, center`},
//         {duration: 1200, fill: forwards}
//     )
//     image.style.objectPosition = `${nextPercentage + 100 }, 50%`
// }