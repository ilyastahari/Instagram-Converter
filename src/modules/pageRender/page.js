import { services as s, version, repo, donations, supportedAudio, links, env } from "../config.js";
import { getCommitInfo } from "../sub/currentCommit.js";
import loc from "../../localization/manager.js";
import emoji from "../emoji.js";
import changelogManager from "../changelog/changelogManager.js";

import {
    checkbox,
    collapsibleList,
    explanation,
    footerButtons,
    multiPagePopup,
    popup,
    popupWithBottomButtons, 
    sep,
    settingsCategory,
    switcher,
    socialLink,
    socialLinks,
    urgentNotice,
    keyboardShortcuts,
    webLoc,
    sponsoredList,
    betaTag,
    linkSVG,
    instaSVG
} from "./elements.js";

let com = getCommitInfo();

let enabledServices = Object.keys(s).filter(p => s[p].enabled).sort().map((p) => {
    return `<br>&bull; ${s[p].alias ? s[p].alias : p}`
}).join('').substring(4)

let donate = ``
let donateLinks = ``
let audioFormats = supportedAudio.map((p) => {
    return { "action": p }
})
audioFormats.unshift({ "action": "best" })
for (let i in donations["links"]) {
    donateLinks += `<a id="don-${i}" class="switch autowidth" href="${donations["links"][i]}" target="_blank">REPLACEME ${i}</a>`
}
let extr = ''
for (let i in donations["crypto"]) {
    donate += `<div class="subtitle${extr}">${i} (REPLACEME)</div><div id="don-${i}" class="text-to-copy" onClick="copy('don-${i}')">${donations["crypto"][i]}</div>`
    extr = ' top-margin'
}

