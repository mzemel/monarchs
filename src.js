$.getJSON("dataset.json", function(data) { render(data) });

// General config
var width = window.innerWidth,
  height = window.innerHeight,
  margin = { top: height / 8, bottom: height / 6, right: width / 12, left: width / 12 };

// Colors
var gray = "#CECECE",
  detailsColor = "#E2D4AC",
  detailsBoxColor = "#f6f3eb",
  detailsStrokeColor = "#474439",
  backgroundColor = "#FEF6DF",
  thumbnailBackgroundColor = "#000000",
  thumbnailNameBackgroundColor = "#4E4E4E",
  strokeColor = "#000000",
  dateLineColor = "#858585",
  houseColors = {
    "England": {
      "Tudor": "#60ADFF",
      "Grey": "#0BC0E8",
      "Stuart": "#4DCB93",
      "Orange-Nassau": "#01DF7B",
      "Hanover": "#5092D8",
      "Saxe-Coburg and Gotha": "#0766CA",
      "Windsor": "#0766CA",
      "York": "#04A9A7",
      "Lancaster": "#AFF4F3",
      "Plantagenet": "#94CAC9",
      "Plantagenet/Angevin": "#6E9796",
      "Blois": gray,
      "Normandy": "#506D6D"
    },
    "Scotland": {
      "Stuart": "#4DCB93",
      "Balliol": gray,
      "Bruce": "#2AB075",
      "Sverre": gray,
      "Dunkeld": "#1F8659"
    },
    "France": {
      "Capet": "#6F5176",
      "Valois": "#E7A2F7",
      "Bourbon": "#9a26c5",
      "Valois-Angouleme": "#E7A2F7",
      "Valois-Orleans": "#E7A2F7",
      "Bonaparte": "#4f0f67",
      "Orleans": "#F6D8FD",
      "Carolingian": "#4c014b",
    },
    "Holy Roman Empire": {
      "Habsburg": "#FF4D00",
      "Wittelsbach": "#D4C860",
      "Habsburg-Lorraine": "#C80012",
      "Lorraine": "#C80012",
      "Widonid": gray,
      "Bosonid": gray,
      "Unruoching": gray,
      "Ottonian": "#A77901",
      "Salian": "#CB9302",
      "Supplinburg": gray,
      "Hohenstaufen": "#D4B360",
      "Welf": gray,
      "Luxembourg": "#F4CF6E",
    },
    "Spain": {
      "Habsburg": "#FF4D00",
      "Bourbon": "#9a26c5",
      "Bonaparte": "#7E039C",
      "Franco": gray,
      "Savoy": "#E0E221"
    },
    "Italy": {
      "Savoy": "#E0E221"
    },
    "Russia": {
      "Rurik": "#F4CF6E",
      "Godunov": gray,
      "Shuyskiy": gray,
      "Vasa": gray,
      "Romanov": "#E7CE1F",
      "Holstein-Gottorp-Romanov": "#ffbd16"
    },
    "Denmark": {
      "Glucksburg": "#AFD1F5",
      "Oldenburg": "#668AB0",
      "Palantinate-Neumarkt": gray,
      "Estridsen": "#285C93",
      "Griffins": gray,
      "St. Olaf": gray,
      "Denmark": "#486482",
      "Gorm": "#6B737A"
    },
    "Norway": {},
    "Austria": {
      "Habsburg-Lorraine": "#C80012",
    },
    "Germany": {
      "Hohenzollern": "#450006"
    }
  },
  dateColorsIcons = {
    "military": {
      "color": houseColors["Austria"]["Habsburg-Lorraine"],
      "icon": "icons/knife.svg"
    },
    "philosophy": {
      "color": houseColors["Holy Roman Empire"]["Habsburg"],
      "icon": "icons/open-magazine.svg"
    },
    "religion": {
      "color": houseColors["Russia"]["Romanov"],
      "icon": "icons/christianity.svg"
    },
    "science": {
      "color": houseColors["Scotland"]["Stuart"],
      "icon": "icons/atom.svg"
    },
    "diplomacy": {
      "color": houseColors["England"]["Hanover"],
      "icon": "icons/scroll.svg"
    },
    "culture": {
      "color": houseColors["France"]["Bourbon"],
      "icon": "icons/brush.svg"
    },
    "catastrophe": {
      "color": gray,
      "icon": "icons/fire.svg"
    }
  };

// Fonts
var fontFamily = "Montaga, serif",
  fontFamilyMonospace = "Inconsolata, monospace",
  strokeWidthLarge = height / 150,
  strokeWidthSmall = strokeWidthLarge / 2,
  strokeWidthTiny = strokeWidthSmall / 4,
  cornerRadiusLarge = width / 180,
  cornerRadiusSmall = cornerRadiusLarge / 3,
  circleRadiusLarge = _.min([margin.bottom / 5, width / 30]),
  circleRadiusMedium = _.max([circleRadiusLarge / 2, margin.bottom / 10]),
  circleRadiusSmall = circleRadiusMedium / 2,
  pixelsPerCharacterReference = { // Somehow calc this from width/height and multiply by sm/md/lg modifier
    "small": _.max([width / 180, height / 90]),
    "large": _.max([width / 90, height / 45])
  };

