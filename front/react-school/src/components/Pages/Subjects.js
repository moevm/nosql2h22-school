import {Component, useState} from "react";
import * as React from 'react';
import Back from "../../helpers/api"


class Subjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      insert_mode: false,
      new_row: {}
    }
  }

  async componentDidMount() {
    await this.setState({
      data: await Back.getSubjects()
    })
  }

  render() {
    const headers = ['_id', 'name', 'teacher_id']
    return (
      <>
        <div style={{display: 'flex', justifyContent: 'center', margin: '40px', flexDirection: 'column'}}>
          <a href={'/'} className="text-center mb-5">Назад</a>
          <table className="table table-striped table-borderless table-hover text-center">
            <thead className="cf">
            <tr>
              {
                headers.map((header) => {
                  return (
                    <th>{header}</th>
                  )
                })
              }
            </tr>
            </thead>
            <tbody>
            {
              this.state.data.map((user) => {
                return (
                  <tr>
                    <td>{user['_id']['$oid']}</td>
                    <td>{user.name}</td>
                    <td>{user['teacher_id']['$oid']}</td>
                  </tr>
                )
              })
            }
            <tr hidden={this.state.insert_mode === false}>
              <td/>
              <td>
                <input
                  required={true}
                  className="form-control"
                  type="text"
                  onChange={
                    async (e) => {
                      await this.setState({
                        new_row: {
                          ...this.state.new_row,
                          name: e.target.value
                        }
                      })
                    }
                  }
                />
              </td>
              <td>
                <input
                  required={true}
                  className="form-control"
                  type="text"
                  onChange={
                    async (e) => {
                      await this.setState({
                        new_row: {
                          ...this.state.new_row,
                          teacher_id: e.target.value
                        }
                      })
                    }
                  }
                />
              </td>
            </tr>
            </tbody>
          </table>
          <button
            hidden={this.state.insert_mode === true}
            className="btn btn-block btn-primary"
            onClick={async () => {
              await this.setState({
                insert_mode: true
              })
            }}
          >
            Добавить
          </button>
          <button
            hidden={this.state.insert_mode === false}
            className="btn btn-block btn-primary"
            onClick={async () => {
              await Back.addSubject(this.state.new_row)
              window.location.reload()
            }}
          >
            Сохранить
          </button>
        </div>
      </>
    )
  }
}

export default Subjects;