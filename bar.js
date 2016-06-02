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

// define the tool tip

// from http://bl.ocks.org/Caged/6476579

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong>Connectivity </strong> <span style='color:red'>" + d + "</span>";
    });

// call the tip
svgbar.call(tip);


svgbar.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svgbar.append("g")
    .attr("class", "y axis")
    .call(yAxis);

var plotBars = function(dataset,si,ti){

    console.log(si);
    console.log(ti);
    var freqRangeTotal_b = math.range(0,numFreqs);
    //locsRangeSelect = [parseInt(channel_1), parseInt(channel_2)];

    // i believe we just want to select one channel in the 2 and 3rd dimension rather than a range, as the graph data is currently undirected . use parseInt to convert string to int

    // locs_1 = math.range(parseInt(si),parseInt(si)+1);
     // locs_2 = math.range(parseInt(ti),parseInt(ti)+1);
     si_t = parseInt(si)
     ti_t = parseInt(ti)
      indexFreqR_b= math.index(math.range(0,numFreqs),si_t,ti_t,0);
     indexFreqI_b= math.index(math.range(0,numFreqs),si_t,ti_t,1);
     matrixR_b = dataset.subset(indexFreqR_b);
    matrixI_b = dataset.subset(indexFreqI_b);

    // if (typeNum == "AbsVal")
    subsetMatrix_b = math.sqrt(math.add(math.square(matrixR_b),math.square(matrixI_b)));
    freqValuesToPlot_b = math.squeeze(subsetMatrix_b.valueOf());

    var dataset = [];                        //Initialize empty array
    for (var i = 0; i < 25; i++) {           //Loop 25 times
        var newNumber = Math.random() * 30;  //New random number (0-30)
        dataset.push(newNumber);             //Add new number to array
    }

    //freqValuesToPlot_b = dataset;

console.log(freqValuesToPlot_b);
    // try and plot it!
    // set dataset to freqValuesToPlot for time being
    // squeeze it too!

    x.domain(freqValuesToPlot_b.map(function(d,i) { return i; }));
    y.domain([0, d3.max(freqValuesToPlot_b)]);

    //Update X axis
    svgbar.select(".x.axis")
        .transition()
        .duration(1000)
        .call(xAxis);

    //Update Y axis
    svgbar.select(".y.axis")
        .transition()
        .duration(1000)
        .call(yAxis);

    var bars = svgbar.selectAll(".bar").data(freqValuesToPlot_b);
//from https://bl.ocks.org/RandomEtc/cff3610e7dd47bef2d01

    bars.exit()
        .transition()
        .duration(1000)
        .attr("y", y(0))
        .attr("height", height - y(0))
        .style('fill-opacity', 1e-6)
        .remove();

    bars
        .enter().append("rect")
        //make sure it's of class bar
        .attr("class", "bar")
        .transition()
        .duration(1000);


    bars.transition().duration(300)
        .attr("x", function(d,i) { return (x(i)); }).transition().duration(300)
        .attr("width", x.rangeBand()).transition().duration(300)
        .attr("y", function(d) { return y(d); })
        .attr("height", function(d) { return height - y(d); });

    bars
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);



};
