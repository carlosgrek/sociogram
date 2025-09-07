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
        {id: "Noah Diederich"},
        {id: "Franceska"},
        {id: "Paul Ashioya"},
        {id: "Ege-ly Kuiva"},
        {id: "Xaviera"},
        {id: "Remco Krols"},
        {id: "Henry Bley"},
        {id: "Janne"},
        {id: "Gaëlle Clement"},
        {id: "Nathan van Nieuwstadt"},
        {id: "Justin Reynolds"},
        {id: "Amal Laassikri"},
        {id: "Patrycja Jaskierny"},
        {id: "Tom van Meel"},
        {id: "Bruna Vanesse"},
        {id: "Famke Marain"},
        {id: "Dlhokazi Nhaúle"},
        {id: "Khensani Senda"},
        {id: "Elaine Quintela"},
        {id: "Angélica Chaúque"},
        {id: "Carlos Grék"},
        {id: "William Tadeu"},
        {id: "Jasmine Tadeu"},
        {id: "Isabel Wright"},
        {id: "Sofia Wright"},
        {id: "Marco Wright"},
        {id: "Matheus Guimarães"},
        {id: "Filipe Guimarães"},
    ] as Node[],
    links: [

        {source: "Noah Diederich", target: "Franceska", type: "dating"},
        {source: "Noah Diederich", target: "Paul Ashioya", type: "friend"},
        {source: "Noah Diederich", target: "Ege-ly Kuiva", type: "friend"},
        {source: "Noah Diederich", target: "Xaviera", type: "friend"},
        {source: "Noah Diederich", target: "Remco Krols", type: "friend"},
        {source: "Noah Diederich", target: "Henry Bley", type: "friend"},
        {source: "Noah Diederich", target: "Janne", type: "friend"},

        {source: "Franceska", target: "Paul Ashioya", type: "friend"},
        {source: "Franceska", target: "Ege-ly Kuiva", type: "friend"},
        {source: "Franceska", target: "Xaviera", type: "friend"},
        {source: "Franceska", target: "Remco Krols", type: "friend"},
        {source: "Franceska", target: "Henry Bley", type: "friend"},
        {source: "Franceska", target: "Janne", type: "friend"},

        {source: "Paul Ashioya", target: "Ege-ly Kuiva", type: "friend"},
        {source: "Paul Ashioya", target: "Xaviera", type: "friend"},
        {source: "Paul Ashioya", target: "Remco Krols", type: "friend"},
        {source: "Paul Ashioya", target: "Henry Bley", type: "friend"},
        {source: "Paul Ashioya", target: "Janne", type: "friend"},

        {source: "Ege-ly Kuiva", target: "Xaviera", type: "friend"},
        {source: "Ege-ly Kuiva", target: "Remco Krols", type: "friend"},
        {source: "Ege-ly Kuiva", target: "Henry Bley", type: "friend"},
        {source: "Ege-ly Kuiva", target: "Janne", type: "friend"},

        {source: "Xaviera", target: "Remco Krols", type: "friend"},
        {source: "Xaviera", target: "Henry Bley", type: "friend"},
        {source: "Xaviera", target: "Janne", type: "friend"},

        {source: "Remco Krols", target: "Henry Bley", type: "friend"},
        {source: "Remco Krols", target: "Janne", type: "friend"},

        {source: "Henry Bley", target: "Janne", type: "dating"},

        {source: "Gaëlle Clement", target: "Nathan van Nieuwstadt", type: "friend"},
        {source: "Gaëlle Clement", target: "Justin Reynolds", type: "friend"},
        {source: "Gaëlle Clement", target: "Filipe Guimarães", type: "friend"},
        {source: "Gaëlle Clement", target: "Amal Laassikri", type: "friend"},
        {source: "Gaëlle Clement", target: "Patrycja Jaskierny", type: "friend"},

        {source: "Nathan van Nieuwstadt", target: "Justin Reynolds", type: "acquaintance"},
        {source: "Nathan van Nieuwstadt", target: "Filipe Guimarães", type: "friend"},
        {source: "Nathan van Nieuwstadt", target: "Amal Laassikri", type: "friend"},
        {source: "Nathan van Nieuwstadt", target: "Patrycja Jaskierny", type: "friend"},

        {source: "Justin Reynolds", target: "Filipe Guimarães", type: "acquaintance"},
        {source: "Justin Reynolds", target: "Amal Laassikri", type: "acquaintance"},
        {source: "Justin Reynolds", target: "Patrycja Jaskierny", type: "acquaintance"},

        {source: "Filipe Guimarães", target: "Amal Laassikri", type: "friend"},
        {source: "Filipe Guimarães", target: "Patrycja Jaskierny", type: "friend"},

        {source: "Amal Laassikri", target: "Patrycja Jaskierny", type: "friend"},
        {source: "Patrycja Jaskierny", target: "Tom van Meel", type: "dating"},

        {source: "Bruna Vanesse", target: "Famke Marain", type: "friend"},
        {source: "Bruna Vanesse", target: "Dlhokazi Nhaúle", type: "friend"},
        {source: "Bruna Vanesse", target: "Khensani Senda", type: "friend"},
        {source: "Bruna Vanesse", target: "Elaine Quintela", type: "friend"},
        {source: "Bruna Vanesse", target: "Angélica Chaúque", type: "friend"},

        {source: "Famke Marain", target: "Dlhokazi Nhaúle", type: "friend"},
        {source: "Famke Marain", target: "Khensani Senda", type: "friend"},
        {source: "Famke Marain", target: "Elaine Quintela", type: "friend"},
        {source: "Famke Marain", target: "Angélica Chaúque", type: "friend"},

        {source: "Dlhokazi Nhaúle", target: "Khensani Senda", type: "friend"},
        {source: "Dlhokazi Nhaúle", target: "Elaine Quintela", type: "friend"},
        {source: "Dlhokazi Nhaúle", target: "Angélica Chaúque", type: "friend"},

        {source: "Khensani Senda", target: "Elaine Quintela", type: "friend"},
        {source: "Khensani Senda", target: "Angélica Chaúque", type: "friend"},

        {source: "Elaine Quintela", target: "Angélica Chaúque", type: "friend"},

        {source: "Carlos Grék", target: "Noah Diederich", type: "friend"},
        {source: "Carlos Grék", target: "Franceska", type: "friend"},
        {source: "Carlos Grék", target: "Paul Ashioya", type: "friend"},
        {source: "Carlos Grék", target: "Ege-ly Kuiva", type: "friend"},
        {source: "Carlos Grék", target: "Xaviera", type: "friend"},
        {source: "Carlos Grék", target: "Remco Krols", type: "friend"},
        {source: "Carlos Grék", target: "Henry Bley", type: "friend"},
        {source: "Carlos Grék", target: "Janne", type: "friend"},
        {source: "Carlos Grék", target: "Gaëlle Clement", type: "friend"},
        {source: "Carlos Grék", target: "Nathan van Nieuwstadt", type: "friend"},
        {source: "Carlos Grék", target: "Justin Reynolds", type: "acquaintance"},
        {source: "Carlos Grék", target: "Filipe Guimarães", type: "friend"},
        {source: "Carlos Grék", target: "Amal Laassikri", type: "friend"},
        {source: "Carlos Grék", target: "Patrycja Jaskierny", type: "friend"},
        {source: "Carlos Grék", target: "Bruna Vanesse", type: "friend"},
        {source: "Carlos Grék", target: "Famke Marain", type: "friend"},
        {source: "Carlos Grék", target: "Dlhokazi Nhaúle", type: "friend"},
        {source: "Carlos Grék", target: "Khensani Senda", type: "friend"},
        {source: "Carlos Grék", target: "Elaine Quintela", type: "friend"},
        {source: "Carlos Grék", target: "Angélica Chaúque", type: "friend"},

        {source: "Carlos Grék", target: "William Tadeu", type: "friend"},
        {source: "Carlos Grék", target: "Jasmine Tadeu", type: "friend"},
        {source: "Carlos Grék", target: "Isabel Wright", type: "friend"},
        {source: "Carlos Grék", target: "Sofia Wright", type: "friend"},
        {source: "Carlos Grék", target: "Marco Wright", type: "friend"},
        {source: "Carlos Grék", target: "Matheus Guimarães", type: "friend"},
        {source: "William Tadeu", target: "Jasmine Tadeu", type: "friend"},
        {source: "William Tadeu", target: "Isabel Wright", type: "friend"},
        {source: "William Tadeu", target: "Sofia Wright", type: "friend"},
        {source: "William Tadeu", target: "Marco Wright", type: "friend"},
        {source: "William Tadeu", target: "Matheus Guimarães", type: "friend"},
        {source: "William Tadeu", target: "Filipe Guimarães", type: "friend"},
        {source: "Jasmine Tadeu", target: "Isabel Wright", type: "friend"},
        {source: "Jasmine Tadeu", target: "Sofia Wright", type: "friend"},
        {source: "Jasmine Tadeu", target: "Marco Wright", type: "friend"},
        {source: "Jasmine Tadeu", target: "Matheus Guimarães", type: "friend"},
        {source: "Jasmine Tadeu", target: "Filipe Guimarães", type: "friend"},
        {source: "Isabel Wright", target: "Sofia Wright", type: "friend"},
        {source: "Isabel Wright", target: "Marco Wright", type: "friend"},
        {source: "Isabel Wright", target: "Matheus Guimarães", type: "dating"},
        {source: "Isabel Wright", target: "Filipe Guimarães", type: "friend"},
        {source: "Sofia Wright", target: "Marco Wright", type: "friend"},
        {source: "Sofia Wright", target: "Matheus Guimarães", type: "friend"},
        {source: "Sofia Wright", target: "Filipe Guimarães", type: "friend"},
        {source: "Marco Wright", target: "Matheus Guimarães", type: "friend"},
        {source: "Marco Wright", target: "Filipe Guimarães", type: "friend"},
        {source: "Matheus Guimarães", target: "Filipe Guimarães", type: "friend"},

    ] as Link[],
};

function FriendGram() {
    const [data] = useState(initialData);
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .style("overflow", "visible");

        const simulation = d3
            .forceSimulation<Node>(data.nodes)
            .force(
                "link",
                d3
                    .forceLink<Node, Link>(data.links)
                    .id((d) => d.id)
                    .distance(200)
            )
            .force("charge", d3.forceManyBody().strength(-200))
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
                        return "green";
                    case "dating":
                        return "blue";
                    case "acquaintance":
                        return "red";
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

export {FriendGram};