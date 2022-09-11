import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './Kanban.css';
import KanbanTable from './KanbanTable';
import KanbanForm from './KanbanForm';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Modal } from '@mui/material';
import { Button } from '../button/Button.js';
const axios = require('axios');

const onDragEnd = (result, columns, setColumns) => {
  const { source, destination } = result;

  if (!result.destination) return;

  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  )
    return;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

const Kanban = ({ columns, setColumns }) => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [open, setOpen] = useState(false);
  const [currentVerb, setCurrentVerb] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/position`)
      .then(function (response) {
        setColumns(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const postToDb = () => {
    axios
      .post(`http://localhost:8000/position`, columns)
      .catch(function (error) {
        console.log(error);
      });
  };

  const postToExpressApp = async () => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(
        `http://localhost:4000/protected/${user.sub}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(columns),
        }
      );
      console.log(response.status);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    setTimeout(postToDb, 900);
    if (user) postToExpressApp();
  }, [columns]);

  const editHandler = (currentVerb) => {
    setOpen(true);
    setIsEditing(true);
    setCurrentVerb(currentVerb);
  };

  return (
    <>
      <Button
        buttonStyle='btn--add-new-verb'
        buttonSize='btn--medium'
        onClick={() => setOpen(true)}
      >
        New Verb
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <>
          <KanbanForm
            setOpen={setOpen}
            columns={columns}
            currentVerb={currentVerb}
            setCurrentVerb={setCurrentVerb}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </>
      </Modal>

      <div className='kanban-wrapper'>
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div className='kanban-columns' key={columnId}>
                {(column.name === 'Nowe słowa' ||
                  column.name === 'Przeszły' ||
                  column.name === 'Przyszły') && (
                  <h2 className='kanban-header'>{column.name}</h2>
                )}

                {column.name === 'Stare słowa' && (
                  <div className='kanban-search-wrapper'>
                    <input
                      className='kanban-search'
                      placeholder='Search verb'
                    ></input>
                  </div>
                )}

                <div style={{ margin: 8 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          className='kanban-droppable'
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? 'lightblue'
                              : 'lightgrey',
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      className='kanban-draggable'
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        backgroundColor: snapshot.isDragging
                                          ? '#263B4A'
                                          : '#456C86',
                                        color: 'white',
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <div className='card-item-content'>
                                        <span
                                          className='card-item-case-aspect'
                                          style={{
                                            background: item.gram_case.color,
                                          }}
                                        >
                                          {`${item.gram_case.case} - ${item.gram_case.aspect}`}
                                        </span>

                                        <p>{item.word_image.polish_word}</p>
                                        {column.name === 'Stare słowa' && (
                                          <div className='link-notes-wrapper'>
                                            <Link
                                              className='link-notes'
                                              to='/notatki'
                                              state={{ item }}
                                              style={{ color: 'white' }}
                                            >
                                              Notes
                                            </Link>
                                          </div>
                                        )}

                                        <KanbanTable
                                          item={item}
                                          column={column}
                                          setOpen={setOpen}
                                        />
                                        {column.name === 'Nowe słowa' && (
                                          <Button
                                            onClick={() => editHandler(item)}
                                            buttonStyle='btn-edit-verb'
                                          >
                                            Edit
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </>
  );
};

export default Kanban;

// const itemsFromBackend = [
//   { id: uuidv4(), content: 'First task' },
//   { id: uuidv4(), content: 'Second task' },
//   { id: uuidv4(), content: 'Third task' },
//   { id: uuidv4(), content: 'Fourth task' },
//   { id: uuidv4(), content: 'Fifth task' },
// ];

// const columnsFromBackend = {
//   columnOne: {
//     name: 'Requested',
//     items: [],
//   },
//   columnTwo: {
//     name: 'To do',
//     items: [],
//   },
//   columnThree: {
//     name: 'In Progress',
//     items: itemsFromBackend,
//   },
//   columnFour: {
//     name: 'Done',
//     items: [],
//   },
// };

//////////////////////

// "link_url": "https://images.unsplash.com/photo-1468421870903-4df1664ac249?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dG8lMjBjcmVhdGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
// "link_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2Y788iyTaAscQ4ihPPq4o5-m4CXLsKFON6w&usqp=CAU",
