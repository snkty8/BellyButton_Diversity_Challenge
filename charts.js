//http://localhost:8000/
// python -m http.server   

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}



// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArraySamples = samples.filter(sampleObj => sampleObj.id == sample);
    
    //  5. Create a variable that holds the first sample in the array.
    var resultSamples = resultArraySamples[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = resultSamples.otu_ids;
    var otu_labels = resultSamples.otu_labels;
    var sample_values = resultSamples.sample_values;

    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var wfreq = result.wfreq;
    // console.log(wfreq)
  

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0, 10).map(otu => `OTU ${otu}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"

    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: 'Top 10 Bacteria Cultures Found in Samples'
    
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout); 
  


  //Bubbles
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids
      }
    }];
    var bubbleLayout = {
      title: "Bacteria Cultures per sample",
      hovermode: "closest"
    }
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);  

    // Gauge
    var gaugeData = [ {
      domain: {x: [0, 1], y: [1, 0]},
      value: wfreq,
      title: {text: `Belly Button Washing Frequency: Scrubs per Week`},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10]},
        bar: { color: "black" },
        steps: [
        {range: [0, 1], color: "red"},
        {range: [1, 2], color: "red"},
        {range: [2, 3], color: "orange"},
        {range: [3, 4], color: "orange"},
        {range: [4, 5], color: "yellow"},
        {range: [5, 6], color: "yellow"},
        {range: [6, 7], color: "yellowgreen"},
        {range: [7, 8], color: "yellowgreen"},
        {range: [8, 9], color: "green"},
        {range: [9, 10], color: "green"},
      ]
    }
    }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 700,
      height: 600,
      margin: {t: 20, b: 40, l: 100, r: 100}
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  }  
  )};


