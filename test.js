var data = [
  {"id": "Richard III", "start": 0, "end": 20},
  {"id": "Henry V", "start": 20, "end": 30},
  {"id": "Charles II", "start": 30, "end": 70}
];

var margin = { top: 20, left: 20, bottom: 40, right: 20 },
  width = window.innerWidth,
  height = window.innerHeight,
  lanePadding = 40,
  laneHeight = 20,
  pixelsPerYear = 5;

// Create SVG
var svg = d3.select(".timeline")
  .append("svg")
  .attr({
    width: width,
    height: height
  })

// Create X-axis
var xScale = d3.scale.linear()
  .domain([0, d3.max(data, function(el) { return el.end })])
  .range([margin.left, width - margin.right])

var xAxis = d3.svg.axis().scale(xScale);

svg.append("g").attr({
  "class": "axis",
  transform: "translate(" + [0, height - margin.bottom] + ")"
}).call(xAxis);


// Add elements
svg.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr({
    width: function(el) { return (el.end - el.start) * pixelsPerYear },
    height: laneHeight,
    x: function(el) { return margin.left + el.start * pixelsPerYear },
    y: height - margin.bottom - lanePadding,
    fill: "blue",
    "fill-opacity": 0.5
  })
  .on("mouseover", handleMouseOver)
  .on("mouseout", handleMouseOut)
  .text(function(el) { return el.id })

function handleMouseOver(el, i) {
  d3.select(this).attr({"fill-opacity": 1.0});
  $('.detail').text(el.id);
};

function handleMouseOut(el, i) {
  d3.select(this).attr({"fill-opacity": 0.5});
};
