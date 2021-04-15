d3.json("samples.json").then((importedData) => {
    
    var data = importedData;

    /* creating my drop down */
    dropDown = d3.select("#selDataset")

    var names = data[0].names
    names.forEach(item => 
    {
        dropDown.append("option").text(item)
    })


    /****** setting up the change event ******/
    dropDown.on("change", function() {

        var inputName = dropDown.property("value")

        //** filtering the data bases on the drop down selction **/
        filteredNames = data[0].samples.filter(item => item.id === inputName)
    
        /******************** Bar Chart *********************/
        top10_otu_ids = filteredNames[0].otu_ids.slice(0, 10)

        var otu_ids = []
        top10_otu_ids.forEach(item => {otu_ids.push(`OTU ${item}`)})

        top10_sample_values = filteredNames[0].sample_values.slice(0, 10)
        top10_otu_labels = filteredNames[0].otu_labels.slice(0, 10)


        var trace1 = 
        {
            type: 'bar',
            x: top10_sample_values,
            mode: "markers",
            text: top10_otu_labels,
            orientation: "h",
            y: otu_ids,
            marker: {
                color: '#b19cd9',
                line: { width: 1.5 }
            },    
        }

        var data_bar = [trace1];
          
          var layout = { 
            yaxis: {autorange:"reversed"}
          };
          
        var config = {responsive: true}

        Plotly.newPlot('bar', data_bar, layout, config );
          
        /**************** bubble chart *********************/
        bubble_otu_ids = filteredNames[0].otu_ids
        bubble_sample_values = filteredNames[0].sample_values
        bubble_otu_labels = filteredNames[0].otu_labels


        var trace1 = {
            x: bubble_otu_ids,
            y: bubble_sample_values,
                mode: 'markers',
                text: bubble_otu_labels,
                marker: {
                size: bubble_sample_values,
                color : bubble_otu_ids,
                colorscale: [[0, "#3a1482"], [1, "#b19cd9"]]
            }
        };
          
        var data_bubble = [trace1];
          
        var layout = {
            showlegend: false,
        };
        
        var config = {responsive: true}

        Plotly.newPlot('bubble', data_bubble, layout, config);



        /************* Demographic Information ***************/
        var demographic = d3.select("#sample-metadata");
        demographic.html("")
        filteredNames = data[0].metadata.filter(item => item.id === parseInt(inputName))
       
        var keys = Object.keys(filteredNames[0])
        keys.forEach(item => 
        { 
            var key = item
            var value = filteredNames[0][key] 
            
            demographic.append("p").text(`${key}: ${value}`)

        })

    })
    d3.select("#selDataset").dispatch("change")
})
