var field = {
    type: "string",
    expression: "always",
    expressionType: "dimension",
    ref: "qListObjectDef.qDef.qFieldDefs.0",
    label: "Field",
    show: function (data) {
      return data.qListObjectDef && !data.qListObjectDef.qLibraryId;
    },
  },
  frequency = {
    type: "string",
    component: "dropdown",
    label: "Frequency Mode",
    ref: "qListObjectDef.qFrequencyMode",
    options: [
      {
        value: "N",
        label: "No frequency",
      },
      {
        value: "V",
        label: "Absolute value",
      },
      {
        value: "P",
        label: "Percent",
      },
      {
        value: "R",
        label: "Relative",
      },
    ],
    defaultValue: "V",
  },
  ui = {
    type: "string",
    component: "dropdown",
    label: "UI Type",
    ref: "ui",
    options: [
      {
        value: "listbox",
        label: "Listbox",
      },
      {
        value: "dropdown",
        label: "Dropdown",
      },
      {
        value: "buttongroup",
        label: "Button Group",
      },
    ],
    defaultValue: "listbox",
  },
  qSortByAscii = {
    type: "numeric",
    component: "dropdown",
    label: "Sort by Alphabetical",
    ref: "qListObjectDef.qDef.qSortCriterias.0.qSortByAscii",
    options: [
      {
        value: 1,
        label: "Ascending",
      },
      {
        value: 0,
        label: "No",
      },
      {
        value: -1,
        label: "Descending",
      },
    ],
    defaultValue: 1,
  },
  qSortByNumeric = {
    type: "numeric",
    component: "dropdown",
    label: "Sort by Numeric",
    ref: "qListObjectDef.qDef.qSortCriterias.0.qSortByNumeric",
    options: [
      {
        value: 1,
        label: "Ascending",
      },
      {
        value: 0,
        label: "No",
      },
      {
        value: -1,
        label: "Descending",
      },
    ],
    defaultValue: 0,
  },
  qSortByLoadOrder = {
    type: "numeric",
    component: "dropdown",
    label: "Sort by Load Order",
    ref: "qListObjectDef.qDef.qSortCriterias.0.qSortByLoadOrder",
    options: [
      {
        value: 1,
        label: "Ascending",
      },
      {
        value: 0,
        label: "No",
      },
      {
        value: -1,
        label: "Descending",
      },
    ],
    defaultValue: 0,
  },
  qSortByFrequency = {
    type: "numeric",
    component: "dropdown",
    label: "Sort by Frequencey",
    ref: "qListObjectDef.qDef.qSortCriterias.0.qSortByFrequency",
    options: [
      {
        value: -1,
        label: "Ascending",
      },
      {
        value: 0,
        label: "No",
      },
      {
        value: 1,
        label: "Descending",
      },
    ],
    defaultValue: 0,
  },
  qSortByState = {
    type: "numeric",
    component: "dropdown",
    label: "Sort by State",
    ref: "qListObjectDef.qDef.qSortCriterias.0.qSortByState",
    options: [
      {
        value: 1,
        label: "Ascending",
      },
      {
        value: 0,
        label: "No",
      },
      {
        value: -1,
        label: "Descending",
      },
    ],
    defaultValue: 0,
  },
  dataHandling = {
    uses: "dataHandling",
  },
  settings = {
    uses: "settings",
  };

export default {
  type: "items",
  component: "accordion",
  items: {
    dimensions: {
      type: "items",
      label: "Dimensions",
      ref: "qListObjectDef",
      items: {
        field: field,
        frequency: frequency,
        ui: ui,
      },
    },
    sorting: {
      type: "items",
      label: "Sorting",
      items: {
        qSortByAscii: qSortByAscii,
        qSortByNumeric: qSortByNumeric,
        qSortByLoadOrder: qSortByLoadOrder,
        qSortByFrequency: qSortByFrequency,
        qSortByState: qSortByState,
      },
    },
    addons: {
      uses: "addons",
      items: {
        dataHandling: dataHandling,
      },
    },
    settings: {
      type: "items",
      label: "Appearance",
      items: {
        settings: settings,
      },
    },
  },
};
