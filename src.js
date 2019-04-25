$.getJSON("dataset.json", function(data) { render(data) });

// General config
var width = window.innerWidth,
  height = window.innerHeight,
  margin = { top: height / 8, bottom: height / 4, right: width / 12, left: width / 12 };


// Colors
var detailsColor = "#E2D4AC",
  backgroundColor = "#FEF6DF",
  thumbnailBackgroundColor = "#000000",
  thumbnailNameBackgroundColor = "#4E4E4E",
  strokeColor = "#000000",
  dateLineColor = "#858585",
  gray = "#CECECE",
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
      "Bourbon": "#CD06FC",
      "Valois-Angouleme": "#F6D8FD",
      "Valois-Orleans": "#F0BDFC",
      "Bonaparte": "#7E039C",
      "Orleans": "#F0BDFC"
    },
    "Holy Roman Empire": {
      "Habsburg": "#FFA600",
      "Wittelsbach": "#D4C860",
      "Habsburg-Lorraine": "#FF7C00",
      "Lorraine": "#FF4D00",
      "Carolingian": "#785701",
      "Widonid": gray,
      "Bosonid": gray,
      "Unruoching": gray,
      "Ottonian": "#A77901",
      "Salian": "#CB9302",
      "Supplinburg": gray,
      "Staufen": "#D4B360",
      "Welf": gray,
      "Luxembourg": "#B7B698",
    },
    "Spain": {
      "Habsburg": "#FFA600",
      "Bourbon": "#CD06FC",
      "Bonaparte": "#7E039C",
      "Franco": gray,
      "Savoy": "#E0E221"
    },
    "Italy": {
      "Savoy": "#E0E221"
    },
    "Russia": {
      "Rurik": "#450006",
      "Godunov": gray,
      "Shuyskiy": gray,
      "Vasa": gray,
      "Romanov": "#C80012",
      "Holstein-Gottorp-Romanov": "#E40115"
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
    },
    "Prussia": {
      "Hohenzollern": "#1B1B0C"
    }
  },
  dateColors = {
    "science": houseColors["Scotland"]["Stuart"],
    "military": houseColors["Russia"]["Holstein-Gottorp-Romanov"],
    "diplomacy": houseColors["England"]["Hanover"],
    "culture": houseColors["France"]["Bourbon"],
    "philosophy": houseColors["Holy Roman Empire"]["Habsburg"],
    "religion": houseColors["Italy"]["Savoy"],
    "catastrophe": gray
  };

// Fonts
var fontFamily = "Lato, sans-serif",
  strokeWidthLarge = 15,
  strokeWidthMedium = 10,
  strokeWidthSmall = 5,
  strokeWidthTiny = 1,
  cornerRadiusSmall = 5,
  cornerRadiusLarge = 15,
  circleRadiusSmall = 3,
  circleRadiusMedium = 8,
  circleRadiusLarge = 15,
  pixelsPerCharacterReference = { // Somehow calc this from width/height and multiply by sm/md/lg modifier
    "small": 10,
    "medium": 15,
    "large": 20
  };

// Flags
var flags = {
  "England": "img/flags/england.png",
  "Scotland": "img/flags/scotland.png",
  "France": "img/flags/france.png",
  "Spain": "img/flags/spain.png",
  "Holy Roman Empire": "img/flags/hre.png",
  "Russia": "img/flags/russia.jpg",
  "Denmark": "img/flags/denmark.png"
};

// Details config
var detailsHeight = height / 4 * 3,
  detailsWidth = detailsHeight * 2 / 3,
  detailsMargin = detailsHeight / 48,
  detailsHeightInterval = (detailsHeight - 2 * detailsMargin) / 7, // TODO: Be more consistent about this vs. detailsLineHeight
  detailsWidthInterval = (detailsWidth - 2 * detailsMargin) / 12,
  detailsLineHeight = detailsHeightInterval / 4, // Maximum height of a line of text
  detailsX = (width - detailsWidth) / 2,
  detailsY = (height - detailsHeight) / 2,
  detailsMiddle = detailsX + detailsWidth / 2,
  detailsImageHeight = detailsHeightInterval * 2,
  detailsImageWidth = detailsImageHeight,
  detailsImageX = detailsX + detailsWidthInterval,
  detailsImageY        = detailsY + detailsMargin,
  detailsNameY         = detailsY + 2 * detailsHeightInterval + detailsMargin,
  detailsEventsY       = detailsY + 3 * detailsHeightInterval + detailsMargin,
  detailsWarsY         = detailsY + 4 * detailsHeightInterval + detailsMargin,
  detailsRelationshipY = detailsY + 5 * detailsHeightInterval + detailsMargin;

