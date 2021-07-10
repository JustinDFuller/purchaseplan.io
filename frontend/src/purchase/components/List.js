import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Row from "react-bootstrap/Row";

import * as User from "user";

import { Card } from "./Card";

export const List = User.Context.With(function ({ user, setUser }) {
  function onDragStart() {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  }

  function onDragEnd(result) {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    const purchases = user
      .purchases()
      .reorder(result.source.index, result.destination.index);

    const u = user.setPurchases(purchases);
    setUser(u);
    User.api.put(u);
  }

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {function (provided, snapshot) {
          return (
            <Row {...provided.droppableProps} ref={provided.innerRef}>
              {user.purchases().map((purchase, index) =>
                purchase.shouldSkip() ? null : (
                  <Draggable
                    key={purchase.id()}
                    draggableId={purchase.id()}
                    index={index}
                  >
                    {function (provided, snapshot) {
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="col-12"
                          key={purchase.id()}
                        >
                          <Card purchase={purchase} />
                        </div>
                      );
                    }}
                  </Draggable>
                )
              )}
              {provided.placeholder}
            </Row>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
});
