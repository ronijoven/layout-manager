import React, { Component } from 'react';
import { getUser } from '../Utils/Common';
import { getFromLS, saveToLS  } from '../Hooks/GridLayout';
import RGL, { WidthProvider } from "react-grid-layout";

const ReactGridLayout = WidthProvider(RGL);
const originalLayout = getFromLS("layout") || [];

/**
 * This layout demonstrates how to sync to localstorage.
 */

class Example1 extends Component {
  static defaultProps = {
    className: "layout",
    cols: 12,
    rowHeight: 30,
    onLayoutChange: function() {}
  };

  constructor(props) {
    super(props);

    this.state = {
      items:[],
      layout: JSON.parse(JSON.stringify(originalLayout))
    };

    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.resetLayout = this.resetLayout.bind(this);
  }
  componentDidMount() {
    var user =  getUser();
    this.setState({ user: user});
    var parentData = {
       module: "dashboard",
       showHeader: true,
       userlogged: user.name
    };
    this.sendData(parentData);

  };
  sendData = (parentData) => {
    this.props.parentCallback(parentData);
  };
  resetLayout() {
    this.setState({
      layout: []
    });
  }

  onLayoutChange(layout) {
    /*eslint no-console: 0*/
    console.log("layout");
    saveToLS("layout", layout);
    this.setState({ layout });
    this.props.onLayoutChange(layout); // updates status display
  }
  onAddItem = () => {

  }
  render() {
    return (
      <div id="gridContainer">
        <button onClick={this.resetLayout}>Reset Layout</button>
        <button className="btn-small" onClick={this.onAddItem}><small>Add Item</small></button>
        <ReactGridLayout
          {...this.props}
          layout={this.state.layout}
          onLayoutChange={this.onLayoutChange}
        >          
        <div key="1" data-grid={{ w: 2, h: 3, x: 0, y: 0 }}>
            <span className="text">1</span>
          </div>
          <div key="2" data-grid={{ w: 2, h: 3, x: 2, y: 0 }}>
            <span className="text">2</span>
          </div>
          <div key="3" data-grid={{ w: 2, h: 3, x: 4, y: 0 }}>
            <span className="text">3</span>
          </div>
          <div key="4" data-grid={{ w: 2, h: 3, x: 6, y: 0 }}>
            <span className="text">4</span>
          </div>
          <div key="5" data-grid={{ w: 2, h: 3, x: 8, y: 0 }}>
            <span className="text">5</span>
          </div>
        </ReactGridLayout>
      </div>
    );
  }
}

export default Example1



