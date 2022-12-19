import {Component, useState} from "react";
import * as React from 'react';
import Back from "../../helpers/api"


class Journal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      insert_mode: false,
      new_row: {
        work: {},
        mark: 5
      }
    }
  }

  async componentDidMount() {
    await this.setState({
      data: await Back.getJournal()
    })
  }

  render() {
    const headers = ['_id', 'student_id', 'subject_id', 'mark', 'work']
    console.log('new_row', this.state.new_row)
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
                    <td>{user['student_id']['$oid']}</td>
                    <td>{user['subject_id']['$oid']}</td>
                    <td>{user.mark}</td>
                    <td>{JSON.stringify(user.work)}</td>
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
                          student_id: e.target.value
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
                          subject_id: e.target.value
                        }
                      })
                    }
                  }
                />
              </td>
              <td>
                <input
                  min="2"
                  max="5"
                  defaultValue="5"
                  required={true}
                  className="form-control"
                  type="number"
                  onChange={
                    async (e) => {
                      await this.setState({
                        new_row: {
                          ...this.state.new_row,
                          mark: e.target.value
                        }
                      })
                    }
                  }
                />
              </td>
              <td>
                <input
                  defaultValue='{}'
                  required={true}
                  className="form-control"
                  type="text"
                  onChange={
                    async (e) => {
                      await this.setState({
                        new_row: {
                          ...this.state.new_row,
                          work: JSON.parse(e.target.value)
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
              await Back.addMark(this.state.new_row)
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

export default Journal;