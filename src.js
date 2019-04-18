$.getJSON("dataset.json", function(data) { render(data) });

var margin = { top: 20, left: 60, bottom: 40, right: 20 },
  width = window.innerWidth,
  height = window.innerHeight,
  lanePadding = 40,
  laneHeight = 20,
  countryIndex = 0;

// Details config
var detailsHeight = height / 4 * 3,
  detailsWidth = detailsHeight * 2 / 3,
  detailsMargin = detailsHeight / 48,
  detailsHeightInterval = (detailsHeight - 2 * detailsMargin) / 7,
  detailsWidthInterval = (detailsWidth - 2 * detailsMargin) / 12,
  detailsLineHeight = detailsHeightInterval / 4,
  detailsX = (width - detailsWidth) / 2,
  detailsY = (height - detailsHeight) / 2,
  detailsMiddle = detailsX + detailsWidth / 2,
  detailsRx = 15,
  detailsRy = 15,
  detailsImageHeight = detailsHeightInterval * 2,
  detailsImageWidth = detailsImageHeight,
  detailsImageX = detailsX + detailsWidthInterval,
  detailsImageY  = detailsY + detailsMargin,
  detailsNameY   = detailsY + 2 * detailsHeightInterval + detailsMargin,
  detailsEventsY = detailsY + 3 * detailsHeightInterval + detailsMargin,
  detailsWarsY   = detailsY + 4 * detailsHeightInterval + detailsMargin;

var detailsOpen = false; // yay global state variables

