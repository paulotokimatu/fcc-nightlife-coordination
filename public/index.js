var baseUrl = window.location.protocol + "//" + window.location.host;
var inputLocation = document.getElementById("location");
if (document.getElementById("user-identification")) {
    var userId = document.getElementById("user-identification").dataset.id;
}
var mainForm = document.getElementsByClassName("main-form")[0];
var navbar = document.getElementsByClassName("navbar")[0];
var navbarInput = document.getElementById("navbar-input-text");

//Event listeners

inputLocation.addEventListener("keyup", function(e) {
    e.preventDefault();
    if (e.keyCode == 13) {
        reqData();
    }
});

// Check for scroll everytime is expensive, so I will check every 250ms
var didScroll;
var scrollPageY;

window.addEventListener("scroll", function(e) {
    didScroll = true;
    scrollPageY = e.pageY;
});

setInterval(function() {
  if (didScroll) {
    hasScrolled();
    didScroll = false;
    scrollPageY = "";
  }
}, 250);

//Clone of the input text to avoid movement of the page when moving the original input text
var inputClone = document.createElement("input");

function hasScrolled() {
    if (scrollPageY > mainForm.clientHeight + 20) {
        navbarInput.appendChild(inputLocation);
        mainForm.appendChild(inputClone);
        navbar.style.display = "block";
    }
    else {
        mainForm.appendChild(inputLocation);
        navbarInput.appendChild(inputClone);
        navbar.style.display = "none";
    }
}

function reqData() {
    document.getElementById("result").innerHTML = "Loading results...";
    var query = inputLocation.value.trim();
    if (query.length > 0) {
        ajaxRequest("GET", baseUrl + "/" + inputLocation.value, parseData);
    }
    else document.getElementById("result").innerHTML = "Invalid input, try another word!";
}

function parseData(data) {
    //document.getElementById("result").innerText = data;
    document.getElementById("result").innerHTML = "";
    
    data = JSON.parse(data);
    for (var i = 0; i < data.length; i++) {
        //Create div containing all info about one place
        var onePlace = document.createElement("div");
        onePlace.className = "one-place";
        
        //Create section with general info about the place
        var infoComponents = document.createElement("div");
        infoComponents.className = "one-place-general-info";
        infoComponents.innerHTML = '<img src="' + data[i].image_url + '" width="100" height="100" alt="' + data[i].name + '">' + 
            '<div class="one-place-general-no-img"><div><a href="' + data[i].url + '"><h2>' +
            data[i].name + '</h2></a> Price: ' + data[i].price + ' | Rating: ' + data[i].rating +
            '</div><div>Address: ' + data[i].address + ' - ' + data[i].city + '</div></div>';
            
        //Create the section related to like control
        var likeComponents= document.createElement("div");
        likeComponents.className = "one-place-like-components";
        likeComponents.innerHTML = 'Likes: <span class="num-likes" id="num-likes-' + data[i]._id + '">' + data[i].likes.length + '</span>';
        
        //Create button to send the like/unlike event
        var btnLike = document.createElement("button");
        btnLike.id = data[i]._id;
        btnLike.innerText = "Like";
        btnLike.setAttribute("action", "like");
        
        //Append all the sections into onePlace
        document.getElementById("result").appendChild(onePlace);
        onePlace.appendChild(infoComponents);
        onePlace.appendChild(likeComponents);
        likeComponents.appendChild(btnLike);
        
        //If user is logged in, check if he liked or not that place
        if (userId) {
            var likeStatus = document.createElement("div");
            likeStatus.className = "like-status ";
            likeStatus.id = "like-status-" + data[i]._id;
            if (data[i].likes.indexOf(userId) > -1) {
                btnLike.innerText = "Unlike";
                btnLike.setAttribute("action", "unlike");
                likeStatus.className += "active";
            }
            else {
                likeStatus.className += "inactive";
            }
            
            likeComponents.appendChild(likeStatus);
        }
        
        btnLike.addEventListener("click", function(e) {
            ajaxRequest("POST", baseUrl + "/like/" + e.target.id, function(likeApiRes) {
                if (likeApiRes !== "error") {
                    updateLikeButton(e.target.getAttribute("action"), e.target.id);
                }
                
            }, "placeId=" + e.target.id + "&action=" + e.target.getAttribute("action"));
        });
    }
}

function updateLikeButton(action, id) {
    var switchAction = {
        like: "unlike",
        unlike: "like"
    };
    var actionResult = {
        like: 1,
        unlike: -1
    };
    //Update the like counter
    var numLikes = document.getElementById("num-likes-" + id);
    numLikes.innerText = Number(numLikes.innerText) + actionResult[action];
    
    //Change the button
    var btnLike = document.getElementById(id);
    btnLike.innerText = switchAction[action];
    btnLike.setAttribute("action", switchAction[action]);
    
    //Switch the color of the signal
    console.log("like-status-" + id)
    var likeStatus = document.getElementById("like-status-" + id);
    likeStatus.classList.toggle("active");
    likeStatus.classList.toggle("inactive");
}