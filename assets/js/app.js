$(document).ready(function() {
    $.ajax({
      url: "https://itunes.apple.com/search?term=song",
      success: (data)=>{
        let response = JSON.parse(data);
        let results = response.results;
  
        for (let result of results) {
          $("#card_container").append(
            `
            <div class="card col-3 col-md-4 col-sm-6 text-center my-5">
                    <img src="${result.artworkUrl100.replace("100x100", "1000x1000")}" class="card-img-top my-3 w-100">
                    <div class="card-body w-100">
                        <h5 class="card-title">${result.artistName}</h5>
                        <p class="card-text py-4">${result.trackName}</p>
                        <div class="card-text py-2">
                          <audio width="100%" height="auto" controls>
                            <source src="${result.previewUrl}" >
                            no disponible
                          </audio>
                        </div>
                        <div class="btn btn-primary w-50 mx-auto" data="${result.trackId}">Play</div>
                    </div>
                  </div>
            `
          )
        }
      }
    })
  
    //if in the url looks like index.php?user_id=${user_id}  then it means we have an active session
    
    // setting url just to test the functionality
    
    //history.pushState({page: 1}, "title 1", "?user_id=2")
    
    let url = window.location.href;
  
    if (url.includes("user_id")) {
  
      $.get("./server/preferences.php", function(data) {
        
        let response = JSON.parse(data);
        let favorites = response.results;
        console.log(favorites);
  
        $("#card_container").empty();
        
        for (let result of favorites) {
          
          $("#card_container").append(
            `
            <div class="card col-3 col-md-4 col-sm-6 text-center my-5">
                    <img src="${result.artworkUrl100.replace("100x100", "1000x1000")}" class="card-img-top my-3 w-100">
                    <div class="card-body w-100">
                        <h5 class="card-title">${result.artistName}</h5>
                        <p class="card-text py-4">${result.trackName}</p>
                        <div class="card-text py-2">
                          <audio width="100%" height="auto" controls>
                            <source src="${result.previewUrl}" >
                            no disponible
                          </audio>
                        </div>
                        <div 
                        class="btn btn-primary w-50 mx-auto check-song"
                        name="checkLogin"  
                        data-id="${result.trackId}"
                        data-genre="${result.primaryGenreName}"
                        data-title="${result.collectionCensoredName}">Play</div>
          
                    </div>
                  </div>
            `
          )
        }
  
      })
  
      $("#needlog").hide();
    }
    else{
      $("#needlog").show();
    }
  
  
    // Search bar functionality
  
    $("#searchbar").on('keypress', function(e) {
  
      if(e.which == 13) {
        $(document).ajaxStart((e) => {
          $(".loading").show()
        })
        let search = $("#searchbar").val()
        let type = $("#type").children(":selected").attr("id");
        let limit = $("#limit").children(":selected").attr("value");
        
        $.ajax({
          url: "server/search.php",
          method: "GET",
          data: {search:search, type:type, limit:limit},
          success: function(data) {
            let response = JSON.parse(data);
            let results = response.results;
            console.log(results)
   
            $("#card_container").empty();
  
            if (type == "album") {
              for (let result of results) {
                $("#card_container").append(
                  `
                  <div class="card col-3 col-md-4 col-sm-6 text-center my-5">
                    <img src="${result.artworkUrl100.replace("100x100", "1000x1000")}" class="card-img-top my-3 w-100">
                    <div class="card-body w-100">
                        <h5 class="card-title">${result.artistName}</h5>
                        <p class="card-text py-4">${result.collectionCensoredName}</p>
                        <div class="btn btn-primary">buy it</div>
                    </div>
                  </div>
                  `
                )
              }
  
            } else if (type == "song") {
              for (let result of results) {
                $("#card_container").append(
                  `
                  <div class="card col-3 col-md-4 col-sm-6 text-center my-5">
                    <img src="${result.artworkUrl100.replace("100x100", "1000x1000")}" class="card-img-top my-3 w-100">
                    <div class="card-body w-100">
                        <h5 class="card-title">${result.artistName}</h5>
                        <p class="card-text py-4">${result.trackName}</p>
                        <div class="card-text py-2">
                          <audio width="100%" height="auto" controls>
                            <source src="${result.previewUrl}" >
                            no disponible
                          </audio>
                        </div>
                        <div 
                        class="btn btn-primary w-50 mx-auto check-song"
                        name="checkLogin"  
                        data-id="${result.trackId}"
                        data-genre="${result.primaryGenreName}"
                        data-title="${result.collectionCensoredName}">Play</div>
                    </div>
                  </div>
                  `
                )
              }
            } else {
              let i = 0;
              for (let result of results) {
                $("#card_container").append(
                  `
                  <div class="card col-3 col-md-4 col-sm-6 text-center my-5">
                    <video class="custom-video" id="video-${i}" preload="none" poster="${result.artworkUrl100.replace("100x100", "200x200")}">
                      <source src="${result.previewUrl}">
                    </video>
                    <input type="button" class="btn btn-light w-25 my-2 mx-auto check-video" value="play">
                    <div class="card-body w-100">
                        <h5 class="card-title">${result.artistName}</h5>
                        <p class="card-text py-4">${result.trackName}</p>
                    </div>
                  </div>
                  `
                )
                i++
              }
            }
            //
          }
        })
      }
    })
  
    $("#login_btn").click( ()=>{
      let btn_text = $("#login_btn").text().trim();
  
      if(btn_text === "Login"){
        location.href = "./login.php";
      }
      else if(btn_text === "Sign Out"){
        $.ajax("server/signout.php")
        .done(function(data){
          location.href = "./index.php";
        })
      }
    })
  
  
    $("#register_btn").click( ()=>{
      // console.log("Pressing Register Button!");
      location.href = "./register.php";
    })
  
  
    $(document).ajaxComplete((e) => {
      $(".loading").hide()
    })
  
    // check login, if the user is login show preview and save info
  
    $(document).on("click", (e)=>{
  
      const element = $(e.target);
  
      if (element.hasClass('check-song')) {
        var dataId = element.data('id')
        var dataGenre = element.data('genre')
        var dataTitle = element.data('title')
        // console.log(dataId + " "+dataGenre+" "+dataTitle)
        $.ajax({
          type: "GET",
          url: "./server/login_validation.php",
          data: {checkLogin:"checkLogin", dataId:dataId, dataGenre:dataGenre, dataTitle:dataTitle},
          success: function (response) {
            console.log(response)
            if(response == "true"){
              console.log("ok")
              $("audio").css("display", "block")
            }else{
              $("#needlog").css("display", "block")
            }
            
          }
        });
      }
  
    })
  
  
    
    
    // NOTE: idea https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_video_js_prop
    // TODO: end this action, play video with external button
    
    let video = $("#video-0");
    
    function playPause() { 
      if (video.paused()) 
        video.play(); 
      else 
        video.pause(); 
    } 
    $(".play").on("click", ()=>{
    
      playPause()
    })
  
  
  // Loading Users in admin panel
  
    function loadUsers() {
      $.get("server/loadAdminPanel.php", function(data){
        let users = JSON.parse(data);
        $("#table_body").empty();
  
        for (let user of users) {
          $("#table_body").append(
            `
            <tr>
              <td scope="col">${user.user_id}</th>
              <td scope="col">${user.userName}</th>
              <td scope="col"><button type='button' class="btn btn-info" id="user_${user.user_id}" data-toggle="modal" data-target="#myModal">Details</button></th>
            </tr>
            `
          )
          
          $(`#user_${user.user_id}`).click(function() {
            
            let actions = user.data;
            
            $(".modal-title").empty();
            $(".modal-title").text(`User history: ${user.userName}`);
  
            $("#history").empty();
  
            for (let el of actions) {
              $("#history").append(
                `
                <tr>
                  <td scope="col">${el.track_id}</th>
                  <td scope="col">${el.track_title}</th>
                  <td scope="col">${el.track_category}</th>
                  <td scope="col">${el.reproductions}</th>
                </tr>
                `
              )
            }
  
          })
        }
      })
    }
  
    loadUsers();
  
    function appendSong (res) {
  
    }
  
  
  });
  
  
  