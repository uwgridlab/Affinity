// Define chord visualization
var widthcircle = 680,
    heightcircle = 680,
    outerRadius = Math.min(widthcircle, heightcircle) / 2 - 60,
    innerRadius = outerRadius - 30;

// Define arc & chord path
var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);
var cpath = d3.svg.chord()
    .radius(innerRadius);

// Define vanilla layout
var generatelayout = function() {
    return d3.layout.chord()
        .padding(.04)
        .sortSubgroups(d3.descending)
        .sortChords(d3.ascending);
}
var chordlayout, layout_old;
var formatPrecision = d3.format(".3f");

// Initialize chord visualization area
var svgcircle = d3.select("body").select("div.circlechart")
    .append("svg")
    .attr("width", widthcircle)
    .attr("height", heightcircle)
    .attr("id", "svgcirc")
    .append("g")
    .attr("id", "circle")
    .attr("transform", "translate(" + widthcircle / 2 + "," + heightcircle / 2 + ")");

    // transparent circle to capture mouse events
    svgcircle.append("circle")
        .attr("r", outerRadius);

// Create and Update function
var renderChord = function(regions, allfreqmean, colormode) {

  chordlayout = generatelayout();
  chordlayout.matrix(allfreqmean);
  
  // Neural regions define
  region = svgcircle.selectAll(".region")
      .data(chordlayout.groups(),
              function(d) {return d.index;}); // disambiguate

  // Enter if any
  var newregions = region
      .enter().append("g")
      .attr("class", "region")

  // Exit if any
  region.exit()
      .transition()
      .duration(500)
      .attr("opacity", 0)
      .remove();

  // ----MOUSEOVERS----
  // Add new mouseovers
  newregions.append("title");
  // Update all mouseovers
  region.select("title").text(function(d, i) {
    return regions[i].fullname + ": " + formatPrecision(d.value) + " sum of mean";
  });

  // ----REGION ARCS----
  // Add new arcs
  newregions.append("path")
      .attr("id", function(d) { return "region" + d.index; });
  // Update all arcs
  region.select("path")
      .style("fill", function(d) {
          if (colormode == "colorfile")
            return regions[d.index].color;
          else if (colormode == "colorseq")
            return colormap(d.index);
          else if (colormode == "colorgrid")
            return colormapgrid(d.index);
          else if (colormode == "colorangle")
            return colormap(d.index);
          else if (colormode == "colorsign")
            return regions[d.index].color;
        })
      .transition().duration(500)
      .attrTween("d", arcTween(layout_old));
      //.style("stroke") // if needed

  // ----REGION LABELS----
  // Add new labels
  newregions.append("text")
      .attr("xlink:href", function(d) { return "#region" + d.index; })
      .attr("dy", ".35em");
  // Update all region labeling
  region.select("text")
//      .transition().duration(500)
      .attr("transform", function(d) {
          d.angle = (d.startAngle + d.endAngle)/2;
          return "rotate(" + (d.angle*180 / Math.PI-90) + ")"
          + "translate(" + (outerRadius+5) + ")"
          + (d.angle > Math.PI ? "rotate(180)" : "");
      })
      .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : "start"; })
      .text(function(d) { return regions[d.index].name; });

  // ----PAIRED CHORDS----
  // Update chord binding definitions
  var chord = svgcircle.selectAll(".chord")
      .data(chordlayout.chords(), chordKey);

  // Enter, if any
  // Add new chords if any
  var newchords = chord
      .enter().append("path")
      .attr("opacity", 0)
      .attr("class", "chord");
  // Add captions to new
  newchords.append("title");

  // Exit, if any
  chord.exit().transition()
      .duration(500)
      .attr("opacity", 0)
      .remove();

  // Update all chords
  chord
      .style("fill", function(d) {
                    if (colormode == "colorfile")
                        return regions[d.source.index].color;
                    else if (colormode == "colorseq")
                        return colormap(d.source.index);
                    else if (colormode == "colorgrid")
                        return colormapgrid(d.source.index);
                    else if (colormode == "colorangle")
                        return colormapangle(matrixAngleArray[d.source.index][d.target.index]);                        
                    else if (colormode == "colorsign")
                        return colormapsign(matrixAngleArray[d.source.index][d.target.index]);                        
                    })
      .transition().duration(500)
      .attr("opacity", 1)
      .attrTween("d", chordTween(layout_old));

  // Pair chord mouseover
  chord.select("title").text(function(d) {
  //    if (regions[d.source.index].name !== regions[d.target.index].name) {
          return regions[d.source.index].name
      + " → " + regions[d.target.index].name
      + ": " + formatPrecision(d.source.value)
      + "\n" + regions[d.target.index].name
      + " → " + regions[d.source.index].name
      + ": " + formatPrecision(d.target.value);
   //   }
  });

    // add on click
    chord
        .on("click", function(d){
            plotBars(matrixData,d.source.index,d.target.index)
        });

  // Pair chord fade nonhighlight
  region.on("mouseover", mouseover);
  function mouseover(d, i) {
    chord.classed("fade", function(p) {
      return p.source.index != i
          && p.target.index != i;
    });
  }

  layout_old = chordlayout;
}

// threshold chords from lo and hi value from the dynamic slider
var threshChords = function(threshslide) {
    var threshvalLo = threshslide[0]
    var threshvalHi = threshslide[1]

    // PRUNE METHOD
    var matrixprune =
        matrixMeanArray.map(function(d) {
            return d.map(function(e) {
                return (e >= threshvalLo & e <= threshvalHi) ? e : 0;

            })
        });
    renderChord(regions_global, matrixprune, colormode);

    /*
//   FADE METHOD: preserve as feature maybe
  chord = svgcircle.selectAll(".chord")
      .data(chordlayout.chords(), chordKey)
      .attr("opacity", function(d) {
          if (d.source.value < threshval)
            return 0;
          else
            return 1;
      });*/
}

var labelRegion = function(labelmode) {
    if (labelmode == "labelseq")
        regions_global = regions_seq;
    else if (labelmode == "labelfile")
        regions_global = regions_file;
    renderChord(regions_global, matrixMeanArray, colormode);
}

// JSCompress of element-disambiguating tween functions
// Modified from https://jsfiddle.net/KjrGF/12/
function chordKey(e){return e.source.index<e.target.index?e.source.index+"-"+e.target.index:e.target.index+"-"+e.source.index}
function arcTween(e){var r={};return e&&e.groups().forEach(function(e){r[e.index]=e}),function(e,t){var n,a=r[e.index];if(a)n=d3.interpolate(a,e);else{var o={startAngle:e.startAngle,endAngle:e.startAngle};n=d3.interpolate(o,e)}return function(e){return arc(n(e))}}}
function chordTween(e){var r={};return e&&e.chords().forEach(function(e){r[chordKey(e)]=e}),function(e,t){var n,a=r[chordKey(e)];if(a)e.source.index!=a.source.index&&(a={source:a.target,target:a.source}),n=d3.interpolate(a,e);else{var o={source:{startAngle:e.source.startAngle,endAngle:e.source.startAngle},target:{startAngle:e.target.startAngle,endAngle:e.target.startAngle}};n=d3.interpolate(o,e)}return function(e){return cpath(n(e))}}}