// Flags
var flags = {
  "England": "img/flags/england.png",
  "Scotland": "img/flags/scotland.png",
  "France": "img/flags/france.png",
  "Spain": "img/flags/spain.png",
  "Holy Roman Empire": "img/flags/hre.png",
  "Russia": "img/flags/russia.jpg",
  "Denmark": "img/flags/denmark.png",
  "Germany": "img/flags/germany.jpg",
  "Austria": "img/flags/austria.png"
};

// Details config
var detailsHeight = height * 7 / 8,
  detailsWidth = detailsHeight * 5 / 8,
  detailsBlock = detailsHeight / 8,
  detailsBlockQuarter = detailsBlock / 4,
  detailsBlockEighth = detailsBlock / 8,
  detailsMargin = detailsBlockQuarter,
  detailsX = (width - detailsWidth) / 2,
  detailsY = (height - detailsHeight) / 2,
  detailsMiddle = detailsX + detailsWidth / 2,
  detailsImageWidth = detailsBlock * 2,
  detailsNameY = detailsY,
  detailsImageY = detailsY + detailsBlock,
  detailsFactsY = detailsY + detailsBlock * 3,
  detailsEventsY = detailsY + detailsBlock * 4,
  detailsWarsY = detailsY + detailsBlock * 5,
  detailsRelationshipY = detailsY + detailsBlock * 6;

// Thumbnail config
var thumbnailImageWidth = _.max([width / 8, height / 4]),
  thumbnailBorder = strokeWidthLarge;

// Date config
var dateHeight = detailsBlockQuarter,
  dateWidth = dateHeight * 8,
  dateControlInterval = (width - margin.left - margin.right) / (_.size(dateColorsIcons) + 1);

