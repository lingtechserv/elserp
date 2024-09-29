import React from "react";
import Item from "./Item";
import { Droppable } from "react-beautiful-dnd";
import { styled } from "../stiches.config";

interface ColumnProps {
  col: {
    id: string;
    list: string[];
  };
}

const StyledColumn = styled("div", {
  padding: "4px 4px",
  display: "flex",
  flexDirection: "column",
  marginTop: 8,

  h2: {
    margin: 0,
    padding: "0 4px",
    font: "18px",
  },
});

const StyledList = styled("div", {
  backgroundColor: "#1EB3A3",
  borderRadius: 8,
  padding: 6,
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  marginTop: 4,
});

const Column: React.FC<ColumnProps> = ({ col: { list, id } }) => {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <StyledColumn>
          <h2>{id}</h2>
          <StyledList {...provided.droppableProps} ref={provided.innerRef}>
            {list.map((text, index) => (
              <Item key={text} text={text} index={index} />
            ))}
            {provided.placeholder}
          </StyledList>
        </StyledColumn>
      )}
    </Droppable>
  );
};

export default Column;
