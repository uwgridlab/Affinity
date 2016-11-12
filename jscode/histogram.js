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



var plotHistInitialize = function(mean_freqs,bin_size) {
    var size_data = math.size(mean_freqs);
    var index_1 = size_data[0];
    var index_2 = size_data[1];
    var k = 0;
    var stacked_freqs = [];
    for (i = 0; i < index_1; i++){
        for (j = 0; j < index_2; j++){
            // assuming upper triangular matrix of interest
            if (j>i) {
                stacked_freqs[k] = mean_freqs[i][j];
                k = k + 1;
            }
        }
    }
    var values = stacked_freqs;
    var max = (d3.max(values));
    var min = (d3.min(values));
    var x = d3.scale.linear()
        .domain([min, max])
        .range([0, width]);
     var data = d3.layout.histogram()
        .bins(bin_size)
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

    var barh = svghist.selectAll(".bar").data(data);

    barh.enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    barh.append("rect")
        .attr("x", 1)
        .attr("width", (x(data[0].dx) - x(0)) - 1)
        .attr("height", function(d) { return height - y(d.y); })
        .attr("fill", function(d) { return colorScale(d.y) });

    barh.append("text")
        .attr("dy", ".75em")
        .attr("y", -12)
        .attr("x", (x(data[0].dx) - x(0)) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.y); });

        svghist.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
///////////////
// from http://www.d3noob.org/2012/12/adding-axis-labels-to-d3js-graph.html
/*    svghist.append("text")
        .attr("transform", "translate(" + (width / 2 + 30) + " ," + (height + margin.bottom- 20 ) + ")")
        .style("text-anchor", "middle")
        .text("Connectivity Strength");

            // Add the text label for the Y axis
    svghist.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 30)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number");*/
//////////

/////////
// append axis title - from https://bl.ocks.org/RandomEtc/cff3610e7dd47bef2d01 and http://bl.ocks.org/phoebebright/3061203
svghist.append("g")
    .attr("class", "y axis")
    .append("text") // just for the title (ticks are automatic)
    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate("+ (paddingy/3 - 20) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
    .style("font-size", "14px")
    .text("Number");

// append axis title

svghist.append("g")
    .attr("class", "x axis")
    .append("text") // just for the title (ticks are automatic)
    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate("+ (width/2) +","+(height+paddingx)+")")  // centre below axis
    .style("font-size", "14px")
    .text("Connectivity Value");

// add a title
svghist.append("g")
    .attr("class", "title")
    .append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2) )
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
        .text("Histogram of Connectivity Strengths");




};

var plotHistUpdate = function(mean_freqs,bin_size) {
    var transitionDuration = 1000;
      var t = d3.transition()
      .duration(transitionDuration);
    var size_data = math.size(mean_freqs);
    var index_1 = size_data[0];
    var index_2 = size_data[1];
    var k = 0;
    var stacked_freqs = [];
    for (i = 0; i < index_1; i++){
        for (j = 0; j < index_2; j++){
            // assuming upper triangular matrix

            if (j>i) {
                stacked_freqs[k] = mean_freqs[i][j];
                k = k + 1;
            }
        }
    }
    var values = stacked_freqs;
    var max = (d3.max(values));
    var min = (d3.min(values));
    var x = d3.scale.linear()
        .domain([min, max])
        .range([0, width]);
    var data = d3.layout.histogram()
        .bins(bin_size)
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

// inspired by http://stackoverflow.com/questions/37534399/dynamically-changing-bins-and-height-of-a-d3-js-histogram

  svghist.selectAll(".bar").remove();

  var barh = svghist.selectAll(".bar").data(data)

  barh
    .enter().append("g")
    .transition().duration(1000)
    .attr("class","bar")
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });


    barh.append("rect")
        .transition().duration(2000)
        .attr("x", 1)
        .attr("width", (x(data[0].dx) - x(0)) - 1)
        .attr("height", function(d) { return height - y(d.y); })
        .attr("fill", function(d) { return colorScale(d.y) });



    barh.append("text")
        .transition().duration(2000)
        .attr("dy", ".75em")
        .attr("y", -12)
        .attr("x", (x(data[0].dx) - x(0)) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.y); });



};