$.getJSON("dataset.json", function(data) { render(data) });

var margin = { top: 20, left: 60, bottom: 40, right: 20 },
  width = window.innerWidth,
  height = window.innerHeight,
  lanePadding = 40,
  laneHeight = 20,
  countryIndex = 0;

// Details config
var detailsWidth = 300,
  detailsHeight = 300,
  detailsLineHeight = 20,
  detailsMarginLeft = 5

function render(data) {
  // Flatten all reigns into a single array to determine start and end
  var firstYear = d3.min(_.flatten(_.map(data, function(countryData, countryName) { return _.map(countryData, function(monarchData, monarchName) { return monarchData["Start"]; }); })));
  var lastYear = d3.max(_.flatten(_.map(data, function(countryData, countryName) { return _.map(countryData, function(monarchData, monarchName) { return monarchData["End"]; }); })));

  var pixelsPerYear = (width - margin.left - margin.right) / (lastYear - firstYear);

  // Create Timeline
  var timeline = d3.select("body")
    .append("svg")
    .attr({
      width: width,
      height: height,
      class: "timeline"
    })

  // Create detail box
  var detail = d3.select("body")
    .append("svg")
    .attr({
      width: width,
      height: height,
      class: 'detail hidden'
    })
    .on("click", hideDetail)

  detail.append("rect").attr({
    width: detailsWidth,
    height: detailsHeight,
    x: (width + margin.left + margin.right) / 2,
    y: (height + margin.bottom + margin.top - detailsHeight) / 2,
    fill: "black",
    "fill-opacity": 0.1,
  });

  // Create X-axis
  var xScale = d3.scale.linear()
    .domain([firstYear, lastYear]) 
    .range([margin.left, width - margin.right])

  var xAxis = d3.svg.axis().scale(xScale);

  timeline.append("g").attr({
    "class": "axis",
    transform: "translate(" + [0, height - margin.bottom] + ")"
  }).call(xAxis);

  function handleMouseOver(el, i) {
    d3.select(this).attr({"fill-opacity": 1.0});
  };

  function handleMouseOut(el, i) {
    d3.select(this).attr({"fill-opacity": 0.5});
  };

  function showDetail(el, i) {
    timeline.attr({class: 'timeline inactive'});
    detail.attr({class: 'detail'})
    renderDetails(el);
  }

  function hideDetail() {
    timeline.attr({class: 'timeline'});
    detail.attr({class: 'detail hidden'});
    detail.selectAll("text").remove();
  }

  function renderDetails(el) {
    var y = (height + margin.bottom + margin.top - detailsHeight) / 2
    detail.selectAll("text")
      .data(formatDetails(el))
      .enter()
      .append("text")
      .attr({
        x: (width + margin.left + margin.right) / 2 + detailsMarginLeft,
        y: function(el, i) { return  y + (i + 1) * detailsLineHeight; }
      })
      .text(function(el) { return el.key + ": " + el.value; });
  }

function formatDetails(el) {
  var data = [];
  _.forEach(el, function(value, key) { return data.push({key: key, value: value}) });
  return data;
}

  // Create country timelines
  _.forEach(data, function(countryData, countryName) {
    countryIndex += 1;

    // Add legend
    timeline.append("text").attr({
      x: 0,
      y: height - margin.bottom - laneHeight * (countryIndex - 1) - lanePadding * countryIndex
    }).text(countryName);

    // Add elements
    timeline.append("g").attr({id: countryName})
      .selectAll("rect")
      .data(_.map(countryData, function(monarchData, monarchName) { return monarchData; }))
      .enter()
      .append("rect")
      .attr({
        width: function(el) { console.log(el); return (el["End"] - el["Start"]) * pixelsPerYear - 1 }, // 1 px padding
        height: laneHeight,
        x: function(el) { return margin.left + (el["Start"] - firstYear) * pixelsPerYear },
        y: height - margin.bottom - laneHeight * (countryIndex - 1) - lanePadding * countryIndex,
        fill: "blue",
        "fill-opacity": 0.5
      })
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", showDetail)
  });
};
