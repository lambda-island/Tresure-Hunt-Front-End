import React, {Component} from 'react';
import DataDisplay from './dataDisplay'
import secToken from './tokens/Token'
import axios from 'axios'
import styled from 'styled-components'
import { isNull } from 'util'
import { throws } from 'assert';


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
            coordinates: {},
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
            value: null
        }
    }

    // Travelsal function
    componentDidMount() {
        if(localStorage.hasOwnProperty('graph')) {
            let value = JSON.parse(localStorage.getItem('graph'))
            this.setState({graph: value})
        }
        this.getInfo()
    }

    // Initialize the graph

    // Travel
    travel = async (move, next_room_id = null) => {
        let data;
        if (next_room_id !== null) {
            data = {
                direction: move,
                next_room_id: toString(next_room_id)
            }
        } else {
            data = {
                direction: move
            }
        }

        try {
            const response = await axios({
                method: 'post',
                url: 'https://lambda-treasure-hunt.herokuapp.com/api/adv/move/',
                headers: {
                    Authorization: secToken
                },
                data
            })
            let prev_room_id = this.state.room_id
            let graph = this.updataGraph(
                response.data.room_id,
                this.parseCoordinates(response.data.coordinates),
                response.data.exits,
                prev_room_id,
                move
            )
            // set the state
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
                value: '',
                graph
            })
            console.log(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    updataGraph = (id, coordinates, exits, prev_room_id = null, move = null) => {
        const {reverseDirection} = this.state
        let graph = Object.assign({}, this.state.graph)
        if(!this.state.graph[id]){
            let payload = []
            payload.push(coordinates)
            const moves = {}
            exits.forEach(exit => {
                moves[exit] = '?'
            })
            payload.push(moves)
            graph = {...graph, [id]: payload}
        }
        if (prev_room_id !== null && prev_room_id !== id) {
            graph[prev_room_id][1][move]= id
            graph[id][1][reverseDirection[move]] = prev_room_id
        }
        localStorage.setItem('graph', JSON.stringify(graph))
        return graph
    }

    traverseMap = () => {
        let unknowExits = this.getUnkownExits()
        if (unknowExits.length) {
            let move = unknowExits[0]
            this.travel(move)
        } else {
            clearInterval(this.interval)
            let path = this.bft()
            let count = 1
            for (let direction of path) {
                for (let d in direction) {
                    setTimeout(() => {
                        this.travel(d)
                    }, this.state.cooldown * 1000 * count)
                    count = count + 1
                }
            }
            this.interval = setInterval(
                this.traverseMap,
                this.state.cooldown * 1000 * count
            )
            count = 1
        }
        this.updateVisited()
    }

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
        const coordsObject = {}
        const ArrayCoords = coordinates.replace(/[{()}]/g, '').split(',');

        ArrayCoords.forEach(coord => {
            coordsObject['x'] = parseInt[ArrayCoords[0]]
            coordsObject['y'] = parseInt[ArrayCoords[1]]
        })

        return coordsObject
    }


    // get the inital info of the graph
    getInfo = () => {
        axios
            .get('https://lambda-treasure-hunt.herokuapp.com/api/adv/init', config)
            .then(res => {
                let graph = this.updataGraph(res.data.room_id, this.parseCoordinates(res.data.coordinates), res.data.exits)
                if (res.status === 200 && res.data) {
                    console.log(res)
                    this.setState({
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
                    })
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

                    for (let path in graph[last_room[exit][1]]) {
                        if (visited.has(graph[last_room[exit][1][path]]) === false) {
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
        this.interval = setInterval(this.traverseMap, this.state.cooldown * 1000)
    }

    render() {
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