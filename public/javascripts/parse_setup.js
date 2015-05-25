// If these APIs don't exist in the version of HTML being used, 
// let the user know that the application won't work without them.
if (!window.File || !window.FileReader || !window.FileList || !window.Blob)
{
    console.log('Checking for HTML5 support...');
    alert('Please use HTML5. This application will not work without it.');
    document.body.innerHTML = 
        "<p>Please use HTML5. This application will not work without it.</p>";
}

// wait until the page fully loads before running this code so all the needed
// DOM objects exist
window.onload = function () 
{
    var input_file = document.getElementById('input_file');
    var display_area = document.getElementById('putDispenserHere');

    // When a file is uploaded using the input_file button, run this
    // inline function
    input_file.addEventListener('change', function (e) 
    {
        // Get the file the user uploaded
        var file = input_file.files[0];

        // Make a new FileReader instance to handle file parsing
        var fr = new FileReader();

        fr.onload = function (e)
        {
            /*
             * Decide whether the input file was a set of nodes or edges
             * based on the number of elements in the .csv.
             * (nodes have 2 fields, edges have 7.)
             */
            var csv = fr.result.split('\n');

            if (csv[0].split(',').length == 2)
            {
                parse_nodes(csv, display_area);
            }
            else 
            {
                parse_edges(csv, display_area);
            }
        };

        fr.readAsText(file);
    });
};
