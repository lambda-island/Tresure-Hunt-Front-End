import React, { Component } from 'react';
import axios from 'axios';
class GraphMap extends Component {
    constructor(props){
        super()
    
        this.state = {
            cooldown: null,
            inventory: [],
            next_room_id: null,
            room_data: {
                current_room_id: null,
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
                terrain: '',
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
                messages: [],
            },
            examined: {}
        }
    }



    componentDidMount() {
    this.getData();
    }

    examineRoom = async (name) => {
        let data = {name}
    
        try {
            let res = await axios({
                method: 'post',
                url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/examine/`,
                headers: {
                    Authorization: 'Token 4b0963db718e09fbe815d75150d98d79d9a243bb'
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
                Authorization: 'Token 4b0963db718e09fbe815d75150d98d79d9a243bb'
                },
                data
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
                    terrain: res.data.terrain,
                }
            })
        
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
                <button onClick={() => this.movement('n')}>North</button>
                <button onClick={() => this.movement('s')}>South</button>
                <button onClick={() => this.movement('w')}>West</button>
                <button onClick={() => this.movement('e')}>East</button>
                <button onClick={() => this.examineRoom('player78')} >Examine #78</button>
            </div>
        );
    }
}

export default GraphMap;