export default function(obj) {
    const t = (str, replace) => {
        return loc(obj.lang, str, replace)
    }

    audioFormats[0]["text"] = t('SettingsAudioFormatBest');

    try {
        return `
<!DOCTYPE html>
<html lang="${obj.lang}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="viewport-fit=cover, width=device-width, height=device-height, initial-scale=1, maximum-scale=1">

        <title>${t("AppTitleInsta")}</title>

        <meta property="og:url" content="${env.webURL}">
        <meta property="og:title" content="${t("AppTitleInsta")}">
        <meta property="og:description" content="${t('EmbedBriefDescription')}">
        <meta property="og:image" content="${env.webURL}icons/generic.png">
        <meta name="title" content="${t("AppTitleInsta")}">
        <meta name="description" content="${t('AboutSummary')}">
        <meta name="twitter:card" content="summary">
        
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="${t("AppTitleInsta")}">

        <link rel="icon" type="image/x-icon" href="icons/favicon.ico">
        <link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="icons/favicon-16x16.png">

        <link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png">

        <link rel="manifest" href="manifest.webmanifest">
        <link rel="stylesheet" href="fonts/notosansmono.css">
        <link rel="stylesheet" href="cobalt.css">

        <meta name="theme-color" content="#000000">

        <link rel="preload" href="fonts/notosansmono.css" as="style">
        <link rel="preload" href="assets/meowbalt/error.png" as="image">
        <link rel="preload" href="assets/meowbalt/question.png" as="image">

        ${env.plausibleHostname ?
            `<script 
                defer 
                data-domain="${new URL(env.webURL).hostname}" 
                src="https://${env.plausibleHostname}/js/script.js"
            ></script>`
        : ''}
    </head>
    <body id="cobalt-body">
        <noscript>
            <div style="margin: 2rem;">${t('NoScriptMessage')}</div>
        </noscript>
        
        ${multiPagePopup({
            name: "settings",
            closeAria: t('AccessibilityGoBack'),
            header: {
                aboveTitle: {
                    text: `v.${version}-${obj.hash} (${obj.branch})`,
                    url: `${repo}/commit/${obj.hash}`
                },
                title: `${t('TitlePopupSettings')}`
            },
            tabs: [{
                name: "video",
                title: `${emoji("🎬")} ${t('SettingsVideoTab')}`,
                content: settingsCategory({
                    name: "downloads",
                    title: t('SettingsQualitySubtitle'),
                    body: switcher({
                        name: "vQuality",
                        explanation: t('SettingsQualityDescription'),
                        items: [{
                            action: "max",
                            text: "8k+"
                        }, {
                            action: "2160",
                            text: "4k"
                        }, {
                            action: "1440",
                            text: "1440p"
                        }, {
                            action: "1080",
                            text: "1080p"
                        }, {
                            action: "720",
                            text: "720p"
                        }, {
                            action: "480",
                            text: "480p"
                        }, {
                            action: "360",
                            text: "360p"
                        }, {
                            action: "240",
                            text: "240p"
                        }, {
                            action: "144",
                            text: "144p"
                        }]
                    })
                })
                + settingsCategory({
                    name: "codec",
                    title: t('SettingsCodecSubtitle'),
                    body: switcher({
                        name: "vCodec",
                        explanation: t('SettingsCodecDescription'),
                        items: [{
                            action: "h264",
                            text: "h264 (mp4)"
                        }, {
                            action: "av1",
                            text: "av1 (mp4)"
                        }, {
                            action: "vp9",
                            text: "vp9 (webm)"
                        }]
                    })
                })
                + settingsCategory({
                    name: "gif",
                    title: "gif",
                    body: checkbox([{
                        action: "twitterGif",
                        name: t("SettingsTwitterGif"),
                        padding: "no-margin"
                    }])
                    + explanation(t('SettingsTwitterGifDescription'))
                })
                + settingsCategory({
                    name: "h265",
                    title: "h265",
                    body: checkbox([{
                        action: "tiktokH265",
                        name: t("SettingsTikTokH265"),
                        padding: "no-margin"
                    }])
                    + explanation(t('SettingsTikTokH265Description'))
                })
            }, {
                name: "audio",
                title: `${emoji("🎶")} ${t('SettingsAudioTab')}`,
                content: settingsCategory({
                    name: "general",
                    title: t('SettingsFormatSubtitle'),
                    body: switcher({
                        name: "aFormat",
                        explanation: t('SettingsAudioFormatDescription'),
                        items: audioFormats
                    })
                    + sep(0)
                    + checkbox([{
                        action: "muteAudio",
                        name: t("SettingsVideoMute"),
                        padding: "no-margin"
                    }])
                    + explanation(t('SettingsVideoMuteExplanation'))
                })
                + settingsCategory({
                    name: "youtube-dub",
                    title: t("SettingsAudioDub"),
                    body: checkbox([{
                        action: "ytDub",
                        name: t("SettingsYoutubeDub"),
                        padding: "no-margin"
                    }])
                    + explanation(t('SettingsYoutubeDubDescription'))
                })
                + settingsCategory({
                    name: "full audio",
                    title: "full audio",
                    body: checkbox([{
                        action: "fullTikTokAudio",
                        name: t("SettingsAudioFullTikTok"),
                        padding: "no-margin"
                    }])
                    + explanation(t('SettingsAudioFullTikTokDescription'))
                })
            }, {
                name: "other",
                title: `${emoji("🪅")} ${t('SettingsOtherTab')}`,
                content: settingsCategory({
                    name: "appearance",
                    title: t('SettingsAppearanceSubtitle'),
                    body: switcher({
                        name: "theme",
                        items: [{
                            action: "auto",
                            text: t('SettingsThemeAuto')
                        }, {
                            action: "dark",
                            text: t('SettingsThemeDark')
                        }, {
                            action: "light",
                            text: t('SettingsThemeLight')
                        }]
                    })
                })
                + settingsCategory({
                    name: "filename",
                    title: t('FilenameTitle'),
                    body: switcher({
                        name: "filenamePattern",
                        items: [{
                            action: "classic",
                            text: t('FilenamePatternClassic')
                        }, {
                            action: "basic",
                            text: t('FilenamePatternBasic')
                        }, {
                            action: "pretty",
                            text: t('FilenamePatternPretty')
                        }, {
                            action: "nerdy",
                            text: t('FilenamePatternNerdy')
                        }]
                    })
                    + `<div id="filename-preview">
                        <div id="video-filename" class="filename-item line">
                            ${emoji('🎞️', 32, 1, 1)}
                            <div class="filename-container">
                                <div class="filename-label">${t('Preview')}</div>
                                <div id="video-filename-text"></div>
                            </div>
                        </div>
                        <div id="audio-filename" class="filename-item">
                            ${emoji('🎧', 32, 1, 1)}
                            <div class="filename-container">
                                <div class="filename-label">${t('Preview')}</div>
                                <div id="audio-filename-text"></div>
                            </div>
                        </div>
                    </div>`
                    + explanation(t('FilenameDescription'))
                })
                + settingsCategory({
                    name: "accessibility",
                    title: t('Accessibility'),
                    body: checkbox([{
                        action: "alwaysVisibleButton",
                        name: t("SettingsKeepDownloadButton"),
                        aria: t("AccessibilityKeepDownloadButton")
                    }, {
                        action: "reduceTransparency",
                        name: t("SettingsReduceTransparency")
                    }, {
                        action: "disableAnimations",
                        name: t("SettingsDisableAnimations"),
                        padding: "no-margin"
                    }])
                })
                + (() => {
                    if (env.plausibleHostname) {
                        return settingsCategory({
                            name: "privacy",
                            title: t('PrivateAnalytics'),
                            body: checkbox([{
                                action: "plausible_ignore",
                                name: t("SettingsDisableAnalytics"),
                                padding: "no-margin"
                            }])
                            + explanation(t('SettingsAnalyticsExplanation'))
                        })
                    }
                    return ''
                })()
                + settingsCategory({
                    name: "miscellaneous",
                    title: t('Miscellaneous'),
                    body: checkbox([{
                        action: "downloadPopup",
                        name: t("SettingsEnableDownloadPopup"),
                        aria: t("AccessibilityEnableDownloadPopup")
                    }, {
                        action: "disableMetadata",
                        name: t("SettingsDisableMetadata")
                    }])
                })
            }]
        })}
        ${popupWithBottomButtons({
            name: "picker",
            closeAria: t('AccessibilityGoBack'),
            header: {
                title: `<div id="picker-title"></div>`,
                explanation: `<div id="picker-subtitle"></div>`,
            },
            buttons: [`<a id="picker-download" class="switch" target="_blank" href="/">${t('ImagePickerDownloadAudio')}</a>`],
            content: '<div id="picker-holder"></div>'
        })}
        <div id="popup-download-container" class="popup-from-bottom">
            ${popup({
                name: "download",
                standalone: true,
                buttonOnly: true,
                classes: ["small"],
                header: {
                    closeAria: t('AccessibilityGoBack'),
                    title: t('TitlePopupDownload')
                },
                body: switcher({
                    name: "download",
                    explanation: t('DownloadPopupDescription'),
                    items: `<a id="pd-download" class="switch full" target="_blank" href="/"><span>${t('Download')}</span></a>
                    <div id="pd-share" class="switch full">${t('ShareURL')}</div>
                    <div id="pd-copy" class="switch full">${t('CopyURL')}</div>`
                }),
                buttonText: t('PopupCloseDone')
            })}
        </div>
        <div id="popup-error-container" class="popup-from-bottom">
            ${popup({
                name: "error",
                standalone: true,
                buttonOnly: true,
                classes: ["small"],
                header: {
                },
                body: `<div id="desc-error" class="desc-padding subtext desc-error"></div>`,
                buttonText: t('ErrorPopupCloseButton')
            })}
        </div>
        <div id="popup-backdrop" onclick="hideAllPopups()"></div>
        <br></br><br></br>
        <div id="home" style="visibility:hidden">
            ${urgentNotice({
                text: t("WelcomeMessage"),
                visible: true
            })}

            <div id="cobalt-main-box" class="center">
                <div id="insta-icon">${instaSVG}</div>
                <br></br><br></br><br></br>
                <div id="logo">${t("AppTitleInsta")}${betaTag()}</div>
                <br></br><br></br><br></br>
                <div id="download-area">
                    <div id="top">
                        <div id="link-icon">${linkSVG}</div>
                        <input id="url-input-area" class="mono" type="text" autocomplete="off" data-form-type="other" spellcheck="false" maxlength="256" autocapitalize="off" placeholder="${t('LinkInput')}" aria-label="${t('AccessibilityInputArea')}" oninput="button()">
                        <button id="url-clear" onclick="clearInput()" style="display:none;">x</button>
                        <input id="download-button" class="mono dontRead" onclick="download(document.getElementById('url-input-area').value)" type="submit" value="" disabled aria-label="${t('AccessibilityDownloadButton')}">
                    </div>
                    
                    <div id="bottom">
                    <button id="paste" class="switch" onclick="pasteClipboard()" aria-label="${t('PasteFromClipboard')}">${t('PasteFromClipboard')}</button>
                    ${switcher({
                        name: "audioMode",
                        noParent: true,
                        items: [{
                            action: "false",
                            text: `${t("ModeToggleAuto")}`
                        }, {
                            action: "true",
                            text: `${t("ModeToggleAudio")}`
                        }]
                    })}
                    ${footerButtons([{
                        name: "settings",
                        type: "popup",
                        text: `${t('TitlePopupSettings')}`,
                        aria: t('AccessibilityOpenSettings')
                    }])}
                </div>
            </div>
        </div>
        <script>
            let defaultApiUrl = '${env.apiURL}';
            const loc = ${webLoc(t,
            [
                'ErrorNoInternet',
                'ErrorNoUrlReturned',
                'ErrorUnknownStatus',
                'ChangelogPressToHide',
                'MediaPickerTitle',
                'MediaPickerExplanationPhone',
                'MediaPickerExplanationPC',
                'FeatureErrorGeneric',
                'ClipboardErrorNoPermission',
                'ClipboardErrorFirefox',
                'DataTransferSuccess',
                'DataTransferError',
                'FilenamePreviewVideoTitle',
                'FilenamePreviewAudioTitle',
                'FilenamePreviewAudioAuthor',
                'DownloadPopupDescriptionIOS'
            ])}
        </script>
        <script src="cobalt.js"></script>
    </body>
</html>
`
    } catch (err) {
        return `${t('ErrorPageRenderFail', obj.hash)}`;
    }
}
