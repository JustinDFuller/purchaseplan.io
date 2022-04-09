import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Row from "react-bootstrap/Row";

import * as User from "user";
import * as Tracking from "tracking";

import { Card } from "./Card";
import { samplePurchases } from "../samplePurchases";

export const List = User.data.WithContext(function ({
  user,
  setUser,
  loading,
}) {
  const [placeholderProps, setPlaceholderProps] = useState({});
  function onDragStart() {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  }

  async function onDragEnd(result) {
    setPlaceholderProps({});

    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    const purchases = user
      .purchases()
      .reorder(
        result.draggableId,
        result.source.index,
        result.destination.index
      );

    // Optimistically change it to avoid shuffling.
    const u = user.setPurchases(purchases);
    setUser(u);
    Tracking.api.action({ Name: "Drag and Drop Purchase" });
    const res = await User.api.put(u);
    // reset it just in case backend changed
    setUser(user.from(res));
  }

  function onDragUpdate(update) {
    if (!update.destination) {
      return;
    }
    const draggableId = update.draggableId;
    const destinationIndex = update.destination.index;
    const sourceIndex = update.source.index;

    const domQuery = `[data-rbd-drag-handle-draggable-id='${draggableId}']`;
    const draggedDOM = document.querySelector(domQuery);

    if (!draggedDOM) {
      return;
    }
    const { clientHeight, clientWidth } = draggedDOM;

    const original = [...draggedDOM.parentNode.children];
    const removed = original.splice(sourceIndex, 1);
    const children = [
      ...original.slice(0, destinationIndex),
      removed,
      ...original.slice(destinationIndex + 1),
    ];

    const clientY = children
      .slice(0, destinationIndex)
      .reduce((total, curr) => {
        return total + curr.clientHeight;
      }, 0);

    setPlaceholderProps({
      position: "absolute",
      height: clientHeight,
      width: clientWidth,
      top: clientY,
      left: parseFloat(
        window.getComputedStyle(draggedDOM.parentNode).paddingLeft
      ),
      background: "rgb(38, 38, 78)",
    });
  }

  const purchases = loading
    ? samplePurchases[0].products
    : user.purchases().withoutSkippable();

  return (
    <DragDropContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragUpdate={onDragUpdate}
    >
      <Droppable droppableId="droppable">
        {function (provided, snapshot) {
          return (
            <Row
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ position: "relative", marginTop: "-1rem" }}
            >
              {purchases.map((purchase, index) => (
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
                        className="col-12 py-3"
                        key={purchase.id()}
                      >
                        <Card purchase={purchase} />
                      </div>
                    );
                  }}
                </Draggable>
              ))}
              {provided.placeholder}
              <div style={placeholderProps} />
            </Row>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
});
