$('#sidebar').css('display','none');
$('#content').css('width','100%');
$($('#content > table td').get(0)).attr('id','title_area');
$($('#title_area > div').get(0)).attr('id','title_area_first_div');
$($('#title_area > div > div').get(0)).attr('id','title_area_div_hdr');
$($('#title_area > div > div').get(1)).attr('id','title_area_div_body');
var $fdix = $('#title_area_first_div');
var $hdrdix = $('#title_area_div_hdr');
var $bodydix = $('#title_area_div_body');


function resize_(targetWid){
    $('#content > table td:first-child > div > div.gantt_subjects .issue-subject').each(function(){
        var $this = $(this);
        $this.css('width',targetWid - 100 + 'px');
    });
    $fdix.css('width',targetWid - 1 + 'px');
    $hdrdix.css('width',targetWid - 1 + 'px');
    $bodydix.css('width',targetWid - 1 + 'px');
}

if($('#today_line').length > 0){
    $('div.task.task_todo').each(
        function(index,target){
            var $target = $(target);
            if(($target.position().left + $target.width()) < $('#today_line').position().left){
                $target.removeClass('task_todo');
                $target.addClass('task_late');
                $target.css('background-color','');
            } 
        }
    );
}

$('div.task.leaf').each(
    function(index,target) {
    var $div = $(target);
    if(!$div.hasClass('label')){
        var $divNext = $div.next();
        if($divNext.hasClass('label')){
        if($divNext.text().indexOf('Resolve') >= 0
            || $divNext.text().indexOf('Developed') >= 0
            || $divNext.text().indexOf('Closed') >= 0){
            $div.removeClass('task_late');
            $div.removeClass('task_todo');
            $div.addClass('task_done');
            $div.css('background-color','');
        } else if($divNext.text().indexOf('Destructed') >= 0){
            $div.removeClass('task_late');
            $div.removeClass('task_todo');
            $div.addClass('task_done');
            $div.css('background-color','');
        }
        }
    }
    }
);

resize_(550);


$('#title_area').resizable({handles:'e',resize:function(e,ui){
    var targetWid = $(e.target).width();
    resize_(targetWid);
}});

$('.ui-resizable-handle.ui-resizable-e').hover(
    function(){
        var $this=$(this);
        $this.css({'background-color':'LightCyan','opacity':0.8})
    },
    function(){
        var $this=$(this);
        $this.css({'background-color':'LightSkyBlue','opacity':0.2})
    }
);

$('.issue-subject').hover(
    function(){
        var $this=$(this);
        $this.css({'background-color':'Yellow','opacity':0.8});
        $('#task-todo-' + $this.attr('id')).css({'background':'Yellow','opacity':0.8});
        $('#task-done-' + $this.attr('id')).css({'background':'Yellow','opacity':0.8});
        $('#task-todo-' + $this.attr('id')).next('.task_late').css({'background':'Yellow','opacity':0.8});
    },
    function(){
        var $this=$(this);
        $this.css({'background-color':'','opacity':1.0});
        $('#task-todo-' + $this.attr('id')).css({'opacity':1.0,'background':'#aaa url(../images/task_todo.png)'});
        $('#task-done-' + $this.attr('id')).css({'background':'#00c600 url(../images/task_done.png)','opacity':1.0});
        $('#task-todo-' + $this.attr('id')).next('.task_late').css({'background':'#f66 url(../images/task_late.png)','opacity':1.0});
    }
);

var vacation_map = {};


