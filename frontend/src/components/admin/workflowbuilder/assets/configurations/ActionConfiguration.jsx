import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
  Toolbar,
  AppBar,
  MenuItem,
  Select,
  Tabs,
  Tab,
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { globalColors } from '../../../../../constants/Styles';
import { useSchema } from '../../../../../contexts/SchemaContext';
import TableBuilder from '../../databasebuilder/TableBuilder';

const ActionConfiguration = ({ config, onSave, onCancel }) => {
  const [actionType, setActionType] = useState(config.actionType || '');
  const [actionConfig, setActionConfig] = useState(config.actionConfig || {});
  const [selectedTab, setSelectedTab] = useState(0);
  const [focusedField, setFocusedField] = useState(null);
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [inputValue, setInputValue] = useState('');

  const { schemaData } = useSchema();

  useEffect(() => {
    console.log('Schema Data:', schemaData);
  }, [schemaData]);

  const handleSave = () => {
    onSave({
      actionType,
      actionConfig: {
        table: selectedTable,
        field: selectedField,
        value: inputValue,
      },
    });
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleVariableClick = (variable) => {
    if (focusedField) {
      const start = focusedField.selectionStart;
      const end = focusedField.selectionEnd;
      const value = actionConfig[focusedField.name] || '';

      const newValue = `${value.substring(0, start)}{{${variable}}}${value.substring(end)}`;

      setActionConfig((prev) => ({
        ...prev,
        [focusedField.name]: newValue,
      }));

      setTimeout(() => {
        focusedField.selectionStart = focusedField.selectionEnd = start + variable.length + 4;
        focusedField.focus();
      }, 0);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setActionConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
    setSelectedField(''); // Reset field when table changes
  };

  const handleFieldChange = (event) => {
    setSelectedField(event.target.value);
  };

  const handleValueChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFocus = (e) => {
    setFocusedField(e.target);
  };

  const renderTreeItems = (items) => {
    return items.map((item) => (
      <TreeItem
        key={item.variable}
        itemId={item.variable}
        label={item.label}
        onClick={() => handleVariableClick(item.variable)}
      />
    ));
  };

  const renderActionForm = () => {
    switch (actionType) {
      case 'Send an email':
        return (
          <Box sx={{ display: 'flex', gap: 4, mt: 2, width: '100vw' }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="To"
                  value={actionConfig.to || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  name="to"
                  onFocus={handleFocus}
                />
                <TextField
                  label="Cc"
                  value={actionConfig.cc || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  name="cc"
                  onFocus={handleFocus}
                />
              </Box>
              <TextField
                label="Email Subject"
                value={actionConfig.subject || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                sx={{ marginTop: 2 }}
                name="subject"
                onFocus={handleFocus}
              />
              <TextField
                label="Email Body"
                value={actionConfig.body || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                multiline
                rows={15}
                sx={{ marginTop: 2 }}
                name="body"
                onFocus={handleFocus}
              />
            </Box>
            <Box sx={{ flex: 1, mr: 2 }}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                sx={{ minHeight: '48px', backgroundColor: globalColors.primary, color: 'white', mr: 4 }}
              >
                <Tab label="Customer Information" sx={{ minHeight: '48px', color: 'white' }} />
                <Tab label="Sales Information" sx={{ minHeight: '48px', color: 'white' }} />
                <Tab label="Accounting" sx={{ minHeight: '48px', color: 'white' }} />
              </Tabs>
              <Box sx={{ padding: 2 }}>
                {selectedTab === 0 && (
                  <SimpleTreeView
                    aria-label="customer-information"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                  >
                    <TreeItem itemId="1" label="Names">
                      {renderTreeItems([
                        { label: "Customer Business Name", variable: "Customer Business Name" },
                        { label: "Customer Billing POC", variable: "Customer Billing POC" },
                        { label: "Customer Decision POC", variable: "Customer Decision POC" },
                        { label: "All Customer POC's", variable: "All Customer POC's" },
                      ])}
                    </TreeItem>
                    <TreeItem itemId="2" label="Emails">
                      {renderTreeItems([
                        { label: "Billing Email", variable: "Billing Email" },
                        { label: "Decision Email", variable: "Decision Email" },
                        { label: "All POC Emails", variable: "All POC Emails" },
                      ])}
                    </TreeItem>
                    <TreeItem itemId="3" label="Addresses">
                      {renderTreeItems([
                        { label: "Billing Address", variable: "Billing Address" },
                        { label: "Physical Address", variable: "Physical Address" },
                      ])}
                    </TreeItem>
                  </SimpleTreeView>
                )}
                {selectedTab === 1 && (
                  <SimpleTreeView
                    aria-label="sales-information"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                  >
                    <TreeItem itemId="4" label="Orders">
                      {renderTreeItems([
                        { label: "Order Details", variable: "Order Details" },
                        { label: "Payment Terms", variable: "Payment Terms" },
                        { label: "Order Status", variable: "Order Status" },
                        { label: "Order Date", variable: "Order Date" },
                      ])}
                    </TreeItem>
                    <TreeItem itemId="5" label="Leads">
                      {renderTreeItems([
                        { label: "Meeting Details", variable: "Meeting Details" },
                      ])}
                    </TreeItem>
                  </SimpleTreeView>
                )}
                {selectedTab === 2 && (
                  <SimpleTreeView
                    aria-label="accounting"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                  >
                    <TreeItem itemId="6" label="Invoicing">
                      {renderTreeItems([
                        { label: "Invoice Number", variable: "Invoice Number" },
                        { label: "Invoice Date", variable: "Invoice Date" },
                        { label: "Due Date", variable: "Due Date" },
                        { label: "Amount Due", variable: "Amount Due" },
                      ])}
                    </TreeItem>
                    <TreeItem itemId="7" label="Payments">
                      {renderTreeItems([
                        { label: "Payment Method", variable: "Payment Method" },
                        { label: "Payment Status", variable: "Payment Status" },
                      ])}
                    </TreeItem>
                    <TreeItem itemId="8" label="Tax Information">
                      {renderTreeItems([
                        { label: "Tax ID", variable: "Tax ID" },
                        { label: "Tax Rate", variable: "Tax Rate" },
                        { label: "Tax Amount", variable: "Tax Amount" },
                      ])}
                    </TreeItem>
                  </SimpleTreeView>
                )}
              </Box>
            </Box>
          </Box>
        );
      case 'Set Value':
        return (
          <Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
              {/* Table Header and Dropdown */}
              <Box sx={{ flex: 1, minWidth: 120 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Table
                </Typography>
                <Select
                  value={selectedTable}
                  onChange={handleTableChange}
                  fullWidth
                  margin="normal"
                >
                  {Object.values(schemaData).map((table) => (
                    <MenuItem key={table.name} value={table.name}>
                      {table.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* Column Header and Dropdown */}
              <Box sx={{ flex: 1, minWidth: 120 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Column
                </Typography>
                <Select
                  value={selectedField}
                  onChange={handleFieldChange}
                  fullWidth
                  margin="normal"
                  disabled={!selectedTable} // Disabled until a table is selected
                >
                  {selectedTable &&
                    schemaData[selectedTable]?.columns.map((column) => (
                      <MenuItem key={column.name} value={column.name}>
                        {column.name}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </Box>

            {/* Input Value */}
            {selectedField && (
              <TextField
                label="New Value"
                value={inputValue}
                onChange={handleValueChange}
                fullWidth
                margin="normal"
                sx={{ mt: 2 }}
              />
            )}
          </Box>
        );
      case 'Table Builder': // New case for Table Builder
        return <TableBuilder />;
      default:
        return null;
    }
  };

  return (
    <Modal
      open={true}
      onClose={onCancel}
      aria-labelledby="action-config-modal"
      aria-describedby="modal-to-open-action-config"
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          display: 'flex',
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            padding: 0,
            marginLeft: 0,
            marginTop: '56px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'relative',
          }}
        >
          <AppBar
            position="fixed"
            sx={{
              backgroundColor: globalColors.primary,
              zIndex: (theme) => theme.zIndex.drawer + 1,
              width: '100%',
              left: 0,
            }}
          >
            <Toolbar>
              <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                Action Configuration
              </Typography>
              <IconButton
                aria-label="close"
                onClick={onCancel}
                sx={{
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                }}
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          <Box sx={{ mt: '16px', pl: '16px', width: '100%', maxWidth: '240px' }}>
            <Typography variant="h6">Select Action Type</Typography>
            <Select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            >
              <MenuItem value="Send an email">Send an Email</MenuItem>
              <MenuItem value="Set Value">Set Value</MenuItem>
              <MenuItem value="Table Builder">Table Builder</MenuItem>
            </Select>
          </Box>

          <Box sx={{ mt: 2, pl: '16px', pr: '16px', width: '100%', display: 'flex', gap: 4 }}>
            {renderActionForm()}
          </Box>

          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              display: 'flex',
              justifyContent: 'flex-end',
              width: 'auto',
              marginRight: 5,
            }}
          >
            <Button onClick={handleSave} variant="contained" color="primary">
              Save
            </Button>
            <Button onClick={onCancel} variant="outlined" color="secondary" sx={{ marginLeft: 1 }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ActionConfiguration;
