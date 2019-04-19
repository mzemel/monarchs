$.getJSON("dataset.json", function(data) { render(data) });

// Colors
var detailsColor = "#E2D4AC",
  backgroundColor = "#FEF6DF",
  thumbnailBackgroundColor = "#000000",
  thumbnailNameBackgroundColor = "#4E4E4E";

// Fonts
var fontSizeLarge = "1.9em",
  fontSizeMedium = "1.5em",
  fontSizeSmall = "1em",
  fontFamily = "Georgia, serif";

// General config
var width = window.innerWidth,
  height = window.innerHeight,
  margin = { top: height / 8, bottom: height / 4, right: width / 12, left: width / 12 };

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

function render(data) {
  // Flatten all reigns into a single array to determine start and end
  var firstYear = d3.min(_.flatten(_.map(data, function(countryData, countryName) { return _.map(countryData, function(monarchData, monarchName) { return monarchData.start; }); })));
    lastYear = d3.max(_.flatten(_.map(data, function(countryData, countryName) { return _.map(countryData, function(monarchData, monarchName) { return monarchData.end; }); })));
    pixelsPerYear = (width - margin.left - margin.right) / (lastYear - firstYear);

  var detailsOpen = false,
    countryIndex = 0,
    countryCount = _.keys(data).length,
    laneHeight = height / countryCount / 4;

  // Create Timeline
  var timeline = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "timeline")

  timeline.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", backgroundColor)

  ///////////////////
  // Create X-axis //
  ///////////////////
  var xScale = d3.time.scale()
    .domain([firstYear, lastYear]) 
    .range([margin.left, width - margin.right])

  var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  timeline.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
    .call(xAxis);

  function handleMouseOver(el, i) {
    if (detailsOpen) return false

    enlargeBlock.bind(d3.select(this))(this);
    showThumbnail.bind(this)(el);
  };

  function showThumbnail(el) {
    var $this = $(this),
      $x = parseFloat($this.attr('x')),
      $y = parseFloat($this.attr('y')),
      $width = $this.width(),
      $height = $this.height();

    var thumbnailImageWidth = width / 8,
      thumbnailBorder = 10;

    var thumbnailDimensions = [
      { // Background
        "x": $x + $width / 2 - thumbnailImageWidth / 2 - thumbnailBorder,
        "y": $y - thumbnailImageWidth - detailsLineHeight - thumbnailBorder,
        "width": thumbnailImageWidth + 2 * thumbnailBorder,
        "height": thumbnailImageWidth + 2 * thumbnailBorder
      },
      { // Image
        "x": $x + $width / 2 - thumbnailImageWidth / 2,
        "y": $y - thumbnailImageWidth - detailsLineHeight,
        "width": thumbnailImageWidth,
        "height": thumbnailImageWidth
      },
      { // Name background
        "x": $x + $width / 2 - thumbnailImageWidth / 2 + detailsWidthInterval / 2,
        "y": $y - thumbnailImageWidth / 5 - detailsLineHeight,
        "width": thumbnailImageWidth - detailsWidthInterval,
        "height": thumbnailImageWidth / 6
      },
      { // Name
        "x": $x + $width / 2,
        "y": $y - thumbnailImageWidth / 5 - detailsLineHeight + thumbnailImageWidth / 9,
        "width": thumbnailImageWidth,
        "height": thumbnailImageWidth
      }
    ];

    var thumbnailBackground = timeline.append("rect")
      .attr("x", $x + $width / 2)
      .attr("y", $y + laneHeight / 2)
      .attr("fill", thumbnailBackgroundColor)
      .attr("rx", 15)
      .attr("ry", 15)
      .attr("class", "thumbnail")

    var thumbnailImage = timeline.append("image")
      .attr("x", $x + $width / 2)
      .attr("y", $y + laneHeight / 2)
      .attr("xlink:href", el.image)
      .attr("preserveAspectRatio", "none")
      .attr("class", "thumbnail")

    var thumbnailNameBackground = timeline.append("rect")
      .attr("x", $x + $width / 2)
      .attr("y", $y + laneHeight / 2)
      .attr("fill", backgroundColor)
      .attr("rx", 15)
      .attr("ry", 15)
      .attr("stroke", thumbnailBackgroundColor)
      .attr("stroke-width", 3)
      .attr("class", "thumbnail")

    var thumbnailName = timeline.append("text")
      .attr("x", $x + $width / 2)
      .attr("y", $y + laneHeight / 2)
      .attr("font-family", fontFamily)
      .attr("font-size", fontSizeMedium)
      .attr("text-anchor", "middle")
      .attr("class", "thumbnail hidden")
      .text(el.name)

    timeline.selectAll('.thumbnail')
      .transition()
      .attr("x", function(d, i)      { return thumbnailDimensions[i]["x"] })
      .attr("y", function(d, i)      { return thumbnailDimensions[i]["y"] })
      .attr("width", function(d, i)  { return thumbnailDimensions[i]["width"] })
      .attr("height", function(d, i) { return thumbnailDimensions[i]["height"] }) 
      .on("end", function() { timeline.select("text.thumbnail").classed("hidden", false) })

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
      .attr("x", this.attr("smallX"))
      .attr("y", this.attr('smallY'))
      .attr("width", this.attr('smallWidth'))
      .attr("height", this.attr('smallHeight'))
      .attr("fill-opacity", 0.75)
  }

  function showDetail(el, i) {
    if (detailsOpen) return false
    if (!el.endReason) return false // For now, don't show details for monarchs without much data

    timeline.selectAll('.block').classed('inactive', true);
    timeline.selectAll('.legend').classed('inactive', true);
    detail.transition()
      .attr("width", detailsWidth)
      .attr("height", detailsHeight)
      .attr("x", detailsX)
      .attr("y", detailsY)
      .attr("fill-opacity", 1)
      .duration(300).on("end", function() { renderDetails(el); });
    handleMouseOut.bind(this)();
    detailsOpen = true;
  }

  function hideDetail(el, i) {
    timeline.selectAll('.block').classed('inactive', false);
    timeline.selectAll('.legend').classed('inactive', false);
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
    timeline.append("image")
      .attr("x", detailsX + detailsWidth - detailsImageWidth - detailsWidthInterval)
      .attr("y", detailsImageY)
      .attr("width", detailsImageWidth)
      .attr("height", detailsImageHeight)
      .attr("xlink:href", el.houseImage)
      .attr("preserveAspectRatio", "none")
      .attr("class", "detail")

    // Details: Name, House, Reign
    timeline.append("text")
      .attr("x", detailsImageX + detailsImageWidth / 2)
      .attr("y", detailsNameY + detailsLineHeight)
      .attr("text-anchor", "middle")
      .attr("font-family", fontFamily)
      .attr("font-size", fontSizeLarge)
      .attr("class", "detail")
      .text(el.name);
    timeline.append("text")
      .attr("x", detailsX + detailsWidth - detailsImageWidth / 2 - detailsWidthInterval)
      .attr("y", detailsNameY + detailsLineHeight)
      .attr("text-anchor", "middle")
      .attr("font-family", fontFamily)
      .attr("font-size", fontSizeLarge)
      .attr("class", "detail")
      .text(el.house);
    timeline.append("text")
      .attr("x", detailsMiddle)
      .attr("y", detailsNameY + 2 * detailsLineHeight)
      .attr("text-anchor", "middle")
      .attr("font-family", fontFamily)
      .attr("font-size", fontSizeMedium)
      .attr("class", "detail")
      .text(el.start + "-" + el.end + " (" + el.endReason + ")");
    timeline.append("text")
      .attr("x", detailsMiddle)
      .attr("y", detailsNameY + 3 * detailsLineHeight)
      .attr("text-anchor", "middle")
      .attr("font-family", fontFamily)
      .attr("font-size", fontSizeMedium)
      .attr("class", "detail")
      .text(el.religion);

    // Events
    timeline.append("text")
      .attr("x", detailsMiddle)
      .attr("y", detailsEventsY + detailsLineHeight)
      .attr("text-anchor", "middle")
      .attr("font-family", fontFamily)
      .attr("font-size", fontSizeLarge)
      .attr("class", "detail")
      .text("Events")
    _.map(el.events, function(event, idx) {
      timeline.append("text")
        .attr("x", detailsImageX)
        .attr("y", detailsEventsY + detailsLineHeight * (2 + idx))
        .attr("font-family", fontFamily)
        .attr("font-size", fontSizeSmall)
        .attr("class", "detail")
        .text(event);
    })

    // Wars
    timeline.append("text")
      .attr("x", detailsMiddle)
      .attr("y", detailsWarsY + detailsLineHeight)
      .attr("text-anchor", "middle")
      .attr("font-family", fontFamily)
      .attr("font-size", fontSizeLarge)
      .attr("class", "detail")
      .text("Wars")
    _.map(el.wars, function(war, idx) {
      timeline.append("text")
        .attr("x", detailsImageX)
        .attr("y", detailsWarsY + detailsLineHeight * (2 + idx))
        .attr("font-family", fontFamily)
        .attr("font-size", fontSizeSmall)
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
      timeline.append("image")
        .attr("x", relationshipImageX)
        .attr("y", relationshipImageY)
        .attr("width", relationshipImageWidth)
        .attr("height", relationshipImageWidth)
        .attr("xlink:href", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Nicolas_Cage_2011_CC.jpg/220px-Nicolas_Cage_2011_CC.jpg")
        .attr("class", "detail")

      _.map(rel.split(","), function(relComponent, idx) {
        timeline.append("text")
          .attr("x", relationshipImageX + relationshipImageWidth / 2)
          .attr("y", relationshipImageY + relationshipImageWidth + detailsLineHeight * (idx + 1))
          .attr("text-anchor", "middle")
          .attr("font-family", fontFamily)
          .attr("font-size", fontSizeSmall)
          .attr("class", "detail")
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
      .attr("x", margin.left / 10)
      .attr("y", height - margin.bottom - laneHeight * countryIndex * 2 + laneHeight / 2)
      .attr("font-family", fontFamily)
      .attr("font-size", fontSizeSmall)
      .attr("class", "legend")
      .text(countryName);

    // Add blocks
    timeline.append("g")
      .attr('id', countryName)
      .selectAll("rect")
      .data(_.map(countryData, function(monarchData, monarchName) { return monarchData; }))
      .enter()
      .append("rect")
      .attr("width", function(el) { return (el.end - el.start) * pixelsPerYear - 1 })
      .attr("height", laneHeight)
      .attr("x", function(el) { return margin.left + (el.start - firstYear) * pixelsPerYear })
      .attr("y", height - margin.bottom - countryIndex * laneHeight * 2)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", function(el) { return fillColors[countryName][el.house] || "maroon"})
      .attr("fill-opacity", 0.75)
      .attr("class", "block")
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", showDetail)

    // Append detail to lay it on top of blocks
    detail = timeline.append("rect")
      .attr("width", 0)
      .attr("height", 0)
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("fill", detailsColor)
      .attr("rx", detailsRx)
      .attr("ry", detailsRy)
      .attr("stroke", "black")
      .attr("stroke-width", 10)
      .on("click", hideDetail)
    });
};

var fillColors = {
  "England": {
    "Tudor": "#171A94",
    "Grey": "#0BC0E8",
    "Stuart": "#4DCB93",
    "Orange-Nassau": "#0BC0E8",
    "Hanover": "#0B8AE8",
    "Saxe-Coburg and Gotha": "#0074E9",
    "Windsor": "#0162C3",
    "York": "#79D8F9",
    "Lancaster": "#A2F4F2",
    "Plantagenet": "#94CAC9",
    "Plantagenet/Angevin": "#6E9796",
    "Blois": "#CECECE",
    "Normandy": "#506D6D"
  },
  "Scotland": {
    "Stuart": "#4DCB93",
    "Balliol": "#CECECE",
    "Bruce": "#2AB075"
  },
  "France": {
    "Capet": "#6F5176",
    "Valois": "#E7A2F7",
    "Bourbon": "#CD06FC",
    "Valois-Angouleme": "#F6D8FD",
    "Valois-Orleans": "#F0BDFC",
    "Bonaparte": "#4C025D",
    "Orleans": "#F0BDFC"
  },
  "Holy Roman Empire": {
    "Habsburg": "#FFA600",
    "Wittelsbach": "#F1C716",
    "Habsburg-Lorraine": "#FF7C00",
    "Lorraine": "#FF4D00",
    "Carolingian": "#CA9100",
    "Widonid": "#CECECE",
    "Bosonid": "#CECECE",
    "Unruoching": "#CECECE",
    "Ottonian": "#D6C08E",
    "Salian": "#D9CDB4",
    "Supplinburg": "#CECECE",
    "Staufen": "#855C06",
    "Welf": "#CECECE",
    "Luxembourg": "#B7B698",
    "Hohenzollern": "#1B1B0C"
  },
  "Spain": {
    "Habsburg": "#FFA600",
    "Bourbon": "#CD06FC",
    "Bonaparte": "#4C025D",
    "Franco": "#CECECE",
    "Savoy": "#C3CC00"
  },
  "Italy": {
    "Savoy": "#C3CC00"
  },
  "Russia": {
    "Rurik": "#E67777",
    "Godunov": "#CECECE",
    "Shuyskiy": "#CECECE",
    "Vasa": "#CECECE",
    "Romanov": "#5D0C12",
    "Holstein-Gottorp-Romanov": "#450006"
  }
};
