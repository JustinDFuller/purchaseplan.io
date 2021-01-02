import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { put } from "./api";
import { withContext } from "./context/with";
import * as styles from "../styles";
import { Card } from "../layout/Card";

export const Purchases = withContext(function ({ user, setUser }) {
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
    put(u);
  }

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {function (provided, snapshot) {
          return (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="row"
            >
              {user.purchases().map((purchase, index) => (
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
                        key={purchase.data.product.data.name}
                      >
                        <Card noBody>
                          <div className="row">
                            <div className="col-12 col-sm-5 col-xl-3">
                              <img
                                className="card-img-top"
                                src={purchase.data.product.data.image}
                                alt={purchase.data.product.data.description}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://cdn.dribbble.com/users/2046015/screenshots/6015680/08_404.gif"; // TODO: Find another image.
                                }}
                              />
                            </div>
                            <div className="col-12 col-sm-7 col-xl-9">
                              <div
                                className="card-body"
                                style={{ position: "relative" }}
                              >
                                <strong
                                  className="price-bubble"
                                  style={styles.bubble}
                                >
                                  ${purchase.data.product.data.price}
                                </strong>
                                <a
                                  href={purchase.data.product.data.url}
                                  className="text-white"
                                >
                                  <h5 className="card-title mt-3 mt-lg-0">
                                    {purchase.data.product.data.name}
                                  </h5>
                                </a>
                                <p>
                                  {purchase.data.product.data.description.slice(
                                    0,
                                    150
                                  )}
                                  {purchase.data.product.data.description
                                    .length > 150 && "..."}
                                </p>
                                <div style={{ marginTop: 10 }}>
                                  <strong style={{ marginRight: 3 }}>
                                    Ready to buy
                                  </strong>
                                  <span className="availablity">
                                    {purchase.displayDate()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    );
                  }}
                </Draggable>
              ))}
            </div>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
});
