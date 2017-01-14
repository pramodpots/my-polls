$(function() {
    var rows = [];
    //$('#vote').hide();
    $('#option-add').hide();
    $('#buttons').hide();
    var pollID;

    $.ajax({
        type: "GET",
        url: "/api/polls"
    }).done(function(polls) {
        pollID = polls[0].id;
        //getMessages();
        $.each(polls, function(key, poll) {
            var a = '<a href="#" data-room-id="' + poll.id + '" class="room list-group-item">' + poll.name + '</a>';
            $("#rooms").append(a);
        });

    });

    $('body').on('click', 'a.room', function(event) {
        pollID = $(event.target).attr("data-room-id");
        getPollInfo();
       // $('#vote').show();
        $('#option-add').show();
        $('#buttons').show();

    });

    function getPollInfo() {
        rows = [];
        var title = "";
        $.ajax({
            type: "GET",
            url: "/api/polls/" + pollID,
        }).done(function(data) {
            title = data.question;
            var opt = '<form id="myForm">';
            var array = data.options;
            var showChart = " ";
            array.forEach(function(o) {
                opt += '<label class="radio-inline"><input type="radio" name="optradio" value="' + o.optName + '" >' + o.optName + '</label>';
                showChart += o.optName + " " + o.count + " ";
                var temp = [];
                temp.push(o.optName);
                temp.push(o.count);
                rows.push(temp);
                temp = [];
            })
            opt += '</form>'
            console.log(showChart);
            $("#show-opts").html(opt);
            $("#question").text(data.question)
            

            google.charts.load('current', {
                'packages': ['corechart']
            });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'options')
                data.addColumn('number', 'votes');
                data.addRows(rows);
                var options = {
                    'legend': 'right',
                    'is3D': true,
                };
                var chart = new google.visualization.PieChart(document.getElementById('showchart'));
                chart.draw(data, options);
                rows = [];
            }
        });
    }

    $("#add-new-option").click(function() {
        var newOptName = $('#new-option').val();
        console.log(newOptName);
        $('#new-option').val('');
        $.ajax({
            type: "GET",
            url: "/api/addPollOption/" + pollID + "/" + newOptName
        }).done(function(data) {
            getPollInfo();
        })
    })

    $('#vote').click(function() {
        var optionName = $('input[name="optradio"]:checked').val();
        $.ajax({
            type: "GET",
            url: "/api/polls/" + pollID + "/" + optionName,

        }).done(function(data) {
            getPollInfo();
        })
    })
/*
    $('#create').click(function() {
        var optionNames = $('#new-opts').val()
        var question = $('#new-poll').val();
        //console.log("new options " +optionNames + "new poll" + question);
        var info = {
            "que" : question,
            "optNames" : optionNames
        }
        $.ajax({
            type: "POST",
            url: "/app.js",
            dataType: "json",
            data: info,
            success: function(msg) {
                console.log(msg);
            }
        });
    })
*/
    $("#delete").click(function() {
        $.ajax({
            type: "DELETE",
            url: "/api/rooms/" + roomId + "/messages",
        }).done(function() {
            $("#messages").val("");
        });
    });

});
