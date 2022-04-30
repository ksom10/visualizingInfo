
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = window.innerWidth/2 - margin.left - margin.right,
    height = window.innerHeight/1.5 - margin.top - margin.bottom;

var svg = d3.select("#dataSet")
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
            .text("Platforms"); 

var yLabel = svg.append("text")
            .attr("transform", `translate(${-margin.left/2},${height/2}) rotate(-90)`)
            .attr("fill","black")
            .attr("stroke","black")
            .text("Global Sales"); 




function update() {


  d3.csv("./data/vgsales.csv", function(d){
    return {platform:d.Platform, sales:+d.Global_Sales}
  }, function(data) {

    var all_platforms = [... new Set(data.map(x => x.platform))]; 
    var all_obj = []; 
    

    all_platforms.forEach(platform => {
            var totalSales = data.filter(d => d.platform == platform).map(x => x.sales).reduce((a,b) => a+b); 
            all_obj.push({"platform_name":platform, "sales":totalSales}); 
    }); 


    
    x.domain(all_platforms)
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
        .attr("x", function(d) { return x(d.platform_name); })
        .attr("y", function(d) { return y(d.sales); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.sales); })
        .attr("fill", "#d389fb")
    
  })

}


update();
