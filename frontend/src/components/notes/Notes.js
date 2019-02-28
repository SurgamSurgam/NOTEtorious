import React from "react";
import { NotesDisplay } from "./NotesDisplay.js";
import { SingleNoteDisplay } from "./SingleNoteDisplay.js";
import { AddNoteDisplay } from "./AddNoteDisplay.js";
import axios from "axios";

export default class Notes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentNoteObj: "",
      toggleNewNote: true,
      newNote: { title: "", body: "", notebook_id: "" }
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchNotes();
    this.props.fetchNotebooks();

    let notes = Object.values(this.props.notes).find((note, i) => i === 0);
    let defaultNotebook = Object.values(this.props.notebooks).find(
      notebook => notebook.is_default === true
    );

    if (notes) {
      this.setCurrentNotetoFirstNote(notes, defaultNotebook.id);
    }
  }

  handleChange = e => {
    this.setState({
      currentNoteObj: { ...this.state.currentNoteObj, body: e }
    });
  };

  handleNewNoteChange = e => {
    if (typeof e === "string") {
      this.setState({
        newNote: { ...this.state.newNote, body: e }
      });
    } else {
      this.setState({
        newNote: { ...this.state.newNote, title: e.target.value }
      });
    }
  };

  toggleNewNote = () => {
    this.setState({
      toggleNewNote: !this.state.toggleNewNote
    });
  };

  setCurrentNotetoFirstNote = (firstNote, defaultNotebookId) => {
    this.setState({
      currentNoteObj: { ...firstNote },
      newNote: { ...this.state.newNote, notebook_id: +defaultNotebookId }
    });
  };

  getSelectionDetails = (e, selectedNoteObj) => {
    this.setState({
      currentNoteObj: { ...selectedNoteObj, body: selectedNoteObj.body }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    axios
      .post(`/api/notes/${+this.state.newNote.notebook_id}`, this.state.newNote)
      .then(() => {
        this.setState({
          newNote: { ...this.state.newNote, title: "", body: "" }
        });
      })
      .then(() => {
        this.props.fetchNotebooks();
        this.props.fetchNotes();
      });
  };

  handleCancel = () => {
    this.toggleNewNote();
    this.setState({
      newNote: { ...this.state.newNote, title: "", body: "" }
    });
  };

  render() {
    console.log("STATE", this.state);
    console.log("PROPS", this.props);
    // console.log("PROPS", this.props.location.pathname);

    let notes = Object.values(this.props.notes).map((note, i) => {
      let updated_at = new Date(note.updated_at);
      let created_at = new Date(note.created_at);

      return (
        <div
          className="allNotesDiv"
          key={note.id}
          onClick={e => this.getSelectionDetails(e, note)}
        >
          <p>
            Id: {note.id}
            <br />
            Title: {note.title}
            <br />
            Body: {note.body}
            <br />
            {note.updated_at
              ? "Updated at " + updated_at
              : "Created at " + created_at}
            <br />
            Favorited:{String(note.favorited)}
          </p>
        </div>
      );
    });

    return (
      <>
        <h1>All Notes</h1>
        {this.state.toggleNewNote ? (
          <AddNoteDisplay
            newNote={this.state.newNote}
            handleNewNoteChange={this.handleNewNoteChange}
            handleSubmit={this.handleSubmit}
            handleCancel={this.handleCancel}
          />
        ) : (
          <SingleNoteDisplay
            currentNoteObj={this.state.currentNoteObj}
            handleChange={this.handleChange}
          />
        )}
        <NotesDisplay notes={notes} />
      </>
    );
  }
}

// handleSubmit={this.handleSubmit}
