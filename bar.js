// define bar graph

// Define chord visualization
var width = 960,
    height = 500;

var y = d3.scale.linear()
    .range([height, 0]);

var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height);

var data = [1,2,3,4,5];

var svgbar = d3.select("body").select("div.leftchart")
    .append("svg")
    .attr("width", widthbar)
    .attr("height", heightbar)
    .attr("id", "svgcirc")
    .append("g")
    .attr("id", "bar")
    .attr("transform", "translate(" + widthbar / 2 + "," + heightbar / 2 + ")");

var plotBars = function(si,ti){

    svgbar
        .data(data)
        .enter()
        .append


};