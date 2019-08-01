import React, { Component } from 'react';
import axios from 'axios';
import { datajson } from './data';
import CountdownTimer from 'react-component-countdown-timer';
import uuid from 'uuid';
import Graph from './graph'
import Styled from 'styled-components'
import Players from './players'
import Loader from 'react-loader-spinner'
import Nav from './nav'


const Main = Styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`

const GraphWrapper = Styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`

const DirectionWrapper = Styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 20px;
    max-height: 100%;
    border-left: 2px solid black;
`

class GraphMap extends Component {
    constructor(props){
        super()
        
        this.interval = null

        this.state = {
            cooldown: 0,
            activeCooldown: false,
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
        if (this.state.activeCooldown) {
            this.checkCooldown()
        }
    }

    componentDidUpdate() {
        console.log('cooldown:', this.state.cooldown)
        clearInterval(this.interval)
        if (this.state.cooldown > 0) {
            this.interval = setInterval(() => this.setState({
                cooldown: this.state.cooldown - 1
            }), 1000)
        } else if (this.state.activeCooldown === true) {
            this.setState({
                activeCooldown: false
            })
        }
    }

    getCoords = data => {
        let coordinates = []
        let neighbors = []
        for (let key in data){
            coordinates.push({x: data[key][0]['x'], y: data[key][0]['y'], id: key})
            neighbors.push(data[key][1])
        }
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
                    Authorization: 'Token 7621d986e07671e24abdf324cc6c7237a8709aa5'
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
    //                 Authorization: 'Token 7621d986e07671e24abdf324cc6c7237a8709aa5'
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
                    Authorization: 'Token 7621d986e07671e24abdf324cc6c7237a8709aa5'
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
                    Authorization: 'Token 7621d986e07671e24abdf324cc6c7237a8709aa5'
                }
            });
            console.log(res.data);
    
            this.setState({
                cooldown: res.data.cooldown,
                activeCooldown: true,
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

    checkCooldown = () => {
        console.log('cooldown off') 
        setTimeout(() => {
            console.log('cooldown', this.state.cooldown)
            console.log('set activecooldown to false')
            this.setState({activeCooldown: false})
        }, this.state.cooldown * 1000)
    }

    pray = async () => {
        try {
            let res = await axios({
                method: 'post',
                url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/pray/`,
                headers: {
                    Authorization: 'Token 7621d986e07671e24abdf324cc6c7237a8709aa5'
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
                    Authorization: 'Token 7621d986e07671e24abdf324cc6c7237a8709aa5'
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
                    Authorization: 'Token 7621d986e07671e24abdf324cc6c7237a8709aa5'
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
                    Authorization: 'Token 7621d986e07671e24abdf324cc6c7237a8709aa5'
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
            <Main>
                <DirectionWrapper>
                {/* {this.state.room_data.items.includes('shrine') ? (
                    <button onClick={() => this.pray()}>Pray</button>
                ) : null}
                {this.state.room_data.exits.map(exit => (
                    <button onClick={() => this.movement({ exit })} key={exit}>
                        {exit}
                    </button>
                ))} */}
                {this.state.activeCooldown && (
                    <>
                        <h1>Cooldown: {this.state.cooldown}</h1>
                        <Loader type='Puff' color='red' height='150' width='150' />
                    </>
                )}
                {!this.state.activeCooldown && (
                    <>
                        <Nav
                            exits={this.state.room_data.exits}
                            movement={(exit) => this.movement(exit)}
                        />
                    </>
                )}
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
                <Players 
                    players = {this.state.room_data.players}
                    examineRoom = {() => this.examineRoom()}
                    currentRoom = {this.state.room_data.current_room_id}
                    title = {this.state.room_data.title}
                    coor = {this.state.room_data.coordinates}
                />

                <button onClick={() => this.treasure_drop('tiny treasure')}>
                    Drop tiny treasure
                </button>
                {/* <CountdownTimer count={this.state.cooldown} /> */}

                {/* <div>
                    {this.state.room_data.exits.map(exit => (
                        <p key={exit}>
                            {exit}
                            <CountdownTimer key={exit} count={this.state.cooldown} />
                        </p>
                        ))}
                </div> */}
                <p>Messages: {this.state.room_data.messages}</p>
                <p>Description: {this.state.room_data.description}</p>
                </DirectionWrapper>
                <GraphWrapper>
                    <Graph
                        nextRoom={this.state.next_room_id}
                        roomId = {this.state.room_data.current_room_id}
                        coordinates={this.state.coordinates}
                        neighbors={this.state.neighbors}
                    />
                </GraphWrapper>
            </Main>
        );
    }
}

export default GraphMap;