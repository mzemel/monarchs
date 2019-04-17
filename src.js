$.getJSON("dataset.json", function(data) { render(data) });

var margin = { top: 20, left: 60, bottom: 40, right: 20 },
  width = window.innerWidth,
  height = window.innerHeight,
  lanePadding = 40,
  laneHeight = 20,
  countryIndex = 0;

// Details config
var detailsWidth = width / 2,
  detailsHeight = height / 4 * 3,
  detailsLineHeight = 20,
  detailsMargin = 5,
  detailsX = width / 4,
  detailsY = height / 8,
  detailsRx = 15,
  detailsRy = 15,
  detailsImageWidth = detailsWidth / 3,
  detailsImageHeight = detailsImageWidth,
  detailsImageY = detailsY + detailsHeight / 48,
  detailsImageX = detailsX + detailsWidth / 12,
  detailsNameY = detailsImageY + detailsImageHeight + detailsMargin + detailsLineHeight;

function render(data) {
  // Flatten all reigns into a single array to determine start and end
  var firstYear = d3.min(_.flatten(_.map(data, function(countryData, countryName) { return _.map(countryData, function(monarchData, monarchName) { return monarchData.start; }); })));
  var lastYear = d3.max(_.flatten(_.map(data, function(countryData, countryName) { return _.map(countryData, function(monarchData, monarchName) { return monarchData.end; }); })));

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
//    x: (width + margin.left + margin.right) / 2,
//    y: (height + margin.bottom + margin.top - detailsHeight) / 2,
    x: detailsX,
    y: detailsY,
    fill: "black",
    "fill-opacity": 0.1,
    rx: detailsRx,
    ry: detailsRy
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
    detail.selectAll("image").remove();
  }

  function renderDetails(el) {
    console.log(el);
    // Monarch
    detail.append("image").attr({
      x: detailsImageX,
      y: detailsImageY,
      width: detailsImageWidth,
      height: detailsImageHeight,
      "xlink:href": el.image,
      preserveAspectRatio: "none"
    })
    detail.append("text").attr({
      x: detailsImageX + detailsImageWidth / 2,
      y: detailsNameY,
      "text-anchor": "middle"
    }).text(el.name);

    // House
    detail.append("image").attr({
      x: detailsX + detailsWidth - detailsImageWidth - detailsWidth / 12,
      y: detailsImageY,
      width: detailsImageWidth,
      height: detailsImageHeight,
      "xlink:href": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Nicolas_Cage_2011_CC.jpg/220px-Nicolas_Cage_2011_CC.jpg",
      preserveAspectRatio: "none"
    })
    detail.append("text").attr({
      x: detailsX + detailsWidth - detailsImageWidth / 2 - detailsWidth / 12,
      y: detailsNameY,
      "text-anchor": "middle"
    }).text(el.house);

    // Reign
    detail.append("text").attr({
      x: detailsX + detailsWidth / 2,
      y: detailsNameY + detailsLineHeight,
      "text-anchor": "middle"
    }).text(el.start + "-" + el.end + " (" + el.endReason + ")");

    // Events
    _.map(el.events, function(event, idx) {
      detail.append("text").attr({
        x: detailsImageX,
        y: detailsNameY + detailsLineHeight * (3 + idx)
      }).text(event);
    })

    // Wars
    
    // Relationships
    var relationshipCount = el.relationships.length,
      relationshipContainerWidth = detailsWidth - detailsMargin * 2,
      relationshipMaxImageWidth = detailsImageWidth / 2,
      relationshipImageWidthCalculated = relationshipContainerWidth / relationshipCount / 1.5,
      relationshipImageWidth = Math.min(relationshipMaxImageWidth, relationshipImageWidthCalculated),
      relationshipImagePadding = relationshipImageWidth / 2,
      detailsMiddle = detailsX + detailsWidth / 2;

    // i: index
    // c: relationship count
    // m: middle of details overlay
    // W: relationship image width
    // x(i, c) = m - (c - 1) * 0.75W + i * 1.5W - 0.5W
    _.map(el.relationships, function(rel, idx) {
      detail.append("image").attr({
        x: detailsMiddle - (relationshipCount - 1) * 0.75 * relationshipImageWidth + idx * 1.5 * relationshipImageWidth - 0.5 * relationshipImageWidth,
        y: detailsY + detailsHeight - detailsMargin - relationshipImageWidth,
        width: relationshipImageWidth,
        height: relationshipImageWidth,
        "xlink:href": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Nicolas_Cage_2011_CC.jpg/220px-Nicolas_Cage_2011_CC.jpg"
      })
    });
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
        width: function(el) { return (el.end - el.start) * pixelsPerYear - 1 }, // 1 px padding
        height: laneHeight,
        x: function(el) { return margin.left + (el.start - firstYear) * pixelsPerYear },
        y: height - margin.bottom - laneHeight * (countryIndex - 1) - lanePadding * countryIndex,
        fill: "blue",
        "fill-opacity": 0.5
      })
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", showDetail)
  });
};

//$(document).ready(function() { $('#England > rect:nth-child(1)').click(); });
