export default {
  type: "items",
  component: "accordion",
  items: {
      dimensions: {
          type: "items",
          label: "Dimension",
          ref: "qListObjectDef",
          itemTitleRef: function(data) {
              return data.fieldLabel ?
                  data.fieldLabel :
                  data.qListObjectDef.qDef.qFieldDefs[0];
          },
          items: {
            aboutdimSettings: {
              component: "text",
              label: `Pick one dimension field first!
              Use dimension field label option for custom label.
              Use UI type for listbox, dropdown or button group.`
          },
              field: {
                  type: "string",
                  expression: "always",
                  expressionType: "dimension",
                  ref: "qListObjectDef.qDef.qFieldDefs.0",
                  label: "Field"
              },
              fieldLabel: {
                  type: "string",
                  expression: "optional",
                  ref: "fieldLabel",
                  label: "Label",
              },
              frequency: {
                  type: "string",
                  component: "dropdown",
                  label: "Frequency Mode",
                  ref: "qListObjectDef.qFrequencyMode",
                  options: [{
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
                  defaultValue: "N",
              },
              ui: {
                  type: "string",
                  component: "dropdown",
                  label: "UI Type",
                  ref: "ui",
                  options: [{
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
          },
      },
      sorting: {
          type: "items",
          translation: "properties.sorting",
          schemaIgnore: !0,
          items: {
              autoSort: {
                  ref: "qListObjectDef.qDef.autoSort",
                  type: "boolean",
                  translation: "properties.sorting",
                  component: "switch",
                  defaultValue: !0,
                  options: [{
                          value: !0,
                          translation: "Common.Auto",
                      },
                      {
                          value: !1,
                          translation: "Common.Custom",
                      },
                  ],
                  change(t, e) {
                      if (t.qListObjectDef.qDef.autoSort)
                          return e.autoSortDimension(t.qListObjectDef);
                  },
              },
              dimension: {
                  component: "sorting-dimension",
                  ref: "qListObjectDef",
                  show: (t) => !t.qListObjectDef.qDef.autoSort,
                  sortingItems: {
                      state: !0,
                      expression: !0,
                      frequency: !0,
                      numeric: !0,
                      ascii: !0,
                  },
              },
          },
      },
      appearance: {
          uses: "settings",
          items: {
              HeaderSettings: {
                  type: "items",
                  label: "Header Settings",
                  items: {
                      HeaderShow: {
                          type: "boolean",
                          component: "switch",
                          label: "Header",
                          ref: "HeaderShow",
                          options: [{
                                  value: true,
                                  label: "On",
                              },
                              {
                                  value: false,
                                  label: "Off",
                              },
                          ],
                          defaultValue: true,
                      },
                      HeaderColor: {
                          type: "boolean",
                          component: "switch",
                          label: "Color",
                          ref: "HeaderColorSwitch",
                          options: [{
                                  value: false,
                                  label: "Custom",
                              },
                              {
                                  value: true,
                                  label: "Auto",
                              },
                          ],
                          defaultValue: false,
                      },
                      HeaderActiveColor: {
                          label: "Active Color",
                          ref: "HeaderActiveColorPicker",
                          component: "color-picker",
                          type: "object",
                          defaultValue: {
                              color: "#595959",
                          },
                          show: function(e) {
                              return !e.HeaderColorSwitch;
                          },
                      },
                      HeaderBgColor: {
                          label: "Header Background Color",
                          type: "string",
                          ref: "HeaderBgColor",
                      },
                      HeaderFontsizeSlider: {
                          type: "number",
                          component: "slider",
                          label: "Header Font Size (px)",
                          ref: "HeaderFontsize",
                          min: 0,
                          max: 50,
                          step: 1,
                          defaultValue: 13,
                          show: function(e) {
                              return e.HeaderFontsize;
                          },
                      },
                      HeaderFontFamilyLui: {
                          ref: "HeaderFontFamilySelect",
                          label: "Font Family Select",
                          component: "dropdown",
                          type: "string",
                          options: [{
                                  label: "QlikView Sans, sans-serif",
                                  value: "QlikView Sans, sans-serif",
                              },
                              {
                                  label: "Arial",
                                  value: "Arial",
                              },
                              {
                                  label: "Helvetica",
                                  value: "Helvetica",
                              },
                              {
                                  label: "Tahoma",
                                  value: "Tahoma",
                              },
                              {
                                  label: "Verdana",
                                  value: "Verdana",
                              },
                              {
                                  label: "Comic Sans MS",
                                  value: "Comic Sans MS",
                              },
                              {
                                  label: "Times New Roman",
                                  value: "Times New Roman",
                              },
                              {
                                  label: "Courier New",
                                  value: "Courier New",
                              },
                              {
                                  label: "Define your own",
                                  value: "own",
                              },
                          ],
                          defaultValue: "QlikView Sans, sans-serif",
                      },
                      HeaderFontStyle: {
                          ref: "HeaderFontStyle",
                          translation: "Font Style",
                          type: "string",
                          component: "dropdown",
                          options: [{
                                  value: "normal",
                                  label: "Normal"
                              },
                              {
                                  value: "bold",
                                  label: "Bold"
                              },
                              {
                                  value: "italic",
                                  label: "Italic"
                              },
                              {
                                  value: "underline",
                                  label: "Underline"
                              },
                          ],
                          defaultValue: "bold",
                      },
                      HeaderAlign: {
                          ref: "HeaderAlign",
                          expression: "optional",
                          translation: "Align",
                          type: "string",
                          component: "dropdown",
                          options: [{
                                  value: "left",
                                  label: "left",
                              },
                              {
                                  value: "center",
                                  label: "center",
                              },
                              {
                                  value: "right",
                                  label: "right",
                              },
                          ],
                          defaultValue: "left",
                      },
                  },
              },
              CellSettings: {
                  type: "items",
                  label: "Cell Settings",
                  items: {
                      aboutcellSettings: {
                          component: "text",
                          label: `Cell level styling for Listbox/Dropdown:`,
                      },
                      ListItemHeightSlider: {
                          type: "number",
                          component: "slider",
                          label: "Height (px)",
                          ref: "ListItemHeight",
                          min: 0,
                          max: 50,
                          step: 1,
                          defaultValue: 30,
                          show: function(e) {
                              return e.ListItemHeight;
                          },
                      },
                      ListItemFontsizeSlider: {
                          type: "number",
                          component: "slider",
                          label: "Font Size (px)",
                          ref: "ListItemFontsize",
                          min: 0,
                          max: 50,
                          step: 1,
                          defaultValue: 13,
                          show: function(e) {
                              return e.ListItemFontsize;
                          },
                      },
                      ListItemFontFamilyLui: {
                          ref: "ListItemFontFamilySelect",
                          label: "Font Family Select",
                          component: "dropdown",
                          type: "string",
                          options: [{
                                  label: "QlikView Sans, sans-serif",
                                  value: "QlikView Sans, sans-serif",
                              },
                              {
                                  label: "Arial",
                                  value: "Arial",
                              },
                              {
                                  label: "Helvetica",
                                  value: "Helvetica",
                              },
                              {
                                  label: "Tahoma",
                                  value: "Tahoma",
                              },
                              {
                                  label: "Verdana",
                                  value: "Verdana",
                              },
                              {
                                  label: "Comic Sans MS",
                                  value: "Comic Sans MS",
                              },
                              {
                                  label: "Times New Roman",
                                  value: "Times New Roman",
                              },
                              {
                                  label: "Courier New",
                                  value: "Courier New",
                              },
                              {
                                  label: "Define your own",
                                  value: "own",
                              },
                          ],
                          defaultValue: "QlikView Sans, sans-serif",
                      },
                      ListItemFontStyle: {
                          ref: "ListItemFontStyle",
                          translation: "Font Style",
                          type: "string",
                          component: "dropdown",
                          options: [{
                                  value: "normal",
                                  label: "Normal"
                              },
                              {
                                  value: "bold",
                                  label: "Bold"
                              },
                              {
                                  value: "italic",
                                  label: "Italic"
                              },
                              {
                                  value: "underline",
                                  label: "Underline"
                              },
                          ],
                          defaultValue: "normal",
                      },
                      ListItemAlign: {
                          ref: "ListItemAlign",
                          expression: "optional",
                          translation: "Align",
                          type: "string",
                          component: "dropdown",
                          options: [{
                                  value: "left",
                                  label: "left",
                              },
                              {
                                  value: "center",
                                  label: "center",
                              },
                              {
                                  value: "right",
                                  label: "right",
                              },
                          ],
                          defaultValue: "left",
                      },
                      ListItemBorder: {
                          type: "boolean",
                          component: "switch",
                          label: "Border",
                          ref: "ListItemBorderSwitch",
                          options: [{
                                  value: true,
                                  label: "Enabled",
                              },
                              {
                                  value: false,
                                  label: "Disabled",
                              },
                          ],
                          defaultValue: true,
                      },
                      ListItemBorderType: {
                          ref: "ListItemBorderType",
                          label: "Border Type Select",
                          component: "dropdown",
                          type: "string",
                          options: [{
                                  label: "Solid",
                                  value: "solid",
                              },
                              {
                                  label: "Dotted",
                                  value: "dotted",
                              },
                              {
                                  label: "Dashed",
                                  value: "dashed",
                              },
                              {
                                  label: "Double",
                                  value: "double",
                              },
                              {
                                  label: "None",
                                  value: "none",
                              },
                          ],
                          defaultValue: "solid",
                          show: function(e) {
                              return e.ListItemBorderSwitch;
                          },
                      },
                      ListItemBorderWidth: {
                          type: "number",
                          component: "slider",
                          label: "Border Width (px)",
                          ref: "ListItemBorderWidth",
                          min: 0,
                          max: 5,
                          step: 1,
                          defaultValue: 1,
                          show: function(e) {
                              return e.ListItemBorderSwitch;
                          },
                      },
                      ListItemBorderColor: {
                          label: "Border Color",
                          ref: "ListItemBorderColor",
                          component: "color-picker",
                          type: "object",
                          defaultValue: {
                              color: "#ddd",
                          },
                          show: function(e) {
                              return e.ListItemBorderSwitch;
                          },
                      },
                  },
              },
              DropdownSettings: {
                  type: "items",
                  label: "Dropdown Settings",
                  items: {
                      DropdownHeightSlider: {
                          type: "number",
                          component: "slider",
                          label: "Height (px)",
                          ref: "DropdownHeight",
                          min: 0,
                          max: 50,
                          step: 1,
                          defaultValue: 30,
                          show: function(e) {
                              return e.DropdownHeight;
                          },
                      },
                      DropdownWidthSlider: {
                          type: "number",
                          component: "slider",
                          label: "Width (%)",
                          ref: "DropdownWidth",
                          min: 0,
                          max: 100,
                          step: 10,
                          defaultValue: 100,
                          show: function(e) {
                              return e.DropdownWidth;
                          },
                      },
                      DropdownBackgroundColor: {
                        label: "Background Color",
                        ref: "DropdownBgColorPicker",
                        component: "color-picker",
                        type: "object",
                        defaultValue: {
                            color: "#fff",
                        },
                        show: function(e) {
                            return e.DropdownBgColorPicker;
                        },
                    },
                  },
              },
              ButtonGroupSettings: {
                  type: "items",
                  label: "Button Group Settings",
                  items: {
                      BtnFontsizeSlider: {
                          type: "number",
                          component: "slider",
                          label: "Font Size (px)",
                          ref: "BtnFontsize",
                          min: 0,
                          max: 50,
                          step: 1,
                          defaultValue: 13,
                          show: function(e) {
                              return e.BtnFontsize;
                          },
                      },
                      BtnHeightSlider: {
                          type: "number",
                          component: "slider",
                          label: "Height (px)",
                          ref: "BtnHeight",
                          min: 0,
                          max: 50,
                          step: 1,
                          defaultValue: 28,
                          show: function(e) {
                              return e.BtnHeight;
                          },
                      },
                      BtnOrientation: {
                          type: "string",
                          component: "buttongroup",
                          label: "Orientation",
                          ref: "BtnOrientation",
                          options: [{
                                  value: "inline",
                                  label: "Horizontal",
                                  tooltip: "Select for horizontal",
                              },
                              {
                                  value: "block",
                                  label: "Vertical",
                                  tooltip: "Select for vertical",
                              },
                          ],
                          defaultValue: "inline",
                      },
                      BtnSpacingSlider: {
                          type: "number",
                          component: "slider",
                          label: "Spacing (px)",
                          ref: "BtnSpacing",
                          min: 0,
                          max: 50,
                          step: 1,
                          defaultValue: 3,
                          show: function(e) {
                              return e.BtnSpacing;
                          },
                      },
                      BtnGrouped: {
                          items: {
                              MyCheckProp: {
                                  type: "boolean",
                                  label: "Grouped",
                                  ref: "BtnGrouped",
                                  defaultValue: false,
                              },
                          },
                      },
                      BtnFontFamilyLui: {
                          ref: "BtnFontFamilySelect",
                          label: "Font Family Select",
                          component: "dropdown",
                          type: "string",
                          options: [{
                                  label: "QlikView Sans, sans-serif",
                                  value: "QlikView Sans, sans-serif",
                              },
                              {
                                  label: "Arial",
                                  value: "Arial",
                              },
                              {
                                  label: "Helvetica",
                                  value: "Helvetica",
                              },
                              {
                                  label: "Tahoma",
                                  value: "Tahoma",
                              },
                              {
                                  label: "Verdana",
                                  value: "Verdana",
                              },
                              {
                                  label: "Comic Sans MS",
                                  value: "Comic Sans MS",
                              },
                              {
                                  label: "Times New Roman",
                                  value: "Times New Roman",
                              },
                              {
                                  label: "Courier New",
                                  value: "Courier New",
                              },
                              {
                                  label: "Define your own",
                                  value: "own",
                              },
                          ],
                          defaultValue: "QlikView Sans, sans-serif",
                      },
                      BtnFontStyle: {
                          ref: "BtnFontStyle",
                          translation: "Font Style",
                          type: "string",
                          component: "dropdown",
                          options: [{
                                  value: "normal",
                                  label: "Normal"
                              },
                              {
                                  value: "bold",
                                  label: "Bold"
                              },
                              {
                                  value: "italic",
                                  label: "Italic"
                              },
                              {
                                  value: "underline",
                                  label: "Underline"
                              },
                          ],
                          defaultValue: "normal",
                      },
                      BtnBorder: {
                          type: "boolean",
                          component: "switch",
                          label: "Border",
                          ref: "BtnBorderSwitch",
                          options: [{
                                  value: true,
                                  label: "Enabled",
                              },
                              {
                                  value: false,
                                  label: "Disabled",
                              },
                          ],
                          defaultValue: true,
                      },
                      BtnBorderType: {
                          ref: "BtnBorderType",
                          label: "Border Type Select",
                          component: "dropdown",
                          type: "string",
                          options: [{
                                  label: "Solid",
                                  value: "solid",
                              },
                              {
                                  label: "Dotted",
                                  value: "dotted",
                              },
                              {
                                  label: "Dashed",
                                  value: "dashed",
                              },
                              {
                                  label: "Double",
                                  value: "double",
                              },
                              {
                                  label: "None",
                                  value: "none",
                              },
                          ],
                          defaultValue: "solid",
                          show: function(e) {
                              return e.BtnBorderSwitch;
                          },
                      },
                      BtnBorderWidth: {
                          type: "number",
                          component: "slider",
                          label: "Border Width (px)",
                          ref: "BtnBorderWidth",
                          min: 0,
                          max: 5,
                          step: 1,
                          defaultValue: 1,
                          show: function(e) {
                              return e.BtnBorderSwitch;
                          },
                      },
                      BtnBorderColor: {
                          label: "Border Color",
                          ref: "BtnBorderColor",
                          component: "color-picker",
                          type: "object",
                          defaultValue: {
                              color: "#ddd",
                          },
                          show: function(e) {
                              return e.BtnBorderSwitch;
                          },
                      },
                      BtnGlobalRadiusSlider: {
                          type: "number",
                          component: "slider",
                          label: "Global Radius (px)",
                          ref: "BtnGlobalRadius",
                          min: 0,
                          max: 50,
                          step: 1,
                          defaultValue: 20,
                          show: function(e) {
                              return e.BtnGlobalRadius;
                          },
                      },
                      BtnTopLeftRadiusSlider: {
                          type: "number",
                          component: "slider",
                          label: "Top Left Radius (px)",
                          ref: "BtnTopLeftRadius",
                          min: 0,
                          max: 50,
                          step: 1,
                          defaultValue: 20,
                          show: function(e) {
                              return e.BtnTopLeftRadius;
                          },
                      },
                      BtnTopRightRadiusSlider: {
                          type: "number",
                          component: "slider",
                          label: "Top Right Radius (px)",
                          ref: "BtnTopRightRadius",
                          min: 0,
                          max: 50,
                          step: 1,
                          defaultValue: 20,
                          show: function(e) {
                              return e.BtnTopRightRadius;
                          },
                      },
                      BtnBottomRightRadiusSlider: {
                          type: "number",
                          component: "slider",
                          label: "Bottom Right Radius (px)",
                          ref: "BtnBottomRightRadius",
                          min: 0,
                          max: 50,
                          step: 1,
                          defaultValue: 20,
                          show: function(e) {
                              return e.BtnBottomRightRadius;
                          },
                      },
                      BtnBottomLeftRadiusSlider: {
                          type: "number",
                          component: "slider",
                          label: "Bottom Left Radius (px)",
                          ref: "BtnBottomLeftRadius",
                          min: 0,
                          max: 50,
                          step: 1,
                          defaultValue: 20,
                          show: function(e) {
                              return e.BtnBottomLeftRadius;
                          },
                      },
                  },
              },
              AdditionalColorSettings: {
                  type: "items",
                  label: "Color Settings",
                  items: {
                    aboutcolorSettings: {
                      component: "text",
                      label: `Color Settings for Listbox, Dropdown and Button Group:`
                  },
                      PossibleBgColor: {
                          label: "Possible Bg Color",
                          ref: "PossibleBgColorPicker",
                          component: "color-picker",
                          type: "object",
                          defaultValue: {
                              color: "#fff",
                          },
                          show: function(e) {
                              return e.PossibleBgColorPicker;
                          },
                      },
                      PossibleFontColor: {
                          label: "Possible Font Color",
                          ref: "PossibleFontColorPicker",
                          component: "color-picker",
                          type: "object",
                          defaultValue: {
                              color: "#595959",
                          },
                          show: function(e) {
                              return e.PossibleFontColorPicker;
                          },
                      },
                      SelectedBgColor: {
                          label: "Selected Bg Color",
                          ref: "SelectedBgColorPicker",
                          component: "color-picker",
                          type: "object",
                          defaultValue: {
                              color: "#009845",
                          },
                          show: function(e) {
                              return e.SelectedBgColorPicker;
                          },
                      },
                      SelectedFontColor: {
                          label: "Selected Font Color",
                          ref: "SelectedFontColorPicker",
                          component: "color-picker",
                          type: "object",
                          defaultValue: {
                              color: "#fff",
                          },
                          show: function(e) {
                              return e.SelectedFontColorPicker;
                          },
                      },
                      AlternateBgColor: {
                          label: "Alternate Bg Color",
                          ref: "AlternateBgColorPicker",
                          component: "color-picker",
                          type: "object",
                          defaultValue: {
                              color: "#ddd",
                          },
                          show: function(e) {
                              return e.AlternateBgColorPicker;
                          },
                      },
                      AlternateFontColor: {
                          label: "Alternate Font Color",
                          ref: "AlternateFontColorPicker",
                          component: "color-picker",
                          type: "object",
                          defaultValue: {
                              color: "#595959",
                          },
                          show: function(e) {
                              return e.AlternateFontColorPicker;
                          },
                      },
                      ExcludedBgColor: {
                          label: "Excluded Bg Color",
                          ref: "ExcludedBgColorPicker",
                          component: "color-picker",
                          type: "object",
                          defaultValue: {
                              color: "#a9a9a9",
                          },
                          show: function(e) {
                              return e.ExcludedBgColorPicker;
                          },
                      },
                      ExcludedFontColor: {
                          label: "Excluded Font Color",
                          ref: "ExcludedFontColorPicker",
                          component: "color-picker",
                          type: "object",
                          defaultValue: {
                              color: "#fff",
                          },
                          show: function(e) {
                              return e.ExcludedFontColorPicker;
                          },
                      },
                  },
              },
          },
      },
      InteractivitySettings: {
          type: "items",
          label: "Interactivity Settings",
          items: {
              EnableSelections: {
                  type: "boolean",
                  component: "switch",
                  label: "Selections",
                  ref: "enableSelections",
                  options: [{
                          value: true,
                          label: "Enable",
                      },
                      {
                          value: false,
                          label: "Disable",
                      },
                  ],
                  defaultValue: true,
              },
              SelectionUIType: {
                  type: "string",
                  component: "dropdown",
                  label: "Selection Type",
                  ref: "SelectionUIType",
                  options: [{
                          value: "vlist",
                          label: "Standard list",
                      },
                      {
                          value: "luicheckbox",
                          label: "Add Checkboxes",
                      },
                      {
                          value: "luiradio",
                          label: "Add Radio buttons",
                      },
                  ],
                  defaultValue: "vlist",
                  show: function(d) {
                      //return d.SelectionUIType == "vlist";
                      return d.enableSelections;
                  },
              },
              MultiSelect: {
                  type: "string",
                  component: "radiobuttons",
                  label: "Selection Mode",
                  ref: "multiSelect",
                  options: [{
                          value: true,
                          label: "Multi Select",
                      },
                      {
                          value: false,
                          label: "Single Select",
                      },
                  ],
                  defaultValue: true,
                  show: function(d) {
                      return d.enableSelections;
                  },
              },
              defaultSelection: {
                  type: "string",
                  ref: "defaultSelection",
                  label: "Default Value",
                  expression: "optional",
                  show: function(d) {
                      return d.enableSelections && !d.multiSelect;
                  },
              },
              SelectMultipleYN: {
                  ref: "selectMultipleYN",
                  type: "boolean",
                  label: "Select Multiple Default Values?",
                  defaultValue: false,
                  show: function(d) {
                      return d.enableSelections && d.multiSelect;
                  },
              },
              selectAlsoDefaults: {
                  type: "string",
                  label: "Select also these as default, separate by ,",
                  ref: "selectAlsoThese",
                  defaultValue: "",
                  show: function(d) {
                      return d.enableSelections && d.multiSelect && d.selectMultipleYN;
                  },
                  expression: "optional",
              },
              EnableSelectionsMenu: {
                  type: "boolean",
                  component: "switch",
                  label: "Selections Menu Bar",
                  ref: "enableSelectionsMenu",
                  options: [{
                          value: true,
                          label: "Enable",
                      },
                      {
                          value: false,
                          label: "Disable",
                      },
                  ],
                  defaultValue: true,
                  show: function(d) {
                      return d.enableSelections;
                  },
              },
              SelectionsMenuItemListSelectAll: {
                  type: "boolean",
                  label: "Select All",
                  ref: "enableSelectAll",
                  defaultValue: true,
                  show: function(d) {
                      return d.enableSelections && d.enableSelectionsMenu;
                  },
              },
              SelectionsMenuItemListSelectExcluded: {
                  type: "boolean",
                  label: "Select Excluded",
                  ref: "enableSelectExcluded",
                  defaultValue: true,
                  show: function(d) {
                      return d.enableSelections && d.enableSelectionsMenu;
                  },
              },
              SelectionsMenuItemListSelectPossible: {
                  type: "boolean",
                  label: "Select Possible",
                  ref: "enableSelectPossible",
                  defaultValue: true,
                  show: function(d) {
                      return d.enableSelections && d.enableSelectionsMenu;
                  },
              },
              SelectionsMenuItemListSelectAlternative: {
                  type: "boolean",
                  label: "Select Alternative",
                  ref: "enableSelectAlternative",
                  defaultValue: true,
                  show: function(d) {
                      return d.enableSelections && d.enableSelectionsMenu;
                  },
              },
              SelectionsMenuItemListClearAll: {
                  type: "boolean",
                  label: "Clear All",
                  ref: "enableClearAll",
                  defaultValue: true,
                  show: function(d) {
                      return d.enableSelections && d.enableSelectionsMenu;
                  },
              },
              SelectionsMenuItemListLockField: {
                  type: "boolean",
                  label: "Lock Field",
                  ref: "enableLockField",
                  defaultValue: true,
                  show: function(d) {
                      return d.enableSelections && d.enableSelectionsMenu;
                  },
              },
              SelectionsMenuItemListUnLockField: {
                  type: "boolean",
                  label: "Unlock Field",
                  ref: "enableUnlockField",
                  defaultValue: true,
                  show: function(d) {
                      return d.enableSelections && d.enableSelectionsMenu;
                  },
              },
          },
      },
      dataHandling: {
          uses: 'dataHandling'
      },
      about: {
        label: "About",
        component: "items",
        items: {
          header: { label: "Advanced Filter", style: "header", component: "text" },
          paragraph1: {
            label:
              "A filter object that allows a user to make selections in a field.",
            component: "text",
          }
        },
      },
  },
};
