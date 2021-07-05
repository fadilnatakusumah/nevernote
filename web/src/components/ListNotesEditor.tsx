import styled from "@emotion/styled";
import {
  ListNotesDocument,
  Note,
  useDeleteNoteMutation,
  useListNotesQuery,
  useUpdateNoteMutation,
} from "../generated/graphql";
import { GENERICS, MIXINS } from "./GlobalStyle";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaSortDown, FaSortUp, FaTrash } from "react-icons/fa";
import { ChangeEvent, Fragment, useEffect } from "react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { stripHtml } from "string-strip-html";
import { debounceFn } from "../helper/debounce";
import { stripText } from "../helper/stripText";
dayjs.extend(relativeTime);

interface EditorProps {
  disabled: boolean;
}

type OrderByType = "ASC" | "DESC";

export function ListNotesEditor() {
  const { data, refetch } = useListNotesQuery();
  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [orderBy, setOrderBy] = useState<OrderByType>("DESC");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [submitUpdateNote] = useUpdateNoteMutation();
  const [submitDeleteNote] = useDeleteNoteMutation();

  const onChangeTitleHandler = (evt: ChangeEvent<HTMLInputElement>) => {
    setNoteForm({ ...noteForm, title: evt.target.value });
  };

  const onChangeEditorHandler = (value: string) => {
    setNoteForm((prevNote) => ({ ...prevNote, content: value }));
  };

  const onUpdateNoteHandler = debounceFn(async () => {
    if (!selectedNote) return;
    try {
      await submitUpdateNote({
        variables: {
          title: noteForm.title,
          content: noteForm.content,
          noteId: selectedNote.id,
        },
        update: (store, newNote) => {
          store.writeQuery({
            query: ListNotesDocument,
            data: {
              listNotes: data?.listNotes.map((note) => {
                if (note.id === selectedNote.id) {
                  return newNote;
                }
                return note;
              }),
            },
          });
        },
      });
      setIsSaving(false);
    } catch (error) {}
  });

  const onDeleteNoteHandler = (note: Note) => async () => {
    if (window.confirm("Are you sure?")) {
      try {
        await submitDeleteNote({
          variables: {
            noteId: note.id,
          },
          update: (store) => {
            store.writeQuery({
              query: ListNotesDocument,
              data: {
                listNotes: data?.listNotes.filter(({ id }) => id !== note.id),
              },
            });
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (selectedNote) {
      setTimeout(() => {
        setIsSaving(true);
      }, 1500);
    }

    onUpdateNoteHandler();
  }, [noteForm]);

  const onSelectNoteHandler = (note: Note) => () => {
    setNoteForm({
      title: note.title,
      content: note.content,
    });
    setSelectedNote(note);
  };

  const onClickOrderHandler = async () => {
    const newOrderBy = orderBy === "ASC" ? "DESC" : "ASC";
    await refetch({
      orderBy: newOrderBy,
    });
    console.log("REFETCHING");
    setOrderBy(newOrderBy);
  };

  return (
    <Fragment>
      <ListNotesStyle>
        <h2>All Notes</h2>
        <div className="note-filter">
          <span>{data?.listNotes.length} Notes</span>
          <div className="filters">
            <span onClick={onClickOrderHandler}>
              {orderBy === "DESC" ? <FaSortDown /> : <FaSortUp />}
            </span>
          </div>
        </div>
        <div className="list-notes">
          {data?.listNotes.map((note) => (
            <div
              key={note.id}
              className={`note${selectedNote?.id == note.id ? " active" : ""}`}
              onClick={onSelectNoteHandler(note as any)}
            >
              <div className="note-detail">
                <div className="note-title">{note.title || "Title"}</div>
                <div>
                  {stripText(stripHtml(note.content).result) || "Content"}
                </div>
                <small>{dayjs(note.created_at).fromNow()}</small>
              </div>
              <div
                className="delete-btn"
                onClick={onDeleteNoteHandler(note as any)}
              >
                <FaTrash />
              </div>
            </div>
          ))}
        </div>
      </ListNotesStyle>
      <EditorContainer disabled={!selectedNote}>
        <input
          value={noteForm.title}
          disabled={!selectedNote}
          placeholder="Title"
          onChange={onChangeTitleHandler}
        />
        {isSaving && (
          <div className="saving-text">
            <small>saving...</small>
          </div>
        )}
        <ReactQuill
          value={noteForm.content}
          readOnly={!selectedNote}
          placeholder="Start writing here"
          onChange={onChangeEditorHandler}
        />
      </EditorContainer>
    </Fragment>
  );
}

const ListNotesStyle = styled.div`
  height: 100%;
  width: 100%;
  max-width: 350px;
  color: ${GENERICS.colorBlackCalm};
  background-color: ${GENERICS.bgColor};
  display: flex;
  flex-direction: column;

  > h2 {
    font-weight: normal;
    padding: 20px;
  }

  .note-filter {
    ${MIXINS.va("space-between")}
    padding: 15px 20px;
    border-bottom: 1px solid #ccc;

    .filters span {
      cursor: pointer;
      padding: 3px;
    }
  }

  .list-notes {
    overflow-y: auto;
    height: 100%;

    .active {
      background-color: #fff;
    }
    .note {
      cursor: pointer;
      padding: 20px;
      border-bottom: ${GENERICS.border};
      color: ${GENERICS.colorGray};
      ${MIXINS.va("space-between")}
      &:hover {
        background-color: #eee;
        .delete-btn {
          visibility: visible;
        }
      }

      .note-detail {
        > div {
          margin-bottom: 8px;
        }

        .note-title {
          color: ${GENERICS.colorBlackCalm};
          font-weight: bold;
        }
      }

      .delete-btn {
        visibility: hidden;
        cursor: pointer;
        padding: 5px;
        &:hover {
          transition: 0.3s;
          color: red;
        }
      }
    }
  }
`;

const EditorContainer = styled.div<EditorProps>`
  width: 100%;

  > input {
    border: none;
    outline: none;
    padding: 18px;
    font-size: 2em;
    width: 100%;

    &:disabled {
      background: transparent;
      cursor: not-allowed;
    }
  }

  .saving-text {
    padding: 0 18px;
    font-style: italic;
  }

  .ql-toolbar,
  .ql-container {
    border: none !important;
  }

  .quill,
  .ql-container {
    font-size: 1em;
    height: 100%;
    cursor: ${(props: any) => (props.disabled ? "not-allowed;" : "unset")};
  }
  .ql-toolbar,
  .ql-editor p {
    cursor: ${(props: any) => (props.disabled ? "not-allowed;" : "unset")};
  }
`;
