import React, { Component } from "react";
import * as d3 from "d3";

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      GDP: []
    };
  }

  componentDidMount() {
    d3.json(
      "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json",
      data => {
        var dataSet = data.data;
      }
    ).then(data => {
      this.setState({
        GDP: data.data
      });
    });
  }

  render() {
    var dataset = this.state.GDP,
      w = 900,
      h = 600,
      p = 50;

    var xScale = d3
      .scaleTime()
      .domain([new Date(d3.min(dataset, d => d[0])), new Date(d3.max(dataset, d => d[0]))])
      .range([p, w - p]);

    var yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, d => d[1])])
      .range([h - p, p]);

    var xAxis = d3
      .axisBottom(xScale)
      .ticks(15)
      .tickFormat(d3.timeFormat("%Y"));

    var yAxis = d3.axisLeft(yScale);

    var svg = d3
      .select("#barChart")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    var tooltip = d3
      .select("#barChart")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0);

    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", (d, i) => {
        return p + (i * (w - 2 * p)) / dataset.length;
      })
      .attr("y", (d, i) => {
        return yScale(d[1]);
      })
      .attr("class", "bar")
      .attr("width", 2)
      .attr("height", (d, i) => {
        return h - p - yScale(d[1]);
      })
      .attr("data-date", function(d, i) {
        return d[0];
      })
      .attr("data-gdp", function(d) {
        return d[1];
      })
      .on("mouseover", mouseOverEvent) 
      .on("mouseout", mouseOutEvent);

      function mouseOutEvent(d){
        tooltip
          .transition(400)
          .style("opacity", 0);
      }

      function mouseOverEvent(d) {
        tooltip
          .transition()
          .style("opacity", 1);
        tooltip
          .html(d[0] + "<br/>" + "$" + d[1] + " Billions")
          .style("left", d3.event.pageX - 125 + "px")
          .style("top", d3.event.pageY - 67 + "px")
          .style("display", "inline-block");
        tooltip.attr("data-date", d[0]);
      }
      
    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${h - p})`)
      .call(xAxis);
    svg
      .append("g")
      .attr("transform", "translate(" + p + ", 0)")
      .attr("id", "y-axis")
      .call(yAxis);
      
    svg
      .append("text")
      .attr("id", "title")
      .attr("class", "chart-title")
      .attr("x", 300)
      .attr("y", 50)
      .text("United States GDP");

    

    return <div id="barChart"></div>;
  }
}

export default BarChart;
