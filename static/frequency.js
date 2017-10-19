
$(document).ready(function() {

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function updateAbnormalRatio(word) {
        var u_pin = getUserPin();
        $.ajax({
            url: "/ajax/",
            type: "POST",
            data: {action: "getAbnormalRatio", user_pin: u_pin, word:word}
        }).done(function(data) {
            $(".abnormal_output").html(data.freq);
        });
    }
    // click to engage
    $(".word_freq_calculate").click(function(e) {
        e.preventDefault();
        var the_word = $(".the_word").val();
        updateAbnormalRatio(the_word);
        getAndPlotWordFrequency(the_word);
    });

    $(".word_freq_clear").click(function(e) {
        e.preventDefault();
        clearLineGraph();
    });


    // stuff for line graph
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var parseDate = function(date_string) {
        var splitted = date_string.split("|");
        if (splitted.length == 2) {
            return d3.time.format("%m|%Y").parse(date_string);
        }
        else {
            return d3.time.format("%d|%m|%Y").parse(date_string);
        }
    };

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .interpolate("bundle")
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.freq); });

    var svg = "";
    var lines = [];
    var colors = [];

    function initLineGraph() {
        svg = d3.select(".main-container").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")

        svg.append("g")
                .attr("class", "y axis")
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end");
    }
    initLineGraph();

    function clearLineGraph() {
        $("path.line").remove();
        colors = [];
        lines = [];
    }

    function getAndPlotWordFrequency(word) {

        var u_pin = getUserPin();
        $.ajax({
            url: "/ajax/",
            type: "POST",
            data: {action: "getWordFreqDataByTime", user_pin: u_pin, word:word}
        }).done(plotWordFrequency);

        function plotWordFrequency(data) {

            data.forEach(function(d) {
                d.date = parseDate(d.date);
                d.freq = +d.freq;
            });

            x.domain(d3.extent(data, function(d) { return d.date; }));
            y.domain(d3.extent(data, function(d) { return d.freq; }));

            lines.push(data);
            colors.push(getRandomColor());

            svg.select("g.x.axis").call(xAxis);
            svg.select("g.y.axis").call(yAxis);

            $("path.line").remove();

            lines.forEach(function(e,i,a) {
               svg.append("path")
                .datum(e)
                .attr("class", "line")
                .attr("d", line)
                .attr("stroke", colors[i]);
            });

        }
    }
});