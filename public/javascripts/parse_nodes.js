/*
 * split_csv is the input file split by newlines. It is generated in
 * parse_setup.js.
 * elem is the element to which the JSON object will be sent. It's just a 
 * <p> element right now, but should eventually work with NeDB/Mongo.
 * 
 * This function is designed to be called after parse_setup.js has been run.
 * 
 */
function parse_nodes(split_csv, elem)
{
    // Current JSON output. This is the format:
    // {
    //   id_number (i) : [
    //     { "Date" : date, "Ship" : ship, "Other" : other }
    //   ],
    //   id_number_2 : [
    //   ...
    // };
    var json_out = '{ ';
    var result = [];
    for (var i = 1; i < split_csv.length - 1; i++) 
    {
        // Get all the separate cells of data
        var values = split_csv[i].split(',');

        // This will hold all of the line except the ID.
        var info = values.slice(1).join();

        // Set this line's ID number to be the current open JSON object
        // json_out += '"(ID)" : ['
        json_out += '"' + values[0] + '" : { '; // [\n

        // Matches any 4-digit numbers in parens, i.e. dates
        var date_re = /\(.*[0-9]{4}.*\)/;
        // Ship names, like (Caseblanca).
        var ship_re = /\(.*[A-Z][a-z]+.*\)/;
        // Anything in parens not caught by the previous REs
        // \b is a word boundary to help avoid Capital words
        var other_re = /\(.*\b[a-z]+.*\)/;

        // This part will always execute regardless of what's on the line...
        // All text before the parens, if either exist. This corresponds to
        // the title of a person, ship, etc.
        var parens_index = values[1].search('\\(');

        var included_info = (parens_index >= 0) ? 
                values[1].substring(0,parens_index-1) :
                values[1];
        // Escape all single- and double-quotes that she thought would be a
        // great idea to include T_T
        included_info = included_info.replace(/['"]/g,""); // "\\$&");
        
        json_out += '"info" : "' + included_info + '", ';

        /*
         * I wanted to set m to the condition in the if ()
         * header, but I removed that while debugging a stupid
         * (-related error. I guess this is fine, too, but it
         * now m isn't necessarily unique (because no
         * conditions might be matched, so m wouldn't change)
         */
        var m; // The matched section, if there is one
        if (info.match(date_re)) 
        {
            m = info.match(date_re);
            var d = m[0].search('[0-9]'); // d = date

            // json_out += "date" : "1972", 
            // Need d + 3 because dates are 4 digits and search returns 1
            json_out += '"date" : "' + m[0].substr(d, d + 3) + '", ';
        }
        if (info.match(ship_re)) 
        {
            m = info.match(ship_re);
            var s = m[0].search('\\)'); // Find an end parens, )
            /*
             *  In this data set, at least, all dates in
             *  parenthesis come after everything else in
             *  parenthesis. I'm going to exploit that to
             *  make parsing simpler. This conditional checks
             *  to see if the fifth-last character in the
             *  string, if the string is that long, is a
             *  number. If it is, it will ignore that part of
             *  the string since that would be a date and not
             *  a ship/etc. The charCodeAt stuff checks to see
             *  if the char at that index is a number. (ASCII
             *  numbers go from 48 - 57.)
             */
            if (s >= 4 && m[0][s - 4].charCodeAt() <= 57 
                && m[0][s - 4].charCodeAt() >= 48) s = s - 5;

            json_out += '"ship" : "' + m[0].substr(1, s - 1) + '", ';
        }
        if (info.match(other_re)) 
        {
            m = info.match(other_re);
            var o = m[0].search('\\)'); // o = other

            // No ending comma because nothing else can be added
            // 2 spaces because the slice below would remove the last " 
            json_out += '"other" : "' + m[0].substr(1, o - 1) + '"  ';
        }

        // Remove the last comma, since we won't have any more values here
        json_out = json_out.slice(0, json_out.length - 2) + ' ';
        // And close this element's brace
        json_out += '},'; // '} ],'
    };

    // Get rid of the trailing comma. I don't know if this is necessary.
    json_out = json_out.slice(0, json_out.length - 1);
    // and append the final curly brace to close the JSON object
    json_out += '}';

    // Replace this with whatever you need once we know how the data is being
    // sent to the server. Right now it's just being placed into a DOM element.
    //elem.innerHTML = JSON.parse(json_out);
    localStorage.setItem('tempNodes', json_out);
    // Uncomment this line to have the entire JSON string printed to
    // the specefied element elem. I wouldn't recommend this if you're
    // parsing the entire file: your browser will most likely crash.
    //elem.innerHTML = json_out;
};

/*
 * What I learned from this part of the project:
 *
 * 1. How to properly format JSON strings, and how JSON works
 * 2. Never trust the user with their own data, especially if you'll be
 *    using it in the future.
 * 3. I feel as though I'm very well acquainted with JavaScript string
 *    and regular expression methods now
 * 4. Continuously appending text to an HTML element stops being a good
 *    idea once that element starts to have a character count of 2500 or so.
 * 5. Working with smaller sets of data, e.g. 10 or 100 instead of 3148,
 *    can be very beneficial to understanding your problems.
 */
