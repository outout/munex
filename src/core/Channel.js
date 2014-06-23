define(['underscore', 'backbone'], function (_, Backbone) {
    'use strict';

    /**
     *
     * @type {Backbone.Events}
     */
    var channel = _.extend({}, Backbone.Events);


    return channel;
});