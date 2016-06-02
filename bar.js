// define bar graph

// Define bar visualization
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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

var data = [1,2,3,4,5];

x.domain(data.map(function(d,i) { return i; }));
y.domain([0, d3.max(data)]);

var svgbar = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svgbar.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svgbar.append("g")
    .attr("class", "y axis")
    .call(yAxis);

svgbar.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d,i) { return x(i); })
    .attr("width", x.rangeBand())
    .attr("y", function(d,i) { return y(i); })
    .attr("height", function(d,i) { return height - y(i); });


var plotBars = function(si,ti){



};