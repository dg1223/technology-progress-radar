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

  // Count number of technologies in each phase
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

  // Store Study and Relate phases in an array including arc info
  var study = [];
  var relate = [];

  // Create 2d arrays
  for (i=0; i<3; i++) {
    study.push([]);
    relate.push([]);
  }

  for (i=0; i<num_technologies; i++) {
    var arc = data["KPI Research Activity Arc (Topic)"][i];
    var phs = data["KPI Research Phase (Topic)"][i];
    var technology = data["Emerging Technology"][i];

    if (phs === "Study" && arc === "Engage") {
      study[0].push(technology)
    } else if (phs === "Study" && arc === "Watch+Learn") {
      study[1].push(technology)
    } else if (phs === "Study" && arc === "Park") {
      study[2].push(technology)
    } else if (phs === "Relate" && arc === "Engage") {
      relate[0].push(technology)
    } else if (phs === "Relate" && arc === "Watch+Learn") {
      relate[1].push(technology)
    } else if (phs === "Relate" && arc === "Park") {
      relate[2].push(technology)
    }
  }

  // Sort the arrays
  for (i=0; i<3; i++) {
    study[i].sort();
    relate[i].sort();
  }

  console.log(relate)

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

  // Store all angles in an array
  var theta = {"Engage": [], 
               "Watch+Learn": [], 
               "Park": []
              };

  // Calculates the degree values to place each technology name
  function calculateAngle (maxAngle, startAngle, count, 
                           multiplier, arc, numrows) {

    // Keep track of the angle from centre to radius
    var currentAngle = startAngle;
    var passIndicator = 0; // as in 1st pass, 2nd pass

    if (numrows === 2) {
      var degreesPerPoint = maxAngle / (count/2);

      /* Restart calculation after halfway to line up
      the texts in two rows */
      for (var i=0; i < count; i++) {
        if (i < (count/2)) {
          currentAngle += degreesPerPoint*multiplier;
          theta[arc].push(currentAngle);
        } else {
          if (passIndicator === 0) {
            currentAngle = startAngle;
          }
          currentAngle += degreesPerPoint*multiplier;
          theta[arc].push(currentAngle);
          passIndicator = 1;
        } // END of inner if-else
        
      } // END of for loop

    } else if (numrows == 3) {
      var degreesPerPoint = maxAngle / (count/3);

      /* Restart calculation after each third of the count 
      to line up the texts in three rows */
      for (var i=0; i < count; i++) {
        if (i <= (count/3)) {
          currentAngle += degreesPerPoint*multiplier;
          theta[arc].push(currentAngle);
        } else if (i > (count/3) && i <= (2*count/3)) {
          if (passIndicator === 0) {
            currentAngle = startAngle;
          }
          currentAngle += degreesPerPoint*multiplier;
          theta[arc].push(currentAngle);
          passIndicator = 1;
        } else {
          if (passIndicator === 1) {
            currentAngle = startAngle;
          }
          currentAngle += degreesPerPoint*multiplier;
          theta[arc].push(currentAngle);
          passIndicator = 2;
        } // END of inner if-else
        
      } // END of for loop

    } else {
      var degreesPerPoint = maxAngle / count;
      for (var i=0; i < count; i++) {
        // Shift the angle around for the next point
        currentAngle += degreesPerPoint*multiplier;
        theta[arc].push(currentAngle);
      }
    } // END of outer if-else

    // return theta;
  }

  /* Returns an array of degrees based on number of 
  technogies in each arch */
  function storeTheta(numEngage, numWatch, numPark, phase) {

    // console.log(numEngage, numWatch, numPark)    
    var arcs = ["Engage", "Watch+Learn", "Park"];

    for (var Arc in arcs) {
      var arcName = arcs[Arc];
      // console.log(arcName)
      if (arcName === "Engage"){
        if (phase === "Study" || phase === "Relate") {
          calculateAngle(45, 3, numEngage, 0.8, arcName, 2);

        } else {
          calculateAngle(45, 0, numEngage, 0.8, arcName, 1);
        }

      } else if (arcName === "Watch+Learn" && numWatch != 0) {
        calculateAngle(60, 46, numWatch, 0.1, arcName, 2);

      } else if (arcName === "Park" && numPark != 0) {
        calculateAngle(30, 60, numPark, 0.8, arcName, 1);

    } // END of if-else-if    

  } // END of for loop

  // return theta;
}

  // Track the points we generate to return at the end
  var points = [];

  // Find coordinates within the boundary of an arc
  function findCoordinates(left, top, radius, numpoints, phase) {

    var indices = findIndices(phase);

    // How many points do we want? This is the # of technologies
    // var numberOfPoints = numpoints;

    // Hardcode placement for Adopt-Readiness phase
    // This is based on business justification (BEC/ACO)
    if (phase === "Adopt/Readiness") {
      var adr_x = [810, 960, 865];
      var adr_y = [965, 785, 855];      
      for(var i=0; i < numpoints; i++) {
        var tech_index = indices[i];
        var technology = data["Emerging Technology"][tech_index];
        points.push({
          x: adr_x[i],
          y: adr_y[i],
          tech: technology
        })
      } //  END of for loop
    } else if (phase === "Identify" || phase === "Study" 
          || phase === "Relate" || phase === "Plan" ){
          var num_engage = 0;
          var num_watch = 0;
          var num_park = 0;
          for (var i=0; i < numpoints; i++) {
            var tech_index = indices[i];
            var arc = data["KPI Research Activity Arc (Topic)"][tech_index];
            if (arc === "Engage") {
              num_engage += 1;
            } else if (arc === "Watch+Learn") {
              num_watch += 1;
            } else {
              num_park += 1;
            }
          } // END of for loop

          // console.log(numpoints, num_engage, num_watch, num_park)
          // Generate an arc-wise theta (angle) array for this phase
          storeTheta(num_engage, num_watch, num_park, phase);
          // var thetas = storeTheta(num_engage, num_watch, num_park, phase);
          // console.log(thetas);

          // Initialize x-y coordinates and arc counters
          var x2 = 0;
          var y2 = 0;
          var eng = 0;
          var wat = 0;
          var prk = 0;

          for(var i=0; i < numpoints; i++) {
            var tech_index = indices[i];
            var technology = data["Emerging Technology"][tech_index];
            // console.log(technology)
            var arc = data["KPI Research Activity Arc (Topic)"][tech_index];

            if (arc === "Engage") {
              // Convert degree to radian
              // var angle = thetas[arc][eng];
              var angle = theta[arc][eng];
              var radian = angle * Math.PI / 180;
              eng += 1;
            } else if (arc === "Watch+Learn") {
              // console.log(thetas)
              // var angle = thetas[arc][wat];
              var angle = theta[arc][wat];
              var radian = angle * Math.PI / 180;
              wat += 1;
            } else {              
              // var angle = thetas[arc][prk];
              var angle = theta[arc][prk];
              var radian = angle * Math.PI / 180;
              prk += 1;
            }

            
            // x2 will be cosine of angle * radius (range)
            x2 = Math.cos(radian) * radius;
            // y2 will be sin * range
            y2 = Math.sin(radian) * radius; 

            /* We need to offset x-y values to avoid overlaying text 
            on the arc boundary and have enough gap around them to 
            place the icons. No need to do it for the Readiness phase 
            because there's not enough items in it to cause issues */  

            // Create two rows aligning with the arc boundary
            if ( (phase === "Study" || phase === "Relate") 
                 && arc === "Engage" ) {
              if (i <= numpoints/2) {
                var offset_x = 0.01;
                var offset_y = 0.025*i;
                points.push({
                  x: left-(x2/(1.05 + offset_x)),
                  y: top-(y2/(1.01 - offset_y)),
                  tech: technology
                });
              } else {
                points.push({
                  x: left-(x2/1.2),
                  y: top-(y2/1.01),
                  tech: technology       
                });
              }
            } else {
              var offset_x = 0;
              var offset_y = 0.003*i;
              points.push({
                x: left-(x2/(1.03 + offset_x)),
                y: top-(y2/(1.03 - offset_y)),
                // "theta": theta[i],
                tech: technology
              });
            }            
          } // END of for loop
    } else {  // Adopt, Adopt_Readiness and Readiness phases
      var degreesPerPoint = 70 / numpoints;

      // Keep track of the angle from centre to radius
      var currentAngle = degreesPerPoint;

      // The points on the radius will be left+x2, top+y2
      var x2 = 0;
      var y2 = 0;

      for(var i=0; i < numpoints; i++) {
        var tech_index = indices[i];
        var technology = data["Emerging Technology"][tech_index];
        // Convert degree to radian
        var radian = currentAngle * Math.PI / 180;
        // X2 will be cosine of angle * radius (range)
        x2 = Math.cos(radian) * radius;
        // Y2 will be sin * range
        y2 = Math.sin(radian) * radius;

        // Create two rows aligning with the arc boundary
        if (i%2 === 0) {
          if (i === 0 && phase != "Readiness" ) {
            var offset_x = 0.01;        
            var offset_y = 0.4;
          } else {
            var offset_x = 0;
            var offset_y = 0.003*i;
          } // END of inner if-else          
          points.push({
            x: left-(x2/(1.03 + offset_x)),
            y: top-(y2/(1.03 - offset_y)),
            // "theta": theta[i],
            tech: technology
          });
        } else {
          points.push({
            x: left-(x2/1.4),
            y: top-(y2/1.4),
            // "theta": theta[i],
            tech: technology       
          });
        } // END of outer if-else

        // Shift our angle around for the next point
        currentAngle += degreesPerPoint*1.25;

      } // END of for loop
    } // END of outer-most if-else

    // Return the points we've generated
    return points;
  } // END of findCoordinates()

  // var phases = ["Identify", "Study", "Relate", "Plan", "Adopt", 
  //               "Adopt/Readiness", "Readiness"];
  // var radii = [900, 815, 666, 516, 427.5, 202.5, 202.5];

  var phases = ["Identify", "Relate", "Plan", "Adopt", "Adopt/Readiness", "Readiness"];
  var radii = [900, 666, 516, 427.5, 202.5, 202.5];

  // phaseQuery should be a variable that will take each phase in a for loop
  for (var Phase in phases) {
    var cur_phase = phases[Phase];
    var radius = radii[Phase];
    if (cur_phase != "Adopt/Readiness") {
      console.log(cur_phase)
      var phaseQuery = "#" + cur_phase;  
      var elem = document.querySelector(phaseQuery);
      var rect = getCoords(elem);

      var x = rect.centre_x;
      var y = rect.centre_y;
      var numPoints = counts[0][cur_phase];
      // radius is constant
      var point = findCoordinates(x, y, radius, numPoints, cur_phase);
    } else {
      console.log(cur_phase)
      var numPoints = counts[0][cur_phase];
      // x, y, radius arguments don't matter because adopt-readiness phase 
      // placements are constant (hardcoded)
      var point = findCoordinates(0, 0, radius, numPoints, cur_phase);    
    } // END of if-else
  } // END of for loop
  console.log(point)

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
