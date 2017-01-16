$(function() {
    var rows = [];
    $('#delete').hide();
    $('#option-add').hide();
    $('#buttons').hide();
    $('#showchart').hide();
    var pollID;

    $.ajax({
        type: "GET",
        url: "/api/polls"
    }).done(function(polls) {
        pollID = polls[0]._id;
        //getMessages();
        $.each(polls, function(key, poll) {
            var a = '<a href="/mypolls?id=' + poll._id + '" data-room-id="' + poll._id + '" class="room list-group-item">' + poll.question + '</a>';
            $("#rooms").append(a);
        });

    });


    $("#add-new-option").click(function() {
        var newOptName = $('#new-option').val();
        console.log(newOptName);
        $('#new-option').val('');
        $.ajax({
            type: "GET",
            url: "/api/addPollOption/" + pollID + "/" + newOptName
        }).done(function(data) {
            location.reload();
        })
    })

    $('#vote').click(function() {
        var optionName = $('input[name="optradio"]:checked').val();
        $.ajax({
            type: "GET",
            url: "/api/polls/" + pollID + "/" + optionName,

        }).done(function(data) {
            location.reload();

        })
    })

    var rows = [];
    var title = "";
    var pollID = getQueryVariable("id");
    $.ajax({
        type: "GET",
        url: "/getsinglepoll?id=" + pollID,
    }).done(function(data) {
        console.log(data);
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
        $("#delete").attr('href', 'admin/delete?id=' + pollID)
        $('#delete').show();
        $('#option-add').show();
        $('#buttons').show();
        google.charts.load('current', {
            'packages': ['corechart']
        });
        google.charts.setOnLoadCallback(drawChart);
        $('#showchart').show();

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

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i <
            vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    }
});
