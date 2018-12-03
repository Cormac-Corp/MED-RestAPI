var mysql = require("mysql");
function REST_ROUTER(router,connection) {
    var self = this;
    self.handleRoutes(router,connection);
}

/*We want to send as a JSON object and not a string because the other applications may want to modify it in a way.*/
REST_ROUTER.prototype.handleRoutes = function(router,connection) {
    router.get("/",function(req,res){
        res.json({"Message" : "Connected!"});
    });

    

    router.get("/med/:medrecid", function(req, res){
        connection.query("SELECT * FROM med_ex_providers WHERE medrecid = \"" + req.params.medrecid + '\";', function(err,rows){
            if(err){
                res.json({"Error" : true, "Message" : "MySQL query error."});
                console.log(err.stack);
            } else {
                res.json({"Error" : false, "Message" : "Success", "Data" : rows});
            }
        });
    });

    router.get("/med/:column_name/:element",function(req,res){
        connection.query("SELECT * FROM med_ex_providers WHERE " + req.params.column_name + " = \"" + req.params.element + '";', function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "MySQL query error."});
                console.log(err.stack);
            } else {
                res.json({"Error" : false, "Message" : "Success", "Data" : rows});
            }
        });
    });

    router.get("/med/:column_name/:element/:column_name2",function(req,res){
        connection.query("SELECT " + req.params.column_name2 + " FROM med_ex_providers WHERE " + req.params.column_name + " = \"" + req.params.element + '";', function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "MySQL query error."});
                console.log(err.stack);
            } else {
                res.json({"Error" : false, "Message" : "Success", "Data" : rows});
            }
        });
    });
}

module.exports = REST_ROUTER;