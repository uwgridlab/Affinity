// initialize global parameter values
var numFreqs, numLocs;
var matrixData, matrixMeanArray, matrixAngleArray;
var regions_seq = [], regions_file, regions_global;

var colormode = "colorseq";
var colormap = d3.scale.linear();
var colormapangle = d3.scale.linear();
var colormapsign = d3.scale.linear();
var colormapgrid = d3.scale.linear();

// upper and lower bounds
var upperBound, lowerBound;


// define variable to allow for temporary title demonstrating directions for bar graph
var directions_bar = true;


function handleClick(event){
                bin_size = (document.getElementById("myVal").value)
             bin_size = math.floor(bin_size) //necessary so it doesn't think it's a floating point??
                var freqrange = d3.select("#freqrange").property("value").split(" - ");
    var mapsignangle = d3.scale.linear();
        var freqrange = d3.select("#freqrange").property("value").split(" - ");

    mapsignangle
        .domain([-1, -2/3, -1/3,
            0, 1/3, 2/3, 1])
        .range([-math.pi, -math.pi*2/3, -math.pi/3,
            0, math.pi/3, math.pi*2/3, math.pi]);
    
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

    var subsetMatrix = math.sqrt(math.add(math.square(matrixR),math.square(matrixI)));
    var matrixMeanArray = math.squeeze(math.mean(subsetMatrix,0)).valueOf();
                plotHistUpdate(matrixMeanArray,bin_size)
                var handleClickOnce = true;
                return false;
            }


// overall update function
var update = function() {
    // Regrab controls values
    var freqrange = d3.select("#freqrange").property("value").split(" - ");
    var mapsignangle = d3.scale.linear();
    mapsignangle
        .domain([-1, -2/3, -1/3,
            0, 1/3, 2/3, 1])
        .range([-math.pi, -math.pi*2/3, -math.pi/3,
            0, math.pi/3, math.pi*2/3, math.pi]);
    
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

    if (typeNum == "Sign") {
        d3.select("#colorsign").property("disabled", false);
        d3.select("#colorblurb").attr("style", "display: none;");
        var subsetMatrix = math.abs(matrixR);
        matrixMeanArray = math.squeeze(math.mean(subsetMatrix,0)).valueOf();
        var subsetMatrixAngle = matrixI;
        matrixAngleArray = math.squeeze(math.mean(subsetMatrixAngle,0)).valueOf();
    }
    else {
        // if (typeNum == "AbsVal")
        var subsetMatrix = math.sqrt(math.add(math.square(matrixR),math.square(matrixI)));
        matrixMeanArray = math.squeeze(math.mean(subsetMatrix,0)).valueOf();

        if (typeNum == "Angle") {
            d3.select("#colorangle").property("disabled", false);
            d3.select("#colorblurb").attr("style", "display: none;");
            var subsetMatrixAngle = math.atan2(matrixI, matrixR);
            matrixAngleArray = math.squeeze(math.mean(subsetMatrixAngle,0)).valueOf();
        }
        else {
            d3.select("#colorblurb").attr("style", "color: red;");
            d3.select("#colorangle").property("disabled", true);
        }
    }

    if(showSelf == "NOshowSelf"){
        for (i = 0; i < numLocs; i++){
            matrixMeanArray[i][i] = 0;
        }
    }
    renderChord(regions_global, matrixMeanArray, colormode);

};

var genLabels = function() {
    // construct number sequence as labeling option
    regions_seq = [];
    for (var i = 0; i < numLocs; i++){
        regions_seq.push({
            color: colormap(i),
            fullname: i+1,
            name: i+1
        });
    }

    // Make grid similarity color map
    colormapgrid
        .domain(math.multiply(math.range(0, 64), (numLocs-1)/63).valueOf())
        .range(["#0084A6","#00778A","#006D71","#006861","#006350","#005E38",
            "#005800","#386200","#0083B4","#007393","#006370","#005955",
            "#005340","#004D1C","#2F5400","#4A5F00","#0082BF","#006D9A",
            "#005870","#00484A","#00452D","#1E4500","#415200","#565E00",
            "#0082CC","#006AA4","#004D74","#003644","#203B18","#3D4600",
            "#535300","#635E00","#0084DB","#0067B0","#003B79","#3B2548",
            "#633727","#6D3E00","#794D00","#845900","#0080E1","#004EAF",
            "#44007A","#730054","#960330","#9B1300","#A43300","#AB4400",
            "#006AD9","#3A00A6","#7F0084","#A30067","#C70057","#CA0045",
            "#CC0033","#CE0014","#0032CD","#7F00AE","#AE0091","#D0007C",
            "#F60075","#F8006A","#F90060","#FB0055"]);
            // L*a*b equal luminance
    
    regions_global = regions_seq;
}

