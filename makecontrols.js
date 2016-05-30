    // initialize values
    var f1 =  d3.select("#freq1").node().value;
    var f2 =  d3.select("#freq2").node().value;

    var typeNum = d3.select("#opts").node().value;
    var numsRange = math.range(0,1);
    var showSelf = d3.select('input[name="selfConn"]:checked').node().value;

    // define button
    var button = d3.select("#option");

    // define slide
    var slide = d3.select("#thresh");

    // define slider value
    var slideVal = parseFloat(slide.node().value)

    // define channels to plot
    // these are currently defined as strings 
    var channel_1 = d3.select("#chan1").node().value;
    var channel_2 = d3.select("#chan2").node().value;

    // define button to click to plot
    var buttonFreq = d3.select("#plotFreqs");

    // function to decide type
    var decideType = function() {
        if (typeNum == "Real"){
            numsRange = math.range(0,1);
        } else if (typeNum == "Imag") {
            numsRange =  math.range(1,2);

        } else if (typeNum == "AbsVal") {
            numsRange = math.range(0, 2)
        }


    };

    // function to calculate absolute value of data matrix
    var absValCalc = function(){
        indexR =  math.index(freqRange,locsRange,locsRange,math.range(0,1));
        indexI =  math.index(freqRange,locsRange,locsRange,math.range(1,2));
        subsetMatrix = math.sqrt(math.add(math.square(matrixData.subset(indexR)),math.square(matrixData.subset(indexI))));

    };
    // update function for slider

    var updateSlide = function(thresh) {

        // adjust the text on the range slider
        // of note, it looksl ike thresh.value is a STRING, might need to be converted to a floating point for calculations 
        d3.select("#thresh-value").text(thresh);
        d3.select("#thresh").property("value", thresh);

        // so redefine slideVal as float , redefine slide 
        slide = d3.select("#thresh");
        slideVal = parseFloat(slide.node().value)

    };

d3.select("thresh").on("input", function() {
        updateSlide(+this.value);
    });

    //function to update the frequency plot based off of two channels of interest
    var updateFreqsPlot = function () {

        freqRangeTotal = math.range(0,numFreqs);
        //locsRangeSelect = [parseInt(channel_1), parseInt(channel_2)];

        // i believe we just want to select one channel in the 2 and 3rd dimension rather than a range, as the graph data is currently undirected . use parseInt to convert string to int

        locs_1 = parseInt(channel_1);
        locs_2 = parseInt(channel_2);
        indexFreqs= math.index(freqRangeTotal,locs_1,locs_2,numsRange);

        subsetMatrixFreqs = matrixData.subset(indexFreqs);
        freqValuesToPlot = subsetMatrixFreqs.valueOf();

        // try and plot it! 
        // set dataset to freqValuesToPlot for time being
        // squeeze it too!
        dataset = math.squeeze(freqValuesToPlot);
        dataset = [1, 2, 3 ,4, 5]

        var xScale = d3.scale.ordinal()
                        .domain(d3.range(dataset.length))
                        .rangeRoundBands([0, w], 0.05);

            yScale = d3.scale.linear()
                            .domain([0, d3.max(dataset)])
                            .range([0, h]);

        //Select…
        bars = svg.selectAll("rect")
            .data(dataset);


        
        //Create bars
        bars.enter()
            .append("rect")
            .attr("x", w)
            .attr("y", function(d) {
                return h - yScale(d.value);
            })
            .attr("width", xScale.rangeBand())
            .attr("height", function(d) {
                return yScale(d.value);
            })
            .attr("fill", function(d) {
                return "rgb(0, 0, " + (d.value * 10) + ")";
            });

        //Update…
        bars.transition()
            .duration(500)
            .attr("x", function(d, i) {
                return xScale(i);
            })
            .attr("y", function(d) {
                return h - yScale(d.value);
            })
            .attr("width", xScale.rangeBand())
            .attr("height", function(d) {
                return yScale(d.value);
            });

        //Exit…
        bars.exit()
            .transition()
            .duration(500)
            .attr("x", -xScale.rangeBand())
            .remove();


    };

    // overall update function
    var update = function() {
        decideType();
        freqRange = math.range(f1,f2);
        locsRange = math.range(0,numLocs);
        index = math.index(freqRange,locsRange,locsRange,numsRange);

        subsetMatrix = matrixData.subset(index);
        if (typeNum == "AbsVal"){
            absValCalc()
        };
        matrixMean = math.squeeze(math.mean(subsetMatrix,0));

        matrixMeanArray = matrixMean.valueOf();

        if(showSelf == "NOshowSelf"){
            for (i = 0; i < 64; i++){
                matrixMeanArray[i][i] = 0;
            }
        }



    };




    //make the svg element for the bar graph 
    var w = 600;
    var h = 250;
            
     //Create SVG element
    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);


    // read in data, using initial guys
    d3.json("dataFULL.txt", function(data) {

        //parse the JSON with the math.js reviver

        a = JSON.parse(data, math.json.reviver);

        // use math.js to make a matrix
        matrixData = math.matrix(a);
        sizeMatrix = matrixData.size();
        numFreqs = sizeMatrix[0];
        numLocs = sizeMatrix[1];

        freqRange = math.range(f1,f2);
        locsRange = math.range(0,numLocs);

        decideType();

        index = math.index(freqRange,locsRange,locsRange,numsRange);

        subsetMatrix = matrixData.subset(index);


        // update button on click
        button
                .on("click", function() {
                    f1 = d3.select("#freq1").node().value;
                    f2 = d3.select("#freq2").node().value;
                    //channel = d3.select("#chan").node().value;
                    typeNum = d3.select("#opts").node().value;
                    showSelf = d3.select('input[name="selfConn"]:checked').node().value;

                    update();
                });

        // update slider on input to slider
        slide
                .on("input", function() {
                    updateSlide(+this.value);

                });

        buttonFreq
                .on("click",function(){
                    channel_1 = d3.select("#chan1").node().value;
                    channel_2 = d3.select("#chan2").node().value;

                    updateFreqsPlot();
                });



        update();
        updateSlide(0);

    });
