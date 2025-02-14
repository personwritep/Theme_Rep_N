// ==UserScript==
// @name        Theme Rep N
// @namespace        http://tampermonkey.net/
// @version        1.8
// @description        ブログテーマの整理・変更ツール　新スキン版
// @author        Ameba Blog User
// @match        https://ameblo.jp/*
// @match        https://blog.ameba.jp/ucs/entry/srventryupdate*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=ameba.jp
// @run-at        document-start
// @noframes
// @grant        none
// @updateURL        https://github.com/personwritep/Theme_Rep_N/raw/main/Theme_Rep_N.user.js
// @downloadURL        https://github.com/personwritep/Theme_Rep_N/raw/main/Theme_Rep_N.user.js
// ==/UserScript==


let first=0; // 起動後の自動スクロールの有無
let theme_list; // 登録テーマの配列

let read_json=sessionStorage.getItem('TRepN'); // セッションストレージ読込み
theme_list=JSON.parse(read_json);
if(theme_list==null){
    theme_list=[[ , ]]; }


function storage(){
    let bord_active=document.querySelector('.skin-borderLoud.is-active');
    if(bord_active && bord_active.textContent=="テーマ別"){ // テーマ別画面で動作
        theme_list=[[ , ]]; // リセット

        let btn_arch=document.querySelectorAll('.skin-btnArchive');
        for(let i=0; i<btn_arch.length; i++){
            theme_list[i]=[ , ]; } // 初期化

        for(let k=0; k<btn_arch.length; k++){
            let btn_link=btn_arch[k].getAttribute('href').split('theme-');
            let theme_id=btn_link[1].slice(0, 11);
            let theme_name=btn_arch[k].textContent;
            theme_list[k][0]=theme_id;
            theme_list[k][1]=theme_name; }

        let write_json=JSON.stringify(theme_list);
        sessionStorage.setItem('TRepN', write_json); }} // セッションストレージに書込み


function disp_themes(){
    let themes_panel=document.querySelector('#themes_panel');
    let themes_ul=document.querySelector('#themes_ul');

    if(themes_panel && themes_ul){
        themes_ul.innerHTML='';
        for(let k=0; k<theme_list.length; k++){
            let themes_li=document.createElement('li');
            themes_li.setAttribute('class', 'themes_li');
            themes_li.innerHTML=theme_name_disp(theme_list[k][1]);
            let themes_lis=document.querySelectorAll('.themes_li');
            if(themes_lis.length<theme_list.length && theme_list[k]!=''){
                themes_ul.appendChild(themes_li); }}}

    function theme_name_disp(str){
        if(str){
            let name=str.slice(0, str.lastIndexOf('('));
            let num=str.slice(str.lastIndexOf('(')).replace(/[^0-9]/g, '');
            return '<uni>'+ name +'<span class="trep_num"> '+
                '<c>（</c>'+ num +'<c>）</c></span></uni>'; }}}




let target=document.querySelector('head');
let monitor=new MutationObserver(main);
monitor.observe(target, { childList: true });

