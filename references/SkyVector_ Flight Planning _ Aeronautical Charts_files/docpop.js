/*##############################################################################
#                                                                              #
#                 This file is Copyright SkyVector.com 2016-2016               #
#                             ALL RIGHTS RESERVED.                             #
#                                                                              #
# You may not use this file or any part thereof for any purpose other than its #
# original intended use.                                                       #
#                                                                              #
# Specifically, permission is granted ONLY TO EXECUTE the code contained       #
# herein.                                                                      #
#                                                                              #
# Any disassembly, study, reverse engineering, or other activity intended to   #
# educate or illuminate the reader is not permitted. Any attempt to reproduce  #
# the functionality provided by the code in this file by any knowledge gained  #
# through the study of this file is expressly prohibited.                      #
#                                                                              #
# Inventions contained in this file and portions thereof may be protected by   #
# one or more patents, pending and/or issued. Any infringement will be         #
# vigorously prosecuted to the fullest extent of the law.                      #
#                                                                              #
# This file, portions thereof, and any inventions or methods detailed within   #
# it are TRADE SECRETS owned by SkyVector.com. Any misappropriation or         #
# theft of the TRADE SECRETS contained herein is a                             #
#                                                                              #
#                   FEDERAL CRIME under 18 U.S.C. 1832-1839.                   #
#                                                                              #
##############################################################################*/
"use strict";
var SVGPopOverCodePresent = true;

var SVGPopOver = SVGPopOver || {
    fixCSS: function() {
        if (!this.fixedCSS) {
            var style = {
                "div.svgpo": "position: absolute; background-color: #ccc; border: 1px solid #999; border-radius: 10px; padding: 0 ;box-shadow: 10px 10px 20px 0px rgba(0,0,0,0.3); font-size: 100%;",
                "div.svgpo_viewbox": "display: block; overflow: hidden; background-color: #aaa; border-radius: 0 0 9px 9px; touch-action: none;",
                "div.svgpo_header": "background-color: #4D7FA5; height: 30px; color: white; font-size: 16px; line-height: 30px; font-family: Ubuntu, Verdana, Arial, sans-serif; border-radius: 9px 9px 0 0; touch-action: none; padding-left: 15px;",
                "img.svgpo_image": "background-color: white;",
                ".svgpo_headerclose": "position: absolute; font-size: 25px; display: block; right: 0px; padding: 4px; top: -2px; color: white; cursor: pointer;",
                ".svgpo_cornerbutton": "position: absolute; width: 40px; height: 40px; touch-action: none;",
                ".svgpo_rotateright": "position: absolute; top: 0px; right: 70px; color: white; width: 30px; height: 40px; font-size: 20px; line-height: 30px;",
                ".svgpo_rotateleft": "position: absolute; top: 0px; right: 100px; color: white; width: 30px; height: 40px; font-size: 20px; line-height: 30px;",
                ".svgpo_history": "position: absolute; top: 0px; right: 160px; color: white; width: 30px; height: 40px; font-size: 20px; line-height: 30px;",
                ".svgpo_fullscreen": "position: absolute; top: 0px; right: 40px; color: white; width: 30px; height: 40px; font-size: 20px; line-height: 30px;",
                ".svgpo_compareslider": "position: absolute; border-right: 2px solid #f0f; visibility: hidden; pointer-events: none;",
                ".svgpo_comparehandle": "width: 50px; text-align: center; position: absolute; visibility: hidden; color: #f0f; font-size: 25px; cursor: pointer; touch-action: none;"
            };
            var ss = this.ce("style");
            ss.setAttribute("type", "text/css");
            var head = document.getElementsByTagName("head").item(0);
            if (head) {
                head.appendChild(ss)
            } else {
                return false;
            }
            var sheet = document.styleSheets[document.styleSheets.length - 1];
            if (sheet.insertRule) {
                var position = 0;
                try {
                    position = sheet.cssRules.length;
                } catch (e) {}
                ;
                for (var i in style) {
                    sheet.insertRule(i + " { " + style[i] + " }", position);
                    position++;
                }
            } else if (sheet.addRule) {
                for (var i in s) {
                    sheet.addRule(i, style[i]);
                }
            }
            this.fixedCSS = true;
        }
    },
    ce: function(tag, className) {
        var elem = document.createElement(tag);
        if (className) {
            elem.className = className;
        }
        return elem;
    },
    ct: function(text){
        return document.createTextNode(text);
    },
    data: {
        zIndex: 10000,
        closers: {}
    },
    closeAll: function(notMoved){
        for (var url in this.data.closers){
            this.data.closers[url](notMoved);
        }
    }
};

