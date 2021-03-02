// ==UserScript==
// @name            游戏社区(TapTap)列表页贴子预览
// @namespace       游戏社区列表页贴子预览
// @version         1.2.70
// @description     TapTap游戏社区列表页贴子（除图片和视频贴）卡片新增预览按钮，可在列表页直接预览贴子内容。
// @author          QIAN
// @match           *://www.taptap.com/app*
// @match           *://www.taptap.com/forum/hot
// @grant           none
// @require         https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// ==/UserScript==

$(function() {
	//获取浏览器页面链接
	var location = window.location.href;
	location = location.toLowerCase();
	//如果为TapTap域名
	if (location.indexOf("taptap") != -1) {
		//创建预览和取消预览按钮
		var pvBtn = "<li class='pvBtn special'>预览</li>";
		//创建预览贴子样式
		var pvBtnCss =
			'<style class="pvBtnStyle">.btnList li{margin-bottom:5px}li.pvBtn,li.pvBtnClose,li.enterBtn{transition:.3s;background:#14b9c8;padding:0 5px;border-radius:3px;color:#fff!important;border:1px solid #14B9C8}li.enterBtn a{color:#fff!important}li.pvBtn:hover,li.pvBtnClose:hover,li.enterBtn:hover{color:#fff!important;background:#12A7B4!important;border-color:#14B9C8!important;cursor:pointer}li.enterBtn:hover a{color:#fff!important;text-decoration:none}li.pvBtn.special{background:#fff;color:#14B9C8!important;}li.pvBtn.special:hover{color:#fff!important}.common-v2-list .right-menu-from{display:flex}li.pvBtn.disable{border-color:#e43;color:#e43!important;}li.pvBtn.disable:hover{color:#e43!important;border-color:#e43!important;background:#fff!important}</style>'
		var pvCssCustom =
			'<style class="pvStyle">#pvBoxWrapper{display:flex;align-items:center;z-index:19940519;position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,.8);margin-top:0}.pvBoxWrapper.topic-v2-container .topic-main__content{padding:20px!important;}.pvBoxWrapper .video-page__main-content{width:100%;padding:20px}.pvBoxWrapper .moment-main{max-width:inherit;box-shadow:none;padding:20px}.pvBoxWrapper .moment-main .moment-img-list__wrap-1{margin:0 0 30px}.pvBoxWrapper .author-wrap__left-box .topic-app__icon{margin-top:20px!important}</style>';
		var pvCssOfficial =
			'<link rel="stylesheet" type="text/css" href="https://assets.tapimg.com/css/app-976ec86c99.css" /><link rel="stylesheet" type="text/css" href="https://assets.tapimg.com/css/topic_v2-1cce725b19.css" /><link rel="stylesheet" type="text/css" href="https://assets.tapimg.com/css/topic_v2-81495e6647.css" />';
		var pvCssVideo =
			'<link rel="stylesheet" type="text/css" href="https://assets.tapimg.com/web-app/static/css/chunk-0019fc08.33d8e145.css" />';
		var pvCssMoment =
			'<link rel="stylesheet" type="text/css" href="https://assets.tapimg.com/web-app/static/css/chunk-146c0388.ef549312.css" />';
		//在除图片和视频贴以外的贴子卡片上追加预览和取消预览按钮以及按钮样式
		$(".app-body").prepend(pvBtnCss);
		$(".app-body").prepend(pvCssCustom);
		$(".topic-item .right-menu-from").prepend(pvBtn);
		//遍历每个贴子
		$(".topic-item").each(function() {
			//获取贴子链接
			//var postLink = $(this).find(".topic-share").attr("data-share-url");
			var postLink = $(this).attr("href");
			//创建预览贴子容器
			var pvBoxWrapper = `<div id="pvBoxWrapper" class="pvBoxWrapper topic-v2-container"></div>`
			var pvBox =
				`<div class="pvContent" style="overflow-x:hidden;overflow-y:scroll;width:695px;height:calc(100vh - 20px);border:1px solid #14B9C8;border-radius:3px;margin:0 auto;background:#fff;"><div class="pvBox"></div></div>`;
			//为预览按钮添加点击事件
			$(this).find(".pvBtn").click(function(event) {
				event.stopPropagation();
				$("body").append(pvBoxWrapper);
				$("body").find(".pvBoxWrapper").append(
					pvBox);
				//创建进入贴子及取消预览按钮
				var btnList =
					`<ul class="btnList" style="position:absolute;left:50%;margin-left:355px;top:10px;"><li class="pvBtnClose">取消预览</li><li class="enterBtn"><a href="${postLink}" target="_blank">进入贴子</a></li></ul>`;
				
				//区分普通贴和视频贴内容
				if (`${postLink}`.indexOf("topic") != -1) {
					$("body .pvBoxWrapper .pvBox").load(
						`${postLink} .topic-main__content`);
          $("body .pvBoxWrapper .pvContent").prepend(btnList);
					$("body .pvBoxWrapper").prepend(pvCssOfficial);
          
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
		//点击遮罩层关闭预览
		$(document).mouseup(function(e) {
			var con = $(".pvContent"); // 设置目标区域
			if (!con.is(e.target) && con.has(e.target).length === 0) {
				$("body .pvBoxWrapper").remove();
			}
		});
		//其他域名待补充
	} else if (location.indexOf("aiideai") != -1) {};
});
