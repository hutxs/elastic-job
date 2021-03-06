function bootstrapValidator(){
    $('#job-settings-form').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        submitHandler: function(validator, form, submitButton) {
            $.post(form.attr('action'), form.serialize(), function(result) {
                if (result.valid == true || result.valid == 'true') {
                    $('#job-settings-form').bootstrapValidator('disableSubmitButtons', true);
                }
                else {
                    $('#job-settings-form').bootstrapValidator('disableSubmitButtons', false);
                }
            }, 'json');
        },
        fields: {
            jobClass: {
                validators: {
                    notEmpty: {
                        message: '作业实现类不能为空'
                    },
                    regexp: {
                        regexp: /^([a-zA-Z_][a-zA-Z0-9_]*\.)*[a-zA-Z_][a-zA-Z0-9_]*$/,
                        message: '作业实现类不能包含非法字符'
                    }
                }
            },
            jobName: {
                validators: {
                    notEmpty: {
                        message: '作业名称不能为空'
                    },
                    stringLength: {
                        max: 100,
                        message: '作业名称长度不能超过100字符大小'
                    },
                    regexp: {
                        regexp: /^([a-zA-Z_][a-zA-Z0-9_]*\.)*[a-zA-Z_][a-zA-Z0-9_]*$/,
                        message: '作业名称包含非法字符'
                    }
                }
            },
            cron: {
                validators: {
                    notEmpty: {
                        message: 'cron表达式不能为空'
                    }
                }
            },
            cpuCount: {
                validators: {
                    notEmpty: {
                        message: 'cpu数量不能为空'
                    },
                    regexp: {
                        regexp: /^(-?\d+)(\.\d+)?$/,
                        message: 'cpu数量只能包含数字和小数点'
                    }
                }
            },
            memoryMB: {
                validators: {
                    notEmpty: {
                        message: '单片作业内存不能为空'
                    }
                }
            },
            shardingTotalCount: {
                validators: {
                    notEmpty: {
                        message: '作业分片数不能为空'
                    }
                }
            },
            appURL: {
                validators: {
                    notEmpty: {
                        message: '应用所在路径不能为空'
                    }
                }
            },
            bootstrapScript : {
                validators: {
                    notEmpty: {
                        message: '启动脚本不能为空'
                    }
                }
            },
            beanName : {
                validators: {
                }
            },
            applicationContext : {
                validators: {
                }
            },
            shardingItemParameters: {
                validators: {
                    regexp: {
                        regexp: /^(\d+)=([a-zA-Z0-9_\u4e00-\u9fa5]+)(,(\d+)=([a-zA-Z0-9_\u4e00-\u9fa5]+))*$/,
                        message: '作业分片项的格式不正确'
                    }
                }
            }
        }
    });
    $("#job-settings-form").submit(function(ev){
        ev.preventDefault();
    });
}
    
$('#jobName').blur(function(){
    var jobName = $('#jobName').val();
    if(jobName != ''){
        $.ajax({
            url: '/job/jobs/' + jobName,
            async: false,
            dataType: 'json',
            success: function (data) {
                if(null != data){
                    if(!$.isNumeric(data.length)){
                        $("#jobName-server-check").modal();
                        $('#confirm').on("click", function(){
                            $("#jobName").val("");
                            $('#job-settings-form').data('bootstrapValidator').updateStatus('jobName', 'NOT_VALIDATED', null).validateField('jobName');
                        });
                    }
                }
            }
        });
    }
});
    
$("#shardingItemParameters").blur(function(){
    if($("#shardingItemParameters").val() == ''){
        $('#job-settings-form').data('bootstrapValidator').enableFieldValidators('shardingItemParameters', false);
    }
    else{
        $('#job-settings-form').data('bootstrapValidator').enableFieldValidators('shardingItemParameters', true);
    }
});
    
$("#shardingItemParameters").focus(function(){
    $('#job-settings-form').data('bootstrapValidator').enableFieldValidators('shardingItemParameters', true);
});
    
function submitBootstrapValidator(){
    $("#save_form").on("click", function(){
        if($('#shardingItemParameters').val() == '' || null == $('#shardingItemParameters').val()){
            $('#job-settings-form').data('bootstrapValidator').enableFieldValidators('shardingItemParameters', false);
        }
        var bootstrapValidator = $("#job-settings-form").data('bootstrapValidator');
        bootstrapValidator.validate();
        if(bootstrapValidator.isValid()){
            var beanName = $("#beanName").val();
            var applicationContext = $("#applicationContext").val();
            if(beanName.length == 0 && applicationContext.length == 0){
                bindSubmitJobSettingsForm();
            }else if(null != applicationContext && beanName.length == 0){
                $("#delete-data—beanName").modal(); 
            }else if(null != beanName && applicationContext.length == 0){
                $("#delete-data-applicationContext").modal();
            }else{
                bindSubmitJobSettingsForm();
            }
        }
    });
    $("#reset_form").on("click", function(){
        $('#job-settings-form').data('bootstrapValidator').resetForm();
    });
}
    
function dataControl(){
    $('#jobType').change(function() {
        var jobType = $('#jobType').val();
        if(jobType =='SIMPLE'){ 
            $("#scriptCommandLine").attr("disabled","disabled");
            $("#streamingProcess").hide();
            $("#streamingProcess_box").hide();
        }else if(jobType =='DATAFLOW'){ 
            $("#streamingProcess").show();
            $("#streamingProcess_box").show();
            $("#scriptCommandLine").attr("disabled","disabled");
        }else if(jobType =='SCRIPT'){
            $("#scriptCommandLine").removeAttr("disabled"); 
            $("#streamingProcess").hide();
            $("#streamingProcess_box").hide();
        }
    });
}
    
function dataInfo(){
    return {
        "jobName":$("#jobName").val(),
        "jobClass":$("#jobClass").val(),
        "cron":$("#cron").val(),
        "jobType":$("#jobType").val(),
        "cpuCount":$("#cpuCount").val(),
        "jobExecutionType":$("#jobExecutionType").val(),
        "memoryMB":$("#memoryMB").val(),
        "bootstrapScript":$("#bootstrapScript").val(),
        "beanName":$("#beanName").val(),
        "shardingTotalCount":$("#shardingTotalCount").val(),
        "jobParameter":$("#jobParameter").val(),
        "failover":$("#failover").prop("checked"),
        "misfire":$("#misfire").prop("checked"),
        "streamingProcess":$("#streamingProcess").prop("checked"),
        "appURL":$("#appURL").val(),
        "applicationContext":$("#applicationContext").val(),
        "shardingItemParameters": $("#shardingItemParameters").val(),
        "scriptCommandLine":$("#scriptCommandLine").val(),
        "description":$("#description").val()
    };
}