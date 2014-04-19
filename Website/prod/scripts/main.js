require(['planetData', 'timeline','whatsnext', 'mustache'], function(planetData, drawTimeline, whatsnext, Mustache){
  $(document).ready(function(){

    drawTimeline();

    var canvas = createDrawingCanvas('.canvasContainer');
    var width = $('.canvasContainer').width();
    var height = $('.canvasContainer').height();

    //bind UI elements
    $('.increaseBounds div').click(function(){
      increaseBounds();
      render();
    });
    $('.decreaseBounds div').click(function(){
      decreaseBounds();
      render();
    });
    $('.increaseBounds').hover(function(){
      $('#zoomout').fadeIn('slow');
    }, function(){
      $('#zoomout').fadeOut();
    });
    $('.decreaseBounds').hover(function(){
      $('#zoomin').fadeIn('slow');
    }, function(){
      $('#zoomin').fadeOut();
    });
    $('.timeline h2 span').click(function(){
      $('.timeline').slideUp();
    });
    $('.timeline-mission').click(function(){
      openInfoPanel($(this).attr('ref'));
    });

    //----------------

    var drawingWidth = 0.6;
    var leftvisible = false;
    var rightvisible = false;
    var boundingPlanets = ['Mars', 'Saturn', 'Pluto', 'Voyager'];
    var boundingPlanet = 0;
    var scaleIndex = 0;
    var scaleDistance = 0;
    calculateBoundingPlanet();

    var popupAutoOpen = [
      ["Mercury", "Venus", "Earth", "Mars"],
      ["Mercury","Venus","Earth","Mars", "Ceres", "Jupiter", "Saturn"],
      ["Ceres","Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"],
      ["Jupiter","Saturn","Uranus","Neptune","Pluto","Haumea","Makemake","Eris","Voyager"]];

    //setTimeout(render, 5000);
    render();

    function increaseBounds(){
      if(boundingPlanet < boundingPlanets.length - 1){
        boundingPlanet++;
        calculateBoundingPlanet();
      }
    }
    function canIncreaseBounds(){
      if(boundingPlanet < boundingPlanets.length - 1){
        return true;
      }
      return false;
    }
    function decreaseBounds(){
      if(boundingPlanet > 0){
        boundingPlanet--;
        calculateBoundingPlanet();
      }
    }
    function canDecreaseBounds(){
      if(boundingPlanet > 0){
        return true;
      }
      return false;
    }
    function calculateBoundingPlanet(){
      for(var i = 0; i < planetData.length; i++){
        if(planetData[i].name == boundingPlanets[boundingPlanet]){
          scaleIndex = i;
          scaleDistance = planetData[scaleIndex].solarDistance;
          break;
        }
      }
    }

    var currentMission = null;

    function render(){
      canvas.clearRect(0, 0, width, height);
      drawSolarSystem();
      drawCurrentMission();
      clearUi();
      drawUi();
    }

    function lookupPlanet(planetName){
      for(var i = 0; i < planetData.length; i++){
        if(planetData[i].name == planetName){
          return i;
        }
      }
    }


    function drawUi(){
      if(!rightvisible && canIncreaseBounds()){
        $('.increaseBounds').fadeIn();
        rightvisible = true;
      } else if(rightvisible && canIncreaseBounds()){
        //noop
      } else {
        $('.increaseBounds').fadeOut();
        rightvisible = false;
      }
      if(!leftvisible && canDecreaseBounds()){
        $('.decreaseBounds').fadeIn();
        leftvisible = true;
      } else if (leftvisible && canDecreaseBounds()){
        //noop
      } else {
        $('.decreaseBounds').fadeOut();
        leftvisible = false;
      }

      var drawWindow = (width * drawingWidth);
      for(var i = 0; i < popupAutoOpen[boundingPlanet].length; i++){
        if(popupAutoOpen[boundingPlanet][i] != "Earth" && popupAutoOpen[boundingPlanet][i] != "Voyager"){
          var planetIndex = lookupPlanet(popupAutoOpen[boundingPlanet][i]);
          var planet = planetData[planetIndex];
          var left = (width / 2) - (drawWindow / 2) + (drawWindow * calculateScale(planetIndex, scaleIndex));
          var info = $('<div class="info"><div>Total Missions: '+ (planet.successCount + planet.failureCount) +'</div><div>Successful Missions: '+ planet.successCount +'</div><div>Latest: '+ planet.latestVisit +'</div></div>');

          var popup = $('<div>'+ planet.name +'</div>');
          popup
            .addClass('planetDataPopup').addClass(planet.name+'Popup')
            .hide()
            .append(info)
            .css('left', left - 50 + 'px')
            .css('top', '75px');
          $('.canvasContainer').append(popup);

          var popupTrigger = $('<div class="popupTrigger" ref="'+ planet.name +'"></div>');
          popupTrigger.css('left', left - 10 + 'px').css('top', '140px').width('25px').height('25px');
          popupTrigger.hover(function(){
            $('.'+$(this).attr('ref')+'Popup').fadeIn();
          }, function(){
            $('.'+$(this).attr('ref')+'Popup').fadeOut();
          });
          $('.canvasContainer').append(popupTrigger);
        } else {
          var planetIndex = lookupPlanet(popupAutoOpen[boundingPlanet][i]);
          var planet = planetData[planetIndex];
          var left = (width / 2) - (drawWindow / 2) + (drawWindow * calculateScale(planetIndex, scaleIndex));
          var popup = $('<div>'+ planet.name +'</div>');
          popup
            .addClass('planetDataPopup').addClass(planet.name+'Popup')
            .hide()
            .css('left', left - 50 + 'px')
            .css('top', '75px');
          $('.canvasContainer').append(popup);

          var popupTrigger = $('<div class="popupTrigger" ref="'+ planet.name +'"></div>');
          popupTrigger.css('left', left - 10 + 'px').css('top', '140px').width('25px').height('25px');
          popupTrigger.hover(function(){
            $('.'+$(this).attr('ref')+'Popup').fadeIn();
          }, function(){
            $('.'+$(this).attr('ref')+'Popup').fadeOut();
          });
          $('.canvasContainer').append(popupTrigger);
        }
      }
      $('.popupTrigger').click(function(){
        openTimeline($(this).attr('ref'));
      });
    }

    function openTimeline(planetName){
      if(planetName == "Mars"){
        $('.timeline').slideDown();
      }
    }

    function getMissionData(missionName){
      for(var i = 0; i < whatsnext.length; i++){
        if(whatsnext[i].name == missionName){
          return whatsnext[i];
        }
      }
    }

    function openInfoPanel(missionName){
      currentMission = missionName;
      $('.topcontent-container').animate({height: '0px'}, function(){
        var html = Mustache.to_html($('#infoPanelTemplate').html(), getMissionData(currentMission));
        $('.topcontent-container').html(html);
        $('#slider-images, #slider-factoids')
         .anythingSlider({
           // Appearance
           theme               : "polished", // Theme name
           mode                : "horiz",   // Set mode to "horizontal", "vertical" or "fade" (only first letter needed); replaces vertical option
           expand              : false	,     // If true, the entire slider will expand to fit the parent element
           resizeContents      : false,      // If true, solitary images/objects in the panel will expand to fit the viewport
           aspectRatio         : null,      // Valid values: null, true, a float e.g. 1.5 (or as 3/2) or a ratio in a string e.g. '3:2'
           showMultiple        : false,     // Set this value to a number and it will show that many slides at once
           easing              : "swing",   // Anything other than "linear" or "swing" requires the easing plugin or jQuery UI

           buildArrows         : false,      // If true, builds the forwards and backwards buttons
           buildNavigation     : true,      // If true, builds a list of anchor links to link to each panel
           buildStartStop      : false,      // If true, builds the start/stop button and adds slideshow functionality

           appendForwardTo     : null,      // Append forward arrow to a HTML element (jQuery Object, selector or HTMLNode), if not null
           appendBackTo        : null,      // Append back arrow to a HTML element (jQuery Object, selector or HTMLNode), if not null
           appendControlsTo    : null,      // Append controls (navigation + start-stop) to a HTML element (jQuery Object, selector or HTMLNode), if not null
           appendNavigationTo  : null,      // Append navigation buttons to a HTML element (jQuery Object, selector or HTMLNode), if not null
           appendStartStopTo   : null,      // Append start-stop button to a HTML element (jQuery Object, selector or HTMLNode), if not null

           toggleArrows        : false,     // If true, side navigation arrows will slide out on hovering & hide @ other times
           toggleControls      : false,     // if true, slide in controls (navigation + play/stop button) on hover and slide change, hide @ other times

           startText           : "Start",   // Start button text
           stopText            : "Stop",    // Stop button text
           forwardText         : "&raquo;", // Link text used to move the slider forward (hidden by CSS, replaced with arrow image)
           backText            : "&laquo;", // Link text used to move the slider back (hidden by CSS, replace with arrow image)
           tooltipClass        : "tooltip", // Class added to navigation & start/stop button (text copied to title if it is hidden by a negative text indent)

           // Function
           enableArrows        : true,      // if false, arrows will be visible, but not clickable.
           enableNavigation    : false,      // if false, navigation links will still be visible, but not clickable.
           enableStartStop     : true,      // if false, the play/stop button will still be visible, but not clickable. Previously "enablePlay"
           enableKeyboard      : true,      // if false, keyboard arrow keys will not work for this slider.

           // Navigation
           startPanel          : 1,         // This sets the initial panel
           changeBy            : 1,         // Amount to go forward or back when changing panels.
           hashTags            : true,      // Should links change the hashtag in the URL?
           infiniteSlides      : true,      // if false, the slider will not wrap & not clone any panels
           navigationFormatter : null,      // Details at the top of the file on this use (advanced use)
           navigationSize      : false,     // Set this to the maximum number of visible navigation tabs; false to disable

           // Slideshow options
           autoPlay            : true,     // If true, the slideshow will start running; replaces "startStopped" option
           autoPlayLocked      : false,     // If true, user changing slides will not stop the slideshow
           autoPlayDelayed     : false,     // If true, starting a slideshow will delay advancing slides; if false, the slider will immediately advance to the next slide when slideshow starts
           pauseOnHover        : true,      // If true & the slideshow is active, the slideshow will pause on hover
           stopAtEnd           : false,     // If true & the slideshow is active, the slideshow will stop on the last page. This also stops the rewind effect when infiniteSlides is false.
           playRtl             : false,     // If true, the slideshow will move right-to-left

           // Times
           delay               : 5000,      // How long between slideshow transitions in AutoPlay mode (in milliseconds)
           resumeDelay         : 15000,     // Resume slideshow after user interaction, only if autoplayLocked is true (in milliseconds).
           animationTime       : 600,       // How long the slideshow transition takes (in milliseconds)
           delayBeforeAnimate  : 0,         // How long to pause slide animation before going to the desired slide (used if you want your "out" FX to show).

           // Interactivity
           clickForwardArrow   : "click",         // Event used to activate forward arrow functionality (e.g. add jQuery mobile's "swiperight")
           clickBackArrow      : "click",         // Event used to activate back arrow functionality (e.g. add jQuery mobile's "swipeleft")
           clickControls       : "click focusin", // Events used to activate navigation control functionality
           clickSlideshow      : "click",         // Event used to activate slideshow play/stop button
           allowRapidChange    : false,           // If true, allow rapid changing of the active pane, instead of ignoring activity during animation

         });
         $('#infopanelclosebutton').click(function(){
           $('.topcontent-container').css({height: '0px'});
           $('.header').show();
           currentMission = null;
           render();
         });
         $('.header').hide()
        $('.topcontent-container').css({height: '285px'})
        render();
      });
    }

    function clearUi(){
      $('.planetDataPopup').remove();
      $('.popupTrigger').remove();
    }

    function createDrawingCanvas(containerID){
      return document.getElementById('canvas').getContext('2d');
    }
    function drawCurrentMission(){
      switch(currentMission){
      case 'Mariner 4':
        drawPassBehind(3,4);
        break;
      case 'Mariner 7':
        drawPassInfront(3,4);
        break;
      case 'Curiosity':
        drawDirectTransfer(3, 4);
        break;
      }
    }
    function drawSolarSystem(){
      drawPlanets();
    }
    function drawSun(){
      drawDot(canvas, (width / 2) - ((width * drawingWidth) / 2), height / 2, 15, {
        edgeWidth: 1,
        fillColor: 'yellow',
        edgeColor: 'white'
      });
    }

    function drawPlanets(){
      drawSun();
      var drawWindow = (width * drawingWidth);
      for(var i = 1; i < planetData.length; i++){
        if(planetData[i].solarDistance <= scaleDistance){
          drawDot(canvas, (width / 2) - (drawWindow / 2) + (drawWindow * calculateScale(i, scaleIndex)), height / 2, planetData[i].style.radius, {
            edgeWidth: 1,
            fillColor: planetData[i].style.fillColor,
            edgeColor: planetData[i].style.edgeColor
          });
          if(planetData[i].name == "Saturn"){
            drawRing(canvas, (width / 2) - (drawWindow / 2) + (drawWindow * calculateScale(i, scaleIndex)), height / 2, planetData[i].style.radius + 5, {
              edgeWidth: 3,
              edgeColor: 'white'
            });
          }
        }
      }
    }

    function drawDirectTransfer(originI, destinationI) {
      canvas.fillStyle = '#CCC';
      canvas.strokeStyle = '#CCC';
      var drawWindow = (width * drawingWidth);
      canvas.beginPath();
      var startX = (width / 2) - (drawWindow / 2) + (drawWindow * calculateScale(originI, scaleIndex));
      var destinationX = (width / 2) - (drawWindow / 2) + (drawWindow * calculateScale(destinationI, scaleIndex));
      var baseY = height / 2;
      var controlY = (height / 2) + ((destinationX - startX) / 2);
      canvas.moveTo(startX, baseY);
      canvas.bezierCurveTo(startX,controlY,destinationX,controlY,destinationX,baseY);
      canvas.stroke();
    }
    function drawPassBehind(originI, destinationI) {
      canvas.fillStyle = '#CCC';
      canvas.strokeStyle = '#CCC';
      var drawWindow = (width * drawingWidth);
      canvas.beginPath();
      var startX = (width / 2) - (drawWindow / 2) + (drawWindow * calculateScale(originI, scaleIndex));
      var destinationX = (width / 2) - (drawWindow / 2) + (50 + drawWindow * calculateScale(destinationI, scaleIndex));
      var endX = (width / 2) - (drawWindow / 2) + (drawWindow * calculateScale(destinationI, scaleIndex))
      var baseY = height / 2;
      var controlY = (height / 2) + ((destinationX - startX) / 2);
      var controlY2 = (height / 2) - ((destinationX - startX) / 4);
      canvas.moveTo(startX, baseY);
      canvas.bezierCurveTo(startX,controlY,destinationX,controlY,destinationX,controlY2);
      canvas.stroke();
    }

    function drawPassInfront(originI, destinationI) {
      canvas.fillStyle = '#CCC';
      canvas.strokeStyle = '#CCC';
      var drawWindow = (width * drawingWidth);
      var x = (width / 2) - (drawWindow / 2) + (drawWindow * calculateScale(originI, scaleIndex));
      var w = (width / 2) - (drawWindow / 2) + (drawWindow - 50 * calculateScale(destinationI, scaleIndex)) - x;
      var startX = (width / 2) - (drawWindow / 2) + (drawWindow * calculateScale(originI, scaleIndex));

      var destinationX = (width / 2) - (drawWindow / 2) + (50 + drawWindow * calculateScale(destinationI, scaleIndex));
      var y = (height / 2) / 2;
      var h = ((height / 2) + ((destinationX - startX) / 2)) / 2;

      var kappa = .5522848,
          ox = (w / 2) * kappa, // control point offset horizontal
          oy = (h / 2) * kappa, // control point offset vertical
          xe = x + w,           // x-end
          ye = y + h,           // y-end
          xm = x + w / 2,       // x-middle
          ym = y + h / 2;       // y-middle

      canvas.beginPath();
      canvas.moveTo(x, ym);
      canvas.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
      canvas.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
      canvas.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
      //canvas.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
      //canvas.closePath();
      canvas.stroke();
    }

    function drawDot(context, x, y, radius, styleObject){
          context.beginPath();
          context.arc(x, y, radius, 0, 2 * Math.PI, false);
          context.fillStyle = styleObject.fillColor;
          context.fill();
          context.lineWidth = styleObject.edgeWidth;
          context.strokeStyle = styleObject.edgeColor;
          context.stroke();
    }

    function drawArc(context, x, y, radius, startrads, endrads, styleObject) {
      context.beginPath();
      context.arc(x,y,radius, startrads, endrads, false);
      context.lineWidth = styleObject.edgeWidth;
      context.strokeStyle = styleObject.edgeColor;
      context.stroke();
    }

    function drawRing(context, x, y, radius, styleObject){
      context.beginPath();
      context.arc(x,y,radius, 0, 2 * Math.PI, false);
      context.lineWidth = styleObject.edgeWidth;
      context.strokeStyle = styleObject.edgeColor;
      context.stroke();
    }

    function calculateScale(planetIndex, upperIndex){
      return planetData[planetIndex].solarDistance / planetData[upperIndex].solarDistance;
    }
  });
});
