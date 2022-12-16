var qlik = window.require("qlik");
var jQuery = window.require("jquery");
if (!window.$) {
  console.log("no jq");
  window.$ = jQuery;
}
export default [
  "$scope",
  "$element",
  "$sce",
  async function ($scope, $element, $sce) {
    const app = qlik.currApp();
    console.log("controller $scope", $scope);
    //This will hide the DIV by default.
    $scope.IsVisible = false;
    $scope.toggleListbox = function () {
      //If DIV is visible it will be hidden and vice versa.
      $scope.IsVisible = !$scope.IsVisible;
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
    // To switch between listbox, dropdown and buttongroup
    $scope.showButtongroup = false;
    $scope.showDropdown = false;
    $scope.showListbox = true;
    $scope.ui = "";
    $scope.$watch("ui", function () {
      console.log("controller ui", $scope.ui);
      if ($scope.ui == "dropdown") {
        $scope.showDropdown = true;
        $scope.showButtongroup = false;
        $scope.showListbox = false;
      } else if ($scope.ui == "buttongroup") {
        $scope.showDropdown = false;
        $scope.showButtongroup = true;
        $scope.showListbox = false;
      } else if ($scope.ui == "listbox"){
        $scope.showDropdown = false;
        $scope.showButtongroup = false;
        $scope.showListbox = true;
      }
      else {
        $scope.showDropdown = false;
        $scope.showButtongroup = false;
        $scope.showListbox = true;
      }

    });
  },
];
