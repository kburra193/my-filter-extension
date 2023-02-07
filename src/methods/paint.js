var qlik = window.require("qlik");
var app = qlik.currApp();

function getOccurence(array, value) {
  var count = 0;
  array.forEach((v) => v === value && count++);
  return count;
}

export default async function ($element, layout) {
  var self = this;
  const $$scope = this.$scope;
  $$scope.mode = qlik.navigation.getMode();
  $$scope.height = $element.height();
  $$scope.width = $element.width();
  $$scope.qId = layout.qInfo.qId;
  $$scope.dimensionsLabel = layout.qListObject.qDimensionInfo.qFallbackTitle;
  $$scope.label = layout.fieldLabel;
  $$scope.dataLength = layout.qListObject.qDataPages.length;
  $$scope.rows = layout.qListObject.qDataPages[0].qMatrix.flat();
  $$scope.listUiType = layout.SelectionUIType;
  var qTop = 0;
  var qHeight = 200;

  //Create Session Object for Selections and Search Functionality
  var listObj = self.backendApi.model;
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

  //Load More Button display none when pages max reached
  $$scope.displayMaxPage = "";
  var qCardinal = layout.qListObject.qDimensionInfo.qCardinal;
  if (qCardinal / qHeight - 1 < qTop) {
    $$scope.displayMaxPage = "none";
  } else {
    $$scope.displayMaxPage = "block";
  }
  //Paginate
  $$scope.paginateList = async function () {
    qTop = qTop + 1;
    const pages = await getListData(listObj, qTop, qHeight);
    // Issue: missing the `"qFrequencyMode": "V"` param when getting more pages...
    $$scope.rows = $$scope.rows.concat(pages.flat());
    // Issue: when applying selection (paint is firing) - the list shrinks back to original page
    // is it an issue or "as designed"?
    //Load More Button display none when pages max reached
    var qCardinal = layout.qListObject.qDimensionInfo.qCardinal;
    if (qCardinal / qHeight - 1 < qTop) {
      $$scope.displayMaxPage = "none";
    } else {
      $$scope.displayMaxPage = "block";
    }
  };
  var enableSelections = layout.enableSelections;
  $$scope.enableSelections = enableSelections;
  var multiSelect = layout.multiSelect;
  var defaultSelection = layout.defaultSelection,
    defaultvalue,
    selectioncount =
      listObj.layout.qListObject.qDimensionInfo.qStateCounts.qSelected;
  var selectAlsoThese = layout.selectAlsoThese;
  var defaultselectionList = selectAlsoThese.split(",");
  var data = [];
  var multipleselectValues = [];
  var selected = 0;

  // Logic for Single Default Values
  if (enableSelections && multiSelect == false) {
    layout.qListObject.qDataPages[0].qMatrix.forEach(function (row) {
      if (defaultSelection == row[0].qText) {
        defaultvalue = row[0].qElemNumber;
      }
    });
    if (selectioncount == 0) {
      listObj.selectListObjectValues({
        qPath: "/qListObjectDef",
        qValues: [defaultvalue],
        qToggleMode: false, // true for multi select
        //qSoftLock: true,
      });
    }
  }
  //Logic for Multiple Default Values
  if (enableSelections && multiSelect == true && selectAlsoThese) {
    layout.qListObject.qDataPages[0].qMatrix.forEach(function (row) {
      if (row[0].qState === "S") {
        selected = 1;
      }
      data.push(row[0]);
    });
    for (var i = 0; i < data.length; i++) {
      var text = data[i].qText;
      if (selectioncount == 0) {
        if (defaultselectionList.length > 0) {
          for (var v = 0; v < defaultselectionList.length; v++) {
            if (data[i].qText == defaultselectionList[v]) {
              multipleselectValues.push(data[i].qElemNumber);
            }
          }
        }
      } else {
        multipleselectValues.push(data[i].qElemNumber);
      }
    }
    if (selectioncount == 0) {
      listObj.selectListObjectValues({
        qPath: "/qListObjectDef",
        qValues: multipleselectValues,
        qToggleMode: true, // true for multi select
        //qSoftLock: true,
      });
    }
  }

  var dragging = false;
  var beginSelections = false;
  var startEl;
  var startElNum, endElNum;
  var elNumbersToSelect = [];

  $$scope.startDrag = function (el, event) {
    if (event.which !== 3 && enableSelections && $$scope.mode == "analysis") {
      startEl = el;
      startElNum = el.qElemNumber;
      dragging = true;
      // console.log("start with " + el.qText);
    }
  };

  $$scope.hoverHandler = function (el, event) {
    if (!dragging || !enableSelections || $$scope.mode != "analysis" || !multiSelect) return;
    // console.log("dragging over " + el.qText);
    // only apply selection if item is not already selected
    if (startEl.qState != "S") { // apply selection to start element if not already selected
      listObj
          .selectListObjectValues({
            qPath: "/qListObjectDef",
            qValues: [startEl.qElemNumber],
            qToggleMode: multiSelect, // true for multi select
            //qSoftLock: true,
          });
      $$scope.rows.filter((row) => row.qElemNumber == startEl.qElemNumber)[0].qState = "S";
    }

    if (el.qState != "S") { // apply selection to hovered element
      listObj
          .selectListObjectValues({
            qPath: "/qListObjectDef",
            qValues: [el.qElemNumber],
            qToggleMode: multiSelect, // true for multi select
            //qSoftLock: true,
          });
      $$scope.rows.filter((row) => row.qElemNumber == el.qElemNumber)[0].qState = "S";
    }
    
  };

  $$scope.endDrag = function (el, event) {
    if (event.which !== 3) {
      dragging = false;
      endElNum = el.qElemNumber;
      var endElState = el.qState;
      if (enableSelections && $$scope.mode == "analysis") {
        if (!beginSelections) {
          // console.log("beginSelections");
          $$scope.showSelectionToolbar = true;
          beginSelections = true;
          listObj.beginSelections({
            qPaths: ["/qListObjectDef"],
          });
        }
        if (startElNum == endElNum) { // CLICK HANDLER
          // console.log("click event");
          var occurance = getOccurence(elNumbersToSelect, endElNum); // return number of occurnaces of item in array
         
          if (multiSelect) {
            $$scope.showSelectionToolbar = true;
            // if it's already active or already in array, remove it
            if (endElState == "S" || occurance) {
              elNumbersToSelect = elNumbersToSelect.filter(
                (v) => v !== endElNum
              );
              // and change state to "O"
              $$scope.rows.filter(
                (row) => row.qElemNumber == endElNum
              )[0].qState = "O";
            } else {
              // if it's not active, add it to array
              elNumbersToSelect.push(endElNum);
              // and change state to "S"
              $$scope.rows.filter(
                (row) => row.qElemNumber == endElNum
              )[0].qState = "S";
            }
          } else { // single select - clear all and apply new selection
            $$scope.showSelectionToolbar = false;
            if (endElState == "S") {
              // if already selected, clear the array
              endElNum = false;
            }
          }

          // console.log("array to select", elNumbersToSelect);

          listObj
            .selectListObjectValues({
              qPath: "/qListObjectDef",
              qValues: el.qElemNumber === false ? [] : [el.qElemNumber],
              qToggleMode: multiSelect, // true for multi select
              //qSoftLock: true,
            })
            .then(function () {
              if (!multiSelect) {
                $$scope.endSelections(true);
              }
            });
        } else { // DRAG HANDLER
          // console.log("drag event ended");
        }
      }
    }
  };

  // approve selection
  $$scope.endSelections = function (approve) {
    // console.log("approve selections?", approve);
    if (!approve) $$scope.selectionsMenuBar("clearAll");
    listObj.abortListObjectSearch({
      qPath: "/qListObjectDef",
    });
    listObj.endSelections({
      qAccept: approve,
    });
    $$scope.showSelectionToolbar = false;
    beginSelections = false;
    elNumbersToSelect = [];
    // elNumbersToTempActivate = [];
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

  // To get the state count and logic for selected count state bar
  var qselectedCount = layout.qListObject.qDimensionInfo.qStateCounts.qSelected;
  var percentSelected = (qselectedCount / qCardinal) * 100;
  $$scope.percentSelected = percentSelected;
  var percentAlternative = 100 - percentSelected;
  $$scope.percentAlternative = percentAlternative;

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
  //3.Background Color
  var DropdownBgColorPicker = layout.DropdownBgColorPicker;
  $$scope.DropdownBgColorPicker = DropdownBgColorPicker;
  ////Final Adding these to the layout
  $$scope.dropdownStyle = {
    height: DropdownHeight + "px",
    width: DropdownWidth + "%",
    background: DropdownBgColorPicker.color
  };
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
  var PossibleBgColorPicker = layout.PossibleBgColorPicker;
  $$scope.PossibleBgColorPicker = PossibleBgColorPicker;
  var PossibleFontColorPicker = layout.PossibleFontColorPicker;
  $$scope.PossibleFontColorPicker = PossibleFontColorPicker;
  var SelectedBgColorPicker = layout.SelectedBgColorPicker;
  $$scope.SelectedBgColorPicker = SelectedBgColorPicker;
  var SelectedFontColorPicker = layout.SelectedFontColorPicker;
  $$scope.SelectedFontColorPicker = SelectedFontColorPicker;
  var ExcludedBgColorPicker = layout.ExcludedBgColorPicker;
  var AlternateBgColorPicker = layout.AlternateBgColorPicker;
  $$scope.AlternateBgColorPicker = AlternateBgColorPicker;
  var AlternateFontColorPicker = layout.AlternateFontColorPicker;
  $$scope.AlternateFontColorPicker = AlternateFontColorPicker;
  $$scope.ExcludedBgColorPicker = ExcludedBgColorPicker;
  var ExcludedFontColorPicker = layout.ExcludedFontColorPicker;
  $$scope.ExcludedFontColorPicker = ExcludedFontColorPicker;

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
  #custom-filter-${$$scope.qId} .listbox .list-item.O {
    background-color: ${layout.PossibleBgColorPicker.color} !important;
    color:  ${layout.PossibleFontColorPicker.color} !important;
    border-bottom: 1px solid rgb(221, 221, 221) !important;
  }
  #custom-filter-${$$scope.qId} .listbox .list-item.S {
    background-color: ${layout.SelectedBgColorPicker.color} !important;
    color: ${layout.SelectedFontColorPicker.color} !important;
    border-bottom: 1px solid rgb(221, 221, 221) !important;
  }
  #custom-filter-${$$scope.qId} .listbox .list-item.A {
    background-color: ${layout.AlternateBgColorPicker.color} !important;
    color: ${layout.AlternateFontColorPicker.color} !important;
    border-bottom: 1px solid #fff !important;
  }
  #custom-filter-${$$scope.qId} .listbox .list-item.X {
    background-color: ${layout.ExcludedBgColorPicker.color} !important;
    color: ${layout.ExcludedFontColorPicker.color} !important;
    border-bottom: 1px solid rgb(221, 221, 221) !important;
  }
  #custom-filter-${$$scope.qId} .button-item.O {
    background-color: ${layout.PossibleBgColorPicker.color} !important;
    color: ${layout.PossibleFontColorPicker.color} !important;
    border-bottom: 1px solid rgb(221, 221, 221) !important;
  }
  #custom-filter-${$$scope.qId} .button-item.S {
    background-color: ${layout.SelectedBgColorPicker.color} !important;
    color: ${layout.SelectedFontColorPicker.color} !important;
    border-bottom: 1px solid rgb(221, 221, 221) !important;
  }
  #custom-filter-${$$scope.qId} .button-item.A {
    background-color: ${layout.AlternateBgColorPicker.color} !important;
    color: ${layout.AlternateFontColorPicker.color} !important;
    border-bottom: 1px solid #fff !important;
  }
  #custom-filter-${$$scope.qId} .button-item.X {
    background-color: ${layout.ExcludedBgColorPicker.color} !important;
    color: ${layout.ExcludedFontColorPicker.color} !important;
    border-bottom: 1px solid rgb(221, 221, 221) !important;
  }
  /* When the checkbox is checked, add a tick */
  .listboxprops .list-item.S .checkbox::before {
  content: "✔";
  font-weight: 800;
  top: -1px;
  left: 3px;
  color: ${layout.SelectedBgColorPicker.color} !important;
  position: absolute;
  } 
  /* When the radiobutton is checked, add a tick */
  .listboxprops .list-item.S .radiobtn::before {
  color: ${layout.SelectedBgColorPicker.color} !important;
  }
  article:has(#custom-filter-${$$scope.qId} .active){
    z-index: 1020;
  }
  /** How to exclude this for checkbox and radio? */
  .listboxprops .list-item.vlist.S::before {
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
  /* dynamically change colors for state bars */
  #custom-filter-${$$scope.qId} .state-count-bar .state.selected {
    background: ${layout.SelectedBgColorPicker.color} !important;
  }
  #custom-filter-${$$scope.qId} .state-count-bar .state.alternative {
    background: ${layout.AlternateBgColorPicker.color} !important;
  }
  /* For icons on hover to remove */
  .object-wrapper:has([aria-labelledby="${$$scope.qId}_type ${$$scope.qId}_title ${$$scope.qId}_noTitle ${$$scope.qId}_content"]) .qv-object-nav
  {
    display: none !important;
  }
  /* When you are in sense other theme modes, to hide the border we use this logic and for background to hide we have code on css styels. This is for dropdown mainly*/
  .object-wrapper:has([aria-labelledby="${$$scope.qId}_type ${$$scope.qId}_title ${$$scope.qId}_noTitle ${$$scope.qId}_content"]) .qv-object
  {
    border: 0 !important;
  }
  `;
}
