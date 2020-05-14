import React, { Component } from 'react';
import { Form, Modal, Button, Container, Col } from "react-bootstrap";
import axios from "axios";
import { WidthProvider, Responsive } from "react-grid-layout";
import { generateDefault, getFromLS, saveToLS  } from '../Hooks/GridLayout';
import _ from "lodash";
import { MenuOptions, SystemVars } from "../Lib/Constants";
import { getUser } from '../Utils/Common';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

/**
 * This layout demonstrates how to use a grid with a dynamic number of elements.
 */

export default class Example4 extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    onLayoutChange: function() {},
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 30
  };

  constructor(props) {
    super(props);
    this.state = {
      snackMessage: "",
      layoutId: 0,
      layoutName: "",
      formModal: false,
      validated: false,
      mode:"",
      modalTitle:"",
      name:"",
      selectOptions: MenuOptions.Action, 
      mounted: false,
      items: [],
      /*items: [0, 1, 2, 3, 4].map(function(i, key, list) {
        return {
          i: i.toString(),
          x: i * 2,
          y: 0,
          w: 2,
          h: 2,
          add: i === (list.length - 1)
        };
      }),*/
      newCounter: 0
    };

    this.onAddItem = this.onAddItem.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleLayout = this.handleLayout.bind(this);
    this.ModalSaveDb = this.ModalSaveDb.bind(this);
    this.onLoadLayout = this.onLoadLayout.bind(this);
    this.onSaveLayout = this.onSaveLayout.bind(this);
    this.handleSnackbar = this.handleSnackbar.bind(this);
    
  }

  componentDidMount() {
    var user =  getUser();
    console.log("Init",this.state);
    
    //var Layouts = generateDefault();
    //console.log("Default",Layouts);
    //  , layouts : { lg: Layouts } });
    var parentData = {
       module: "dashboard",
       showHeader: true,
       userlogged: user.name
    };
    this.sendData(parentData);
    this.setState({ user: user, mounted: true},this.loadLayout("Default"));

  };

  loadLayout =  ( name ) => {
    var HOST = SystemVars.HOST;
    var url = HOST + '/layout/col';
    axios.get(url, {
        params: { dbname: "layout", col: "name", val: name }
      })
      .then(response => {
        var items = response.data[0].layouts.lg;
        console.log("Rest",items);
        this.setState({ 
          layoutId: items.Id,
          layoutName: items.name,
          items: items });
    });
  }

  sendData = (parentData) => {
    this.props.parentCallback(parentData);
  };

  handleSubmit = e => {
    e.preventDefault();
    var validate_count = 1; 
    var field_arr = ["name"];
    field_arr.forEach(function(item,index) {
      var obj = document.getElementById(item);
      if (obj.checkValidity()) {
        --validate_count;
      }
    })
    if (validate_count===0) {
      this.setState({ validated: false }, this.handleAction(e)) ;
    } else {
      this.setState({ validated:true });
    }
  }

  handleAction = () => {
    var mode = this.state.mode;
    var HOST = SystemVars.HOST;
    if (mode==="save") {
      var newLayout = {
        name:this.state.name,
        layouts: this.state.items
      };
      axios
        .post(HOST + `/layout`, newLayout)
        .then(
          response => {
            this.setState({ formModal: false });
            this.setState({ snackMessage: "Layout Added Successfully!" });
            this.handleSnackbar();
          }
        )
        .catch(err => {
          console.log(err);
          this.setState({ snackMessage: "Layout failed to save" });
          this.handleSnackbar();
        }
      );
    }
  }

  handleSnackbar = () => {
    var bar = document.getElementById("snackbar");
    bar.className = "show";
    setTimeout(function() {
      bar.className = bar.className.replace("show", "");
    }, 3000);
  }

  ModalSaveDb = () => {
    //var modalTitle = "";
    //if (mode==="add") modalTitle = "Add New Layout";
    //if (mode==="load") modalTitle = "Load Existing Layout";
    //if (mode==="save") modalTitle = "Save New Layout";
  
    this.setState({
      mode: "save",
      modalTitle: "Save New Layout",
      formModal: true
    });
  }

  handleLayout = e => {
    this.setState({ selectOptions: e.target.value });
  }
  handleName = e => {
    this.setState({ name: e.target.value });
  }
  onLoadLayout = () => {
    var ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
    console.log("LS",ls);
    var items = getFromLS("items");
    console.log(items);
    this.setState({ items });
  }
  onSaveLayout = () => {
    var items = this.state.items;
    saveToLS("items", items);
    var ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
    console.log("Saving LS",ls);
  }

  onAddItem() {
    /*eslint no-console: 0*/
    var def = "item";
    console.log("adding", "n" + this.state.newCounter);
    this.setState({
      // Add a new item. It must have a unique key!
      items: this.state.items.concat({
        i: this.state.newCounter,
        x: (this.state.items.length * 2) % (this.state.cols || 12),
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 1,
        t: def
      }),
      // Increment the counter to ensure key is always unique.
      newCounter: this.state.newCounter + 1
    },console.log("items", this.state.items));
  }

  // We're using the cols coming back from this to calculate where to add new items.
  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  }
  onLayoutChange = (layout, layouts) => {
    console.log("changed");
    this.props.onLayoutChange(layout, layouts);
    this.setState({ items: layouts });
  }

  onRemoveItem = (i) => {
    console.log("removing", i);
    this.setState({ items: _.reject(this.state.items, { i: i }) });
    console.log("Items after removing", this.state.items);
  }

  createElement(el) {
    const removeStyle = {
      position: "absolute",
      right: "2px",
      top: 0,
      cursor: "pointer"
    };
    const i = el.add ? "+" : el.i;
    return (
      <div key={i} data-grid={el}>
        {el.add ? (
          <span
            className="add text"
            onClick={this.onAddItem}
            title="You can add an item by clicking here, too."
          >
            Add +
          </span>
        ) : (
          <span className="text">{i}</span>
        )}
        <span
          className="remove"
          style={removeStyle}
          onClick={this.onRemoveItem.bind(this, i)}
        >
          x
        </span>
      </div>
    );
  }

  render() {
    const { selectOptions, mode, snackMessage,
      layoutId, layoutName
    } = this.state;

    return (
      <div>
        <Container>
      <div class="float-right"> 
        <span>Layout: Id ({layoutId}) Name ({layoutName})</span>
      </div>
      <div>
        <button onClick={this.onAddItem}>Add Item</button>
        <button onClick={this.onLoadLayout}>Reload</button>
        <button onClick={this.onSaveLayout}>Save</button>
        <button onClick={this.onLoadLayout}>Load Layout from DB</button>
        <button onClick={this.ModalSaveDb}>Update DB</button>
        <button onClick={this.ModalSaveDb}>Insert to DB</button>
        <ResponsiveReactGridLayout
          onLayoutChange={this.onLayoutChange}
          onBreakpointChange={this.onBreakpointChange}
          {...this.props}
        >
          {_.map(this.state.items, el => this.createElement(el))}

        </ResponsiveReactGridLayout>
        <Modal show={this.state.formModal} size="lg">
          <Modal.Header>
            <Modal.Title>Add Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
            <Form noValidate validated={this.state.validated}>
              <Form.Group controlId="name">
                <Form.Label>Layout Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Layout" onChange={this.handleName} required/>
                <Form.Control.Feedback type="invalid">
                    Please Enter Layout Name.
                </Form.Control.Feedback>
              </Form.Group>
              { mode==="load" && (
                  <Form.Group as={Col} controlId="select">
                  <Form.Label>Category</Form.Label>
                  <Form.Control as="select" defaultValue="" onChange={this.handleLayout} required>
                    <option value=''>Select Layout</option>
                      { selectOptions.map(( layout,index ) => {
                          return (
                            <React.Fragment key={ index }>
                              <option value={layout.id}>{layout.name}</option>
                            </React.Fragment>
                          );
                    })}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                     Please select Layout.
                  </Form.Control.Feedback>
              </Form.Group>
              )}
            </Form>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({ formModal: false })}>
              Close
            </Button>
            <Button onClick={this.handleSubmit}>Submit</Button>
          </Modal.Footer>
        </Modal>
        <div id="snackbar">{snackMessage}</div>
      </div>
      </Container>
      </div>
    );
  }
}

