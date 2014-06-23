requirejs.config({
    baseUrl: 'src',
    paths  : {
        jquery    : '../lib/jq.min',
        backbone  : '../lib/backbone.min',
        underscore: '../lib/underscore.min'
    },


    underscore: {
        exports: '_'
    },

    backbone  : {
        deps   : ['jquery', 'underscore'],
        exports: 'Backbone'
    }

});