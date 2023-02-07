var qlik = window.require("qlik");

export default function ($element, layout) {
  // ..resize code here
  // To switch between listbox, dropdown and buttongroup when height is changed
  const $$scope = this.$scope;
  $$scope.height = $element.height();
  $$scope.width = $element.width();
  $$scope.mode = qlik.navigation.getMode();
  var maxListHeight = 89;

  if ($$scope.ui == "listbox") {
    if ($$scope.mode !== "edit") {
      if ($$scope.height > maxListHeight) {
        $$scope.showListbox = true;
        $$scope.showDropdown = false;
        $$scope.listboxStyle = "";
        $(".listbox-selection-toolbar").css({display : 'flex'});
      } else {
        $$scope.showListbox = false;
        $$scope.showDropdown = true;
        $$scope.listboxStyle = {
          position: "fixed",
          width: $$scope.width + "px",
        };
      }
    }
    else {
      if ($(".dropdown-list .listbox.active").length > 0) {
        if ($(".dropdown-list .listbox").hasClass("active")) {
          $(".dropdown-list .listbox.active").removeClass("active");
        }
      }
      if ($(".listbox-selection-toolbar").length > 0) {
        $(".listbox-selection-toolbar").css({display : 'none'});
      }
      else{
        $(".listbox-selection-toolbar").css({display : 'flex'});
      }
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
    if ($$scope.mode !== "edit") {
      if ($$scope.height > maxListHeight) {
        $$scope.showButtongroup = false;
        $$scope.showListbox = false;
        $$scope.showDropdown = true;
      } else {
        $$scope.showButtongroup = false;
        $$scope.showListbox = false;
        $$scope.showDropdown = true;
        $$scope.listboxStyle = {
          position: "fixed",
          width: $$scope.width + "px",
        };
      }
    } else {
      if ($(".dropdown-list .listbox.active").length > 0) {
        if ($(".dropdown-list .listbox").hasClass("active")) {
          $(".dropdown-list .listbox.active").removeClass("active");
        }
      }
    }
  }
}
