define(['jquery', 'underscore', '../gfx/CanvasLib', 'core/Channel'],


    /**
     *
     * @param {jquery} $
     * @param {underscore} _
     * @param {CanvasLib} CanvasLib
     * @param {Backbone.Events} Channel
     * @returns {Munex}
     */
        function($, _, CanvasLib, Channel) {


        Munex = function() {

            this.groupCount = 0;
            this.radius = 190;
            this.layerGap = 80;
            this.nodeRadius = 5;
            this.rotationOffset = 20;
            this.edgeColor = '#ddddff';
            this.edgeWidth = 1;
            this.groupCircleColor = '#d9d9d9';


            this.GROUPS = [];
            this.LAYERS = [];
            this.NODES_INDEX = {};

            /**
             * ----------------------------------------------------------
             * ----------------------------------------------------------
             * @param selectors
             */
            this.init = function(selectors) {

                this.canvasElementBackground = $('#' + selectors.background);
                this.canvasElementNodes = $('#' + selectors.nodes);
                this.canvasElementEdges = $('#' + selectors.edges);

                this.engineBackground = new CanvasLib(this.canvasElementBackground);
                this.engineNodes = new CanvasLib(this.canvasElementNodes);
                this.engineEdges = new CanvasLib(this.canvasElementEdges);

                this.channel = Channel;

                this.drawData();
                this.registerApiEvents();

            };


            /**
             * ----------------------------------------------------------
             * ----------------------------------------------------------
             * @returns {*}
             */
            this.getGroupCount = function() {
                return _.size(this.GROUPS);

            };


            /**
             * ----------------------------------------------------------
             * ----------------------------------------------------------
             */
            this.drawData = function() {

                var self = this;

                this.clearAllLayers();

                this.groupCount = this.getGroupCount();
                this.startAngle = 0;
                this.groupRadius = 360 / this.groupCount;
                this.rotationOffset = 180 - (this.groupRadius / 2) * -1;

                _.each(this.GROUPS, function(group) {
                    self.drawGroup(group);
                });

            };


            /**
             * ----------------------------------------------------------
             * ----------------------------------------------------------
             */
            this.redrawExistingData = function() {
                var self = this;
                this.clearAllLayers();
                _.each(this.GROUPS, function(group) {
                    self.drawGroup(group);
                });

            };

            /**
             * ----------------------------------------------------------
             * ----------------------------------------------------------
             */
            this.clearAllLayers = function() {

                this.engineBackground.clearAll();
                this.engineEdges.clearAll();
                this.engineNodes.clearAll();

            };

            /**
             * ----------------------------------------------------------
             * ----------------------------------------------------------
             * @returns {{x: number, y: number}}
             */
            this.getCanvasCenter = function() {

                return {

                    x: this.engineBackground.containerWidth / 2,
                    y: this.engineBackground.containerHeight / 2
                }


            };


            /**
             * ----------------------------------------------------------
             * ----------------------------------------------------------
             * @param groupData
             */
            this.drawGroup = function(groupData) {

                var self = this;

                var center = this.getCanvasCenter();
                var startAngle = this.startAngle + 2 - this.rotationOffset;
                var endAngle = this.startAngle + this.groupRadius - 2 - this.rotationOffset;
                var centerAngle = startAngle + (endAngle - startAngle) / 2;

                self.NODES_INDEX[groupData.name] = {};

                _.each(groupData.nodes, function(layerNodes, index) {

                    var radius = self.radius + ((groupData.nodes.length * self.layerGap) - ((index + 1) * self.layerGap));
                    self.engineBackground.arcStroke(center, radius, startAngle, endAngle, 1, self.groupCircleColor);

                    var nodesInLayer = layerNodes.length;
                    var layerAngleStep = (self.groupRadius - 4 ) / (nodesInLayer);
                    var correction = (centerAngle - startAngle) / nodesInLayer;
                    var nodeAngle = startAngle + correction;
                    var layerName = self.LAYERS[index].name;
                    var layerData = self.getLayerData(layerName);


                    _.each(layerNodes, function(node) {

                        self.drawNodePreparation(node, nodeAngle, center, radius, layerData, groupData);

                        nodeAngle += layerAngleStep;
                    });
                });


                this.startAngle += this.groupRadius;
            };

            /**
             * ----------------------------------------------------------
             * ----------------------------------------------------------
             * @param node
             * @param startNodeAngle
             * @param center
             * @param radius
             * @param layerData
             * @param groupData
             */
            this.drawNodePreparation = function(node, nodeAngle, center, radius, layerData, groupData) {

                var self = this;
                var point = self.engineNodes.getPointOnCircle(center, radius, nodeAngle);
                var groupName = groupData.name;

                this.indexProperty(groupName, node.id, 'center', point);

                _.each(node.parent, function(parentId) {

                    self.drawEdge(point, self.NODES_INDEX[groupName][parentId].center, self.edgeWidth, self.edgeColor);

                });

                self.drawNode(point, self.nodeRadius, 1, layerData.color, '#515151');


            };

            /**
             *
             * @param groupName
             * @param nodeId
             * @param propertyName
             * @param value
             */
            this.indexProperty = function(groupName, nodeId, propertyName, value) {

                 if(typeof this.NODES_INDEX[groupName][nodeId] === 'undefined') {

                     this.NODES_INDEX[groupName][nodeId] = {};
                     this.NODES_INDEX[groupName][nodeId][propertyName] = value;

                 } else {

                     this.NODES_INDEX[groupName][nodeId][propertyName] = value;

                 }

            };


            /**
             * ----------------------------------------------------------
             * ----------------------------------------------------------
             * @param startPoint
             * @param endPoint
             * @param lineWidth
             * @param color
             */
            this.drawEdge = function(startPoint, endPoint, lineWidth, color) {
                this.engineEdges.lineStroke(startPoint, endPoint, lineWidth, color);
            };

            /**
             * ----------------------------------------------------------
             * ----------------------------------------------------------
             * @param point
             * @param radius
             * @param lineWidth
             * @param color
             * @param borderColor
             */
            this.drawNode = function(point, radius, lineWidth, color, borderColor) {

                this.engineNodes.arcFillAndStroke(point, radius, 0, 360, lineWidth, color, borderColor);

            };


            /**
             * ----------------------------------------------------------
             * ----------------------------------------------------------
             */

            this.registerApiEvents = function() {

                this.channel.on('Munex.addLayer', function(data) {

                });
                this.channel.on('Munex.addGroup', function(data) {
                });
                this.channel.on('Munex.removeNode', function(data) {
                });
                this.channel.on('Munex.redraw', function(data) {
                });

            };


            /**
             * ----------------------------------------------------------
             * ----------------------------------------------------------
             * @param name
             * @returns {*}
             */
            this.getLayerData = function(name) {

                return _.findWhere(this.LAYERS, {name: name});
            };


            /**
             * ----------------------------------------------------------
             * ----------------------------------------------------------
             * @param name
             * @param color
             */
            this.addLayer = function(name, color) {
                this.LAYERS.push({name: name, color: color});
            };

            /**
             * ----------------------------------------------------------
             * ----------------------------------------------------------
             * @param data
             */
            this.addGroupData = function(data) {

                this.GROUPS.push(data);
            }

        };

        return Munex;


    });