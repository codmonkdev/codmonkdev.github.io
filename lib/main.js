import * as styles from '../styles/index.css'

import * as d3 from 'd3v4';

// Your code importing each chapter's module will go here.

// If you're following along in the book, check out the other branches of this repo 
// to see what should be here for any given chapter.

const chart = d3.select('body')
  .append('svg')
  .attr('id','chart');
  
const req = new window.XMLHttpRequest();
req.addEventListener('load',mugeData);
req.open('GET','data/EU-referendum-result-data.csv');
req.send();

function mugeData(){
  
  const data = d3.csvParse(this.responseText);
  console.log('data='+JSON.stringify(data));
 
  /*const regionsPctTurnout = d3.nest()
    .key(d => d.Region)
	.rollup(d => d3.mean(d,leaf => leaf.Pct_Turnout))
	.entries(data);
  console.log('regionsPctTurnout='+JSON.stringify(regionsPctTurnout));
  */
  const regions = data.reduce((last,row) => {
    if(!last[row.Region]) last[row.Region] = [];
	last[row.Region].push(row);
	return last;
  },{});
  console.log('regions='+JSON.stringify(regions));
  const regionsPctTurnout = Object.entries(regions)
    .map(([region,areas]) => ({
	  region,
	  meanPctTurnout: d3.mean(areas, d => d.Pct_Turnout),
  }));
  console.log('regionsPctTurnout='+JSON.stringify(regionsPctTurnout));
  
  
  renderChart(regionsPctTurnout);  
}

function renderChart(data){
   chart
    .attr('width',window.innerWidth)
	.attr('height',window.innerHeight);
  console.log('1');
  const x = d3.scaleBand()
    .domain(data.map(d => d.region))
	.rangeRound([50,window.innerWidth - 50])
	.padding(0.1);
  console.log('2');
  const y = d3.scaleLinear()
    .domain([0,d3.max(data,d => d.meanPctTurnout)])
    .range([window.innerHeight - 50,0]);	
  console.log('3');
  const xAxis = d3.axisBottom().scale(x);
  const yAxis = d3.axisLeft().scale(y);
  console.log('4');
  chart.append('g')
    .attr('class','axis')
	.attr('transform', `translate(0, ${window.innerHeight - 50})`)
	.call(xAxis);
  console.log('5');
  chart.append('g')
     .attr('class', 'axis')
     .attr('transform', 'translate(50, 0)')
     .call(yAxis);
  
/*    chart.selectAll('rect')
    .data(data)
	.enter()
	.append('rect')
	.attr('class','bar')
	.attr('x',d => x(d.region))
	.attr('y',d => y(d.meanPctTurnout))
	.attr('width',x.bandwidth())
	.attr('height',d => (window.innerHeight - 50) - y(d.meanPctTurnout)); 
  console.log('6');   */

  chart.selectAll('rect')
    .data(data)
	.enter()
	.append('rect')
	.attr('class','bar')
	.attr('x',d => x(d.region))
	.attr('y',() => window.innerHeight - 50)
	.attr('width',x.bandwidth())
	.attr('height',0)
	  .transition()
	  .delay((d,i) => i * 20)
	  .duration(800)
	  .attr('y',d => y(d.meanPctTurnout))
	  .attr('height',d => (window.innerHeight - 50) - y(d.meanPctTurnout));
	
}

