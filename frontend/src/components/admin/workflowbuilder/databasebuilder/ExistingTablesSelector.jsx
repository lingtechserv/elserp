import React from 'react';
import { useSchema } from '../../../../contexts/SchemaContext';

const ExistingTablesSelector = () => {
  const { schemaData } = useSchema();

  return (
    <div>
      <h4>Existing Tables</h4>
      {Object.keys(schemaData).length === 0 ? (
        <p>No existing tables found.</p>
      ) : (
        <select>
          {Object.keys(schemaData).map((tableName) => (
            <option key={tableName} value={tableName}>
              {tableName}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default ExistingTablesSelector;
