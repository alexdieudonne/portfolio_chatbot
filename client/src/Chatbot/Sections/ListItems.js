import React, { Component } from 'react';
import { Widget, addResponseMessage, renderCustomComponent, addUserMessage } from 'react-chat-widget';
import Card from "../Sections/Card";
import { List, Icon, Avatar } from 'antd';

class ListItems extends Component {

    constructor(props) {
        super(props);
    }
    // componentDidMount(){
    //     console.log(this.props);
    // }
     renderCards = (cards) => {
        return cards.map((card,i) => <Card key={i} cardInfo={card.structValue} />)
    }
    render() {
        return (
            <div>
                        <List.Item style={{ padding: '1rem' }}>
                            <List.Item.Meta
                            style={{width:'20rem'}}
                                description={this.renderCards(this.props.content.payload.fields.card.listValue.values)}
                            />
                        </List.Item>
            </div>)
    }
}

export default ListItems;