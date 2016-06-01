// initialize global parameter values
var numFreqs, numLocs;
var matrixMeanArray, matrixAngleArray;
var regions_seq = [], regions_file;
// Define generic color scale
var colormap = d3.scale.linear();
var colormapangle = d3.scale.linear();
var colormode = "colorfile"

// update function for slider
var updateThreshSlide = function(thresh) {

    // adjust the text on the range slider
    // of note, it looksl ike thresh.value is a STRING, might need to be converted to a floating point for calculations 
    d3.select("#thresh-value").text(thresh);
    slideVal = parseFloat(thresh)
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
    var locsRange = math.range(0,numLocs);
    var indexR =  math.index(freqRange,locsRange,locsRange,math.range(0,1));
    var indexI =  math.index(freqRange,locsRange,locsRange,math.range(1,2));
    var matrixR = matrixData.subset(indexR);
    var matrixI = matrixData.subset(indexI);

    // if (typeNum == "AbsVal")
    var subsetMatrix = math.sqrt(math.add(math.square(matrixR),math.square(matrixI)));
    matrixMeanArray = math.squeeze(math.mean(subsetMatrix,0)).valueOf();
    
    if (typeNum = "Angle"){
        var subsetMatrixAngle = math.atan2(matrixI, matrixR);
        matrixAngleArray = math.squeeze(math.mean(subsetMatrixAngle,0)).valueOf();
    }

    if(showSelf == "NOshowSelf"){
        for (i = 0; i < 64; i++){
            matrixMeanArray[i][i] = 0;
        }
    }
    renderChord(regions_global, matrixMeanArray, colormode);
};

// read in data, using initial guys
var initializeRender = function(error, regions_in, allfreqmean, fulldata) {
    if (error) throw error;
    
    regions_file = regions_in;
    regions_global = regions_file;
    
    matrixMeanArray = allfreqmean;
    
    //parse the JSON with the math.js reviver
    a = JSON.parse(fulldata, math.json.reviver);

    // use math.js to make a matrix
    matrixData = math.matrix(a);
    sizeMatrix = matrixData.size();
    numFreqs = sizeMatrix[0];
    numLocs = sizeMatrix[1];

    // construct number sequence as labeling option
    for (var i = 0; i < numLocs; i++){
        regions_seq.push({
            color: "#ff0000",
            fullname: i,
            name: i
        });
    }
    
    // construct default color map
    colormap
        .domain(math.multiply(
            [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
            numLocs).valueOf())
        .range(["#FF5C63","#FF9958","#FFE155",
            "#D1FF51","#84FF4E","#4AFF61",
            "#47FFAE","#43FFFE","#40ACFF","#3D57FF","#D140FF"]);
    colormapangle
        .domain([-math.pi, 0, math.pi])
        .range(["lightred", "white", "lightblue"]);
    
    // update button on click
    d3.select("#rerender")
        .on("click", update);

    // update slider on input to slider
    d3.select("#thresh")
        .on("input", function() {
            updateThreshSlide(+this.value);
            threshChords(+this.value);
        });
    
    d3.select("#labelmode")
        .on("input", function() {
            labelRegion(this.value);
        });
    d3.select("#colormode")
        .on("input", function() {
            colormode = this.value;
            renderChord(regions_global, matrixMeanArray, colormode);
        });
        
    // Dynamic slider generation
    $(function() {
        $( "#freqslider" ).slider({
        range: true, min: 0, max: numFreqs, step: 1, values: [ 0, numFreqs ],
        slide: function( event, ui ) {
            $( "#freqrange" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] ); }
        });
        $( "#freqrange" ).val($( "#freqslider" ).slider( "values", 0 ) +
        " - " + $( "#freqslider" ).slider( "values", 1 ) );
    });
    
    renderChord(regions_global, matrixMeanArray, colormode);

    // buttonFreq
    //         .on("click",function(){
    //             channel_1 = d3.select("#chan1").node().value;
    //             channel_2 = d3.select("#chan2").node().value;

    //             updateFreqsPlot();
    //         });

}