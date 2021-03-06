// set the dimensions and margins of the graph
var margin = {top: 20, right: 30, bottom: 160, left: 70},
width = 800 - margin.left - margin.right,
height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

// Get the Data
d3.csv("https://gist.githubusercontent.com/SanneKerck/4a8ce0acd1bfc115819144b9ce162b71/raw/0f4376cd775d967fd42745eaa0e27815a913431c/HistKillWeaponTarget.csv", function(data) { 
//d3.csv("HistKillWeaponTarget.csv", function(data) {    
    // List of subgroups = header of the csv files = target type here
    var subgroups = data.columns.slice(1)

    // List of groups = weapon type here = value of the first column called group -> I show them on the X axis
    var groups = d3.map(data, function(d){return(d.group)}).keys()

    //Size of the legend
    var legendRectSize = 18;                                  
    var legendSpacing = 4; 

    //Title
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .attr("font-weight", "bold")
        .style("text-decoration", "underline")  
        .text("Bar chart of the number of individuals killed by weapon type given target type");
    
    // Add X axis
    var x = d3.scaleBand()
              .domain(groups)
              .range([0, width])
              .padding([0.2])
    svg.append("g")
        //Rotate the labels of X axis
       .attr("class","axis")
       .style("font-size", "11px")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x).ticks(10))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
    
    // text label for the x axis
    svg.append("text")             
        .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 90) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .attr("font-weight", "bold")
        .text("Weapon Type");

    // Add Y axis
    var y = d3.scaleLinear()
              .domain([0, 250000])
              .range([ height, 0 ]);
    svg.append("g")
       .call(d3.axisLeft(y))
       .style("font-size", "11px");

    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .attr("font-weight", "bold")
        .text("Number of killed individuals"); 

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
                .domain(subgroups)
                .range(["#18c61a", "#9817ff", "#d31911", "#24b7f1", "#fa82ce", "#736c31", "#1263e2", "#18c199", "#ed990a", "#f2917f", "#7b637c", "#a8b311", "#a438c0", "#d00d5e", "#1e7b1d", "#05767b", "#aaa1f9", "#a5aea1", "#a75312", "#026eb8", "#94b665", "#91529e"])
                            
    //stack the data? --> stack per subgroup
    var stackedData = d3.stack()
                        .keys(subgroups)(data)
    // Show the bars
    svg.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function(d) { return color(d.key); })
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function(d) { return d; })
        .enter().append("rect")
                .attr("x", function(d) { return x(d.data.group); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width",x.bandwidth())
        // Tooltip        
        .on("mouseover", function() { tooltip.style("display", null); })
        .on("mouseout", function() { tooltip.style("display", "none"); })
        .on("mousemove", function(d) {
            console.log(d);
            tooltip.select("text").html("The exact number of killed individuals with this target type is: " + (d[1]-d[0]));
        });

    // Legend    
    var legend = svg.selectAll('.legend')                     
        .data(color.domain())                                   
        .enter()                                                
        .append('g')                                            
        .attr('class', 'legend')                                
        .attr('transform', function(d, i) {                     
            var height = legendRectSize + legendSpacing;          
            var offset =  height * color.domain().length / 100;     
            var horz = 30 * legendRectSize;                       
            var vert = i *  height - offset;                       
            return 'translate(' + horz + ',' + vert + ')';        
    });                                                     
    legend.append('rect')                                     
        .attr('width', legendRectSize)                          
        .attr('height', legendRectSize)                         
        .style('fill', color)                                   
        .style('stroke', color);                                
    legend.append('text')                                     
        .attr('x', legendRectSize + legendSpacing)              
        .attr('y', legendRectSize - legendSpacing)              
        .text(function(d) { return d; });  
    
    // Prep the tooltip bits    
    var tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");
    tooltip.append("text")
        .attr("x", 210)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("font-weight", "bold");
    });
