import {useState, useEffect, useRef} from "react";
import * as d3 from "d3";

interface Node {
    id: string;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
}

interface Link {
    source: string | Node;
    target: string | Node;
    type?: string;
}

const initialData = {
    nodes: [
        {id: "Carlos Grék"},
        {id: "Ivana Gréková"},
        {id: "Sofia Gréková"},
        {id: "Júlio da Cunha"},
        {id: "Hailton da Cunha"},
        {id: "Stela Ribeiro"},
        {id: "Núria Ribeiro"},
        {id: "Mauro Ribeiro"},
        {id: "Mariana Nemcová"},
        {id: "Lubos Nemec"},
        {id: "Lubica Nemcová"},
        {id: "Ivica Nemcová"},
        {id: "Martin Nemec"},
        {id: "Karol Grék Sr."},
        {id: "Mária Gréková"},
        {id: "Karol Grék Jr."},
        {id: "Katka Gréková"},
        {id: "Karol Grék III"},
        {id: "Martina Gréková"},
        {id: "Luuk Jansen"},
    ] as Node[],
    links: [
        {source: "Carlos Grék", target: "Ivana Gréková", type: "family"},
        {source: "Carlos Grék", target: "Luuk Jansen", type: "family"},
        {source: "Sofia Gréková", target: "Ivana Gréková", type: "family"},
        {source: "Júlio da Cunha", target: "Ivana Gréková", type: ""},
        {source: "Júlio da Cunha", target: "Hailton da Cunha", type: "family"},
        {source: "Júlio da Cunha", target: "Carlos Grék", type: "family"},
        {source: "Júlio da Cunha", target: "Sofia Gréková", type: "family"},
        {source: "Júlio da Cunha", target: "Stela Ribeiro", type: "family"},
        {source: "Stela Ribeiro", target: "Mauro Ribeiro", type: "family"},
        {source: "Stela Ribeiro", target: "Núria Ribeiro", type: "family"},
        {source: "Ivana Gréková", target: "Karol Grék Sr.", type: "family"},
        {source: "Mária Gréková", target: "Karol Grék Sr.", type: "family"},
        {source: "Mária Gréková", target: "Mariana Nemcová", type: "family"},
        {source: "Mária Gréková", target: "Karol Grék Jr.", type: "family"},
        {source: "Mária Gréková", target: "Ivana Gréková", type: "family"},
        {source: "Karol Grék Jr.", target: "Karol Grék Sr.", type: "family"},
        {source: "Karol Grék Jr.", target: "Karol Grék III", type: "family"},
        {source: "Katka Gréková", target: "Karol Grék III", type: "family"},
        {source: "Karol Grék Jr.", target: "Martina Gréková", type: "family"},
        {source: "Katka Gréková", target: "Martina Gréková", type: "family"},
        {source: "Karol Grék Jr.", target: "Katka Gréková", type: "family"},
        {source: "Mariana Nemcová", target: "Lubos Nemec", type: "family"},
        {source: "Lubos Nemec", target: "Lubica Nemcová", type: "family"},
        {source: "Lubos Nemec", target: "Ivica Nemcová", type: "family"},
        {source: "Lubos Nemec", target: "Martin Nemec", type: "family"},
        {source: "Mariana Nemcová", target: "Lubica Nemcová", type: "family"},
        {source: "Mariana Nemcová", target: "Ivica Nemcová", type: "family"},
        {source: "Mariana Nemcová", target: "Martin Nemec", type: "family"},
        {source: "Mariana Nemcová", target: "Karol Grék Sr.", type: "family"},

        // Siblings
        {source: "Mariana Nemcová", target: "Karol Grék Jr.", type: "sibling"},
        {source: "Ivana Gréková", target: "Mariana Nemcová", type: "sibling"},
        {source: "Ivana Gréková", target: "Karol Grék Jr.", type: "sibling"},
        {source: "Carlos Grék", target: "Sofia Gréková", type: "sibling"},
        {source: "Lubica Nemcová", target: "Ivica Nemcová", type: "sibling"},
        {source: "Lubica Nemcová", target: "Martin Nemec", type: "sibling"},
        {source: "Ivica Nemcová", target: "Martin Nemec", type: "sibling"},
        {source: "Martina Gréková", target: "Karol Grék III", type: "sibling"},
        {source: "Mauro Ribeiro", target: "Núria Ribeiro", type: "sibling"},

    ] as Link[],
};

function FamilyGram() {
    const [data] = useState(initialData);
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const width = 1000;
        const height = 1000;

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        const simulation = d3
            .forceSimulation<Node>(data.nodes)
            .force(
                "link",
                d3
                    .forceLink<Node, Link>(data.links)
                    .id((d) => d.id)
                    .distance(100)
            )
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2));

        // Draw links
        const link = svg
            .selectAll<SVGLineElement, Link>(".link")
            .data(data.links)
            .join("line")
            .attr("class", "link")
            .attr("stroke", (d) => {
                switch (d.type) {
                    case "friend":
                        return "blue";
                    case "family":
                        return "red";
                    case "sibling":
                        return "green";
                    default:
                        return "gray";
                }
            })
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", 2);

        // Draw nodes
        const node = svg
            .selectAll<SVGCircleElement, Node>(".node")
            .data(data.nodes)
            .join("circle")
            .attr("class", "node")
            .attr("r", 10)
            .attr("fill", "teal")
            .call(
                d3
                    .drag<SVGCircleElement, Node>()
                    .on("start", (event, d) => {
                        if (!event.active) simulation.alphaTarget(0.3).restart();
                        d.fx = d.x;
                        d.fy = d.y;
                    })
                    .on("drag", (event, d) => {
                        d.fx = event.x;
                        d.fy = event.y;
                    })
                    .on("end", (event, d) => {
                        if (!event.active) simulation.alphaTarget(0);
                        d.fx = null;
                        d.fy = null;
                    })
            );

        // Add labels
        const labels = svg
            .selectAll<SVGTextElement, Node>(".label")
            .data(data.nodes)
            .join("text")
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .attr("dy", -15)
            .text((d) => d.id);

        simulation.on("tick", () => {
            link
                .attr("x1", (d) => (d.source as Node).x!)
                .attr("y1", (d) => (d.source as Node).y!)
                .attr("x2", (d) => (d.target as Node).x!)
                .attr("y2", (d) => (d.target as Node).y!);

            node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);

            labels
                .attr("x", (d) => d.x!)
                .attr("y", (d) => d.y!);
        });

        return () => {
            simulation.stop();
        };
    }, [data]);

    return <svg ref={svgRef}></svg>;
}

export {FamilyGram};