import fs from 'fs';
import * as Icons from '@mui/icons-material';
import lodash from 'lodash';

const { snakeCase } = lodash;

const iconStyles = ['Filled', 'Outlined', 'Rounded', 'TwoTone', 'Sharp'];
const keys = Object.entries(Icons)
  .filter(([key]) => iconStyles.filter((style) => key.endsWith(style)).length === 0)
  .map(([key]) => snakeCase(key));

const iconListJson = JSON.stringify(keys, null, 2);

fs.writeFile('iconList.json', iconListJson, (err) => {
  if (err) {
    console.error('Error writing file:', err);
  } else {
    console.log('Icon list saved to iconList.json');
  }
});
