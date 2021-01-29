var pins = document.createElement('style');
pins.setAttribute("type", "text/css");
document.getElementsByTagName('head').item(0).appendChild(pins);
var pinss = pins.sheet;

pinss.insertRule('div.recover-button { display: inline-block;padding: 0.3em 1em;text-decoration: none;'
                 + 'color: #6796ff;border: solid 2px #6796ff;border-radius: 3px;transition: .4s;margin: 0px 8px; }', pinss.cssRules.length);
pinss.insertRule('div.recover-button:hover { background-color:#6796ff; opacity:0.8; color:white; cursor:pointer;}', pinss.cssRules.length); 

//TODO 
pinss.insertRule('#context-menu { margin-top:200px;}', pinss.cssRules.length); 
pinss.insertRule('#values_cf_8_1 { height:230px;}', pinss.cssRules.length); 
pinss.insertRule('#values_subproject_id_1 { height:230px;}', pinss.cssRules.length); 

var myurl = location.href
if(myurl.indexOf('tags') > 0){
    $('#content').css('width','98%');
    $('#sidebar').remove();
}

function removeOthers(){
    removeAndAssignRecover('issue_assigned_to_id');
    removeAndAssignRecover('issue_custom_field_values_7');
    removeAndAssignRecover('values_assigned_to_id_1');
    removeAndAssignRecover('values_user_id_1');

    function removeAndAssignRecover(id){
        var $combo = $('#' + id);
        if($combo.length == 0) {
            return;
        }
        var backup = $combo[0].innerHTML;
        var $button = $('<div id="' + 'btn' + id + '" class="recover-button">元に戻す</div>');
        $combo.after($button);
        $button.on('click' , recover);

        $combo.children().each(
            function(i,comp){
                var $comp = $(comp);
                if(list.indexOf($comp.text()) < 0){
                    $comp.remove();
                }
            }
        );

        function recover() {
            $combo.children().remove();
            $combo.html(backup);
            $button.remove();
        }
    }
}

//コンポーネント変更して画面表示が切り替わった時の処理にさしこむ
var customReplaceIssueForm = replaceIssueFormWith;
replaceIssueFormWith = function(html) {
    customReplaceIssueForm(html);
    removeOthers();
};

function contextMenuShow(event) {
    var mouse_x = event.pageX;
    var mouse_y = event.pageY;
    var mouse_y_c = event.clientY;    
    var render_x = mouse_x;
    var render_y = mouse_y;
    var dims;
    var menu_width;
    var menu_height;
    var window_width;
    var window_height;
    var max_width;
    var max_height;
    var url;

    $('#context-menu').css('left', (render_x + 'px'));
    $('#context-menu').css('top', (render_y + 'px'));
    $('#context-menu').html('');

    url = $(event.target).parents('form').first().data('cm-url');
    if (url == null) {alert('no url'); return;}

    $.ajax({
        url: url,
        data: $(event.target).parents('form').first().serialize(),
        success: function(data, textStatus, jqXHR) {
            $('#context-menu').html(data);
            menu_width = $('#context-menu').width();
            menu_height = $('#context-menu').height();
            max_width = mouse_x + 2*menu_width;
            max_height = mouse_y_c + menu_height;

            var ws = window_size();
            window_width = ws.width;
            window_height = ws.height;

            /* display the menu above and/or to the left of the click if needed */
            if (max_width > window_width) {
                render_x -= menu_width;
                $('#context-menu').addClass('reverse-x');
            } else {
                $('#context-menu').removeClass('reverse-x');
            }

            if (max_height > window_height) {
                render_y -= menu_height;
                $('#context-menu').addClass('reverse-y');
                // adding class for submenu
                if (mouse_y_c < 325) {
                    $('#context-menu .folder').addClass('down');
                }
            } else {
                // adding class for submenu
                if (window_height - mouse_y_c < 345) {
                    $('#context-menu .folder').addClass('up');
                } 
                $('#context-menu').removeClass('reverse-y');
            }

            if (render_x <= 0) render_x = 1;
            if (render_y <= 0) render_y = 1;
            $('.submenu').each(
                function(i,comp){
                    var $comp = $(comp);
                    if($comp.text()==='担当者'){
                        $comp.next().find('[rel=nofollow]').each(
                            function(i2,ass){
                                var $ass = $(ass);
                                $ass.text()
                                if(list.indexOf($ass.text()) < 0){
                                    $ass.parent().remove();
                                }
                            }
                        );
                    }
                }
            );
            $('#context-menu').css('left', (render_x + 'px'));
            $('#context-menu').css('top', (render_y + 'px'));
            $('#context-menu').show();

            //if (window.parseStylesheets) { window.parseStylesheets(); } // IE
        }
    });
}

removeOthers();
