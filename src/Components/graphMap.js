import React, { Component } from 'react';
import axios from 'axios';
class GraphMap extends Component {
    componentDidMount() {
    this.getData();
    }

    getData = async () => {
        try {
            let res = await axios({
                url: 'https://lambda-treasure-hunt.herokuapp.com/api/adv/init/',
                method: 'get',
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

            return res.data;
        } catch (err) {
            console.error(err);
        }
    };

    render() {
        return <div />;
    }
}

export default GraphMap;