function main(){
    if(document.querySelector('.skin-page')){ // 新スキンブログ画面で動作

        let help_SVG=
            '<svg height="24" width="24" viewBox="0 0 210 220">'+
            '<path d="M89 22C71 25 54 33 41 46C7 81 11 142 50 171C58 177 68 182 78 '+
            '185C90 188 103 189 115 187C126 185 137 181 146 175C155 169 163 162 169 '+
            '153C190 123 189 80 166 52C147 30 118 18 89 22z" style="fill: #97d4f3;"></path>'+
            '<path d="M67 77C73 75 78 72 84 70C94 66 114 67 109 83C106 91 98 95 93 '+
            '101C86 109 83 116 83 126L111 126C112 114 122 108 129 100C137 90 141 76 '+
            '135 64C127 45 101 45 84 48C80 49 71 50 68 54C67 56 67 59 67 61L67 77M'+
            '85 143L85 166L110 166L110 143L85 143z" style="fill:#fff;"></path>'+
            '</svg>';

        let panel=
            '<div id="trep_panel">'+
            '<span id="trep_span">テーマ取得 ▷ 記事選択：Click / Ctrl+Click'+
            ' ▷ 変更先テーマ選択：Click　<a class="help_TR">'+ help_SVG +'</a></span>'+
            '<div id="trep_inner">'+
            '<span id="trep_progress"></span>'+
            '<input id="theme_write" type="submit" value="OK">'+
            '<input id="not_write" type="submit" value="Cancel">'+
            '<input id="themes_get" type="submit" value="テーマ取得">'+
            '<input id="w_position" type="submit" value="サブウインドウ位置">'+
            '<input id="panel_position" type="submit" value="パネル位置">'+
            '<input id="blog_setting" type="submit" value="テーマ編集">'+
            '<input id="stop_out" type="submit" value="処理中止">'+
            '</div></div>';

        if(!document.querySelector('#trep_panel')){
            document.body.insertAdjacentHTML('beforeend', panel); }


        let help_TR=document.querySelector('.help_TR');
        if(help_TR){
            let url='https://ameblo.jp/personwritep/entry-12797538582.html';
            help_TR.setAttribute('href', url);
            help_TR.setAttribute('target', '_blank'); }


        let panel2=
            '<div id="themes_panel">'+
            '<p>　　　登録テーマ一覧</p><ul id="themes_ul"></ul></div>';

        if(!document.querySelector('#themes_panel')){
            document.body.insertAdjacentHTML('beforeend', panel2); }


        disp_themes();


        let style=
            '<style id="trep_style">'+
            '#trep_panel { position: fixed; z-index: 4000; top: 60px; '+
            'font: bold 16px/24px Meiryo; color: #999; background: #fff; '+
            'width: 620px; height: 80px; padding: 17px 5px 0; text-align: left; '+
            'border: 1px solid #aaa; border-radius: 6px; box-sizing: content-box; '+
            'overflow: hidden; box-shadow: 0 20px 30px rgb(0, 0, 0, .2); } '+
            '#trep_span { margin-left: 20px; white-space: nowrap; } '+
            '#trep_inner { position: absolute; bottom: 6px; left: 5px; '+
            'height: 37px; width: 620px; background: #e4eef8; } '+
            '#trep_progress { margin-left: 20px; line-height: 41px; } '+
            '.prosvg { width: 22px; height: 20px; margin-top: 9px; } '+
            '.trep_box { margin: 0 10px; color: #000; border: 1px solid #666; '+
            'border-radius: 2px; } '+
            '.trep_box.b1 { padding: 3px 15px 0; color: #2196f3; } '+
            '.trep_box.b2 { padding: 3px 10px 0 15px; } '+
            '.trep_num { color: #2196f3; } '+
            'c { font-weight: normal; }'+
            '#theme_write, #not_write, #themes_get, #w_position, #panel_position, '+
            '#blog_setting, #stop_out { position: absolute; bottom: 4px; '+
            'font: bold 16px/16px Meiryo; padding: 2px 10px 0; height: 29px; '+
            'color: #000; box-shadow: inset 0 0 0 40px rgb(40, 180, 250, 0.3); } '+
            '#stop_out { right: 25px; display: none; } '+
            '#theme_write { right: 200px; display: none; } '+
            '#not_write { right: 90px; display: none; } '+
            '#themes_get, #w_position, #panel_position, #blog_setting { '+
            'color: #777; box-shadow: inset 0 0 0 20px rgb(0, 255, 232, 0.1); } '+
            '#themes_get { left: 20px; } #w_position { left: 160px; } '+
            '#panel_position { left: 340px; } #blog_setting { right: 20px; } '+

            '#themes_panel { position: fixed; z-index: 4000; top: 60px; color: #666; '+
            'font: bold 16px/24px Meiryo; background: #fff; text-align: left; '+
            'min-width: 200px; min-height: 77px; padding: 8px 6px 12px; '+
            'border: 1px solid #aaa; border-radius: 6px; box-sizing: content-box; '+
            'box-shadow: 0 20px 30px rgb(0, 0, 0, .2); overflow: hidden; } '+
            '#themes_panel p { padding: 4px 0 2px; margin-bottom: 12px; '+
            'background: #e4eef8; } '+
            '#themes_ul { list-style: none; padding-inline-start: 0;  max-height: 75vh; '+
            'overflow-y: scroll; overscroll-behavior: none; '+
            'scrollbar-width: none; margin-right: -6px; } '+
            '.themes_li { padding: 3px 10px 0 15px; margin: 1px 6px 4px 1px; '+
            'outline: 1px solid #ccc; outline-offset: -1px; white-space: nowrap; '+
            'cursor: pointer; max-width: 315px; overflow: hidden; transition: 0.2s; } '+
            '.themes_li:hover { background: #eee; direction: rtl; } '+
            'uni { unicode-bidi: plaintext; } '+
            '.themes_li.to_theme { outline: 2px solid red; } '+
            '.help_TR { position: absolute; cursor: pointer; } '+

            '#main { font-family: Meiryo; } '+
            '.skin-archiveList .skin-borderQuiet:hover { '+
            'outline: 1px solid #2196f3; outline-offset: -1px; '+
            'box-shadow: inset 0 0 0 120px rgba(187, 222, 251, .3); } '+
            '.skin-archiveList .skin-borderQuiet:hover * { opacity: 1; } '+
            '.select_item { background: #2196f3 !important; } '+
            '.select_item * { color: #fff !important; } '+
            '.doing_item { background: #00bcd4 !important; } '+
            '.doing_item * { color: #fff !important; } '+
            '[data-uranus-component="archiveList"]>li { '+
            'padding: 4px 8px; background: #fff; } '+
            '[data-uranus-component="entryItemImage"], '+
            '[data-uranus-component="imageFrame"] img '+
            '{ height: 60px !important; width: 60px !important; overflow: hidden; } '+
            '[data-uranus-component="entryItemTitle"] { margin-bottom: 0; '+
            'font-size: 16px; color: #000; } '+
            '[data-uranus-component="entryItemTheme"] dd.skin-textQuiet a { '+
            'color: #444; } '+
            '.skin-textQuiet { color: #888; } '+
            '[data-uranus-component="entryItemMeta"] { min-height: 40px; } '+
            '[data-uranus-component="entryItemMeta"]> * { margin-bottom: -2px; } '+

            'div[id^="div-gpt-ad"] { display: none; } '+
            '#app> :not(.skin-page) { display: none; }'+
            '</style>';

        if(!document.querySelector('#trep_style')){
            document.body.insertAdjacentHTML('beforeend', style); }


        let blog_setting=document.querySelector('#blog_setting');
        if(blog_setting){
            blog_setting.onclick=function(){
                window.open('https://blog.ameba.jp/ucs/theme/themeinput.do', '_blank'); }}


        let trep_panel=document.querySelector('#trep_panel');
        let panel_position=document.querySelector('#panel_position');
        let themes_panel=document.querySelector('#themes_panel');
        let client_w=themes_panel.clientWidth;
        if(panel_position && trep_panel && themes_panel){
            if(get_cookie('trep_panel')=='left'){
                trep_panel.style.left=(50+client_w).toString() +'px';
                trep_panel.style.right='unset';
                themes_panel.style.left='20px';
                themes_panel.style.right='unset'; }
            else{
                trep_panel.style.left='unset';
                trep_panel.style.right=(50+client_w).toString() +'px';
                themes_panel.style.left='unset';
                themes_panel.style.right='20px'; }

            panel_position.onclick=function(){
                if(get_cookie('trep_panel')=='left'){
                    trep_panel.style.left='unset';
                    trep_panel.style.right=(50+client_w).toString() +'px';
                    themes_panel.style.left='unset';
                    themes_panel.style.right='20px';
                    document.cookie='trep_panel=right; Max-Age=2592000'; }
                else{
                    trep_panel.style.left=(50+client_w).toString() +'px';
                    trep_panel.style.right='unset';
                    themes_panel.style.left='20px';
                    themes_panel.style.right='unset';
                    document.cookie='trep_panel=left; Max-Age=2592000'; }}}


        let themes_get=document.querySelector('#themes_get');
        if(themes_get){
            themes_get.onclick=function(){
                let entryThemes=document.querySelector('.skin-entryThemes a');
                if(entryThemes){ // 記事一覧外でテーマ取得がクリックされた場合
                    let theme_url=entryThemes.getAttribute('href');
                    location.href=theme_url; }
                else{ // 記事一覧内でテーマ取得がクリックされた場合
                    reload_act(); }}}

    } // 新スキンブログ画面で動作



    let bord_active=document.querySelector('.skin-borderLoud.is-active');
    if(bord_active){ // 記事一覧画面で動作

        let s_mode=0; // 選択操作モード
        let count; // 変更指定した文書数
        let selected_array;
        let new_win;
        let link_target;
        let trep_wtop;
        let trep_wleft;


        learn_themes();
        select_set();
        select_to();

        function learn_themes(){
            let query=location.href.toString().slice(-4);
            if(query=='?org'){
                setTimeout(()=>{
                    storage();
                    disp_themes();
                    let org_url=sessionStorage.getItem('TRepN_org'); // ストレージ読込み
                    if(org_url){
                        location.href=org_url; }
                }, 100); }
            else{
                setTimeout(()=>{
                    storage();
                    disp_themes();
                    select_to();
                    if(first==0){
                        let wscroll_y=sessionStorage.getItem('TRepN_scroll');
                        if(!wscroll_y){
                            wscroll_y=0; }
                        window.scrollTo(0, wscroll_y); // スクロール位置を再現
                        first=1; }
                }, 100); }
        } // learn_themes()


        function select_set(){
            let ac_list=document.querySelectorAll('.skin-archiveList .skin-borderQuiet');
            for(let k=0; k<ac_list.length; k++){
                ac_list[k].onclick=function(event){
                    event.preventDefault();
                    if(event.ctrlKey){
                        select_all(ac_list[k]); }
                    else{
                        selected(ac_list[k]); }}}

            function select_all(item){
                if(s_mode==0){
                    if(item.classList.contains('select_item')){
                        for(let k=0; k<ac_list.length; k++){
                            ac_list[k].classList.remove('select_item'); }}
                    else{
                        for(let k=0; k<ac_list.length; k++){
                            ac_list[k].classList.add('select_item'); }}}}

            function selected(item){
                if(s_mode==0){
                    if(item.classList.contains('select_item')){
                        item.classList.remove('select_item'); }
                    else{
                        item.classList.add('select_item'); }}}
        } // select_set()


        function select_to(){
            let themes_li=document.querySelectorAll('.themes_li');
            for(let k=0; k<themes_li.length; k++){
                themes_li[k].onclick=function(event){
                    clear_red();
                    to_theme(k); }}

            function to_theme(select){
                count_select();
                if(count>0){
                    s_mode=1;
                    themes_li[select].classList.add('to_theme'); // 変更先テーマを選択

                    setTimeout(()=>{
                        let trep_span=document.querySelector('#trep_span');
                        let themes_get=document.querySelector('#themes_get');
                        let w_position=document.querySelector('#w_position');
                        let panel_position=document.querySelector('#panel_position');
                        let blog_setting=document.querySelector('#blog_setting');
                        let theme_write=document.querySelector('#theme_write');
                        let not_write=document.querySelector('#not_write');
                        let stop_out=document.querySelector('#stop_out');
                        if(trep_span && themes_get && w_position &&
                           panel_position && theme_write && not_write && stop_out){
                            trep_span.innerHTML=
                                '記事数<span class="trep_box b1"></span>'+
                                '⇨ テーマ<span class="trep_box b2"></span>に変更';
                            document.querySelector('.trep_box.b1').textContent=count;
                            theme_name_disp(theme_list[select][1]);
                            themes_get.style.display='none';
                            w_position.style.display='none';
                            panel_position.style.display='none';
                            blog_setting.style.display='none';
                            theme_write.style.display='block';
                            not_write.style.display='block';

                            theme_write.onclick=function(){ // OKを押した場合
                                theme_write.style.display='none';
                                not_write.style.display='none';
                                stop_out.style.display='block';
                                select_array(theme_list[select][0]);
                                open_all(); }

                            not_write.onclick=function(){ // Cancelを押した場合
                                clear_red(); }}
                    }, 100 ); }
            } // to_theme()


            function count_select(){
                count=0;
                let ac_list=document.querySelectorAll('.skin-archiveList .skin-borderQuiet');
                for(let k=0; k<ac_list.length; k++){
                    if(ac_list[k].classList.contains('select_item')){
                        count +=1; }}}
        } // select_to()


        function theme_name_disp(str){
            let name=str.slice(0, str.lastIndexOf('('));
            let num=str.slice(str.lastIndexOf('(')).replace(/[^0-9]/g, '');
            let target_theme=document.querySelector('.trep_box.b2');
            if(target_theme){
                target_theme.innerHTML=name +'<span class="trep_num"> <c>（</c>'+
                    num+'<c>）</c></span>'; }}


        function clear_red(){
            s_mode=0;
            let trep_span=document.querySelector('#trep_span');
            let themes_get=document.querySelector('#themes_get');
            let w_position=document.querySelector('#w_position');
            let panel_position=document.querySelector('#panel_position');
            let blog_setting=document.querySelector('#blog_setting');
            let theme_write=document.querySelector('#theme_write');
            let not_write=document.querySelector('#not_write');
            let stop_out=document.querySelector('#stop_out');
            trep_span.innerHTML=
                'テーマ取得　▷　記事選択：Click / Ctrl+Click　▷　変更先テーマ選択：Click';
            themes_get.style.display='block';
            w_position.style.display='block';
            panel_position.style.display='block';
            blog_setting.style.display='block';
            theme_write.style.display='none';
            not_write.style.display='none';
            stop_out.style.display='none';

            let themes_li=document.querySelectorAll('.themes_li');
            for(let k=0; k<themes_li.length; k++){
                themes_li[k].classList.remove('to_theme');
                themes_li[k].blur(); }}


        function select_array(new_theme){
            selected_array=[];
            link_target=[];
            let ac_list=document.querySelectorAll('.skin-archiveList .skin-borderQuiet');
            for(let k=0; k<ac_list.length; k++){
                if(ac_list[k].classList.contains('select_item')){
                    selected_array.push(ac_list[k]);
                    let title_link=ac_list[k].querySelector('h2 a');
                    let entry_id_a=title_link.getAttribute('href').split('entry-');
                    if(entry_id_a[1]){
                        let entry_id=entry_id_a[1].slice(0, 11);
                        if(entry_id){
                            link_target.push(
                                'https://blog.ameba.jp/ucs/entry/srventryupdateinput.do?id='+
                                entry_id +'&trep='+ new_theme); }}}}}


        function open_all(){
            trep_wtop=get_cookie('trep_wtop');
            trep_wleft=get_cookie('trep_wleft');

            let stop_out=document.querySelector('#stop_out');
            if(stop_out){
                stop_out.onclick=function(){
                    stop_out.style.boxShadow='inset 0 0 0 20px #1976d2';
                    stop_out.style.color='#fff';
                    stop_out.value='停止処理中';
                    reload_act(); }}

            progress(0);
            let next=0;
            open_win(next);
            let search=setInterval(continuas, 500); // 自動で実行指示 🟥
            function continuas(){
                if(new_win[next].closed){
                    next +=1;
                    progress(next);
                    if(next<link_target.length){
                        open_win(next); }
                    else{
                        progress(next);
                        clearInterval(search);
                        ending(); }}}}


        function progress(n){
            let psb=
                '<svg class="prosvg" viewBox="0 0 308 308">'+
                '<path style="fill: #2196f3" d="M33 10C30 11 27 12 24 14C6 2'+
                '6 10 47 10 66L10 223L10 262C10 270 9 277 14 284C28 304 57 298 79 '+
                '298L212 298L254 298C261 298 269 299 276 297C279 297 282 295 285 2'+
                '93C302 281 298 260 298 241L298 83L298 45C298 37 299 30 293 23C283'+
                ' 10 271 10 256 10L227 10L97 10L55 10C48 10 40 9 33 10z"></path>'+
                '</svg>';

            let psw=
                '<svg class="prosvg" viewBox="0 0 308 308">'+
                '<path style="fill: #aaa" d="M33 10C30 11 27 12 24 14C6 2'+
                '6 10 47 10 66L10 223L10 262C10 270 9 277 14 284C28 304 57 298 79 '+
                '298L212 298L254 298C261 298 269 299 276 297C279 297 282 295 285 2'+
                '93C302 281 298 260 298 241L298 83L298 45C298 37 299 30 293 23C283'+
                ' 10 271 10 256 10L227 10L97 10L55 10C48 10 40 9 33 10z"></path>'+
                '<path style="fill: #fff" d="M39 22C15 27 22 59 22 '+
                '77L22 222L22 258C22 265 21 272 26 278C31 285 40 286 48 286L86 286'+
                'L210 286L249 286C256 286 263 287 270 285C285 282 286 269 286 256L'+
                '286 230L286 85L286 50C286 43 287 36 282 30C277 23 268 22 259 22L2'+
                '22 22L99 22L60 22C53 22 46 21 39 22z"></path>'+
                '</svg>';

            let disp='';
            let trep_progress=document.querySelector('#trep_progress');
            if(n>=0){
                for(let k=0; k<count; k++){
                    if(k<n){
                        disp +=psb; }
                    else{
                        disp +=psw; }}
                trep_progress.innerHTML=disp; }
            else{
                trep_progress.innerHTML=''; }}


        function open_win(n){
            new_win=[];
            let win_option='top='+trep_wtop+',left='+trep_wleft+
                ',width=620,height=260'; // 🔲

            new_win[n]=window.open(link_target[n], n, win_option); // 🔲
            selected_array[n].classList.remove('select_item');
            selected_array[n].classList.add('doing_item'); } // 処理中のグリーン表示


        function ending(){
            let trep_span=document.querySelector('#trep_span');
            if(trep_span){
                trep_span.innerHTML='処理が終了しました。 テーマ別記事リストを更新します';
                setTimeout(()=>{
                    reload_act();
                }, 4000); }}


        let w_position=document.querySelector('#w_position');
        if(w_position){
            w_position.onclick=function(event){
                event.preventDefault();
                let tmp_w;
                open_tmp();

                function open_tmp(){
                    if(!tmp_w || tmp_w.closed){
                        let win_option=
                            'top='+ get_cookie('trep_wtop') +
                            ',left='+ get_cookie('trep_wleft') +',width=620,height=260'; // 🔲
                        tmp_w=window.open('', 'tmp_window', win_option); // 🔲
                        if(!tmp_w.document.querySelector('#tmp_w_set')){
                            tmp_w.document.write(
                                '<p id="tmp_w_set" style="font: bold 18px Meiryo; '+
                                'padding: 30px 0 10px;">サブウインドウの位置設定</p>'+
                                '<p>このサブウインドウを適当な位置へドラッグします<br>'+
                                '下のボタンを押すとウインドウ位置が設定されます</p>'+
                                '<button style="font: bold 16px Meiryo; padding: 2px 10px 0;" '+
                                'onclick="window.close()" type="button">位置を設定</button>'+
                                '<style>body { background: #cbdce3; font-size: 16px; '+
                                'text-align: center; }</style>' ); }}}

                tmp_w.onbeforeunload=function(){ // Cookie保存 30日
                    trep_wtop=tmp_w.screenY;
                    trep_wleft=tmp_w.screenX;
                    document.cookie='trep_wtop='+trep_wtop+'; Max-Age=2592000';
                    document.cookie='trep_wleft='+trep_wleft+'; Max-Age=2592000'; }}}

    } // 記事一覧画面で動作


    function reload_act(){
        let theme_tab=document.querySelector('.skin-archiveNavTabs li:nth-child(3)>a');
        if(theme_tab){
            let theme_url=theme_tab.getAttribute('href');
            let org_url=location.pathname;
            sessionStorage.setItem('TRepN_scroll', window.scrollY); // スクロール位置を保存

            let bord_active=document.querySelector('.skin-borderLoud.is-active');
            if(bord_active && bord_active.textContent=="テーマ別"){ // テーマ別画面の場合
                location.href=org_url; }
            else{
                sessionStorage.setItem('TRepN_org', org_url); // セッションストレージ書込み
                setTimeout(()=>{
                    location.href=theme_url +'?org';
                }, 100); }}}


    function get_cookie(name){
        let cookie_req=document.cookie.split('; ').find(row=>row.startsWith(name));
        if(cookie_req){
            if(cookie_req.split('=')[1]==null){
                return 0; }
            else{
                return cookie_req.split('=')[1]; }}
        if(!cookie_req){
            return 0; }}

} // main()




