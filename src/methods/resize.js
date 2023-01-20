var qlik = window.require("qlik");

export default function ($element, layout) {
  // ..resize code here
  // To switch between listbox, dropdown and buttongroup when height is changed

  const $$scope = this.$scope;
  $$scope.height = $element.height();
  $$scope.width = $element.width();
  $$scope.mode = qlik.navigation.getMode();
  var maxListHeight = 85;

  if ($$scope.ui == "listbox") {
    if ($$scope.height > maxListHeight) {
      console.log("h > maxListHeight");
      $$scope.showListbox = true;
      $$scope.showDropdown = false;
      $$scope.listboxStyle = '';
    } else {
	    console.log("h < maxListHeight");
      $$scope.showListbox = false;
      $$scope.showDropdown = true;
	    $$scope.listboxStyle = {'position' : 'fixed', 'width' : $$scope.width + 'px'}
    }
  }
  else if ($$scope.ui == "buttongroup") {
    if ($$scope.height > maxListHeight) {
      console.log("h > maxListHeight");
      $$scope.showButtongroup = true;
	    $$scope.showDropdown = false;
    } else {
	    console.log("h < maxListHeight");
      $$scope.showButtongroup = false;
      $$scope.showDropdown = true;
      $$scope.listboxStyle = { position: "fixed", width: $$scope.width + "px" };
    }
  }
  else if ($$scope.ui == "dropdown") {
    if ($$scope.height > maxListHeight) {
      console.log("h > maxListHeight");
      $$scope.showButtongroup = false;
      $$scope.showListbox = false;
	    $$scope.showDropdown = true;
    } else {
	    console.log("h < maxListHeight");
      $$scope.showButtongroup = false;
      $$scope.showListbox = false;
      $$scope.showDropdown = true;
      $$scope.listboxStyle = { position: "fixed", width: $$scope.width + "px" };
    }
  }

}
