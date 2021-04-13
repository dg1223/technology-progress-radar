$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  // Collapses navbar menu if an open area is clicked
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });

  // In Firefox and Safari, the click event doesn't retain the focus
  // on the clicked button. Therefore, the blur event will not fire on
  // user clicking somewhere else in the page and the blur event handler
  // which is set up above will not be called.
  // Refer to issue #28 in the repo.
  // Solution: force focus on the element that the click event fired on
  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
  });
});


(function (global) {

// Show current month and date below the ET radar banner
var dt = new Date();
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
var year = dt.getFullYear();
document.getElementById("date").innerHTML = 
  monthNames[dt.getMonth()].toLocaleString() 
  + " " 
  + year.toLocaleString().replace(/,/g, '');


var dc = {};

var techHtml = "snippets/tech-snippet.html";

// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

// Return substitute of '{{propName}}'
// with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string
    .replace(new RegExp(propToReplace, "g"), propValue);
  return string;
}

// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {

// Automatically generate required number of coordinates //

//*** Count number of technologies in each research phase ***//

// Host JSON file on the web and fetch it using the URL
radarURL = "https://raw.githubusercontent.com/dg1223/storage/master/ETR_clean.json"

$.getJSON( radarURL, function(data){
  var num_technologies = Object.keys(data["Emerging Technology" ]).length;
  var counts = [];
  var tech_indices = [];
  var id, st, rel, pl, ad, adr, red;
  id=st=rel=pl=ad=adr=red=0;
  for (var i=0; i<num_technologies; i++) {
    if (data["KPI Research Phase (Topic)"][i] === "Identify") {
      id += 1;
    } else if (data["KPI Research Phase (Topic)"][i] === "Study") {
      st += 1;
    } else if (data["KPI Research Phase (Topic)"][i] === "Relate") {
      rel += 1;
    } else if (data["KPI Research Phase (Topic)"][i] === "Plan") {
      pl += 1;
    } else if (data["KPI Research Phase (Topic)"][i] === "Adopt") {
      ad += 1;
    } else if (data["KPI Research Phase (Topic)"][i] === "Adopt/Readiness") {
      adr += 1;
    } else if (data["KPI Research Phase (Topic)"][i] === "Readiness"){
      red += 1;
    } else {}
  }
  counts.push({
    "Identify": id,
    "Study": st,
    "Relate": rel,
    "Plan": pl,
    "Adopt": ad,
    "Adopt/Readiness": adr,
    "Readiness": red,
    "total": num_technologies
  })

  console.log(counts[0])

  // get document coordinates of the element
  function getCoords(elem) {
    var box = elem.getBoundingClientRect();

    return {
      top: box.top + window.pageYOffset,
      right: box.right + window.pageXOffset,
      bottom: box.bottom + window.pageYOffset,
      left: box.left + window.pageXOffset,
      height: box.height,
      width: box.width,
      radius: box.height/2,
      centre_x: (box.left + ((box.right-box.left)/2)) + window.pageXOffset,
      centre_y: (box.top + ((box.bottom-box.top)/2)) + window.pageYOffset
    };
  }

  // Find the index of each technology in a given phase
  function findIndices(phase) {
    var Indices = [];
    for (var i = 0; i<num_technologies; i++){
      if (data["KPI Research Phase (Topic)"][i] === phase){
        Indices.push(i)
      }
    }

    return Indices;
  }

  // Track the points we generate to return at the end
  var points = [];

  // Find coordinates within the boundary of an arc
  function findCoordinates(left, top, radius, numpoints, phase) {

    var indices = findIndices(phase);

    // How many points do we want?
    var numberOfPoints = numpoints;

    // Hardcode placement for Adopt-Readiness phase
    // This is based on business justification (BEC/ACO)
    if (phase === "Adopt/Readiness") {
      var adr_x = [810, 960, 865];
      var adr_y = [965, 785, 855];      
      for(var i=0; i < numberOfPoints; i++) {
        var tech_index = indices[i];
        var technology = data["Emerging Technology"][tech_index];
        points.push({
          x: adr_x[i],
          y: adr_y[i],
          tech: technology
        })
      }
    } else {
      // We're only gonna take 70 out 90 degrees to avoid 
      // sine-cosine boundary conditions
      var degreesPerPoint = 70 / numberOfPoints;

      // Keep track of the angle from centre to radius
      var currentAngle = degreesPerPoint;

      // The points on the radius will be left+x2, top+y2
      var x2;
      var y2;

      for(var i=0; i < numberOfPoints; i++) {
        var tech_index = indices[i];
        var technology = data["Emerging Technology"][tech_index];
        // Convert degree to radian
        var radian = currentAngle * Math.PI / 180;
        // X2 will be cosine of angle * radius (range)
        x2 = Math.cos(radian) * radius;
        // Y2 will be sin * range
        y2 = Math.sin(radian) * radius;

        // save to our results array
        if (i%2 === 0) {
          points.push({
            x: left-(x2/1.05),
            y: top-(y2/1.05),
            tech: technology
          });
        } else {
          points.push({
            x: left-(x2/2),
            y: top-(y2/2),
            tech: technology       
          });
        }        

        // Shift our angle around for the next point
        currentAngle += degreesPerPoint;
    }
  }

    // Return the points we've generated
    return points;
}

  // var phases = ["Identify", "Study", "Relate", "Plan", "Adopt", 
  //               "Adopt/Readiness", "Readiness"];

  var phases = ["Adopt/Readiness", "Readiness"];
  // var phase = "Adopt/Readiness";

  // phaseQuery should be a variable that will take each phase in a for loop
  for (var Phase in phases) {
    var cur_phase = phases[Phase];
    if (cur_phase != "Adopt/Readiness") {
      console.log(cur_phase)
      var phaseQuery = "#" + cur_phase;  
      var elem = document.querySelector(phaseQuery);
      var rect = getCoords(elem);

      var x = rect.centre_x;
      var y = rect.centre_y;
      var numPoints = counts[0][cur_phase];
      var point = findCoordinates(x, y, 202.5, numPoints, cur_phase); // radius is constant
    } else {
      console.log(cur_phase)
      // var phaseQuery = "#" + phases[Phase];  
      // var elem = document.querySelector(phaseQuery);
      // var rect = getCoords(elem);
      // var x = rect.centre_x;
      // var y = rect.centre_y;
      var numPoints = counts[0][cur_phase];
      var point = findCoordinates(0, 0, 202.5, numPoints, cur_phase); // radius is hardcoded      
    } // END of if-else
  } // END of for loop
  console.log(point)

  // console.log(point.length)
  // console.log(point[0].tech)

  /*********************** Ajax calls ********************************/
  // Automatically place technologies on the arcs //
  function getRequestObject() {
    if (global.XMLHttpRequest) {
      return (new XMLHttpRequest());
    } 
    else if (global.ActiveXObject) {
      // For very old IE browsers (optional)
      return (new ActiveXObject("Microsoft.XMLHTTP"));
    } 
    else {
      global.alert("Ajax is not supported!");
      return(null); 
    }
  } // END of getRequestObject

  var request = getRequestObject();
  // Modify HTML on the fly; 'onreadystatechange' executes a 
  // function that updates the desired HTML document
  request.onreadystatechange = function() {
    if ((request.readyState == 4) && (request.status == 200)) {
      var myHTML = document.querySelector(".jumbotron").innerHTML;
      for (i = 0; i < point.length; i++){
        var newHTML = buildHTML(request.responseText, i);
        myHTML += newHTML;
        insertHtml(".jumbotron", myHTML)
      }      
      // var jumbotron = document.querySelector(".jumbotron").innerHTML;
      // console.log(jumbotron);
    }
  } // END of onreadystatechange
  request.open("GET", techHtml, true);
  request.send(null);

  // This function makes all the changes to your HTML
  // USE this function to add the icons for each activity type
  function buildHTML (data, iterations) {
    var techID = "t" + iterations.toString();
    var techText = point[i].tech;
    var x_coord = point[i].x;
    var y_coord = point[i].y;
    var htmlToInsert = insertProperty(data, "tech_id", techID);
    htmlToInsert = insertProperty(htmlToInsert, "tech_text", techText);
    htmlToInsert = insertProperty(htmlToInsert, "coord_x", x_coord);
    htmlToInsert = insertProperty(htmlToInsert, "coord_y", y_coord);

    return htmlToInsert;

  } // END of buildHTML
/******************************************************************/

}) // END of getJSON

});


global.$dc = dc;

})(window);
