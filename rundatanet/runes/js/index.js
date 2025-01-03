// src/index.js
import * as module1 from './index_scripts.js';
import * as module2 from './index_multiselect.js';
import * as map_module from './index_map.js';

Object.assign(window, module1, module2, map_module);