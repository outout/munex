define(["jquery"], function($) {

    "use strict";
    /**
     *   @constructor
     */
    function CanvasLib(element) {
        if (typeof element === 'string') {

            this.canvasElementObject = $('#' + element);
            this.canvasElement = this.canvasElementObject[0];

            /**
             * @type {CanvasRenderingContext2D}
             */
            this.ctx = this.canvasElement.getContext('2d');

            //define some constants
            this.containerWidth = this.canvasElementObject.width();
            this.containerHeight = this.canvasElementObject.height();
        } else {

            this.canvasElementObject = element;
            this.canvasElement = this.canvasElementObject[0];

            this.ctx = this.canvasElement.getContext('2d');
            //define some constants
            this.containerWidth = this.canvasElementObject.width();
            this.containerHeight = this.canvasElementObject.height();
        }
        this.defaultColor = '#414141';
        this.dragging = false;
        this.dragOffsetX = null;
        this.textFont = '12px Arial';
        this.textHeight = 12; //in pixels, used for accurate rotation
        this.ctx.lineCap = 'butt';
        this.ctx.textBaseline = 'alphabetic';
        this.offCanvasWidth = 64;
        this.offCanvasHeight = 64;
        this._debugCounter = 0;

        this.off_canvas = {};
        this.off_context = {};

        // This complicates things a little but but fixes mouse co-ordinate problems
        // when there's a border or padding. See getMouse for more detail

        if (document.defaultView && document.defaultView.getComputedStyle) {
            this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(this.canvasElement, null)['paddingLeft'], 10) || 0;
            this.stylePaddingTop = parseInt(document.defaultView.getComputedStyle(this.canvasElement, null)['paddingTop'], 10) || 0;
            this.styleBorderLeft = parseInt(document.defaultView.getComputedStyle(this.canvasElement, null)['borderLeftWidth'], 10) || 0;
            this.styleBorderTop = parseInt(document.defaultView.getComputedStyle(this.canvasElement, null)['borderTopWidth'], 10) || 0;
        }
        // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
        // They will mess up mouse coordinates and this fixes that
        var html = document.body.parentNode;
        this.htmlTop = html.offsetTop;
        this.htmlLeft = html.offsetLeft;


        /**
         * ----------------------------------------------------------
         * this is needed for resize and HiDPI stuff
         * ----------------------------------------------------------
         */
        this.reInitCtx = function() {
            this.ctx = this.canvasElement.getContext('2d');
        };

        /**
         * ----------------------------------------------------------
         * ----------------------------------------------------------
         * @param {Number} width
         * @param {Number} height
         */
        this.safeResizeCanvas = function(width, height) {

            this.canvasElementObject.height(height);
            this.canvasElementObject.width(width);
            this.canvasElementObject.attr('height', height);
            this.canvasElementObject.attr('width', width);
            this.containerHeight = height;
            this.containerWidth = width;

            this.reInitCtx();


        };


        /**
         * ----------------------------------------------------------
         * ----------------------------------------------------------
         * @param {String} color
         * @param {Number} alpha
         * @return {*}
         */
        this.preCalculateColor = function(color, alpha) {

            if (typeof  alpha === 'undefined') {
                return color;
            } else {
                if (alpha >= 1) {
                    return color;
                }
                var colors = this.hexColorToIntegerArray(color);
                return 'rgba(' + colors[0] + ',' + colors[1] + ',' + colors[2] + ',' + alpha + ')';
            }

        };

        /**
         * ----------------------------------------------------------
         * parse color string '#ffffff' to [255,255,255]
         * ----------------------------------------------------------
         * @param {string} colorHex
         * @return {Number[]}
         */
        this.hexColorToIntegerArray = function(colorHex) {
            var out = colorHex.replace('#', '');

            var colorR = parseInt(out.substring(0, 2), 16);
            var colorG = parseInt(out.substring(2, 4), 16);
            var colorB = parseInt(out.substring(4, 6), 16);

            return [colorR, colorG, colorB];

        };


        /**
         * ----------------------------------------------------------
         * Draw Stroked Line
         * ----------------------------------------------------------
         * @param {Object} start
         * @param {Number} start.x
         * @param {Number} start.y
         * @param {Object} end
         * @param {Number} end.x
         * @param {Number} end.y
         * @param {Number} width
         * @param {String} color  e.g. '#acacff'
         */
        this.lineStroke = function(start, end, width, color) {

            this.ctx.lineWidth = width;
            this.ctx.beginPath();
            this.ctx.strokeStyle = color;
            this.ctx.moveTo(start.x, start.y);
            this.ctx.lineTo(end.x, end.y);
            this.ctx.stroke();

        };


        /**
         * ----------------------------------------------------------
         * Draw text on canvas
         * ----------------------------------------------------------
         * @methodOf {CanvasEngine}
         * @param {object} point x/y coordinates
         * @param {number} point.x
         * @param {number} point.y
         * @param {String} text
         * @param {String} align
         * @param {Number} angle
         * @param {String} color
         * @param {Number} [alpha]
         */
        this.text = function(point, text, align, angle, color, alpha) {

            var x = point.x;
            var y = point.y;
            //console.log(point, text, align, angle, color, alpha);

            this.ctx.font = this.textFont;
            this.ctx.textAlign = align;

            if (alpha === undefined) {
                this.ctx.fillStyle = color;
            } else {
                var colors = this.hexColorToIntegerArray(color);
                this.ctx.fillStyle = 'rgba(' + colors[0] + ',' + colors[1] + ',' + colors[2] + ',' + alpha + ')';
            }

            var metric = this.ctx.measureText(text);

            if (angle !== 0) {
                this.ctx.save(); // this will "save" the normal canvas to return to
                // These two methods will change EVERYTHING
                // drawn on the canvas from this point forward
                // Since we only want them to apply to this one fillText,
                // we use save and restore before and after

                // We want to find the center of the text (or whatever point you want) and rotate about it
                var tx = x;
                var ty = y + 5;
                // Translate to near the center to rotate about the center
                this.ctx.translate(tx, ty);

                // Then rotate...
                this.ctx.rotate(this._degToRad(angle));
                // Then translate back to draw in the right place!
                this.ctx.translate(-tx, -ty);
                this.ctx.fillText(text, x, y);
                this.ctx.restore(); // This will un-translate and un-rotate the canvas
            } else {
                //no rotation needed, just print text
                this.ctx.fillText(text, x, y);
            }
            //return metric
            return metric;

        };


        /**
         * ----------------------------------------------------------
         * ----------------------------------------------------------
         * @param {string} text
         * @return {TextMetrics}
         */
        this.getTextMetric = function(text) {

            this.ctx.font = this.textFont;
            return this.ctx.measureText(text);

        };


        /**
         * ----------------------------------------------------------
         * ----------------------------------------------------------
         * @param {Object} start
         * @param {Number} start.x
         * @param {Number} start.y
         * @param {Object} end
         * @param {Number} end.x
         * @param {Number} end.y
         * @param {String} color
         */
        this.fillRect = function(start, end, color) {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(start.x, start.y, end.x, end.y);

        };

        this.fillRectGradient = function(start, end, colorStart, colorEnd) {
            var grd = this.ctx.createLinearGradient(0, 0, 0, 20);
            grd.addColorStop(0, colorStart);
            grd.addColorStop(0.4, colorStart);
            grd.addColorStop(1, colorEnd);
            this.ctx.fillStyle = grd;
            this.ctx.fillRect(start.x, start.y, end.x, end.y);

        };


        this.fillTriangleGradientLeft = function(start, end, color) {
            var grd = this.ctx.createLinearGradient(0, 0, 0, end.y);
            grd.addColorStop(0, color);
            grd.addColorStop(0.4, color);
            grd.addColorStop(1, "#666");

            this.ctx.beginPath();
            this.ctx.moveTo(start.x, start.y);
            this.ctx.lineTo(start.x + end.x, end.y / 2 + 1);
            this.ctx.lineTo(start.x, end.y + 1);
            this.ctx.fillStyle = grd;
            this.ctx.fill();
            // this.ctx.fillRect(start.x, start.y, end.x, end.y);

        };
        this.fillTriangleGradientRight = function(start, end, color) {
            var grd = this.ctx.createLinearGradient(0, 0, 0, 20);
            grd.addColorStop(0, color);
            grd.addColorStop(0.4, color);
            grd.addColorStop(1, "#666");

            this.ctx.beginPath();
            this.ctx.moveTo(start.x + end.x, start.y);
            this.ctx.lineTo(start.x, end.y / 2 + 1);
            this.ctx.lineTo(start.x + end.x, end.y + 1);
            this.ctx.fillStyle = grd;
            this.ctx.fill();
            // this.ctx.fillRect(start.x, start.y, end.x, end.y);

        };
        /**
         * ----------------------------------------------------------
         * ----------------------------------------------------------
         * @param {Object} start
         * @param {Number} start.x
         * @param {Number} start.y
         * @param {Object} end
         * @param {Number} end.x
         * @param {Number} end.y
         * @param {String} color
         */
        this.strokeRect = function(start, end, color) {
            this.ctx.strokeStyle = color;
            this.ctx.strokeRect(start.x, start.y, end.x, end.y);

        };

        this.strokeRectWhole  = function(start, end, color) {
            this.ctx.strokeStyle = color;
            this.ctx.strokeRect(start.x, start.y, end.x, end.y);

        };

        /**
         *
         * @param {String} hex
         * @param {Number} lum
         * @returns {string}
         */
        this.colorLuminance = function(hex, lum) {

            // validate hex string
            hex = String(hex).replace(/[^0-9a-f]/gi, '');
            if (hex.length < 6) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            lum = lum || 0;

            // convert to decimal and change luminosity
            var rgb = "#", c, i;
            for (i = 0; i < 3; i++) {
                c = parseInt(hex.substr(i * 2, 2), 16);
                c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                rgb += ("00" + c).substr(c.length);
            }

            return rgb;
        };


        /**
         * ----------------------------------------------------------
         * ----------------------------------------------------------
         * @param {Array} vertices
         * @param {String} colorHex
         */
        this.polyFilled = function(vertices, colorHex) {

            this.ctx.beginPath();
            this.ctx.fillStyle = colorHex || this.defaultColor;


            for (var i = 0; i < vertices.length; i++) {

                if (i !== 0) {
                    this.ctx.lineTo(vertices[i][0], vertices[i][1]);
                } else {
                    this.ctx.moveTo(vertices[i][0], vertices[i][1]);
                }

            }

            this.ctx.fill();
            //this.ctx.closePath();
        };

        this.drawArrow = function(startX, endX, startY, height, strand, color) {


            var x, y, a, b, nuberOfarrow;

            var length =  endX - startX;

            var distanceBetween = 40;

            var lengthNum = length / distanceBetween ;
            b = height;
            a = 6;

            y = startY;

            var operators = {
                '+': function(x, a) { return x + a; },
                '-': function(x, a) { return x - a; }
                // ...
            };

            this.ctx.fillStyle = color;

            for (var i = 0; i <= lengthNum; i++) {

                x = startX + distanceBetween * i;

                if (x >= endX && length > distanceBetween) {
                    break;
                }

                this.ctx.beginPath();
                this.ctx.lineTo(x, y + 2);
                this.ctx.lineTo(operators[strand](x, a), y + b / 2 );
                this.ctx.lineTo(x, y + b - 2 );
                this.ctx.closePath();
                this.ctx.fill();
            }


        };
        /**
         * ----------------------------------------------------------
         * ----------------------------------------------------------
         * @param {Array} vertices
         * @param {string} colorFill
         * @param {string} colorBorder
         * @param {boolean} [drawBorder]
         */
        this.polyFilledWithBorder = function(vertices, colorFill, colorBorder, drawBorder) {

            this.ctx.beginPath();
            this.ctx.fillStyle = colorFill;
            this.ctx.strokeStyle = colorBorder;


            for (var i = 0; i < vertices.length; i++) {

                if (i !== 0) {
                    this.ctx.lineTo(vertices[i].x, vertices[i].y);
                } else {
                    this.ctx.moveTo(vertices[i].x, vertices[i].y);
                }

            }

            this.ctx.closePath();

            this.ctx.fill();
            if (drawBorder === true) {
                this.ctx.stroke();
            }



        };



        /**
         *
         * @param {object} start
         * @param {object} end
         * @param {Number} width
         * @param {object} arrow
         * @param {Number} arrow.width
         * @param {Number} arrow.height
         * @param {string} color
         * @param {boolean} [isDashed]  OPTIONAL
         * @param {Array} [dashArray] OPTIONAL
         */
        this.drawWithArrowheads = function(start, end, width, arrow, color, isDashed, dashArray) {


            // arbitrary styling
            if (typeof  isDashed !== 'undefined' && isDashed === true) {

              this.dashedLine(start, end, dashArray, width, color);

            } else {

                this.lineStroke(start, end, width, color);

            }

            this.ctx.fillStyle = color;

            // draw the starting arrowhead
            var startRadians = Math.atan((end.y - start.y) / (end.x - start.x));
            startRadians += ((end.x > start.x) ? -90 : 90) * Math.PI / 180;
            this.drawArrowhead(start.x, start.y, startRadians, arrow);

            // draw the ending arrowhead
            var endRadians = Math.atan((end.y - start.y) / (end.x - start.x));
            endRadians += ((end.x > start.x) ? 90 : -90) * Math.PI / 180;
            this.drawArrowhead(end.x, end.y, endRadians, arrow);

        };

        /**
         *
         * @param x
         * @param y
         * @param radians
         * @param arrow
         * @param arrow.width
         * @param arrow.height
         */
        this.drawArrowhead = function(x, y, radians, arrow) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.translate(x, y);
            this.ctx.rotate(radians);
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(arrow.height, arrow.width);
            this.ctx.lineTo(-1 * arrow.height, arrow.width);
            this.ctx.closePath();
            this.ctx.restore();
            this.ctx.fill();

        };


        /**
         *
         * @param {number} x
         * @param {number} y
         * @param {number} h
         * @param {number} w
         * @param {*} color
         */
        this.drawFillArrowLeft = function(x, y, h, w, color) {
            var minWidth = w;
            if(minWidth > h){
               var minWidth = h;
            }
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y + h);
            this.ctx.lineTo(x -  (0.8 * minWidth), y + h / 2);


            this.ctx.fill();
        };

        /**
         *
         * @param {number} x
         * @param {number} y
         * @param {number} h
         * @param {number} w
         * @param {*} color
         */
        this.drawFillArrowRight = function(x, y, h, w, color) {
            var minWidth = w;
            if(minWidth > h){
                var minWidth = h;
            }
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y + h);
            this.ctx.lineTo(x + (0.8 * minWidth), y + h / 2);


            this.ctx.fill();
        };

        this.fillRectGradientAll = function(start, end, colorStart, colorEnd, height) {
            var grd = this.ctx.createLinearGradient(start.x, start.y, start.x, start.y + height);
            grd.addColorStop(0, colorStart);
            grd.addColorStop(0.4, colorStart);
            grd.addColorStop(1, colorEnd);
            this.ctx.fillStyle = grd;
            this.ctx.fillRect(start.x, start.y, end.x, end.y);

        };
        this.fillTriangleGradientLeftAll = function(start, end, height, color ) {
            var grd = this.ctx.createLinearGradient( start.x, start.x, start.x ,end.y );
            grd.addColorStop(0, color);
            grd.addColorStop(0.4, color);
            grd.addColorStop(1, "#666");

            this.ctx.beginPath();
            this.ctx.moveTo(start.x, start.y);
            this.ctx.lineTo(start.x + height , start.y );
            this.ctx.lineTo(start.x+ height / 2, start.y + end.y  );
            this.ctx.fillStyle = grd;
            this.ctx.fill();


        };
        this.fillTriangleGradientRightAll = function(start, end, height , color) {
            var grd = this.ctx.createLinearGradient(start.x, start.x, start.x, end.y);
            grd.addColorStop(0, color);
            grd.addColorStop(0.4, color);
            grd.addColorStop(1, "#666");

            this.ctx.beginPath();
            this.ctx.moveTo(start.x, start.y + end.y);
            this.ctx.lineTo(start.x + height , start.y + end.y);
            this.ctx.lineTo(start.x + height/2 , start.y  );
            this.ctx.fillStyle = grd;
            this.ctx.fill();
            //   console.log(start.x, start.y, end.x, end.y);

        };
        /**
         *
         * @param x
         * @param y
         * @param step
         * @param lineH
         */
        this.drawTriangleAll = function(x, y, lineH, color) {
            this.ctx.fillStyle   = color;


            this.ctx.beginPath();
            // give the (x,y) coordinates
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x +lineH, y + lineH);
            this.ctx.lineTo(x + lineH, y - lineH);
            this.ctx.lineTo(x , y);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = "#ffffff";
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.closePath();


        };
        /**
         *
         * @param x
         * @param y
         * @param lineH
         * @param color
         */
        this.drawVertical = function(x, y, lineH, color) {
            this.ctx.strokeStyle = color;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y - lineH);
            this.ctx.stroke();
            this.ctx.closePath();


        };
        /**
         *
         * @param x
         * @param y
         * @param step
         * @param lineH
         */
        this.drawTriangle = function(x, y, lineH, color) {
            this.ctx.fillStyle   = color;


            this.ctx.beginPath();
            // give the (x,y) coordinates
            this.ctx.moveTo(x-5, y);
            this.ctx.lineTo(x+5, y);
            this.ctx.lineTo(x, y+7);
            this.ctx.lineTo(x-5, y);

            this.ctx.fill();
            this.ctx.closePath();


        };
        /**
         * ----------------------------------------------------------
         * ----------------------------------------------------------
         * @param collection
         * @param width
         * @param color
         * @param options
         */
        this.lineArrayStroke = function(collection, width, color, options) {


            this.ctx.lineWidth = width;
            this.ctx.beginPath();
            this.ctx.strokeStyle = color;

            var len = collection.length;

            if (typeof options !== 'undefined') {
                if (typeof options.endCutoff !== 'undefined') {
                    len -= options.endCutoff;
                }
            }

            for (var i = 0; i < len; i++) {

                if (i !== 0) {
                    this.ctx.lineTo(collection[i][0], collection[i][1]);
                } else {
                    this.ctx.moveTo(collection[i][0], collection[i][1]);
                }

            }

            this.ctx.stroke();

        };


        /**
         *
         * @param {object} center
         * @param {Number} center.x
         * @param {Number} center.y
         * @param {Number} radius
         * @param {Number} startAngle
         * @param {Number} endAngle
         * @param {Number} lineWidth
         * @param {String} color
         */
        this.arcStroke = function(center, radius, startAngle, endAngle, lineWidth, color) {

            this.ctx.beginPath();
            this.ctx.arc(center.x, center.y, radius, this._degToRad(startAngle), this._degToRad(endAngle), false);
            this.ctx.lineWidth = lineWidth;
            this.ctx.strokeStyle = color;



            this.ctx.stroke();

        };


        this.arcFill = function(center, radius, startAngle, endAngle, lineWidth, color) {

            this.ctx.beginPath();
            this.ctx.arc(center.x, center.y, radius, this._degToRad(startAngle), this._degToRad(endAngle), false);
            this.ctx.lineWidth = lineWidth;
            this.ctx.fillStyle = color;



            this.ctx.fill();

        };

        this.arcFillAndStroke = function(center, radius, startAngle, endAngle, lineWidth, color, borderColor) {

            this.ctx.beginPath();
            this.ctx.arc(center.x, center.y, radius, this._degToRad(startAngle), this._degToRad(endAngle), false);
            this.ctx.lineWidth = lineWidth;
            this.ctx.fillStyle = color;
            this.ctx.strokeStyle = borderColor;

            this.ctx.fill();
            this.ctx.stroke();

        };



        this.getPointOnCircle = function(center, radius, angle) {

            return {
                x : (center.x + radius * Math.cos(this._degToRad(angle))),
                y : (center.y + radius * Math.sin(this._degToRad(angle)))
            }
        };

        /**
         * ----------------------------------------------------------
         * ----------------------------------------------------------
         * @param {Object} p1
         * @param {Number} p1.x
         * @param {Number} p1.y
         * @param {Object} p2
         * @param {Number} p2.x
         * @param {Number} p2.y
         * @param {Array} dashArray
         * @param {Number} width
         * @param {String} color
         * @param {Object} [options]
         */

        this.dashedLine = function(p1, p2, dashArray, width, color, options) {

            var x = p1.x;
            var y = p1.y;
            var x2 = p2.x;
            var y2 = p2.y;


            this.ctx.lineWidth = width;
            this.ctx.beginPath();
            this.ctx.strokeStyle = color;

            if (!dashArray) {
                dashArray = [10, 5];
            }
            if (dashLength === 0) {
                dashLength = 0.001;
            } // Hack for Safari
            var dashCount = dashArray.length;
            this.ctx.moveTo(x, y);
            var dx = (x2 - x), dy = (y2 - y);
            var slope = dy / dx;
            if (dx === 0) {
                slope = 1;
            }
            var distRemaining = Math.sqrt(dx * dx + dy * dy);
            var dashIndex = 0, draw = true;
            while (distRemaining >= 0.1) {
                var dashLength = dashArray[dashIndex++ % dashCount];
                if (dashLength > distRemaining) {
                    dashLength = distRemaining;
                }
                var xStep = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
                if (dx < 0) {
                    xStep = -xStep;
                }
                x += xStep;
                y += slope * xStep;
                this.ctx[draw ? 'lineTo' : 'moveTo'](x, y);
                distRemaining -= dashLength;
                draw = !draw;
            }


            this.ctx.stroke();

        };


        /**
         * ----------------------------------------------------------
         * Delete everything on canvas
         * ----------------------------------------------------------
         * @methodOf {CanvasEngine}
         */
        this.clearAll = function() {
            this.ctx.clearRect(0, 0, this.containerWidth, this.containerHeight);


        };

        this.requestOffCanvas = function(key) {

            this.off_canvas[key] = document.createElement('canvas');
            this.off_canvas[key].width = this.offCanvasWidth;
            this.off_canvas[key].height = this.offCanvasHeight;
            this.off_context[key] = this.off_canvas[key].getContext('2d');

        };

        this.clearOffCanvas = function(key) {
            this.off_context[key].clearRect(0, 0, this.offCanvasWidth, this.offCanvasHeight);


        };

        this.getOffCanvasImageData = function(key) {
            return this.off_context[key].getImageData(0, 0, this.offCanvasWidth, this.offCanvasHeight);

        };

        /**
         * ----------------------------------------------------------
         * ----------------------------------------------------------
         * @param {event} e
         * @return {Object}
         */
        this.getMouse = function(e) {
            var element = this.canvasElement, offsetX = 0, offsetY = 0, mx, my;

            // Compute the total offset
            if (element.offsetParent !== undefined) {
                do {
                    offsetX += element.offsetLeft;
                    offsetY += element.offsetTop;
                } while ((element = element.offsetParent));
            }

            // Add padding and border style widths to offset
            // Also add the <html> offsets in case there's a position:fixed bar
            offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
            offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

            mx = e.pageX - offsetX;
            my = e.pageY - offsetY;

            // We return a simple javascript object (a hash) with x and y defined
            return {x: mx, y: my};
        };

        /**
         * ----------------------------------------------------------
         * Convert degrees to radians, since all JS angle operations
         * are done in radians.
         * ----------------------------------------------------------
         * @param {Number} degrees
         * @return {Number}
         * @private
         */
        this._degToRad = function(degrees) {
            return degrees * (Math.PI / 180);
        };


        /**
         * ----------------------------------------------------------
         * basic hit-test
         * ----------------------------------------------------------
         * @param {Array} poly polygon coordinates
         * @param {number} pointX
         * @param {Number} pointY
         * @returns {boolean}
         */
        this.isPointInsidePoly = function(poly, pointX, pointY) {
            var i, j;
            var inside = false;
            for (i = 0, j = poly.length - 1; i < poly.length; j = i++) {
                if(((poly[i].y > pointY) != (poly[j].y > pointY)) && (pointX < (poly[j].x - poly[i].x) * (pointY-poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x) ) inside = !inside;
            }
            return inside;
        };



    }

    return CanvasLib;
});