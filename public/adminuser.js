$(function() {
    var rows = [];
    $('#option-add').hide();
    $('#buttons').hide();
    $('#showchart').hide();
    var pollID;

    $('.main-content').show();
        $('.mypolls-div').hide();
    $.ajax({
        type: "GET",
        url: "/api/polls"
    }).done(function(polls) {
        pollID = polls[0]._id;
        $.each(polls, function(key, poll) {
            var a = '<a href="/admin/mypolls?id=' + poll._id + '" data-room-id="' + poll._id + '" class="room list-group-item">' + poll.question + '</a>';
            $("#rooms").append(a);
        });

    });
    $('#mypolls-id').click(function() {
        $("#mypolls").html(' ');
        $('.main-content').hide();
        $('.mypolls-div').show();
        $.ajax({
        type: "GET",
        url: "/api/my/polls"
    }).done(function(polls) {
        pollID = polls[0]._id;
        $.each(polls, function(key, poll) {
            var a = '<a href="/admin/mypolls?id=' + poll._id + '" data-room-id="' + poll._id + '" class="room list-group-item">' + poll.question + '</a>';
            a += '<a class="btn btn-danger" style="margin-bottom: 20px" href= "/admin/delete?id=' + poll._id + '">Delete</a><br>'
            $("#mypolls").append(a);
        });

    });
        
    })

    $("#add-new-option").click(function() {
        var pollID = getQueryVariable("id");
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
        var pollID = getQueryVariable("id");
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
        url: "/api/getsinglepoll?id=" + pollID,
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
