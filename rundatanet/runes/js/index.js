// src/index.js
import * as module1 from './index_scripts.js';
import * as module2 from './index_multiselect.js';
import * as map_module from './index_map.js';
import * as query_builder_module from './index_query_builder.js';

Object.assign(window, module1, module2, map_module, query_builder_module);