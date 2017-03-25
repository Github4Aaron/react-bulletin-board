import React from 'react'
import './App.css'
import Note from './Note'

var Board = React.createClass({ 
            propTypes: {
                count: function(props, propName) {
                    if(typeof props[propName] !== "number") {
                        return new Error("the count must be a number")
                    } 

                    if(props[propName] > 100) {
                        return new Error('Creating ' + props[propName] + ' notes is ridiculous')
                    }
                }
            },
            //getInitialState is called once and sets the default for state
            getInitialState() {
                return {
                    notes: [] // empty array since they will not be auto-generated
                }
            },

            // Component lifecylce provides hooks for creation, use, and tear-down of components
            //Enables adding libaries and loading data at very specific times
            //componentWillMount (the DOM) is called right before render, and is last chance to affect state prior to render
            //componentDidMount (the DOM)  fires right after render and user can now interact with it. 
            componentWillMount() {
                if (this.props.count) {//Checks to see if this.props.count exists, if it does, create var
                    var url = `http://baconipsum.com/api/?type=all-meat&sentences=${this.props.count}`// will load data 
                    //template string makes it easy to concatanate on the number of notes we want to add
                    fetch(url) 
                          .then(results => results.json())
                          .then(array => array[0])
                          .then(text => text.split('. '))
                          .then(array => array.forEach(
                                sentence => this.add(sentence)))
                          .catch(function(err) {
                            console.log("Didn't connect to the API", err)
                          })
                }
            },
            nextId() {
                this.uniqueId = this.uniqueId || 0
                return this.uniqueId++  // increments unique IDs
            },
            add(text) {  
                var notes = [
                    ...this.state.notes, //ES6 spread operator take existing notes and puts in first position
                    {
                        id: this.nextId(),//attaching nextId function to id
                        note: text
                    }
                ]
                this.setState({notes}) 
            },
            update(newText, id) {
                var notes = this.state.notes.map(
                    note => (note.id !== id) ?
                       note : 
                        {
                            ...note, 
                            note: newText
                        }
                    )
                this.setState({notes})
            },
            remove(id) {
                var notes = this.state.notes.filter(note => note.id !== id)
                this.setState({notes})
            },
            eachNote(note) {  // Board is Parent, note is Child
                // Since the children are dynamic, a key property is assigned to ensure that the state
                //and identity are maintained through multiple renders.
                return (<Note key={note.id}
                              id={note.id}
                              onChange={this.update}
                              onRemove={this.remove}>
                          {note.note}
                        </Note>)
            },
            //render is only required method for a component
            render() { // button is tied to add function
                return (<div className='board'>
                           {this.state.notes.map(this.eachNote)} 
                           <button onClick={() => this.add('New Note')}>+</button>  
                        </div>)
            }
        })

export default Board
