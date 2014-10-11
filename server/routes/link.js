/**
 * Created by pipas on 1.10.14..
 */
var express = require ('express');
var http = require('http');
var url = require('url');
var request = require('request');

//http://rest.kegg.jp/link/<target_db>/<source_db>[/<option>]
//http://rest.kegg.jp/link/pathway/hsa:10458/

module.exports = function () {
    "use strict";

    var router = express.Router();



    // GET '/current
    // exmple: curl -X GET http://localhost:3000/link/target_db/db_entries
    router.get('/:target_db/:db_entries', function (req, res) {
        var kegg_url = ["http://rest.kegg.jp/link/", req.params.target_db, req.params.db_entries];
        kegg_url = kegg_url.join('/');

        req.pipe(request(kegg_url, function ( err, res, bod) {
//                console.log(err);
//                console.log(res);
//                console.log(bod);

            }
        )).on('response', function(response) {
            var targets = [];
            var body = '';
            response.on('data', function (chunk) {
                body += chunk;
            });

            response.on('end', function () {
                var arr = body.split('\n');
                for (var i = 0; i < arr.length - 1; i++) {
                    targets.push(arr[i].split('\t')[1])
                }
                res.json(200, {entries: req.params.db_entries, targets: targets});
            })
        });
    });

    return router;
};