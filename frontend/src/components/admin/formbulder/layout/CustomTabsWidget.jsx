import React, { useState } from 'react';
import { Box, Tabs, Tab, TextField, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Rnd } from 'react-rnd';

const CustomTabsWidget = ({ widgets, setWidgets, parentId }) => {
  const [tabs, setTabs] = useState([{ id: 0, label: 'Tab 1', widgets: [] }]);
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleAddTab = () => {
    const newTabId = tabs.length ? tabs[tabs.length - 1].id + 1 : 0;
    setTabs([...tabs, { id: newTabId, label: `Tab ${newTabId + 1}`, widgets: [] }]);
    setCurrentTab(newTabId);
  };

  const handleRemoveTab = (tabId) => {
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    setCurrentTab(newTabs.length ? newTabs[0].id : 0);
  };

  const handleRenameTab = (tabId, newLabel) => {
    setTabs(tabs.map(tab => (tab.id === tabId ? { ...tab, label: newLabel } : tab)));
  };

  const renderWidgets = (widgetsToRender) => {
    return widgets
      .filter(widget => widgetsToRender.includes(widget.id))
      .map((widget, index) => (
        <Rnd
          key={widget.id}
          size={{ width: widget.w, height: widget.h }}
          position={{ x: widget.x, y: widget.y }}
          onDragStop={(e, d) => {
            setWidgets((prevWidgets) =>
              prevWidgets.map((w) =>
                w.id === widget.id ? { ...w, x: d.x, y: d.y } : w
              )
            );
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setWidgets((prevWidgets) =>
              prevWidgets.map((w) =>
                w.id === widget.id
                  ? { ...w, w: ref.style.width, h: ref.style.height }
                  : w
              )
            );
          }}
          bounds="parent"
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid black',
              borderRadius: 1,
              backgroundColor: 'white',
            }}
          >
            <Typography variant="h6" sx={{ cursor: 'move' }}>
              {widget.type}
            </Typography>
          </Box>
        </Rnd>
      ));
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <Tabs value={currentTab} onChange={handleTabChange}>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={
              <TextField
                variant="outlined"
                size="small"
                value={tab.label}
                onChange={(e) => handleRenameTab(tab.id, e.target.value)}
                sx={{ width: 'auto', mx: 1 }}
              />
            }
          />
        ))}
        <IconButton onClick={handleAddTab} color="primary">
          <AddIcon />
        </IconButton>
      </Tabs>
      <Box sx={{ p: 2 }}>
        {tabs.map(
          (tab) =>
            tab.id === currentTab && (
              <Box key={tab.id}>
                <IconButton onClick={() => handleRemoveTab(tab.id)} color="error">
                  <DeleteIcon />
                </IconButton>
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                  {renderWidgets(tab.widgets)}
                </Box>
              </Box>
            )
        )}
      </Box>
    </Box>
  );
};

export default CustomTabsWidget;
