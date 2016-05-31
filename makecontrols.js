// initialize global parameter values
var numFreqs, numLocs;

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

// overall update function
var update = function() {
    // Regrab controls values
    var freqrange = d3.select("#freqrange").property("value").split(" - ");
    
    var f1 = freqrange[0],
        f2 = freqrange[1],
        typeNum = d3.select("#opts").node().value,
        showSelf = d3.select('#showSelf').node().value;
                
    freqRange = math.range(f1,f2);
    locsRange = math.range(0,numLocs);
    indexR =  math.index(freqRange,locsRange,locsRange,math.range(0,1));
    indexI =  math.index(freqRange,locsRange,locsRange,math.range(1,2));
    matrixR = matrixData.subset(indexR);
    matrixI = matrixData.subset(indexI);

    if (typeNum == "AbsVal")
        subsetMatrix = math.sqrt(math.add(math.square(matrixR),math.square(matrixI)));
    else if (typeNum = "Angle")
        subsetMatrix = math.add(math.atan2(matrixI, matrixR), 2*math.pi);

    matrixMean = math.squeeze(math.mean(subsetMatrix,0));
    matrixMeanArray = matrixMean.valueOf();

    if(showSelf == "NOshowSelf"){
        for (i = 0; i < 64; i++){
            matrixMeanArray[i][i] = 0;
        }
    }
    renderChord(regions_global, matrixMeanArray);
};

// read in data, using initial guys
d3.json("dataFULL.txt", function(data) {

    //parse the JSON with the math.js reviver
    a = JSON.parse(data, math.json.reviver);

    // use math.js to make a matrix
    matrixData = math.matrix(a);
    sizeMatrix = matrixData.size();
    numFreqs = sizeMatrix[0];
    numLocs = sizeMatrix[1];

    // update button on click
    d3.select("#option")
        .on("click", update);

    // update slider on input to slider
    d3.select("#thresh")
        .on("input", function() {
            updateSlide(+this.value);
            threshChords(+this.value);
        });

    // buttonFreq
    //         .on("click",function(){
    //             channel_1 = d3.select("#chan1").node().value;
    //             channel_2 = d3.select("#chan2").node().value;

    //             updateFreqsPlot();
    //         });

});