$('div.task.leaf').each(
    function(index,target){
    var $target = $(target).next().next();

    $target.children().each(
        function(childindex,child){

        var $child = $(child);
        var childtext = $child.text();

        if($child.is('span')
            && childtext.indexOf('Vacation') >= 0){

            var startpos =  childtext.indexOf('開始日: ')+5;
            var vacation = childtext.substring(startpos,startpos+10);

            vacation_month = vacation.substring(0,7).replace(/\/0|\//,'-');
            vacation_day   = parseInt(vacation.substring(8,10),10);

            if(!vacation_map[vacation_month]){
            vacation_map[vacation_month] = [];
            }

            vacation_map[vacation_month].push(vacation_day);

            $target.prev().prev().remove();
            $target.prev().remove();
            $target.remove();
        }
        }
    );
    }
);


var holiday_map  = {'2015-9':[21,22,23],'2015-10':[12],'2015-11':[3,23],'2015-12':[23]
        ,'2016-1':[1,2,3,11],'2016-2':[11],'2016-3':[21],'2016-4':[29],'2016-5':[3,4,5],'2016-6':[]
        ,'2016-7':[18],'2016-8':[],'2016-9':[19,22],'2016-10':[10],'2016-11':[3,23],'2016-12':[23]
        ,'2017-1':[1,2,3,11],'2017-2':[11],'2017-3':[21],'2017-4':[29],'2017-5':[3,4,5],'2017-6':[]
        ,'2017-7':[17],'2017-8':[11],'2017-9':[18,23],'2017-10':[9],'2017-11':[3,23],'2017-12':[23]
        };

var firstday = {'2015-9':0,'2015-10':-2,'2015-11':-5,'2015-12':0
        ,'2016-1':-3,'2016-2':1,'2016-3':0,'2016-4':-3,'2016-5':-5,'2016-6':-1
        ,'2016-7':-3,'2016-8':0,'2016-9':-2,'2016-10':-4,'2016-11':0,'2016-12':-2
        };

var lastday  = {'2015-9':30,'2015-10':31,'2015-11':30,'2015-12':31
        ,'2016-1':31,'2016-2':29,'2016-3':31,'2016-4':30,'2016-5':31,'2016-6':30
        ,'2016-7':31,'2016-8':31,'2016-9':30,'2016-10':31,'2016-11':30,'2016-12':31
        };

var before_lastday  = {'2015-9':31,'2015-10':30,'2015-11':31,'2015-12':30
        ,'2016-1':30,'2016-2':31,'2016-3':29,'2016-4':31,'2016-5':30,'2016-6':31
        ,'2016-7':30,'2016-8':31,'2016-9':31,'2016-10':30,'2016-11':31,'2016-12':30
        };

var weeknum  = {'月':0,'火':1,'水':2,'木':3,'金':4,'土':5,'日':6};

$('div.gantt_hdr').each(
    function(index,target){

    if(index <= 2){
        return;
    }

    var $target = $(target);

    if($target.height() < 60){
        return;
    }

    var left = $target.position().left;
    var top  = $target.position().top;

    var month = '2015-10';
    var day   = 1;
    var week  = $target[0].innerText;

    var monthleft = 0;
    var dayleft   = 0;


    $('div.gantt_hdr').each(
        function(indexDay,targetDay){

        if(indexDay <= 2){
            return;
        }

        var $targetDay = $(targetDay);

        if($targetDay.position().top === top){
            return;
        }
        targetDayleft = $targetDay.position().left;

        if(targetDayleft <= left
            && (targetDayleft + $targetDay.width() >= left)){

            var datecomp = $targetDay.children()[0];

            if(datecomp === undefined){
            day = undefined;
            dayleft = targetDayleft;
            return;
            }
            var $datecomp = $(datecomp);
            if($datecomp.is('a')){
            month = $datecomp[0].innerText;
            monthleft = targetDayleft;
            } else {
            day   = parseInt($datecomp[0].innerText,10);
            dayleft = targetDayleft;
            }
        }
        }
    );
    var isStride = false;
    if(monthleft > dayleft){
        isStride = true;
    }

    if(day === undefined){
        day = firstday[month];
    }
    day = day + weeknum[week];

    if(isStride){
        if(day > before_lastday[month]){
        day = firstday[month];
        day = day + weeknum[week];
        }
    } else {
        if(day > lastday[month]){
        day = firstday[month];
        day = day + weeknum[week];
        }
    }

    var monthholiday = holiday_map[month];

    if(monthholiday){
        $.each(monthholiday,
        function(index,holiday){
            if(holiday === day){
            $target.addClass('nwday');
            }
        }
        );
    }

    var monthvacation = vacation_map[month];
    if(monthvacation){
        $.each(monthvacation,
        function(index,holiday){
            if(holiday === day){
            $target.addClass('vacation');
            }
        }
        );
    }
    }
);



$('div.gantt_hdr.nwday').css('background-color','#DAE7F9');
$('div.gantt_hdr.vacation').css('background-color','#DAF9E3');


var $tagVacation = $('#version-795');

while($tagVacation.next().text().indexOf('Vacation') >= 0){
    $tagVacation.next().remove();
}

$tagVacation.remove();
