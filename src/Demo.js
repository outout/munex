define(['munex/Munex', 'munex/MunexConsole', 'datGui'],


    /**
     *
     @param {Munex} Munex
     * @param {MunexConsole} MunexConsole
     * @param {Function} dat
     * @returns {{init: init}}
     */
        function(Munex, MunexConsole) {

        return {

            init: function(selectors) {
                var self = this;
                this.munex = new Munex();

                this.munex.addLayer('Layer 1', '#acacff');
                this.munex.addLayer('Layer 2', '#ffcc00');
                this.munex.addLayer('Layer 3', '#ff0000');

                this.munex.addGroupData(
                    {
                        name : 'Group A',
                        nodes: [
                            [
                                {id: 'a', name: 'a', parent: []}

                            ],
                            [

                                {id: 'a1', name: 'A1', parent: ['a']},
                                {id: 'b1', name: 'B1', parent: ['a']},
                                {id: 'c1', name: 'C1', parent: ['a']},
                                {id: 'd1', name: 'D1', parent: ['a']},
                                {id: 'e1', name: 'E1', parent: ['a']}
                            ],
                            [
                                {id: 'a2', name: 'A1', parent: ['a1']},
                                {id: 'b2', name: 'A1', parent: ['a1']},
                                {id: 'c2', name: 'A1', parent: ['a1']},
                                {id: 'd2', name: 'A1', parent: ['a1']},
                                {id: 'e2', name: 'A1', parent: ['b1']},
                                {id: 'f2', name: 'A1', parent: ['b1']},
                                {id: 'g2', name: 'A1', parent: ['b1']},
                                {id: 'h2', name: 'A1', parent: ['b1']},
                                {id: 'i2', name: 'A1', parent: ['c1']},
                                {id: 'j2', name: 'A1', parent: ['c1']},
                                {id: 'k2', name: 'A1', parent: ['c1']},
                                {id: 'l2', name: 'A1', parent: ['c1']},
                                {id: 'm2', name: 'A1', parent: ['d1']},
                                {id: 'n2', name: 'A1', parent: ['d1']},
                                {id: 'o2', name: 'A1', parent: ['d1']},
                                {id: 'p2', name: 'A1', parent: ['e1']},
                                {id: 'q2', name: 'A1', parent: ['e1']},
                                {id: 'r2', name: 'A1', parent: ['e1']}

                            ]
                        ]

                    });

                this.munex.addGroupData( {
                                        name : 'Group B',
                                        nodes: [
                                            [
                                                {id: 'a', name: 'a', parent: []}

                                            ],
                                            [

                                                {id: 'a1', name: 'A1', parent: ['a']},
                                                {id: 'b1', name: 'B1', parent: ['a']},
                                                {id: 'c1', name: 'C1', parent: ['a']},
                                                {id: 'd1', name: 'D1', parent: ['a']},
                                                {id: 'e1', name: 'E1', parent: ['a']}
                                            ],
                                            [
                                                {id: 'a22', name: 'A1', parent: ['a1']},
                                                {id: 'b22', name: 'A1', parent: ['a1']},
                                                {id: 'd22', name: 'A1', parent: ['a1']},
                                                {id: 'e22', name: 'A1', parent: ['b1']},
                                                {id: 'h22', name: 'A1', parent: ['b1']},
                                                {id: 'i22', name: 'A1', parent: ['c1']},
                                                {id: 'l22', name: 'A1', parent: ['c1']},
                                                {id: 'm22', name: 'A1', parent: ['d1']},
                                                {id: 'o22', name: 'A1', parent: ['d1']},
                                                {id: 'p22', name: 'A1', parent: ['e1']},
                                                {id: 'r22', name: 'A1', parent: ['e1']}

                                            ]
                                        ]

                                    });

                this.munex.addGroupData({
                    name : 'Group B',
                    nodes: [
                        [],
                        [],
                        []
                    ]
                });



                this.munex.init(selectors);

                var gui = new dat.GUI();


                var radiusController = gui.add(this.munex, 'radius', 10, 220);
                var layerGapController = gui.add(this.munex, 'layerGap', 5, 100);
                var nodeRadiusController = gui.add(this.munex, 'nodeRadius', 1, 20);
                var rotationOffsetController = gui.add(this.munex, 'rotationOffset', 1, 360);
                var edgeWidthController = gui.add(this.munex, 'edgeWidth', 1, 10);
                var edgeColorController = gui.addColor(this.munex, 'edgeColor');
                var groupCircleColorController = gui.addColor(this.munex, 'groupCircleColor');

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
                groupCircleColorController.onChange(function() {
                    self.munex.redrawExistingData();
                });


            }
        }

    }
);