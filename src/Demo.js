define(['jquery', 'underscore', 'munex/Munex', 'munex/MunexConsole', 'datGui'],


    /**
     *
     @param {jQuery} $
     @param {underscore} _
     @param {Munex} Munex
     * @param {MunexConsole} MunexConsole
     * @param {Function} dat
     * @returns {{init: init}}
     */
        function($, _, Munex, MunexConsole) {

        return {

            init: function(selectors) {
                var self = this;
                this.munex = new Munex();

                this.munex.addLayer('Layer 1', '#acacff');
                this.munex.addLayer('Layer 2', '#ffcc00');
                this.munex.addLayer('Layer 3', '#ff0000');

                this.munex.hideConnectionForLayer('Layer 1');
                this.munex.hideConnectionForLayer('Layer 2');

                this.munex.init(selectors);

                this.statsDivContainer = $('.munexSidebar');

                this.munex.statsCallback = function() {

                    var groupsCountHTML =  '<strong>Connections count</strong>';


                    _.each(self.munex.CONNECTION_COUNT, function(group, groupName){

                        groupsCountHTML += '<div><strong> ' +groupName+ ' </strong></div>';

                        groupsCountHTML += '<ul>';
                        _.each(group, function(value, targetGroupName) {

                            groupsCountHTML += '<li> ' +targetGroupName+ ' : ' +value+ '  </li>';
                        });

                        groupsCountHTML += '</ul>';
                    });


                    self.statsDivContainer.html(groupsCountHTML);

                };



                this.munex.addGroup('Group A');
                this.munex.addGroup('Group B');
                this.munex.addGroup('Group C');

                this.munex.group('Group A').layer('Layer 1').addNode({id: 'a', name: 'a', parent: []});

                this.munex.group('Group A').layer('Layer 2').addNode({id: 'a1', name: 'A1', parent: ['a']});
                this.munex.group('Group A').layer('Layer 2').addNode({id: 'b1', name: 'B1', parent: ['a']});
                this.munex.group('Group A').layer('Layer 2').addNode({id: 'c1', name: 'C1', parent: ['a']});
                this.munex.group('Group A').layer('Layer 2').addNode({id: 'd1', name: 'D1', parent: ['a']});
                this.munex.group('Group A').layer('Layer 2').addNode({id: 'e1', name: 'E1', parent: ['a']});

                this.munex.group('Group A').layer('Layer 3').addNode({id: 'a2', name: 'A1', parent: ['a1']});
                this.munex.group('Group A').layer('Layer 3').addNode({id: 'b2', name: 'A1', parent: ['a1']});
                this.munex.group('Group A').layer('Layer 3').addNode({id: 'c2', name: 'A1', parent: ['a1']});
                this.munex.group('Group A').layer('Layer 3').addNode({id: 'd2', name: 'A1', parent: ['a1']});
                this.munex.group('Group A').layer('Layer 3').addNode({id: 'e2', name: 'A1', parent: ['b1']});
                this.munex.group('Group A').layer('Layer 3').addNode({id: 'f2', name: 'A1', parent: ['b1']});
                this.munex.group('Group A').layer('Layer 3').addNode({id: 'g2', name: 'A1', parent: ['b1']});
                this.munex.group('Group A').layer('Layer 3').addNode({id: 'h2', name: 'A1', parent: ['b1']});
                this.munex.group('Group A').layer('Layer 3').addNode({id: 'i2', name: 'A1', parent: ['c1']});
                this.munex.group('Group A').layer('Layer 3').addNode({id: 'j2', name: 'A1', parent: ['c1']});
                this.munex.group('Group A').layer('Layer 3').addNode({id: 'k2', name: 'A1', parent: ['c1']});
                this.munex.group('Group A').layer('Layer 3').addNode({id: 'l2', name: 'A1', parent: ['c1']});
                this.munex.group('Group A').layer('Layer 3').addNode({id: 'm2', name: 'A1', parent: ['d1']});
                this.munex.group('Group A').layer('Layer 3').addNode({id: 'n2', name: 'A1', parent: ['d1']});
                this.munex.group('Group A').layer('Layer 3').addNode({id: 'o2', name: 'A1', parent: ['d1']});
                this.munex.group('Group A').layer('Layer 3').addNode({id: 'p2', name: 'A1', parent: ['e1']});
                this.munex.group('Group A').layer('Layer 3').addNode({id: 'q2', name: 'A1', parent: ['e1']});
                this.munex.group('Group A').layer('Layer 3').addNode({id: 'r2', name: 'A1', parent: ['e1']});



                this.munex.group('Group B').layer('Layer 1').addNode({id: 'a', name: 'a', parent: []} );

                this.munex.group('Group B').layer('Layer 2').addNode({id: 'a1', name: 'A1', parent: ['a']});
                this.munex.group('Group B').layer('Layer 2').addNode({id: 'b1', name: 'B1', parent: ['a']});
                this.munex.group('Group B').layer('Layer 2').addNode({id: 'c1', name: 'C1', parent: ['a']});
                this.munex.group('Group B').layer('Layer 2').addNode({id: 'd1', name: 'D1', parent: ['a']});
                this.munex.group('Group B').layer('Layer 2').addNode({id: 'e1', name: 'E1', parent: ['a']});

                this.munex.group('Group B').layer('Layer 3').addNode({id: 'a2', name: 'A1', parent: ['a1']});
                this.munex.group('Group B').layer('Layer 3').addNode({id: 'b2', name: 'A1', parent: ['a1']});
                this.munex.group('Group B').layer('Layer 3').addNode({id: 'd2', name: 'A1', parent: ['a1']});
                this.munex.group('Group B').layer('Layer 3').addNode({id: 'e2', name: 'A1', parent: ['b1']});
                this.munex.group('Group B').layer('Layer 3').addNode({id: 'h2', name: 'A1', parent: ['b1']});
                this.munex.group('Group B').layer('Layer 3').addNode({id: 'i22', name: 'A1', parent: ['c1']});
                this.munex.group('Group B').layer('Layer 3').addNode({id: 'l22', name: 'A1', parent: ['c1']});
                this.munex.group('Group B').layer('Layer 3').addNode({id: 'm22', name: 'A1', parent: ['d1']});
                this.munex.group('Group B').layer('Layer 3').addNode({id: 'o22', name: 'A1', parent: ['d1']});
                this.munex.group('Group B').layer('Layer 3').addNode({id: 'p22', name: 'A1', parent: ['e1']});
                this.munex.group('Group B').layer('Layer 3').addNode({id: 'r22', name: 'A1', parent: ['e1']});





                this.munex.group('Group C').layer('Layer 1').addNode({id: '3b', name: 'a', parent: []});
                this.munex.group('Group C').layer('Layer 1').addNode({id: '3a', name: 'a', parent: []});

                this.munex.group('Group C').layer('Layer 2').addNode({id: '3a1', name: 'A1', parent: ['3a']});
                this.munex.group('Group C').layer('Layer 2').addNode({id: '3b1', name: 'B1', parent: ['3a', '3b']});
                this.munex.group('Group C').layer('Layer 2').addNode({id: 'd1', name: 'D1', parent: ['3a']});
                this.munex.group('Group C').layer('Layer 2').addNode({id: '3e1', name: 'E1', parent: ['3a']});

                this.munex.group('Group C').layer('Layer 3').addNode({id: 'a2', name: 'A1', parent: ['3a1']});
                this.munex.group('Group C').layer('Layer 3').addNode({id: 'b2', name: 'A1', parent: ['3a1']});
                this.munex.group('Group C').layer('Layer 3').addNode({id: 'd23', name: 'A1', parent: ['3a1']});
                this.munex.group('Group C').layer('Layer 3').addNode({id: 'm23', name: 'A1', parent: ['d1']});
                this.munex.group('Group C').layer('Layer 3').addNode({id: 'o23', name: 'A1', parent: ['d1']});
                this.munex.group('Group C').layer('Layer 3').addNode({id: 'p23', name: 'A1', parent: ['3e1']});
                this.munex.group('Group C').layer('Layer 3').addNode({id: 'r23', name: 'A1', parent: ['3e1']});


                this.munex.drawData();




                var gui = new dat.GUI();


                var radiusController = gui.add(this.munex, 'radius', 10, 320);
                var layerGapController = gui.add(this.munex, 'layerGap', 5, 100);
                var nodeRadiusController = gui.add(this.munex, 'nodeRadius', 1, 20);
                var rotationOffsetController = gui.add(this.munex, 'rotationOffset', 1, 360);
                var edgeWidthController = gui.add(this.munex, 'edgeWidth', 1, 10);
                var edgeColorController = gui.addColor(this.munex, 'edgeColor');
                var groupCircleOpacityController = gui.add(this.munex, 'groupCircleOpacity', 0, 1);
                var cwController = gui.add(this.munex, 'connectionWidth', 1, 10);
                var coController = gui.add(this.munex, 'connectionOpacity', 0, 1);
                var gcwController = gui.add(this.munex, 'groupCircleWidth', 1, 50);
                var sepDegrees = gui.add(this.munex, 'separationDegrees', 0.5, 35).step(0.5);
                var drawNodesController = gui.add(this.munex, 'drawNodes');
                var drawEdgesController = gui.add(this.munex, 'drawEdges');
                var drawConnectionsController = gui.add(this.munex, 'drawConnections');

                radiusController.onChange(function() {
                    self.munex.redrawExistingData();
                });
                layerGapController.onChange(function() {
                    self.munex.redrawExistingData();
                });
                nodeRadiusController.onChange(function() {
                    self.munex.redrawExistingData();
                });
                rotationOffsetController.onChange(function() {
                    self.munex.redrawExistingData();
                });
                edgeColorController.onChange(function() {
                    self.munex.redrawExistingData();
                });
                edgeWidthController.onChange(function() {
                    self.munex.redrawExistingData();
                });
                groupCircleOpacityController.onChange(function() {
                    self.munex.redrawExistingData();
                });

                cwController.onChange(function() {
                    self.munex.redrawExistingData();
                });

                coController.onChange(function() {
                    self.munex.redrawExistingData();
                });

                gcwController.onChange(function() {
                    self.munex.redrawExistingData();
                });

                drawNodesController.onChange(function() {
                    self.munex.redrawExistingData();

                });

                sepDegrees.onChange(function() {
                    self.munex.redrawExistingData();
                });

                drawEdgesController.onChange(function() {
                    self.munex.redrawExistingData();
                });

                drawConnectionsController.onChange(function() {
                    self.munex.redrawExistingData();
                });

            }
        }

    }
);