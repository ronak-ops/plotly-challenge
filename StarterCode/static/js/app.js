// Step 1: Plotly
// Use the D3 library to read in samples.json.
// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.


// Creating a function for 'sample' which will be called in my filter and later with the dropdown
function charts(sample) {
  // Using D3 to read in the samples.json file which are arrays or arrays #rays-on-rays
  d3.json("samples.json").then((data) => {
    // Importing the "sample" array because it contains id, otu_ids, samples_values and otu_labels.
    var samples = data.samples;
    // Filtering and sort the id array so I can grab the first array.
    var id_Array = samples.filter(sampleObj => sampleObj.id == sample);
    // Using [0] index to grab the first array
    var first_array = id_Array[0];

    // These are my first_array filtered otu_ids, otu_labels and sample_values arrays
    // Use otu_ids as the labels for the bar chart.
    var otu_ids = first_array.otu_ids;
    // Use otu_labels as the hovertext for the chart.
    var otu_labels = first_array.otu_labels;
    // Use sample_values as the values for the bar chart.
    var sample_values = first_array.sample_values;

    // Building my h-bar chart
    // Using reverse() because of plotly default settings.
    // Method chained slice (Top 10), map and reverse to keep my code clean
    var yticks = otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();
    var h_bar = [
      {
        // y: is the otu_ids data for the labels for the bar chart
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    var h_bar_layout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", h_bar, h_bar_layout);

    // Create a bubble chart that displays each sample.
    // Use otu_ids for the x values.
    // Use sample_values for the y values.
    // Use sample_values for the marker size.
    // Use otu_ids for the marker colors.
    // Use otu_labels for the text values.

    // Creating a Bubble Chart. Pretty much edit/copy/paste
    var bub = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    var bub_layout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };

    Plotly.newPlot("bubble", bub, bub_layout);
  });
}

// Creating a funciton to use for Demographic info Panel
function demoInfo(sample) {

  // Using D3 to read in the samples.json file and filter for the 'metadata' array
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // Filtering and sort the id array so I can grab the first array.
    var meta_Array = metadata.filter(sampleObj => sampleObj.id == sample);

    // Using [0] index to grab the first array
    var first_meta_Array = meta_Array[0];

    // Using d3 to reference the panel element ("#sample-metadata") of the index.html
    var PANEL = d3.select("#sample-metadata");

    // clearing existing metadata with empty string
    PANEL.html("");

    // Using object.entries to add key and value pair to append to demo info table using 'h6'
    Object.entries(first_meta_Array).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Creating a function to initialize the dashboard and dropdown menu
function init() {

  // Using d3 to reference to the dropdown element ("#selDataset") of the index.html
  var dropdown = d3.select("#selDataset");

  // Using D3 to read in the samples.json file and filter for the 'names' array
  // names will be used to populate the dropdown menu and selections
  d3.json("samples.json").then((data) => {
    var names = data.names;

    // Using foreach() to use the sample values of the names to create dropdown menu
    names.forEach((sample) => {
      dropdown
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // start_sample will be used to initialize the plots
    // again using [0] index to grab the first array
    var start_sample = names[0];

    // calling the chart and demo_info functions to use the start_sample data to initialize
    charts(start_sample);
    demoInfo(start_sample);
  });
}

// Creating a function "optionChanged" that is will be called by index.html
// This function will update all the plots any time a new sample is selected.
function optionChanged(new_sample) {
  // Fetch new data each time a new sample is selected
  charts(new_sample);
  demoInfo(new_sample);
}

// Initialize the dashboard
init();