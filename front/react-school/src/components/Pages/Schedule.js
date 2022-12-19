import { Component } from "react";
import * as React from 'react';
import Back from "../../helpers/api"
import Dropdown from "../Dropdown/Dropdown";


class Schedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selected: "",
            users: [],
            insert_mode: false,
            new_row: {
            }
        }
    }

    async componentDidMount() {
        const users = this.formatUsers(await Back.getUsers());
        const selected = users[0];
        const data = await Back.getSchedule(this.state.users[0]);
        console.log(selected)

        this.setState({
            users: users,
            selected: this.state.users[0],
            data: data
        })
        console.log(this.state.selected)
    }

    async onSelectedChange() {
        console.log('load')
        if (this.state.selected === "") {
            return;
        }
        await this.setState({
            data: await Back.getSchedule(this.state.selected.value)
        })
    }

    formatUsers(users) {
        const length = users.length, result = [];
        for (var i = 0; i < length; i++) {
            if (users[i]['type'] !== 'student') {
                continue;
            }
            result.push({
                value: users[i]['_id']['$oid'],
                label: users[i]['user_name']
            })
        }
        console.log(result)
        return result;
    }

    render() {

        const headers = ['_id', 'number', 'symbol', 'students']
        return (
            <>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '40px', flexDirection: 'column' }}>
                    <a href={'/'} className="text-center mb-5">Назад</a>
                    <Dropdown
                        selected={this.state.selected || ""}
                        onSelectedChange={(option) => {
                            this.setState({ selected: option });
                            this.onSelectedChange();
                        }}
                        dropdownOptions={this.state.users} />
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
                                            <td>{user.number}</td>
                                            <td>{user.symbol}</td>
                                            <td>{user.students}</td>
                                        </tr>
                                    )
                                })
                            }
                            <tr hidden={this.state.insert_mode === false}>
                                <td />
                                <td>
                                    <input
                                        className="form-control"
                                        type="text"
                                        onChange={
                                            async (e) => {
                                                await this.setState({
                                                    new_row: {
                                                        ...this.state.new_row,
                                                        number: e.target.value
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
                                                        symbol: e.target.value
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
                                                        students: e.target.value
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
                            await Back.addSchedule(this.state.new_row)
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

export default Schedule;