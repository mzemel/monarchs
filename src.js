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
    fill: "gainsboro",
    rx: detailsRx,
    ry: detailsRy
  });

  // Create X-axis
  var xScale = d3.time.scale()
    .domain([firstYear, lastYear]) 
    .range([margin.left, width - margin.right])

  var xAxis = d3.svg.axis().scale(xScale).tickFormat(d3.format("d"));

  timeline.append("g").attr({
    "class": "axis",
    transform: "translate(" + [0, height - margin.bottom] + ")"
  }).call(xAxis);

  function handleMouseOver(el, i) {
    var $this = $(this),
      $x = parseFloat($this.attr('x')),
      $y = parseFloat($this.attr('y')),
      $width = $this.width(),
      $height = $this.height();
    
    d3.select(this).transition().attr({
      "fill-opacity": 1.0,
    })

    // enlargeBlock(this);

    var thumbnailImageWidth = width / 8;

    timeline.append("image").transition().attr({
      x: $x + $width / 2 - thumbnailImageWidth / 2,
      y: $y - thumbnailImageWidth - detailsLineHeight,
      width: thumbnailImageWidth,
      height: thumbnailImageWidth,
      "xlink:href": el.image,
      class: "thumbnail"
    }).delay(0)

    timeline.append("text").transition().attr({
      x: $x + $width / 2,
      y: $y - thumbnailImageWidth - detailsLineHeight * 2,
      "text-anchor": "middle",
      class: "thumbnail"
    }).delay(0).text(el.name);
  };

  function handleMouseOut(el, i) {
    d3.selectAll(".thumbnail").remove();
    d3.select(this).transition().attr({
      "fill-opacity": 0.5,
    });
    // reduceBlock(this);
  };

  function enlargeBlock(rect) {
    var $this = $(rect),
      $x = parseFloat($this.attr('x')),
      $y = parseFloat($this.attr('y')),
      $width = $this.width(),
      $height = $this.height();

    d3.select(this).transition().attr({
      x: $x - 5,
      y: $y - 5,
      width: $width + 10,
      height: $height + 10,
      "prevX": $x,
      "prevY": $y,
      "prevWidth": $width,
      "prevHeight": $height,
    })
  }

  function reduceBlock(rect) {
    var $this = $(rect);
    if ($this.attr('prevX') !== null) {
      var $x = parseFloat($this.attr('x')),
        $y = parseFloat($this.attr('y')),
        $width = $this.width(),
        $height = $this.height();

      var rect = d3.select(rect);

      d3.select(this).transition().attr({
        "fill-opacity": 0.5,
        x: rect.attr("prevX"),
        y: rect.attr('prevY'),
        width: rect.attr('prevWidth'),
        height: rect.attr('prevHeight'),
        "prevX": null,
        "prevY": null,
        "prevWidth": null,
        "prevHeight": null
      });
    }
  }

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

    detail.select(".details-name").remove();
  }

  function renderDetails(el) {
    // Monarch
    detail.append("image").attr({
      x: detailsImageX,
      y: detailsImageY,
      width: detailsImageWidth,
      height: detailsImageHeight,
      "xlink:href": el.image,
      preserveAspectRatio: "none"
    })

    // House
    detail.append("image").attr({
      x: detailsX + detailsWidth - detailsImageWidth - detailsWidthInterval,
      y: detailsImageY,
      width: detailsImageWidth,
      height: detailsImageHeight,
      "xlink:href": el.houseImage,
      preserveAspectRatio: "none"
    })

    // Details: Name, House, Reign
//    detail.append("rect").attr({
//      x: detailsImageX,
//      y: detailsNameY,
//      width: detailsWidth - 2 * detailsWidthInterval,
//      height: detailsHeightInterval,
//      "fill-opacity": 0.2,
//      class: "details-name"
//    })
    detail.append("text").attr({
      x: detailsImageX + detailsImageWidth / 2,
      y: detailsNameY + detailsLineHeight,
      "text-anchor": "middle",
//      textLength: detailsImageWidth,
//      lengthAdjust: "spacesAndGlyphs"
    }).text(el.name);
    detail.append("text").attr({
      x: detailsX + detailsWidth - detailsImageWidth / 2 - detailsWidthInterval,
      y: detailsNameY + detailsLineHeight,
      "text-anchor": "middle",
//      textLength: detailsImageWidth,
//      lengthAdjust: "spacesAndGlyphs"
    }).text(el.house);
    detail.append("text").attr({
      x: detailsMiddle,
      y: detailsNameY + 2 * detailsLineHeight,
      "text-anchor": "middle"
    }).text(el.start + "-" + el.end + " (" + el.endReason + ")");
    detail.append("text").attr({
      x: detailsMiddle,
      y: detailsNameY + 3 * detailsLineHeight,
      "text-anchor": "middle"
    }).text(el.religion);

    // Events
    detail.append("text").attr({
      x: detailsMiddle,
      y: detailsEventsY + detailsLineHeight,
      "text-anchor": "middle"
    }).text("Events")
    _.map(el.events, function(event, idx) {
      detail.append("text").attr({
        x: detailsImageX,
        y: detailsEventsY + detailsLineHeight * (2 + idx)
      }).text(event);
    })

    // Wars
    detail.append("text").attr({
      x: detailsMiddle,
      y: detailsWarsY + detailsLineHeight,
      "text-anchor": "middle"
    }).text("Wars")
    _.map(el.wars, function(war, idx) {
      detail.append("text").attr({
        x: detailsImageX,
        y: detailsWarsY + detailsLineHeight * (2 + idx)
      }).text(war);
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
      detail.append("image").attr({
        x: relationshipImageX,
        y: relationshipImageY,
        width: relationshipImageWidth,
        height: relationshipImageWidth,
        "xlink:href": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Nicolas_Cage_2011_CC.jpg/220px-Nicolas_Cage_2011_CC.jpg"
      })
      _.map(rel.split(","), function(relComponent, idx) {
        detail.append("text").attr({
          x: relationshipImageX + relationshipImageWidth / 2,
          y: relationshipImageY + relationshipImageWidth + detailsLineHeight * (idx + 1),
          "text-anchor": "middle",
        }).text(relComponent);
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
        "fill-opacity": 0.5,
        class: "block"
      })
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", showDetail)
  });
};

//$(document).ready(function() { $('#England > rect:nth-child(1)').click(); });
