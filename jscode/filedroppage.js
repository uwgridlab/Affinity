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
                $(function() {
                    $( "#freqslider" ).slider({
                    range: true, min: 0, max: numFreqs, step: 1, values: [ 0, numFreqs ],
                    slide: function( event, ui ) {
                        $( "#freqrange" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] ); }
                    });
                    $( "#freqrange" ).val($( "#freqslider" ).slider( "values", 0 ) +
                    " - " + $( "#freqslider" ).slider( "values", 1 ) );
                });
                genLabels();
                update();
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