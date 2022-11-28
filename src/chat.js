import React, { Component } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nick: '',
      message: '',
      messages: [],
      hubConnection: null,
    };
  }

  componentDidMount = () => {
    const nick = window.prompt('Your name:', 'John');
    const _myAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVSWQiOiI2MzUzZmU4NDc3MDQ3YzI5NTY5Y2IzYmIiLCJSb2xlcyI6IltcIlVzZXJcIixcIlN0b3JlX093bmVyXCJdIiwibmJmIjoxNjY3NjU2NTA4LCJleHAiOjE2Njc2NzQ1MDgsImlhdCI6MTY2NzY1NjUwOH0.OEEWOh-RSZTgVSRZy8RkpR2xciG_-IaEGiCun7W2318"
        // const url = 'https://localhost:7295/notifysocket';
    const url = "https://localhost:7104/notifysocket"
    const hubConnection = new HubConnectionBuilder().withUrl(url, 
    {
      accessTokenFactory: () => _myAccessToken
    }).build();    
    
    this.setState({ hubConnection, nick }, () => {
      this.state.hubConnection
        .start()
        .then(() => {
          console.log(hubConnection)
          console.log('Connection started!')
        })
        .catch(err => {
          console.log('Error while establishing connection :(');
          console.log(hubConnection);
        });

      this.state.hubConnection.on('sendToUser', (nick, receivedMessage) => {
        console.log("Hhahaha");
        const text = `${nick}: ${receivedMessage}`;
        const messages = this.state.messages.concat([text]);
        this.setState({ messages });
      });
    //   this.state.hubConnection.on('ReceiveOne', (nick, receivedMessage) => {
    //     console.log("Hhahaha");
    //     const text = `${nick}: ${receivedMessage}`;
    //     const messages = this.state.messages.concat([text]);
    //     this.setState({ messages });
    //   });
    });
    };

    sendMessage = () => {
        this.state.hubConnection
        .invoke('sendToAll', this.state.nick, this.state.message)
        .catch(err => console.error(err));

        this.setState({message: ''});      
    };


  render() {
    return (
      <div>
        <br />
        <input
          type="text"
          value={this.state.message}
          onChange={e => this.setState({ message: e.target.value })}
        />

        <button onClick={this.sendMessage}>Send</button>

        <div>
          {this.state.messages.map((message, index) => (
            <span style={{display: 'block'}} key={index}> {message} </span>
          ))}
        </div>
      </div>
    );
  }
}

export default Chat;