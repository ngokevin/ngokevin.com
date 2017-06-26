var moment = require('moment');

hexo.extend.helper.register('date', function (date) {
  return moment(date).format('D MMM YYYY');
});

hexo.extend.helper.register('print', function (obj) {
  return Object.keys(obj);
});

hexo.extend.helper.register('icon', function (name) {
  return `<i class="fa fa-${name}" aria-hidden="true"></i>`;
});
