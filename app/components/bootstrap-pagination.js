import { scheduleOnce } from '@ember/runloop';
import { observer } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  baseClass: 'pagination-sm',
  totalPages: 1,
  visiblePages: 5,
  currentPage: 1,
  disabled: false,
  setup: function() {
    let self = this;

    this.set('currentPage', Math.min(this.page, this.totalPages));

    this.$('.bootstrap-pagination').twbsPagination('destroy');
    this.$('.bootstrap-pagination').twbsPagination({
      totalPages: this.totalPages,
      visiblePages: this.visiblePages,
      startPage: this.currentPage,
      onPageClick: function(event, page) {
        if (page != self.get('currentPage')) {
          self.set('currentPage', page);
          if (typeof self.get('pageChanged') === 'function') {
            self.get('pageChanged')(page);
          }
        }
      },
    });
    if (this.disabled) {
      this.$('.bootstrap-pagination').twbsPagination('disable');
    }
  },
  didInsertElement: function() {
    this._super(...arguments);
    this.setup();
  },
  parametersObserver: observer('visiblePages', 'totalPages', function() {
    scheduleOnce('afterRender', this, 'setup');
  }),
  pageObserver: observer('page', function() {
    if (this.page != this.currentPage) {
      scheduleOnce('afterRender', this, 'setup');
    }
  }),
  disabledObserver: observer('disabled', function() {
    if (this.disabled) {
      this.$('.bootstrap-pagination').twbsPagination('disable');
    } else {
      this.$('.bootstrap-pagination').twbsPagination('enable');
    }
  }),
});
