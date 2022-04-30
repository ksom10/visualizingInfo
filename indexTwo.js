var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = window.innerWidth/2 - margin.left - margin.right,
    height = window.innerHeight/1.5 - margin.top - margin.bottom;


var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


 
    var tool_tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-8, 0])
      .html(function(d) { return " Total Sales = " + d.sales });
    svg.call(tool_tip);
    

var x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2);
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")


var y = d3.scaleLinear()
  .range([ height, 0]);
var yAxis = svg.append("g")
  .attr("class", "myYaxis"); 

var xLabel = svg.append("text")
            .attr("x","35%")
            .attr("y", height+margin.bottom - 30)
            .attr("fill","black")
            .attr("stroke","black")
            .text("Genre"); 

var yLabel = svg.append("text")
            .attr("transform", `translate(${-margin.left/2},${height/2}) rotate(-90)`)
            .attr("fill","black")
            .attr("stroke","black")
            .text("Global Sales"); 


function update() {


  d3.csv("./data/vgsales.csv", function(d){
    return {genre:d.Genre, sales:+d.Global_Sales}
  }, function(data) {

    var all_genres = [... new Set(data.map(x => x.genre))]; 
    var all_obj = []; 
    

    all_genres.forEach(genre => {
            var totalSales = data.filter(d => d.genre == genre).map(x => x.sales).reduce((a,b) => a+b); 
            all_obj.push({"genre_name":genre, "sales":totalSales}); 
    }); 


    
    x.domain(all_genres)
    xAxis.transition().duration(1000).call(d3.axisBottom(x))

   
    y.domain([0, d3.max(all_obj, function(d) { return d.sales}) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

 
    var u = svg.selectAll("rect")
      .data(all_obj)

  
    u
      .enter()
      .append("rect")
      .on('mouseover', tool_tip.show)
      .on('mouseout', tool_tip.hide)
      .merge(u)
      .transition()
      .duration(1000)
        .attr("x", function(d) { return x(d.genre_name); })
        .attr("y", function(d) { return y(d.sales); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.sales); })
        .attr("fill", "#610593")
    
  })

}


update();