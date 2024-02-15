// ==UserScript==
// @name            游戏社区(TapTap)列表页贴子预览
// @namespace       https://github.com/QIUZAIYOU/Taptap-PostPreview
// @version         0.1
// @description     TapTap游戏社区列表页贴子（除图片和视频贴）卡片新增预览按钮，可在列表页直接预览贴子内容。
// @author          QIUZAIYOU
// @match           https://www.taptap.cn/app/*/topic
// @icon            https://www.google.com/s2/favicons?sz=64&domain=taptap.cn
// @require         https://scriptcat.org/lib/513/2.0.0/ElementGetter.js
// @grant           GM_addStyle
// ==/UserScript==

(function () {
    'use strict';
    const selecter = {
        momentCardFooter: '.moment-card__footer',
        previewWrapper: '#previewWrapper',
        previewIframe: '#previewIframe',
        previewIframeMask: '#previewIframeMask'
    }
    const styles = {
        PreviewWrapperStyle: '#previewWrapper{position:fixed;top:50%;left:50%;box-sizing:border-box;width:600px;height:97vh;border:2px solid #00d9c5;border-radius:10px;background:#191919;transform:translate(-50%,-50%);overflow:hidden}#previewWrapper::backdrop{backdrop-filter:blur(3px)}#previewIframe{width:100%;height:100%;border:none;background:#191919}#previewIframeMask{position:absolute;display:block;background:#191919;inset:0}',
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
            const previewWrapper = document.getElementById('previewWrapper')
            if (previewWrapper) return previewWrapper
            return utils.createElementAndInsert(`<div id="previewWrapper" popover><div id="previewIframeMask"></div><iframe id="previewIframe" title="previewIframe"></iframe></div>`, document.body, 'append')
        },
        async insertPreviewButtonToMomentCard() {
            const previewButtonHtml = `
            <span class="icon-button flex-center--y moment-card_repost--btn moment-card__footer-btn" data-booth-item="" data-track-prevent="click" data-booth-level="1">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" class="icon" viewBox="0 0 1024 1024">
                    <path fill="#98999e" d="M480.384 319.872c-123.712 0-224 100.288-224 224s100.288 224 224 224 224-100.288 224-224-100.288-224-224-224zm0 384c-88.384 0-160-71.616-160-160s71.616-160 160-160 160 71.616 160 160-71.616 160-160 160zm443.712-272.576C815.744 284.8 657.152 192.192 480.064 192.192S144.448 284.8 36.096 431.296c-47.872 64.704-47.872 160.832 0 225.472C144.448 803.264 303.04 895.872 480.128 895.872s335.616-92.608 444.032-239.104c47.808-64.64 47.808-160.768-.064-225.472zm-48.128 172.416C775.488 748.736 630.784 832 478.976 832c-151.68 0-296.384-83.264-396.928-228.224-23.936-34.56-23.936-84.736 0-119.296 100.544-145.088 245.248-228.224 396.928-228.224 151.808 0 296.512 83.2 396.992 228.224 23.936 34.496 23.936 84.736 0 119.232z" />
                </svg>
            </span>
            `
            const [$previewWrapper, $previewIframe, $previewIframeMask] = await elmGetter.get([selecter.previewWrapper, selecter.previewIframe, selecter.previewIframeMask])
            const previewIframeWindow = $previewIframe.contentWindow
            $previewWrapper.addEventListener('toggle', (event) => {
                if (event.newState === 'closed') {
                    $previewIframe.src = ''
                    $previewIframeMask.style.display = 'block'
                }
            })
            $previewIframe.addEventListener('load', () => {
                const iframeInnerStyleElement = previewIframeWindow.document.createElement('style')
                iframeInnerStyleElement.innerHTML = styles.PreviewIframeStyle
                iframeInnerStyleElement.id = 'PreviewIframeStyle'
                previewIframeWindow.document.head.append(iframeInnerStyleElement)
                $previewIframeMask.style.display = 'none'
            })
            elmGetter.each(selecter.momentCardFooter, (momentCardFooter) => {
                const previewButton = utils.createElementAndInsert(previewButtonHtml, momentCardFooter, 'append')
                previewButton.addEventListener('click', (event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    $previewWrapper.showPopover()
                    $previewIframe.src = momentCardFooter.parentElement.querySelector('a[href*="moment"]').href
                })
            })
        }
    }
    utils.insertStyleToDocument('PreviewWrapperStyle', styles.PreviewWrapperStyle)
    modules.insertPreviewElementToDocument()
    modules.insertPreviewButtonToMomentCard()
})();