SVGPopOver.showSVG = function(url, width, height, name, x, y, compare) {
    this.closeAll(true);
    this.fixCSS();
    var mainBox = this.ce("div", "svgpo");
    mainBox.style.zIndex = this.data.zIndex++;
    
    var windowWidth = window.innerWidth - 30;
    var windowHeight = window.innerHeight - 45;
    var docRatio = width / height;
    var windowRatio = windowWidth / windowHeight;
    var imgWidth, imgHeight;
    var boxWidth, boxHeight;
    var imgX = 15;
    var imgY = 15;
    var rotate = 0;
    if (docRatio > windowRatio) {
        imgWidth = windowWidth - 30;
        imgHeight = height * imgWidth / width;
        if (x && y){
            if (y < windowHeight/2){
                imgY  = windowHeight - imgHeight;
            }
        }else{
            imgY = Math.round((windowHeight - imgHeight) / 2);
        }
    } else {
        imgHeight = windowHeight - 30;
        imgWidth = width * imgHeight / height;
        if (x && y){
            if (x < windowWidth/2){
                imgX = windowWidth - imgWidth;
            }
        }else{
            imgX = Math.round((windowWidth - imgWidth) / 2);
        }
    }
    boxWidth = imgWidth;
    boxHeight = imgHeight;
    var origBoxWidth = boxWidth;
    var origBoxHeight = boxHeight;
    var origImgX = imgX;
    var origImgY = imgY;
    var boxRatio = docRatio;
    var comparePosition = 0.5;
    var comparePositionPixel = Math.round(imgWidth/2);
    var comparePositionMouse = comparePositionPixel;
    var compareOn = false;

    var mouseX = imgX + 0; // event.pageX offset
    var mouseY = imgY + 30; // event.pageY offset

    var header = this.ce("div","svgpo_header");
    header.appendChild(this.ct(name));

    mainBox.appendChild(header);
    var viewBox = this.ce("div", "svgpo_viewbox");
    viewBox.style.width = imgWidth + "px";
    viewBox.style.height = imgHeight + "px";
    mainBox.style.top = imgY + "px";
    mainBox.style.left = imgX + "px";
    mainBox.appendChild(viewBox);
    var image = this.ce("img", "svgpo_image");
    image.src = url;
    image.style.width = imgWidth + "px";
    image.style.height = imgHeight + "px";
    if (compare){imgHeight + "px";
        var viewBox2 = this.ce("div", "svgpo_viewbox");
        viewBox2.style.position = "absolute";
        viewBox2.style.top = "30px";
        viewBox2.style.border = "none";
        viewBox2.style.pointerEvents = "none";
        viewBox2.style.width = imgWidth + "px";
        viewBox2.style.height = imgHeight + "px";
        viewBox2.style.visibility = "hidden";
        mainBox.appendChild(viewBox2);
        var image2 = this.ce("img", "svgpo_image");
        image2.style.width = imgWidth + "px";
        image2.style.height = imgHeight + "px";
        var compareSlider = this.ce("div","svgpo_compareslider");
        var compareHandle = this.ce("div","fa-stack svgpo_comparehandle");
        compareHandle.appendChild(this.ce("i","fa fa-circle fa-stack-2x"));
        compareHandle.appendChild(this.ce("i","fa fa-arrows-h fa-stack-1x fa-inverse"));
        compareSlider.style.left = (comparePositionPixel-1) + "px";
        compareSlider.style.top = "30px";
        compareSlider.style.height = imgHeight + "px";
        compareHandle.style.top = Math.round(.8*imgHeight) + "px";
        compareHandle.style.left = (comparePositionPixel-25) + "px";
        mainBox.appendChild(compareSlider);
        mainBox.appendChild(compareHandle);
    }
    var imageScale = 1.0;
    var imageOffsetX = 0.0;
    var imageOffsetY = 0.0;
    var setTransform = function() {
        var expandedWidth = imgWidth * imageScale;
        var expandedHeight = imgHeight * imageScale;
        var centerX, centerY;
        if (rotate % 2){
            centerX = (boxWidth-imgHeight)/2;
            centerY = (boxHeight-imgWidth)/2;
        }else{
            centerX = (boxWidth-imgWidth)/2;
            centerY = (boxHeight-imgHeight)/2;
        }
        if (expandedHeight > boxHeight){
            var maxY = (expandedHeight - boxHeight)/2 + centerY;
            var minY = (expandedHeight - boxHeight)/-2 + centerY;
        }else{
            var minY = centerY;
            var maxY = centerY;
        }
        if (expandedWidth > boxWidth){
            var maxX = (expandedWidth - boxWidth)/2 + centerX ;
            var minX = (expandedWidth - boxWidth)/-2 + centerX ;
        }else{
            var maxX = centerX;
            var minX = centerX;
        }

        if (imageOffsetX > maxX) imageOffsetX = maxX;
        if (imageOffsetX < minX) imageOffsetX = minX;
        if (imageOffsetY > maxY) imageOffsetY = maxY;
        if (imageOffsetY < minY) imageOffsetY = minY;
        var matrix;
        if (rotate == 0){
            matrix = "matrix(" + imageScale + ",0,0," + imageScale + "," + imageOffsetX+ "," + imageOffsetY + ")";
        }else if (rotate == 1){
            matrix = "matrix(0," + imageScale + "," + -1*imageScale + ",0," + imageOffsetX+ "," + imageOffsetY + ")";          
        }else if (rotate == 2){
            matrix = "matrix(" + -1*imageScale + ",0,0," + -1*imageScale + "," + imageOffsetX+ "," + imageOffsetY + ")";            
        }else{
            matrix = "matrix(0," + -1*imageScale + "," + imageScale + ",0," + imageOffsetX+ "," + imageOffsetY + ")";                      
        }
        image.style.transform = matrix;
        if (compare){
            image2.style.transform = matrix;
        }

    }
    setTransform();
    
    viewBox.appendChild(image);
    if (compare)
        viewBox2.appendChild(image2);
    
    if (document.addEventListener) {
        var wheel = function(event) {
            var deltaY;
            if (event.deltaY || event.deltaX){
                deltaY = event.deltaY;
                if (event.deltaMode == 1)
                {
                    deltaY *= 18;
                }
            }else{
                deltaY = event.wheelDelta;
            }
            event.preventDefault();
            var scaleFactor = 1 + deltaY / -500;
            var oldScale = imageScale;
            imageScale *= scaleFactor;
            if (imageScale < 1) {
                imageScale = 1.0;
            }else{
                var offsetX = event.pageX - mouseX;
                var offsetY = event.pageY - mouseY;
                if (offsetX && offsetY){
                    var oX = imgWidth/2 - offsetX;
                    var oY = imgHeight/2 - offsetY;
                    imageOffsetX = scaleFactor * (imageOffsetX + oX) - oX;
                    imageOffsetY = scaleFactor * (imageOffsetY + oY) - oY;
                }
            }
            setTransform();
        }
        var drag = {
            "on": false
        };
        var mouseDown = function(event) {
            drag.x = event.clientX;
            drag.y = event.clientY;
            drag.startx = imageOffsetX;
            drag.starty = imageOffsetY;
            drag.on = true;
            event.preventDefault();
        }
        var mouseUp = function(event) {
            drag.on = false;
        }
        var mouseMove = function(event) {
            if (drag.on) {
                imageOffsetX = drag.startx + event.clientX - drag.x;
                imageOffsetY = drag.starty + event.clientY - drag.y;
                setTransform();
            }
        }
        var touchStart = function(event) {
            if (event.touches.length == event.changedTouches.length){ // first touch
                var touch = event.changedTouches.item(0);
                drag.touchid = touch.identifier;
                drag.x = touch.pageX - mouseX;
                drag.y = touch.pageY - mouseY;
                drag.startx = imageOffsetX;
                drag.starty = imageOffsetY;
                drag.startScale = imageScale;
                drag.on = true;
            }
            if (event.touches.length > 1){
                var touch2 = event.touches.item(1);
                if (touch2.identifier != drag.touchid){
                    drag.x2 = touch2.pageX - mouseX;
                    drag.y2 = touch2.pageY - mouseY;
                    drag.touchid2 = touch2.identifier;
                    drag.scaleDistance = Math.sqrt(Math.pow(drag.x2-drag.x,2) + Math.pow(drag.y2-drag.y,2));
                }
            }
            event.preventDefault();
        }
        var touchEnd = function(event){
            var touch = event.changedTouches.item(0);
            if (true || touch.identifier == drag.touchid){
                drag.on = false;
            }
        }
        var touchMove = function(event){
            if (drag.on){
                var touch;
                var touch2;
                for (var i=0; i < event.touches.length; i++){
                    var t = event.touches.item(i);
                    if (t.identifier == drag.touchid2){
                        touch2 = t;
                    }
                    if (t.identifier == drag.touchid){
                        touch = t;
                    }
                }
                if (!touch){
                    drag.on = false;
                    return;
                }
                var scale = event.scale || 1.0;
                if (event.touches.length > 1){
                    if (!event.scale){
                        if (touch2){
                            scale = Math.sqrt(Math.pow(touch.clientX-touch2.clientX,2) + Math.pow(touch.clientY-touch2.clientY,2)) / drag.scaleDistance;
                        }
                    }
                    imageScale = drag.startScale * scale;
                }
                if (imageScale < 1) {
                    imageScale = 1.0;
                }else{
                    var offsetX = touch.pageX - mouseX;
                    var offsetY = touch.pageY - mouseY;
                    if (offsetX && offsetY){
                        imageOffsetX = scale * (drag.startx + (imgWidth/2 - drag.x)) - (imgWidth/2 - offsetX);
                        imageOffsetY = scale * (drag.starty + (imgHeight/2 - drag.y)) - (imgHeight/2 - offsetY);
                    }
                }
                setTransform();
            }
        }
        var countKeys = function(obj){
            var count = 0;
            for (var key in obj){
                if (obj.hasOwnProperty(key)){
                    count++;
                }
            }
            return count;
        }
        var pointers = {};
        var pointerEvent = function(event){
            if (event.pointerType == 'touch'){
                var numPointers;
                event.preventDefault();
                if (event.type == 'pointerdown'){
                    var x = event.pageX - mouseX;
                    var y = event.pageY - mouseY;
                    pointers[event.pointerId] = {
                        "startx": x,
                        "starty": y,
                        "x": x,
                        "y": y
                    }
                    numPointers = countKeys(pointers);
                    if (numPointers == 1){
                        drag.touchid = event.pointerId;
                        drag.x = x;
                        drag.y = y;
                        drag.startx = imageOffsetX;
                        drag.starty = imageOffsetY;
                        drag.startScale = imageScale;
                        drag.on = true;                        
                    }
                    if (numPointers == 2){
                        if (event.pointerId != drag.touchid){
                            drag.x2 = x;
                            drag.y2 = y;
                            drag.touchid2 = event.pointerId;
                            drag.scaleDistance = Math.sqrt(Math.pow(drag.x2-drag.x,2) + Math.pow(drag.y2-drag.y,2));
                        }
                    }
                }else if (event.type == 'pointerup' ||
                          event.type == 'pointercancel' ||
                          event.type == 'pointerout' ||
                          event.type == 'pointerleave'){
                    delete pointers[event.pointerId];
                    if (drag.touchid == event.pointerId){
                        drag.on = false;
                    }
                }else if (event.type == 'pointermove'){
                    if (pointers[event.pointerId]){
                        pointers[event.pointerId].x = event.pageX - mouseX;
                        pointers[event.pointerId].y = event.pageY - mouseY;
                    }
                    var touch;
                    var touch2;
                    if (pointers[drag.touchid]){
                        touch = pointers[drag.touchid];
                    }else{
                        drag.on = false;
                        return;
                    }
                    var scale = 1.0;
                    if (pointers[drag.touchid2]){
                        touch2 = pointers[drag.touchid2];
                        scale = Math.sqrt(Math.pow(touch.x-touch2.x,2) + Math.pow(touch.y-touch2.y,2)) / drag.scaleDistance;
                        imageScale = drag.startScale * scale;
                    }
                    if (imageScale < 1) {
                        imageScale = 1.0;
                    }else{
                        var offsetX = touch.x;
                        var offsetY = touch.y;
                        if (offsetX && offsetY){
                            imageOffsetX = scale * (drag.startx + (imgWidth/2 - drag.x)) - (imgWidth/2 - offsetX);
                            imageOffsetY = scale * (drag.starty + (imgHeight/2 - drag.y)) - (imgHeight/2 - offsetY);
                        }
                    }
                    setTransform();
                                       
                }
            }
        }

        viewBox.addEventListener("wheel", wheel, true);
        viewBox.addEventListener("mousedown", mouseDown, true);
        window.addEventListener("mouseup", mouseUp, true);
        viewBox.addEventListener("mousemove", mouseMove, true);

        if (window.PointerEvent){
            viewBox.addEventListener("pointerdown",  pointerEvent, true);
            viewBox.addEventListener("pointerup",    pointerEvent, true);
            viewBox.addEventListener("pointermove",  pointerEvent, true);
            viewBox.addEventListener("pointercancel",pointerEvent, true);
            viewBox.addEventListener("pointerover",  pointerEvent, true);
            viewBox.addEventListener("pointerout",   pointerEvent, true);
            viewBox.addEventListener("pointerenter", pointerEvent, true);
            viewBox.addEventListener("pointerleave", pointerEvent, true);
        }else{
            viewBox.addEventListener("touchstart", touchStart, true);
            viewBox.addEventListener("touchend", touchEnd, true);
            viewBox.addEventListener("touchmove", touchMove, true);
        }

        var closeButton = this.ce("span","fa fa-close fa-fw svgpo_headerclose");
        mainBox.appendChild(closeButton);
        
        var lrDrag = this.ce("span","svgpo_cornerbutton");
        lrDrag.style.bottom = 0;
        lrDrag.style.right = 0;
        lrDrag.style.cursor = "nwse-resize";
        mainBox.appendChild(lrDrag);

        var llDrag = this.ce("span","svgpo_cornerbutton");
        llDrag.style.bottom = 0;
        llDrag.style.left = 0;
        llDrag.style.cursor = "nesw-resize";
        mainBox.appendChild(llDrag);

        var ulDrag = this.ce("span","svgpo_cornerbutton");
        ulDrag.style.top = 0;
        ulDrag.style.left = 0;
        ulDrag.style.cursor = "nwse-resize";
        mainBox.appendChild(ulDrag);
        var dragEvents = [];
        var moved = false;
        var enableDrag = function(handle,moveCallback,disableMoved){
            var drag = {"on": false };
            var move = function(event){
                var x,y;
                if (event.touches){
                    var t = event.touches.item(0);
                    x = t.clientX;
                    y = t.clientY;
                }else{
                    x = event.clientX;
                    y = event.clientY;
                }
                if (drag.on && moveCallback){
                    moveCallback('move',x - drag.x, y - drag.y);
                    drag.x = x;
                    drag.y = y;
                    if (!disableMoved)
                        moved = true;
                }
            }
            var start = function(event){
                event.preventDefault();
                drag.on = true;
                var x,y;
                if (event.touches){
                    var t = event.touches.item(0);
                    x = t.clientX;
                    y = t.clientY;
                }else{
                    x = event.clientX;
                    y = event.clientY;
                }
                drag.x = x;
                drag.y = y;
                document.addEventListener("mousemove",move,true);
                handle.addEventListener("touchmove",move,true);
                document.addEventListener("mouseup",end,true);
                document.addEventListener("touchend",end,true);
            }
            var end = function(event){
                var x,y;
                if (event.touches){
                    var t = event.changedTouches.item(0);
                    x = t.clientX;
                    y = t.clientY;
                }else{
                    x = event.clientX;
                    y = event.clientY;
                }
                if (drag.on && moveCallback){
                    moveCallback('end',drag.x - x, drag.y-y);
                }
                document.removeEventListener("mousemove",move);
                handle.removeEventListener("touchmove",move);
                document.removeEventListener("mouseup",end);
                document.removeEventListener("touchend",end);
                drag.on = false;
            }
            handle.addEventListener("mousedown",start,true);
            handle.addEventListener("touchstart",start,true);
            dragEvents.push([handle,"moousedown",start]);
            dragEvents.push([handle,"touchstart",start]);
        }

        var fixDims = function(){
            boxRatio = boxWidth/boxHeight;
            if (rotate % 2){
                if (docRatio < boxRatio){
                    imgWidth = boxWidth;
                    imgHeight = imgWidth * docRatio;
                }else{
                    imgHeight = boxHeight;
                    imgWidth = imgHeight / docRatio;
                }
                image.style.width = imgHeight + "px";
                image.style.height = imgWidth + "px";
                if (compare){
                    image2.style.width = imgHeight + "px";
                    image2.style.height = imgWidth + "px";
                }

            }else{
                if (docRatio > boxRatio){
                    imgWidth = boxWidth;
                    imgHeight = imgWidth / docRatio;
                }else{
                    imgHeight = boxHeight;
                    imgWidth = imgHeight * docRatio;
                }
                image.style.width = imgWidth + "px";
                image.style.height = imgHeight + "px";
                if (compare){
                    image2.style.width = imgWidth + "px";
                    image2.style.height = imgHeight + "px";
                }
            }

            viewBox.style.width = boxWidth + "px";
            viewBox.style.height = boxHeight + "px";
            if (compare){
                comparePositionPixel = Math.round(comparePosition * boxWidth);
                comparePositionMouse = comparePositionPixel;
                viewBox2.style.width = comparePositionPixel + "px";
                viewBox2.style.height = boxHeight + "px";
                compareSlider.style.height = boxHeight + "px";
                compareHandle.style.top = Math.round(0.8 * boxHeight) + "px";
                compareSlider.style.left = (comparePositionPixel-1) + "px";
                compareHandle.style.left = (comparePositionPixel-25) + "px";
            }
            setTransform();
        }
       
        enableDrag(header,function(action,x,y){
            imgX += x;
            imgY += y;
            mouseX += x;
            mouseY += y;
            mainBox.style.top = imgY + "px";
            mainBox.style.left = imgX + "px";
        });
        enableDrag(lrDrag,function(action,x,y){
            boxWidth += x;
            boxHeight += y;
            fixDims();
        });
        enableDrag(llDrag,function(action,x,y){
            imgX += x;
            mouseX += x;
            boxWidth -= x;
            boxHeight += y;
            mainBox.style.left = imgX + "px";
            fixDims();
        });
        enableDrag(ulDrag,function(action,x,y){
            imgX += x;
            imgY += y;
            mouseX += x;
            mouseY += y;
            mainBox.style.top = imgY + "px";
            mainBox.style.left = imgX + "px";
            boxWidth -= x;
            boxHeight -= y;
            fixDims();
        });
        if (compare){
            enableDrag(compareHandle,function(action,x,y){
                comparePositionMouse += x;
                comparePositionPixel = comparePositionMouse;
                if (comparePositionPixel < 0) comparePositionPixel = 0;
                if (comparePositionPixel > boxWidth) comparePositionPixel = boxWidth;
                comparePosition = comparePositionPixel / boxWidth;
                compareSlider.style.left = (comparePositionPixel-1) + "px";
                compareHandle.style.left = (comparePositionPixel-25) + "px";
                viewBox2.style.width = comparePositionPixel + "px";

            }, true);
        }

        var rotateRight = this.ce("div","fa fa-rotate-right svgpo_rotateright");
        rotateRight.setAttribute("title","Rotate Right");
        mainBox.appendChild(rotateRight);
        rotateRight.onclick = function(){
            rotate++;
            if (rotate == 4) rotate=0;    
            fixDims();
        }
        var rotateLeft = this.ce("div","fa fa-rotate-left svgpo_rotateleft");
        rotateLeft.setAttribute("title","Rotate Left");
        mainBox.appendChild(rotateLeft);
        rotateLeft.onclick = function(){
            rotate--;
            if (rotate < 0) rotate=3;    
            fixDims();
        }
        if (compare){
            var compareButton = this.ce("div","fa fa-files-o svgpo_history");
            compareButton.setAttribute("title","Compare Changes");
            mainBox.appendChild(compareButton);
            compareButton.onclick = function(){
                if (compareOn){
                    image.src = url;
                    viewBox2.style.visibility="hidden";
                    compareSlider.style.visibility = "hidden";
                    compareHandle.style.visibility = "hidden";
                    compareOn = false;
                    compareButton.style.color = "white";
                }else{
                    compareOn = true;
                    comparePosition = 0.5;
                    comparePositionPixel = Math.round(comparePosition * boxWidth);
                    comparePositionMouse = comparePositionPixel;
                    compareSlider.style.left = (comparePositionPixel-1) + "px";
                    compareHandle.style.left = (comparePositionPixel-25) + "px";
                    var slug = url.replace(/\.svg$/,"");
                    image.src = slug + "_CMP-2.svg";
                    image2.src = slug + "_CMP-1.svg";
                    viewBox2.style.visibility="visible";
                    compareSlider.style.visibility = "visible";
                    compareHandle.style.visibility = "visible";
                    viewBox2.style.width = Math.round(boxWidth * comparePosition) + "px";
                    compareButton.style.color = "#f8f";
                }
            }
        }
        var fullScreen = this.ce("div","fa fa-expand svgpo_fullscreen");
        mainBox.appendChild(fullScreen);
        var isFullScreen = false;
        fullScreen.onclick = function(){
            if (isFullScreen){
                isFullScreen = false;
                imgX = origImgX;
                imgY = origImgY;
                mouseX = imgX + 0; 
                mouseY = imgY + 30; 
                boxWidth = origBoxWidth;
                boxHeight = origBoxHeight;
                mainBox.style.top = imgY + "px";
                mainBox.style.left = imgX + "px";
                fixDims();
            }else{
                isFullScreen = true;
                imgX = 15;
                imgY = 15;
                mouseX = imgX + 0; 
                mouseY = imgY + 30; 
                mainBox.style.top = imgY + "px";
                mainBox.style.left = imgX + "px";
                boxWidth = windowWidth;
                boxHeight = windowHeight - 30;
                fixDims();
            }
        }

        var closed = false;
        var close = function(notMoved){
            if (closed) return;
            if (notMoved && moved){
                return;
            }
            closed = true;
            viewBox.removeEventListener("wheel", wheel);
            viewBox.removeEventListener("mousedown", mouseDown);
            window.removeEventListener("mouseup", mouseUp);
            viewBox.removeEventListener("mousemove", mouseMove);

            if (window.PointerEvent){
                viewBox.removeEventListener("pointerdown",  pointerEvent);
                viewBox.removeEventListener("pointerup",    pointerEvent);
                viewBox.removeEventListener("pointermove",  pointerEvent);
                viewBox.removeEventListener("pointercancel",pointerEvent);
                viewBox.removeEventListener("pointerover",  pointerEvent);
                viewBox.removeEventListener("pointerout",   pointerEvent);
                viewBox.removeEventListener("pointerenter", pointerEvent);
                viewBox.removeEventListener("pointerleave", pointerEvent);
            }else{
                viewBox.removeEventListener("touchstart", touchStart);
                viewBox.removeEventListener("touchend", touchEnd);
                viewBox.removeEventListener("touchmove", touchMove);
            }
            for (var i=0; i < dragEvents.length; i++){
                var e = dragEvents[i];
                e[0].removeEventListener(e[1],e[2]);
            }
            dragEvents = [];
            document.body.removeChild(mainBox);
        }
    }
    this.data.closers[url] = close;
    closeButton.onclick = function(){ close() };
    document.body.insertBefore(mainBox, document.body.firstChild);
}
