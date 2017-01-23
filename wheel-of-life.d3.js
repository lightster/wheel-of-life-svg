function wheelOfLife(selector, csv) {
  var svg = d3.select(selector);

  d3.csv(csv,
    function(d, i) {
      return {
        description: d.description,
        sort: d.sort,
        rating: d.rating,
        r: d.rating * d.rating
      };
    }, function(error, categories) {
      if (error) {
        throw error;
      }

      var width = +svg.attr('width');
      var height = +svg.attr('height');
      var centerX = width / 2;
      var centerY = (height / 2) + 25;
      var maxR = Math.min(width / 2, height / 2) - 100;

      categories.sort(function (a, b) {
        return a.sort < b.sort ? -1 : 1;
      });

      svg.append('rect')
        .attr('class', 'container')
        .attr('width', width)
        .attr('height', height)
        .style('fill', '#ffffff');

      svg.append('text')
        .attr('class', 'title-text')
        .attr('x', centerX)
        .attr('y', function(d, i, categories) {
          return 50;
        })
        .style('text-anchor', 'middle')
        .style('font-family', 'sans-serif')
        .style('font-size', '15px')
        .style('font-weight', 'bold')
        .style('fill', '#000000')
        .text('Wheel of Life');

      svg.append('circle')
        .attr('class', 'outer-circle')
        .attr('transform', function(d, i, categories) {
          var x = centerX;
          var y = centerY;

          return 'translate(' + x + ',' + y + ')';
        })
        .attr('r', maxR)
        .style('stroke', '#000000')
        .style('fill', 'transparent');

      svg.selectAll('.category-line')
        .data(categories)
        .enter()
        .append('line')
        .attr('class', 'category-line')
        .attr('x1', centerX)
        .attr('y1', centerY)
        .attr('x2', function(d, i, categories) {
          return centerX + Math.cos((2 * Math.PI * i / categories.length) - .5 * Math.PI) * maxR;
        })
        .attr('y2', function(d, i, categories) {
          return centerY + Math.sin((2 * Math.PI * i / categories.length) - .5 * Math.PI) * maxR;
        })
        .attr('stroke', 'black');

      svg.selectAll('.category-text')
        .data(categories)
        .enter().append('text')
        .attr('class', 'category-text')
        .text(function (d) {
          return d.description;
        })
        .style('font-size', '15px')
        .style('fill', '#000000')
        .style('text-anchor', 'middle')
        .style('font-family', 'sans-serif')
        .attr('x', function(d, i, categories) {
          var width = this.getComputedTextLength();
          var radius = Math.cos((2 * Math.PI * i / categories.length) - .5 * Math.PI) * maxR;
          var sign = 0;
          if (Math.abs(radius) > .1) {
            sign = radius / Math.abs(radius);
          }

          return centerX + radius + (sign * (45 + width) / 2);
        })
        .attr('y', function(d, i, categories) {
          return centerY + Math.sin((2 * Math.PI * i / categories.length) - .5 * Math.PI) * (maxR + 30) + 5;
        });

      var categoryCircle = svg.selectAll('.category-circle')
        .data(categories)
        .enter().append('g')
        .attr('class', 'category-circle')
        .attr('transform', function(d, i, categories) {
          var x = centerX + Math.cos((2 * Math.PI * i / categories.length) - .5 * Math.PI) * (d.rating * maxR / 10.0);
          var y = centerY + Math.sin((2 * Math.PI * i / categories.length) - .5 * Math.PI) * (d.rating * maxR / 10.0);

          return 'translate(' + x + ',' + y + ')';
        });

      categoryCircle.append('circle')
        .attr('id', function(d) {
          return 'category-' + d.sort;
        })
        .attr('r', function(d) {
          return 20;
        })
        .style('fill', function(d) {
          if (d.rating >= 8) {
            return '#009933';
          }
          if (d.rating >= 6) {
            return '#ddaa22';
          }

          return '#990033';
        });

      categoryCircle.append('clipPath')
        .attr('id', function(d) {
          return 'clip-category-' + d.sort;
        })
        .append('use')
        .attr('xlink:href', function(d) {
          return '#category-' + d.sort;
        });

      categoryCircle.append('text')
        .append('tspan')
          .attr('clip-path', function(d) {
            return 'url(#clip-category-' + d.sort + ')';
          })
        .attr('x', 0)
        .attr('y', function(d, i, categories) {
          return 20 - 15;
        })
        .style('text-anchor', 'middle')
        .style('font-family', 'sans-serif')
        .style('font-size', '15px')
        .style('font-weight', 'bold')
        .style('fill',  function(d) {
          if (d.rating >= 8) {
            return '#ffffff';
          }
          if (d.rating >= 6) {
            return '#000000';
          }

          return '#ffffff';
        })
        .text(function(d) {
          return d.rating;
        });
    })
}
