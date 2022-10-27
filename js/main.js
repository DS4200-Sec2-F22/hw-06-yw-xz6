const FRAME_HEIGHT = 450;
const FRAME_WIDTH = 450; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.left - MARGINS.right;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.top - MARGINS.bottom; 

const LEFT = d3.select("#left") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

const MIDDLE = d3.select("#middle") 
                    .append("svg") 
                        .attr("height", FRAME_HEIGHT)   
                        .attr("width", FRAME_WIDTH)
                        .attr("class", "frame"); 

const RIGHT = d3.select("#right") 
                    .append("svg") 
                        .attr("height", FRAME_HEIGHT)   
                        .attr("width", FRAME_WIDTH)
                        .attr("class", "frame"); 



// Next, open file 
d3.csv("data/iris.csv").then((data) => { 
    // find max X
    const MAX_X_LEFT = d3.max(data, (d) => { return parseInt(d.Sepal_Length); });

    // find max Y
    const MAX_Y_LEFT = d3.max(data, (d) => { return parseInt(d.Petal_Length); });

    // Define scale functions that maps our data values 
    // (domain) to pixel values (range)
    const X_SCALE_LEFT = d3.scaleLinear() 
            .domain([0, MAX_X_LEFT + 1]) // add some padding  
            .range([0, VIS_WIDTH]); 

    const Y_SCALE_LEFT = d3.scaleLinear() 
            .domain([0, MAX_Y_LEFT + 1]) // add some padding  
            .range([VIS_HEIGHT, 0]);
    // add our circles with styling 
    left = LEFT.selectAll("circle") 
            .data(data) // this is passed from  .then()
            .enter()  
            .append("circle")
            .attr("cx", (d) => { return (X_SCALE_LEFT(d.Sepal_Length) + MARGINS.left); }) // use x for cx
            .attr("cy", (d) => { return (Y_SCALE_LEFT(d.Petal_Length) + MARGINS.top); }) // use y for cy
            .attr("r", 3)  // set r 
            .attr("class", (d) => { return d.Species }); // fill by color
    
    LEFT.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
            "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE_LEFT).ticks(6)) 
            .attr("font-size", '20px'); 

    // Add an y-axis to the vis  
    LEFT.append('g')  // g is a general SVG
        .attr('transform', "translate(" + MARGINS.left +
            "," + (MARGINS.bottom) +")") 
        .call(d3.axisLeft(Y_SCALE_LEFT).ticks(10))
            .attr('font-size', '20px');


    // find max X
    const MAX_X_MID = d3.max(data, (d) => { return parseInt(d.Sepal_Width); });

    // find max Y
    const MAX_Y_MID = d3.max(data, (d) => { return parseInt(d.Petal_Width); });

    // Define scale functions that maps our data values 
    // (domain) to pixel values (range)
    const X_SCALE_MID = d3.scaleLinear() 
            .domain([0, MAX_X_MID + 1]) // add some padding  
            .range([0, VIS_WIDTH]); 

    const Y_SCALE_MID = d3.scaleLinear() 
            .domain([0, MAX_Y_MID + 1]) // add some padding  
            .range([VIS_HEIGHT, 0]);
    // add our circles with styling 
    mid = MIDDLE.selectAll("circle") 
            .data(data) // this is passed from  .then()
            .enter()  
            .append("circle")
            .attr("cx", (d) => { return (X_SCALE_MID(d.Sepal_Width) + MARGINS.left); }) // use x for cx
            .attr("cy", (d) => { return (Y_SCALE_MID(d.Petal_Width) + MARGINS.top); }) // use y for cy
            .attr("r", 3)  // set r 
            .attr("class", (d) => { return d.Species }); // fill by color
    
    MIDDLE.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
            "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE_MID).ticks(6)) 
            .attr("font-size", '20px'); 

    // Add an y-axis to the vis  
    MIDDLE.append('g')  // g is a general SVG
        .attr('transform', "translate(" + MARGINS.left +
            "," + (MARGINS.bottom) +")") 
        .call(d3.axisLeft(Y_SCALE_MID).ticks(10))
            .attr('font-size', '20px');

    

const BAR_DATA = [{Species: "virginica", Count:50}, {Species: "versicolor", Count:50}, {Species: "setosa", Count:50}];

// x-axis scaling
const X_SCALE_RIGHT = d3.scaleBand()
					.domain(d3.range(BAR_DATA.length))
					.range([0, VIS_WIDTH])
					.padding(0.2);

// y-axis scaling
const Y_SCALE_RIGHT = d3.scaleLinear()
							.domain([0, 60])
							.range([VIS_HEIGHT, 0]);

// add x-axis
RIGHT.append("g")
		.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
		.call(d3.axisBottom(X_SCALE_RIGHT).tickFormat((i) => {return BAR_DATA[i].Species}))
			.attr("font-size", "20px");

// add y-axis
RIGHT.append("g")
		.attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
		.call(d3.axisLeft(Y_SCALE_RIGHT).ticks(8))
			.attr("font-size", "15px");

// create bars for each species 
bars = RIGHT.selectAll("bars")
				.data(BAR_DATA)
				.enter()
				.append("rect")
					.attr("x", (d,i) => {return MARGINS.left + X_SCALE_RIGHT(i)})
					.attr("y", (d) => {return MARGINS.top + Y_SCALE_RIGHT(d.Count)})
					.attr("width", X_SCALE_RIGHT.bandwidth())
					.attr("height", (d) => {return VIS_HEIGHT - Y_SCALE_RIGHT(d.Count)})
					.attr("class", (d) => {return d.Species});

MIDDLE.call(d3.brush()
						.extent([[MARGINS.left,MARGINS.top], [FRAME_WIDTH,(FRAME_HEIGHT - MARGINS.bottom)]])
						.on("brush end", highlight_charts));


//function to highlight points/bars when brushed in middle plot
function highlight_charts(event) {

	// coordinates of the selected region
	const selection = event.selection;

	// empty set to store selected species names
	let selectedSpecies = new Set();

	// clears highlights when brush restarts
	if (selection === null) {
		mid.classed('selected', false);
		left.classed('selected', false);
		bars.classed("selected", false);
	} 
	// gives the border/opacity for all plots
	else {
		// selected class for middle plot, also adds class to set for bar plots
		mid.classed("selected", (d) => {
		isSelected = isBrushed(selection, (MARGINS.left + X_SCALE_MID(d.Sepal_Width)), (MARGINS.top + Y_SCALE_MID(d.Petal_Width)));
		if (isSelected) {
		    selectedSpecies.add(d.Species);
		}
	    return isSelected});

		// highlights corresponding points in the left plot
		left.classed("selected", (d) => isBrushed(selection, (MARGINS.left + X_SCALE_MID(d.Sepal_Width)), 
        (MARGINS.top + Y_SCALE_MID(d.Petal_Width))));
		    	
		// highlights bars based on class being in the selectedSpecies set
		bars.classed("selected", (d) => {return selectedSpecies.has(d.Species);})
	};
};

// returns if a point is in the brush selection
function isBrushed(brush_coords, cx, cy) {
	let x0 = brush_coords[0][0];
	let x1 = brush_coords[1][0];
	let y0 = brush_coords[0][1];
	let y1 = brush_coords[1][1];
	return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
};

});