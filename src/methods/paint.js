var qlik = window.require("qlik");
var app = qlik.currApp();

export default async function ($element, layout) {
  var self = this;
  const $$scope = this.$scope;
  $$scope.mode = qlik.navigation.getMode();
  $$scope.height = $element.height();
  $$scope.width = $element.width();
  console.log("paint layout", layout);
  $$scope.qId = layout.qInfo.qId;
  $$scope.qListObject = layout.qListObject;
  $$scope.dimensionsLabel = layout.qListObject.qDimensionInfo.qFallbackTitle;
  $$scope.rows = layout.qListObject.qDataPages[0].qMatrix.flat();
  $$scope.listUiType = layout.SelectionUIType;
  var qTop = 0;
  var qHeight = 10;
  //Create Session Object for Selections and Search Functionality
  var listObj = self.backendApi.model;
  console.log("extension backendapi", self.backendApi);
  console.log("new session object", listObj);
  //Paginate
  $$scope.paginateList = async function () {
    qTop = qTop + 1;
    const pages = await getListData(listObj, qTop, qHeight);
    // Issue: missing the `"qFrequencyMode": "V"` param when getting more pages...
    $$scope.rows = $$scope.rows.concat(pages.flat());
    // Issue: when applying selection (paint is firing) - the list shrinks back to original page
    // is it an issue or "as designed"?
  };
  var enableSelections = layout.enableSelections;
  $$scope.enableSelections = enableSelections;
  var multiSelect = layout.multiSelect;
  var dragSelect = layout.dragSelect;
  var defaultSelection = layout.defaultSelection,
    defaultvalue,
    hasSelection = this.backendApi.hasSelections();
  var selectAlsoThese = layout.selectAlsoThese;
  var defaultselectionList = selectAlsoThese.split(",");
  var data = [];
  var multipleselectValues = [];
  // Logic for Single Default Values
  if (enableSelections && multiSelect == false) {
    layout.qListObject.qDataPages[0].qMatrix.forEach(function (row) {
      if (defaultSelection == row[0].qText) {
        defaultvalue = row[0].qElemNumber;
      }
    });
    if (!hasSelection) {
      self.backendApi.selectValues(0, [defaultvalue], true);
    }
  }
  // Logic for Multiple Default Values
  if (enableSelections && multiSelect == true && selectAlsoThese) {
    this.backendApi.eachDataRow(function (rownum, row) {
      if (row[0].qState === "S") {
        selected = 1;
      }
      data.push(row[0]);
    });
    console.log("new selected data", data);
    for (var i = 0; i < data.length; i++) {
      var text = data[i].qText;
      if (!hasSelection) {
        if (defaultselectionList.length > 0) {
          for (var v = 0; v < defaultselectionList.length; v++) {
            if (data[i].qText == defaultselectionList[v]) {
              multipleselectValues.push(data[i].qElemNumber);
              console.log("multipleselectValues", multipleselectValues);
            }
          }
        }
      } else {
        multipleselectValues.push(data[i].qElemNumber);
      }
    }
    if (!hasSelection) {
      self.backendApi.selectValues(0, multipleselectValues, true);
    }
  }
  var elNumbersToSelect = [];
  //Logic for Drag Select
  var currentStartDrgElNum;
  $$scope.setStartElNum = function (elNum) {
    currentStartDrgElNum = elNum;
  };
  var beginSelections = false;
  $$scope.dragHandler = function (endElNum) {
    //if (currentStartDrgElNum == endElNum)
    //if (enableSelections && multiSelect == true && dragSelect) {
    if (enableSelections) {
      $$scope.showSelectionToolbar = true;
      //console.log(currentStartDrgElNum, endElNum);
      // logic for finding the set of items to select
      if (currentStartDrgElNum < endElNum) {
        for (var i = currentStartDrgElNum; i <= endElNum; i++) {
          elNumbersToSelect.push(i);
        }
      } else if (currentStartDrgElNum > endElNum) {
        for (var i = currentStartDrgElNum; i >= endElNum; i--) {
          elNumbersToSelect.push(i);
        }
      } else if (currentStartDrgElNum == endElNum) {
        // mouse down and up on the same value - click
        console.log("one value clicked on");
        $$scope.applySelection(endElNum);
      }
      $$scope.rows = $$scope.rows.map((i) => {
        // toggle selected for the items we dragged through, temp ui until engine applies selection
        return {
          qText: i.qText,
          qElemNumber: i.qElemNumber,
          qFrequency: i.qFrequency,
          qState: i.qState,
          selected: elNumbersToSelect.includes(i.qElemNumber) ? "selected" : "",
        };
      });
      if (!beginSelections) {
        beginSelections = true;
        listObj.beginSelections({ qPaths: ["/qListObjectDef"] });
      }
      listObj.selectListObjectValues({
        qPath: "/qListObjectDef",
        qValues: elNumbersToSelect,
        qToggleMode: true,
        //qSoftLock: true,
      });
    }
  };
  //Selections Functionality on
  $$scope.applySelection = async function (elemNumber) {
    if (!enableSelections || $$scope.mode != "analysis") return;
    $$scope.showSelectionToolbar = true;
    const index = elNumbersToSelect.indexOf(elemNumber);
    if (index > -1) {
      // only splice array when item is found
      elNumbersToSelect.splice(index, 1); // 2nd parameter means remove one item only
    } else {
      elNumbersToSelect.push(elemNumber);
    }
    $$scope.rows = $$scope.rows.map((i) => {
      // toggle selected for the items we dragged through, temp ui until engine applies selection
      return {
        qText: i.qText,
        qElemNumber: i.qElemNumber,
        qFrequency: i.qFrequency,
        qState: i.qState,
        selected: elNumbersToSelect.includes(i.qElemNumber) ? "selected" : "",
      };
    });
    if (multiSelect == true) {
      if (!beginSelections) {
        beginSelections = true;
        listObj.beginSelections({ qPaths: ["/qListObjectDef"] });
      }
    }
    listObj.selectListObjectValues({
      qPath: "/qListObjectDef",
      qValues: [elemNumber],
      qToggleMode: multiSelect, // if multiselect - pass true to toggle mode
      // qSoftLock: true,
    });
  };
  // approve selection
  $$scope.endSelections = function (approve) {
    console.log("approve selections?", approve);
    if (!approve) $$scope.clearAll();
    listObj.abortListObjectSearch({ qPath: "/qListObjectDef" });
    listObj.endSelections({
      qAccept: approve,
    });
    $$scope.showSelectionToolbar = false;
    beginSelections = false;
    elNumbersToSelect = [];
    //Close
    $(".dropdown-list .listbox").removeClass("active");
  };

  $$scope.selectionsMenuBar = function (item) {
    var items = {
      selectAll: function () {
        app.field($$scope.dimensionsLabel).selectAll();
      },
      clearAll: function () {
        app.field($$scope.dimensionsLabel).clear();
      },
      selectExcluded: function () {
        app.field($$scope.dimensionsLabel).selectExcluded();
      },
      selectPossible: function () {
        app.field($$scope.dimensionsLabel).selectPossible();
      },
      selectAlternative: function () {
        app.field($$scope.dimensionsLabel).selectAlternative();
      },
      lockField: function () {
        app.field($$scope.dimensionsLabel).lock();
      },
      unlockField: function () {
        app.field($$scope.dimensionsLabel).unlock();
      },
    };
    return items[item]() || "not found";
  };

  //Search Functionality
  $$scope.searchFieldDataForString = async function (string) {
    var searchResults;
    if (string) {
      searchResults = await listObj.searchListObjectFor({
        qPath: "/qListObjectDef",
        qMatch: string,
      });
    } else {
      listObj.abortListObjectSearch({ qPath: "/qListObjectDef" });
    }
    const pages = await getListData(listObj, 0, qHeight);
    $$scope.rows = pages.flat();
  };
//To Clear Search
$$scope.clearsearchValue = async function () {
  listObj.abortListObjectSearch({ qPath: "/qListObjectDef" });
  var pages = await getListData(listObj, 0, qHeight);
  $$scope.rows = pages.flat();
};
  async function getListData(listObj, qTop, qHeight) {
    const result = await listObj.getListObjectData({
      qPath: "/qListObjectDef",
      qPages: [
        {
          qTop: qTop * qHeight,
          qLeft: 0,
          qHeight: qHeight,
          qWidth: 2,
        },
      ],
    });
    return result[0].qMatrix;
  }

  // To switch between listbox, dropdown and buttongroup
  $$scope.ui = layout.ui;
  $$scope.showButtongroup = false;
  $$scope.showDropdown = false;
  $$scope.showListbox = false;

  var maxListHeight = 85;
  // determine UI
  if ($$scope.ui == "listbox") {
    if ($$scope.height > maxListHeight) {
      $$scope.showListbox = true;
      $$scope.showDropdown = false;
      $$scope.listboxStyle = "";
    } else {
      $$scope.showListbox = false;
      $$scope.showDropdown = true;
      $$scope.listboxStyle = { position: "fixed", width: $$scope.width + "px" };
    }
  } else if ($$scope.ui == "buttongroup") {
    if ($$scope.height > maxListHeight) {
      $$scope.showButtongroup = true;
      $$scope.showDropdown = false;
    } else {
      $$scope.showButtongroup = false;
      $$scope.showDropdown = true;
      $$scope.listboxStyle = { position: "fixed", width: $$scope.width + "px" };
    }
  } else if ($$scope.ui == "dropdown") {
    if ($$scope.height > maxListHeight) {
      $$scope.showButtongroup = false;
      $$scope.showListbox = false;
      $$scope.showDropdown = true;
    } else {
      $$scope.showButtongroup = false;
      $$scope.showListbox = false;
      $$scope.showDropdown = true;
      $$scope.listboxStyle = { position: "fixed", width: $$scope.width + "px" };
    }
  }

  //Header Props
  //1.FontSize
  var HeaderFontsize = layout.HeaderFontsize;
  $$scope.HeaderFontsize = HeaderFontsize;
  //2.FontFamily
  var HeaderFontFamilySelect = layout.HeaderFontFamilySelect;
  $$scope.HeaderFontFamilySelect = HeaderFontFamilySelect;
  //3.FontStyle
  var HeaderFontStyle = layout.HeaderFontStyle;
  $$scope.HeaderFontStyle = HeaderFontStyle;
  //4.Color
  var HeaderColorSwitch = layout.HeaderColorSwitch;
  $$scope.HeaderColorSwitch = HeaderColorSwitch;
  var HeaderActiveColorPicker = layout.HeaderActiveColorPicker;
  $$scope.HeaderActiveColorPicker = HeaderActiveColorPicker;
  //5.Bg Color
  var HeaderBgColor = layout.HeaderBgColor;
  $$scope.HeaderBgColor = HeaderBgColor;
  //6.Alignment
  var HeaderAlign = layout.HeaderAlign;
  $$scope.HeaderAlign = HeaderAlign;
  //7.Hide/Show
  var HeaderShow = layout.HeaderShow;
  $$scope.HeaderShow = HeaderShow;
  ////Final Adding these to the layout
  $$scope.HeaderStyle = {
    display: HeaderShow == false ? "none" : "",
    "font-size": HeaderFontsize + "px",
    "font-family": HeaderFontFamilySelect,
    "font-style": HeaderFontStyle,
    "font-weight": layout.HeaderFontStyle == "bold" ? "bold" : "normal",
    "text-decoration":
      layout.HeaderFontStyle == "underline" ? "underline" : "none",
    color: layout.HeaderColorSwitch ? "#000000" : HeaderActiveColorPicker.color,
    "background-color": HeaderBgColor,
    "text-align": HeaderAlign,
  };
   //Cell Props
  //0.Height
  var ListItemHeight = layout.ListItemHeight;
  $$scope.ListItemHeight = ListItemHeight;
  //1.FontSize and Padding
  var ListItemFontsize = layout.ListItemFontsize;
  $$scope.ListItemFontsize = ListItemFontsize;
  //2.FontFamily
  var ListItemFontFamilySelect = layout.ListItemFontFamilySelect;
  $$scope.ListItemFontFamilySelect = ListItemFontFamilySelect;
  //3.FontStyle
  var ListItemFontStyle = layout.ListItemFontStyle;
  $$scope.ListItemFontStyle = ListItemFontStyle;
  //4.FontColor Bg Color Selected/Possible/Alternate/Exclude
  var ListItemFontColorPicker = layout.ListItemFontColorPicker;
  $$scope.ListItemFontColorPicker = ListItemFontColorPicker;

  //5.Alignment
  var ListItemAlign = layout.ListItemAlign;
  $$scope.ListItemAlign = ListItemAlign;
  //6.Border
  var ListItemBorderSwitch = layout.ListItemBorderSwitch;
  $$scope.ListItemBorderSwitch = ListItemBorderSwitch;
  var ListItemBorderType = layout.ListItemBorderType;
  $$scope.ListItemBorderType = ListItemBorderType;
  var ListItemBorderWidth = layout.ListItemBorderWidth;
  $$scope.ListItemBorderWidth = ListItemBorderWidth;
  var ListItemBorderColor = layout.ListItemBorderColor;
  $$scope.ListItemBorderColor = ListItemBorderColor;
  ////Final Adding these to the layout
  $$scope.CellStyle = {
    "font-size": ListItemFontsize + "px",
    height: ListItemHeight + "px",
    "font-family": ListItemFontFamilySelect,
    "font-style": ListItemFontStyle,
    "font-weight": layout.ListItemFontStyle == "bold" ? "bold" : "normal",
    "text-decoration":
      layout.ListItemFontStyle == "underline" ? "underline" : "none",
    color: ListItemFontColorPicker.color,
    // "background-color": layout.ListItemBgColorPicker.color,
    "text-align": ListItemAlign,
    "border-bottom-style": layout.ListItemBorderSwitch
      ? ListItemBorderType
      : "none",
    "border-bottom-width": layout.ListItemBorderSwitch
      ? ListItemBorderWidth + "px"
      : "0px",
    "border-bottom-color": layout.ListItemBorderSwitch
      ? ListItemBorderColor.color
      : "#000000",
  };
   //Dropdown Props
  //1.Height
  var DropdownHeight = layout.DropdownHeight;
  $$scope.DropdownHeight = DropdownHeight;
  //2.Width
  var DropdownWidth = layout.DropdownWidth;
  $$scope.DropdownWidth = DropdownWidth;
  ////Final Adding these to the layout
  $$scope.dropdownStyle = {
    height: DropdownHeight + "px",
    width: DropdownWidth + "%",
  };
  console.log("Dropdown Styling Object", $$scope.dropdownStyle);

  //Btn Props
  //1.FontSize, Height, Width , Spacing ,Grouped
  var BtnFontsize = layout.BtnFontsize;
  $$scope.BtnFontsize = BtnFontsize;
  //Height
  var BtnHeight = layout.BtnHeight;
  $$scope.BtnHeight = BtnHeight;
  //Width
  var BtnWidth = layout.BtnWidth;
  $$scope.BtnWidth = BtnWidth;
  //Display
  var BtnOrientation = layout.BtnOrientation;
  $$scope.BtnOrientation = BtnOrientation;
  //Spacing/Margin
  var BtnSpacing = layout.BtnSpacing;
  $$scope.BtnSpacing = BtnSpacing;
  //Grouped
  var BtnGrouped = layout.BtnGrouped;
  $$scope.BtnGrouped = BtnGrouped;
  //2.FontFamily
  var BtnFontFamilySelect = layout.BtnFontFamilySelect;
  $$scope.BtnFontFamilySelect = BtnFontFamilySelect;
  //3.FontStyle
  var BtnFontStyle = layout.BtnFontStyle;
  $$scope.BtnFontStyle = BtnFontStyle;
  //4.FontColor
  var BtnFontColorSwitch = layout.BtnFontColorSwitch;
  $$scope.BtnFontColorSwitch = BtnFontColorSwitch;
  var BtnFontActiveColorPicker = layout.BtnFontActiveColorPicker;
  $$scope.BtnFontActiveColorPicker = BtnFontActiveColorPicker;
  //5.Border
  var BtnBorderSwitch = layout.BtnBorderSwitch;
  $$scope.BtnBorderSwitch = BtnBorderSwitch;
  var BtnBorderType = layout.BtnBorderType;
  $$scope.BtnBorderType = BtnBorderType;
  var BtnBorderWidth = layout.BtnBorderWidth;
  $$scope.BtnBorderWidth = BtnBorderWidth;
  var BtnBorderColor = layout.BtnBorderColor;
  $$scope.BtnBorderColor = BtnBorderColor;
  //6.Radius
  var BtnGlobalRadius = layout.BtnGlobalRadius;
  $$scope.BtnGlobalRadius = BtnGlobalRadius;
  var BtnTopLeftRadius = layout.BtnTopLeftRadius;
  $$scope.BtnTopLeftRadius = BtnTopLeftRadius;
  var BtnTopRightRadius = layout.BtnTopRightRadius;
  $$scope.BtnTopRightRadius = BtnTopRightRadius;
  var BtnBottomRightRadius = layout.BtnBottomRightRadius;
  $$scope.BtnBottomRightRadius = BtnBottomRightRadius;
  var BtnBottomLeftRadius = layout.BtnBottomLeftRadius;
  $$scope.BtnBottomLeftRadius = BtnBottomLeftRadius;
  ////Final Adding these to the layout
  $$scope.BtnGroupStyle = {
    "font-size": BtnFontsize + "px",
    height: BtnHeight + "px",
    width: BtnWidth + "px",
    display: BtnOrientation,
    "margin-top": layout.BtnGrouped == true ? "0" : BtnSpacing + "px",
    "margin-right": layout.BtnGrouped == true ? "0" : BtnSpacing + "px",
    "margin-bottom": layout.BtnGrouped == true ? "0" : BtnSpacing + "px",
    "margin-left": layout.BtnGrouped == true ? "0" : BtnSpacing + "px",
    "font-family": BtnFontFamilySelect,
    "font-style": BtnFontStyle,
    "font-weight": layout.BtnFontStyle == "bold" ? "bold" : "normal",
    "text-decoration":
      layout.BtnFontStyle == "underline" ? "underline" : "none",
    color: layout.BtnFontColorSwitch
      ? "#000000"
      : BtnFontActiveColorPicker.color,
    "border-top-style": layout.BtnBorderSwitch ? BtnBorderType : "none",
    "border-right-style": layout.BtnBorderSwitch ? BtnBorderType : "none",
    "border-bottom-style": layout.BtnBorderSwitch ? BtnBorderType : "none",
    "border-left-style": layout.BtnBorderSwitch ? BtnBorderType : "none",
    "border-top-width": layout.BtnBorderSwitch ? BtnBorderWidth + "px" : "0px",
    "border-right-width": layout.BtnBorderSwitch
      ? BtnBorderWidth + "px"
      : "0px",
    "border-bottom-width": layout.BtnBorderSwitch
      ? BtnBorderWidth + "px"
      : "0px",
    "border-left-width": layout.BtnBorderSwitch ? BtnBorderWidth + "px" : "0px",
    "border-top-color": layout.BtnBorderSwitch
      ? BtnBorderColor.color
      : "#000000",
    "border-right-color": layout.BtnBorderSwitch
      ? BtnBorderColor.color
      : "#000000",
    "border-bottom-color": layout.BtnBorderSwitch
      ? BtnBorderColor.color
      : "#000000",
    "border-left-color": layout.BtnBorderSwitch
      ? BtnBorderColor.color
      : "#000000",
    "border-radius": (layout.BtnGrouped = true ? "0" : BtnGlobalRadius + "px"),
    "border-top-left-radius":
      layout.BtnGrouped == true ? "0" : BtnTopLeftRadius + "px",
    "border-top-right-radius":
      layout.BtnGrouped == true ? "0" : BtnTopRightRadius + "px",
    "border-bottom-right-radius":
      layout.BtnGrouped == true ? "0" : BtnBottomRightRadius + "px",
    "border-bottom-left-radius":
      layout.BtnGrouped == true ? "0" : BtnBottomLeftRadius + "px",
  };
   //Interactivity UI Props for Selections Menu
  $$scope.enableSelectionsMenu = layout.enableSelectionsMenu;
  $$scope.enableSelectionsMenu = {
    display: layout.enableSelectionsMenu == true ? "onset" : "none",
  };
  $$scope.enableSelectAll = layout.enableSelectAll;
  $$scope.enableSelectAll = {
    display: layout.enableSelectAll == true ? "onset" : "none",
  };
  $$scope.enableSelectExcluded = layout.enableSelectExcluded;
  $$scope.enableSelectExcluded = {
    display: layout.enableSelectExcluded == true ? "onset" : "none",
  };
  $$scope.enableSelectPossible = layout.enableSelectPossible;
  $$scope.enableSelectPossible = {
    display: layout.enableSelectPossible == true ? "onset" : "none",
  };
  $$scope.enableSelectAlternative = layout.enableSelectAlternative;
  $$scope.enableSelectAlternative = {
    display: layout.enableSelectAlternative == true ? "onset" : "none",
  };
  $$scope.enableClearAll = layout.enableClearAll;
  $$scope.enableClearAll = {
    display: layout.enableClearAll == true ? "onset" : "none",
  };
  $$scope.enableLockField = layout.enableLockField;
  $$scope.enableLockField = {
    display: layout.enableLockField == true ? "onset" : "none",
  };
  $$scope.enableUnlockField = layout.enableUnlockField;
  $$scope.enableUnlockField = {
    display: layout.enableUnlockField == true ? "onset" : "none",
  };
  //Additional colors logic
  var sheet = $(`style#css${layout.qInfo.qId}`);
  if (sheet.length == 0) {
    sheet = document.createElement(`style`);
    sheet.id = `css${layout.qInfo.qId}`;
  } else {
    sheet = sheet[0];
  }
  document.body.appendChild(sheet);
  sheet.innerHTML = `
  header#${$$scope.qId}_title { display: none; }
  #custom-filter-${$$scope.qId} .listbox .list-item.A {
    background-color: ${layout.ListItemAlternateBgColorPicker.color} !important;
    color: #595959 !important;
    border-bottom: 1px solid #fff !important;
  }
  #custom-filter-${$$scope.qId} .listbox .list-item.O {
    background-color: ${layout.ListItemPossibleBgColorPicker.color} !important;
    color: #595959 !important;
    border-bottom: 1px solid rgb(221, 221, 221) !important;
  }
  #custom-filter-${$$scope.qId} .listbox .list-item.X {
    color: #fff !important;
    background-color: ${layout.ListItemExcludedBgColorPicker.color} !important;
    border-bottom: 1px solid rgb(221, 221, 221) !important;
  }
  #custom-filter-${$$scope.qId} .listbox .list-item.S, #custom-filter-${$$scope.qId} .listbox .list-item.selected {
    background-color: ${layout.ListItemSelectedBgColorPicker.color} !important;
    color: #fff !important;
    border-bottom: 1px solid rgb(221, 221, 221) !important;
  }
  /* to remove some padding listbox */
  .qv-client.qv-card #qv-stage-container #grid .qv-object-wrapper .qv-inner-object{
    padding: 0px;
  }
  /** How to exclude this for checkbox and radio? */
  .listboxprops .list-item.vlist.S::before, .listboxprops .list-item.vlist.selected::before  {
    content: "✔";
    color: #fff;
    flex-grow: inherit;
    flex-shrink: 0;
    order: 4;
    padding: 0 6px 0 0;
    text-align: center;
    width: 16px;
    float: right;
  }
  `;
}
