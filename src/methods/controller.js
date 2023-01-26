var qlik = window.require("qlik");
var app = qlik.currApp();
export default [
  "$scope",
  "$element",
  "$sce",
  async function ($scope, $element, $sce) {
    console.log("controller $scope", $scope);
    // Toggle Dropdown
    $scope.onDropdownToggleClick = function (event) {
      //Close open popovers
      var popover = $(event.target).parent().find(".listbox");
      $(document.body)
        .find(".listbox")
        .each((_, item) => {
          !$(item).is(popover) ? $(item).removeClass("active") : "";
        });

      if (popover.hasClass("active")) {
        popover.removeClass("active");
      } else {
        popover.addClass("active");
      }
    };
    //Visible SelectionsMenu
    $scope.IsVisibleSelectionsMenuItems = false;
    $scope.toggleSelectionMenuItems = function () {
      $scope.IsVisibleSelectionsMenuItems =
        !$scope.IsVisibleSelectionsMenuItems;
    };
    //Visible Search
    $scope.IsVisibleSearch = false;
    $scope.toggleSearchbar = function () {
      $scope.IsVisibleSearch = !$scope.IsVisibleSearch;
    };
    // To highlight search characters
    $scope.highlight = function (text, search) {
      if (!search) {
        return $sce.trustAsHtml(text);
      } else {
        return $sce.trustAsHtml(
          text.replace(
            new RegExp(search, "gi"),
            '<span class="highlightedText">$&</span>'
          )
        );
      }
    };
  },
];
