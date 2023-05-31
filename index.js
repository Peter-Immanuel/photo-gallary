const track = document.getElementById("image-container")

// Show the loading animation
function showLoader() {
    track.style.display = "none"
    document.querySelector('.loader-container').style.display = 'flex';
}

// Hide the loading animation
function hideLoader() {
    // document.querySelector('.loader-container').style.display = 'none';
    document.querySelector('.loader-container').remove();
    track.style.display = "flex"
}


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


function fetchImages() {
    showLoader()

    var pictures = [];
    fetch('https://staging.inawo.live/query', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-user-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NfdXVpZCI6IiIsImF1dGhvcml6ZWQiOnRydWUsImV4cCI6MTY4NTAzODg3NCwicGVybXMiOnsiMzg2IjoicGxhbm5lciIsIjM5NSI6Imdyb29tIn0sInVzZXJfaWQiOjMxMiwidXNlcl91dWlkIjoiZDFjMmQyMmEtZDRkYi00ZTk0LWI0MjgtNDZiNDE4MzIyNmIxIn0.CZo1VrHNmH2HTKugOIZ2nTCpLbo9kHN6Ii1HQq11XXo'
        },
        
        body: JSON.stringify({
            query: `query GetAlbumDetails {
                getAlbumDetails(eventId: 395) {
                    id
                    name
                    url
                    tags
                    type
                    created_at
                }
            }`
        }),
    })
        .then(response => response.json())
        .then(data => {
            data.data.getAlbumDetails.forEach(element => {
                pictures.push(element.url)
            })


            // append image to track
            pictures.forEach(element => {
                imageElement = document.createElement("img")
                imageElement.src = element
                imageElement.classList.add("visible-image")
                imageElement.draggable=false

                // imageElement.addEventListener('click', showFullscreenImage);
                // imageElement.addEventListener('onmousewheel', exitFullScreenImage());
                track.appendChild(imageElement)
            })

            hideLoader()
        })
        .catch(error => {
          // Handle any errors
          console.error(error);
        });
      
}

// System Algorithm

// Show loader
// showLoader();

// Make GraphQL query and load images before removing loader 
fetchImages()

// setTimeout(hideLoader, 5000)
// hideLoader()




window.onmousewheel = () =>{
    exitFullScreenImage()
}

window.onmousedown = e =>{
    track.dataset.mouseDownAt = e.clientX
    // console.log("moused pressed")
    // console.log(e.clientX)
}

window.onmousemove = e => {
    if(track.dataset.mouseDownAt === "0" || track.dataset.mouseDownAt === undefined) return;

    // console.log(track.dataset.mouseDownAt)

    // console.log("Mouse moving")
    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX;
    const   maxDelta = window.innerWidth / 2;
    const percentage = (mouseDelta / maxDelta) * -100

    if (track.dataset.prevPercentage === undefined){
        var nextPercentage = percentage
    } else if (track.dataset.prevPercentage != undefined) {
        var nextPercentage = parseFloat(track.dataset.prevPercentage) + percentage
    }


    // Set maximum and minimum values for scroller
    nextPercentage = Math.min(nextPercentage, 0);
    nextPercentage = Math.max(nextPercentage, -100);

    track.dataset.percentage = nextPercentage
    
    track.style.transform = `translate(${nextPercentage}%, -50% )`

    // console.log(mouseDelta)
    // console.log(maxDelta)
    // console.log(nextPercentage)
    
    track.animate(
        {transform: `translate(${nextPercentage}%, -50%)`},
        // {transform: `translate(${percentage}%, -50%)`},
        {duration:1200, fill:"forwards"}
    )
    var image_list = Array.from(document.getElementsByClassName("visible-image"))

    image_list.forEach(element => {
        element.animate(
            {objectPosition:`${parseInt(100 + nextPercentage)}% 50%`},
            {duration: 1200, fill: "forwards"}
        )
    });
}

window.onmouseup = () => {
    track.dataset.mouseDownAt = "0"
    track.dataset.prevPercentage =  track.dataset.percentage

    // console.log("moved released")
    // console.log(track.dataset.percentage)
}