var qlik = window.require("qlik");
export default async function ($element, layout) {
  //console.log($element);
  // todo - get element height
    // if height < xxx
      // show dropdown (or radio button )
    // else 
      // show listbox always

  // todo 0 - back to using listDef
  // todo 1  - get applyselection working again
  // todo 2 - sorting **** a. create defintion b. apply patches to list in paint
  // todo 3 - search 
  // todo 4 - float frequency
  //todo5 - make sure you can scroll the listbox
  //todo 6 - add add ons
  // todo7 - push to repo and share with me

  // todo 8 - move logic to nebula - ran starts on this
  
  console.log("paint layout", layout);
  var self = this;
  const $$scope = this.$scope;
  console.log("paint $$scope", $$scope);
  var app = qlik.currApp();
  $$scope.qListObject = layout.qListObject;
  console.log("paint qListObject", $$scope.qListObject);
  $$scope.dimensions = layout.qListObject.qDimensionInfo;
  console.log("paint dimensionInfo", $$scope.dimensions);
  $$scope.dimensionsLabel = layout.qListObject.qDimensionInfo.qFallbackTitle;
  console.log("paint dimensionLabel", $$scope.dimensionsLabel);
  $$scope.rows = layout.qListObject.qDataPages[0].qMatrix;
  console.log("rows",$$scope.rows);

  //Create Session Object for Selections and Search Functionality
  var fieldObj = await app.model.engineApp.createSessionObject({
    qListObjectDef: {
      qDef: {
        qFieldDefs: [$$scope.dimensionsLabel],
      },
      qInitialDataFetch: [
        {
          qTop: 0,
          qLeft: 0,
          qHeight: 200,
          qWidth: 1,
        },
      ],
    },
    qInfo: {
      qType: "ListObject",
    },
  });
  console.log("fieldObj", fieldObj);

  // Selections Functionality
$$scope.applySelection = async function (val) {
  console.log("applySelectionOnClick", val);
  fieldObj.selectListObjectValues({
    qPath: "/qListObjectDef",
    qValues: [val],
    qToggleMode: true,
    qSoftLock: true,
  });
};
  //Search Functionality
  $$scope.searchFieldDataForString = async function (string) {
    var result2 = await fieldObj.searchListObjectFor({
      qPath: "/qListObjectDef",
      qMatch: string,
    });
    var searchResults = await fieldObj.getLayout();
    $$scope.rows = searchResults.qListObject.qDataPages[0].qMatrix;
  };

}
