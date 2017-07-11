// ==UserScript==
// @name         B站查看封面图
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  添加了一个可查看当前视频页面封面图的按钮，默认是透明的，鼠标移动上去便可显现出来，位置在首页那一栏与视频标题那一栏中间的空白处的左侧位置
// @author       Blackcat
// @include      *://www.bilibili.com/video/av*
// @include      *://bangumi.bilibili.com/anime/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (!window.jQuery) { // 若还未加载jQuery, 则监听
        var jQuery;
        Object.defineProperty(window, 'jQuery', {
            configurable: true, enumerable: true, set: function (v) {
                jQuery = v;
                mainCover();// 设置jQuery后, 立即注入
            }, get: function () {
                return jQuery;
            }
        });
    } else {
        mainCover();
    }

    function mainCover(){
        $(function(){
            if($('.cover_image').length=="0"){   //判断是否为番剧页面（无封面图片标签）
                var bangumiId=location.hash.replace(/[^0-9]+/g, '');    //获取番剧ID（非视频ID）
                $.ajax({
                    url: 'http://bangumi.bilibili.com/web_api/episode/'+bangumiId+'.json',
                    type: 'GET',
                    dataType: 'json',
                    success:function(data){
                        var coverUrl=data.result.currentEpisode.cover;  //获取封面图图片地址
                        var img=$(`<img src=${coverUrl} class='cover_image'>`); //创建封面图标签
                        $('body').append(img);
                        coverImg();
                    },
                    error:function(data){
                        console.log("请求发生错误",data);
                    }
                });
            }else{
                coverImg();
            }
        });
    }

    function coverImg(){
        $('.cover_image').css({         //设置封面图样式，属性与事件
            "position":"absolute",
            'left':'20px',
            'top':'260px',
            'height':'150px',
            'z-index':'1000',
            'display':'none',
            'cursor':'pointer'
        }).attr({
            'title':'点击在新页面中查看原图'
        }).bind({
            'click':function(){
                window.open($(this).attr('src'));
            }
        });
        var url=$('.cover_image').eq(0).attr('src');    //获取封面图图片地址
        var imgbtn=$(`<div class="imgbtn">封面图片显示</div>`);   //创建按钮
        imgbtn.css({                    //设置按钮样式与事件
            "position":"absolute",
            'left':'20px',
            'top':'230px',
            'color':'#fff',
            'background':'pink',
            'height':'24',
            'width':'120',
            'text-align':'center',
            'line-height':'24px',
            'cursor':'pointer',
            'border-radius':'12px',
            'z-index':'10000',
            'user-select':'none',
            'opacity':'0'
        }).bind({
            'click':function(){
                if($('.cover_image').css('display')=='none'){
                    $('.cover_image').css('display','block');
                    $(this).html('封面图片显示');
                }else{
                    $('.cover_image').css('display','none');
                    $(this).html('封面图片隐藏');
                }
            },
            'mouseenter':function(){
                $(this).css({
                    'opacity': '1'
                });
            },
            'mouseleave':function(){
                if($('.cover_image').css('display')=='none'){
                    $(this).css({
                        'opacity':'0'
                    });
                }
            }
        });
        $('.header').append(imgbtn);
    }
    // Your code here...
})();