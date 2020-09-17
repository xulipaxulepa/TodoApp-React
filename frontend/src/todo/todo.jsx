import React, { Component } from 'react'
import axios from 'axios'

import PageHeader from '../template/pageHeader'
import Form from './todoForm'
import List from './todoList'

const URL = 'http://localhost:3003/api/todos'

export default class Todo extends Component {
    
    constructor(props) {
        super(props)
        this.handleAdd = this.handleAdd.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleMarkAsDone = this.handleMarkAsDone.bind(this)
        this.handleMarkAsPending = this.handleMarkAsPending.bind(this)
        this.handleSearche = this.handleSearche.bind(this)
        this.handleClear = this.handleClear.bind(this)
        this.state = {description: '', list: []}

        this.refresh()
    }

    refresh(description= '') {
        const search = description ? `&description__regex=/${description}/`: ''
        axios.get(`${URL}?sort=-reatedAt${search}`).then(resp => this.setState(
            {...this.state, 
                description, 
                list: resp.data
            })
        )
    }

    handleRemove(todo) {
        axios.delete(`${URL}/${todo._id}`).then(resp => this.refresh(this.state.description))
    }

    handleMarkAsDone(todo) {
        axios.put(`${URL}/${todo._id}`, {...todo, done: true})
        .then(resp => this.refresh(this.state.description))
    }

    handleMarkAsPending(todo) {
        axios.put(`${URL}/${todo._id}`, {...todo, done: false})
        .then(resp => this.refresh(this.state.description))
    }
    
    handleAdd() {
        const description = this.state.description
        axios.post(URL, {description}).then(res => this.refresh())
    }

    handleChange(e){
        this.setState({...this.state, description: e.target.value})
    }

    handleSearche(){
        this.refresh(this.state.description)
    }

    handleClear(){
        this.refresh()
    }

    render() {
        return (
            <div>
                <PageHeader name='Todo' small='list' />
                <Form description={this.state.description} 
                handleAdd={this.handleAdd}
                handleChange={this.handleChange}
                handleSearche={this.handleSearche}
                handleClear={this.handleClear}/>
                <List handleMarkAsDone={this.handleMarkAsDone}  
                handleMarkAsPending={this.handleMarkAsPending}
                handleRemove={this.handleRemove} list={this.state.list}/>
            </div>
        )
    }
}