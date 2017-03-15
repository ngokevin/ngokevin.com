var margin = {top: 20, right: 20, bottom: 50, left: 50};
var width = document.getElementsByClassName('page')[0].offsetWidth - margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

var total = 0;
var line = d3.svg.line()
    .x(function(d, i) { return x(i); })
    .y(function(d, i) {
        total += d;
        console.log(total);
        return y(total);
    });

var svg = d3.select('svg#poker-chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.json('/files/poker.json', function(error, data) {
    var total = 0;
    var min = 0;
    var max = 0;
    for (var i = 0; i < data.length; i++) {
        total += data[i];
        min = total < min ? total : min;
        max = total > max ? total : max;
    }

    x.domain([0, data.length]);
    y.domain([min, max]);

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
      .append('text')
        .attr('x', 108)
        .attr('dy', 35)
        .style('text-anchor', 'end')
        .text('Tourney/Session No.');

    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Profit ($)');

    svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('d', line);
});