function render(data) {
  // Flatten all reigns into a single array to determine start and end
  var firstYear = d3.min(_.flatten(_.map(data, function(countryData, countryName) { return _.map(countryData, function(monarchData, monarchName) { return monarchData.start; }); })));
  var lastYear = d3.max(_.flatten(_.map(data, function(countryData, countryName) { return _.map(countryData, function(monarchData, monarchName) { return monarchData.end; }); })));

  var pixelsPerYear = (width - margin.left - margin.right) / (lastYear - firstYear);

  // Create Timeline
  var timeline = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "timeline")

  var detail = timeline.append("rect")
    .attr("width", 0)
    .attr("height", 0)
    .attr("x", width / 2)
    .attr("y", height / 2)
    .attr("fill", "gainsboro")
    .attr("rx", detailsRx)
    .attr("ry", detailsRy)
    .on("click", hideDetail)


  // Create X-axis
  var xScale = d3.time.scale()
    .domain([firstYear, lastYear]) 
    .range([margin.left, width - margin.right])

  var xAxis = d3.svg.axis().scale(xScale).tickFormat(d3.format("d"));

  timeline.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
    .call(xAxis);

  function handleMouseOver(el, i) {
    if (detailsOpen) return false

    var $this = $(this),
      $x = parseFloat($this.attr('x')),
      $y = parseFloat($this.attr('y')),
      $width = $this.width(),
      $height = $this.height();
    
    enlargeBlock.bind(d3.select(this))(this);

    var thumbnailImageWidth = width / 8;

    timeline.append("image")
      .attr("x", $x + $width / 2)
      .attr("y", $y + laneHeight / 2)
      .transition()
      .attr("x", $x + $width / 2 - thumbnailImageWidth / 2)
      .attr("y", $y - thumbnailImageWidth - detailsLineHeight)
      .attr("width", thumbnailImageWidth)
      .attr("height", thumbnailImageWidth)
      .attr("xlink:href", el.image)
      .attr("class", "thumbnail")
  };

  function handleMouseOut(el, i) {
    if (detailsOpen) return false

    timeline.selectAll(".thumbnail").remove();
    reduceBlock.bind(d3.select(this))(this);
  };

  function enlargeBlock(el) {
    var $this = $(el),
      $x = parseFloat($this.attr('x')),
      $y = parseFloat($this.attr('y')),
      $width = $this.width(),
      $height = $this.height();

    this
      .attr("x", $x - 5)
      .attr("y", $y - 5)
      .attr("width", $width + 10)
      .attr("height", $height + 10)
      .attr("smallX", this.attr("smallX") || $x)
      .attr("smallY", this.attr("smallY") || $y)
      .attr("smallWidth", this.attr("smallWidth") || $width)
      .attr("smallHeight", this.attr("smallHeight") || $height)
      .attr("fill-opacity", 1.0);
  }

  function reduceBlock(el) {
    var $this = $(el);
    var $x = parseFloat($this.attr('x')),
      $y = parseFloat($this.attr('y')),
      $width = $this.width(),
      $height = $this.height();

    this
      .attr("fill-opacity", 0.5)
      .attr("x", this.attr("smallX"))
      .attr("y", this.attr('smallY'))
      .attr("width", this.attr('smallWidth'))
      .attr("height", this.attr('smallHeight'))
      .attr("fill-opacity", 0.5)
  }

  function showDetail(el, i) {
    timeline.classed('inactive', true);
    detail.transition()
      .attr("width", detailsWidth)
      .attr("height", detailsHeight)
      .attr("x", detailsX)
      .attr("y", detailsY)
      .duration(300).on("end", function() { renderDetails(el); });
    handleMouseOut = handleMouseOut.bind(this);
    handleMouseOut(el, i);
    detailsOpen = true;
  }

  function hideDetail(el, i) {
    timeline.classed('inactive', false);
    detailsOpen = false;
    detail.transition()
      .attr("width", 0)
      .attr("height", 0)
      .attr("x", width / 2)
      .attr("y", height / 2)
    timeline.selectAll('.detail').remove();
  }

  function renderDetails(el) {
    // Monarch
    timeline.append("image")
      .attr("x", detailsImageX)
      .attr("y", detailsImageY)
      .attr("width", detailsImageWidth)
      .attr("height", detailsImageHeight)
      .attr("xlink:href", el.image)
      .attr("preserveAspectRatio", "none")
      .attr("class", "detail")

    // House
    detail.append("image")
      .attr("x", detailsX + detailsWidth - detailsImageWidth - detailsWidthInterval)
      .attr("y", detailsImageY)
      .attr("width", detailsImageWidth)
      .attr("height", detailsImageHeight)
      .attr("xlink:href", el.houseImage)
      .attr("preserveAspectRatio", "none")
      .attr("class", "detail")

    // Details: Name, House, Reign
    detail.append("text")
      .attr("x", detailsImageX + detailsImageWidth / 2)
      .attr("y", detailsNameY + detailsLineHeight)
      .attr("text-anchor", "middle")
      .attr("class", "detail")
      .text(el.name);
    detail.append("text")
      .attr("x", detailsX + detailsWidth - detailsImageWidth / 2 - detailsWidthInterval)
      .attr("y", detailsNameY + detailsLineHeight)
      .attr("text-anchor", "middle")
      .attr("class", "detail")
      .text(el.house);
    detail.append("text")
      .attr("x", detailsMiddle)
      .attr("y", detailsNameY + 2 * detailsLineHeight)
      .attr("text-anchor", "middle")
      .attr("class", "detail")
      .text(el.start + "-" + el.end + " (" + el.endReason + ")");
    detail.append("text")
      .attr("x", detailsMiddle)
      .attr("y", detailsNameY + 3 * detailsLineHeight)
      .attr("text-anchor", "middle")
      .attr("class", "detail")
      .text(el.religion);

    // Events
    detail.append("text")
      .attr("x", detailsMiddle)
      .attr("y", detailsEventsY + detailsLineHeight)
      .attr("text-anchor", "middle")
      .attr("class", "detail")
      .text("Events")
    _.map(el.events, function(event, idx) {
      detail.append("text")
        .attr("x", detailsImageX)
        .attr("y", detailsEventsY + detailsLineHeight * (2 + idx))
        .attr("class", "detail")
        .text(event);
    })

    // Wars
    detail.append("text")
      .attr("x", detailsMiddle)
      .attr("y", detailsWarsY + detailsLineHeight)
      .attr("text-anchor", "middle")
      .attr("class", "detail")
      .text("Wars")
    _.map(el.wars, function(war, idx) {
      detail.append("text")
        .attr("x", detailsImageX)
        .attr("y", detailsWarsY + detailsLineHeight * (2 + idx))
        .attr("class", "detail")
        .text(war);
    })

    
    // Relationships
    var relationshipCount = el.relationships.length,
      relationshipContainerWidth = detailsWidth - detailsMargin * 2,
      relationshipMaxImageWidth = detailsHeightInterval * 1.5,
      relationshipImageWidthCalculated = relationshipContainerWidth / relationshipCount / 1.5,
      relationshipImageWidth = Math.min(relationshipMaxImageWidth, relationshipImageWidthCalculated),
      relationshipImagePadding = relationshipImageWidth / 2;

    // i: index
    // c: relationship count
    // m: middle of details overlay
    // W: relationship image width
    // x(i, c) = m - (c - 1) * 0.75W + i * 1.5W - 0.5W
    _.map(el.relationships, function(rel, idx) {
      var relationshipImageX = detailsMiddle - (relationshipCount - 1) * 0.75 * relationshipImageWidth + idx * 1.5 * relationshipImageWidth - 0.5 * relationshipImageWidth,
        relationshipImageY = detailsY + 5 * detailsHeightInterval + detailsMargin;
      detail.append("image")
        .attr("x", relationshipImageX)
        .attr("y", relationshipImageY)
        .attr("width", relationshipImageWidth)
        .attr("height", relationshipImageWidth)
        .attr("xlink:href", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Nicolas_Cage_2011_CC.jpg/220px-Nicolas_Cage_2011_CC.jpg")

      _.map(rel.split(","), function(relComponent, idx) {
        detail.append("text")
          .attr("x", relationshipImageX + relationshipImageWidth / 2)
          .attr("y", relationshipImageY + relationshipImageWidth + detailsLineHeight * (idx + 1))
          .attr("text-anchor", "middle")
          .text(relComponent);
      });
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
    timeline.append("text")
      .attr("x", 0)
      .attr("y", height - margin.bottom - laneHeight * (countryIndex - 1) - lanePadding * countryIndex)
      .text(countryName);

    // Add elements
    timeline.append("g")
      .attr('id', countryName)
      .selectAll("rect")
      .data(_.map(countryData, function(monarchData, monarchName) { return monarchData; }))
      .enter()
      .append("rect")
      .attr("width", function(el) { return (el.end - el.start) * pixelsPerYear - 1 })
      .attr("height", laneHeight)
      .attr("x", function(el) { return margin.left + (el.start - firstYear) * pixelsPerYear })
      .attr("y", height - margin.bottom - laneHeight * (countryIndex - 1) - lanePadding * countryIndex)
      .attr("fill", "blue")
      .attr("fill-opacity", 0.5)
      .attr("class", "block")
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", showDetail)
  });
};

//$(document).ready(function() { $('#England > rect:nth-child(1)').click(); });
