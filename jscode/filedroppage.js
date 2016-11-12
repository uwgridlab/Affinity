// Tell FileDrop we can deal with iframe uploads using this URL:
// Attach FileDrop to an area ('zone' is an ID but you can also give a DOM node):
var zone = new FileDrop('filezone');

// Do something when a user chooses or drops a file:
zone.event('send', function (files) {
    // Depending on browser support files (FileList) might contain multiple items.
    files.each(function (file) {
        // React on successful AJAX upload:
        file.event('done', function (xhr) {
            // 'this' here points to fd.File instance that has triggered the event.
            alert('Done uploading ' + this.name + ', response:\n\n' + xhr.responseText);
        });
        file.readData(
            function(data_in) {
                // ran twice to remove the "" marks around the
                // text file contents twice. If no "" only run once
                var a = JSON.parse(JSON.parse(data_in), 
                                math.json.reviver);
                matrixData = math.matrix(a);
                sizeMatrix = matrixData.size();
                numFreqs = sizeMatrix[0];
                numLocs = sizeMatrix[1];


                // add in new upper and lower bounds

                // upper and lower bounds for slider from data
                upperBound = math.max(matrixData);
                lowerBound = math.min(matrixData);

                $(function() {
                    $( "#freqslider" ).slider({
                    range: true, min: 0, max: numFreqs, step: 1, values: [ 0, numFreqs ],
                    slide: function( event, ui ) {
                        $( "#freqrange" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] ); }
                    });
                    $( "#freqrange" ).val($( "#freqslider" ).slider( "values", 0 ) +
                    " - " + $( "#freqslider" ).slider( "values", 1 ) );
                });


                // prune slider
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

                genLabels();
                update();

                ////// 11-10-2016 - auto update histogram
                   

                       freqrange = d3.select("#freqrange").property("value").split(" - ");
    mapsignangle = d3.scale.linear();
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

     plotHistUpdate(matrixMeanArray,bin_size);

            },
            function(e) {alert('Error reading matrix file!')},
            'text'
            // function(data_uri) {
            //     d3.json(data_uri, function(d) {
            //         var a = JSON.parse(d, math.json.reviver);
            //         matrixData = math.matrix(a);
            //     });
            //     sizeMatrix = matrixData.size();
            //     numFreqs = sizeMatrix[0];
            //     numLocs = sizeMatrix[1];
            //     console.log(numFreqs);
            //     update();
            // },
            // function(e) {alert('Error reading matrix file!')},
            // 'uri'
        );
    });
});

// React on successful iframe fallback upload (this is separate mechanism
// from proper AJAX upload hence another handler):
zone.event('iframeDone', function (xhr) {
    alert('Done uploading via <iframe>, response:\n\n' + xhr.responseText);
});