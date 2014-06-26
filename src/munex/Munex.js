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
            this.edgeColor = '#d1d1d1';
            this.edgeWidth = 1;
            this.groupCircleColor = '#d9d9d9';
            this.groupCircleOpacity = 0.4;
            this.groupCircleWidth = 4;
            this.groupAdding = false;
            this.connectionWidth = 1;
            this.connectionOpacity = 0.5;
            this.separationDegrees = 4;

            this.drawNodes = true;
            this.drawEdges = true;
            this.drawConnections = true;

            this.HIDDEN_CONNECTIONS = [];

            this.GROUPS = [];
            this.LAYERS = [];
            this.NODES_INDEX = {};
            this.CONNECTION_IDEX = {};

            /**
             * ----------------------------------------------------------
             * ----------------------------------------------------------
             * @param selectors
             */
            this.init = function(selectors) {

                this.canvasElementBackground = $('#' + selectors.background);
                this.canvasElementNodes = $('#' + selectors.nodes);
                this.canvasElementEdges = $('#' + selectors.edges);
                this.canvasElementConnections = $('#' + selectors.connections);

                this.engineBackground = new CanvasLib(this.canvasElementBackground);
                this.engineNodes = new CanvasLib(this.canvasElementNodes);
                this.engineEdges = new CanvasLib(this.canvasElementEdges);
                this.engineConnections = new CanvasLib(this.canvasElementConnections);

                this.channel = Channel;


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

                this.CONNECTION_IDEX = {};
                this.NODES_INDEX = {};

                this.groupCount = this.getGroupCount();
                this.startAngle = 0;
                this.groupRadius = 360 / this.groupCount;
                this.rotationOffset = 180 - (this.groupRadius / 2) * -1;

                _.each(this.GROUPS, function(group) {
                    self.drawGroup(group);

                });


                self.drawConnectionLines();

            };


            /**
             * ----------------------------------------------------------
             * ----------------------------------------------------------
             */
            this.drawConnectionLines = function() {
                if (this.drawConnections === true) {
                    var self = this;
                    var center = this.getCanvasCenter();

                    _.each(this.CONNECTION_IDEX, function(nodes, key) {

                        if (nodes.length > 1) {

                            var connections = [];

                            _.each(nodes, function(node, index) {
                                _.each(nodes, function(nextNode) {

                                    var combinedId = node.id + '-' + nextNode.id;
                                    var reversedCombiedId = nextNode.id + '-' + node.id;

                                    if (_.indexOf(self.HIDDEN_CONNECTIONS, node.layer.name) === -1) {

                                        if (node.id !== nextNode.id && _.indexOf(connections, combinedId) === -1 && _.indexOf(connections, reversedCombiedId) === -1) {

                                            self.engineConnections.ctx.strokeStyle = self.engineConnections.preCalculateColor(node.layer.color, self.connectionOpacity);
                                            self.engineConnections.ctx.lineWidth = self.connectionWidth;
                                            self.engineConnections.ctx.beginPath();
                                            self.engineConnections.ctx.moveTo(node.position.x, node.position.y);
                                            self.engineConnections.ctx.quadraticCurveTo(center.x, center.y, nextNode.position.x, nextNode.position.y);
                                            self.engineConnections.ctx.stroke();

                                            connections.push(combinedId);

                                        }
                                    }
                                });
                            });
                        }
                    });
                }
            };


            /**
             * ----------------------------------------------------------
             * ----------------------------------------------------------
             */
            this.redrawExistingData = function() {
                var self = this;
                this.clearAllLayers();

                this.CONNECTION_IDEX = {};
                this.NODES_INDEX = {};

                _.each(this.GROUPS, function(group) {
                    self.drawGroup(group);
                });

                self.drawConnectionLines();

            };

            /**
             * ----------------------------------------------------------
             * ----------------------------------------------------------
             */
            this.clearAllLayers = function() {

                this.engineBackground.clearAll();
                this.engineEdges.clearAll();
                this.engineNodes.clearAll();
                this.engineConnections.clearAll();

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
                var startAngle = this.startAngle + this.separationDegrees - this.rotationOffset;
                var endAngle = this.startAngle + this.groupRadius - this.separationDegrees - this.rotationOffset;
                var centerAngle = startAngle + (endAngle - startAngle) / 2;

                self.NODES_INDEX[groupData.name] = {};



                _.each(groupData.nodes, function(layerNodes, index) {

                    var radius = self.radius + ((groupData.nodes.length * self.layerGap) - ((index + 1) * self.layerGap));

                    var nodesInLayer = layerNodes.length;
                    var layerAngleStep = (self.groupRadius - (self.separationDegrees * 2) ) / (nodesInLayer);
                    var correction = (centerAngle - startAngle) / nodesInLayer;
                    var nodeAngle = startAngle + correction;
                    var layerName = self.LAYERS[index].name;
                    var layerData = self.getLayerData(layerName);

                    var layerCircleColor = self.engineBackground.preCalculateColor(layerData.color, self.groupCircleOpacity);
                    self.engineBackground.arcStroke(center, radius, startAngle, endAngle, self.groupCircleWidth, layerCircleColor);


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
             * @param nodeAngle
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

                this.indexConnection(node.id, {id: node.id + '-' + groupName, group: groupData, layer: layerData, position: point});

                if (this.drawEdges === true) {
                    _.each(node.parent, function(parentId) {

                        self.drawEdge(point, self.NODES_INDEX[groupName][parentId].center, self.edgeWidth, self.edgeColor);

                    });
                }

                if(this.drawNodes === true)  {
                    self.drawNode(point, self.nodeRadius, 1, layerData.color, '#515151');
                }

            };

            /**
             *
             * @param groupName
             * @param nodeId
             * @param propertyName
             * @param value
             */
            this.indexProperty = function(groupName, nodeId, propertyName, value) {

                if (typeof this.NODES_INDEX[groupName][nodeId] === 'undefined') {

                    this.NODES_INDEX[groupName][nodeId] = {};
                    this.NODES_INDEX[groupName][nodeId][propertyName] = value;

                } else {

                    this.NODES_INDEX[groupName][nodeId][propertyName] = value;

                }

            };

            /**
             * ----------------------------------------------------------
             * ----------------------------------------------------------
             * @param {String} layerName
             */
            this.hideConnectionForLayer = function(layerName) {

                this.HIDDEN_CONNECTIONS.push(layerName);
            };


            /**
             * ----------------------------------------------------------
             * ----------------------------------------------------------
             * @param {String} layerName
             */
            this.showConnectionForLayer = function(layerName) {

                this.HIDDEN_CONNECTIONS = _.without(this.HIDDEN_CONNECTIONS, layerName);

            };


            /**
             * ----------------------------------------------------------
             * ----------------------------------------------------------
             * @param {String} nodeId
             * @param {object} data
             */
            this.indexConnection = function(nodeId, data) {

                if (typeof  this.CONNECTION_IDEX[nodeId] !== 'undefined') {

                    this.CONNECTION_IDEX[nodeId].push(data);

                } else {

                    this.CONNECTION_IDEX[nodeId] = [];
                    this.CONNECTION_IDEX[nodeId].push(data);

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

                var self = this;


                console.log('add data', data.name);
                self.GROUPS.push(data);
                self.drawData();
                self.groupAdding = null;


            }

        };

        return Munex;


    });