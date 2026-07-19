const width = window.innerWidth;
const height = window.innerHeight;
const nodeCoreRadius = 20;
const nodeHaloRadius = 32;

function visualize(fileData){

    let node = new Set();
    for(let [file,data] of fileData){
        node.add(file);
        for(let dependency of data.dependencies){
                node.add(dependency);
        }
    }
    const nodeList = [...node].map((name) => {
        if(fileData.has(name))
            return{
                id: name, 
                coreRadius: nodeCoreRadius + fileData.get(name).dependencies.length,
                haloRadius: nodeHaloRadius + fileData.get(name).dependencies.length,
                coreClass: "selected-node-core",
                haloClass: "selected-node-halo",
                textClass: "selected-node-text",
                symbol: "📄"
            };
        else
            return{
                id: name, 
                coreRadius: nodeCoreRadius,
                haloRadius: nodeHaloRadius,
                coreClass: "dependency-node-core",
                haloClass: "dependency-node-halo",
                textClass: "dependency-node-text",
                symbol: "📦"
            }
        });
    
    let linkList = [];
    for(let [file,data] of fileData){
        for(let dependency of data.dependencies){
            linkList.push({source:dependency , target: file});
        }
    }

    //--------------- Force Simmulation ---------------------------------------------------------//

    const simulation = d3.forceSimulation(nodeList)
    .force("link", d3.forceLink(linkList).id(d => d.id)
        .distance(180)      
        .strength(1))
    .force("charge", d3.forceManyBody()
        .strength(-500)    
        .distanceMax(400)) 
    .force("collide", d3.forceCollide().radius(d => d.haloRadius + 5).strength(0.8))
    .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = d3.select("#graphContainer");
    const mainLayer = svg.append("g").attr("class","main-layer");
    
    //-------------- Arrow Head ----------------------------------------------------------------//
    svg.append("defs").append("marker")
        .attr("id", "arrowHead")
        .attr("viewBox" , "0 -3 7 6")
        .attr("refX" , 20)
        .attr("refY" , 0)
        .attr("markerHeight" ,5)
        .attr("markerWidth" ,5)
        .attr("orient","auto")
        .append("path")
        .attr("d" , "M0,-3L7,0L0,3Z")
        .attr("class","linkHeads");
    
    //------------ Links ------------------------------------------------------------------------//
    const links = mainLayer.append("g")
            .selectAll("line")
            .data(linkList)
            .join("line")
            .attr("class" , "links")
            .attr("marker-end","url(#arrowHead)");
    
    //------------ Nodes ------------------------------------------------------------------------//
    const nodes = mainLayer.append("g")
            .selectAll("g.node-container")
            .data(nodeList)
            .join("g")
            .attr("class", "node-container")
            .call(
        d3.drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x; d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x; d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null; d.fy = null;
          })
        )

    nodes.append("circle")
        .attr("r" , d => {
            return d.haloRadius;
        })
        .attr("class" ,  d => {
            return d.haloClass;
        });
            
    nodes.append("circle")
        .attr("r" , d => {
            return d.coreRadius;
        })
        .attr("class" , d => {
            return d.coreClass;
        });

        nodes.append("text")
            .text(d=>{
                const maxLength = 12;
                const name = d.id
                return name.length < 12 ? name : name.substring(0,maxLength) + '...';
            })
            .attr("y",d => {
            return d.haloRadius + 8;
            })
            .attr("text-anchor","middle")
            .attr("class",d => {
            return d.textClass;
            });

        nodes.append("text")
            .text(d => {
                return d.symbol ;
            })
            .attr("text-anchor","middle")
            .attr("dominant-baseline" , "central")
            .attr("font-size", "21px")
            .attr("pointer-events" , "none");
        
        nodes.append("title")
            .text(d => d.id);
    
            const zoom = d3.zoom()
                .scaleExtent([0.1 , 6])
                .on("zoom" , (event) =>{
                    mainLayer.attr("transform" , event.transform);
                });
    
    svg.call(zoom);
    simulation.on("tick", () => {
        links
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
      nodes
        .attr("transform", d => `translate(${d.x}, ${d.y})`);
    });

    UpdateScreen(fileData , nodeList , linkList);
}


function UpdateScreen(fileData , nodeList , linkList){
    
    const statDiv = document.getElementById("graphDetails");

    const head = document.getElementById("details-label");
    head.textContent = "Graph Stats";

    statDiv.innerHTML = '';

    let text_Content = [
        {stat: fileData.size, label: 'Files Selected'},  
        {stat: nodeList.length, label: 'Total Nodes'},
        {stat: linkList.length, label:'Total Dependencies'}
        // {stat: '0', label:'Circular Dependencies'}
        ];
    
    text_Content.forEach(value => {
        
        let statDiv1 = document.createElement("div");
        statDiv1.classList.add("graph-stat-inner-container");

        let valueSpan = document.createElement("span");
        valueSpan.classList.add("graph-stats");
        valueSpan.textContent = value.stat;

        let labelSpan = document.createElement("span");
        labelSpan.classList.add("graph-stats-labels");
        labelSpan.textContent = value.label;

        statDiv.appendChild(statDiv1);
        statDiv1.appendChild(valueSpan);
        statDiv1.appendChild(labelSpan);        
    })
    
}
export default visualize;