// Thumbnail config
var thumbnailImageWidth = _.max([width / 8, height / 4]),
  thumbnailBorder = 10;

// Date config
var dateHeight = detailsLineHeight,
  dateWidth = dateHeight * 8,
  dateControlInterval = (width - margin.left - margin.right) / (_.size(dateColors) + 1);

function render(data) {

  // Stores dates and remove from data object; render later
  var dates = data["Dates"];
  delete(data["Dates"]);
  delete(data["Italy"]);
  delete(data["Prussia"]);
  delete(data["Austria"]);
  delete(data["Norway"]); // V2: Scandinavia

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

  // Timeline background
  timeline.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", backgroundColor)

  // Title
  timeline.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top)
    .attr("font-size", getFontSizeFromContainer("Monarchs", width / 2, margin.top))
    .attr("text-anchor", "middle")
    .attr("class", "title stonehen-font")
    .text("Monarchs")

  // Link
  timeline.append("a")
    .attr("href", "https://thebackend.dev")
    .append("text")
    .attr("x", width - margin.right / 2)
    .attr("y", height - margin.bottom / 4)
    .attr("font-size", getFontSizeFromContainer("Blogge", width / 2 - margin.right, margin.bottom / 2) / 4)
    .attr("fill", "blue")
    .attr("text-anchor", "middle")
    .attr("class", "title stonehen-font")
    .text("Blogge")

  // Create X-axis
  var xScale = d3.time.scale()
    .domain([firstYear, lastYear]) 
    .range([margin.left, width - margin.right]);

  var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  timeline.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
    .call(xAxis);

  // Add date controls
  timeline.append("g")
    .selectAll("circle")
    .data(_.map(dateColors, function(value, key) { return { key: key, value: value }; }))
    .enter()
    .append("circle")
    .attr("cx", function(d, i) { return margin.left + dateControlInterval / 2 + (i * dateControlInterval); })
    .attr("cy", height - margin.bottom / 2)
    .attr("r", circleRadiusLarge)
    .attr("fill", function (d) { return d.value })
    .attr("fill-opacity", 0.75)
    .attr("class", function(d) { return ['control',  d.key].join(' ') }) 
    .on("click", focusDates)
    .on("mouseover", function(d) { enlargeCircle.bind(d3.select(this))(this); })
    .on("mouseout", function() { reduceCircle.bind(d3.select(this))(this); })
    .append("title").text(function(d) { return d.key })


  // Add dates
  timeline.append("g")
    .selectAll("circle")
    .data(_.map(dates, function(data, year) { return data; }))
    .enter()
    .append("circle")
    .attr("cx", function(d) { return margin.left + (d.date - firstYear) * pixelsPerYear; })
    .attr("cy", height - margin.bottom - laneHeight / 2)
    .attr("r", circleRadiusSmall)
    .attr("fill", function(d) { return dateColors[d.type] })
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
      dateRectHeight = dateTextHeight + dateTextPadding * 2;

    var dateContainer = timeline.append("g").attr("class", "date")


    var dateRect = dateContainer.append("rect")
      .attr("x", margin.left + (data.date - firstYear) * pixelsPerYear - dateRectWidth / 2)
      .attr("y", height - margin.bottom + laneHeight / 2)
      .attr("rx", cornerRadiusSmall)
      .attr("ry", cornerRadiusSmall)
      .attr("width", dateRectWidth)
      .attr("height", detailsLineHeight)
      .attr("fill", dateColors[data.type])
      .attr("fill-opacity", 0.75)
      .attr("stroke", dateColors[data.type])
      .attr("stroke-width", strokeWidthTiny)
      .attr("class", "date ")

    var dateText = dateContainer.append("text")
      .attr("x", margin.left + (data.date - firstYear) * pixelsPerYear)
      .attr("y", height - margin.bottom + laneHeight / 2 + detailsLineHeight * 3 / 4)
      .attr("text-anchor", "middle")
      .attr("class", "date ")
      .text(dateTextString)

    circle.transition().attr("r", circleRadiusMedium)

    dateContainer.append("line")
      .attr("x1", circle.attr("cx"))
      .attr("y1", circle.attr("cy") - laneHeight / 4)
      .attr("x2", circle.attr("cx"))
      .attr("y2", margin.top)
      .attr("stroke", dateLineColor) 
      .attr("stroke-width", strokeWidthTiny)
      .attr("opacity", 0.5)
      .attr("class", "date")
  };

  var legendFontSize = _.min(
    _.map(_.keys(data), function(text) {
      return getFontSizeFromContainer(text, margin.left * 1.5, laneHeight); // Setting 1.5 manually to avoid bug in getFontSizeFromContainer
    })
  )

  // Create country timelines
  _.forEach(data, function(countryData, countryName) {
    countryIndex += 1;

    // Add country name
    timeline.append("image")
      .attr("x", width - margin.right * 2 / 3)
      .attr("y", height - margin.bottom - countryIndex * laneHeight * 2)
      .attr("width", margin.right / 3)
      .attr("height", laneHeight)
      .attr("xlink:href", flags[countryName])
      .attr("preserveAspectRatio", "none")
      .attr("class", "legend")
      .append("title").text(countryName)

    // Add country flag
    timeline.append("text")
      .attr("x", margin.left / 10)
      .attr("y", height - margin.bottom - countryIndex * laneHeight * 2 + laneHeight / 2)
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
      .attr("y", height - margin.bottom - countryIndex * laneHeight * 2)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", function(data) { return houseColors[countryName][data.house] || gray})
      .attr("fill-opacity", 0.75)
      .attr("class", function(data, i) { return ['block', 'block-' + i, countryName].join(' '); })
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
      .attr("rx", cornerRadiusLarge)
      .attr("ry", cornerRadiusLarge)
      .attr("stroke", strokeColor)
      .attr("stroke-width", strokeWidthMedium)
      .on("click", hideDetail)
    });

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
      { // House image
        "x": $x + $width / 2 + thumbnailImageWidth * 3 / 16,
        "y": $y - thumbnailImageWidth - detailsLineHeight + thumbnailImageWidth * 1 / 16,
        "width": thumbnailImageWidth / 4,
        "height": thumbnailImageWidth / 4
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
      .attr("rx", cornerRadiusLarge)
      .attr("ry", cornerRadiusLarge)
      .attr("class", "thumbnail")

    var thumbnailImage = timeline.append("image")
      .attr("x", $x + $width / 2)
      .attr("y", $y + laneHeight / 2)
      .attr("xlink:href", el.image)
      .attr("preserveAspectRatio", "none")
      .attr("class", "thumbnail")

    var thumbnailHouseImage = timeline.append("image")
      .attr("x", $x + $width / 2)
      .attr("y", $y + laneHeight / 2)
      .attr("xlink:href", el.houseImage)
      .attr("class", "thumbnail")

    var thumbnailNameBackground = timeline.append("rect")
      .attr("x", $x + $width / 2)
      .attr("y", $y + laneHeight / 2)
      .attr("fill", backgroundColor)
      .attr("rx", cornerRadiusLarge)
      .attr("ry", cornerRadiusLarge)
      .attr("stroke", strokeColor)
      .attr("stroke-width", strokeWidthTiny)
      .attr("class", "thumbnail")

    var thumbnailName = timeline.append("text")
      .attr("x", $x + $width / 2)
      .attr("y", $y + laneHeight / 2)
      .attr("font-family", fontFamily)
      .attr("font-size", getFontSizeFromContainer(el.name, thumbnailDimensions[3]["width"] * 1.5, thumbnailDimensions[3]["height"] * 2 / 3))
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

  function showDetail(data, i) {
    if (detailsOpen) return false
    if (!data.endReason) return false // For now, don't show details for monarchs without much data
    
    var currentBlock = d3.select(this);

    timeline.selectAll('.block').classed('inactive', true);
    timeline.selectAll('.legend').classed('inactive', true);
    timeline.selectAll('.title').classed('inactive', true);
    timeline.selectAll('.axis').classed('inactive', true);
    timeline.selectAll('.date').classed('inactive', true);
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
          x: detailsMiddle - detailsWidth / 2 - detailsWidthInterval / 2 - arrowWidth / 2,
          y: height / 2
        },
        two: {
          x: detailsMiddle - detailsWidth / 2 - detailsWidthInterval / 2,
          y: height / 2 - arrowWidth / 2
        },
        three: {
          x: detailsMiddle - detailsWidth / 2 - detailsWidthInterval / 2,
          y: height / 2 + arrowWidth / 2
        }
      },
      prevArrowPoints = [prevArrowCoord.one.x + ',' + prevArrowCoord.one.y, prevArrowCoord.two.x + ',' + prevArrowCoord.two.y, prevArrowCoord.three.x + ',' + prevArrowCoord.three.y].join(" "),
      nextArrowCoord = {
        one: {
          x: detailsMiddle + detailsWidth / 2 + detailsWidthInterval / 2 + arrowWidth / 2,
          y: height / 2
        },
        two: {
          x: detailsMiddle + detailsWidth / 2 + detailsWidthInterval / 2,
          y: height / 2 - arrowWidth / 2
        },
        three: {
          x: detailsMiddle + detailsWidth / 2 + detailsWidthInterval / 2,
          y: height / 2 + arrowWidth / 2
        }
      },
      nextArrowPoints = [nextArrowCoord.one.x + ',' + nextArrowCoord.one.y, nextArrowCoord.two.x + ',' + nextArrowCoord.two.y, nextArrowCoord.three.x + ',' + nextArrowCoord.three.y].join(" ");

    // Next
    timeline.append("path") // UX TODO: Hide arrows if nextBlock.empty?
      .attr("d", "M " + nextArrowPoints + " Z")
      .attr("width", detailsWidth / 4)
      .attr("height", detailsWidth / 4)
      .attr("fill", detailsColor)
      .attr("stroke", strokeColor)
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

    timeline.append("path")
      .attr("d", "M " + prevArrowPoints + " Z")
      .attr("width", detailsWidth / 4)
      .attr("height", detailsWidth / 4)
      .attr("fill", detailsColor)
      .attr("stroke", strokeColor)
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
      .attr("x", detailsMiddle - detailsImageWidth / 2)
      .attr("y", detailsImageY)
      .attr("rx", cornerRadiusLarge)
      .attr("ry", cornerRadiusLarge)
      .attr("width", detailsImageWidth)
      .attr("height", detailsImageHeight)
      .attr("fill", thumbnailBackgroundColor)
      .attr("class", "detail")
    // Monarch image
    timeline.append("image")
      .attr("x", detailsMiddle - detailsImageWidth / 2 + strokeWidthMedium)
      .attr("y", detailsImageY + strokeWidthMedium)
      .attr("width", detailsImageWidth - 2 * strokeWidthMedium)
      .attr("height", detailsImageHeight - 2 * strokeWidthMedium)
      .attr("xlink:href", data.image)
      .attr("preserveAspectRatio", "none")
      .attr("class", "detail")

    // House image
    timeline.append("image")
      .attr("x", detailsMiddle + detailsImageWidth * 3 / 16)
      .attr("y", detailsImageY + strokeWidthMedium + detailsImageHeight * 1 / 16)
      .attr("width", detailsImageWidth / 4)
      .attr("height", detailsImageHeight / 4)
      .attr("xlink:href", data.houseImage)
      .attr("class", "detail")

    // Name
    timeline.append("text")
      .attr("x", detailsMiddle)
      .attr("y", detailsNameY + detailsLineHeight)
      .attr("text-anchor", "middle")
      .attr("font-family", fontFamily)
      .attr("font-size", getFontSizeFromContainer(data.name, detailsWidth, detailsLineHeight))
      .attr("font-weight", "bolder")
      .attr("class", "detail")
      .text(data.name);

    // Reign
    var reignString = data.start + " - " + data.end + " (" + data.endReason + ")",
      reignReligionHouseFontSize = _.min(
        _.map([data.religion, reignString, data.house], function(text) {
          return getFontSizeFromContainer(text, detailsImageWidth * 4, (detailsHeightInterval - detailsLineHeight) * 2 / 9);
        })
      )

    timeline.append("text")
      .attr("x", detailsMiddle)
      .attr("y", detailsNameY + detailsLineHeight + (detailsHeightInterval - detailsLineHeight) * 1 / 3)
      .attr("text-anchor", "middle")
      .attr("font-family", fontFamily)
      .attr("font-size", reignReligionHouseFontSize)
      .attr("class", "detail")
      .text(reignString)

    // Religion
    timeline.append("text")
      .attr("x", detailsMiddle)
      .attr("y", detailsNameY + detailsLineHeight + (detailsHeightInterval - detailsLineHeight) * 2 / 3)
      .attr("text-anchor", "middle")
      .attr("font-family", fontFamily)
      .attr("font-size", reignReligionHouseFontSize)
      .attr("class", "detail")
      .text(data.religion);

    // House
    timeline.append("text")
      .attr("x", detailsMiddle)
      .attr("y", detailsNameY + detailsLineHeight + (detailsHeightInterval - detailsLineHeight) * 3 / 3)
      .attr("text-anchor", "middle")
      .attr("font-family", fontFamily)
      .attr("font-size", reignReligionHouseFontSize)
      .attr("font-weight", "bolder")
      .attr("class", "detail")
      .text(data.house);

    // The `detailsImageWidth * 4` is purposefully wider than the details container to avoid bug in getFontSizeFromContainer
    var eventsAndWarsFontSize = _.min(
      _.map(data.events.concat(data.wars), function(text) {
        return getFontSizeFromContainer(text, detailsImageWidth * 4, (detailsHeightInterval - detailsLineHeight) * 2 / 9);
      })
    )

    // Events
    if (!_.isEmpty(data.events)) {
      timeline.append("text")
        .attr("x", detailsMiddle)
        .attr("y", detailsEventsY + detailsLineHeight)
        .attr("text-anchor", "middle")
        .attr("font-family", fontFamily)
        .attr("font-size", getFontSizeFromContainer("Events", detailsImageWidth, detailsLineHeight))
        .attr("font-weight", "bolder")
        .attr("class", "detail")
        .text("Events")

      timeline.append("g").selectAll("text")
        .data(data.events)
        .enter()
        .append("text")
        .attr("x", detailsImageX)
        .attr("y", function(d, i) { return detailsEventsY + detailsLineHeight + (detailsHeightInterval - detailsLineHeight) * (1 + i) / 3; })
        .attr("font-family", fontFamily)
        .attr("font-size", eventsAndWarsFontSize)
        .attr("class", "detail")
        .text(function(d) { return d; })
    }

    // Wars
    if (!_.isEmpty(data.wars)) {
      timeline.append("text")
        .attr("x", detailsMiddle)
        .attr("y", detailsWarsY + detailsLineHeight)
        .attr("text-anchor", "middle")
        .attr("font-family", fontFamily)
        .attr("font-size", getFontSizeFromContainer("Wars", detailsImageWidth, detailsLineHeight))
        .attr("font-weight", "bolder")
        .attr("class", "detail")
        .text("Wars")

      timeline.append("g").selectAll("text")
        .data(data.wars)
        .enter()
        .append("text")
        .attr("x", detailsImageX)
        .attr("y", function(d, i) { return detailsWarsY + detailsLineHeight + (detailsHeightInterval - detailsLineHeight) * (1 + i) / 3; })
        .attr("font-family", fontFamily)
        .attr("font-size", eventsAndWarsFontSize)
        .attr("class", "detail")
        .text(function(d) { return d; })
    }
    
    // Relationships
    // 1/8i: padding
    // 1i: image
    // 1/8i: padding
    // 1/4i: each relationship component (3)
    var relationshipCount = data.relationships.length,
      relationshipContainerWidth = detailsWidth - detailsMargin * 2,
      relationshipMaxImageWidth = detailsHeightInterval,
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
        .attr("y", detailsRelationshipY + detailsHeightInterval / 8) // Just a little padding between wars and relationships
        .attr("width", relationshipImageWidth)
        .attr("height", relationshipImageWidth)
        .attr("xlink:href", relComponentImage) 
        .attr("class", "detail")

      var relationshipComponentFontSize = _.min(
        _.map(rel.split(","), function(text) {
          return getFontSizeFromContainer(text, detailsImageWidth * 2, detailsHeightInterval / 8);
        })
      );

      _.map(relComponents, function(relComponent, idx) {
        timeline.append("text")
          .attr("x", relationshipImageX + relationshipImageWidth / 2)
          .attr("y", detailsRelationshipY + relationshipImageWidth + detailsHeightInterval * (idx + 2) / 8)
          .attr("text-anchor", "middle")
          .attr("font-family", fontFamily)
          .attr("font-size", relationshipComponentFontSize)
          .attr("class", "detail")
          .text(relComponent);
      });
    });
  }

  function focusDates(data) {
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

function enlargeCircle(el) {
  var $this = $(el),
    $r = parseFloat($this.attr('r'));

  this
    .attr("r", $r * 1.25)
    .attr("smallR", this.attr("smallR") || $r)
    .attr("fill-opacity", 1.0);
}

function reduceCircle(el) {
  var $this = $(el),
    $r = parseFloat($this.attr('r'));

  this
    .attr("r", this.attr("smallR"))
    .attr("fill-opacity", 0.75)
}

// Given some text and size, how should we draw a container around it?
function getContainerFromText(text, size) {
  var pixelsPerCharacter = pixelsPerCharacterReference[size],
    width = pixelsPerCharacter * text.length,
    height = pixelsPerCharacter;

  return [width, height];
}

// Given a container and text, what size should the font be?
function getFontSizeFromContainer(text, width, height) {
  var maxHeightPixels = height,
    maxWidthPixels = width / text.length * 1,
    // Bug: somehow width-bounding scales the text WAAAAY down for longer texts
    // I think it has to do with the proportion of width to height, so that fudge factor should be derived from those
    pixelSize = Math.floor(_.min([maxHeightPixels, maxWidthPixels]));

  // console.log(text + " => (" + maxWidthPixels + ", " + maxHeightPixels + ")");

  return pixelSize;
}

