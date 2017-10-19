function visualizeCategoriesData() {

    var avgdata = $(".avgdata").data("json");
    var persondata = $(".persondata").data("json");

    var width = 960,
        height = 500,
        radius = Math.min(width, height) / 2,
        legend_size = 10;

    var color = d3.scale.category20();

    var pie = d3.layout.pie()
        .value(function(d) { return d.frequency; })
        .sort(null);

    var arc = d3.svg.arc()
        .innerRadius(radius - 100)
        .outerRadius(radius - 20);

    var svg = d3.select("#avgPie").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + 250 + "," + height / 2 + ")");

    var path = svg.datum(avgdata).selectAll("path")
        .data(pie)
        .enter().append("path")
        .attr("fill", function(d, i) { return color(i); })
        .attr("d", arc);

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", 100)
        .attr("width", 100)
        .attr("transform", "translate(" + -30 + "," + -50 + ")");

    legend.selectAll('rect')
        .data(avgdata)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", function(d, i){ return i*legend_size+i*5;})
        .attr("width", legend_size)
        .attr("height", legend_size)
        .attr("fill", function(d, i) { return color(i); });

    legend.selectAll('text')
        .data(avgdata)
        .enter()
        .append("text")
        .attr("x", legend_size+5)
        .attr("y", function(d, i){ return i*legend_size+9+i*5;})
        .attr("fill", function(d, i) { return color(i); })
        .text(function(d) {
            return d.category;
        });

    // PERSON DATA STUFF

    var options = $("#options");
    $.each(persondata, function() {
        options.append($("<option />").val(this.person).text(this.person));
    });

    $("#options").change(function() {
        var data = []
        var person = $(this).val();
        if (person == "----------") {
            $("#perPersonPie").empty();
            $("#person").empty();
            return;
        }
        for (var x in persondata) {
            if (persondata[x].person == person) {
                data = persondata[x].categories;
                break;
            }
        }
        $("#person").text(person);
        $("#perPersonPie").empty();
        var svg = d3.select("#perPersonPie").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + 250 + "," + height / 2 + ")");

        var path = svg.datum(data).selectAll("path")
            .data(pie)
            .enter().append("path")
            .attr("fill", function(d, i) { return color(i); })
            .attr("d", arc);

        var legend = svg.append("g")
            .attr("class", "legend")
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", 100)
            .attr("width", 100)
            .attr("transform", "translate(" + -30 + "," + -50 + ")");

        legend.selectAll('rect')
            .data(data)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", function(d, i){ return i*legend_size+i*5;})
            .attr("width", legend_size)
            .attr("height", legend_size)
            .attr("fill", function(d, i) { return color(i); });

        legend.selectAll('text')
            .data(data)
            .enter()
            .append("text")
            .attr("x", legend_size+5)
            .attr("y", function(d, i){ return i*legend_size+9+i*5;})
            .attr("fill", function(d, i) { return color(i); })
            .text(function(d) {
                return d.category;
            });

    });
}

$(document).ready(function() {
    visualizeCategoriesData();
});