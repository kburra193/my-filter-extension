var qlik = window.require("qlik");
var app = qlik.currApp();
export default [
  "$scope",
  "$element",
  "$sce",
  async function ($scope, $element, $sce) {
    // Toggle Dropdown
    $scope.onDropdownToggleClick = function (event) {
      if ($scope.mode != "analysis") return;
      //Close open popovers
      var $popover = $element.find(".listbox.lui-popover");
      var $dropdown = $element.find(".dropdown-toggle");
      var offset = $dropdown.offset();
      var popoverTop = offset.top + $dropdown.outerHeight() + 15;

      // if popoverTop lower then the height of the popover, popoverTop should be offset.top - popover height - 15
      if (popoverTop + $popover.outerHeight() > $(window).height()) {
        popoverTop = offset.top - $popover.outerHeight() - 15;
        // also adjust the position of the popover triangle
        $popover.find(".lui-popover__arrow").removeClass("lui-popover__arrow--top").addClass("lui-popover__arrow--bottom");
      } else {
        $popover.find(".lui-popover__arrow").removeClass("lui-popover__arrow--bottom").addClass("lui-popover__arrow--top");
      }

      // define "left" position to center the popover to the dropdown
      var popoverLeft = offset.left + (($dropdown.outerWidth() - $popover.outerWidth())/2);

      // if popoverLeft is negative, popoverLeft should be 10
      if (popoverLeft < 0) {
        console.log("popoverLeft is negative");
        popoverLeft = 10;
        // also adjust the position of the popover arrow
        $popover.find(".lui-popover__arrow").css("left", "25%");
      } else {
        // if popover width + dropdownOffset is bigger then screen width - popoverLeft shpould be screen width - popover width + 10
        if (popoverLeft + $popover.outerWidth() > $(window).width()) {
          popoverLeft = $(window).width() - $popover.outerWidth() - 10;
          // also adjust the position of the popover arrow
          $popover.find(".lui-popover__arrow").css("left", "75%");
        } else {
          $popover.find(".lui-popover__arrow").css("left", "50%");
        }
      }

      $(document.body)
        .find(".listbox")
        .each((_, item) => {
          !$(item).is($popover) ? $(item).removeClass("active") : "";
        });

      if ($popover.hasClass("active")) {
        $popover.removeClass("active");
      } else {
        $popover.css({
          top: popoverTop,
          left: popoverLeft,
        });
        $popover.addClass("active");
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
