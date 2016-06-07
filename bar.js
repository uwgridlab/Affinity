// define bar graph

// Define bar visualization
var margin = {top: 40, right: 40, bottom: 60, left: 60},
    width = 800 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom,
    paddingx = 40;
    paddingy = 30;

var svgbar = d3.select("body").select("div.barchart").append("svg")
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
    .orient("bottom")
;

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// define the tool tip

// from http://bl.ocks.org/Caged/6476579

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        // fix the number of decimal points
        n = d.toFixed(3);
        return "<strong>Connectivity </strong> <span style='color:pink'>" + n + "</span>";
    });

// call the tip
svgbar.call(tip);


svgbar.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
		.selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });


svgbar.append("g")
    .attr("class", "y axis")
    .call(yAxis);


// append axis title - from https://bl.ocks.org/RandomEtc/cff3610e7dd47bef2d01 and http://bl.ocks.org/phoebebright/3061203
svgbar.append("g")
    .attr("class", "y axis")
    .append("text") // just for the title (ticks are automatic)
    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate("+ (paddingy/3) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
    .style("font-size", "14px")
    .text("Connectivity");

// append axis title

svgbar.append("g")
    .attr("class", "x axis")
    .append("text") // just for the title (ticks are automatic)
    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate("+ (width/2) +","+(height+paddingx+10)+")")  // centre below axis
    .style("font-size", "14px")
    .text("Frequency bins");

// add a title
var title = svgbar.append("g")
    .attr("class", "title")
    .append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px");
    // .style("text-decoration", "underline");

var plotBars = function(dataset,si,ti) {
// put a title on it
    if (directions_bar == true) {
        title
            .text("Click on a chord to plot a bar graph across frequencies");
    }
    else{
        title
            .text("Connectivity strengths across frequencies for Channels " + si + " and " + ti);
    }

    // change directionsbars to be false
    directions_bar = false;
    
    var indexFreqR_b= math.index(math.range(0,numFreqs),si,ti,0);
    var indexFreqI_b= math.index(math.range(0,numFreqs),si,ti,1);
    var matrixR_b = dataset.subset(indexFreqR_b);
    var matrixI_b = dataset.subset(indexFreqI_b);

    // if (typeNum == "AbsVal")
    var subsetMatrix_b = math.sqrt(math.add(math.square(matrixR_b),math.square(matrixI_b)));
    var freqValuesToPlot_b = math.squeeze(subsetMatrix_b.valueOf());

    //change xDom here to show 1-65 rather than 0-64 for frequencies
    xDom = freqValuesToPlot_b.map(function(d,i) { return i; });
    xDom = math.add(xDom,1);
    x.domain(xDom);
    y.domain([0, d3.max(freqValuesToPlot_b)]);

    //Update X axis
    svgbar.select(".x.axis")
        .call(xAxis)
        		.selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });

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
        // x(i+1) to start plotting at frequency 1 rather than frequency 0
        .attr("x", function(d,i) { return (x(i+1)); }).transition().duration(300)
        .attr("width", x.rangeBand()).transition().duration(300)
        .attr("y", function(d) { return y(d); })
        .attr("height", function(d) { return height - y(d); });

    bars
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);



};