function render(data) {
  // Stores dates and remove from data object; render later
  var dates = data["Dates"];
  delete(data["Dates"]);
  delete(data["Italy"]);
  delete(data["Norway"]); // V2: Scandinavia

  // Flatten all reigns into a single array to determine start and end
  var firstYear = d3.min(_.flatten(_.map(data, function(countryData, countryName) { return _.map(countryData, function(monarchData, monarchName) { return monarchData.start; }); })));
    lastYear = d3.max(_.flatten(_.map(data, function(countryData, countryName) { return _.map(countryData, function(monarchData, monarchName) { return monarchData.end; }); })));
    pixelsPerYear = (width - margin.left - margin.right) / (lastYear - firstYear);

  var detailsOpen = false,
    countryIndex = 0,
    countryCount = _.keys(data).length,
    laneHeight = (height - margin.top - margin.bottom) / countryCount / 2.5;

  // Create Timeline
  var timeline = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "timeline")

  // Timeline background
  timeline.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", backgroundColor)

  // Title
  timeline.append("text")
    .attr("x", width * 2 / 5)
    .attr("y", margin.top * 5 / 3)
    .attr("font-size", getFontSizeFromContainer("Monarchs", width, margin.top * 4 / 3))
    .attr("text-anchor", "middle")
    .attr("class", "title stonehen-font")
    .text("Monarchs")

  // Subtitle
  var subtitleString = "1,000 years of European history";
  timeline.append("text")
    .attr("x", width * 2 / 5)
    .attr("y", margin.top * 5 / 3 + laneHeight * 5 / 4)
    .attr("font-size", getFontSizeFromContainer(subtitleString, width, laneHeight * 5 / 4))
    .attr("text-anchor", "middle")
    .attr("class", "title stonehen-font")
    .text(subtitleString)

  // Link
  timeline.append("a")
    .attr("href", "https://thebackend.dev/building-monarchs")
    .append("text")
    .attr("x", width - margin.right * 3 / 4)
    .attr("y", height - margin.bottom / 3) 
    .attr("font-size", getFontSizeFromContainer("Blogge", margin.right * 2, margin.bottom / 2))
    .attr("fill", "blue")
    .attr("text-anchor", "middle")
    .attr("class", "title stonehen-font")
    .text("Blogge")

  // Create X-axis
  var xScale = d3.time.scale()
    .domain([firstYear, lastYear]) 
    .range([margin.left, width - margin.right]),
    xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  timeline.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
    .call(xAxis);

  // Add date controls
  var dateControlContainer = timeline.append("g"),
    dateControlData = _.map(dateColorsIcons, function(value, key) { return { key: key, color: value.color, icon: value.icon }; });

  // Icons
  dateControlContainer.selectAll("image")
    .data(dateControlData)
    .enter()
    .append("image")
    .attr("xlink:href", function(d) { return d.icon })
    .attr("x", function(d, i) { return margin.left + dateControlInterval / 2 + (i * dateControlInterval) - circleRadiusLarge / 2; })
    .attr("y", height - margin.bottom / 2 - circleRadiusLarge / 2)
    .attr("width", circleRadiusLarge)
    .attr("height", circleRadiusLarge)
    .attr("class", function(d) { return ['control',  d.key].join(' ') }) 

  dateControlContainer.selectAll("circle")
    .data(dateControlData)
    .enter()
    .append("circle")
    .attr("cx", function(d, i) { return margin.left + dateControlInterval / 2 + (i * dateControlInterval); })
    .attr("cy", height - margin.bottom / 2)
    .attr("r", circleRadiusLarge)
    .attr("fill", function (d) { return d.color })
    .attr("fill-opacity", 0.5)
    .attr("class", function(d) { return ['control',  d.key].join(' ') }) 
    .on("click", focusDates)
    .on("mouseover", function(d) { enlargeCircle.bind(d3.select(this))(this); })
    .on("mouseout", function() { reduceCircle.bind(d3.select(this))(this); })
    .append("title").text(function(d) { return d.key; });

  // Add dates
  timeline.append("g")
    .selectAll("circle")
    .data(_.filter(_.values(dates), function(date) { return !date.hidden; }))
    .enter()
    .append("circle")
    .attr("cx", function(d) { return margin.left + (d.date - firstYear) * pixelsPerYear; })
    .attr("cy", height - margin.bottom - laneHeight)
    .attr("r", circleRadiusSmall)
    .attr("fill", function(d) { return dateColorsIcons[d.type].color })
    .attr("class", function(d) { return ['date', d.type].join(' '); })
    .on("mouseover", renderDate)
    .on("mouseout", function() {
      d3.select(this).transition().attr("r", circleRadiusSmall);
      timeline.selectAll("g.date").remove();
    })

  function renderDate(data, i) {
    if (detailsOpen) return false;
    var circle = d3.select(this),
      dateTextPadding = 6,
      dateTextString = data.date + ": " + data.event,
      dateRectWidth,
      dateRectHeight;

    [dateTextWidth, dateTextHeight] = getContainerFromText(dateTextString, "small");
    var dateRectWidth = dateTextWidth + dateTextPadding * 2,
      dateRectHeight = dateTextHeight + dateTextPadding * 2,
      dateTextX = margin.left + (data.date - firstYear) * pixelsPerYear;

    var offPageOnLeftBy = dateTextX - dateRectWidth / 2,
      offPageOnRightBy = width - (dateTextX + dateRectWidth / 2);

    if (offPageOnLeftBy < 0) { dateTextX -= offPageOnLeftBy; }
    if (offPageOnRightBy < 0) { dateTextX += offPageOnRightBy; }

    var dateContainer = timeline.append("g").attr("class", "date")

    var dateRect = dateContainer.append("rect")
      .attr("x", dateTextX - dateRectWidth / 2)
      .attr("y", height - margin.bottom + laneHeight / 2)
      .attr("rx", cornerRadiusSmall)
      .attr("ry", cornerRadiusSmall)
      .attr("width", dateRectWidth)
      .attr("height", dateRectHeight)
      .attr("fill", dateColorsIcons[data.type].color)
      .attr("fill-opacity", 0.5)
      .attr("stroke", dateColorsIcons[data.type].color)
      .attr("stroke-width", strokeWidthTiny)
      .attr("class", "date ")

    var dateText = dateContainer.append("text")
      .attr("x", dateTextX)
      .attr("y", height - margin.bottom + laneHeight / 2 + dateRectHeight * 3 / 4)
      .attr("text-anchor", "middle")
      .attr("font-family", fontFamilyMonospace)
      .attr("font-size", pixelsPerCharacterReference["large"])
      .attr("class", "date ")
      .text(dateTextString)

    circle.transition().attr("r", circleRadiusMedium)

    dateContainer.append("line")
      .attr("x1", circle.attr("cx"))
      .attr("y1", circle.attr("cy") - laneHeight / 4)
      .attr("x2", circle.attr("cx"))
      .attr("y2", margin.top + laneHeight)
      .attr("stroke", dateLineColor) 
      .attr("stroke-width", strokeWidthTiny)
      .attr("opacity", 0.5)
      .attr("class", "date")
  };

  var legendFontSize = _.min(
    _.map(_.keys(data), function(text) {
      return getFontSizeFromContainer(text, margin.left * 3, laneHeight); // Setting 1.5 manually to avoid bug in getFontSizeFromContainer
    })
  )

  // Create country timelines
  _.forEach(data, function(countryData, countryName) {
    countryIndex += 1;

    var baseHeight = height - margin.bottom - laneHeight * (countryIndex * 2 + 1);

    // Add country flag
    timeline.append("image")
      .attr("x", width - margin.right * 2 / 3)
      .attr("y", baseHeight)
      .attr("width", margin.right / 3)
      .attr("height", laneHeight)
      .attr("xlink:href", flags[countryName])
      .attr("preserveAspectRatio", "none")
      .attr("class", "legend")
      .append("title").text(countryName)

    // Add country name
    timeline.append("text")
      .attr("x", margin.left / 10)
      .attr("y", baseHeight + laneHeight / 2)
      .attr("font-family", fontFamily)
      .attr("font-size", legendFontSize)
      .attr("class", "legend stonehen-font")
      .text(countryName);

    // Add blocks
    timeline.append("g")
      .attr('id', countryName)
      .selectAll("rect")
      .data(_.map(countryData, function(monarchData, monarchName) { return monarchData; }))
      .enter()
      .append("rect")
      .attr("width", function(data) { return (data.end - data.start) * pixelsPerYear - 1 })
      .attr("height", laneHeight)
      .attr("x", function(data) { return margin.left + (data.start - firstYear) * pixelsPerYear })
      .attr("y", baseHeight)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", function(data) { return houseColors[countryName][data.house] || gray})
      .attr("fill-opacity", 0.75)
      .attr("class", function(data, i) { return ['block', 'block-' + i, countryName].join(' '); })
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", showDetail)
  });

  // Append detail to lay it on top of blocks
  detail = timeline.append("rect")
    .attr("width", 0)
    .attr("height", 0)
    .attr("x", width / 2)
    .attr("y", height / 2)
    .attr("fill", detailsColor)
    .attr("rx", cornerRadiusLarge)
    .attr("ry", cornerRadiusLarge)
    .attr("stroke", detailsStrokeColor)
    .attr("stroke-width", strokeWidthLarge)
    .on("click", hideDetail)

  function handleMouseOver(el, i) {
    if (detailsOpen) return false

    enlargeBlock.bind(d3.select(this))(this);
    showThumbnail.bind(this)(el);
  };

  function handleMouseOut(el, i) {
    if (detailsOpen) return false

    timeline.selectAll(".thumbnail").remove();
    reduceBlock.bind(d3.select(this))(this);
  };

  function showThumbnail(el) {
    var $this = $(this),
      $x = parseFloat($this.attr('x')),
      $y = parseFloat($this.attr('y')),
      $width = $this.width(),
      $height = $this.height();

    var initialY = $y < height / 3 ? $y + laneHeight * 2 : $y - laneHeight / 2;

    var thumbnailDimensions = [
      { // Background
        "x": $x + $width / 2 - thumbnailImageWidth / 2 - thumbnailBorder,
        "y": $y - thumbnailImageWidth - detailsBlockQuarter - thumbnailBorder,
        "width": thumbnailImageWidth + 2 * thumbnailBorder,
        "height": thumbnailImageWidth + 2 * thumbnailBorder
      },
      { // Image
        "x": $x + $width / 2 - thumbnailImageWidth / 2,
        "y": $y - thumbnailImageWidth - detailsBlockQuarter,
        "width": thumbnailImageWidth,
        "height": thumbnailImageWidth
      },
      { // House image
        "x": $x + $width / 2 + thumbnailImageWidth * 3 / 16,
        "y": $y - thumbnailImageWidth - detailsBlockQuarter + thumbnailImageWidth * 1 / 16,
        "width": thumbnailImageWidth / 4,
        "height": thumbnailImageWidth / 4
      },
      { // Name background
        "x": $x + $width / 2 - thumbnailImageWidth / 2 + detailsBlock / 2,
        "y": $y - thumbnailImageWidth / 5 - detailsBlockQuarter,
        "width": thumbnailImageWidth - detailsBlock,
        "height": thumbnailImageWidth / 6
      },
      { // Name
        "x": $x + $width / 2,
        "y": $y - thumbnailImageWidth / 5 - detailsBlockQuarter + thumbnailImageWidth / 9,
        "width": thumbnailImageWidth,
        "height": thumbnailImageWidth
      }
    ];

    var thumbnailBackground = timeline.append("rect")
      .attr("x", $x + $width / 2)
      .attr("y", initialY)
      .attr("fill", thumbnailBackgroundColor)
      .attr("rx", cornerRadiusLarge)
      .attr("ry", cornerRadiusLarge)
      .attr("class", "thumbnail")

    var thumbnailImage = timeline.append("image")
      .attr("x", $x + $width / 2)
      .attr("y", initialY)
      .attr("xlink:href", el.image)
      .attr("preserveAspectRatio", "none")
      .attr("class", "thumbnail")

    var thumbnailHouseImage = timeline.append("image")
      .attr("x", $x + $width / 2)
      .attr("y", initialY)
      .attr("xlink:href", el.houseImage)
      .attr("class", "thumbnail")

    var thumbnailNameBackground = timeline.append("rect")
      .attr("x", $x + $width / 2)
      .attr("y", initialY)
      .attr("fill", backgroundColor)
      .attr("rx", cornerRadiusLarge)
      .attr("ry", cornerRadiusLarge)
      .attr("stroke", strokeColor)
      .attr("stroke-width", strokeWidthTiny)
      .attr("class", "thumbnail")

    var thumbnailName = timeline.append("text")
      .attr("x", $x + $width / 2)
      .attr("y", initialY)
      .attr("font-family", fontFamily)
      .attr("font-size", getFontSizeFromContainer(el.name, thumbnailDimensions[3]["width"] * 1.5, thumbnailDimensions[3]["height"] * 2 / 3))
      .attr("text-anchor", "middle")
      .attr("class", "thumbnail hidden")
      .text(el.name)

    timeline.selectAll('.thumbnail')
      .transition()
      .attr("x", function(d, i)      { return thumbnailDimensions[i]["x"] })
      .attr("y", function(d, i)      {
        if ($y < height / 3) {
          return thumbnailDimensions[i]["y"] + thumbnailImageWidth + 2 * thumbnailBorder + laneHeight * 2;
        } else {
          return thumbnailDimensions[i]["y"];
        }
      })
      .attr("width", function(d, i)  { return thumbnailDimensions[i]["width"] })
      .attr("height", function(d, i) { return thumbnailDimensions[i]["height"] }) 
      .on("end", function() { timeline.select("text.thumbnail").classed("hidden", false) })
  };

  function showDetail(data, i) {
    if (detailsOpen) return false
    if (!data.endReason) return false // For now, don't show details for monarchs without much data
    
    var currentBlock = d3.select(this);

    timeline.selectAll('.block').classed('inactive', true);
    timeline.selectAll('.legend').classed('inactive', true);
    timeline.selectAll('.title').classed('inactive', true);
    timeline.selectAll('.axis').classed('inactive', true);
    timeline.selectAll('.date').classed('inactive', true);
    timeline.selectAll('.control').classed('inactive', true);
    detail.transition()
      .attr("width", detailsWidth)
      .attr("height", detailsHeight)
      .attr("x", detailsX)
      .attr("y", detailsY)
      .attr("fill-opacity", 1)
      .duration(300).on("end", function() {
        renderDetails(data);
        createNavigation.bind(currentBlock)();
      });
    handleMouseOut.bind(this)();
    detailsOpen = true;
  };

  function createNavigation() {
    var currentBlockClass = this.attr("class"),
      currentBlockNumber = parseInt(currentBlockClass.match(/block-(\d+)/)[1]),
      nextBlockSelector = '.' + currentBlockClass.replace(currentBlockNumber, currentBlockNumber + 1).replace(/ /g, "."),
      nextBlock = timeline.select(nextBlockSelector),
      previousBlockSelector = '.' + currentBlockClass.replace(currentBlockNumber, currentBlockNumber - 1).replace(/ /g, "."),
      previousBlock = timeline.select(previousBlockSelector);

    var arrowWidth = detailsWidth / 4,
      prevArrowCoord = {
        one: {
          x: detailsMiddle - detailsWidth / 2 - detailsBlock / 2 - arrowWidth / 2,
          y: height / 2
        },
        two: {
          x: detailsMiddle - detailsWidth / 2 - detailsBlock / 2,
          y: height / 2 - arrowWidth / 2
        },
        three: {
          x: detailsMiddle - detailsWidth / 2 - detailsBlock / 2,
          y: height / 2 + arrowWidth / 2
        }
      },
      nextArrowCoord = {
        one: {
          x: detailsMiddle + detailsWidth / 2 + detailsBlock / 2 + arrowWidth / 2,
          y: height / 2
        },
        two: {
          x: detailsMiddle + detailsWidth / 2 + detailsBlock / 2,
          y: height / 2 - arrowWidth / 2
        },
        three: {
          x: detailsMiddle + detailsWidth / 2 + detailsBlock / 2,
          y: height / 2 + arrowWidth / 2
        }
      };

    // Correct for arrows moving off the page
    var arrowOffPageBy = prevArrowCoord.one.x;
    if (arrowOffPageBy < 0) {
      _.each(prevArrowCoord, function(point) { point.x -= arrowOffPageBy });
      _.each(nextArrowCoord, function(point) { point.x += arrowOffPageBy });
    }

    var prevArrowPoints = [prevArrowCoord.one.x + ',' + prevArrowCoord.one.y, prevArrowCoord.two.x + ',' + prevArrowCoord.two.y, prevArrowCoord.three.x + ',' + prevArrowCoord.three.y].join(" "),
      nextArrowPoints = [nextArrowCoord.one.x + ',' + nextArrowCoord.one.y, nextArrowCoord.two.x + ',' + nextArrowCoord.two.y, nextArrowCoord.three.x + ',' + nextArrowCoord.three.y].join(" ");

    // Next
    timeline.append("path") // UX TODO: Hide arrows if nextBlock.empty?
      .attr("d", "M " + nextArrowPoints + " Z")
      .attr("width", detailsWidth / 4)
      .attr("height", detailsWidth / 4)
      .attr("fill", detailsColor)
      .attr("stroke", detailsStrokeColor)
      .attr("stroke-width", strokeWidthSmall)
      .attr("class", "detail")
      .on("click", function() {
        if (nextBlock.empty()) {
          hideDetail();
        } else {
          timeline.selectAll('.detail').remove();
          renderDetails(nextBlock.data()[0]);
          createNavigation.bind(nextBlock)();
        }
      })

    // Prev
    timeline.append("path")
      .attr("d", "M " + prevArrowPoints + " Z")
      .attr("width", detailsWidth / 4)
      .attr("height", detailsWidth / 4)
      .attr("fill", detailsColor)
      .attr("stroke", detailsStrokeColor)
      .attr("stroke-width", strokeWidthSmall)
      .attr("class", "detail")
      .on("click", function() {
        if (previousBlock.empty()) {
          hideDetail();
        } else {
          timeline.selectAll('.detail').remove();
          renderDetails(previousBlock.data()[0]);
          createNavigation.bind(previousBlock)();
        }
      })
  };

  function hideDetail(data, i) {
    timeline.selectAll('.block').classed('inactive', false);
    timeline.selectAll('.legend').classed('inactive', false);
    timeline.selectAll('.title').classed('inactive', false);
    timeline.selectAll('.axis').classed('inactive', false);
    timeline.selectAll('.date').classed('inactive', false);
    timeline.selectAll('.control').classed('inactive', false);
    detailsOpen = false;
    detail.transition()
      .attr("width", 0)
      .attr("height", 0)
      .attr("x", width / 2)
      .attr("y", height / 2)
    timeline.selectAll('.detail').remove();
  }

  function renderDetails(data) {
    // Monarch image background
    timeline.append("rect")
      .attr("x", detailsX + detailsBlockQuarter)
      .attr("y", detailsY + detailsBlockQuarter)
      .attr("width", detailsBlock * 2.25)
      .attr("height", detailsBlock * 2.25)
      .attr("fill", thumbnailBackgroundColor)
      .attr("class", "detail")

    // Monarch image
    timeline.append("image")
      .attr("x", detailsX + detailsBlockQuarter + strokeWidthSmall)
      .attr("y", detailsY + detailsBlockQuarter + strokeWidthSmall)
      .attr("width", detailsBlock * 2.25 - strokeWidthSmall * 2)
      .attr("height", detailsBlock * 2.25 - strokeWidthSmall * 2)
      .attr("xlink:href", data.image)
      .attr("preserveAspectRatio", "none")
      .attr("class", "detail")

    // House image
    timeline.append("image")
      .attr("x", detailsX + detailsBlock * 1.75 + detailsBlockEighth)
      .attr("y", detailsY + detailsBlockQuarter + detailsBlockEighth)
      .attr("width", detailsBlock / 2)
      .attr("height", detailsBlock / 2)
      .attr("xlink:href", data.houseImage)
      .attr("class", "detail")

    // White details background
    timeline.append("rect")
      .attr("x", detailsMiddle)
      .attr("y", detailsY + detailsBlockQuarter * 2)
      .attr("width", detailsBlock * 2.25)
      .attr("height", detailsBlock * 1.75)
      .attr("fill", detailsBoxColor)
      .attr("class", "detail")

    // Name
    timeline.append("text")
      .attr("x", detailsX + detailsBlock * 2.5 + detailsBlockEighth)
      .attr("y", detailsY + detailsBlockQuarter * 3 + detailsBlockEighth)
      .attr("font-family", fontFamilyMonospace)
      .attr("font-size", getFontSizeFromContainer(data.name, detailsBlock * 4, detailsBlock * 2 / 5))
      .attr("font-weight", "bolder")
      .attr("class", "detail")
      .text(data.name)

    // Reign
    var reignString = (data.start + '-' + data.end).replace(/2019/, 'Present'),
      reignFontSize = getFontSizeFromContainer(reignString, (detailsBlock * 1.75) * 4, detailsBlock / 4);
    timeline.append("text")
      .attr("x", detailsX + detailsBlock * 2.5 + detailsBlockEighth)
      .attr("y", detailsY + detailsBlock * 1.25)
      .attr("font-family", fontFamily)
      .attr("font-size", reignFontSize)
      .attr("class", "detail")
      .text(reignString);

    var reignReligionHouseFontSize = _.min(
      _.map([data.religion, data.endReason, data.house], function(text) {
        return getFontSizeFromContainer(text, detailsWidth, detailsBlockQuarter * 2 / 3);
      })
    )

    // House
    timeline.append("text")
      .attr("x", detailsX + detailsBlock * 2.5 + detailsBlockEighth)
      .attr("y", detailsY + detailsBlock * 1.5 + detailsBlockEighth / 2)
      .attr("font-family", fontFamily)
      .attr("font-size", reignReligionHouseFontSize)
      .attr("class", "detail")
      .text("\uD83D\uDEE1\uFE0F " + data.house);

    // Religion
    timeline.append("text")
      .attr("x", detailsX + detailsBlock * 2.5 + detailsBlockEighth)
      .attr("y", detailsY + detailsBlock * 1.75 + detailsBlockEighth / 2)
      .attr("font-family", fontFamily)
      .attr("font-size", reignReligionHouseFontSize)
      .attr("class", "detail")
      .text("\u26EA " + data.religion);

    // Death
    timeline.append("text")
      .attr("x", detailsX + detailsBlock * 2.5 + detailsBlockEighth)
      .attr("y", detailsY + detailsBlock * 2 + detailsBlockEighth / 2)
      .attr("font-family", fontFamily)
      .attr("font-size", reignReligionHouseFontSize)
      .attr("class", "detail")
      .text("\u26B0\uFE0F " + data.endReason)

    // Exit button
    timeline.append("image")
      .attr("x", detailsX + detailsBlock * 4.25 + detailsBlockEighth)
      .attr("y", detailsY + detailsBlockQuarter / 2)
      .attr("width", detailsBlock / 2)
      .attr("height", detailsBlock / 2)
      .attr("xlink:href", "icons/error.png")
      .attr("class", "detail")
      .on("click", hideDetail) 

    var eventsFontSize = _.min(
      _.map(data.events, function(text) {
        return getFontSizeFromContainer(text, (detailsWidth - 2 * detailsBlockQuarter) * 9 / 4, detailsBlockQuarter * 2 / 3);
      })
    )

    var warsFontSize = _.min(
      _.map(data.wars, function(text) {
        return getFontSizeFromContainer(text, (detailsWidth - 2 * detailsBlockQuarter) * 9 / 4, detailsBlockQuarter * 2 / 3);
      }).concat(eventsFontSize)
    )

    // Wars header
    if (data.wars.length > 0) {
      timeline.append("text")
        .attr("x", detailsX + detailsBlockQuarter + detailsBlockEighth)
        .attr("y", detailsY + detailsBlock * 3 + detailsBlockEighth)
        .attr("font-family", fontFamily)
        .attr("font-size", reignFontSize)
        .attr("font-weight", "bolder")
        .attr("class", "detail")
        .text("WARS")

    // Wars background
    // timeline.append("rect")
    //   .attr("x", detailsMiddle - detailsWidth / 2 + detailsBlockQuarter - detailsBlockEighth)
    //   .attr("y", detailsY + detailsBlock * 3.5)
    //   .attr("width", detailsWidth - detailsBlockQuarter * 2)
    //   .attr("height", detailsBlock * data.wars.length / 3)
    //   .attr("fill", '#fef6df')
    //   .attr("class", "detail")
    }

    // Map image
    timeline.append("image")
      .attr("x", detailsMiddle)
      .attr("y", detailsY + detailsBlock * 2.5 + detailsBlockEighth )
      .attr("width", detailsBlock * 2 + detailsBlockEighth)
      .attr("height", detailsBlock * 2 + detailsBlockEighth)
      .attr("xlink:href", data.border)
      .attr("preserveAspectRatio", "none")
      .attr("class", "detail")

    // Wars
    timeline.append("g").selectAll("text")
      .data(data.wars)
      .enter()
      .append("text")
      .attr("x", detailsX + detailsBlockQuarter)
      .attr("y", function(d, i) { return detailsY + detailsBlock * 3.25 + detailsBlockQuarter * (i + 1); })
      .attr("font-family", fontFamily)
      .attr("font-size", warsFontSize)
      .attr("class", "detail")
      .text(function(d) { return d; })
    
    // Events header
    if (data.events.length > 0) {
      timeline.append("text")
        .attr("x", detailsX + detailsBlockQuarter + detailsBlockEighth)
        .attr("y", detailsY + detailsBlock * 4.75 + detailsBlockEighth)
        .attr("font-family", fontFamily)
        .attr("font-size", reignFontSize)
        .attr("font-weight", "bolder")
        .attr("class", "detail")
        .text("EVENTS")
    }

    // Events
    timeline.append("g").selectAll("text")
      .data(data.events)
      .enter()
      .append("text")
      .attr("x", detailsX + detailsBlockQuarter)
      .attr("y", function(d, i) { return detailsY + detailsBlock * 5 + detailsBlockQuarter * (i + 1); })
      .attr("font-family", fontFamily)
      .attr("font-size", eventsFontSize)
      .attr("class", "detail")
      .text(function(d) { return d; })

    // Relationships
    var relationshipCount = data.relationships.length,
      relationshipContainerWidth = detailsWidth - detailsMargin * 2,
      relationshipMaxImageWidth = detailsBlock,
      relationshipImageWidthCalculated = relationshipContainerWidth / relationshipCount / 1.5,
      relationshipImageWidth = Math.min(relationshipMaxImageWidth, relationshipImageWidthCalculated),
      relationshipImagePadding = relationshipImageWidth / 2;

    // i: index
    // c: relationship count
    // m: middle of details overlay
    // W: relationship image width
    // x(i, c) = m - (c - 1) * 0.75W + i * 1.5W - 0.5W
    _.map(data.relationships, function(rel, idx) {
      var relationshipImageX = detailsMiddle - (relationshipCount - 1) * 0.75 * relationshipImageWidth + idx * 1.5 * relationshipImageWidth - 0.5 * relationshipImageWidth;
      var relComponents = rel.split(","),
        relComponentImage = _.pullAt(relComponents, [3])[0] || "img/not_found.png";

      timeline.append("image")
        .attr("x", relationshipImageX)
        .attr("y", detailsRelationshipY + detailsBlockEighth / 2) // Just a little padding between wars and relationships
        .attr("width", relationshipImageWidth)
        .attr("height", relationshipImageWidth)
        .attr("xlink:href", relComponentImage) 
        .attr("class", "detail")

      var relationshipComponentFontSize = _.min(
        _.map(rel.split(","), function(text) {
          return getFontSizeFromContainer(text, detailsWidth, detailsBlockQuarter);
        }).concat([eventsFontSize])
      );

      _.map(relComponents, function(relComponent, idx) {
        timeline.append("text")
          .attr("x", relationshipImageX + relationshipImageWidth / 2)
          .attr("y", detailsRelationshipY + detailsBlock + detailsBlockQuarter * (idx + 1) - detailsBlockEighth / 2 * idx)
          .attr("text-anchor", "middle")
          .attr("font-family", fontFamily)
          .attr("font-size", function() { return idx == 0 ? relationshipComponentFontSize * 1.2 : relationshipComponentFontSize; })
          .attr("class", "detail")
          .text(relComponent);
      });
    });
  }

  function focusDates(data) {
    if (detailsOpen) return false
    var control = d3.select(this),
      controls = timeline.selectAll('circle.control'),
      allOtherControls = timeline.selectAll('circle.control:not(.' + data.key + ')'),
      allDates = timeline.selectAll("circle.date"),
      selectedDates = allDates.filter('.' + data.key),
      allOtherDates = timeline.selectAll('circle.date:not(.' + data.key + ')');

    allDates.classed('hidden', false);

    if (!control.classed("selected")) {
      controls
        .classed("inactive", false)
        .classed("selected", false);
      control.classed("selected", true);
      allOtherControls.classed("inactive", true);
      selectedDates
        .transition()
        .duration(250)
        .attr("r", circleRadiusMedium)
        .transition()
        .attr("r", circleRadiusSmall)
      allOtherDates.classed("hidden", true);
    } else {
      control.classed("selected", false);
      controls.classed('inactive', false);
      allDates
        .transition()
        .duration(250)
        .attr("r", circleRadiusMedium)
        .transition()
        .attr("r", circleRadiusSmall)
    }
  }

  function enlargeCircle(el) {
    if (detailsOpen) return false
    var $this = $(el),
      $r = parseFloat($this.attr('r'));

    this
      .attr("r", $r * 1.25)
      .attr("smallR", this.attr("smallR") || $r)
      .attr("fill-opacity", 0.75);
  }

  function reduceCircle(el) {
    if (detailsOpen) return false
    var $this = $(el),
      $r = parseFloat($this.attr('r'));

    this
      .attr("r", this.attr("smallR"))
      .attr("fill-opacity", 0.5)
  }
};

//////////////////////////////
// Stateless utility functions

// Creates array of objects for a monarch
function formatDetails(el) {
  var data = [];
  _.forEach(el, function(value, key) { return data.push({key: key, value: value}) });
  return data;
}

function enlargeBlock(el) {
  var $this = $(el),
    $x = parseFloat($this.attr('x')),
    $y = parseFloat($this.attr('y')),
    $width = parseFloat(this.attr('width')),
    $height = parseFloat(this.attr('height'));

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


// Given some text and size, how should we draw a container around it?
function getContainerFromText(text, size) {
  var pixelsPerCharacter = pixelsPerCharacterReference[size],
    width = pixelsPerCharacter * text.length,
    height = pixelsPerCharacter * 2;

  return [width, height];
}

// Given a container and text, what size should the font be?
function getFontSizeFromContainer(text, width, height) {
  var maxHeightPixels = height,
    maxWidthPixels = width / text.length * 1,
    pixelSize = Math.floor(_.min([maxHeightPixels, maxWidthPixels]));

  return pixelSize;
}
