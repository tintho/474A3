// Tin Ho
// INFO 474 Assignment 3

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1400 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

// setup x 
var xValue = function(d) { return d.Year;}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d.Global_Sales;}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
// var d3_category31 = 
// [0x2F329F, 0xaec7e8,
//   0xff7f0e, 0xffbb78,
//   0x2ca02c, 0x98df8a,
//   0xd62728, 0xff9896,
//   0x9467bd, 0xc5b0d5,
//   0x8c564b, 0xc49c94,
//   0xe377c2, 0xf7b6d2,
//   0x7f7f7f, 0xc7c7c7,
//   0xbcbd22, 0xdbdb8d,
//   0x17becf, 0x9edae5, 0xc5b0d5,
//   0x8c564b, 0xc49c94,
//   0xe377c2, 0xf7b6d2,
//   0x7f7f7f, 0xc7c7c7,
//   0xbcbd22, 0xdbdb8d,
//   0x17becf, 0x9edae5];
var cValue = function(d) { return d.Platform;},
    color = d3.scale.category20();

console.log("color "+ color);


var csvdata;
// var zoom = d3.behavior.zoom()
//     .x(xScale)
//     .y(yScale)
//     .scaleExtent([1, 10])
//     .on("zoom", zoomed);

// add the graph canvas to the body of the webpage
var svg = d3.select(document.getElementById("scatter")).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //.call(zoom);

svg.append("rect")
    .attr("width", width)
    .attr("height", height);

// add the tooltip area to the webpage
var tooltip = d3.select("#tool").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// function zoomed() {
//   svg.select(".x.axis").call(xAxis);
//   svg.select(".y.axis").call(yAxis);
//   console.log(xScale);
// }

var patt = new RegExp("all");
var patt2 = new RegExp("Global_Sales");
var dataset;
var dataset1;

var dropDown = d3.select("#filter")

// load data
d3.csv("vgsales2.csv", function(error, data) {
  if(error) return console.warn(error);

  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.Year = +d.Year;
    d.Global_Sales = +d.Global_Sales;
  });

  dataset = data;
  dataset1 = data;
  csvdata = data;
  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Year");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Global Sales (Millions of Units)");

  drawVis(dataset);

  function filterType(mtype) {
    console.log("HELLO " + mtype);
    var res = patt.test(mtype);
    if(res){
      drawVis(dataset);
    }else{
      var ndata = dataset.filter(function(d) {
        return d.Platform === mtype;
      });
    drawVis(ndata);
    }
  }

  function filterType2(mtype) {
    console.log("HELLO " + mtype);
    var res = patt.test(mtype);
    if(res){
      drawVisSquares(dataset1);
    }else{
      var ndata = dataset1.filter(function(d) {
        return d.Platform === mtype;
      });
    drawVisSquares(ndata);
    }
  }

  function drawVisSquares(da) {
    // draw dots
    var triangle = svg.selectAll("ellipse").data(da);
    triangle.exit().remove();
    triangle.enter().append("ellipse")
      .attr("class", "ellipse")
      .attr("rx", 5)
      .attr("ry", 5)

      .on("mouseover", function(d) {
          d3.select(this).attr("rx", 10);
          d3.select(this).attr("ry", 10);
          tooltip.transition()
               .duration(200)
               .ease("elastic")
               .style("opacity", .9);
          tooltip.html(d.Name +" (" + xValue(d) +  ") - " +d.Platform+ "<br/>Global Sales (Millions): " + yValue(d))
               .style("left", (d3.event.pageX + 700) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
               // .style("font-size",300%);
      })
      .on("mouseout", function(d) {
          d3.select(this).attr("rx", 5);
          d3.select(this).attr("ry", 5);
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });
    triangle.attr("cx", xMap)
      .attr("cy", yMap)
      .attr("id", function(d) { return d.Name })
      .style("fill", function(d) { return color(cValue(d));}) 
  }

  function drawVis(da) {
    // draw dots
    var circle = svg.selectAll("circle").data(da);
    circle.exit().remove();
    circle.enter().append("circle")
      .attr("class", "circles")
      .attr("r", 5)
      
      .on("mouseover", function(d) {
          d3.select(this).attr("r", 10);
          tooltip.transition()
               .duration(200)
               .ease("elastic")
               .style("opacity", .9);
          tooltip.html(d.Name +" (" + xValue(d) +  ") - " +d.Platform+ "<br/>Global Sales (Millions): " + yValue(d))
               .style("left", (d3.event.pageX + 700) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
               // .style("font-size",300%);
      })
      .on("mouseout", function(d) {
          d3.select(this).attr("r", 5);
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });
    circle.attr("cx", xMap)
      .attr("cy", yMap)
      .attr("id", function(d) { return d.Name })
      .style("fill", function(d) { return color(cValue(d));}) 
  }

  //add this event listener to the first menu (as a whole):
  // d3.select("#myselectform").on("change", onChange);
  document.getElementById('myselectform').onchange = function() {
    filterType(this.value);
    filterView2();
  }

  document.getElementById('myselectform1').onchange = function() {
    filterType2(this.value);
    filterView2();
  }
  // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
});

var svg2 = d3.select(document.getElementById("bar")).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top)+ ")");

