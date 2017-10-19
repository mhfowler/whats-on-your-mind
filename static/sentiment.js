/* by hour */
function runSentimentByHour() {

    var margin = { top: 50, right: 50, bottom: 85, left: 0 },
        width = 960 - margin.left - margin.right,
        height = 430 - margin.top - margin.bottom,
        gridSize = Math.floor(width / 24),
        legendElementWidth = gridSize * 2.4,
        buckets = 10,
        colors = ["#FFFFe9", "#ffffb9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
        days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12a"];

    var minLen = -2;
    var increment = 2;

    var i = 0;

    function getSentimentByHourData() {
        var u_pin = getUserPin();
        $.ajax({
            url: "/ajax/",
            type: "POST",
            data: {action: "getSentimentByHourData", user_pin: u_pin}
        }).done(byHourDoneFunction);
    }

    getSentimentByHourData();

    function byHourDoneFunction(data) {
        var by_hour_data = d3.tsv.parse(data, function(d) {
            if (i == 0)
                minLen = parseFloat(d.value);
            else if (i == 1)
                increment = parseFloat(d.value);
            else {
                return {
                    day: +d.day,
                    hour: +d.hour,
                    value: +d.value
                }
            }
            console.log(minLen);
            i ++;
        });

        function plotByHourData(data) {
            var colorScale = d3.scale.quantile()
                .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
                .range(colors);

            var svg = d3.select("#chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", 360)
                .append("g")
                .attr("transform", "translate(" + 20 + "," + 20 + ")");


            var dayLabels = svg.selectAll(".dayLabel")
                .data(days)
                .enter().append("text")
                .text(function (d) { return d; })
                .attr("x", 0)
                .attr("y", function (d, i) { return i * gridSize; })
                .style("text-anchor", "end")
                .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
                .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

            var timeLabels = svg.selectAll(".timeLabel")
                .data(times)
                .enter().append("text")
                .text(function(d) { return d; })
                .attr("x", function(d, i) { return i * gridSize; })
                .attr("y", 0)
                .style("text-anchor", "middle")
                .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

            var heatMap = svg.selectAll(".hour")
                .data(data)
                .enter().append("rect")
                .attr("x", function(d) { return (d.hour - 1) * gridSize; })
                .attr("y", function(d) { return (d.day - 1) * gridSize; })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("class", "hour bordered")
                .attr("width", gridSize)
                .attr("height", gridSize)
                .style("fill", colors[0]);

            heatMap.transition().duration(1000)
                .style("fill", function(d) { return colorScale(d.value); });

            heatMap.append("title").text(function(d) { return d.value; });

            var legend = svg.selectAll(".legend")
                .data([0].concat(colorScale.quantiles()), function(d) { return d; })
                .enter().append("g")
                .attr("class", "legend");

            legend.append("rect")
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height)
                .attr("width", legendElementWidth)
                .attr("height", gridSize / 2)
                .style("fill", function(d, i) { return colors[i]; });

            legend.append("text")
                .attr("class", "mono")
                .text(function(d, i) { return ">= " + Math.round((minLen + increment * i) * 10) / 10; })
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height + gridSize);
        }

        // plot it
        plotByHourData(by_hour_data);
    }
}

/* by person */
function runSentimentByPerson() {
    function getSentimentByPersonData() {
        var u_pin = getUserPin();
        $.ajax({
            url: "/ajax/",
            type: "POST",
            data: {action: "getSentimentByPersonData", user_pin: u_pin}
        }).done(byPersonDoneFunction);
    }
    function byPersonDoneFunction(data) {
        var list = $(document.createElement('ul'));
        list.attr("id", "myList")
        $(data.split("\n")).each(function(i, entry) {
            if (entry.length > 0) {
                var listItem = $(document.createElement('li'));
                listItem.text(i + 1 + ". " + entry);
                list.append(listItem);

                if (i >= 10)
                    listItem.hide();
            }
        });
        $("#min_sent_by_person").append(list);

        $('#min_sent_by_person').append('<input type="button" id="showAll" value="Show All">');
        $('#showAll').click(function(){

            if ($("#showAll").attr("value") == "Show All") {
                $("#showAll").attr("value", "Show Fewer");
                $('#myList li').show();

            }
            else {
                $("#showAll").attr("value", "Show All");
                $('#myList li').hide();

                $('#myList li:lt(10)').show();

            }
        });
    }

    // run it
    getSentimentByPersonData();
}


$(document).ready(function() {
    runSentimentByPerson();
    runSentimentByHour();
});