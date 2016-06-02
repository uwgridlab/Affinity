// define bar graph

// Define bar visualization
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svgbar = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var plotBars = function(dataset,si,ti){


    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");


    x.domain(dataset.map(function(d,i) { return i+1; }));
    y.domain([0, d3.max(dataset)]);

    svgbar.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svgbar.append("g")
        .attr("class", "y axis")
        .call(yAxis);


    var bars = svgbar.selectAll(".bar")
        .data(dataset);

    bars
        .transition()
        .duration(1000);

    bars
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d,i) { return (x(i)); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return d; })
        .attr("height", function(d) { return (height - d); });

};