// read in data, using initial guys
var initializeRender = function(error, regions_in, fulldata) {
    if (error) throw error;
    
    regions_file = regions_in;
    regions_global = regions_file;
    
    //parse the JSON with the math.js reviver
    var a = JSON.parse(fulldata, math.json.reviver);

    // use math.js to make a matrix
    matrixData = math.matrix(a);
    sizeMatrix = matrixData.size();
    numFreqs = sizeMatrix[0];
    numLocs = sizeMatrix[1];

    // upper and lower bounds for slider from data
    upperBound = math.max(matrixData);
    lowerBound = math.min(matrixData);

    // construct default color map
    colormap
        .domain(math.multiply(
            [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
            numLocs).valueOf())
        .range(["#EA2A00","#AA6D00","#557F00","#008D4B","#009A88",
            "#00A5CD","#0098E3","#007FDA","#7300BD","#DD008F","#F90054"]);
            // L*c*h equal luminance
    
    genLabels();

    colormapsign
        .domain([-1, -2/3, -1/3,
            0, 1/3, 2/3, 1])
        .range(["#2166ac", "#67a9cf", "#d1e5f0",
        "#f7f7f7", "#fddbc7", "#ef8a62", "#b2182b"]);
            // Colorbrewer 7-class diverging pallette

    colormapangle
        .domain([-math.pi, -math.pi*2/3, -math.pi/3,
            0, math.pi/3, math.pi*2/3, math.pi])
        .range(["#2166ac", "#67a9cf", "#d1e5f0",
        "#f7f7f7", "#fddbc7", "#ef8a62", "#b2182b"]);
            // Colorbrewer 7-class diverging pallette
        
    // update button on click
    d3.select("#rerender")
        .on("click", function() {
            update();
            
                freqrange = d3.select("#freqrange").property("value").split(" - ");
    mapsignangle = d3.scale.linear();
        freqrange = d3.select("#freqrange").property("value").split(" - ");

    mapsignangle
        .domain([-1, -2/3, -1/3,
            0, 1/3, 2/3, 1])
        .range([-math.pi, -math.pi*2/3, -math.pi/3,
            0, math.pi/3, math.pi*2/3, math.pi]);
    
    f1 = freqrange[0],
        f2 = freqrange[1],
        typeNum = d3.select("#opts").node().value,
        showSelf = d3.select('#showSelf').node().value;
                
    freqRange = math.range(f1,f2);
    locsRange = math.range(0,numLocs);
     indexR =  math.index(freqRange,locsRange,locsRange,math.range(0,1));
     indexI =  math.index(freqRange,locsRange,locsRange,math.range(1,2));
     matrixR = matrixData.subset(indexR);
     matrixI = matrixData.subset(indexI);

     subsetMatrix = math.sqrt(math.add(math.square(matrixR),math.square(matrixI)));
     matrixMeanArray = math.squeeze(math.mean(subsetMatrix,0)).valueOf();

/*
     if(handleClickOnce==true){
        var bin_size = (document.getElementById("myVal").value);
        var bin_size = math.floor(bin_size); //necessary so it doesn't think it's a floating point??
        console.log(bin_size)
     }
*/
                plotHistUpdate(matrixMeanArray,bin_size);

            }
        );

    d3.select("#labelmode")
        .on("input", function() {
            labelRegion(this.value);
        });
    d3.select("#colormode")
        .on("input", function() {
            colormode = this.value;
            renderChord(regions_global, matrixMeanArray, colormode);
        });

        /*
    d3.select("#myVal")
    .on("input", function(){
        bin_size = this.value
        plotHistUpdate(matrixMeanArray,bin_size)
    });
 */
        
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


    // Dynamic slider generation
    $(function() {
        $( "#pruneslider" ).slider({
            range: true, min: lowerBound, max: upperBound, step: 0.01, values: [ lowerBound, upperBound ],
            slide: function( event, ui ) {
                $( "#prunerange" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
                var prune= d3.select("#prunerange").property("value").split(" - ");
                threshChords(prune);

            }
        });
        $( "#prunerange" ).val($( "#pruneslider" ).slider( "values", 0 ) +
            " - " + $( "#pruneslider" ).slider( "values", 1 ) );
    });

    ///////////////////////////////

    var freqrange = d3.select("#freqrange").property("value").split(" - ");
    var mapsignangle = d3.scale.linear();
    mapsignangle
        .domain([-1, -2/3, -1/3,
            0, 1/3, 2/3, 1])
        .range([-math.pi, -math.pi*2/3, -math.pi/3,
            0, math.pi/3, math.pi*2/3, math.pi]);

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

    var subsetMatrix = math.sqrt(math.add(math.square(matrixR),math.square(matrixI)));
    var matrixMeanArray = math.squeeze(math.mean(subsetMatrix,0)).valueOf();

    bin_size = 15; 
    var handleClickOnce = false;
    plotHistInitialize(matrixMeanArray,bin_size);
    //////////////
    update();
    // renderChord(regions_global, matrixMeanArray, colormode);

    //temporary values to initialize bar
    var temp_bar = math.zeros(numFreqs,numLocs,numLocs,2);


    //plot bar
    plotBars(temp_bar, 0, 0);

    // buttonFreq
    //         .on("click",function(){
    //             channel_1 = d3.select("#chan1").node().value;
    //             channel_2 = d3.select("#chan2").node().value;

    //             updateFreqsPlot();
    //         });

};