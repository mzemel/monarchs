$.getJSON("index.json", function(data) { render(data) });

var margin = { top: 20, left: 60, bottom: 40, right: 20 },
  width = window.innerWidth,
  height = window.innerHeight,
  lanePadding = 40,
  laneHeight = 20,
  countryIndex = 0;

function handleMouseOver(el, i) {
  d3.select(this).attr({"fill-opacity": 1.0});
};

function handleMouseOut(el, i) {
  d3.select(this).attr({"fill-opacity": 0.5});
};

function showDetail(el, i) {
  d3.select(".timeline").attr({class: 'timeline inactive'});
  d3.select(".detail").attr({class: 'detail'})
//  renderDetails(el);
}

function hideDetail() {
  d3.select(".timeline").attr({class: 'timeline'});
  d3.select('.detail').attr({class: 'detail hidden'});
}

function renderDetails(el) {
  console.log(formatDetails(el));
  d3.select(".detail rect").selectAll("text")
    .data(formatDetails(el))
    .enter()
    .append("text")
    .text(function(el) { return el.key + ": " + el.value; });
}

function formatDetails(el) {
  var data = [];
  _.forEach(el, function(value, key) { return data.push({key: key, value: value}) });
  return data;
}

function render(data) {
  // Flatten all reigns into a single array to determine start and end
  var reigns = _.flatten(_.map(data, function(countryData, countryName) { return _.map(countryData, function(el) { return el.reign; }); }));

  var firstYear = d3.min(reigns, function(el) { return el.start }),
    lastYear = d3.max(reigns, function(el) { return el.end }),
    pixelsPerYear = (width - margin.left - margin.right) / (lastYear - firstYear);

  // Create SVG
  var svg = d3.select("body")
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
      width: width / 4,
      height: height / 4,
      class: 'detail '
    })
    .on("click", hideDetail)
    .append("rect").attr({
      width: 300,
      height: 300,
      x: (width + margin.left + margin.right) / 2,
      y: (height + margin.bottom + margin.top) / 2 - 200,
      fill: "black",
      "fill-opacity": 0.1,
    }).text("fuck");

  // Create X-axis
  var xScale = d3.scale.linear()
    .domain([firstYear, lastYear]) 
    .range([margin.left, width - margin.right])

  var xAxis = d3.svg.axis().scale(xScale);

  svg.append("g").attr({
    "class": "axis",
    transform: "translate(" + [0, height - margin.bottom] + ")"
  }).call(xAxis);

  // Create country timelines
  _.forEach(data, function(countryData, countryName) {
    countryIndex += 1;

    // Add legend
    svg.append("text").attr({
      x: 0,
      y: height - margin.bottom - laneHeight * (countryIndex - 1) - lanePadding * countryIndex
    }).text(countryName);

    // Add elements
    svg.append("g").attr({id: countryName})
      .selectAll("rect")
      .data(countryData)
      .enter()
      .append("rect")
      .attr({
        width: function(el) { return (el.reign.end - el.reign.start) * pixelsPerYear - 1 }, // 1 px padding
        height: laneHeight,
        x: function(el) { return margin.left + (el.reign.start - firstYear) * pixelsPerYear },
        y: height - margin.bottom - laneHeight * (countryIndex - 1) - lanePadding * countryIndex,
        fill: "blue",
        "fill-opacity": 0.5
      })
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", showDetail)
  });
};
