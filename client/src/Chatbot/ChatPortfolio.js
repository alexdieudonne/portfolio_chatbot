import React, { useEffect,useState } from 'react';
import Axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { saveMessage } from '../_actions/message_actions';
import Message from './Sections/Message';
import { List, Icon, Avatar } from 'antd';
import Card from "./Sections/Card";
import { Widget,addResponseMessage, addUserMessage,renderCustomComponent } from 'react-chat-widget';
import './Sections/style.css'
import LisItems from './Sections/ListItems'
//import 'react-chat-widget/lib/styles.css';



function ChatPortfolio() {

    const dispatch = useDispatch();
    const messagesFromRedux = useSelector(state => state.message.messages)

    const handleNewUserMessage = (newMessage) => {
       // alert(`New message incoming! ${newMessage}`);
        // Now send the message throught the backend API
        textQuery(newMessage);
      };

    useEffect(() => {
       // renderMessage(messagesFromRedux);
        eventQuery("welcomeToMyWebsite");

    }, [])


    const textQuery = async (text) => {

        //  First  Need to  take care of the message I sent     
        let conversation = {
            who: 'user',
            content: {
                text: {
                    text: text
                }
            }
        }

        dispatch(saveMessage(conversation))
        // console.log('text I sent', conversation)

        // We need to take care of the message Chatbot sent 
        const textQueryVariables = {
            text
        }
        try {
            //I will send request to the textQuery ROUTE 
            const response = await Axios.post('/api/dialogflow/textQuery', textQueryVariables)

            for (let content of response.data.fulfillmentMessages) {

                conversation = {
                    who: 'bot',
                    content: content
                }

                dispatch(saveMessage(conversation))
            }


        } catch (error) {
            conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: " Error just occured, please check the problem"
                    }
                }
            }

            dispatch(saveMessage(conversation))


        }

    }


    const eventQuery = async (event) => {

        // We need to take care of the message Chatbot sent 
        const eventQueryVariables = {
            event
        }
        try {
            //I will send request to the textQuery ROUTE 
            const response = await Axios.post('/api/dialogflow/eventQuery', eventQueryVariables)
            for (let content of response.data.fulfillmentMessages) {

                let conversation = {
                    who: 'bot',
                    content: content
                }

                dispatch(saveMessage(conversation))
            }


        } catch (error) {
            let conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: " Error just occured, please check the problem"
                    }
                }
            }
            dispatch(saveMessage(conversation))
        }

    }


    const keyPressHanlder = (e) => {
        if (e.key === "Enter") {

            if (!e.target.value) {
                return alert('you need to type somthing first')
            }

            //we will send request to text query route 
            textQuery(e.target.value)


            e.target.value = "";
        }
    }



    const renderOneMessage = (message, i, value) => {
        //console.log('message', message)
       //const rowLen = state.length;
        // we need to give some condition here to separate message kinds 

        // template for normal text 
        if (message.content && message.content.text && message.content.text.text) {
            if (value === i + 1) {
                if(message.who == 'bot'){
                    if(message.content.text.text != ""){
                        addResponseMessage((message.content.text.text).toString())
                    }
                   
               }
           } 
            // return <Message key={i} who={message.who} text={message.content.text.text} />
        } else if (message.content && message.content.payload.fields.card) {

             //renderCustomComponent()
                const AvatarSrc = message.who === 'bot' ? <Icon type="robot" /> : <Icon type="smile" />
                if (value === i + 1) {
                    if(message.who == 'bot'){
                        return renderCustomComponent(LisItems , {...message})
                   }
                }
        }

        // template for card message 
    }



    const renderMessage = (returnedMessages) => {
        const poulet = returnedMessages.length;
        
        //setState(poulet)
        if (returnedMessages) {
            return returnedMessages.map((message, i) => {
                return renderOneMessage(message, i, poulet);
            })
        } else {
            return null;
        }
    }



    return (
    <div>
        <div>
        {renderMessage(messagesFromRedux)}
        </div>
        <Widget 
        title={"SAMY"}
        handleNewUserMessage={handleNewUserMessage}
        senderPlaceHolder={'Posez votre question...'}
        // fullScreenMode={true}
        subtitle={'Bonjour je m\'apelle Samy.'}
        />
    </div>
    )
}

export default ChatPortfolio;
