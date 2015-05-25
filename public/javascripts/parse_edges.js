/*
 * split_csv is the input file split by newlines. It is generated in
 * parse_setup.js.
 * elem is the element to which the JSON object will be sent. It's just a 
 * <p> element right now, but should eventually work with NeDB/Mongo.
 * 
 * This function is designed to be called after parse_setup.js has been run.
 * 
 */
function parse_edges(split_csv, elem)
{
    // Current JSON output. This is the format:
    // {
    //   "id_number_1"  : { "Date" : date, "Ship" : ship, "Other" : other },
    //   ...
    // };
    var json_out = '{ ';

    // Size of file: 3858
    for (var i = 1; i < split_csv.length - 1; i++) 
    {
        // Split the string by comma
        var line = split_csv[i].split(',');

        // First cell in the line is the Source
        var source = line[0];

        // Second cell is the Target
        var target = line[1];

        // Third is the Type, but it's Undirected in all cells, so I ignored it

        // Fourth is the label, and it doesn't follow the rules (like most cells
        // in parse_nodes.js), so I'm gonna get the last elements first.
        
        // The last cell is Died on Expedition, a single char (N|V)
        var died = line[line.length - 1];

        // Second-last cell is the Weight. It's always 1.0, so I'm ignoring it.

        // To get the Label, just get the whole line from [3, line.length - 3]
        // (Length - 3 because -1 is the last element in the array and we don't
        // need the last 2.) Also sanitize the data in case any unwanted chars
        // are included.
        var label = "";
        for (var l = 3; l < line.length - 3; l++)
            label += line[l].replace(/['"]/g, "");

        json_out += '"' + i + '" : { "source" : "' + source + '", ' +
            '"target" : "' + target + '", "label" : "' + label +
            '", "died" : "' + died + '" }, ';
    };

    // Get rid of the trailing comma so the JSON compiles correctly.
    json_out = json_out.slice(0, json_out.length - 2) + ' ';
    // and append the final curly brace to close the JSON object
    json_out += '}';

    // Replace this with whatever you need once we know how the data is being
    // sent to the server. Right now it's just being placed into a DOM element.
    elem.innerHTML = JSON.parse(json_out);
    localStorage.setItem('tempEdges', json_out);

    // Uncomment this line to have the entire JSON string printed to
    // the specefied element elem. I wouldn't recommend this if you're
    // parsing the entire file: your browser will most likely crash.
    //elem.innerHTML = json_out;
};

/*
 * NOTES
 *
 * Every line in the csv has Type Undirected, so I'm ignoring it

 Src, Tgt, Type, ID, Label, Weight, Died on Expedition
 0    1    2     3   4      5       6

 len(line) == 7
 Died on Expedition == line[-1] == line[len(line) - 1]
 Weight == line[-2] == line[len(line) - 2]
 Label == line[4] would probably be the only troublesome one

 */
