var qlik = window.require("qlik");

export default function ($element, layout) {
  const $$scope = this.$scope;
  $$scope.height = $element.height();
  $$scope.width = $element.width();
  $$scope.mode = qlik.navigation.getMode();
  $$scope.checkHeight = $$scope.height < $$scope.maxListHeight;
}
