// Starting with Mike Bostok's version @ https://bost.ocks.org/mike/uberdata/

var width = 1200,
    height = 1200,
    outerRadius = Math.min(width, height) / 2 - 10,
    innerRadius = outerRadius - 30;

var formatPercent = d3.format(".3%");

var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

var layout = d3.layout.chord()
    .padding(.04)
    .sortSubgroups(d3.descending)
    .sortChords(d3.ascending);

var path = d3.svg.chord()
    .radius(innerRadius);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("id", "circle")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.append("circle")
    .attr("r", outerRadius);

queue()
    .defer(d3.csv, "regions.csv")
    .defer(d3.json, "allfreqmean.json")
    .await(ready);

function ready(error, regions, allfreqmean) {
  if (error) throw error;

  layout.matrix(allfreqmean);

  var group = svg.selectAll(".group")
      .data(layout.groups)
    .enter().append("g")
      .attr("class", "group")
      .on("mouseover", mouseover);

  group.append("title").text(function(d, i) {
    return regions[i].name + ": " + formatPercent(d.value) + " of origins";
  });

  var groupPath = group.append("path")
      .attr("id", function(d, i) { return "group" + i; })
      .attr("d", arc)
      .style("fill", function(d, i) { return regions[i].color; });

  var groupText = group.append("text")
      .attr("x", 6)
      .attr("dy", 15);

  groupText.append("textPath")
      .attr("xlink:href", function(d, i) { return "#group" + i; })
      .text(function(d, i) { return regions[i].name; });

  /*
  groupText.filter(function(d, i) { return groupPath[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength(); })
      .remove();*/

  var chord = svg.selectAll(".chord")
      .data(layout.chords)
    .enter().append("path")
      .attr("class", "chord")
      .style("fill", function(d) { return regions[d.source.index].color; })
      .attr("d", path);

  chord.append("title").text(function(d) {
    return regions[d.source.index].name
        + " → " + regions[d.target.index].name
        + ": " + formatPercent(d.source.value)
        + "\n" + regions[d.target.index].name
        + " → " + regions[d.source.index].name
        + ": " + formatPercent(d.target.value);
  });

  function mouseover(d, i) {
    chord.classed("fade", function(p) {
      return p.source.index != i
          && p.target.index != i;
    });
  }
}
