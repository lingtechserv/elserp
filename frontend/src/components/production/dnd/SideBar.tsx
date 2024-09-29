import React, { useState } from "react";
import Column from "./components/Column";
import { DragDropContext, } from "react-beautiful-dnd";
import { styled } from './stiches.config'

const StyledColumns = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr", // Two columns
  margin: "1vh auto", // Reduced margin
  width: "28vw", // Adjusted to fit within 30vw
  height: "15vh", // Adjust height automatically based on content or set a specific height
  gap: "4px", // Reduced gap between items
});

function SideBar() {
  const initialColumns = {
    1: {
      id: "Auto Bottler",
      list: ["Employee 1", "Employee 2"], // Corrected line
    },
    2: {
      id: "Semi Auto Bottler",
      list: ["Employee 3", "Employee 4"],
    },
    3: {
      id: "Bench Labeler",
      list: ["Employee 5"],
    },
    4: {
      id: "Big Labeler",
      list: ["Employee 8", "Employee 9"],
    },
    5: {
      id: "Bulk",
      list: ["Employee 10"],
    },
    6: {
      id: "Out",
      list: ["Employee 6", "Employee 7"],
    },
  };
  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return; // Exit if there's no destination

    console.log("Drag operation started");
    console.log(
      `Source ID: ${source.droppableId}, Source Index: ${source.index}`
    );
    console.log(
      `Destination ID: ${destination.droppableId}, Destination Index: ${destination.index}`
    );

    const sourceId = Object.keys(initialColumns).find(
      (key) => initialColumns[key].id === source.droppableId
    );
    const destinationId = Object.keys(initialColumns).find(
      (key) => initialColumns[key].id === destination.droppableId
    );

    if (!sourceId || !destinationId) {
      console.error("Invalid source or destination ID");
      return; // Early exit if source or destination column is not found
    }

    const startColumn = columns[sourceId];
    const finishColumn = columns[destinationId];

    // Moving within the same column
    if (sourceId === destinationId) {
      console.log("Moving within the same column");
      const newItems = Array.from(startColumn.list);
      const [reorderedItem] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, reorderedItem);

      const newColumns = {
        ...columns,
        [sourceId]: { ...startColumn, list: newItems },
      };

      setColumns(newColumns);
    } else {
      console.log("Moving from one column to another");
      // Moving from one column to another
      const startItems = Array.from(startColumn.list);
      const [removedItem] = startItems.splice(source.index, 1);
      const finishItems = Array.from(finishColumn.list);

      finishItems.splice(destination.index, 0, removedItem);

      const newColumns = {
        ...columns,
        [sourceId]: { ...startColumn, list: startItems },
        [destinationId]: { ...finishColumn, list: finishItems },
      };

      setColumns(newColumns);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StyledColumns>
        {Object.values(columns).map((col) => (
          <Column col={col} key={col.id} />
        ))}
      </StyledColumns>
    </DragDropContext>
  );
}
export default SideBar;
