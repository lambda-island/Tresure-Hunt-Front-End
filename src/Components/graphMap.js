import React, { Component } from 'react';
import axios from 'axios';
import { data } from './data';
import CountdownTimer from 'react-component-countdown-timer';
import uuid from 'uuid';

class GraphMap extends Component {
    constructor(props){
        super()
    
        this.state = {
            cooldown: 0,
            inventory: [],
            next_room_id: null,
            room_data: {
                current_room_id: 0,
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
        }
    }



    componentDidMount() {
    this.getInit();
    }

    examineRoom = async name => {
        let data = {name}
    
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
        let data = { name };
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

    movement = async (move, next_room_id = null) => {
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
                <button
                    onClick={() =>
                        this.movement('n', data[this.state.room_data.current_room_id][1].n)
                    }
                >
                    North
                </button>
                <button
                    onClick={() =>
                    this.movement('s', data[this.state.room_data.current_room_id][1].s)
                    }
                >
                    South
                </button>
                <button
                    onClick={() =>
                        this.movement('w', data[this.state.room_data.current_room_id][1].w)
                    }
                >
                    West
                </button>
                <button
                    onClick={() =>
                        this.movement('e', data[this.state.room_data.current_room_id][1].e)
                    }
                >
                    East
                </button>
                <button onClick={() => this.examineRoom('player78')} >Examine #78</button>
                <button onClick={() => this.treasure_pickup('tiny treasure')}>
                    Take tiny treasure
                </button>
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
            </div>
        );
    }
}

export default GraphMap;