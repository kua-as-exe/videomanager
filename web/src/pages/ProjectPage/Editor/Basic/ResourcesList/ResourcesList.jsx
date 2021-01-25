import React from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ResourceItem from './ResourceItem';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const ItemList = React.memo(({ items, ItemsComponent, props}) => {
    return items.map((item, index) => (
        <Draggable draggableId={item.id} index={index}  key={item.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <ItemsComponent {...item} {...props} index={index}/>
          </div>
        )}
      </Draggable>
    ));
});

export const ResourcesList = ({items, setItems, button, ...props}) => {
    function onDragEnd(result) {
        if (!result.destination) return;
        if (result.destination.index === result.source.index) return;
        const newItems = reorder(
          items,
          result.source.index,
          result.destination.index
        );
        setItems(newItems);
    }

    return (
        <nav className="panel is-primary">
            <p className="panel-heading p-2 pl-3">
                <span className="is-6">Recursos</span>
            </p>
            {/* <p className="panel-tabs">
                <a className="is-active">All</a>
                <a>Public</a>
                <a>Private</a>
                <a>Sources</a>
                <a>Forks</a>
            </p> */}
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="list">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                    <ItemList items={items}  props={props} ItemsComponent={ResourceItem}/>
                    {provided.placeholder}
                    </div>
                )}
                </Droppable>
            </DragDropContext>
               
            
            {button && <div className="panel-block">
                {button}
            </div>}
        </nav>
    )
}
