// ==UserScript==
// @name        游戏社区(TapTap)列表页贴子预览
// @namespace   https://github.com/QIUZAIYOU/Taptap-PostPreview
// @version     1.0
// @author      QIAN
// @match       *://www.taptap.com/app*
// @match       *://www.taptap.com/forum/hot
// @grant       none
// @description 2021/7/30 上午10:44:48
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==

$(function() {
    const pvBtn = "<span class='pvBtn special'>预览</span>";
    //创建预览贴子样式
    const pvBtnCss =
        `<style class="pvBtnStyle">.btnList li{margin-bottom:5px}span.pvBtn,span.pvBtnClose,li.enterBtn{transition:.3s;background:#14b9c8;padding:0 5px;border-radius:3px;color:#fff!important;border:1px solid #14B9C8}li.enterBtn a{color:#fff!important}span.pvBtn:hover,span.pvBtnClose:hover,li.enterBtn:hover{color:#fff!important;background:#12A7B4!important;border-color:#14B9C8!important;cursor:pointer}li.enterBtn:hover a{color:#fff!important;text-decoration:none}span.pvBtn.special{background:#fff;color:#14B9C8!important;}span.pvBtn.special:hover{color:#fff!important}.common-v2-list .right-menu-from{display:flex}span.pvBtn.disable{border-color:#e43;color:#e43!important;}span.pvBtn.disable:hover{color:#e43!important;border-color:#e43!important;background:#fff!important}</style>`
    let pvCssCustom =
        `<style class="pvStyle">#pvBoxWrapper{display:flex;align-items:center;z-index:19940519;position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,.8);margin-top:0}.pvBoxWrapper.topic-v2-container .topic-main__content{padding:20px!important;}.pvBoxWrapper .video-page__main-content{width:100%;padding:20px}.pvBoxWrapper .moment-main{max-width:inherit;box-shadow:none;padding:20px}.pvBoxWrapper .moment-main .moment-img-list__wrap-1{margin:0 0 30px}.pvBoxWrapper .author-wrap__left-box .topic-app__icon{margin-top:20px!important}</style>`;
    let pvCssOfficialTopic =
        `<link rel="stylesheet" type="text/css" postType="topic" href="https://assets.tapimg.com/style/base-7b247195fc.css"/>
        <link rel="stylesheet" type="text/css"  postType="topic" href="https://assets.tapimg.com/css/app-5715b5e261.css"/>
        <link rel="stylesheet" type="text/css"  postType="topic" href="https://assets.tapimg.com/css/topic_v2-b8fc6fb3ab.css"/>
        <link rel="stylesheet" type="text/css"  postType="topic" href="https://assets.tapimg.com/scripts/vue-components/moment-repost-list/vue_module__moment_repost_list-1537f7bbc4.css"/>`;
    let pvCssOfficialMoment =
        `<link rel="stylesheet" type="text/css"  postType="moment" href="https://assets.tapimg.com/web-app/static/css/chunk-4c35ceae.d2c13019.css" />
        <link rel="stylesheet" type="text/css"  postType="moment" href="https://assets.tapimg.com/web-app/static/css/chunk-common.882b050c.css" />
        <link rel="stylesheet" type="text/css"  postType="moment" href="https://assets.tapimg.com/web-app/static/css/app.a252d3ef.css" />
        <link rel="stylesheet" type="text/css"  postType="moment" href="https://assets.tapimg.com/css/topic_v2-b8fc6fb3ab.css" />`;
    $("body").prepend(pvBtnCss);
    $("body").prepend(pvCssCustom);
    //延迟执行等待贴子列表加载完成
    setTimeout(function() {
        //创建预览和取消预览按钮
        $(".moment-list-item .moment-card__footer").append(pvBtn);
        //遍历每个贴子
        $(".moment-list-item").each(function() {
            $(this).find(".pvBtn").eq(0).addClass("first");
            $(this).find(".pvBtn").not(".first").remove();
            let postLinkId = $(this).attr("data-event-log").split(',')[0].replace(/[^\d]/g, "");
            let postLinkType = $(this).attr("data-event-log").split(',')[1].replace('"paramType":"', '').replace('Detail"', '');
            let postLink = `https://www.taptap.com/${postLinkType}/${postLinkId}`
                //创建预览贴子容器
            let pvBoxWrapper = `<div id="pvBoxWrapper" class="pvBoxWrapper topic-v2-container"></div>`
            let pvBox =
                `<div class="pvContent" style="overflow-x:hidden;overflow-y:scroll;width:695px;height:calc(100vh - 20px);border:1px solid #14B9C8;border-radius:3px;margin:0 auto;background:#fff;"><div class="pvBox"></div></div>`;
            //为预览按钮添加点击事件
            $(this).find(".pvBtn").click(function(event) {
                event.stopPropagation();
                $("body").append(pvBoxWrapper);
                $("body").find(".pvBoxWrapper").append(
                    pvBox);
                //创建进入贴子及取消预览按钮
                let btnList =
                    `<ul class="btnList" style="position:absolute;left:50%;margin-left:355px;top:10px;"><li class="pvBtnClose">取消预览</li><li class="enterBtn"><a href="${postLink}" target="_blank">进入贴子</a></li></ul>`;

                //区分普通贴和其他贴
                if (`${postLink}`.indexOf("topic") != -1) {
                    $("body .pvBoxWrapper .pvBox").attr("postlink", `${postLink}`)
                    $("body .pvBoxWrapper .pvBox").load(
                        `${postLink} .topic-main__content`);
                    $("body .pvBoxWrapper .pvContent").prepend(btnList);
                    $("body .pvBoxWrapper").prepend(pvCssOfficialTopic);

                } else {
                    return false;
                }
                //为取消预览按钮添加点击事件
                $("body .pvBoxWrapper .pvBtnClose").click(function() {
                    //移除贴子的预览内容及样式文件
                    $("body .pvBoxWrapper").remove();
                });
            });
            if (`${postLink}`.indexOf("video") != -1) {
                $(this).find(".pvBtn").text("视频贴无法预览").addClass("disable").unbind();
            } else if (`${postLink}`.indexOf("moment") != -1) {
                $(this).find(".pvBtn").text("动态贴无法预览").addClass("disable").unbind();
            };

        });
    }, 2300);
    //点击遮罩层关闭预览
    $(document).mouseup(function(e) {
        let con = $(".pvContent"); // 设置目标区域
        if (!con.is(e.target) && con.has(e.target).length === 0) {
            $("body .pvBoxWrapper").remove();
        }
    });
})
