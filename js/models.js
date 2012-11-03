window.cowModel = Backbone.Model.extend({
    urlRoot: "api/cows"
	, initialize: function () {
	    this.validators = {};
	    this.validators.taxID = function (value) {
	        var flag = true;
	        var msg = '';
	        if (value == null || value.length <= 0) {
	            flag = false;
	            msg = '請輸入統一編號!!';
	        }
	        else if (value != null && value.length > 9) {
	            flag = false;
	            msg = '最多9個字!!';
	        }
	        if (flag)
	            return { isValid: true };
	        else
	            return { isValid: false, message: msg };
	    };
	    this.validators.earTag = function (value) {
	        var flag = true;
	        var msg = '';
	        if (value != null && value.length > 7) {
	            flag = false;
	            msg = '最多7個字!!';
	        }
	        if (flag)
	            return { isValid: true };
	        else
	            return { isValid: false, message: msg };
	    };
	    this.validators.fatherID = function (value) {
	        var flag = true;
	        var msg = '';
	        if (value != null && value.length > 9) {
	            flag = false;
	            msg = '最多9個字!!';
	        }
	        if (flag)
	            return { isValid: true };
	        else
	            return { isValid: false, message: msg };
	    };
	    this.validators.motherID = function (value) {
	        var flag = true;
	        var msg = '';
	        if (value != null && value.length > 11) {
	            flag = false;
	            msg = '最多11個字!!';
	        }
	        if (flag)
	            return { isValid: true };
	        else
	            return { isValid: false, message: msg };
	    };
	    this.validators.birthDay = function (value) {
	        var flag = true;
	        var msg = '';
	        if (value != null && !(/[1-2][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]/.test(value))) {
	            flag = false;
	            msg = '日期格式不正確!!(應該為西元年-月-日)';
	        }
	        else if (value != null && value.length > 10) {
	            flag = false;
	            msg = '最多10個字!!';
	        }
	        if (flag)
	            return { isValid: true };
	        else
	            return { isValid: false, message: msg };
	    };
	    this.validators.esDay = function (value) {
	        var flag = true;
	        var msg = '';
            /*
	        if (value != null && !(/[1-2][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]/.test(value))) {
	            flag = false;
	            msg = '日期格式不正確!!(應該為西元年-月-日)';
	        }
	        else if (value != null && value.length > 10) {
	            flag = false;
	            msg = '最多10個字!!';
	        }
            */
	        if (flag)
	            return { isValid: true };
	        else
	            return { isValid: false, message: msg };
	    };
	    this.validators.status = function (value) {
	        var flag = true;
	        var msg = '';
	        if (value != null && value.length > 1) {
	            flag = false;
	            msg = '最多1個字!!';
	        }
	        if (flag)
	            return { isValid: true };
	        else
	            return { isValid: false, message: msg };
	    };
	    this.validators.remark = function (value) {
	        var flag = true;
	        var msg = '';
	        if (value != null && value.length > 21845) {
	            flag = false;
	            msg = '最多21845個字!!';
	        }
	        if (flag)
	            return { isValid: true };
	        else
	            return { isValid: false, message: msg };
	    };
	}

	, validateItem: function (key) {
	    return (this.validators[key]) ? this.validators[key](this.get(key)) : { isValid: true };
	}

	, validateAll: function () {
	    var messages = {};
	    for (var key in this.validators) {
	        if (this.validators.hasOwnProperty(key)) {
	            var check = this.validators[key](this.get(key));
	            if (check.isValid === false) {
	                messages[key] = check.message;
	            }
	        }
	    }
	    return _.size(messages) > 0 ? { isValid: false, messages: messages} : { isValid: true };
	}
	, defaults: {
	    taxID: '',
	    earTag: '',
	    fatherID: '',
	    motherID: '',
	    birthDay: '',
	    esDay: '',
	    status: '0',
	    remark: ''
	}
});
window.cowCollection = Backbone.Collection.extend({
    model: cowModel,
    url: function() {
        if (this.query != null && this.query.length != 0)
            return "api/cows/search/" + this.query;
        else
            return "api/cows";
    }
});
window.recordModel = Backbone.Model.extend({
	urlRoot : "api/records"
	,initialize: function () {
	this.validators = {};
	this.validators.rid = function (value) {
		var flag = true;
		var msg = '';
//		if (value==null || value.length<=0){
//			flag = false;
//			msg='請輸入序號!!';
//		}
//		else if (value!=null && value.length>10){
//			flag = false;
//			msg='最多10個字!!';
//		}
		if (flag)
			return {isValid: true};
		else
			return {isValid: false, message: msg};
	};
	this.validators.cid = function (value) {
		var flag = true;
		var msg = '';
//		if (value!=null && value.length>10){
//			flag = false;
//			msg='最多10個字!!';
//		}
		if (flag)
			return {isValid: true};
		else
			return {isValid: false, message: msg};
	};
	this.validators.content = function (value) {
		var flag = true;
		var msg = '';
//		if (value!=null && value.length>21845){
//			flag = false;
//			msg='最多21845個字!!';
//		}
		if (flag)
			return {isValid: true};
		else
			return {isValid: false, message: msg};
	};
	this.validators.createdate = function (value) {
		var flag = true;
		var msg = '';
//		if (value!=null && !(/[1-2][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]/.test(value))){
//			flag = false;
//			msg='日期格式不正確!!(應該為西元年-月-日)';
//		}
//		else if (value!=null && value.length>19){
//			flag = false;
//			msg='最多19個字!!';
//		}
		if (flag)
			return {isValid: true};
		else
			return {isValid: false, message: msg};
	};
	}

	,validateItem: function (key) {
		return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
	}

	,validateAll: function () {
		var messages = {};
		for (var key in this.validators) {
			if(this.validators.hasOwnProperty(key)) {
				var check = this.validators[key](this.get(key));
				if (check.isValid === false) {
					messages[key] = check.message;
				}
			}
		}
		return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
	}

	,defaults: {
		rid: '',
		cid: '',
		content: null,
		createdate: new Date().getFullYear() + "-" + ((new Date().getMonth()+1)>9?(new Date().getMonth()+1):"0"+(new Date().getMonth()+1)) + "-" + new Date().getDate()
	}
});
window.recordCollection = Backbone.Collection.extend({
	model: recordModel,
	url: "api/records"
});
