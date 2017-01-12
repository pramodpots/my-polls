$(function () {

    var pollID;

    $.ajax({
        type: "GET",
        url: "/api/polls"
    }).done(function (polls) {
        pollID = polls[0].id;
        //getMessages();
        $.each(polls, function (key, poll) {
            var a = '<a href="#" data-room-id="' + poll.id + '" class="room list-group-item">' + poll.name + '</a>';
            $("#rooms").append(a);
        });

    });

    /*$("#post").click(function () {
        var message = {text: $("#message").val()};

        $.ajax({
            type: "POST",
            url: "/api/rooms/" + roomId + "/messages",
            data: JSON.stringify(message),
            contentType: "application/json"
        }).done(function () {
            $("#message").val("");
            getMessages();
        });
    });*/

    $('body').on('click', 'a.room', function (event) {
        pollID = $(event.target).attr("data-room-id");
        getPollInfo();
    });

    function getPollInfo() {
        $.ajax({
            type: "GET",
            url: "/api/polls/" + pollID,
        }).done(function (data) {
            //$.parseJSON(data);
            $("#pollName").text("Poll for " + data.name);
            var opt = "";
           /* var array = data.options;
            
            
            array.forEach(function(o){
                opt += '<label class="radio-inline"><input type="radio" name="optradio">'+ o + '</label> ' ;
            })
            
             $("#show-opts").html(opt);*/
             $("#question").text(data.question)
        });
    }

    $("#delete").click(function(){
        $.ajax({
            type: "DELETE",
            url: "/api/rooms/" + roomId + "/messages",
        }).done(function () {
            $("#messages").val("");
        });
    });


});