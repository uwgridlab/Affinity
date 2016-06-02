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

     freqRangeTotal = math.range(0,numFreqs);
    //locsRangeSelect = [parseInt(channel_1), parseInt(channel_2)];

    // i believe we just want to select one channel in the 2 and 3rd dimension rather than a range, as the graph data is currently undirected . use parseInt to convert string to int

    locs_1 = math.range(parseInt(si),parseInt(si)+1);
     locs_2 = math.range(parseInt(ti),parseInt(ti)+1);
    data_temp = dataset;
     indexFreqR= math.index(freqRangeTotal,locs_1,locs_2,math.range(0,1));
     indexFreqI= math.index(freqRangeTotal,locs_1,locs_2,math.range(1,2));
     matrixR = dataset.subset(indexFreqR);
    matrixI = dataset.subset(indexFreqI);

    // if (typeNum == "AbsVal")
    subsetMatrix = math.sqrt(math.add(math.square(matrixR),math.square(matrixI)));

   // subsetMatrixFreqs = matrixData.subset(indexFreqs);
    freqValuesToPlot = math.squeeze(subsetMatrix.valueOf());

    // try and plot it!
    // set dataset to freqValuesToPlot for time being
    // squeeze it too!
    dataset = math.squeeze(freqValuesToPlot);

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
        .exit().transition()
        .duration(500)
        .attr("opacity", 0)
        .remove();

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
