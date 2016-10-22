// define histogram
//inspired by http://bl.ocks.org/nnattawat/8916402

// Define histogram visualization
var margin = {top: 40, right: 40, bottom: 60, left: 60},
    width = 800 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom,
    paddingx = 40;
paddingy = 30;

//initialize histogram area
var svghist = d3.select("body").select("div.histogram").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var color = "steelblue";
// A formatter for counts.
var formatCount = d3.format(",.0f");


var plotHistInitialize = function(mean_freqs) {
    var size_data = math.size(mean_freqs);
    var index_1 = size_data[0];
    var index_2 = size_data[1];
    var k = 0;
    var stacked_freqs = [];
    for (i = 0; i < index_1; i++){
        for (j = 0; j < index_2; j++){
            stacked_freqs[k] = mean_freqs[i][j];
            k = k + 1;
        }
    }
    var values = stacked_freqs;
    var max = (d3.max(values));
    var min = (d3.min(values));
    var x = d3.scale.linear()
        .domain([min, max])
        .range([0, width]);
     data = d3.layout.histogram()
        .bins(x.ticks(20))
        (values);

    var yMax = d3.max(data, function(d){return d.length});
    var yMin = d3.min(data, function(d){return d.length});
    var colorScale = d3.scale.linear()
        .domain([yMin, yMax])
        .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

    var y = d3.scale.linear()
        .domain([0, yMax])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var bar = svghist.selectAll(".bar").data(data);

    bar.enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", (x(data[0].dx) - x(0)) - 1)
        .attr("height", function(d) { return height - y(d.y); })
        .attr("fill", function(d) { return colorScale(d.y) });

    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", -12)
        .attr("x", (x(data[0].dx) - x(0)) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.y); });

    bar.transition()
        .duration(1000)
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    bar.select("rect")
        .transition()
        .duration(1000)
        .attr("height", function(d) { return height - y(d.y); })
        .attr("fill", function(d) { return colorScale(d.y) });

    bar.select("text")
        .transition()
        .duration(1000)
        .text(function(d) { return formatCount(d.y); });

};

var plotHistUpdate = function(mean_freqs) {

    var size_data = math.size(mean_freqs);
    var index_1 = size_data[0];
    var index_2 = size_data[1];
    var k = 0;
    var stacked_freqs = [];
    for (i = 0; i < index_1; i++){
        for (j = 0; j < index_2; j++){
            stacked_freqs[k] = mean_freqs[i][j];
            k = k + 1;
        }
    }
    var values = stacked_freqs;
    var max = (d3.max(values));
    var min = (d3.min(values));
    var x = d3.scale.linear()
        .domain([min, max])
        .range([0, width]);
    data = d3.layout.histogram()
        .bins(x.ticks(20))
        (values);

    var yMax = d3.max(data, function(d){return d.length});
    var yMin = d3.min(data, function(d){return d.length});
    var colorScale = d3.scale.linear()
        .domain([yMin, yMax])
        .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

    var y = d3.scale.linear()
        .domain([0, yMax])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var bar = svghist.selectAll(".bar").data(data);

    bar.exit().remove();

    bar.transition()
        .duration(1000)
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    bar.select("rect")
        .transition()
        .duration(1000)
        .attr("height", function(d) { return height - y(d.y); })
        .attr("fill", function(d) { return colorScale(d.y) });

    bar.select("text")
        .transition()
        .duration(1000)
        .text(function(d) { return formatCount(d.y); });


};