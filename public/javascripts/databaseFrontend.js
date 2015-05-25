
/**
 * Instantiates a database in local (client) memory
 * The returned object has two properties, nodes and edges.
 * Each of these is a fully functional database
 * 
 * We are using NeDB. It's lighter weight than Mongo and can be run locally
 * and even supports data persistence.
 * My hope is that this will drastically reduce the amount of server-client 
 * communication. It stores data in a balanced BTree to make lookups faster
 * */
function createDatabase(){
    var db = {};
    db.nodes = new Nedb({filename:'nodes', autoload:true});
    db.nodes.ensureIndex({fieldName:'Id'});
    db.edges = new Nedb({filename:'edges', autoload:true});
    db.edges.ensureIndex({fieldName:'Id'});
    return db;
    
}
/**
 * Used to quickly insert an array of objects into our databases with some type
 * checking to make sure things go where they are supposed to. 
 * DB IS OUR {NODE, EDGE} OBJECT!!!!
 * ENTRIES MUST SPECIFY THE TYPE OF OBJECTS INSERTED!!!!
 * */
function batchInsertion(entries, db){
    if (entries.type == 'node'){
        var keys = Object.keys(entries.collection);
        for(var i = 0; i <keys.length ; i++){
            var node =createNode(entries.collection[keys[i]], keys[i] );
            insertInto(node, db);
            //console.log(keys[i]);
            if ( i % 500 == 0){
                db.nodes.persistence.compactDatafile();
            }
        }
        console.log('node insertion complete');
    }
    else if (entries.type == 'edge'){
            var keys = Object.keys(entries.collection);
        for(var i = 0; i <keys.length ; i++){
            var edge =createEdge(entries.collection[keys[i]], keys[i] );
            insertInto(edge, db);
            //console.log(keys[i]);
            if ( i % 200 == 0){
                db.edges.persistence.compactDatafile();
            }
        }
        console.log("edge insertion complete");
    }
    else{
        console.log("attempt made to insert entry of unspecified type. Ignoring...");
    }
    
}
/**
 * Inserts an object into our database
 * */
function insertInto(entry, db){
    if (entry.type =='node'){
        db.nodes.insert(entry)
    }
    else if (entry.type == 'edge'){
        db.edges.insert(entry)
    }
    else{
        console.log("attempt made to insert entry of unspecified type. Ignoring...");
    }
}

function createNode(data, i){
    var result = {type:'node', Id:i};
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++){
        result[keys] = data[keys[i]];
    }
    return result;
    
}

function createEdge(data){
    var result = {type:'edge', Id:i};
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++){
        result[keys] = data[keys[i]];
    }
    return result;
}

/**
 * docs will contain all nodes that satisfy query. 
 * Examples of query structure and function can be found here: https://github.com/louischatriot/nedb
 * */
function findNodes(query, db, callback){
    db.nodes.find(query, function(err, docs){
        if (err){
            console.log(err);
        }
        else{
            callback(docs);
        }
    });
}

/**
 * docs will contain all edges that satisfy query. 
 * Examples of query structure and function can be found here: https://github.com/louischatriot/nedb
 * */
function findEdges(query, db, callback){
    db.edges.find(query, function(err, docs){
        if (err){
            console.log(err);
        }
        else{
            callback(docs);
        }
    });
}
/**
 * Returns a JSON encoded array of JSON objects. To access objects individually
 * use something similar to 
 * var arrayOfJSON = JSON.parse(result);
 * for (var i=0; i < arrayOfJSON.length; i++){
     var obj = JSON.parse(arrayOfJSON[i]);
     //obj has properties of a node
 }
 * */
function nodeExport(){
    var temp = localStorage.getItem('nodes');
    //temp.replace('}','}}';)
    var result = temp.split(/{*}/);
    for (var i = 0; i < result.length; i++){
        result[i] = result[i]+"}";
    }
    result = JSON.stringify(result);
    return result;
}
function edgeExport(){
    var temp = localStorage.getItem('edges');
    //temp.replace('}','}}');
    var result = temp.split(/{*}/);
    for (var i = 0; i < result.length; i++){
        result[i] = result[i]+"}";
    }
    result = JSON.stringify(result);
    return result;
}

function year_range_search(from, to, db, callback) 
{
    var query = { $and: [
                {year:{ $gte : from+"" }},
                {year:{ $lte : to+"" }}
              ]
            };
    query = {"year":{$gt:1000+""}};
    db.nodes.find(query, function(err, docs){
        if (err){
            console.log(err);
        }
        else{
            callback(docs);
        }
    });
};