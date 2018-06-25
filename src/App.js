import React, { Component } from 'react';
import { say } from 'cowsay';
import './App.css';

class Cowsay extends Component {
  render() {
    return (
      <pre>
        { say({ text: this.props.say }) }
      </pre>
    );
  }
}

class Fortune extends Component {
  render() {
    return (
      <pre>
        { this.props.text }
      </pre>
    );
  }
}

class Help extends Component {
  render() {
    return (
      <ul>
        <li><strong>cowsay TEXT</strong> - amazing magic cow speaks the text</li>
        <li><strong>fortune</strong> - random fortune message</li>
      </ul>
    );
  }
}

class PrevContent extends Component {
  render() {
    return (
      <div>
        <br />
        <span>hello@stranger > { this.props.value }</span>
        <br />
        { this.props.content }
      </div>
    );
  }
}

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      prevContent: []
    };
    this._handleKeyPress = this._handleKeyPress.bind(this);
  }

  _handleKeyPress(event){
    if (/[a-zA-Z0-9 |!?]/.test(event.key) && event.key.length === 1) {
      this.setState({ value: this.state.value + event.key });
    } else if (event.key === 'Backspace') {
      this.setState({ value: this.state.value.slice(0, -1) });
    }
    if (event.key === 'Enter') {
      if (/^cowsay \w/.test(this.state.value)) {
        this.state.prevContent.push(
          <PrevContent key={ this.state.prevContent.length + 1 }
            value={ this.state.value }
            content={ <Cowsay say={ this.state.value.slice(7, this.state.value.length) } /> } />
        );
      } else if (/^fortune/.test(this.state.value)) {
        fetch('https://happyukgo.com/api/fortune/')
          .then(response => response.json())
          .then(data => {
            this.state.prevContent.push(
              <PrevContent key={ this.state.prevContent.length + 1 }
                value={ this.state.value }
                content={ /^fortune \| cowsay/.test(this.state.value) ? <Cowsay say={ data } /> : <Fortune text={ data } /> } />
            );
            this.setState({
              prevContent: this.state.prevContent,
              value: ''
            });
          });
      } else if (this.state.value === 'clear') {
        this.setState({
          prevContent: [],
          value: ''
        });
      } else if (this.state.value === 'help') {
        this.state.prevContent.push(
          <PrevContent key={ this.state.prevContent.length + 1 }
            value={ this.state.value }
            content={ <Help /> } />
        );
      } else {
        this.state.prevContent.push(
          <PrevContent key={ this.state.prevContent.length + 1 }
            value={ this.state.value }
            content={ <span>Error: unknown command</span> } />
        );
      }
      if (!/^fortune/.test(this.state.value)) {
        this.setState({
          prevContent: this.state.prevContent,
          value: ''
        });
      }
    }
  }

  componentWillMount() {
    document.addEventListener("keydown", this._handleKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyPress, false);
  }

  render() {
    return (
      <span className="cursor">
        { this.state.prevContent.map(item => item) }
        <span>hello@stranger > { this.state.value }</span>
        <span className="blinking-cursor">_</span>
      </span>

    );
  }
}

class Terminal extends Component {
  render() {
    return (
      <div className="terminal-window">
        <header>
          <div className="button red"></div>
          <div className="button yellow"></div>
          <div className="button green"></div>
        </header>
        <div className="terminal">
          <Input />
        </div>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
        <div className="App">
          <Terminal />
        </div>
    );
  }
}

export default App;
