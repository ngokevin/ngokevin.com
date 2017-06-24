var moment = require('moment');

hexo.extend.helper.register('date', function (date) {
  return moment(date).format('D MMM YYYY');
});

hexo.extend.helper.register('print', function (obj) {
  return Object.keys(obj);
});
