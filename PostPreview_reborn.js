// ==UserScript==
// @name            游戏社区(TapTap)列表页贴子预览
// @namespace       https://github.com/QIUZAIYOU/Taptap-PostPreview
// @version         1.3.0
// @description     TapTap游戏社区列表页贴子（除图片和视频贴）卡片新增预览按钮，可在列表页直接预览贴子内容。
// @author          QIAN
// @match           *://www.taptap.cn/app/*/topic*
// @grant           GM_addStyle
// @require         https://scriptcat.org/lib/513/2.0.0/ElementGetter.js#sha256=KbLWud5OMbbXZHRoU/GLVgvIgeosObRYkDEbE/YanRU=
// ==/UserScript==
(function () {
    'use strict';
    const selecter = {
        tap: '#tap',
        momentCardFooter: '.moment-card__footer',
        previewWrapper: '#previewWrapper',
        previewIframe: '#previewIframe',
        previewIframeMask: '#previewIframeMask',
        previewContentHeader: 'header',
        previewContentMain: 'main'
    }
    const styles = {
        PreviewWrapperStyle: '#previewWrapper{position:fixed;top:50%;left:50%;overflow:hidden;box-sizing:border-box;width:600px;height:97vh;border:2px solid #00d9c5;border-radius:10px;background:#191919;transform:translate(-50%,-50%)}#previewWrapper::backdrop{backdrop-filter:blur(3px)}#previewIframe{width:100%;height:100%;border:none;background:#191919}#previewIframeMask{position:absolute;display:flex;background:#191919;inset:0;align-items:center;justify-content:center}',
        PreviewIframeStyle: 'body{background:#191919!important}header{display:none!important}main{margin-left:0!important}'
    }
    const utils = {
        /**
         * 休眠
         * @param {Number} 时长
         * @returns
         */
        sleep(times) {
            return new Promise(resolve => setTimeout(resolve, times))
        },
        /**
         * 创建并插入元素至目标元素
         * @param {String} Html 字符串
         * @param {Element} 目标元素
         * @param {String} 插入方法（before/after/prepend/append）
         * @returns 被创建的元素
         */
        createElementAndInsert(HtmlString, target, method) {
            const element = elmGetter.create(HtmlString, target)
            target[method](element)
            return element
        },
        /**
         * 向文档插入自定义样式
         * @param {String} id 样式表id
         * @param {String} css 样式内容
         */
        insertStyleToDocument(id, css) {
            const styleElement = GM_addStyle(css)
            styleElement.id = id
        },
        htmlStringToDom(htmlString) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlString.trim();
            return tempDiv.firstChild;
        }
    }
    const modules = {
        insertPreviewElementToDocument() {
            const previewElementHtml = `
                <div id="previewWrapper" popover>
                    <div id="perviewFloat">
                        <div id="previewClose"></div>
                        <div id="previewEnterPost"><a href=""></a></div>
                    </div>
                    <div id="previewIframeMask">
                        <div class="loading-dots__wrapper" type="dots" loading="true">
                            <span class="loading-dots__dot" style="font-size: 6px;"></span>
                            <span class="loading-dots__dot" style="font-size: 6px;"></span>
                            <span class="loading-dots__dot" style="font-size: 6px;"></span>
                        </div>
                    </div>
                    <iframe id="previewIframe" title="previewIframe"></iframe>
                </div>
            `
            const previewWrapper = document.getElementById('previewWrapper')
            if (previewWrapper) return previewWrapper
            return utils.createElementAndInsert(previewElementHtml, document.body, 'append')
        },
        async insertPreviewButtonToMomentCard() {
            const previewButtonHtml = `
            <span class="icon-button flex-center--y moment-card_repost--btn moment-card__footer-btn" data-booth-item="" data-track-prevent="click" data-booth-level="1">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" class="icon" viewBox="0 0 1395 1024">
                    <path fill="#98999e" d="M698.098 1023.954c-249.238 0-477.245-153.882-680.697-455.598a106.157 106.157 0 0 1 0-115.804C220.853 153.882 448.767 0 698.098 0s477.245 153.882 680.697 455.598a106.157 106.157 0 0 1 0 115.804c-203.637 298.67-431.459 452.552-680.697 452.552zm0-920.382c-212.637 0-412.997 138.466-596.556 409.905C286.624 784.731 487.03 923.382 698.098 923.382s412.997-138.466 596.556-409.905C1110.91 240.746 910.412 103.618 698.098 103.618z" />
                    <path fill="#98999e" d="M697.913 717.714a204.19 204.19 0 1 1 204.976-204.19 204.606 204.606 0 0 1-204.976 204.19zm0-307.81A102.095 102.095 0 1 0 800.424 512a102.28 102.28 0 0 0-102.51-102.095z" />
                </svg>
            </span>
            `
            const [$previewWrapper, $previewIframe, $previewIframeMask] = await elmGetter.get([selecter.previewWrapper, selecter.previewIframe, selecter.previewIframeMask])
            const previewIframeWindow = $previewIframe.contentWindow
            $previewWrapper.addEventListener('toggle', (event) => {
                if (event.newState === 'closed') {
                    $previewIframe.src = ''
                    $previewIframeMask.style.display = 'flex'
                    document.querySelector(selecter.tap).style.pointerEvents = 'auto'
                }
            })
            $previewIframe.addEventListener('load', async () => {
                const [$previewContentHeader, $previewContentMain] = await elmGetter.get([selecter.previewContentHeader, selecter.previewContentMain], previewIframeWindow.document)
                if ($previewContentHeader && $previewContentMain) {
                    $previewContentHeader.style.display = 'none'
                    $previewContentMain.style.marginLeft = '0'
                    $previewIframeMask.style.display = 'none'
                }
            })
            elmGetter.each(selecter.momentCardFooter, (momentCardFooter) => {
                const previewButton = utils.createElementAndInsert(previewButtonHtml, momentCardFooter, 'append')
                previewButton.addEventListener('click', (event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    $previewWrapper.showPopover()
                    $previewIframe.src = momentCardFooter.parentElement.querySelector('a[href*="moment"]').href
                    document.querySelector(selecter.tap).style.pointerEvents = 'none'
                })
            })
        }
    }
    utils.insertStyleToDocument('PreviewWrapperStyle', styles.PreviewWrapperStyle)
    modules.insertPreviewElementToDocument()
    modules.insertPreviewButtonToMomentCard()
})();
