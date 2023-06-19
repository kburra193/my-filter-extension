export default {
  type: "items",
  component: "accordion",
  items: {
    dimensions: {
      type: "array",
      ref: "lists",
      label: "Dimensions",
      allowAdd: true,
      allowRemove: true,
      addTranslation: "Add Field",
      itemTitleRef: function (data) {
        return data.fieldLabel
          ? data.fieldLabel
          : data.qListObjectDef.qDef.qFieldDefs[0];
      },
      items: {
        aboutdimSettings: {
          component: "text",
          label: `Pick one dimension field first!
              Use dimension field label option for custom label.
              Use UI type for listbox, dropdown or button group.`,
        },
        field: {
          type: "string",
          expression: "always",
          expressionType: "dimension",
          ref: "qListObjectDef.qDef.qFieldDefs.0",
          label: "Field",
        },
        showAlternatives: { // This will make alternatives show up as 'A' instead of 'X'
          type: "boolean",
          label: "Show Alternatives",
          ref: "qListObjectDef.qShowAlternatives",
          defaultValue: true,
          show: false,
        },
        qAutoSortByState: { // This will sort the listbox by state by default
          type: "number",
          label: "Sort by State by Default",
          ref: "qListObjectDef.qAutoSortByState.qDisplayNumberOfRows",
          defaultValue: 1,
          show: false,
        },
        fieldLabel: {
          type: "string",
          expression: "optional",
          ref: "fieldLabel",
          label: "Label",
        },
        SortSettings: {
            ref:"SortSettings",
            translation:"Sort Criteria",
            type:"numeric",
            component:"dropdown",
            options:[{
                value: 0,
                label: "Logical State"
            },{
                value: 1,
                label: "Numeric Value"
            },{
                value: 2,
                label: "Alphabetical Order"
            },{
                value: 3,
                label: "Initial Load Order"
            },{
                value: 4,
                label: "Expression"
            }],
            defaultValue:0
        },
        qSortByState:{
            ref:"qListObjectDef.qDef.qSortCriterias.0.qSortByState",
            translation:"Sort by State",
            type:"numeric",
            component:"dropdown",
            options:[{
                value:1,
                label:"Ascending"
            },{
                value:0,
                label:"None"
            },{
                value:-1,
                label:"Descending"
            }],
            defaultValue:0,
            show: function(data) {
                return data.SortSettings == 0;
            }
        },
        qSortByNumeric:{
            ref:"qListObjectDef.qDef.qSortCriterias.0.qSortByNumeric",
            translation:"Sort Numerically",
            type:"numeric",
            component:"dropdown",
            options:[{
                value:1,
                label:"Ascending"
            },{
                value:0,
                label:"None"
            },{
                value:-1,
                label:"Descending"
            }],
            defaultValue:0,
            show: function(data) {
                return data.SortSettings == 1;
            }
        },
        qSortByAscii:{
            ref:"qListObjectDef.qDef.qSortCriterias.0.qSortByAscii",
            translation:"Sort Alphabetically",
            type:"numeric",
            component:"dropdown",
            options:[{
                value:1,
                label:"Ascending"
            },{
                value:0,
                label:"None"
            },{
                value:-1,
                label:"Descending"
            }],
            defaultValue:0,
            show: function(data) {
                return data.SortSettings == 2;
            }
        },
        qSortByLoadOrder:{
            ref:"qListObjectDef.qDef.qSortCriterias.0.qSortByLoadOrder",
            translation:"Sort by Load Order",
            type:"numeric",
            component:"dropdown",
            options:[{
                value:1,
                label:"Ascending"
            },{
                value:0,
                label:"None"
            },{
                value:-1,
                label:"Descending"
            }],
            defaultValue:0,
            show: function(data) {
                return data.SortSettings == 3;
            }
        },
        qSortByExpression:{
            ref:"qListObjectDef.qDef.qSortCriterias.0.qSortByExpression",
            translation:"Sort by Expression",
            type:"numeric",
            component:"dropdown",
            options:[{
                value:1,
                label:"Ascending"
            },{
                value:0,
                label:"None"
            },{
                value:-1,
                label:"Descending"
            }],
            defaultValue:0,
            show: function(data) {
                return data.SortSettings == 4;
            }
        },
        qExpression:{
            ref:"qListObjectDef.qDef.qSortCriterias.0.qExpression",
            translation:"Expression",
            type:"string",
            expression:"always",
            expressionType: "dimension",
            defaultValue:"",
            show: function(data) {
                return data.SortSettings == 4;
            }
        },
        initialDataFetchWidth: {
          type: "number",
          ref: "qListObjectDef.qInitialDataFetch.0.qWidth",
          label: "qWidth",
          show: false,
          defaultValue: 2,
        },
        dataSizeSwitch: {
          type: "boolean",
          ref: "dataSizeSwitch",
          label: "Data Size",
          component: "switch",
          defaultValue: false,
          options: [
            {
              value: false,
              label: "Default",
            },
            {
              value: true,
              label: "Custom",
            },
          ],
          show: function (d) {
            return false;
          },
        },
        initialDataFetchHeight: {
          type: "number",
          ref: "qListObjectDef.qInitialDataFetch.0.qHeight",
          label: "Data size limit",
          show: (data) => {
            return data.dataSizeSwitch;
          },
          defaultValue: 200,
        },
        ui: {
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
        SelectionUIType: {
          type: "string",
          component: "dropdown",
          label: "Selection Type",
          ref: "SelectionUIType",
          options: [
            {
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
          show: function (d) {
            //return d.SelectionUIType == "vlist";
            return d.ui == "listbox" || d.ui == "dropdown";
            //return true;
          },
        },
        multiSelection:{
          type: "boolean",
          component: "switch",
          label: "Multiselect",
          ref: "multiSelectionEnabled",
          options: [
            { value: !0, translation: "properties.on" },
            { value: !1, translation: "properties.off" },
          ],
          defaultValue: !0
        },
        defaultSelectionSwitch: {
            type: "boolean",
            component: "switch",
            label: "Default Selections",
            ref: "defaultselectionsEnabled",
            options: [
              { value: !0, translation: "properties.on" },
              { value: !1, translation: "properties.off" },
            ],
            defaultValue: !1
          },
          aboutdefaultSelection: {
            component: "text",
            label: `Use similar logic to search in filter for default values entry. For mutiple default values: we enter in this format "value1" + "value2"' . Also attaching the link for help. Entry format should be same as your date field orginal format.`,
            show: function(d) {
                return  d.defaultselectionsEnabled;
              },
          },
          aboutdefaultSelectionLink: {
            label: "Link",
            component: "link",
            url: "https://help.qlik.com/en-US/sense/February2021/Subsystems/Hub/Content/Sense_Hub/Selections/SelectionsToolbar/search-selections.htm#anchor-1",
            show: function(d) {
                return  d.defaultselectionsEnabled;
              },
        },
          defaultSelection: {
            type: "string",
            ref: "defaultSelection",
            label: 'Add example here: "value1" + "value2"',
            expression: "optional",
            show: function(d) {
              return  d.defaultselectionsEnabled;
            },
          },
          EnableSearch: {
            type: "boolean",
            component: "switch",
            label: "Search bar",
            ref: "enableSearch",
            options: [
              {
                value: true,
                label: "Enable",
              },
              {
                value: false,
                label: "Disable",
              },
            ],
            defaultValue: true,
            show: function (d) {
              return true;
            },
          },
      },
    },

    appearance: {
      uses: "settings",
      items: {
        AdditionalColorSettings: {
          type: "items",
          label: "Color Settings",
          items: {
            aboutcolorSettings: {
              component: "text",
              label: `Color Settings for Listbox, Dropdown and Button Group:`,
            },
            PossibleBgColor: {
              label: "Possible Bg Color",
              ref: "PossibleBgColorPicker",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#fff",
              },
              show: function (e) {
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
              show: function (e) {
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
              show: function (e) {
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
              show: function (e) {
                return e.SelectedFontColorPicker;
              },
            },
            AlternateBgColor: {
              label: "Alternate Bg Color",
              ref: "AlternateBgColorPicker",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "lightgray",
              },
              show: function (e) {
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
              show: function (e) {
                return e.AlternateFontColorPicker;
              },
            },
            ExcludedBgColor: {
              label: "Excluded Bg Color",
              ref: "ExcludedBgColorPicker",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "darkgray",
              },
              show: function (e) {
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
              show: function (e) {
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
        EnableSelectionsMenu: {
          type: "boolean",
          component: "switch",
          label: "Selections Menu Bar",
          ref: "enableSelectionsMenu",
          options: [
            {
              value: true,
              label: "Enable",
            },
            {
              value: false,
              label: "Disable",
            },
          ],
          defaultValue: true,
          show: function (d) {
            return true;
          },
        },
        SelectionsMenuItemListSelectAll: {
          type: "boolean",
          label: "Select All",
          ref: "enableSelectAll",
          defaultValue: true,
          show: function (d) {
            return d.enableSelectionsMenu;
          },
        },
        SelectionsMenuItemListSelectExcluded: {
          type: "boolean",
          label: "Select Excluded",
          ref: "enableSelectExcluded",
          defaultValue: true,
          show: function (d) {
            return d.enableSelectionsMenu;
          },
        },
        SelectionsMenuItemListSelectPossible: {
          type: "boolean",
          label: "Select Possible",
          ref: "enableSelectPossible",
          defaultValue: true,
          show: function (d) {
            return d.enableSelectionsMenu;
          },
        },
        SelectionsMenuItemListSelectAlternative: {
          type: "boolean",
          label: "Select Alternative",
          ref: "enableSelectAlternative",
          defaultValue: true,
          show: function (d) {
            return d.enableSelectionsMenu;
          },
        },
        SelectionsMenuItemListClearAll: {
          type: "boolean",
          label: "Clear All",
          ref: "enableClearAll",
          defaultValue: true,
          show: function (d) {
            return d.enableSelectionsMenu;
          },
        },
        SelectionsMenuItemListLockField: {
          type: "boolean",
          label: "Lock Field",
          ref: "enableLockField",
          defaultValue: true,
          show: function (d) {
            return d.enableSelectionsMenu;
          },
        },
        SelectionsMenuItemListUnLockField: {
          type: "boolean",
          label: "Unlock Field",
          ref: "enableUnlockField",
          defaultValue: true,
          show: function (d) {
            return d.enableSelectionsMenu;
          },
        },
      },
    },

    dataHandling: {
      uses: "dataHandling",
    },
    about: {
      label: "About",
      component: "items",
      items: {
        header: {
          label: "Advanced Filter",
          style: "header",
          component: "text",
        },
        paragraph1: {
          label:
            "A filter object that allows a user to make selections in a field.",
          component: "text",
        },
      },
    },
  },
};
