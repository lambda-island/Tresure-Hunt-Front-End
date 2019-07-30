import React, {Component} from 'react';
import DataDisplay from './dataDisplay'
import secToken from './tokens/Token'
import axios from 'axios'
import styled from 'styled-components'
import data from './data.json'
import GraphMap from './graphMap'



const Button = styled.button`
    border-radius: 5px;
    padding: 15px 25px;
    font-size: 22px;
    text-decoration: none;
    margin: 20px;
    color: #fff;
    position: relative;
    display: inline-block;
    &:hover {
    background-color: #6FC6FF;
    }
`

const URL = process.env.URL

const config = {
    headers: { Authorization: secToken }
}

class Traversal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            exits: [],
            room_id: 0,
            title: '',
            reverseDirection: {n: 's', s: 'n', w: 'e', e: 'w'},
            description: '',
            messages: [],
            cooldown: 15,
            errors: [],
            roomData: {},
            graph: [],
            items: [],
            path: [],
            value: null,
            allCoordinates: [],
            allLinks: [],
            mapCoords: [],
            countVisited: 0,
            visited: new Set(),
            graphLoad: false
        }
    }

    // Travelsal function
    componentDidMount() {
        if(localStorage.hasOwnProperty('graph')) {
            let value = JSON.parse(localStorage.getItem('graph'))
            this.setState({graph: value, graphLoad: true})
        } else {
            localStorage.setItem('graph', JSON.stringify(data))
            let value = JSON.parse(localStorage.getItem('graph'))
            this.setState({graph: value, graphLoad: true})
        }
        this.getInfo()
    }

    componentDidUpdate(prevState) {
        if (!this.state.allCoordinates.length && this.state.graph) {
            this.mapLinks();
            this.mapCoordinates();
        }
    }

    // Initialize the graph

    // Travel
    travel = async (move, next_room_id = null) => {
        let data;
        if (next_room_id !== null) {
            data = {
                direction: move,
                next_room_id: next_room_id.toString()
            };
        } else {
            data = {
                direction: move
            };
        }

        try {
            const response = await axios({
                method: "post",
                url: "https://lambda-treasure-hunt.herokuapp.com/api/adv/move/",
                headers: { Authorization: secToken },
                data
            });

            let prev_room_id = this.state.room_id;
            let graph = this.updateGraph(
            response.data.room_id,
            this.parseCoordinates(response.data.coordinates),
            response.data.exits,
            prev_room_id,
            move
            );
            // set the state
            console.log('coor', response.data.coordinates)
            this.setState({
                room_id: response.data.room_id,
                coordinates: this.parseCoordinates(response.data.coordinates),
                exits: [...response.data.exits],
                path: [...this.state.path, move],
                cooldown: response.data.cooldown,
                description: response.data.description,
                items: response.data.items,
                title: response.data.title,
                players: response.data.players,
                messages: response.data.messages,
                value: "",
                graph
            });
            console.log(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    updataGraph = (id, coordinates, exits, prev_room_id = null, move = null) => {
        const {reverseDirection} = this.state
        let graph = Object.assign(this.state.graph);
        if (!this.state.graph[id]) {
            let payload = [];
            payload.push(coordinates);
            const moves = {};
            exits.forEach(exit => {
                moves[exit] = "?";
            });
            payload.push(moves);
            graph = { ...graph, [id]: payload };
        }

        if (prev_room_id !== null && move && prev_room_id !== id) {
            graph[prev_room_id][1][move] = id;
            graph[id][1][reverseDirection[move]] = prev_room_id;
        }
        localStorage.setItem("graph", JSON.stringify(graph));
        return graph;
    }

    traverseMap = () => {
        let count = 1
        let unknowExits = this.getUnkownExits()
        console.log("unknown exits", unknowExits)
        if (unknowExits.length) {
            let move = unknowExits[0]
            this.travel(move)
        } else {
            let path = this.bft()

            if (typeof path === 'string') {
            } else {
                console.log("path", path);
                for (let direction of path) {
                  for (let d in direction) {
                    setTimeout(() => {
                      this.travel(d, direction[d]);
                    }, 15 * 1000 * count + 1000);
                    count++;
                  }
                }
                if (this.state.visited.size < 499) {
                  setTimeout(
                    this.traverseMap(),
                    this.state.cooldown * 1000 * count + 1000
                  );
                  this.updateVisited();
                  count = 1;
                } else {
                  console.log("Something went wrong");
                }
            }
        }
        return 'doesnt exits'
    }

    mapCoordinates = () => {
        const { graph } = this.state;
        const setCoordinates = [];
        for (let room in graph) {
            setCoordinates.push(graph[room][0]);
        }
        this.setState({ allCoordinates: setCoordinates });
    };
    mapLinks = () => {
        const { graph } = this.state;
        const setLinks = [];
        for (let room in graph) {
            for (let linkedRoom in graph[room][1]) {
            console.log('link',[graph[room][0], graph[graph[room][1][linkedRoom]][0]])
            setLinks.push([graph[room][0], graph[graph[room][1][linkedRoom]][0]]);
            }
        }
        this.setState({ allLinks: setLinks });
    };

    updateVisited = () => {
        let visited = new Set(this.state.set)
        for (let key in this.state.graph) {
            if (!visited.has(key)) {
                let temp = []
                for (let direction in key) {
                    if (key[direction] === '?') {
                        temp.push(direction)
                    }
                }
                if (!temp.length) {
                    visited.add(key)
                }
            }
        }
        let countVisited = visited.size / 500;
        this.setState({visited, countVisited})
    }

    getUnkownExits = () => {
        let unknowExits = []
        let directions = this.state.graph[this.state.room_id][1]
        for(let direction in directions) {
            if (directions[direction] === '?') {
                unknowExits.push(direction)
            }
        }
        return unknowExits
    }

    parseCoordinates = coordinates => {
        const coordsObject = {};
        const coordsArray = coordinates.replace(/[{()}]/g, "").split(",");
    
        coordsArray.forEach(coord => {
            coordsObject["x"] = parseInt[coordsArray[0]];
            coordsObject["y"] = parseInt[coordsArray[1]];
        });
        return coordsObject
    };


    // get the inital info of the graph
    getInfo = () => {
        axios
            .get('https://lambda-treasure-hunt.herokuapp.com/api/adv/init', config)
            .then(res => {
                let graph = this.updataGraph(
                    res.data.room_id,
                    this.parseCoordinates(res.data.coordinates),
                    res.data.exits
                )
                if (res.status === 200 && res.data) {
                    console.log(res)
                    this.setState( prevState => ({
                        coordinates: res.data.coordinates,
                        exits: [...res.data.exits],
                        room_id: res.data.room_id,
                        title: res.data.title,
                        description: res.data.description,
                        messages: res.data.messages,
                        cooldown: res.data.cooldown,
                        errors: res.data.errors,
                        roomData: res.data,
                        graph
                    }))
                    this.updateVisited()
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    getItem = async () => {
        let tresure = this.state.items
        
        try {
            await axios({
                method: 'post',
                url: 'https://lambda-treasure-hunt.herokuapp.com/api/adv/take/',
                headers: {
                    Authorization: secToken
                },
                data: {
                    name: tresure
                }
            })
        } catch (err) {
            console.log(err)
        }
        
    }

    handleChange = (event) => {
        event.preventDefault();
        this.setState({value: event.target.value})
    }

    // Breadth First Search Traversal
    bft = (start = this.state.room_id, target = '?') => {
        let {graph} = this.state;
        let queue = []
        let visited = new Set()
        for (let room in graph[start][1]) {
            queue = [...queue, [{[room]: graph[start][1][room]}]]
        }
        while (queue.length) {
            let dequeued = queue.shift()
            let last_room = dequeued[dequeued.length -1]

            for (let exit in last_room) {
                if (last_room[exit] === target) {
                    dequeued.pop()
                    return dequeued
                } else {
                    visited.add(last_room[exit])

                    for (let path in graph[last_room[exit]][1]) {
                        if (visited.has(graph[last_room[exit]][1][path]) === false) {
                            let path_copy = Array.from(dequeued)
                            path_copy.push({[path]: graph[last_room[exit]][1][path]})
                            queue.push(path_copy)
                        }
                    }
                }
            }
        }
    }

    handleClick = () => {
        this.traverseMap();
    }

    render() {
        const { graph } = this.state
        console.log('graph', graph)

        return (
            <React.Fragment>
                <DataDisplay {...this.state} />
                <Button onClick={() => this.getInfo()}>Update Info</Button>
                <Button onClick={() => this.travel('n')}>North</Button>
                <Button onClick={() => this.travel('e')}>East</Button>
                <Button onClick={() => this.travel('s')}>South</Button>
                <Button onClick={() => this.travel('w')}>West</Button>
                <Button onClick={() => this.traverseMap()}>AutoTraverse</Button>
                <Button onClick={() => this.getItem()}>Pick Up Treasure</Button>
                { graph ? <GraphMap coordinates={this.state.allCoordinates} links={this.state.allLinks}/> : <div><p>graph loading</p></div> }
                <form>
                    <label>
                        Next Room ID: <input type='number' value={this.state.value} onChange={this.handleChange} />
                    </label>
                </form>
            </React.Fragment>
        )
    }
}

export default Traversal