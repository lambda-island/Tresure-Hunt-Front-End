import React, { Component } from 'react';
import axios from 'axios';
import { datajson } from './data';
import CountdownTimer from 'react-component-countdown-timer';
import uuid from 'uuid';
import Graph from './graph'

class GraphMap extends Component {
    constructor(props){
        super()
    
        this.state = {
            cooldown: 0,
            inventory: [],
            next_room_id: -1,
            room_data: {
                current_room_id: -1,
                previous_room_id: null,
                exits: [],
                items: [],
                players: [],
                errors: [],
                messages: [],
                title: null,
                description: null,
                coordinates: null,
                elevation: null,
                terrain: ''
            },
            player_status: {
                name: '',
                encumberance: null,
                strength: 10,
                speed: 10,
                gold: null,
                inventory: [],
                status: [],
                errors: [],
                messages: []
            },
            examined: {},
            id: uuid,
            coordinates: [],
            neighbors: []
        }
    }



    componentDidMount() {
        this.getInit();
        this.getCoords(datajson)
    }

    getCoords = data => {
        let coordinates = []
        let neighbors = []
        for (let key in data){
            coordinates.push({x: data[key][0]['x'], y: data[key][0]['y'], id: key})
            neighbors.push(data[key][1])
        }
        console.log('COORDINATES', coordinates)
        console.log('neighbors', neighbors)
        this.setState({
            coordinates,
            neighbors
        })
    }

