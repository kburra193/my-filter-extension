var qlik = window.require("qlik");
var app = qlik.currApp();
export default [
  "$scope",
  "$element",
  "$sce",
  async function ($scope, $element, $sce) {
    console.log("controller $scope", $scope);
    //This will hide the DIV by default.
    $scope.IsVisible = false;
    $scope.toggleListbox = function () {
      //If DIV is visible it will be hidden and vice versa.
      $scope.IsVisible = !$scope.IsVisible;
    };
    $scope.IsVisibleSelectionsMenuItems = false;
    $scope.toggleSelectionMenuItems = function () {
      $scope.IsVisibleSelectionsMenuItems =
        !$scope.IsVisibleSelectionsMenuItems;
    };
    $scope.IsVisibleSearch = false;
    $scope.toggleSearchbar = function () {
      $scope.IsVisibleSearch = !$scope.IsVisibleSearch;
    };
    // To highlight search characters
    $scope.highlight = function (text, search) {
      if (!search) {
        return $sce.trustAsHtml(text);
      }
      return $sce.trustAsHtml(
        text.replace(
          new RegExp(search, "gi"),
          '<span class="highlightedText">$&</span>'
        )
      );
    };
    //To Clear Search
    $scope.clearsearchValue = function () {
      $scope.searchValue = "";
      $scope.searchFieldDataForString();
      $scope.highlight = function (text, search) {
        if (!search) {
          return $sce.trustAsHtml(text);
        }
        return $sce.trustAsHtml(
          text.replace(new RegExp(search, "gi"), "<span>$&</span>")
        );
      };
    };
  },
];
