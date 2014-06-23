define(['jquery',  'underscore', 'gfx/CanvasLib', 'core/Channel'],


    /**
     *
     * @param {jquery} $
     * @param {underscore} _
     * @param {CanvasLib} CanvasLib
     * @param {Backbone.Events} Channel
     * @returns {Munex}
     */
    function($, _,  CanvasLib, Channel) {


    Munex = function() {

        this.GROUPS = {};
        this.LAYERS = {};


        this.init = function(selectorName){

            this.canvasElement = $('#' + selectorName);
            this.engine = new CanvasLib(this.canvasElement);

            this.channel = Channel;

            this.registerApiEvents();

        };



        this.registerApiEvents = function() {

            this.channel.on('Munex.addLayer', function(data){});
            this.channel.on('Munex.addGroup', function(data){});
            this.channel.on('Munex.redraw', function(data){});

        };

    };

    return Munex;


});