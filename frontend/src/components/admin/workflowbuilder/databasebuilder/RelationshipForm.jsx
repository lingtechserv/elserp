import React from 'react';

const RelationshipForm = ({ relationshipIndex, relationship, updateRelationship, existingSchema }) => {
  const handleColumnChange = (e) => {
    updateRelationship({ ...relationship, column: e.target.value });
  };

  const handleReferencesChange = (e) => {
    updateRelationship({ ...relationship, references: e.target.value });
  };

  const handleOnChange = (e) => {
    updateRelationship({ ...relationship, on: e.target.value });
  };

  return (
    <div className="relationship-form">
      <select value={relationship.column} onChange={handleColumnChange}>
        {existingSchema.map((table) => (
          table.columns.map((col) => (
            <option key={`${table.name}-${col.name}`} value={col.name}>
              {table.name}.{col.name}
            </option>
          ))
        ))}
      </select>
      <select value={relationship.references} onChange={handleReferencesChange}>
        {existingSchema.map((table) => (
          table.columns.map((col) => (
            <option key={`${table.name}-${col.name}`} value={col.name}>
              {table.name}.{col.name}
            </option>
          ))
        ))}
      </select>
      <input
        type="text"
        value={relationship.on}
        onChange={handleOnChange}
        placeholder="Reference Table"
      />
    </div>
  );
};

export default RelationshipForm;
