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
radarURL = "https://raw.githubusercontent.com/dg1223/tech-radar/gh-pages/ETR_clean.json"

$.getJSON( radarURL, function(data){

  // Remove duplicate technology names and store in an array
  var techs = Object.values(data["Emerging Technology"]);
  var temp = [];
  var ind = [];
  var len_tech = techs.length;
  for (var i=0; i<len_tech; i++) {
    if (temp.includes(techs[i])) {
      continue;
    } else {
      temp.push(techs[i]);
      ind.push(i);
    }    
  }

  // newArray will hold a consolidated version of the registry
  var newArray = [];
  var arrLen = Object.values(data).length;
  
  for (var i=0; i<arrLen; i++) {
    var column = Object.keys(data)[i];
    newArray.push({ [column]: [] });
    for (var index in ind) {
      original_ind = ind[index];
      newArray[i][column].push(Object.values(data)[i][original_ind])
    }
  } // END of remove duplicate

  // console.log(Object.values(data["Activity Type"]))

  // Count number of technologies in each phase
  var num_technologies = Object.keys(data["Emerging Technology"]).length;
  var counts = [];
  var id, st, rel, pl, ad, adr, red;
  id=st=rel=pl=ad=adr=red=0;
  for (var i=0; i<temp.length; i++) {
    if (newArray[1]["KPI Research Phase (Topic)"][i] === "Identify") {
      id += 1;
    } else if (newArray[1]["KPI Research Phase (Topic)"][i] === "Study") {
      st += 1;
    } else if (newArray[1]["KPI Research Phase (Topic)"][i] === "Relate") {
      rel += 1;
    } else if (newArray[1]["KPI Research Phase (Topic)"][i] === "Plan") {
      pl += 1;
    } else if (newArray[1]["KPI Research Phase (Topic)"][i] === "Adopt") {
      ad += 1;
    } else if (newArray[1]["KPI Research Phase (Topic)"][i] === "Adopt/Readiness") {
      adr += 1;
    } else if (newArray[1]["KPI Research Phase (Topic)"][i] === "Readiness"){
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
    "total": temp.length
  })

  // console.log(counts[0])

  // Store Study, Relate and Plan phases in an array including arc info
  var identify = [];
  var study = [];
  var relate = [];
  var plan = [];

  // Create 2d arrays
  for (i=0; i<3; i++) {
    identify.push([]);
    study.push([]);
    relate.push([]);
    plan.push([]);
  }

  for (i=0; i<temp.length; i++) {
    var arc = newArray[2]["KPI Research Activity Arc (Topic)"][i];
    var phs = newArray[1]["KPI Research Phase (Topic)"][i];
    var technology = newArray[0]["Emerging Technology"][i];

    if (phs === "Identify" && arc === "Engage") {
      identify[0].push(technology)
    } else if (phs === "Identify" && arc === "Watch+Learn") {
      identify[1].push(technology)
    } else if (phs === "Identify" && arc === "Park") {
      identify[2].push(technology)
    } else if (phs === "Study" && arc === "Engage") {
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
    } else if (phs === "Plan" && arc === "Engage") {
      plan[0].push(technology)
    } else if (phs === "Plan" && arc === "Watch+Learn") {
      plan[1].push(technology)
    } else if (phs === "Plan" && arc === "Park") {
      plan[2].push(technology)
    }
  }

  // Sort the arrays
  for (i=0; i<3; i++) {
    identify[i].sort();
    study[i].sort();
    relate[i].sort();
    plan[i].sort();
  }

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
    for (var i = 0; i<temp.length; i++){
      if (newArray[1]["KPI Research Phase (Topic)"][i] === phase){
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
      var degreesPerPoint = maxAngle / (count/numrows);

      /* Restart calculation after halfway to line up
      the texts in two rows */
      for (var i=0; i < count; i++) {
        if (i < (count/numrows)) {      
          theta[arc].push(currentAngle);
          currentAngle += degreesPerPoint*multiplier;
        } else {
          if (passIndicator === 0) {
            currentAngle = startAngle;
          }          
          theta[arc].push(currentAngle);
          currentAngle += degreesPerPoint*multiplier;
          passIndicator = 1;
        } // END of inner if-else
        
      } // END of for loop

    } else if (numrows == 3) {
      var degreesPerPoint = maxAngle / (count/numrows);

      /* Restart calculation after each third of the count 
      to line up the texts in three rows */
      if (arc === "Park") {
        var Quarter1 = (count/numrows);
        var Quarter2 = (2*count/numrows);
      } else {
        var Quarter1 = (count/numrows) + (count*0.05);
        var Quarter2 = (2*count/numrows) + (count*0.1);
      }
      
      // console.log("calculateAngle: Q1 = ", Quarter1+", Q2 = ", Quarter2+", arc = ", arc)

      for (var i=0; i < count; i++) {
        if ( i < Quarter1 ) {
          theta[arc].push(currentAngle);
          currentAngle += degreesPerPoint*multiplier;

        } else if (i >= Quarter1 && i < Quarter2) {
          if (passIndicator === 0) {
            currentAngle = startAngle;
          }          
          theta[arc].push(currentAngle);
          currentAngle += degreesPerPoint*multiplier;
          passIndicator = 1;

        } else {
          if (passIndicator === 1) {
            currentAngle = startAngle;
          }          
          theta[arc].push(currentAngle);
          currentAngle += degreesPerPoint*multiplier;
          passIndicator = 2;
        } // END of inner if-else
        
      } // END of for loop

    } else {
      var degreesPerPoint = maxAngle / count;
      for (var i=0; i < count; i++) {
        // Shift the angle around for the next point        
        theta[arc].push(currentAngle);
        currentAngle += degreesPerPoint*multiplier;
      }
    } // END of outer if-else
  }

  /* Returns an array of degrees based on number of 
  technogies in each arch */
  function storeTheta(numEngage, numWatch, numPark, phase) {  
    var arcs = ["Engage", "Watch+Learn", "Park"];

    for (var Arc in arcs) {
      var arcName = arcs[Arc];
      if (arcName === "Engage"){
        if (phase === "Study") {
          calculateAngle(45, 5, numEngage, 0.8, arcName, 3);

        } else if (phase === "Relate") {
          calculateAngle(45, 7, numEngage, 0.7, arcName, 2);

        } else {  // Identify, Plan, Adopt, Readiness
          calculateAngle(45, 10, numEngage, 0.8, arcName, 1);
        }

      } else if (arcName === "Watch+Learn" && numWatch != 0) {
        calculateAngle(60, 50, numWatch, 0.1, arcName, 2);

      } else if (arcName === "Park" && numPark != 0) {
        if (phase === "Study") {
          calculateAngle(38, 58, numPark, 0.85, arcName, 3);

        } else if (phase === "Relate" && numPark != 0) {
          calculateAngle(38, 60, numEngage, 0.8, arcName, 2);

        } else {
          calculateAngle(30, 65, numPark, 0.8, arcName, 1);
        }
      } // END of if-else-if
    } // END of for loop
  }

  // Count number of activities for each technology
  var allTechActivities = Object.values(data["Emerging Technology"]);

  function numberOfActivities(tech) {
    var count = 0;    
    allTechActivities.forEach((v) => (v === tech && count++));
    return count;
  }

  // Track the points we generate to return at the end
  var points = [];

  // Find coordinates within the boundary of an arc
  function findCoordinates(left, top, radius, numpoints, phase) {

    var indices = findIndices(phase);

    // Hardcode placements for Adopt-Readiness phase
    // This is based on business justification (BEC/ACO)
    if (phase === "Adopt/Readiness") {
      // adr means adopt-readiness
      var adr_x = [810, 960, 815, 845];
      var adr_y = [965, 785, 915, 865];      
      for(var i=0; i < numpoints; i++) {
        var tech_index = indices[i];
        var technology = newArray[0]["Emerging Technology"][tech_index];
        var activities = numberOfActivities(technology);
        points.push({
          x: adr_x[i],
          y: adr_y[i],
          tech: technology,
          phase,
          arc,
          activity: activities
        })
      } //  END of for loop
    } else if (phase === "Identify" || phase === "Study" 
               || phase === "Relate" || phase === "Plan" ) {
          var num_engage = 0;
          var num_watch = 0;
          var num_park = 0;
          for (var i=0; i < numpoints; i++) {
            var tech_index = indices[i];
            var arc = newArray[2]["KPI Research Activity Arc (Topic)"][tech_index];
            if (arc === "Engage") {
              num_engage += 1;
            } else if (arc === "Watch+Learn") {
              num_watch += 1;
            } else {
              num_park += 1;
            }
          } // END of for loop

          // Generate an arc-wise theta (angle) array for this phase
          storeTheta(num_engage, num_watch, num_park, phase);

          // Initialize x-y coordinates and arc counters
          var x2 = 0;
          var y2 = 0;
          var eng = 0;
          var wat = 0;
          var prk = 0;

          function finalCoordinate(off_X, off_Y, div_X, div_Y, Tech, Phase, Arc) {
            var offset_x = off_X;
            var offset_y = off_Y;
            var activities = numberOfActivities(Tech);
            points.push({
              x: left-(x2/(div_X + offset_x)),
              y: top-(y2/(div_Y - offset_y)),
              tech: Tech,
              phase: Phase,
              arc: Arc,
              activity: activities
            });          
          }

          var arcs = ["Engage", "Watch+Learn", "Park"];

          if (phase === "Study"){

            // Loop over each arc first
            var len_s = study.length;
            for (var i=0; i < len_s; i++) {
              var arc = arcs[i];
              var Length = study[i].length;
              // console.log(arc+",", Length)

              // Create multiple rows within the arc-phase space
              if (arc === "Park") {
                var Quarter1 = (Length/3);
                var Quarter2 = (2*Length/3);
              } else {
                var Quarter1 = (Length/3) + (Length*0.05);
                var Quarter2 = (2*Length/3) + (Length*0.1);
              }
              
              console.log("\nPhase = ", phase+", arc = ", arc) //+", length = ", Length)
              // console.log("Q1 = ", Quarter1+", Q2 = ", Quarter2)
              var firstPass = "Y";

              for(var j=0; j < Length; j++) {
                var technology = study[i][j];
                var angle = theta[arc][j];
                var radian = angle * Math.PI / 180;

                console.log(j+":", technology+", angle: ", angle)

                // x2 will be cosine of angle * radius (range)
                x2 = Math.cos(radian) * radius;
                // y2 will be sine  of angle  * range
                y2 = Math.sin(radian) * radius;

                // Decouple smaller arcs like watch+learn from others               
                if (Length <= 6) {
                  // console.log("length less than 6, j = ", j)
                  if (j%2 === 0) {
                    finalCoordinate(0.02, 0.01, 1, 1, technology, phase, arc);
                  } else if (j%2 === 1 ) {
                    finalCoordinate(0.013, 0.02, 1.1, 1.05, technology, phase, arc);
                  } else {
                    finalCoordinate(0.013, 0.02, 1.2, 1.2, technology, phase, arc);
                  }                  
                } else {
                  if (j < Quarter1 ) {
                    // console.log("numpoints/3 = "+ numpoints/3)
                    if (j === 0) {
                      finalCoordinate(0.02, 0.02, 1.01, 1.01, technology, phase, arc);

                    } else {
                      finalCoordinate(0.02, 0.01, 1, 1, technology, phase, arc);
                    }
                  } else if (j >= Quarter1 && j < Quarter2) {
                    if (firstPass === "Y") {
                      var k = 0.4;
                    }
                    // Reset indicator for next row (else statement)
                    if ( (j+1) > Quarter2 ) {
                      firstPass = "Y";
                    }
                    if (arc === "Park") {
                      finalCoordinate(0.25*k, -0.05, 1.01, 1.01, technology, phase, arc);
                      k += 0.4;
                      firstPass = "N";
                    } else {
                      finalCoordinate(0.013*k, 0.01, 1.1, 1, technology, phase, arc);
                      k += 0.4;
                      firstPass = "N";
                    }
                  } else {
                    if (firstPass === "Y") {
                      var k = 0.4;
                    }
                    if (arc === "Park") {
                      finalCoordinate(0.05*k, -0.05, 1.1, 1.1, technology, phase, arc);
                      k += 0.4;
                      firstPass = "N";
                    } else {
                      finalCoordinate(0.013, 0.12, 1.2, 1.2, technology, phase, arc);
                      firstPass = "N";
                    }                    
                  }
                } // END of outer if-else                 
              } // END of inner for loop
            } // END of outer for loop

          } else if (phase === "Relate") {
            // Loop over each arc first
            var len_r = relate.length;
            for (var i=0; i < len_r; i++) {
              var arc = arcs[i];
              var Length = relate[i].length;

              console.log("\nPhase = ", phase+", arc = ", arc)

              for(var j=0; j < Length; j++) {
                var technology = relate[i][j];
                var angle = theta[arc][j];
                var radian = angle * Math.PI / 180;

                console.log(j+":", technology+", angle: ", angle)

                // x2 will be cosine of angle * radius (range)
                x2 = Math.cos(radian) * radius;
                // y2 will be sine  of angle  * range
                y2 = Math.sin(radian) * radius;

                // Decouple smaller arcs such as watch+learn from others               
                if (arc === "Watch+Learn") {
                  // console.log("length less than 6, j = ", j)
                  if (j%2 === 0) {
                    finalCoordinate(0.07, 0.04, 1, 1, technology, phase, arc);
                  } else if (j%2 === 1 ) {
                    finalCoordinate(0.1, 0.01, 1.1, 1.05, technology, phase, arc);
                  } else {
                    finalCoordinate(0.013, 0.02, 1.2, 1.2, technology, phase, arc);
                  }                  
                } else {
                  if (j < Length/2 ) {
                    if (j === 0) {
                      if (arc === "Park") {
                        finalCoordinate(0.15, 0.02, 1.01, 1.01, technology, phase, arc);
                      } else {
                        finalCoordinate(0.02, 0.02, 1.01, 1.01, technology, phase, arc);
                      }                      
                    } else {
                      finalCoordinate(0.02*j, 0.025*j, 1.01, 1.01, technology, phase, arc);
                    }
                  } else {
                    finalCoordinate(0.012*j, 0.001*j, 1.12, 1.05, technology, phase, arc);
                  }
                }                
              } // END of inner for loop
            } // END of outer for loop

          /* Phase is either Identify or Plan */
          } else if (phase === "Plan") {
            // Loop over each arc first
            var len_p = plan.length;
            for (var i=0; i < len_p; i++) {
              var arc = arcs[i];
              var Length = plan[i].length;

              console.log("\nPhase = ", phase+", arc = ", arc)

              for(var j=0; j < Length; j++) {
                var technology = plan[i][j];
                var angle = theta[arc][j];
                var radian = angle * Math.PI / 180;

                console.log(j+":", technology+", angle: ", angle)

                // x2 will be cosine of angle * radius (range)
                x2 = Math.cos(radian) * radius;
                // y2 will be sine  of angle  * range
                y2 = Math.sin(radian) * radius;

                if (j === 0) {
                    finalCoordinate(0.02, 0.003, 1.03, 1, technology, phase, arc)
                  } else {
                    finalCoordinate(0.02, 0.003*j, 1.03, 1, technology, phase, arc)
                  }
                } // END of inner for loop
              } // END of outer for loop
            // END of Plan

            } else {                          // Identify phase
            // Loop over each arc first
            var len_i = identify.length;
            for (var i=0; i < len_i; i++) {
              var arc = arcs[i];
              var Length = identify[i].length;

              console.log("\nPhase = ", phase+", arc = ", arc)

              for(var j=0; j < Length; j++) {
                var technology = identify[i][j];
                var angle = theta[arc][j];
                var radian = angle * Math.PI / 180;

                console.log(j+":", technology+", angle: ", angle)

                // x2 will be cosine of angle * radius (range)
                x2 = Math.cos(radian) * radius;
                // y2 will be sine  of angle  * range
                y2 = Math.sin(radian) * radius;

                if (j === 0) {
                    finalCoordinate(0, 0.003, 1.03, 1.03, technology, phase, arc)
                  } else {
                    finalCoordinate(-0.01, 0.005*j, 1.03, 1.03, technology, phase, arc)
                  }
                } // END of inner for loop
              } // END of outer for loop
            } // END of Identify
        // END of Identify, Study, Relate, Plan

        /* Phases are Adopt and Readiness */
        } else {
          console.log("\nPhase = ", phase+", arc = ", arc)
          var degreesPerPoint = 70 / numpoints;

          // Keep track of the angle from centre to radius
          var currentAngle = degreesPerPoint;

          // The points on the radius will be left+x2, top+y2
          var x2 = 0;
          var y2 = 0;

          for(var i=0; i < numpoints; i++) {
            var tech_index = indices[i];
            var technology = newArray[0]["Emerging Technology"][tech_index];
            activities = numberOfActivities(technology);

            console.log(i+":", technology+", angle: ", currentAngle)

            // Convert degree to radian
            var radian = currentAngle * Math.PI / 180;
            // X2 will be cosine of angle * radius (range)
            x2 = Math.cos(radian) * radius;
            // Y2 will be sin * range
            y2 = Math.sin(radian) * radius;

            // Create two rows aligning with the arc boundary
            if (i%2 === 0) {
              if (i === 0 && phase != "Readiness" ) {
                var offset_x = 0.03;        
                var offset_y = 0.55;
              } else {
                var offset_x = 0;
                var offset_y = 0.002*i;
              } // END of inner if-else          
              points.push({
                x: left-(x2/(1.03 + offset_x)),
                y: top-(y2/(1.03 - offset_y)),
                tech: technology,
                phase,
                arc,
                activity: activities
              });
            } else {
              points.push({
                x: left-(x2/1.4),
                y: top-(y2/1.3),
                tech: technology,
                phase,
                arc,
                activity: activities
              });
            } // END of if-else

            // Shift the angle around for the next point
            currentAngle += degreesPerPoint*1.25;

          } // END of for loop
        } // END of outermost if-else

    // Return the points we've generated
    return points;
  } // END of findCoordinates()

  // console.log(points)

  /**/
  /** PLACE TECHNOLOGIES ON THE CANVAS **/
  /**/
  var phases = ["Identify", "Study", "Relate", "Plan", "Adopt", 
                "Adopt/Readiness", "Readiness"];
  var radii = [928, 845, 666, 516, 427.5, 202.5, 202.5];

  /* Loop over each phase to place the technologies on the canvas */
  for (var Phase in phases) {
    var cur_phase = phases[Phase];
    var radius = radii[Phase];
    if (cur_phase != "Adopt/Readiness") {
      // console.log(cur_phase)
      var phaseQuery = "#" + cur_phase;  
      var elem = document.querySelector(phaseQuery);
      var rect = getCoords(elem);

      var x = rect.centre_x;
      var y = rect.centre_y;
      var numPoints = counts[0][cur_phase];
      var point = findCoordinates(x, y, radius, numPoints, cur_phase);

      // Clear array before pushing new values
      theta = {"Engage": [],"Watch+Learn": [],"Park": []};

    } else {
      // console.log(cur_phase)
      var numPoints = counts[0][cur_phase];
      /* x, y, radius arguments don't matter here because adopt-readiness  
      phase placements are constant (hardcoded) */
      var point = findCoordinates(0, 0, radius, numPoints, cur_phase);

      theta = {"Engage": [],"Watch+Learn": [],"Park": []};

    } // END of if-else
  } // END of for loop
  // console.log(point)


  /*********************** Ajax calls ********************************/
  
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

  function calculateMargin(Height, Width, HTML) {
    if (Height < 14) { // 1 row of text
      HTML = insertProperty(HTML, "m_top", Height*0.9);
      HTML = insertProperty(HTML, "m_left", Width*0.56);

    } else if (Height >= 14 && Height < 27) { // 2 rows of text
      HTML = insertProperty(HTML, "m_top", Height*0.787);
      HTML = insertProperty(HTML, "m_left", Width*0.749);

    } else if (Height >= 39 && Height < 41) { // 3 rows of text
      HTML = insertProperty(HTML, "m_top", Height*0.85);

      if (Width < 40) {
        HTML = insertProperty(HTML, "m_left", Width*0.895);

      } else if (Width >= 40 && Width < 80) {
        HTML = insertProperty(HTML, "m_left", Width*0.69);

      } else {
        HTML = insertProperty(HTML, "m_left", Width*0.641);
      }

    } else { // Height >= 41; // 4 rows of text
      HTML = insertProperty(HTML, "m_top", Height*0.825);

      if (Width < 40) {
        HTML = insertProperty(HTML, "m_left", Width*0.969);

      } else {
        HTML = insertProperty(HTML, "m_left", Width*0.8);
      }
    }
    return HTML;
  }

  function insertProperty2(HTML, activity, char,
                           btwidth, btstyle, btcol,
                           brwidth, brstyle, brcol,
                           bbwidth, bbstyle, bbcol,
                           blwidth, blstyle, blcol,
                           colour, radius, degree,
                           pcolour, Font) {
    var HTML = insertProperty(HTML, "activity", activity);
    HTML = insertProperty(HTML, "char", char);
    HTML = insertProperty(HTML, "btwidth", btwidth);
    HTML = insertProperty(HTML, "btstyle", btstyle);
    HTML = insertProperty(HTML, "btcol", btcol);
    HTML = insertProperty(HTML, "brwidth", brwidth);
    HTML = insertProperty(HTML, "brstyle", brstyle);
    HTML = insertProperty(HTML, "brcol", brcol);
    HTML = insertProperty(HTML, "bbwidth", bbwidth);
    HTML = insertProperty(HTML, "bbstyle", bbstyle);
    HTML = insertProperty(HTML, "bbcol", bbcol);
    HTML = insertProperty(HTML, "blwidth", blwidth);
    HTML = insertProperty(HTML, "blstyle", blstyle);
    HTML = insertProperty(HTML, "blcol", blcol);
    HTML = insertProperty(HTML, "colour", colour);
    HTML = insertProperty(HTML, "radius", radius);
    HTML = insertProperty(HTML, "degree", degree);
    HTML = insertProperty(HTML, "pcolour", pcolour);
    HTML = insertProperty(HTML, "Font", Font);
    return HTML;
  }

  var request = getRequestObject();
  // Modify HTML on the fly; 'onreadystatechange' executes a 
  // function that updates the desired HTML document
  request.onreadystatechange = function() {
    if ((request.readyState == 4) && (request.status == 200)) {
      var myHTML = document.querySelector(".jumbotron").innerHTML;
      var len = point.length;
      // An extra iteration is required to insert the final HTML
      for (i = 0; i <= len; i++){
        if (i === len) {
          insertHtml(".jumbotron", myHTML)
          break;
        }
        var newHTML = buildHTML(request.responseText, i);
        myHTML += newHTML;
        insertHtml(".jumbotron", myHTML)

        /********************************************************/
        //            PLACE ICONS ON THE CANVAS                 //
        /********************************************************/

        var element = "div#t" + i.toString() + ".tech p";
        let box = $(element)[0].getBoundingClientRect();
        let width = box.width;
        let height = box.height;
        let techName = point[i].tech;
        let phs = point[i].phase;
        let arcc = point[i].arc;
        let act = point[i].activity;

        if (act === 1) {
          if (phs != "Identify") {
            if (arcc != "Park" ) {
              for (var j=0; j<num_technologies; j++) {
                let currentTech = 
                          Object.values(data["Emerging Technology"])[j];
                let currentActivityType = 
                          Object.values(data["Activity Type"])[j];
                let currentStatus = Object.values(data["Status"])[j];

                if (techName === currentTech) {

                  if (currentActivityType === "Backgrounder" || 
                      currentActivityType === "Research Summary" || 
                      currentActivityType === "Education") {               
                  /* insertProperty2(HTML, type, char                            
                           btwidth, btstyle, btcol,
                           brwidth, brstyle, brcol,
                           bbwidth, bbstyle, bbcol,
                           blwidth, blstyle, blcol,
                           colour, radius, degree, pcolour) */
                    if (currentStatus === "Planned") {
                      myHTML = insertProperty(myHTML, "wh", 9);
                      myHTML = insertProperty(myHTML, "ht", 9);
                      myHTML = insertProperty2(myHTML,currentActivityType,"",
                                              "1px","solid","black",
                                              "1px","solid","black",
                                              "1px","solid","black",
                                              "1px","solid","black",
                                              "none","50","45","","");
                      myHTML = calculateMargin(height, width, myHTML);

                    } else if (currentStatus === "In Progress") {
                      myHTML = insertProperty(myHTML, "wh", 9);
                      myHTML = insertProperty(myHTML, "ht", 9);
                      myHTML = insertProperty2(myHTML,currentActivityType,"",
                                              "1px","solid","#51B152",
                                              "1px","solid","#51B152",
                                              "1px","solid","#51B152",
                                              "1px","solid","#51B152",
                                              "none","50","45","","");
                      myHTML = calculateMargin(height, width, myHTML);                  

                      // insertProperty2(HTML, activity, char,
                      //      btwidth, btstyle, btcol,
                      //      brwidth, brstyle, brcol,
                      //      bbwidth, bbstyle, bbcol,
                      //      blwidth, blstyle, blcol,
                      //      colour, radius, degree,
                      //      pcolour, Font)
                    } else { // currentStatus is Complete
                      myHTML = insertProperty(myHTML, "wh", 9);
                      myHTML = insertProperty(myHTML, "ht", 9);
                      myHTML = insertProperty2(myHTML,currentActivityType,"",
                                              "0px","none","",
                                              "0px","none","",
                                              "0px","none","",
                                              "0px","none","",
                                              "#51B152","50","45","","");
                      myHTML = calculateMargin(height, width, myHTML);                      
                    } // END of if statement to match Status

                  } else if (currentActivityType === "Outlook" || 
                             currentActivityType === "Direction") {
                    // console.log(techName, currentActivityType)
                    if (currentStatus === "Planned") {
                      myHTML = insertProperty(myHTML, "wh", 8);
                      myHTML = insertProperty(myHTML, "ht", 8);
                      myHTML = insertProperty2(myHTML,currentActivityType,"",
                                              "1px","solid","black",
                                              "1px","solid","black",
                                              "1px","solid","black",
                                              "1px","solid","black",
                                              "none","0","0","","");
                      myHTML = calculateMargin(height, width, myHTML);

                    } else if (currentStatus === "In Progress") {
                      myHTML = insertProperty(myHTML, "wh", 8);
                      myHTML = insertProperty(myHTML, "ht", 8);
                      myHTML = insertProperty2(myHTML,currentActivityType,"",
                                              "1px","solid","#51B152",
                                              "1px","solid","#51B152",
                                              "1px","solid","#51B152",
                                              "1px","solid","#51B152",
                                              "none","0","0","","");
                      myHTML = calculateMargin(height, width, myHTML);                  

                    } else { // currentStatus is Complete
                      myHTML = insertProperty(myHTML, "wh", 8);
                      myHTML = insertProperty(myHTML, "ht", 8);
                      myHTML = insertProperty2(myHTML,currentActivityType,"",
                                              "0px","none","",
                                              "0px","none","",
                                              "0px","none","",
                                              "0px","none","",
                                              "#51B152","0","0","","");
                      myHTML = calculateMargin(height, width, myHTML);                      
                    } // END of if statement to match Status

                  } else if (currentActivityType === "PoC") {
                    // console.log(techName, currentActivityType)
                    if (currentStatus === "Planned") {
                      myHTML = insertProperty(myHTML, "wh", 0);
                      myHTML = insertProperty(myHTML, "ht", 0);
                      myHTML = insertProperty2(myHTML,currentActivityType,"&#8420",
                                              "0px","","",
                                              "0px","","",
                                              "0px","","",
                                              "0px","","",
                                              "none","0","-45","black","8");
                      myHTML = calculateMargin(height, width, myHTML);

                    } else if (currentStatus === "In Progress") {
                      myHTML = insertProperty(myHTML, "wh", 9);
                      myHTML = insertProperty(myHTML, "ht", 9);
                      myHTML = insertProperty2(myHTML,currentActivityType,"&#8420",
                                              "0px","","",
                                              "0px","","",
                                              "0px","","",
                                              "0px","","",
                                              "none","0","-45","#51B152","8");
                      myHTML = calculateMargin(height, width, myHTML);                  

                    } else { // currentStatus is Complete
                      myHTML = insertProperty(myHTML, "wh", 9);
                      myHTML = insertProperty(myHTML, "ht", 9);
                      myHTML = insertProperty2(myHTML,currentActivityType,"",
                                              "0px","none","transparent",
                                              "5px","solid","transparent",
                                              "8.63px","solid","#51B152",
                                              "5px","solid","transparent",
                                              "","0","-45","","");
                      myHTML = calculateMargin(height, width, myHTML);                      
                    } // END of if statement to match Status

                  } else if (currentActivityType === "Adoption Strategy" || 
                             currentActivityType === "Strategy") {
                    // console.log(techName, currentActivityType)
                    if (currentStatus === "Planned") {
                      myHTML = insertProperty(myHTML, "wh", 0);
                      myHTML = insertProperty(myHTML, "ht", 0);
                      myHTML = insertProperty2(myHTML,currentActivityType,"",
                                              "1px","solid","black",
                                              "1px","solid","black",
                                              "1px","solid","black",
                                              "1px","solid","black",
                                              "none","0","45","","");
                      myHTML = calculateMargin(height, width, myHTML);

                    } else if (currentStatus === "In Progress") {
                      myHTML = insertProperty(myHTML, "wh", 9);
                      myHTML = insertProperty(myHTML, "ht", 9);
                      myHTML = insertProperty2(myHTML,currentActivityType,"",
                                              "1px","solid","#51B152",
                                              "1px","solid","#51B152",
                                              "1px","solid","#51B152",
                                              "1px","solid","#51B152",
                                              "none","0","45","","");
                      myHTML = calculateMargin(height, width, myHTML);                  

                    } else { // currentStatus is Complete
                      myHTML = insertProperty(myHTML, "wh", 9);
                      myHTML = insertProperty(myHTML, "ht", 9);
                      myHTML = insertProperty2(myHTML,currentActivityType,"",
                                              "0px","none","",
                                              "0px","none","",
                                              "0px","none","",
                                              "0px","none","",
                                              "#51B152","0","45","","");
                      myHTML = calculateMargin(height, width, myHTML);                      
                    } // END of if statement to match Status

                  } else if (currentActivityType === "Pilot") {
                    // console.log(techName+', ', currentActivityType+', ', act)
                    if (currentStatus === "Planned") {
                      myHTML = insertProperty(myHTML, "wh", 0);
                      myHTML = insertProperty(myHTML, "ht", 0);
                      myHTML = insertProperty2(myHTML,currentActivityType,"&#9734",
                                              "0px","","",
                                              "0px","","",
                                              "0px","","",
                                              "0px","","",
                                              "none","0","-45","black","12");
                      myHTML = calculateMargin(height, width, myHTML);

                    } else if (currentStatus === "In Progress") {
                      myHTML = insertProperty(myHTML, "wh", 0);
                      myHTML = insertProperty(myHTML, "ht", 0);
                      myHTML = insertProperty2(myHTML,currentActivityType,"&#9734",
                                              "0px","","",
                                              "0px","","",
                                              "0px","","",
                                              "0px","","",
                                              "none","0","-45","#51B152","12");
                      myHTML = calculateMargin(height, width, myHTML);                  

                    } else { // currentStatus is Complete
                      myHTML = insertProperty(myHTML, "wh", 0);
                      myHTML = insertProperty(myHTML, "ht", 0);
                      myHTML = insertProperty2(myHTML,currentActivityType,"&#9733",
                                              "0px","","",
                                              "0px","","",
                                              "0px","","",
                                              "0px","","",
                                              "none","0","-45","#51B152","12");
                      myHTML = calculateMargin(height, width, myHTML);                      
                    } // END of if statement to match Status
                  } // END of if statement to match Activity type Pilot
                } // END if statement to match tech names
              } // END of for loop
            } else { // if Arc is Park
              for (var j=0; j<num_technologies; j++) {
                let currentTech = 
                          Object.values(data["Emerging Technology"])[j];
                let currentActivityType = 
                          Object.values(data["Activity Type"])[j];
                let currentStatus = Object.values(data["Status"])[j];

                if (techName === currentTech) {
                  if (currentActivityType === "Backgrounder" || 
                      currentActivityType === "Research Summary" || 
                      currentActivityType === "Education") {
                    myHTML = insertProperty(myHTML, "wh", 9);
                      myHTML = insertProperty(myHTML, "ht", 9);
                    myHTML = insertProperty2(myHTML,currentActivityType,"",
                                            "0px","none","",
                                            "0px","none","",
                                            "0px","none","",
                                            "0px","none","",
                                            "blue","50","45","","");                 
                    myHTML = calculateMargin(height, width, myHTML);

                  } else if (currentActivityType === "Outlook" || 
                             currentActivityType === "Direction") {
                    myHTML = insertProperty(myHTML, "wh", 9);
                      myHTML = insertProperty(myHTML, "ht", 9);
                    myHTML = insertProperty2(myHTML,currentActivityType,"",
                                            "0px","none","",
                                            "0px","none","",
                                            "0px","none","",
                                            "0px","none","",
                                            "blue","0","0","","");
                    myHTML = calculateMargin(height, width, myHTML);

                  } else if (currentActivityType === "PoC") {
                    myHTML = insertProperty(myHTML, "wh", 9);
                      myHTML = insertProperty(myHTML, "ht", 9);
                    myHTML = insertProperty2(myHTML,currentActivityType,"",
                                              "0px","none","transparent",
                                              "5px","solid","transparent",
                                              "8.63px","solid","blue",
                                              "5px","solid","transparent",
                                              "","0","-45","","","");                 
                    myHTML = calculateMargin(height, width, myHTML);

                  } else if (currentActivityType === "Adoption Strategy" || 
                             currentActivityType === "Strategy") {
                    myHTML = insertProperty(myHTML, "wh", 9);
                      myHTML = insertProperty(myHTML, "ht", 9);
                    myHTML = insertProperty2(myHTML,currentActivityType,"",
                                              "0px","none","",
                                              "0px","none","",
                                              "0px","none","",
                                              "0px","none","",
                                              "blue","0","45","","");                
                    myHTML = calculateMargin(height, width, myHTML);
                  } else if (currentActivityType === "Pilot") {
                    myHTML = insertProperty(myHTML, "wh", 9);
                    myHTML = insertProperty(myHTML, "ht", 9);
                    myHTML = insertProperty2(myHTML,currentActivityType,"&#9733",
                                              "0px","none","",
                                              "0px","none","",
                                              "0px","none","",
                                              "0px","none","",
                                              "none","0","-45","blue","12");                
                    myHTML = calculateMargin(height, width, myHTML);
                  }
                }
              }
            } // END of arcc
          } else { // if phase is Identify
            if (arcc != "" ) {
              for (var j=0; j<num_technologies; j++) {
                let currentTech = 
                          Object.values(data["Emerging Technology"])[j];
                let currentActivityType = 
                          Object.values(data["Activity Type"])[j];
                let currentStatus = Object.values(data["Status"])[j];

                if (techName === currentTech) {
                  myHTML = insertProperty(myHTML, "wh", 0);
                  myHTML = insertProperty(myHTML, "ht", 0);
                  myHTML = insertProperty2(myHTML,currentActivityType,"",
                                              "0px","none","",
                                              "0px","none","",
                                              "0px","none","",
                                              "0px","none","",
                                              "none","0","-45","","");  
                  myHTML = calculateMargin(height, width, myHTML);
                }
              } // END of inner for loop
            } // END of arcc
          } // END of phs
        } else { // activities > 1; EXPAND THIS
          if ( phs != "Identify" || phs != "Study" ) {            
            if ( arcc != "Park" ) {
              for (var j=0; j<num_technologies; j++) {
                let currentTech = 
                          Object.values(data["Emerging Technology"])[j];
                let currentActivityType = 
                          Object.values(data["Activity Type"])[j];
                let currentStatus = Object.values(data["Status"])[j];

                if (techName === currentTech) {
                  // console.log(techName+', ', phs+', ', arcc+', ', currentActivityType)
                  myHTML = insertProperty(myHTML, "wh", 0);
                  myHTML = insertProperty(myHTML, "ht", 0);
                  myHTML = insertProperty2(myHTML,currentActivityType,"",
                                                      "0px","none","",
                                                      "0px","none","",
                                                      "0px","none","",
                                                      "0px","none","",
                                                      "none","0","-45","","");
                  myHTML = calculateMargin(height, width, myHTML);
                  if (techName === "AI - Chatbot") {
                  }
                }                
              } //END of inner for loop              
            } // END of arcc
          } // END of phs
        } // END of act      
      } // END of main for loop
    } // END of if statement to check request status    
  } // END of onreadystatechange

  var techHtml = "snippets/tech-snippet.html";
  request.open("GET", techHtml, true);
  request.send(null);

  // Place technologies according to the generated coordinates
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

}); // END of addEventListener

global.$dc = dc;

})(window);
