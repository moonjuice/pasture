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
        var query = this.model.get("query");
        if (query == null)
            query = "";
        var len = cows.length;
        var startPos = (this.options.page - 1) * PageCnt;
        var endPos = Math.min(startPos + PageCnt, len);
        $(this.el).html('<div class=\"well\"><legend>查詢條件</legend>統一編號：<input id=\"searchTaxID\" value=\"' + query + '\"/></div><div><button id="searchCowButton" class="btn btn-primary searchCowButton" style="margin-right:5px;"><i class=\"icon-search icon-white\"></i> 搜尋</button> <button id="newCowButton" class="btn btn-primary" onClick="window.location=\'#cows/add\'"  style="margin-right:5px;">新增</button></div><br /><table class="table table-striped table-bordered table-condensed"><thead><th>統一編號</th><th>場內號</th><th>父親統一(精液)編號</th><th>母親統一編號</th><th>生日</th><th>狀態</th><th>備註</th><th></th></thead><tbody class="tbody"></tbody></table>');
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
        cowList.set("query",query);
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

    initialize: function() {
        this.render();
    },
    render: function() {
        var self = this;
        $(this.el).html(this.template(this.model.toJSON()));
        //設定datepicker
        /*
        $.datepicker.setDefaults($.datepicker.regional["zh-TW"]);
        this.$(".datepicker").datepicker({
            //		    changeMonth: true,
            //            changeYear: true,
            dateFormat: 'yy-mm-dd',
            onSelect: function(date) {
                var controlGroup = $(this).parent().parent();
                controlGroup.removeClass('error');
                controlGroup.find(".help-inline").remove();
            }
        });
        */
        //如果是新增的額外設定
        if (this.model.isNew()) {
            this.$("#taxID").removeAttr("readonly");
            this.$("#estrusButton").attr("disabled", "disabled");
            this.$("#estrusButton").addClass("disabled");
        }
        //設定發情視窗
        var EstrusRemark = this.$("#EstrusRemarkText");
        var selfModel = this.model;
        this.$("#estrusDialog").dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                "確定": function() {
                    //新增一筆異動紀錄
                    var record = new recordModel();
                    var d = new Date();
                    record.set("cid", selfModel.get("taxID"));
                    record.set("content", '1:' + EstrusRemark.val());
                    //record.set("createdate", d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + " " + d.toLocaleTimeString());
                    record.save(null, {
                        success: function(model) {
                            //新增成功則變更乳牛狀態，並儲存
                            if (selfModel.get("status") == '0')
                                selfModel.save({ status: 1 });
                            else
                                selfModel.save({ status: 0 });
                            self.render();
                        },
                        error: function() {
                            $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
                            $('.alert').addClass('alert-error');
                            $('.alert').html('<strong>失敗!</strong> ' + '設定發情過程發生錯誤!!');
                            $('.alert').show();
                        }
                    });
                    $(this).dialog("close");
                },
                "取消": function() {
                    $(this).dialog("close");
                }
            }
        });
        //設定注精視窗
        var InjectText = this.$("#InjectText");
        this.$("#InjectDialog").dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                "確定": function() {
                    //新增一筆異動紀錄
                    var record = new recordModel();
                    var d = new Date();
                    record.set("cid", selfModel.get("taxID"));
                    record.set("content", '2:' + EstrusRemark.val());
                    //record.set("createdate", d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + " " + d.toLocaleTimeString());
                    record.save(null, {
                        success: function(model) {
                            //新增成功則變更乳牛狀態，並儲存
                            if (selfModel.get("status") == '0')
                                selfModel.save({ status: 2 });
                            else
                                selfModel.save({ status: 0 });
                            self.render();
                        },
                        error: function() {
                            $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
                            $('.alert').addClass('alert-error');
                            $('.alert').html('<strong>失敗!</strong> ' + '設定注精過程發生錯誤!!');
                            $('.alert').show();
                        }
                    });
                    $(this).dialog("close");
                },
                "取消": function() {
                    $(this).dialog("close");
                }
            }
        });
        //設定按鈕狀態
        if (this.model.get("status") == "1")
            this.$("#estrusButton").text("停止發情");
        if (this.model.get("status") == "0") {
            this.$("#injectButton").attr("disabled", "disabled");
            this.$("#injectButton").addClass("disabled");
        }
        else {
            this.$("#injectButton").removeAttr("disabled");
            this.$("#injectButton").removeClass("disabled");
        }
        //設定狀態文字
        if (this.model.get("status") == "0")
            this.$("#status").val("正常狀態");
        if (this.model.get("status") == "1")
            this.$("#status").val("已發情");
        if (this.model.get("status") == "2")
            this.$("#status").val("已注精");
        return this;
    },

    events: {
        'keyup .data-field': 'updateModel',
        "click .save": "beforeSave",
        "click .delete": "deletecow",
        "click .estrus": "estrus",
        "click .inject": "inject"
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
            controlGroup.find(".help-inline").remove();
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

    savecow: function() {
        var self = this;
        //將model傳入
        this.model.save(this.model, {
            success: function(model) {
                model.fetch();
                self.render();
                app.navigate('cows/' + model.get("taxID"), true);
                $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
                $('.alert').addClass('alert-success');
                $('.alert').html('<strong>成功!</strong> ' + '乳牛資料儲存成功!!');
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

    deletecow: function() {
        this.model.destroy({
            success: function() {
                $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
                $('.alert').addClass('alert-success');
                $('.alert').html('<strong>成功!</strong> ' + '乳牛資料刪除成功!!');
                $('.alert').show();
                window.history.back();
            }
        });
        return false;
    },

    estrus: function() {
        //開啟視窗
        if (this.model.get("status") == '0')
            $("#estrusDialog").dialog("open");
        else {
            var record = new recordModel();
            var d = new Date();
            record.set("cid", this.model.get("taxID"));
            record.set("content", "0:停止發情");
            //record.set("createdate", d.getFullYear() + "-" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1) : "0" + (d.getMonth() + 1)) + "-" + d.getDate() + " " + d.toLocaleTimeString());
            var self = this;
            record.save(null, {
                success: function(model) {
                    //變更乳牛狀態，並儲存
                    self.model.save({ status: 0 });
                    self.render();
                },
                error: function() {
                    $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
                    $('.alert').addClass('alert-error');
                    $('.alert').html('<strong>失敗!</strong> ' + '設定發情過程發生錯誤!!');
                    $('.alert').show();
                }
            });
        }
    },

    inject: function() {
        $("#InjectDialog").dialog("open");
    }
});