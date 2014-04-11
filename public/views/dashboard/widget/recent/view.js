define('views/dashboard/widget/recent/view', [
    'text!./view.html'
    ], function (templateHtml) {

    return Backbone.View.extend({

        events: {
            'click .pagination li a': 'gotoPage'
        },

        initialize: function (options) {
            var instance = this;
            instance.setElement(options.el);
            instance.collectionName = instance.$el.data('collection-name');
            require([
                'json!/config/' + instance.collectionName + '.json',
                'collections/' + instance.collectionName
                ], function (config, Collection) {
                    instance.pager = {
                        p: 1,
                        ipp: 5,
                        'sort[]': (function (map) {
                            map[ config.updatedField.key ] = -1;
                            return map;
                        })({}),
                    };

                    instance.collection = new Collection();
                    instance.collection.on('add', function (response, collection, xhr) {
                        instance.$el.html(_.template(templateHtml, {
                            config: config,
                            collection: collection,
                            pager: collection.pager
                        }));
                    }, this);
                    instance.collection.fetch({
                        data: instance.pager
                    });
            });
            instance.delegateEvents();
        },

        render: function () {
            var instance = this;
        },

        gotoPage: function (event) {
            var instance = this;
                $el = $(event.target);
            if ($el.data('pager')) {
                var pager = $el.data('pager'),
                    data = {
                        p: pager.p,
                        ipp: pager.ipp,
                        sort: pager.sort,
                        filter: pager.filter,
                    };
                instance.collection.fetch({ data: data });
            } else {
                instance.collection.fetch({ url: $(event.target).attr('href') });
            }
            event.preventDefault();
        },

    });

});