console.log(svg2);
var x = d3.scale.ordinal().rangeRoundBands([0, width], .2);
var y = d3.scale.linear().range([height, 0]);
var yAxis2 = d3.svg.axis().scale(y).orient("left");
var xAxis2 = d3.svg.axis().scale(x).orient("bottom");

// var xAxis2 = d3.svg2.axis()
//   .scale(x)
//   .orient("bottom");
//   // .tickFormat(d3.time.format("%Y-%m"));

// var yAxis2 = d3.svg2.axis()
//   .scale(y)
//   .orient("left")
//   .ticks(10);

function filterView2() {
	selection = document.getElementById("dropdown");
          var c1 = document.getElementById("myselectform");
          var c2 = document.getElementById("myselectform1");
          console.log(c1.value);
          console.log(c2.value);
          var datac1c2;
          if(c1.value == "all" || c2.value == "all") {
          	datac1c2 = csvdata;
          } else {
	          datac1c2 = csvdata.filter(function (row) {
	          	return row.Platform== c1.value || row.Platform == c2.value;
	          });
	      }
          console.log(datac1c2);
          console.log(selection.value);
          var data2 = d3.nest()
          .key(function(d) { return d.Year})
          .rollup(function(d) {
            return d3.sum(d, function(g) { return g[selection.value]})
          }).entries(datac1c2);

    svg2.selectAll("rect")
        .data(data2).exit().remove();
    svg2.selectAll("rect")
        .data(data2)
      .enter().append("rect")
        .style("fill", "steelblue")
        .attr("x", function(d) {  return x(d.key); })
        .attr("width", x.rangeBand())//x.rangeBand()
        .attr("id", "bar")
        .on("mouseover", function(d) {
            tooltip.transition()
                 .duration(200)
                 .style("opacity", .9);
            tooltip.html("Year: " + d.key +  "<br/>" + "Sales (Millions of Units): " + (d.values))
                 .style("left", (d3.event.pageX + 700) + "px")
                 .style("top", (d3.event.pageY - 28) + "px")
                 .attr("padding-left", "50px");// .style("font-size",300%);
            d3.select(this).style("fill", "orange");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
            d3.select(this).style("fill", "steelblue");
        });
    svg2.selectAll("rect")
        .data(data2)
        .attr("y", function(d) { return height-d.values; })
        .attr("x", function(d) {  return x(d.key); })
        .attr("height", function(d) { console.log("dvalue " +d.values); return (d.values); });
}

d3.csv("vgsales2.csv", function (error, csv_data) {
  var csvdata = csv_data;
  var data2 = d3.nest()
    .key(function(d) { return d.Year})
    .rollup(function(d) {
      return d3.sum(d, function(g) { return g.Global_Sales})
    }).entries(csvdata);

  data2.forEach(function(d) {
    d.Year = +d.Year;
  });

  x.domain(data2.map(function(d) { return d.key; }));
  y.domain([0, d3.max(data2, function(d) { return d.values; })]);

  var selection = 'Global_Sales';

  // filters data based on region selection
  var selector = d3.select("#myselectform2")
      .attr("id","dropdown")
      .on("change", function(d){
          selection = document.getElementById("dropdown");
          var c1 = document.getElementById("myselectform");
          var c2 = document.getElementById("myselectform1");
          console.log(c1.value);
          console.log(c2.value);
          var datac1c2;
          if(c1.value == "all" || c2.value == "all") {
          	datac1c2 = csvdata;
          } else {
	          datac1c2 = csvdata.filter(function (row) {
	          	return row.Platform== c1.value || row.Platform == c2.value;
	          });
	      }
          console.log(datac1c2);
          console.log(selection.value);
          data2 = d3.nest()
          .key(function(d) { return d.Year})
          .rollup(function(d) {
            return d3.sum(d, function(g) { return g[selection.value]})
          }).entries(datac1c2);
          drawvis2(data2);
      });

  // draw x axis
  svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(30," + 720 + ")")
      .call(xAxis2)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em");
      // .attr("transform", "rotate(-90)" );

  // draw y axis
  svg2.append("g")
      .attr("class", "y axis")
      .call(yAxis2)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Sales (Millions of Units)");

  drawvis2(data2);

  //draw bars for second visualization
  function drawvis2(da2) {
    svg2.selectAll("rect")
        .data(da2).exit().remove();
    svg2.selectAll("rect")
        .data(da2)
      .enter().append("rect")
        .style("fill", "steelblue")
        .attr("x", function(d) {  return x(d.key); })
        .attr("width", x.rangeBand())//x.rangeBand()
        .attr("id", "bar")
        .on("mouseover", function(d) {
            tooltip.transition()
                 .duration(200)
                 .style("opacity", .9);
            tooltip.html("Year: " + d.key +  "<br/>" + "Sales (Millions of Units): " + (d.values.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]))
                 .style("left", (d3.event.pageX + 700) + "px")
                 .style("top", (d3.event.pageY - 28) + "px")
                 .attr("padding-left", "50px");// .style("font-size",300%);
            d3.select(this).style("fill", "orange");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
            d3.select(this).style("fill", "steelblue");
        });
    svg2.selectAll("rect")
        .data(da2)
        .attr("y", function(d) { return height-d.values; })
        .attr("x", function(d) {  return x(d.key); })
        .attr("height", function(d) { console.log("dvalue " +d.values); return (d.values); });
  }
  console.log(data2)
});

