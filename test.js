var data = [
  {"id": "Richard III", "start": 0, "end": 20},
  {"id": "Henry V", "start": 20, "end": 30},
  {"id": "Charles II", "start": 30, "end": 70}
];

var margin = { top: 20, left: 20, bottom: 20, right: 20 },
  width = window.innerWidth,
  height = window.innerHeight;

// Create SVG
var svg = d3.select(".timeline")
  .append("svg")
  .attr({
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  })

// Create X-axis
var xScale = d3.scale.linear()
  .domain([0, d3.max(data, function(el) { return el.end })])
  .range([margin.left, width - margin.right])

var xAxis = d3.svg.axis().scale(xScale).orient("top");

svg.append("g").attr({
  "class": "axis",
  transform: "translate(" + [margin.left, height - margin.bottom] + ")"
}).call(xAxis);



// Add elements
svg.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("width", function(el) { return el.end - el.start })
  .attr("x", function(el) { return el.start })
  .attr("y", 30)
  .attr("color", "blue")
  .on("mouseover", handleMouseOver)
  .text(function(el) { return el.id })

function handleMouseOver(el, i) {
  $('.detail').text(el.id);
};
