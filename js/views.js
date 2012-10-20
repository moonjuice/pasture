window.HeaderView = Backbone.View.extend({

    initialize: function() {
        this.render();
    },

    render: function() {
        $(this.el).html(this.template());
        return this;
    },

    selectMenuItem: function(menuItem) {
        $('.nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }

});
window.AboutView = Backbone.View.extend({

    initialize: function() {
        this.render();
    },

    render: function() {
        $(this.el).html(this.template());
        return this;
    }

});
window.cowListView = Backbone.View.extend({
    initialize: function() {
        this.render();
    },
    render: function() {
        var cows = this.model.models;
        var query = this.model.query;
        if (query == null)
            query = "";
        var len = cows.length;
        var startPos = (this.options.page - 1) * 8;
        var endPos = Math.min(startPos + 8, len);
        $(this.el).html('<div class=\"well\"><legend>查詢條件</legend>統一編號：<input id=\"searchTaxID\" value=\"' + query + '\"/></div><div class=""btn-group"><button id="searchCowButton" class="btn btn-primary searchCowButton" ><i class=\"icon-search icon-white\"></i> 搜尋</button> <button id="newCowButton" class="btn btn-primary" onClick="window.location=\'#cows/add\'">新增</button></div><br /><table class="table table-striped table-bordered table-condensed"><thead><th>統一編號</th><th>場內號</th><th>父親統一(精液)編號</th><th>母親統一編號</th><th>生日</th><th>備註</th><th></th></thead><tbody class="tbody"></tbody></table>');
        for (var i = startPos; i < endPos; i++) {
            $('.tbody', this.el).append(new cowListItemView({ model: cows[i] }).render().el);
        }
        $(this.el).append(new Paginator({ model: this.model, page: this.options.page, modelName: 'cow' }).render().el);
        return this;
    },
    events: {
        "click .searchCowButton": "searchCow"
    },
    searchCow: function() {
        var query = $("#searchTaxID").val();
        var cowList = new cowCollection();
        cowList.query = query;
        cowList.fetch({ 
            success: function() {
                $("#content").html(new cowListView({ model: cowList, page: 1 }).el);
            }
        });
    }
});
window.cowListItemView = Backbone.View.extend({
    tagName: "tr",
    initialize: function() {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },
    render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});
window.cowView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },
    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        $.datepicker.setDefaults($.datepicker.regional["zh-TW"]);
        this.$(".datepicker").datepicker({
            //		    changeMonth: true,
            //            changeYear: true,
            dateFormat: 'yy-mm-dd',
            onSelect: function (date) {
                var controlGroup = $(this).parent().parent();
                controlGroup.removeClass('error');
                controlGroup.find(".help-inline").remove();
            }
        });
        if (this.model.isNew()) {
            this.$("#taxID").removeAttr("readonly");
        }
        return this;
    },

    events: {
        'keyup .data-field': 'updateModel',
        "click .save": "beforeSave",
        "click .delete": "deletecow",
        "click .estrus": "estrus",
        "click .inject": "inject"
    },

    updateModel: function (event) {
        var target = event.target;
        var change = {};
        change[target.name] = target.value.toString();
        this.model.set(change);

        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            var controlGroup = $('#' + target.id).parent().parent();
            controlGroup.addClass('error');
            if (controlGroup.find(".help-inline").length == 0)
                controlGroup.find(".controls").append("<p class=\"help-inline error-message\"></p>");
            controlGroup.find(".controls").find(".help-inline").text(check.message);
        } else {
            var controlGroup = $('#' + target.id).parent().parent();
            controlGroup.removeClass('error');
            controlGroup.find(".help-inline").remove();
        }
    },

    valid: function () {
        this.$('.alert').removeClass("alert-error alert-warning alert-success alert-info");
        this.$('.alert').addClass('alert-success');
        this.$('.alert').html('<strong>成功!</strong> ');
        this.$('.alert').fadeIn();
    },

    invalid: function () {
        this.$('.alert').removeClass("alert-error alert-warning alert-success alert-info");
        this.$('.alert').addClass('alert-error');
        this.$('.alert').html('<strong>失敗!</strong> ');
        this.$('.alert').fadeIn();
    },

    beforeSave: function () {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid) {
            this.savecow();
        }
        else {
            for (var key in check.messages) {
                if (check.messages.hasOwnProperty(key)) {
                    var controlGroup = $('#' + key).parent().parent();
                    controlGroup.addClass('error');
                    if (controlGroup.find(".help-inline").length == 0)
                        controlGroup.find(".controls").append("<p class=\"help-inline error-message\"></p>");
                    controlGroup.find(".controls").find(".help-inline").text(check.messages[key]);

                }
            }
            this.$('.alert-error').fadeIn();
        }
        return false;
    },

    savecow: function () {
        var self = this;
        this.model.save(null, {
            success: function (model) {
                self.render();
                app.navigate('cows/' + model.taxID, false);
                $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
                $('.alert').addClass('alert-success');
                $('.alert').html('<strong>成功!</strong> ' + '乳牛資料儲存成功!!');
                $('.alert').show();
            },
            error: function () {
                $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
                $('.alert').addClass('alert-error');
                $('.alert').html('<strong>失敗!</strong> ' + '儲存過程發生錯誤!!');
                $('.alert').show();
            }
        });
    },

    deletecow: function () {
        this.model.destroy({
            success: function () {
                $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
                $('.alert').addClass('alert-success');
                $('.alert').html('<strong>成功!</strong> ' + '乳牛資料刪除成功!!');
                $('.alert').show();
                window.history.back();
            }
        });
        return false;
    },

    estrus: function () { 
        //開啟視窗
        //新增一筆異動紀錄
        //更新狀態
        //按鈕變更
    },

    inject: function(){
        
    }
});
window.recordListView = Backbone.View.extend({
    initialize: function() {
        this.render();
    },
    render: function() {
        var records = this.model.models;
        var len = records.length;
        var startPos = (this.options.page - 1) * 8;
        var endPos = Math.min(startPos + 8, len);
        $(this.el).html('<button id="newrecordButton" class="btn btn-primary" onClick="window.location=\'#records/add\'">新增record</button><br /><table class="table table-striped table-bordered table-condensed"><thead><th>序號</th><th>乳牛ID</th><th>內容</th><th>建立日期</th><th></th></thead><tbody class="tbody"></tbody></table>');
        for (var i = startPos; i < endPos; i++) {
            $('.tbody', this.el).append(new recordListItemView({ model: records[i] }).render().el);
        }
        $(this.el).append(new Paginator({ model: this.model, page: this.options.page, modelName: 'record' }).render().el);
        return this;
    }
});
window.recordListItemView = Backbone.View.extend({
    tagName: "tr",
    initialize: function() {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },
    render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});
