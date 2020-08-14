import React from 'react'
import { Card, Icon } from 'antd';

const { Meta } = Card;

function CardComponent(props) {
    return (
        <Card
            style={{ width: 350, margin:10}}
            cover={
                <img
                style={{height:140}}
                    alt={props.cardInfo.fields.description.stringValue}
                    src={props.cardInfo.fields.image.stringValue} />
            }
            actions={[
                <a target="_blank" rel="noopener noreferrer" href={props.cardInfo.fields.link.stringValue}>
                    <Icon type="ellipsis" key="ellipsis" />
                </a>
            ]}
        >
            <Meta
                title={props.cardInfo.fields.tittle.stringValue}
                description={props.cardInfo.fields.description.stringValue}
            />

        </Card>

    )
}

export default CardComponent
