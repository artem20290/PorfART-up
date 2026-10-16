function reinitWidgets(root) {
  requestAnimationFrame(() => {
    const fns = [
      'initSliders', 'initCollapses', 'initSpoilers', 'initChoiceGroups', 'initSteps',
      'initTextFields', 'initUserSelects', 'initBadgeGroups', 'initChips', 'initBreadcrumbs', 'initTabs',
      'initPaginations', 'initAttachments', 'initSnackBars', 'initAutoCompletes',
      'initComboboxes', 'initSelects', 'initLiveDemos', 'initDonutCharts', 'initBarCharts',
      'initStackedBarCharts', 'initLineCharts', 'initMediumPriority', 'initHighPriority', 'initLowPriority', 'initUpgrades', 'initTemplates', 'initIcons'
    ];
    fns.forEach(name => {
      if (typeof window[name] === 'function') {
        const scoped = [
          'initLiveDemos', 'initComboboxes', 'initAutoCompletes', 'initDonutCharts',
          'initBarCharts', 'initStackedBarCharts', 'initLineCharts', 'initChips',
          'initCollapses', 'initSpoilers', 'initMediumPriority', 'initHighPriority', 'initLowPriority', 'initUpgrades', 'initTemplates', 'initIcons', 'initTabs'
        ];
        window[name](scoped.includes(name) ? root : undefined);
      }
    });
  });
}