window.recordView = Backbone.View.extend({

    initialize: function() {
        this.render();
    },
    render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        this.$(".datepicker")
			.datepicker({ format: 'yyyy-mm-dd', language: 'zh-TW' })
			.on('changeDate', function(ev) {
			}); ;
        if (this.model.isNew()) {
            this.$("#rid").removeAttr("readonly");
        }
        return this;
    },

    events: {
        'keyup .data-field': 'updateModel',
        "click .save": "beforeSave",
        "click .delete": "deleterecord"
    },

    updateModel: function(event) {
        var target = event.target;
        var change = {};
        change[target.name] = target.value.toString();
        this.model.set(change);

        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            var controlGroup = $('#' + target.id).parent().parent();
            controlGroup.addClass('error');
            if (controlGroup.find(".help-inline").length == 0)
                controlGroup.find(".controls").append("<p class=\"help-inline error-message\"></p>");
            controlGroup.find(".controls").find(".help-inline").text(check.message);
        } else {
            var controlGroup = $('#' + target.id).parent().parent();
            controlGroup.removeClass('error');
            controlGroup.find(".help-inline.error-message").remove();
        }
    },

    valid: function() {
        this.$('.alert').removeClass("alert-error alert-warning alert-success alert-info");
        this.$('.alert').addClass('alert-success');
        this.$('.alert').html('<strong>成功!</strong> ');
        this.$('.alert').fadeIn();
    },

    invalid: function() {
        this.$('.alert').removeClass("alert-error alert-warning alert-success alert-info");
        this.$('.alert').addClass('alert-error');
        this.$('.alert').html('<strong>失敗!</strong> ');
        this.$('.alert').fadeIn();
    },

    beforeSave: function() {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid) {
            this.saverecord();
        }
        else {
            for (var key in check.messages) {
                if (check.messages.hasOwnProperty(key)) {
                    var controlGroup = $('#' + key).parent().parent();
                    controlGroup.addClass('error');
                    controlGroup.find(".controls").find(".help-inline").text(check.messages[key]);
                }
            }
            this.$('.alert-error').fadeIn();
        }
        return false;
    },

    saverecord: function() {
        var self = this;
        this.model.save(null, {
            success: function(model) {
                self.render();
                app.navigate('records/' + model.rid, false);
                $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
                $('.alert').addClass('alert-success');
                $('.alert').html('<strong>成功!</strong> ' + 'record 儲存成功!!');
                $('.alert').show();
            },
            error: function() {
                $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
                $('.alert').addClass('alert-error');
                $('.alert').html('<strong>失敗!</strong> ' + '儲存過程發生錯誤!!');
                $('.alert').show();
            }
        });
    },

    deleterecord: function() {
        this.model.destroy({
            success: function() {
                $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
                $('.alert').addClass('alert-success');
                $('.alert').html('<strong>成功!</strong> ' + 'record 刪除成功!!');
                $('.alert').show();
                window.history.back();
            }
        });
        return false;
    }
});
