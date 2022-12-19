import {Component, useState} from "react";
import * as React from 'react';
import Back from "../../helpers/api"


class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      insert_mode: false,
      new_row: {
        personal_info: {},
        type: 'teacher'
      }
    }
  }

  async componentDidMount() {
    await this.setState({
      data: await Back.getUsers()
    })
  }

  render() {
    const headers = ['_id', 'parent_id', 'user_name', 'password', 'type']
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
                    <td>{user['parent_id'] ? user['parent_id']['$oid'] : ''}</td>
                    <td>{user.user_name}</td>
                    <td>{user.password}</td>
                    <td>{user.type}</td>
                  </tr>
                )
              })
            }
            <tr hidden={this.state.insert_mode === false}>
              <td/>
              <td>
                <input
                  className="form-control"
                  type="text"
                  onChange={
                    async (e) => {
                      await this.setState({
                        new_row: {
                          ...this.state.new_row,
                          parent_id: e.target.value
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
                          username: e.target.value
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
                          password: e.target.value
                        }
                      })
                    }
                  }
                />
              </td>
              <td>
                <select
                  defaultValue="teacher"
                  className="form-control form-control-sm"
                  onChange={
                    async (e) => {
                      await this.setState({
                        new_row: {
                          ...this.state.new_row,
                          type: e.target.value
                        }
                      })
                    }
                  }
                >
                  <option value="teacher">Учитель</option>
                  <option value="parent">Родитель</option>
                  <option value="student">Студент</option>
                  <option value="admin">Админ</option>
                </select>
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
              await Back.addUser(this.state.new_row)
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

export default Users;