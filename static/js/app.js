// Put our URL in a URL variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.

// Function for  bar chart plotting
function barChart(selection) {
  // Fetch the JSON data and console log it
  d3.json(url).then((data) => {
    console.log(`Data:`, data);

    let sample = data.samples;

    // Filter data where id = selection selected
    let selectSample = sample.filter((sample) => sample.id === selection);

    let firstSample = selectSample[0];

    // Trace data for the bar chart
    let trace = [
      {
        // Slice the top 10 otus
        x: firstSample.sample_values.slice(0, 10).reverse(),
        y: firstSample.otu_ids
          .slice(0, 10)
          .map((otu_id) => `OTU ${otu_id}`)
          .reverse(),
        text: firstSample.otu_labels.slice(0, 10).reverse(),
        type: "bar",
        marker: {
          color: "rgb(255, 127, 14)",
        },
        orientation: "h",
      },
    ];

    // Use Plotly to plot the bar chart
    Plotly.newPlot("bar", trace);
  });
}

// Function that builds the bubble chart
function bubbleChart(selection) {
  // Fetch the JSON data 
  d3.json(url).then((data) => {
    console.log(`Data:`, data);
    // Create an array of sample data set
    let sample1 = data.samples;

    // Filter data where id = option taken
    let selectSample1 = sample1.filter((sample) => sample.id === selection);

    let firstSample1 = selectSample1[0];

    // Trace data for the bubble chart
    let trace = [
      {
        x: firstSample1.otu_ids,
        y: firstSample1.sample_values,
        text: firstSample1.otu_labels,
        mode: "markers",
        marker: {
          size: firstSample1.sample_values,
          color: firstSample1.otu_ids,
          },
      },
    ];

    // Apply the x-axis lengend to the layout
    let layout = {
      xaxis: { title: "OTU ID" },
    };

    // Use Plotly to plot the bubble chart
    Plotly.newPlot("bubble", trace, layout);
  });
}
// demographic function "demog"
function demog(selection) {
  // Fetch the JSON data and console log it
  d3.json(url).then((data) => {
    console.log(`Data:`, data);

    let metadatalist = data.metadata;

    // Filter based on the option selected
    let metaData = metadatalist.filter((meta) => meta.id == selection);

    // Get the first index from the array
    let firstDatavalue = metaData[0];

    d3.select("#sample-metadata").html("");

    let selectMetaData = Object.entries(firstDatavalue);

    // Iterate through the selectMetaData array
    selectMetaData.forEach(([key, value]) => {
      d3.select("#sample-metadata")
        .append("h5")
        .text(`${key}: ${value}`);
    });

    // Log the entries array
    console.log(selectMetaData);
  });
}


// function to  plots all charts when we have new selection 
function plot(selection) {
  console.log(selection);
  demog(selection);
  barChart(selection);
  bubbleChart(selection);
  // gaugeChart(selection);
}
// initation function 
function init() {
  // dropdown Menu 
  let dropdownMenu = d3.select("#selDataset");
   
  // Fetch the JSON data and console log it
  d3.json(url).then(function (data) {
    
    let nameList = data.names;
    nameList.forEach((name) => {
      dropdownMenu.append("option").text(name).property("value", name);
    });

    let initialName = nameList[0];
    plot(initialName);
  });

  dropdownMenu.on("change", function () {
    let selectedName = d3.select("#selDataset").node().value;
    plot(selectedName);
  });
}


init();
