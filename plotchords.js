// Merge Mike Bostok's version @ http://bl.ocks.org/mbostock/1046712 

var width = 1000,
    height = 1000,
    outerRadius = Math.min(width, height) / 2 - 100,
    innerRadius = outerRadius - 30;

var formatPercent = d3.format(".3%");

//var createChord = function() {

    var chordlayout = d3.layout.chord()
        .padding(.04)
        .sortSubgroups(d3.descending)
        .sortChords(d3.ascending);

    // initialize visualization area
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("id", "circle")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // transparent circle to capture mouse events
    svg.append("circle")
        .attr("r", outerRadius);
//}

d3_queue.queue()
    .defer(d3.csv, "regions.csv")
    .defer(d3.json, "allfreqmean.json")
    .await(ready);

function ready(error, regions, allfreqmean) {
  if (error) throw error;

  chordlayout.matrix(allfreqmean);

  // Region class define
  var region = svg.selectAll(".region")
      .data(chordlayout.groups)
    .enter().append("g")
      .attr("class", "region")
      .on("mouseover", mouseover);

  // Region mouseover
  region.append("title").text(function(d, i) {
    return regions[i].fullname + ": " + formatPercent(d.value) + " of origins";
  });

  // Region labeling
  var regionText = region.append("text")
      .each(function(d) { d.angle = (d.startAngle + d.endAngle)/2; })
//      .attr("x", 8)
      .attr("dy", ".35em")
      .attr("transform", function(d) {
          return "rotate(" + (d.angle*180 / Math.PI-90) + ")"
          + "translate(" + (outerRadius+5) + ")"
          + (d.angle > Math.PI ? "rotate(180)" : "");
      })
      .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
      .text(function(d, i) { return regions[i].name; });

  // Region draw
  var regionPath = region.append("path")
      .attr("id", function(d, i) { return "region" + i; })
      .attr("d", d3.svg.arc()
              .innerRadius(innerRadius).outerRadius(outerRadius))
      .style("fill", function(d, i) { return regions[i].color; });
      //.style("stroke") // if needed

  /*
  groupText.filter(function(d, i) { return groupPath[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength(); })
      .remove();*/

  // Pair chord drawing
  var chord = svg.selectAll(".chord")
      .data(chordlayout.chords)
    .enter().append("path")
      .attr("class", "chord")
      .style("fill", function(d) { return regions[d.source.index].color; })
      .attr("d", d3.svg.chord()
              .radius(innerRadius));

  // Pair chord mouseover
  chord.append("title").text(function(d) {
    return regions[d.source.index].name
        + " → " + regions[d.target.index].name
        + ": " + formatPercent(d.source.value)
        + "\n" + regions[d.target.index].name
        + " → " + regions[d.source.index].name
        + ": " + formatPercent(d.target.value);
  });

  // Pair chord fade nonhighlight
  function mouseover(d, i) {
    chord.classed("fade", function(p) {
      return p.source.index != i
          && p.target.index != i;
    });
  }
}
