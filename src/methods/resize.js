var qlik = window.require("qlik");

export default function ($element, layout) {
  const $$scope = this.$scope;
  $$scope.height = $element.height();
  $$scope.width = $element.width();
  $$scope.mode = qlik.navigation.getMode();

  if ($$scope.mode == "edit") {
    if ($(".dropdown-list .listbox.active").length > 0) {
      if ($(".dropdown-list .listbox").hasClass("active")) {
        $(".dropdown-list .listbox.active").removeClass("active");
      }
    }
    if ($(".listbox-selection-toolbar").length > 0) {
      $(".listbox-selection-toolbar").css({ display: "none" });
    }
  }
  else{
    $$scope.checkHeight = $$scope.height < $$scope.maxListHeight;
  }

 
}
