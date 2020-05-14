import React, { Component } from 'react';
import { Form, Modal, Button, Container, Col } from "react-bootstrap";
import axios from "axios";
import { getUser } from '../Utils/Common';
import { generateDefault, getFromLS, saveToLS  } from '../Hooks/GridLayout';
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import { MenuOptions, SystemVars } from "../Lib/Constants";
import '../Css/styles-1.css';
import "../Css/styles-2.css";
//import "/node_modules/react-resizable/css/styles.css";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Dashboard extends Component {
  static defaultProps = {
    className: "layout",
    rowHeight: 30,
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
//    layout: {t: "string", i: "string", x: "number", y: "number", w: "number", h: "number"},
    onLayoutChange: function() {},
  };

  constructor(props) {
    super(props);
    this.state = {
      snackMessage: "",
      formModal: false,
      validated: false,
      btnOkLabel: "", 
      btnCancelLabel: "",
      layoutId: 0,
      layoutName: "",
      mode:"",
      modalTitle:"",
      name:"",
      selectedLayout: null,
      currentLayout: [],
      selectOptions: [], 
      selectSize: [],
      selectedSize: null,
      currentBreakpoint: "lg",
      compactType: "vertical",
      mounted: false,
      layouts: { lg: [], md: [], sm: [] },
    };

    this.handleName = this.handleName.bind(this);
    this.handleLayout = this.handleLayout.bind(this);
    this.ModalSaveDb = this.ModalSaveDb.bind(this);
    this.handleSnackbar = this.handleSnackbar.bind(this);
    this.onClickItem = this.onClickItem.bind(this);
    this.handleAutoGenerate = this.handleAutoGenerate.bind(this);
    this.handleSize = this.handleSize.bind(this);
    this.onAddItem = this.onAddItem.bind(this);

  }

  componentDidMount() {
    var user =  getUser();
    //  , layouts : { lg: Layouts } });
    var parentData = {
       module: "dashboard",
       showHeader: true,
       userlogged: user.name
    };
    console.log(MenuOptions);
    this.sendData(parentData);
    this.setState({ 
      user: user,
      selectSize : MenuOptions.Sizes
     }, this.loadLayout("Default"));

  };

  loadLayout =  ( name ) => {
    var HOST = SystemVars.HOST;
    var url = HOST + '/layout';
    axios.get(url, {
        params: { dbname: "layout", col: "name", val: name }
      })
      .then(response => {
        var result = response.data;
        console.log("Rest",result);
        this.setState({ selectOptions: result },this.getDefaultLayout(result));
    });
  }

  getDefaultLayout = (result) => {
    var def = "Default";
    var currentBreakpoint = this.state.currentBreakpoint;
    var arr = result.filter(function (name) { return name.name === def });
    console.log("getting Default",currentBreakpoint, arr[0].layouts);
    console.log("Layouts",arr[0].layouts[currentBreakpoint]);

    this.setState({ 
      mounted: true,
      currentLayout: arr[0].layouts[currentBreakpoint],
      layoutId: arr[0].id,
      layoutName: arr[0].name,
      layouts: arr[0].layouts 
    });
  }

  sendData = (parentData) => {
    this.props.parentCallback(parentData);
  }
  onAddItem() {
    /*eslint no-console: 0*/
    var def = "item";
    var curr_layout = [];
    var layouts = this.state.layouts;
    var currentBreakpoint = this.state.currentBreakpoint;
    if (currentBreakpoint==="lg")  curr_layout = layouts.lg;
    if (currentBreakpoint==="md")  curr_layout = layouts.md;
    if (currentBreakpoint==="sm")  curr_layout = layouts.sm;
    if (currentBreakpoint==="xs")  curr_layout = layouts.xs;

    var newCounter = curr_layout.length();
    curr_layout.concat({
      i: ++newCounter,
      x: (newCounter * 2) % (this.state.cols || 12),
      y: Infinity, // puts it at the bottom
      w: 2,
      h: 1,
      t: def
    });
    layouts = {
      lg: currentBreakpoint==="lg" ? curr_layout : layouts.lg,
      md: currentBreakpoint==="md" ? curr_layout : layouts.lg,
      sm: currentBreakpoint==="sm" ? curr_layout : layouts.lg,
    };
    this.setState({layouts},console.log("added new ayouts", this.state.layouts));
  }
  handleSubmit = e => {
    e.preventDefault();
    var mode=this.state.mode;
    var validate_count = 1;
    var field_arr = [];
    console.log("mode",mode);
    if (mode==="save") {
      validate_count = 1; 
      field_arr = ["name"];
    }
    if (mode==="update") {
      validate_count = 1; 
      field_arr = ["selectsizes"];
    }
    if (mode==="load") {
      validate_count = 1; 
      field_arr = ["selectlayout"];
    }
    console.log("field_arr",field_arr);

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
  handleAction = (e) => {
    var mode = this.state.mode;
    var HOST = SystemVars.HOST;
    if (mode==="save") {
      var currentLayout = this.state.currentLayout;
      var layouts = this.state.layouts;

      var breakpoint = this.state.currentBreakpoint;
      /* process w, h, x, y from layouts[currentBreakpoint] and 
        replace the array in currentLayout */
      currentLayout=  this.updateLayoutElements(layouts[breakpoint],currentLayout);
      var newLayout = {
        size: this.state.currentBreakpoint,
        name: this.state.name,
        layout: currentLayout
      };
      console.log("Loaded",this.state.currentLayout,this.state.layouts);
      console.log("For Insert Saving",this.state.currentBreakpoint,newLayout);

      axios
        .post(HOST + `/layout`, newLayout)
        .then(
          response => {
            this.setState({ 
              formModal: false, 
              snackMessage: "Layout Added Successfully!"  }
            ,this.handleSnackbar());
          }
        )
        .catch(err => {
          console.log(err);
          this.setState({ snackMessage: "Layout failed to save" });
          this.handleSnackbar();
        }
      ); 
    }
    if (mode==="load") {
       console.log("selected",this.state.selectedLayout);
       var currentBreakpoint = this.state.currentBreakpoint;
       var selectOptions = this.state.selectOptions;
       var selectedLayout = this.state.selectedLayout;
       var newlayout = selectOptions[selectedLayout];
       console.log("Layout Selected", newlayout);
       this.setState({ snackMessage: "Layout Loaded Successfully!" });
       this.handleSnackbar();
       this.setState({ 
         layoutId: newlayout.id,
         layoutName: newlayout.name,
         formModal: false, 
         layouts: newlayout.layouts,
         currentLayout: newlayout.layouts[currentBreakpoint]

        });

    }
    if (mode==="update") {
      var currentLayout = this.state.currentLayout;
      var layouts = this.state.layouts;
      var breakpoint = this.state.currentBreakpoint;
      /* process w, h, x, y from layouts[currentBreakpoint] and 
        replace the array in currentLayout */
      currentLayout=  this.updateLayoutElements(layouts[breakpoint],currentLayout);
      console.log("Updated",breakpoint,currentLayout);
      var params = {
        id: this.state.layoutId,
        size: this.state.selectedSize,
        name:this.state.layoutName,
        layout: this.state.currentLayout
      };
      console.log("For Saving",params);
      
      axios
        .put(HOST + `/layout`, params )
        .then(
          response => {
            this.setState({ formModal: false });
            this.setState({ snackMessage: "Layout Updated Successfully!" });
            this.handleSnackbar();
          }
        )
        .catch(err => {
          console.log(err);
          this.setState({ snackMessage: "Layout Update failed to save" });
          this.handleSnackbar();
        }
      ); 
    }
  }

  updateLayoutElements = function(thelayout, current) {
      thelayout.map(( item,index ) => {
        current[index].x=item.x;
        current[index].y=item.y;
        current[index].w=item.w;
        current[index].h=item.h;
      });
      return current
  }
;
  handleSnackbar = () => {
    var bar = document.getElementById("snackbar");
    bar.className = "show";
    setTimeout(function() {
      bar.className = bar.className.replace("show", "");
    }, 3000);
  }
  ModalSaveDb = () => {
    var layoutName =  this.state.layoutName;
    this.setState({
      mode: "update",
      modalTitle: "Update "+layoutName+" Layout",
      btnOkLabel: "Yes", 
      btnCancelLabel: "No",
      formModal: true
    });
  }
  ModalInsertDb = () => { 
    this.setState({
      mode: "save",
      modalTitle: "Save New Layout",
      btnOkLabel: "Save", 
      btnCancelLabel: "Cancel",
      formModal: true
    });
  }
  ModalLoadDb = () => { 
    this.setState({
      mode: "load",
      modalTitle: "Load Layout",
      btnOkLabel: "Ok", 
      btnCancelLabel: "Cancel",
      formModal: true
    });
  }
  onBreakpointChange = breakpoint => {
    console.log("Breakpoint",breakpoint);
    this.setState({
      currentBreakpoint: breakpoint
    });
  }
  onCompactTypeChange = () => {
    const { compactType: oldCompactType } = this.state;
    const compactType =
      oldCompactType === "horizontal" ? "vertical"
        : oldCompactType === "vertical" ? null : "horizontal";
    this.setState({ compactType });
  }
  onLayoutChange = (layout, layouts) => {
    //console.log("Changed",this.state.currentBreakpoint,layouts);
    this.props.onLayoutChange(layout, layouts);
    this.setState({ layouts });
  }
  onRemoveItem = (i) => {
    console.log("removing", i);
    this.setState({ items: _.reject(this.state.items, { i: i }) });
    console.log("Items after removing", this.state.items);
  }
  handleAutoGenerate = () => {
  }
  handleSize = e => {
    this.setState({ selectedSize: e.target.value });
    console.log("selectedSize",e.target.value);
  }
  handleLayout = e => {
    this.setState({ selectedLayout: e.target.value });
  }
  handleName = e => {
    this.setState({ name: e.target.value });
  }
  onLoadLayout = () => {
    console.log("currentBreakpoint",this.state.currentBreakpoint);
    var layouts = getFromLS("layouts");
    console.log(layouts);
    this.setState({ layouts : layouts });
  }
  onSaveLayout = () => {
    var layouts = this.state.layouts;
    saveToLS("layouts", layouts);
    var ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
    console.log("Saving",ls);

  }
  onClickItem = (e) => {
    console.log("clicked");
  }
  onDrop = elemParams => {
    var def="item"
    var newlayout = this.state.layouts;
    var count = newlayout.lg.length;
    var newelement = {
        i: count.toString(),
        x: elemParams.x,
        y: elemParams.y,
        w: 1,
        h: 2,
        t: def,
        static:false
    };
    console.log("Pre",newlayout);
    newlayout.lg.push(newelement);
    this.setState({ layouts : newlayout });
    console.log("Now",count,newlayout);
    alert(`Element parameters:\n${JSON.stringify(elemParams, ['x', 'y', 'w', 'h'], 2)}`);
  };
  createElement = (el) => {
    //console.log("ele",el);
    var removeStyle = {
      position: "absolute",
      right: "2px",
      top: 0,
      cursor: "pointer"
    };
    return (
      <div key={el.i} className="">
        <span className="text">{el.t}</span>
        <span
          className="remove"
          style={removeStyle}
          onClick={this.onRemoveItem.bind(this, el.i)}
        >
          x
        </span>
      </div>
    );
  }
  
  render() {
    const { selectSize, selectOptions, mounted, currentLayout, mode, snackMessage, currentBreakpoint,
      layoutId, layoutName, modalTitle,  btnOkLabel, btnCancelLabel
    } = this.state;
    console.log("currentLayout",currentLayout);
    console.log("layouts",this.state.layouts);
    return (
      <div>
      <div class="float-right"> 
        <span>Layout: Id ({layoutId}) Name ({layoutName})</span>
      </div>        <div>
          Current Breakpoint: {currentBreakpoint} (
          {this.props.cols[currentBreakpoint]} columns)
        </div>
        <div>
          Compaction type:{" "}
          {_.capitalize(this.state.compactType) || "No Compaction"}
        </div>
        <div>
          <button onClick={this.onAddItem}>Add Item</button>
          <button onClick={this.onLoadLayout}>Reload</button>
          <button onClick={this.onSaveLayout}>Save Layout</button>
          <button onClick={this.ModalLoadDb}>Load Layout from DB</button>
          <button onClick={this.ModalSaveDb}>Update DB</button>
          <button onClick={this.ModalInsertDb}>Insert to DB</button>
          <button onClick={this.onCompactTypeChange}>
            Change Compaction Type
          </button>
        </div>
        <div className="droppable-element" draggable={true} unselectable="on"
          onDragStart={e => e.dataTransfer.setData("text/plain", "")}
        >Categories
        </div>
        <ResponsiveReactGridLayout
          {...this.props}
          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          onDrop={this.onDrop}
          onClick={this.onClickItem}
          autoSize={true}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}
          compactType={this.state.compactType}
          preventCollision={!this.state.compactType}
          isDroppable={true}
        >

          {_.map(currentLayout, el => this.createElement(el))}

        </ResponsiveReactGridLayout>
        <Modal show={this.state.formModal} size="lg">
          <Modal.Header>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
            <Form noValidate validated={this.state.validated}>
              { (mode==="update" ) && (
              <Form.Group as={Col} controlId="selectsizes">
                <Form.Label>Layout</Form.Label>
                <Form.Control as="select" defaultValue="" onChange={this.handleSize} required>
                  <option value=''>Select Sizes</option>
                    { selectSize.map(( size,index ) => {
                        return (
                          <React.Fragment key={ index }>
                            <option value={size.id}>{size.desc}</option>
                          </React.Fragment>
                        );
                  })}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                    Please select Size.
                </Form.Control.Feedback>
              </Form.Group>
              )}
              
              { mode==="save" && (
              <Form.Group controlId="name">
                <Form.Label>Layout Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Layout" onChange={this.handleName} required/>
                <Form.Control.Feedback type="invalid">
                    Please Enter Layout Name.
                </Form.Control.Feedback>
              </Form.Group>
              )}
              { mode==="load" && (
                  <Form.Group as={Col} controlId="selectlayout">
                  <Form.Label>Layout</Form.Label>
                  <Form.Control as="select" defaultValue="" onChange={this.handleLayout} required>
                    <option value=''>Select Layout</option>
                      { selectOptions.map(( layout,index ) => {
                          return (
                            <React.Fragment key={ index }>
                              <option value={index}>{layout.name}</option>
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
              {btnCancelLabel}
            </Button>
            <Button onClick={this.handleSubmit}>{btnOkLabel}</Button>
          </Modal.Footer>
        </Modal>
        <div id="snackbar">{snackMessage}</div>
      </div>
    );
  }
}

export default Dashboard