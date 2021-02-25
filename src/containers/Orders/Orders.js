import React, { Component } from 'react';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class Orders extends Component {
    state = {
        orders: [],
        loading: true
    }

    componentDidMount() {
        axios.get('/orders.json')
            .then(res => {
                const fetchedOrders = [];
                // const fetch2 =[];
                // const fetch3 =[];
                console.log("res data: ", res.data);
                for (let key in res.data) {
                   // fetch2.push(res.data[key]);
                    fetchedOrders.push({
                        ...res.data[key],
                        id: key
                    });
                    // fetch3.push({
                    //     order: res.data[key],
                    //     id: key
                    // });
                }
                console.log("fetch1: ", fetchedOrders);
                // console.log("fetch2: ", fetch2);
                // console.log("fetch3: ", fetch3);

                this.setState({loading: false, orders: fetchedOrders});
            })
            .catch(err => {
                this.setState({loading: false});
            });
    }

    render () {
        return (
            <div>
                {this.state.orders.map(order => (
                    <Order 
                        key={order.id}
                        ingredients={order.ingredients}
                        price={order.price} />
                ))}
            </div>
        );
    }
}

export default withErrorHandler(Orders, axios);