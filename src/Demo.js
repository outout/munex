define(['Munex'], function(Munex){

    return {

        init: function(selectorName) {

            this.munex = new Munex();
            this.munex.init(selectorName);

        }

    }

});