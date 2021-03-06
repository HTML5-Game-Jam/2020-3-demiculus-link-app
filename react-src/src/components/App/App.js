import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import axios from 'axios';
import io from 'socket.io-client';

import TableUser from '../TableUser/TableUser';
import ModalUser from '../ModalUser/ModalUser';

import TableLink from '../TableLink/TableLink';
import ModalLink from '../ModalLink/ModalLink';

import logo from '../../logo.svg';
import './App.css';

class App extends Component {

  constructor() {
    super();

    this.server = process.env.REACT_APP_API_URL || '';
    this.socket = io.connect(this.server);

    this.state = {
      users: [],
      links: [],
      online: 0
    };

    this.fetchUsers = this.fetchUsers.bind(this);
    this.handleUserAdded = this.handleUserAdded.bind(this);
    this.handleUserUpdated = this.handleUserUpdated.bind(this);
    this.handleUserDeleted = this.handleUserDeleted.bind(this);

    this.fetchLinks = this.fetchLinks.bind(this);
    this.handleLinkAdded = this.handleLinkAdded.bind(this);
    this.handleLinkUpdated = this.handleLinkUpdated.bind(this);
      // this.handleUserDeleted = this.handleUserDeleted.bind(this);
  }

  // Place socket.io code inside here
  componentDidMount() {
    this.fetchUsers();
    this.fetchLinks();
    this.socket.on('visitor enters', data => this.setState({ online: data }));
    this.socket.on('visitor exits', data => this.setState({ online: data }));
    this.socket.on('add', data => this.handleUserAdded(data));
    this.socket.on('update', data => this.handleUserUpdated(data));
    this.socket.on('delete', data => this.handleUserDeleted(data));

    this.socket.on('add_link', data => this.handleLinkAdded(data));
    this.socket.on('update_link', data => this.handleLinkUpdated(data));
    // this.socket.on('delete_link', data => this.handleLinkDeleted(data));
  }

  // Fetch data from the back-end
  fetchLinks() {
    axios.get(`${this.server}/api/links/`)
        .then((response) => {
          this.setState({ links: response.data});
        })
        .catch((err) => {
          console.log(err);
        })
  }


  fetchUsers() {
    axios.get(`${this.server}/api/users/`)
    .then((response) => {
      this.setState({ users: response.data });
    })
    .catch((err) => {
      console.log(err);
    });
  }

    handleLinkAdded(link) {
      let links = this.state.links.slice();
      links.push(link);
      console.log(link)
      this.setState({links: links});
    }

    handleLinkUpdated(link) {
        let links = this.state.links.slice();
        for(let i = 0, n = links.length; i < n; i++) {
            if(links[i]._id === link._id) {
              links[i].url = link.url;
              links[i].type = link.type;
              links[i].tag = link.tag;
              break;
            }
        }
        this.setState({ links: links });
    }

    // handleLinkDeleted(link) {
    //     let links = this.state.links.slice();
    //     links = links.filter(l => { return l._id !== links._id; });
    //     this.setState({ links: links });
    // }

    handleUserAdded(user) {
    let users = this.state.users.slice();
    users.push(user);
    this.setState({ users: users });
    }

  handleUserUpdated(user) {
    let users = this.state.users.slice();
    for (let i = 0, n = users.length; i < n; i++) {
      if (users[i]._id === user._id) {
        users[i].name = user.name;
        users[i].email = user.email;
        users[i].age = user.age;
        users[i].gender = user.gender;
        break; // Stop this loop, we found it!
      }
    }
    this.setState({ users: users });
  }

  handleUserDeleted(user) {
    let users = this.state.users.slice();
    users = users.filter(u => { return u._id !== user._id; });
    this.setState({ users: users });
  }

  render() {

    let online = this.state.online;
    let verb = (online <= 1) ? 'is' : 'are'; // linking verb, if you'd prefer
    let noun = (online <= 1) ? 'person' : 'people';

    return (
      <div>
        <div className='App'>
          <div className='App-header'>
            <img src={logo} className='App-logo' alt='logo' />
            <h1 className='App-intro'>Gemmer</h1>
            <p>A social bookmarking experience, with a time-backed currency twist.</p>
          </div>
        </div>
        <Container>
          <ModalUser
            headerTitle='Add User'
            buttonTriggerTitle='Add New'
            buttonSubmitTitle='Add'
            buttonColor='green'
            onUserAdded={this.handleUserAdded}
            server={this.server}
            socket={this.socket}
          />
          <em id='online'>{`${online} ${noun} ${verb} online.`}</em>
          <TableUser
            onUserUpdated={this.handleUserUpdated}
            onUserDeleted={this.handleUserDeleted}
            users={this.state.users}
            server={this.server}
            socket={this.socket}
          />
        </Container>
        <Container>
          <ModalLink
            headerTitle='Add Link'
            buttonTriggerTitle='Add New Link'
            buttonSubmitTitle='Add'
            buttonColor='green'
            onLinkAdded={this.handleLinkAdded}
            server={this.server}
            socket={this.socket}
          />
            <em id='online'>{`${online} ${noun} ${verb} online.`}</em>
          <TableLink
            onLinkUpdated={this.handleLinkUpdated}
            // onLinkDeleted={this.handleLinkDeleted}
            links={this.state.links}
            server={this.server}
            socket={this.socket}
          />
        </Container>
        <br/>
      </div>
    );
  }
}

export default App;
