var qlik = window.require("qlik");
var app = qlik.currApp();
export default [
  "$scope",
  "$element",
  "$sce",
  async function ($scope, $element, $sce) {
     // console.log("controller_$scope", $scope);
    $scope.dimDataStore = [];
    //Visible SelectionsMenu
    $scope.IsVisibleSelectionsMenuItems = false;
    $scope.toggleSelectionMenuItems = function (fieldName) {
      var myDim = $scope.dimData.filter((i) => i.name == fieldName)[0];
      myDim.IsVisibleSelectionsMenuItems = !myDim.IsVisibleSelectionsMenuItems;
    };
    //Visible Search
    $scope.IsVisibleSearch = false;
    $scope.toggleSearchbar = function (fieldName) {
      var myDim = $scope.dimData.filter((i) => i.name == fieldName)[0];
      myDim.IsVisibleSearch = !myDim.IsVisibleSearch;
    };
    // To highlight search characters
    $scope.highlight = function (text, search) {
      if (!search) {
        return $sce.trustAsHtml(text);
      } else {
        if (text) {
          return $sce.trustAsHtml(
            text.replace(
              new RegExp(search, "gi"),
              '<span class="highlightedText">$&</span>'
            )
          );
        }
      }
    };

    // Toggle Dropdown
    $scope.onDropdownToggleClick = function (id) {
      var myDim = $scope.dimData.filter((i) => i.id == id)[0];
      var dimId = myDim.id;
      var $elementbyId = $("#" + dimId);
      if ($scope.mode != "analysis") return;

      var $popover = $("#popover-" + dimId); // we can't rely on parent id to find because we detach and append to body
      var $dropdown = $elementbyId.find(".dropdown-toggle");
      var $dropdownList = $elementbyId.find(".dropdown-list");
      var offset = $dropdown.offset();
      var popoverTop = offset.top + $dropdown.outerHeight() + 15;
      // if popoverTop lower then the height of the popover, popoverTop should be offset.top - popover height - 15
      //added $popover.outerHeight() as 340 max height manually
      if (popoverTop + 350 > $(window).height()) {
        popoverTop = offset.top - 350 - 15;
        // also adjust the position of the popover triangle
        $popover
          .find(".lui-popover__arrow")
          .removeClass("lui-popover__arrow--top")
          .addClass("lui-popover__arrow--bottom");
      } else {
        $popover
          .find(".lui-popover__arrow")
          .removeClass("lui-popover__arrow--bottom")
          .addClass("lui-popover__arrow--top");
      }

      //define "left" position to center the popover to the dropdown
      var popoverLeft = offset.left + (($dropdown.outerWidth() - $popover.outerWidth())/2);
      // if popoverLeft is negative, popoverLeft should be 10
      if (popoverLeft < 0) {
        // console.log("popoverLeft is negative");
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
        // remove from body and insertAfter to the dropdown and remove the active class
        $popover.detach().appendTo($dropdownList).removeClass("active floating-popover");
      } else {
        // first, we detach the popover and append to the body and add the active class
        $popover.detach().appendTo(document.body).addClass("active floating-popover");
        // then we set the position of the popover
        $popover.css({
          top: popoverTop,
          left: popoverLeft,
        });
      }
    };

    // // on mode change, detach and add back to the dropdown
    // $scope.$watch(()=>{ return qlik.navigation.getMode() == qlik.navigation.EDIT  },(n,o)=>{
    //   var floatingpopovers = $(".listbox.lui-popover.floating-popover");
    //   // loop through popovers and find their id's and return them to their original location
    //   floatingpopovers.each((_, item) => {
    //     var id = $(item).attr("id");
    //     console.log(id); // 'popover-cdsfds-fsdfds'
    //     var $dropdownParent = $("#" + id.replace("popover-", ""));
    //     $(item).detach().appendTo($dropdownParent.find(".dropdown-list")).removeClass("active floating-popover");
    //   });
    // });

    // when click anywhere outside of popover, remove active class and append to dropdown
    $(document).on("click", function (e) {
      // if click is on the popover or is on the dropdown, do nothing
      if (($(e.target).closest(".listbox.lui-popover.floating-popover").length) || ($(e.target).closest(".dropdown-toggle").length)) return;

      var floatingpopovers = $(".listbox.lui-popover.floating-popover");
      // loop through popovers and find their id's and return them to their original location
      floatingpopovers.each((_, item) => {
        var id = $(item).attr("id");
        var $dropdownParent = $("#" + id.replace("popover-", ""));
        if (!$(e.target).is($dropdownParent)) {
          $(item).detach().appendTo($dropdownParent.find(".dropdown-list")).removeClass("active floating-popover");
        }
      });
    });
  },
];
