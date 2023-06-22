var qlik = window.require("qlik");
var app = qlik.currApp();

function getOccurence(array, value) {
  var count = 0;
  array.forEach((v) => v === value && count++);
  return count;
}

export default async function ($element, layout) {
  const $$scope = this.$scope;
  $$scope.mode = qlik.navigation.getMode();
  $$scope.height = $element.height();
  $$scope.width = $element.width();
  $$scope.qId = layout.qInfo.qId;
  $$scope.listUiType = layout.SelectionUIType;
  console.log("paint_layout_lists", layout.lists);
  $$scope.dataLength =
    typeof layout.lists[0] !== "undefined"
      ? layout.lists[0].qListObject.qDataPages.length
      : 0;
  $$scope.dimData = [];

  //Change to dropdown UI when height < 89
  $$scope.maxListHeight = 89;
  $$scope.checkHeight = $$scope.height < $$scope.maxListHeight;

  // Map field data
  layout.lists.forEach(async (field, i) => {
    if (field.qListObject.qDataPages.length > 0) {
      // check if field is already stored in dimDataStore
      // if not, then  create a list object and qTop and store it in dimDataStore
      const storedField = $$scope.dimDataStore.filter(
        (f) => f.name == field.qListObject.qDimensionInfo.qFallbackTitle
      )[0];

      $$scope.dimData[i] = {
        id: layout.qInfo.qId + "-" + field.cId,
        fieldType: field.ui,
        selectionType: field.SelectionUIType,
        label: field.fieldLabel,
        name: field.qListObject.qDimensionInfo.qFallbackTitle,
        qTop: 0,
        qHeight: 200,
        listObj: storedField
          ? storedField.listObj
          : await app.createList({
              // only create if field does not stored in dimDataStore
              qDef: {
                qFieldDefs: [field.qListObject.qDimensionInfo.qFallbackTitle],
              },
              qShowAlternatives: true, // This will make alternatives show up as 'A' instead of 'X'
              qAutoSortByState: {
                qDisplayNumberOfRows: 1,
              },
              qInitialDataFetch: [
                {
                  qTop: 0,
                  qHeight: 1,
                  qLeft: 0,
                  qWidth: 1,
                },
              ],
            }),
        multiSelect: field.multiSelectionEnabled, //add to props and get from the layout object
        qCardinal: field.qListObject.qDimensionInfo.qCardinal,
        displayLoadMore:
          field.qListObject.qDimensionInfo.qCardinal > 200 ? "block" : "none",
        qselectedCount: field.qListObject.qDimensionInfo.qStateCounts.qSelected,
        percentSelected:
          (field.qListObject.qDimensionInfo.qStateCounts.qSelected /
            field.qListObject.qDimensionInfo.qCardinal) *
          100,
        percentAlternative:
          100 -
          (field.qListObject.qDimensionInfo.qStateCounts.qSelected /
            field.qListObject.qDimensionInfo.qCardinal) *
            100,
        percentOption:
          (field.qListObject.qDimensionInfo.qStateCounts.qOption /
            field.qListObject.qDimensionInfo.qCardinal) *
          100,
        values: field.qListObject.qDataPages[0].qMatrix.map((value) => {
          return {
            qText: value[0].qText,
            qNum: value[0].qNum,
            qElemNumber: value[0].qElemNumber,
            qState: value[0].qState,
          };
        }),
      };
      // store the field in the dimDataStore
      if (!storedField) {
        $$scope.dimDataStore.push({
          name: field.qListObject.qDimensionInfo.qFallbackTitle,
          qTop: 0,
          listObj: $$scope.dimData.filter(
            (f) => f.name == field.qListObject.qDimensionInfo.qFallbackTitle
          )[0].listObj,
        });
      }

      // remove "floating" popover from previous render
      $("#popover-" + layout.qInfo.qId + "-" + field.cId).remove();
    }
  });

  async function getListData(listObj, page, qHeight) {
    const result = await listObj.getListObjectData({
      qPath: "/qListObjectDef",
      qPages: [
        {
          qTop: page * qHeight,
          qLeft: 0,
          qHeight: qHeight,
          qWidth: 1,
        },
      ],
    });
    return result[0].qMatrix;
  }
  //Pagination
  $$scope.paginateList = async function (fieldName) {
    // find dimension data
    var myDim = $$scope.dimData.filter((i) => i.name == fieldName)[0];
    var listObj = myDim.listObj;
    var qCardinal = myDim.qCardinal;
    var qHeight = myDim.qHeight;
    // update qTop
    myDim.qTop = myDim.qTop + 1;
    var page = myDim.qTop;

    const newValues = await getListData(listObj, page, qHeight);
    // Issue: missing the `"qFrequencyMode": "V"` param when getting more pages...
    newValues.map((value) => {
      return {
        qText: value[0].qText,
        qNum: value[0].qNum,
        qElemNumber: value[0].qElemNumber,
        qState: value[0].qState,
      };
    });
    myDim.values = myDim.values.concat(newValues.flat());
    if (qCardinal / qHeight - 1 < page) {
      myDim.displayLoadMore = "none";
    } else {
      myDim.displayLoadMore = "block";
    }
    $$scope.myDim = myDim;
  };

  // Selections
  var dragging = false;
  var beginSelections = false;
  var startEl;
  var startElNum, endElNum;
  var elNumbersToSelect = [];

  $$scope.startDrag = function (fieldName, el, event) {
    var myDim = $$scope.dimData.filter((i) => i.name == fieldName)[0];
    if (event.which !== 3 && $$scope.mode == "analysis") {
      startEl = el;
      startElNum = el.qElemNumber;
      dragging = true;
    }
  };

  $$scope.hoverHandler = async function (fieldName, el, event) {
    var myDim = $$scope.dimData.filter((i) => i.name == fieldName)[0];
    var multiSelect = myDim.multiSelect;
    if (!dragging || $$scope.mode != "analysis" || !multiSelect) return;

    // only apply selection if item is not already selected
    if (startEl.qState != "S") {
      // elNumbersToSelect.push(el.qElemNumber);
      myDim.values.filter(
        (row) => row.qElemNumber == startEl.qElemNumber
      )[0].qState = "S";
    }

    if (el.qState != "S") {
      elNumbersToSelect.push(el.qElemNumber);
      myDim.values.filter(
        (row) => row.qElemNumber == el.qElemNumber
      )[0].qState = "S";
    }
  };

  $$scope.endDrag = async function (fieldName, el, event) {
    if (event.which !== 3) {
      var myDim = $$scope.dimData.filter((i) => i.name == fieldName)[0];
      var multiSelect = myDim.multiSelect;
      var listObj = myDim.listObj;
      dragging = false;
      endElNum = el.qElemNumber;
      var endElState = el.qState;
      if ($$scope.mode == "analysis") {
        if (startElNum == endElNum) {
          // CLICK HANDLER
          var occurance = getOccurence(elNumbersToSelect, endElNum); // return number of occurnaces of item in array

          if (multiSelect) {
            myDim.showSelectionToolbar = true;
            // if it's already active or already in array, remove it
            if (endElState == "S" || occurance) {
              elNumbersToSelect = elNumbersToSelect.filter(
                (v) => v !== endElNum
              );
              // and change state to "O"
              myDim.values.filter(
                (row) => row.qElemNumber == endElNum
              )[0].qState = "O";
            } else {
              // if it's not active, add it to array
              elNumbersToSelect.push(endElNum);
              // and change state to "S"
              myDim.values.filter(
                (row) => row.qElemNumber == endElNum
              )[0].qState = "S";
            }
          } else {
            // single select - clear all and apply new selection
            myDim.showSelectionToolbar = false;
            if (endElState == "S") {
              // if already selected, clear the array
              endElNum = false;
            }

            await listObj.beginSelections({
              qPaths: ["/qListObjectDef"],
            });
            await listObj.selectListObjectValues({
              qPath: "/qListObjectDef",
              qValues: endElNum === false ? [] : [endElNum],
              qToggleMode: false, // true for multi select
              //qSoftLock: true,
            });
            await listObj.endSelections({
              qAccept: true,
            });
          }
        } else {
          if (multiSelect) {
            // DRAG HANDLER
            myDim.showSelectionToolbar = true;
          }
        }
      }
    }
  };

  $$scope.endSelections = async function (fieldName, approve) {
    var myDim = $$scope.dimData.filter((i) => i.name == fieldName)[0];
    var listObj = myDim.listObj;
    if (approve) {
      await listObj.beginSelections({
        qPaths: ["/qListObjectDef"],
      });
      await listObj.selectListObjectValues({
        qPath: "/qListObjectDef",
        qValues: elNumbersToSelect,
        qToggleMode: true, // true for multi select
        //qSoftLock: true,
      });
      await listObj.endSelections({
        qAccept: approve,
      });
    } else {
      $$scope.selectionsMenuBar(fieldName, "clearAll");
      await listObj.endSelections({
        qAccept: approve,
      });
    }
  };

  //Button Group on click selections
  $$scope.buttonClick = async function (fieldName, el, event) {
    if (event.which !== 3) {
      var myDim = $$scope.dimData.filter((i) => i.name == fieldName)[0];
      var multiSelect = myDim.multiSelect;
      var listObj = myDim.listObj;
      startEl = el;
      startElNum = el.qElemNumber;
      dragging = false;
      endElNum = el.qElemNumber;
      var endElState = el.qState;
      if ($$scope.mode == "analysis") {
        if (startElNum == endElNum) {
          // CLICK HANDLER
          var occurance = getOccurence(elNumbersToSelect, endElNum); // return number of occurnaces of item in array
          if (multiSelect) {
            myDim.showSelectionToolbar = true;
            // if it's already active or already in array, remove it
            if (endElState == "S" || occurance) {
              elNumbersToSelect = elNumbersToSelect.filter(
                (v) => v !== endElNum
              );
              // and change state to "O"
              myDim.values.filter(
                (row) => row.qElemNumber == endElNum
              )[0].qState = "O";
            } else {
              // if it's not active, add it to array
              elNumbersToSelect.push(endElNum);
              // and change state to "S"
              myDim.values.filter(
                (row) => row.qElemNumber == endElNum
              )[0].qState = "S";
            }
          } else {
            // single select - clear all and apply new selection
            myDim.showSelectionToolbar = false;
            if (endElState == "S") {
              // if already selected, clear the array
              endElNum = false;
            }

            await listObj.beginSelections({
              qPaths: ["/qListObjectDef"],
            });
            await listObj.selectListObjectValues({
              qPath: "/qListObjectDef",
              qValues: endElNum === false ? [] : [endElNum],
              qToggleMode: false, // true for multi select
              //qSoftLock: true,
            });
            await listObj.endSelections({
              qAccept: true,
            });
          }
        } else {
          if (multiSelect) {
            // DRAG HANDLER
            myDim.showSelectionToolbar = true;
          }
        }
      }
    }
  };

  //Selections Menu bar
  $$scope.selectionsMenuBar = async function (fieldName, item) {
    var myDim = $$scope.dimData.filter((i) => i.name == fieldName)[0];
    var fieldName = myDim.name;
    var items = {
      selectAll: function () {
        app.field(fieldName).selectAll();
      },
      clearAll: function () {
        app.field(fieldName).clear();
      },
      selectExcluded: function () {
        app.field(fieldName).selectExcluded();
      },
      selectPossible: function () {
        app.field(fieldName).selectPossible();
      },
      selectAlternative: function () {
        app.field(fieldName).selectAlternative();
      },
      lockField: function () {
        app.field(fieldName).lock();
      },
      unlockField: function () {
        app.field(fieldName).unlock();
      },
    };
    return items[item]() || "not found";
  };

  //Search Functionality
  $$scope.searchFieldDataForString = async function (fieldName, string) {
    var myDim = $$scope.dimData.filter((i) => i.name == fieldName)[0];
    var listObj = myDim.listObj;
    var searchResults;
    if (string) {
      searchResults = await listObj.searchListObjectFor({
        qPath: "/qListObjectDef",
        qMatch: string,
      });
    } else {
      listObj.abortListObjectSearch({ qPath: "/qListObjectDef" });
    }
    const pages = await getListData(listObj, 0, myDim.qHeight);
    myDim.values = pages.flat();
  };
  //To Clear Search
  $$scope.clearsearchValue = async function (fieldName) {
    var myDim = $$scope.dimData.filter((i) => i.name == fieldName)[0];
    var listObj = myDim.listObj;
    listObj.abortListObjectSearch({ qPath: "/qListObjectDef" });
    var pages = await getListData(listObj, 0, myDim.qHeight);
    myDim.values = pages.flat();
  };
  //Interactivity UI Props for Search bar
  layout.lists.forEach(async (field) => {
    $$scope.enableSearch = field.enableSearch;
    $$scope.enableSearch = {
      display: field.enableSearch == true ? "onset" : "none",
    };
  });

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

  /*Default Selection (Single/Multiple) logic*/ //Enter the values like how you search in filter box . For example (multiple) : "value1" + "value2"
  layout.lists.forEach(async (field) => {
    var defaultSelection = field.defaultSelection,
      selectioncount = field.qListObject.qDimensionInfo.qStateCounts.qSelected;
    var fieldName = field.qListObject.qDimensionInfo.qFallbackTitle;
    // if we have defaultSelection, we find the corresponding qElemNumber
    // if there are no currentSelections on the dateField, we apply default selections
    if (defaultSelection && selectioncount == 0) {
      app
        .createList({
          qDef: { qFieldDefs: [fieldName] },
          qInitialDataFetch: [{ qHeight: 999, qWidth: 1 }],
        })
        .then(function (listObj) {
          listObj
            .searchListObjectFor({
              qPath: "/qListObjectDef",
              qMatch: defaultSelection,
            })
            .then(function (search) {
              listObj.getLayout().then(function (layout) {
                var elNumArray = layout.qListObject.qDataPages[0].qMatrix.map(
                  function (el) {
                    return el[0].qElemNumber;
                  }
                );
                if (elNumArray.length != 0) {
                  listObj.selectListObjectValues(
                    "/qListObjectDef",
                    elNumArray,
                    false
                  );
                }
              });
            });
        });
    }
  });

  //Header Props: Can always customize from layout props
  $$scope.HeaderStyle = {
    "font-size": 13 + "px",
    "font-family": "QlikView Sans, sans-serif", //change to intuit AvenirNEXT
    "font-style": "bold",
    "font-weight": "bold",
    "text-decoration": "none",
    color: "#595959",
    "text-align": "left",
    margin: 5 + "px",
  };
  //Cell Props: Can always customize from layout props
  $$scope.CellStyle = {
    "font-size": 13 + "px",
    height: 30 + "px",
    "font-family": "QlikView Sans, sans-serif", //change to intuit AvenirNEXT
    "font-style": "normal",
    "font-weight": "normal",
    "text-decoration": "none",
    "text-align": "left",
    "border-bottom-style": "solid",
    "border-bottom-width": 1 + "px",
    "border-bottom-color": "#ddd",
  };
  //Dropdown Props: Can always customize from layout props
  $$scope.dropdownStyle = {
    height: 30 + "px",
    width: 100 + "%",
    background: "#fff",
  };
  //Button Group Props: Can always customize from layout props
  $$scope.BtnGroupStyle = {
    "font-size": 13 + "px",
    height: 28 + "px",
    display: "inline",
    margin: 3 + "px",
    "font-family": "QlikView Sans, sans-serif", //change to intuit AvenirNEXT
    "font-style": "normal",
    "font-weight": "normal",
    "text-decoration": "none",
    "border-style": "solid",
    "border-width": "1px",
    "border-color": "rgb(221, 221, 221)",
    "border-radius": 20 + "px",
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

/*  #${$$scope.qId}_content {
  overflow-x: scroll;
  overflow-y: hidden;
 } */
 #custom-filter-${$$scope.qId}::-webkit-scrollbar {
  width: 5px;
  height: 7px;
}
#custom-filter-${$$scope.qId}::-webkit-scrollbar-track {
  background-color: #e4e4e4;
  border-radius: 100px;
}
#custom-filter-${$$scope.qId}::-webkit-scrollbar-thumb {
  background-color: #999;
  border-radius: 100px;
}

.chart-container::-webkit-scrollbar {
  width: 5px;
  height: 7px;
}
.chart-container::-webkit-scrollbar-track {
  background-color: #e4e4e4;
  border-radius: 100px;
}
.chart-container::-webkit-scrollbar-thumb {
  background-color: #999;
  border-radius: 100px;
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

 /* When the checkbox is checked, add a tick */
 .listboxprops .list-item.S .checkbox::before {
 content: "✔";
 font-weight: 800;
 top: -1px;
 left: 3px;
 color: #009845 !important;
 position: absolute;
 } 
 /* When the radiobutton is checked, add a tick */
 .listboxprops .list-item.S .radiobtn::before {
 color: #009845 !important;
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
 `;
}
