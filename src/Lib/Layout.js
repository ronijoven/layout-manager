import React, { Component } from 'react';
import ReactDOM from "react-dom";
import './Css/styles.css';
import './Css/example-styles.css';

class Layout extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            layout: [] 
        }
    }

    onLayoutChange = layout => {
        this.setState({ layout: layout });
    };

    stringifyLayout() {
        return this.state.layout.map(function(l) {
          const name = l.i === "__dropping-elem__" ? "drop" : l.i;
          return (
            <div className="layoutItem" key={l.i}>
              <b>{name}</b>
              {`: [${l.x}, ${l.y}, ${l.w}, ${l.h}]`}
            </div>
          );
        });
    }

    render() {
        return (
            <div>
            <div className="layoutJSON">
                Displayed as <code>[x, y, w, h]</code>:
                <div className="columns">{this.stringifyLayout()}</div>
            </div>
            <Layout onLayoutChange={this.onLayoutChange} />
            </div>
        );
    }
}

export default Layout;
