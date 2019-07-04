import React, { Component } from "react";
import Breadcumps from "../../breadcumps";
import Table from "../../Table";
import TableWrapper from "../../TableWrappper";
import Wrapper from "../../wrapper";
import swal from "sweetalert";

class ClaimTypes extends Component {
  constructor() {
    super();
    this.state = {
      ClaimTypes: [],
      TypeCode: "001",
      Category: "Category",
      TypeName: "TypeName"
    };
  }

  handleclick = e => {
    e.preventDefault();
    if (this.state.reseter === false) {
      this.setState({ reseter: true });
    } else {
      this.setState({ reseter: false });
    }
  };
  handleStateReset() {
    this.setState({
      CostCenter: "001",
      AgentCode: "A001",
      AgentName: "steve",
      AgentAddress: "Nairobi",
      City: "Nairobi",
      Telephone: "0",
      Mobile: "0",
      Email: "email@email.com",
      Occupation: "Occupation",
      ContactPerson: "0",
      Group: "0"
    });
  }
  fetchData = () => {
    fetch("api/ClaimTypes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(ClaimTypes => {
        if (ClaimTypes.length > 0) {
          this.setState({ ClaimTypes });
        } else {
          swal("Oops!", ClaimTypes.message, "error");
        }
      })
      .catch(err => {
        swal("Oops!", err.message, "error");
      });
  };

  handleInputChange = event => {
    // event.preventDefault();
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

  handleSelectChange = (County, actionMeta) => {
    this.setState({ [actionMeta.name]: County.value });
  };

  handleDelete = agents => {
    swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this record?",
      icon: "warning",
      dangerMode: false
    }).then(willDelete => {
      if (willDelete) {
        return fetch("api/agents/" + agents.AgentCode, {
          method: "Delete",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
          }
        })
          .then(response =>
            response.json().then(data => {
              if (data.success) {
                swal("Deleted!", "Record has been deleted!", "success");
              } else {
                swal("error!", data.message, "error");
              }
              this.fetchData();
            })
          )
          .catch(err => {
            swal("Oops!", err.message, "error");
          });
      }
    });
  };
  handleEdit = agent => {
    const data = {
      Agents: [],
      CostCenter: agent.CostCenter,
      AgentCode: agent.AgentCode,
      AgentName: agent.AgentName,
      AgentAddress: agent.AgentAddress,
      City: agent.City,
      Telephone: agent.Telephone,
      Mobile: agent.Mobile,
      Email: agent.Email,
      Occupation: agent.Occupation,
      ContactPerson: agent.ContactPerson,
      Group: agent.Group
    };
    this.setState(data);
    this.setState({ reseter: true });
  };
  handleSubmit = event => {
    event.preventDefault();
    const data = {
      TypeCode: this.state.TypeCode,
      Category: this.state.Category,
      TypeName: this.state.TypeName
    };
    console.log(data);
    this.postData("api/ClaimTypes", data);
  };
  postData(url = ``, data = {}) {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify(data)
    })
      .then(response =>
        response.json().then(data => {
          this.fetchData();

          if (data.success) {
            this.handleStateReset();
            swal("Saved!", "Record has been saved!", "success");
          } else {
            swal("Saved!", data.message, "error");
          }
        })
      )
      .catch(err => {
        swal("Oops!", err.message, "error");
      });
  }
  componentDidMount() {
    this.fetchData();
    // this.fetchCounty();
    /// this.fetchCurrency();
    // this.fetchCountries();
  }

  render() {
    const ColumnData = [
      {
        label: "TypeCode",
        field: "TypeCode",
        sort: "asc",
        width: 250
      },

      {
        label: "Category",
        field: "Category",
        sort: "asc",
        width: 200
      },
      {
        label: "TypeName",
        field: "TypeName",
        sort: "asc",
        width: 200
      }
    ];
    let Rowdata1 = [];
    const Rows = [...this.state.ClaimTypes];

    if (Rows.length > 0) {
      Rows.map((k, i) => {
        let Rowdata = {
          TypeCode: k.TypeCode,
          Category: k.Category,
          TypeName: k.TypeName,
          action: (
            <span>
              {" "}
              <a
                style={{ color: "#007bff" }}
                onClick={e => this.handleEdit(k, e)}>
                Edit
              </a>
              |{" "}
              <a
                style={{ color: "#007bff" }}
                onClick={e => this.handleDelete(k, e)}>
                {" "}
                Delete
              </a>
            </span>
          )
        };
        Rowdata1.push(Rowdata);
      });
    }

    if (this.state.reseter) {
      return (
        <div>
          <Breadcumps
            tablename={"Add Claim Type"}
            button={
              <button
                to='/'
                type='button'
                style={{ marginTop: 40 }}
                onClick={this.handleclick}
                className='btn btn-primary float-left'>
                Go Back
              </button>
            }
          />

          <Formdata
            Values={this.state}
            handleSubmit={this.handleSubmit}
            handleInputChange={this.handleInputChange}
            handleSelectChange={this.handleSelectChange}
            Collections={this.state}
          />
        </div>
      );
    } else {
      return (
        <div>
          <Breadcumps
            tablename={"Claim Type list"}
            button={
              <button
                type='button'
                style={{ marginTop: 40 }}
                onClick={this.handleclick}
                className='btn btn-primary float-left'>
                Create New
              </button>
            }
          />
          <TableWrapper>
            <Table Rows={Rowdata1} columns={ColumnData} />
          </TableWrapper>
        </div>
      );
    }
  }
}
const Formdata = props => {
  return (
    <div className='container-fluid'>
      <div className='col-sm-12'>
        <div className='ibox '>
          <div className='ibox-title'>
            <div className='ibox-tools'>
              <a className='close-link'>
                <i className='fa fa-times' />
              </a>
            </div>
          </div>
          <div className='ibox-content'>
            <form onSubmit={props.handleSubmit}>
              <div className=' row'>
                <div className='col-sm'>
                  <div className='form-group'>
                    <label htmlFor='TypeCode'>TypeCode</label>
                    <input
                      type='text'
                      name='TypeCode'
                      value={props.Values.TypeCode}
                      onChange={props.handleInputChange}
                      className='form-control'
                      id='exampleInputEmail1'
                      aria-describedby='emailHelp'
                      placeholder='Enter TypeCode'
                      required
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='Category'>Category</label>
                    <input
                      type='text'
                      name='Category'
                      required
                      value={props.Values.Category}
                      className='form-control'
                      onChange={props.handleInputChange}
                      id='Category'
                      aria-describedby='AgentNameHelp'
                      placeholder='Enter Category name'
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='TypeName'>TypeName</label>
                    <input
                      type='text'
                      name='TypeName'
                      required
                      value={props.Values.TypeName}
                      className='form-control'
                      onChange={props.handleInputChange}
                      id='TypeName'
                      aria-describedby='CityHelp'
                      placeholder='Enter TypeName'
                    />
                  </div>
                </div>
              </div>
              <button type='submit' className='btn btn-primary'>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimTypes;
