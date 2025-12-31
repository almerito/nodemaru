// LibraryCallbacks.js - Main export file
// Node configurations are split into category-specific files for maintainability

import { SourceNodes } from './nodes/SourceNodes.js';
import { ExtSourceNodes } from './nodes/ExtSourceNodes.js';
import { GeometryNodes } from './nodes/GeometryNodes.js';
import { ColorNodes } from './nodes/ColorNodes.js';
import { BlendNodes } from './nodes/BlendNodes.js';
import { ModulateNodes } from './nodes/ModulateNodes.js';
import { DataNodes } from './nodes/DataNodes.js';
import { DataMathNodes } from './nodes/DataMathNodes.js';
import { OutputNodes } from './nodes/OutputNodes.js';

export const CATEGORY_LABELS = {
    source: 'Source',
    ext_source: 'Ext. Source',
    geometry: 'Geometry',
    color: 'Color',
    blend: 'Blend',
    modulate: 'Modulate',
    data: 'Data',
    data_math: 'Data Math',
    output: 'Output'
};

// Subcategory labels - used for second-level tabs within each category
// Nodes without a subcategory will appear in 'General' tab
export const SUBCATEGORY_LABELS = {
    // Source subcategories
    shapes: 'Shapes',
    oscillators: 'Oscillators',
    noises: 'Noises',
    colored: 'Colored',
    radial: 'Radial',
    fcs: 'FCS Curves',
    patterns: 'Patterns',
    complex: 'Complex',
    texture_input: 'Texture Input',

    // Geometry subcategories
    transform: 'Transform',
    repeat: 'Repeat',
    distort: 'Distort',

    // Color subcategories
    adjust: 'Adjust',
    effect: 'Effect',
    source_input: 'Source Input',

    // Effect subcategories (for future p5.js integration)
    particles: 'Particles',
    lines: 'Lines',

    // Generic
    extra: 'Extra'
};

export const NODES_CONFIG = {
    ...SourceNodes,
    ...ExtSourceNodes,
    ...GeometryNodes,
    ...ColorNodes,
    ...BlendNodes,
    ...ModulateNodes,
    ...DataNodes,
    ...DataMathNodes,
    ...OutputNodes,
};