window.addEventListener('DOMContentLoaded', function(){
    if(location.pathname.indexOf('updateinput')!=-1){ // 編集画面で動作
        let theme_id;
        let query=window.location.search.slice(1); // 文頭?を除外
        if(query){
            let theme_id_n=query.split('&')[1].split('=')[0];
            if(theme_id_n && theme_id_n=='trep'){
                theme_id=query.split('&')[1].split('=')[1]; }}

        if(document.body.classList.contains('l-body')){ // 最新版エディタで動作
            let style=
                '<style id="trep_style">'+
                '#globalHeader, #js-header-bar, #js-preview, .l-main, .l-hashtag, '+
                '.p-cover, .l-communication, .p-warning--copylight, #globalFooter, '+
                '.p-theme__add { visibility: hidden; position: fixed; } '+
                '.l-form { padding: 16px 0 !important; } .l-body { padding: 0 15px; } '+
                'html { overflow: hidden !important; } '+
                '.p-title__text { min-width: 590px; width: 590px !important; } '+
                '.l-under-module { margin: 0px; } '+
                '.l-postTime { position: absolute; left: 0 !important; } '+
                '.p-theme { position: absolute; left: 250px !important; } '+
                '.p-theme__select { width: 340px; } '+
                '.l-footer { padding: 0; } '+
                '.p-submit__container { margin: 85px 280px 0 0 !important; }'+
                '</style>';

            if(!document.querySelector('#trep_style')){
                document.body.insertAdjacentHTML('beforeend', style); }

            if(theme_id){ // 編集画面の処理 🟦
                let interval=setInterval(find_selector, 40); // 処理タイミング 🟥
                function find_selector(){

                    let editor_iframe=document.querySelector('.cke_wysiwyg_frame');
                    let iframe_body;
                    if(editor_iframe){
                        let iframe_doc=editor_iframe.contentWindow.document;
                        if(iframe_doc){
                            iframe_body=iframe_doc.querySelector('body.cke_editable'); }}
                    let tageditor_text=document.querySelector('#entryTextArea');
                    let selector=document.querySelector('#js-themeSelector');
                    let publish=document.querySelector('.js-submitButton[publishflg="0"]');

                    if((iframe_body || tageditor_text) && selector && publish){
                        clearInterval(interval);
                        selector.value=theme_id;
                        rel();
                        function rel(){
                            setTimeout(()=>{
                                publish.click();
                            }, 1000); // 処理タイミング 🟥
                            setTimeout(()=>{
                                publish.style.background='red';
                                publish.click();
                            }, 5000); } // バックアップ押下　停止を救済する🟥
                    }}}
        } // 最新版エディタで動作


        else{ // タグ編集エディタで動作
            let style=
                '<style id="trep_style">'+
                '#globalHeader, #ucsHeader, .l-ucs-sidemenu-area, #ucsMainRight, '+
                '#entryCreate h1, #entryTheme .btnDefault, .entryHashtag, '+
                '#firstDescriptionArea, #entryMain, #displayTag, #atclInfo, #previewBtn, '+
                '.amemberHelp, #attentionBox2 { display: none !important; } '+
                '#ucsContent { background: orange; } '+
                '#ucsMainLeft { margin: 0 20px; } '+
                '#subContentsArea { margin: 0 !important; } '+
                '#title { padding: 2px 10px 0; font: 16px Meiryo; } '+
                '#js-ga_change select { padding: 3px 6px 0; font: 16px Meiryo; } '+
                '.btnDefault { font: 16px Meiryo; }'+
                '</style>';

            if(!document.querySelector('#trep_style')){
                document.body.insertAdjacentHTML('beforeend', style); }

            if(theme_id){ // 編集画面の処理 🟦
                let interval=setInterval(find_selector, 200); // 処理タイミング 🟥
                function find_selector(){
                    let selector=document.querySelector('#js-ga_change select');
                    let publish=
                        document.querySelector('.actionControl .btnDefault[value="全員に公開"]');
                    if(selector && publish){
                        clearInterval(interval);
                        selector.value=theme_id;
                        rel();
                        function rel(){
                            setTimeout(()=>{
                                publish.click();
                            }, 1500); // 処理タイミング 🟥
                            setTimeout(()=>{
                                publish.style.background='red';
                                publish.click();
                            }, 5000); } // バックアップ押下　停止を救済する🟥
                    }}}
        } // タグ編集エディタで動作

    }}); // 編集画面で動作




window.addEventListener('DOMContentLoaded', function(){
    if(location.pathname.indexOf('updateend')!=-1){ // 送信完了画面で動作

        window.document.body.style.background='#c5d8e1';
        window.document.body.style.boxShadow='0 0 0 100vh #c5d8e1';

        select_e(close_w);

        function select_e(close_w){
            let error_report=document.querySelector('.p-error');
            if(error_report==null){ // 保存エラー無い場合 編集画面を閉じる
                if(window.opener){
                    window.opener.close(); }}
            else{ // 保存エラーのある場合は 赤を送信　編集画面を残す
                if(window.opener){
                    report('red'); }}
            close_w(); }

        function close_w(){
            window.open('about:blank','_self').close(); } // 完了画面は常に自動的に閉じる

        function report(color){
            window.opener.document.querySelector('.p-title__text').style.background=color; }}

}); // 送信完了画面で動作