    examineRoom = async name => {
        let data = { name: name.player };
    
        try {
            let res = await axios({
                method: 'post',
                url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/examine/`,
                headers: {
                    Authorization: 'Token 07bd865cf1d2e3c39f850fa619c85db565ff6b18'
                },
                data
            });
    
            console.log(res.data)
    
            this.setState({
                cooldown: res.data.cooldown,
                examined: {
                    name: res.data.name,
                    description: res.data.description,
                    errors: res.data.errors,
                    messages: res.data.messages
                }
            })
    
        } catch (err) {
            console.error(err);
        }
    }
    // TODO: Figure out what/where the name changer is!!
    // nameChanger = async (newName) => {
    //     let data = {newName}

    //     try {
    //         let res = await axios({
    //             method: 'post',
    //             url: 'https://lambda-treasure-hunt.herokuapp.com/api/adv/change_name/',
    //             headers: {
    //                 Authorization: 'Token 07bd865cf1d2e3c39f850fa619c85db565ff6b18'
    //             }
    //         });
    //         this.setState({
    //             name: res.data.
    //         })
    //     }

    // }

    getData = async () => {
        try {
            let res = await axios({
                url: 'https://lambda-treasure-hunt.herokuapp.com/api/adv/status/',
                method: 'post',
                timeout: 8000,
                headers: {
                    Authorization: 'Token 07bd865cf1d2e3c39f850fa619c85db565ff6b18'
                }
            });
            if (res.status === 200) {
            // test for status you want, etc
            console.log(res.status);
            }
            // Don't forget to return something
            console.log(res.data);
            console.log(res.data.room_id);

            this.setState({
                player_status: {
                    name: res.data.name,
                    encumberance: res.data.encumberance,
                    strength: res.data.strength,
                    speed: res.data.speed,
                    gold: res.data.gold,
                    inventory: res.data.inventory,
                    status: res.data.status,
                    errors: res.data.errors,
                    messages: res.data.messages,
                }
            })

        } catch (err) {
            console.error(err);
        }
    };

    getInit = async () => {
        try {
            let res = await axios({
                method: 'get',
                url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/init/`,
                headers: {
                    Authorization: 'Token 07bd865cf1d2e3c39f850fa619c85db565ff6b18'
                }
            });
            console.log(res.data);
    
            this.setState({
                cooldown: res.data.cooldown,
                room_data: {
                    current_room_id: res.data.room_id,
                    previous_room_id: this.state.room_data.current_room_id,
                    exits: res.data.exits,
                    items: res.data.items,
                    players: res.data.players,
                    errors: res.data.errors,
                    messages: res.data.messages,
                    title: res.data.title,
                    description: res.data.description,
                    coordinates: res.data.coordinates,
                    elevation: res.data.elevation,
                    terrain: res.data.terrain
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    pray = async () => {
        try {
            let res = await axios({
                method: 'post',
                url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/pray/`,
                headers: {
                    Authorization: 'Token 07bd865cf1d2e3c39f850fa619c85db565ff6b18'
                }
            });
            // TODO: When we find a shrine figure out the res data
            console.log(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    treasure_pickup = async name => {
        let data = { name: name.item };
        try {
            let res = await axios({
                method: 'post',
                url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/take/`,
                headers: {
                    Authorization: 'Token 07bd865cf1d2e3c39f850fa619c85db565ff6b18'
                },
                data
            });
            this.setState({
                cooldown: res.data.cooldown
            });
            console.log('picked up', { name });
            console.log('cooldown', this.state.cooldown);
            // TODO: Call status
        } catch (err) {
            console.log(err);
        }
    };

    treasure_drop = async name => {
        let data = { name };
        try {
            let res = await axios({
                method: 'post',
                url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/drop/`,
                headers: {
                    Authorization: 'Token 07bd865cf1d2e3c39f850fa619c85db565ff6b18'
                },
                data
            });
            this.setState({
                cooldown: res.data.cooldown
            });
            console.log('dropped', { name });
            console.log('cooldown', this.state.cooldown);
            // TODO: Call status
        } catch (err) {
            console.log(err);
        }
    };

    movement = async move => {
        let data;
        let dir = Object.values(move)[0];
        console.log(dir);
        let next = datajson[this.state.room_data.current_room_id][1][dir];
        console.log(next);
        data = {
            direction: dir.toString(),
            next_room_id: next.toString()
        }
        try {
            let res = await axios({
                method: 'post',
                url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/move/`,
                headers: {
                    Authorization: 'Token 07bd865cf1d2e3c39f850fa619c85db565ff6b18'
                },
                data
            });
            console.log(res.data);
            console.table('State', this.state.cooldown);
            
            this.setState({
                cooldown: res.data.cooldown,
                next_room_id: next,
                room_data: {
                    current_room_id: res.data.room_id,
                    previous_room_id: this.state.room_data.current_room_id,
                    exits: res.data.exits,
                    items: res.data.items,
                    players: res.data.players,
                    errors: res.data.errors,
                    messages: res.data.messages,
                    title: res.data.title,
                    description: res.data.description,
                    coordinates: res.data.coordinates,
                    elevation: res.data.elevation,
                    terrain: res.data.terrain,
                },
                id: uuid,
            })

            console.table('State', this.state.cooldown);
        
            // setTimeout(() => {
            //   this.getData();
            // }, res.data.cooldown * 1000);

        } catch (err) {
            console.error(err);
        }
    };

    render() {
        return (
            <div>
                {this.state.room_data.items.includes('shrine') ? (
                    <button onClick={() => this.pray()}>Pray</button>
                ) : null}
                {this.state.room_data.exits.map(exit => (
                    <button onClick={() => this.movement({ exit })} key={exit}>
                        {exit}
                    </button>
                ))}
                {this.state.room_data.items.length !== 0 ? (
                    this.state.room_data.items.map(item => (
                        <ul key={item}>
                            <li>Items in room:</li>
                            <button onClick={() => this.treasure_pickup({ item })}>
                                pick up: {item}
                            </button>
                        </ul>
                    ))
                ) : (
                    <p>This room contains no items</p>
                )}
                {this.state.room_data.players.length !== 0 ? (
                    this.state.room_data.players.map(player => (
                        <ul key={player}>
                            <li>Players in room:</li>
                            <button onClick={() => this.examineRoom({ player })}>
                                {player}
                            </button>
                        </ul>
                    ))
                ) : (
                    <p>You are alone in this room</p>
                )}
                <button onClick={() => this.treasure_drop('tiny treasure')}>
                    Drop tiny treasure
                </button>

                <div>
                    {this.state.room_data.exits.map(exit => (
                        <p key={exit}>
                            {exit}
                            <CountdownTimer key={exit} count={this.state.cooldown} />
                        </p>
                        ))}
                </div>
                <Graph
                    nextRoom={this.state.next_room_id}
                    roomId = {this.state.room_data.current_room_id}
                    coordinates={this.state.coordinates}
                    neighbors={this.state.neighbors}
                />
            </div>
        );
    }
}

export default GraphMap;