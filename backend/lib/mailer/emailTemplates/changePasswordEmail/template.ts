export const changePasswordEmailTemplate = (
    url: string,
    to: string,
    _locale?: string,
): string => {
    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
    dir="ltr"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    lang="en"
>
    <head>
        <meta charset="UTF-8" />
        <meta
            content="width=device-width, initial-scale=1"
            name="viewport"
        />
        <meta name="x-apple-disable-message-reformatting" />
        <meta
            http-equiv="X-UA-Compatible"
            content="IE=edge"
        />
        <meta
            content="telephone=no"
            name="format-detection"
        />
        <title>passwordChanged</title>
        <!--[if (mso 16)]>
            <style type="text/css">
                a {
                    text-decoration: none;
                }
            </style>
        <![endif]-->
        <!--[if gte mso 9
            ]><style>
                sup {
                    font-size: 100% !important;
                }
            </style><!
        [endif]-->
        <!--[if gte mso 9]>
            <xml>
                <o:OfficeDocumentSettings>
                    <o:AllowPNG></o:AllowPNG>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
        <![endif]-->
        <!--[if !mso]><!-- -->
        <link
            href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap"
            rel="stylesheet"
        />
        <!--<![endif]-->
        <style type="text/css">
            .rollover:hover .rollover-first {
                max-height: 0px !important;
                display: none !important;
            }
            .rollover:hover .rollover-second {
                max-height: none !important;
                display: block !important;
            }
            .rollover span {
                font-size: 0px;
            }
            u + .body img ~ div div {
                display: none;
            }
            #outlook a {
                padding: 0;
            }
            span.MsoHyperlink,
            span.MsoHyperlinkFollowed {
                color: inherit;
                mso-style-priority: 99;
            }
            a.es-button {
                mso-style-priority: 100 !important;
                text-decoration: none !important;
            }
            a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: none !important;
                font-size: inherit !important;
                font-family: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
            }
            .es-desk-hidden {
                display: none;
                float: left;
                overflow: hidden;
                width: 0;
                max-height: 0;
                line-height: 0;
                mso-hide: all;
            }
            .es-button-border:hover > a.es-button {
                color: #666666 !important;
            }
            @media only screen and (max-width: 600px) {
                .es-m-p0r {
                    padding-right: 0px !important;
                }
                .es-m-p0r {
                    padding-right: 0px !important;
                }
                .es-m-p20b {
                    padding-bottom: 20px !important;
                }
                .es-m-p0r {
                    padding-right: 0px !important;
                }
                .es-m-p20b {
                    padding-bottom: 20px !important;
                }
                .es-m-p0r {
                    padding-right: 0px !important;
                }
                .es-m-p0r {
                    padding-right: 0px !important;
                }
                *[class='gmail-fix'] {
                    display: none !important;
                }
                p,
                a {
                    line-height: 150% !important;
                }
                h1,
                h1 a {
                    line-height: 120% !important;
                }
                h2,
                h2 a {
                    line-height: 120% !important;
                }
                h3,
                h3 a {
                    line-height: 120% !important;
                }
                h4,
                h4 a {
                    line-height: 120% !important;
                }
                h5,
                h5 a {
                    line-height: 120% !important;
                }
                h6,
                h6 a {
                    line-height: 120% !important;
                }
                h1 {
                    font-size: 42px !important;
                    text-align: center;
                    line-height: 120%;
                }
                h2 {
                    font-size: 26px !important;
                    text-align: center;
                    line-height: 120%;
                }
                h3 {
                    font-size: 20px !important;
                    text-align: center;
                    line-height: 120%;
                }
                h4 {
                    font-size: 24px !important;
                    text-align: left;
                }
                h5 {
                    font-size: 20px !important;
                    text-align: left;
                }
                h6 {
                    font-size: 16px !important;
                    text-align: left;
                }
                .es-header-body h1 a,
                .es-content-body h1 a,
                .es-footer-body h1 a {
                    font-size: 42px !important;
                }
                .es-header-body h2 a,
                .es-content-body h2 a,
                .es-footer-body h2 a {
                    font-size: 26px !important;
                }
                .es-header-body h3 a,
                .es-content-body h3 a,
                .es-footer-body h3 a {
                    font-size: 20px !important;
                }
                .es-header-body h4 a,
                .es-content-body h4 a,
                .es-footer-body h4 a {
                    font-size: 24px !important;
                }
                .es-header-body h5 a,
                .es-content-body h5 a,
                .es-footer-body h5 a {
                    font-size: 20px !important;
                }
                .es-header-body h6 a,
                .es-content-body h6 a,
                .es-footer-body h6 a {
                    font-size: 16px !important;
                }
                .es-menu td a {
                    font-size: 14px !important;
                }
                .es-header-body p,
                .es-header-body a {
                    font-size: 16px !important;
                }
                .es-content-body p,
                .es-content-body a {
                    font-size: 16px !important;
                }
                .es-footer-body p,
                .es-footer-body a {
                    font-size: 16px !important;
                }
                .es-infoblock p,
                .es-infoblock a {
                    font-size: 12px !important;
                }
                .es-m-txt-c,
                .es-m-txt-c h1,
                .es-m-txt-c h2,
                .es-m-txt-c h3,
                .es-m-txt-c h4,
                .es-m-txt-c h5,
                .es-m-txt-c h6 {
                    text-align: center !important;
                }
                .es-m-txt-r,
                .es-m-txt-r h1,
                .es-m-txt-r h2,
                .es-m-txt-r h3,
                .es-m-txt-r h4,
                .es-m-txt-r h5,
                .es-m-txt-r h6 {
                    text-align: right !important;
                }
                .es-m-txt-j,
                .es-m-txt-j h1,
                .es-m-txt-j h2,
                .es-m-txt-j h3,
                .es-m-txt-j h4,
                .es-m-txt-j h5,
                .es-m-txt-j h6 {
                    text-align: justify !important;
                }
                .es-m-txt-l,
                .es-m-txt-l h1,
                .es-m-txt-l h2,
                .es-m-txt-l h3,
                .es-m-txt-l h4,
                .es-m-txt-l h5,
                .es-m-txt-l h6 {
                    text-align: left !important;
                }
                .es-m-txt-r img,
                .es-m-txt-c img,
                .es-m-txt-l img {
                    display: inline !important;
                }
                .es-m-txt-r .rollover:hover .rollover-second,
                .es-m-txt-c .rollover:hover .rollover-second,
                .es-m-txt-l .rollover:hover .rollover-second {
                    display: inline !important;
                }
                .es-m-txt-r .rollover span,
                .es-m-txt-c .rollover span,
                .es-m-txt-l .rollover span {
                    line-height: 0 !important;
                    font-size: 0 !important;
                }
                .es-spacer {
                    display: inline-table;
                }
                a.es-button,
                button.es-button {
                    font-size: 16px !important;
                    line-height: 120% !important;
                }
                a.es-button,
                button.es-button,
                .es-button-border {
                    display: block !important;
                }
                .es-m-fw,
                .es-m-fw.es-fw,
                .es-m-fw .es-button {
                    display: block !important;
                }
                .es-m-il,
                .es-m-il .es-button,
                .es-social,
                .es-social td,
                .es-menu {
                    display: inline-block !important;
                }
                .es-adaptive table,
                .es-left,
                .es-right {
                    width: 100% !important;
                }
                .es-content table,
                .es-header table,
                .es-footer table,
                .es-content,
                .es-footer,
                .es-header {
                    width: 100% !important;
                    max-width: 600px !important;
                }
                .adapt-img {
                    width: 100% !important;
                    height: auto !important;
                }
                .es-mobile-hidden,
                .es-hidden {
                    display: none !important;
                }
                .es-desk-hidden {
                    width: auto !important;
                    overflow: visible !important;
                    float: none !important;
                    max-height: inherit !important;
                    line-height: inherit !important;
                }
                tr.es-desk-hidden {
                    display: table-row !important;
                }
                table.es-desk-hidden {
                    display: table !important;
                }
                td.es-desk-menu-hidden {
                    display: table-cell !important;
                }
                .es-menu td {
                    width: 1% !important;
                }
                table.es-table-not-adapt,
                .esd-block-html table {
                    width: auto !important;
                }
                .es-social td {
                    padding-bottom: 10px;
                }
                .h-auto {
                    height: auto !important;
                }
                .img-4823 {
                    height: 82px !important;
                }
                .img-9378 {
                    width: 133px !important;
                }
                a.es-button,
                button.es-button {
                    border-bottom-width: 15px !important;
                    border-top-width: 15px !important;
                }
            }
            @media screen and (max-width: 384px) {
                .mail-message-content {
                    width: 414px !important;
                }
            }
        </style>
    </head>
    <body
        class="body"
        style="width: 100%; height: 100%; padding: 0; margin: 0"
    >
        <div
            dir="ltr"
            class="es-wrapper-color"
            lang="en"
            style="background-color: #ffffff"
        >
            <!--[if gte mso 9]>
                <v:background
                    xmlns:v="urn:schemas-microsoft-com:vml"
                    fill="t"
                >
                    <v:fill
                        type="tile"
                        color="#ffffff"
                    ></v:fill>
                </v:background>
            <![endif]-->
            <table
                class="es-wrapper"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                role="none"
                style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    padding: 0;
                    margin: 0;
                    width: 100%;
                    height: 100%;
                    background-repeat: repeat;
                    background-position: center top;
                    background-color: #ffffff;
                "
            >
                <tr>
                    <td
                        valign="top"
                        style="padding: 0; margin: 0"
                    >
                        <table
                            cellpadding="0"
                            cellspacing="0"
                            class="es-header"
                            align="center"
                            role="none"
                            style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                                width: 100%;
                                table-layout: fixed !important;
                                background-color: transparent;
                                background-repeat: repeat;
                                background-position: center top;
                            "
                        >
                            <tr>
                                <td
                                    align="center"
                                    style="padding: 0; margin: 0"
                                >
                                    <table
                                        bgcolor="#ffffff"
                                        class="es-header-body"
                                        align="center"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="none"
                                        style="
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            border-collapse: collapse;
                                            border-spacing: 0px;
                                            background-color: #ffffff;
                                            width: 700px;
                                        "
                                    >
                                        <tr>
                                            <td
                                                align="left"
                                                style="
                                                    margin: 0;
                                                    padding-top: 20px;
                                                    padding-right: 20px;
                                                    padding-bottom: 10px;
                                                    padding-left: 20px;
                                                "
                                            >
                                                <table
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    width="100%"
                                                    role="none"
                                                    style="
                                                        mso-table-lspace: 0pt;
                                                        mso-table-rspace: 0pt;
                                                        border-collapse: collapse;
                                                        border-spacing: 0px;
                                                    "
                                                >
                                                    <tr>
                                                        <td
                                                            class="es-m-p0r"
                                                            valign="top"
                                                            align="center"
                                                            style="
                                                                padding: 0;
                                                                margin: 0;
                                                                width: 660px;
                                                            "
                                                        >
                                                            <table
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                width="100%"
                                                                role="presentation"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                "
                                                            >
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                            font-size: 0px;
                                                                        "
                                                                    >
                                                                        <a
                                                                            target="_blank"
                                                                            href="https://MEALSTOGO.com"
                                                                            style="
                                                                                mso-line-height-rule: exactly;
                                                                                text-decoration: underline;
                                                                                color: #134f5c;
                                                                                font-size: 14px;
                                                                            "
                                                                            ><img
                                                                                class="img-4823"
                                                                                src="cid:logo"
                                                                                style="
                                                                                    display: block;
                                                                                    font-size: 16px;
                                                                                    border: 0;
                                                                                    outline: none;
                                                                                    text-decoration: none;
                                                                                "
                                                                                height="89"
                                                                                alt="MEALSTOGO"
                                                                                title="MEALSTOGO"
                                                                        /></a>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                            padding-bottom: 10px;
                                                                            padding-top: 10px;
                                                                            font-size: 0;
                                                                        "
                                                                    >
                                                                        <table
                                                                            border="0"
                                                                            width="100%"
                                                                            height="100%"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            role="presentation"
                                                                            style="
                                                                                mso-table-lspace: 0pt;
                                                                                mso-table-rspace: 0pt;
                                                                                border-collapse: collapse;
                                                                                border-spacing: 0px;
                                                                            "
                                                                        >
                                                                            <tr>
                                                                                <td
                                                                                    style="
                                                                                        padding: 0;
                                                                                        margin: 0;
                                                                                        border-bottom: 1px
                                                                                            solid
                                                                                            #cccccc;
                                                                                        background: none;
                                                                                        height: 1px;
                                                                                        width: 100%;
                                                                                        margin: 0px;
                                                                                    "
                                                                                ></td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                        "
                                                                    >
                                                                        <table
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            width="100%"
                                                                            class="es-menu"
                                                                            role="presentation"
                                                                            style="
                                                                                mso-table-lspace: 0pt;
                                                                                mso-table-rspace: 0pt;
                                                                                border-collapse: collapse;
                                                                                border-spacing: 0px;
                                                                            "
                                                                        >
                                                                            <tr
                                                                                class="links"
                                                                            >
                                                                                <td
                                                                                    align="center"
                                                                                    valign="top"
                                                                                    width="25%"
                                                                                    id="esd-menu-id-0"
                                                                                    style="
                                                                                        margin: 0;
                                                                                        border: 0;
                                                                                        padding-bottom: 10px;
                                                                                        padding-top: 10px;
                                                                                        padding-right: 5px;
                                                                                        padding-left: 5px;
                                                                                    "
                                                                                >
                                                                                    <a
                                                                                        target="_blank"
                                                                                        href="http://localhost:3000"
                                                                                        style="
                                                                                            mso-line-height-rule: exactly;
                                                                                            text-decoration: none;
                                                                                            font-family: Montserrat,
                                                                                                sans-serif;
                                                                                            display: block;
                                                                                            color: #333333;
                                                                                            font-size: 14px;
                                                                                        "
                                                                                        >RESTAURANT</a
                                                                                    >
                                                                                </td>
                                                                                <td
                                                                                    align="center"
                                                                                    valign="top"
                                                                                    width="25%"
                                                                                    id="esd-menu-id-1"
                                                                                    style="
                                                                                        margin: 0;
                                                                                        border: 0;
                                                                                        padding-bottom: 10px;
                                                                                        padding-top: 10px;
                                                                                        padding-right: 5px;
                                                                                        padding-left: 5px;
                                                                                    "
                                                                                >
                                                                                    <a
                                                                                        target="_blank"
                                                                                        href="http://localhost:3000"
                                                                                        style="
                                                                                            mso-line-height-rule: exactly;
                                                                                            text-decoration: none;
                                                                                            font-family: Montserrat,
                                                                                                sans-serif;
                                                                                            display: block;
                                                                                            color: #333333;
                                                                                            font-size: 14px;
                                                                                        "
                                                                                        >CATEGORIES</a
                                                                                    >
                                                                                </td>
                                                                                <td
                                                                                    align="center"
                                                                                    valign="top"
                                                                                    width="25%"
                                                                                    id="esd-menu-id-2"
                                                                                    style="
                                                                                        margin: 0;
                                                                                        border: 0;
                                                                                        padding-bottom: 10px;
                                                                                        padding-top: 10px;
                                                                                        padding-right: 5px;
                                                                                        padding-left: 5px;
                                                                                    "
                                                                                >
                                                                                    <a
                                                                                        target="_blank"
                                                                                        href="http://localhost:3000"
                                                                                        style="
                                                                                            mso-line-height-rule: exactly;
                                                                                            text-decoration: none;
                                                                                            font-family: Montserrat,
                                                                                                sans-serif;
                                                                                            display: block;
                                                                                            color: #333333;
                                                                                            font-size: 14px;
                                                                                        "
                                                                                        >NEW</a
                                                                                    >
                                                                                </td>
                                                                                <td
                                                                                    align="center"
                                                                                    valign="top"
                                                                                    width="25%"
                                                                                    id="esd-menu-id-2"
                                                                                    style="
                                                                                        margin: 0;
                                                                                        border: 0;
                                                                                        padding-bottom: 10px;
                                                                                        padding-top: 10px;
                                                                                        padding-right: 5px;
                                                                                        padding-left: 5px;
                                                                                    "
                                                                                >
                                                                                    <a
                                                                                        target="_blank"
                                                                                        href="http://localhost:3000"
                                                                                        style="
                                                                                            mso-line-height-rule: exactly;
                                                                                            text-decoration: none;
                                                                                            font-family: Montserrat,
                                                                                                sans-serif;
                                                                                            display: block;
                                                                                            color: #333333;
                                                                                            font-size: 14px;
                                                                                        "
                                                                                        >TOP SALE</a
                                                                                    >
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                            padding-bottom: 10px;
                                                                            padding-top: 10px;
                                                                            font-size: 0;
                                                                        "
                                                                    >
                                                                        <table
                                                                            border="0"
                                                                            width="100%"
                                                                            height="100%"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            role="presentation"
                                                                            style="
                                                                                mso-table-lspace: 0pt;
                                                                                mso-table-rspace: 0pt;
                                                                                border-collapse: collapse;
                                                                                border-spacing: 0px;
                                                                            "
                                                                        >
                                                                            <tr>
                                                                                <td
                                                                                    style="
                                                                                        padding: 0;
                                                                                        margin: 0;
                                                                                        border-bottom: 1px
                                                                                            solid
                                                                                            #cccccc;
                                                                                        background: none;
                                                                                        height: 1px;
                                                                                        width: 100%;
                                                                                        margin: 0px;
                                                                                    "
                                                                                ></td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <table
                            cellpadding="0"
                            cellspacing="0"
                            class="es-content"
                            align="center"
                            role="none"
                            style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                                width: 100%;
                                table-layout: fixed !important;
                            "
                        >
                            <tr>
                                <td
                                    align="center"
                                    style="padding: 0; margin: 0"
                                >
                                    <table
                                        bgcolor="#ffffff"
                                        class="es-content-body"
                                        align="center"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="none"
                                        style="
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            border-collapse: collapse;
                                            border-spacing: 0px;
                                            background-color: #ffffff;
                                            width: 700px;
                                        "
                                    >
                                        <tr>
                                            <td
                                                align="left"
                                                style="
                                                    margin: 0;
                                                    padding-right: 20px;
                                                    padding-left: 20px;
                                                    padding-top: 40px;
                                                    padding-bottom: 20px;
                                                "
                                            >
                                                <table
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    width="100%"
                                                    role="none"
                                                    style="
                                                        mso-table-lspace: 0pt;
                                                        mso-table-rspace: 0pt;
                                                        border-collapse: collapse;
                                                        border-spacing: 0px;
                                                    "
                                                >
                                                    <tr>
                                                        <td
                                                            align="center"
                                                            valign="top"
                                                            style="
                                                                padding: 0;
                                                                margin: 0;
                                                                width: 660px;
                                                            "
                                                        >
                                                            <table
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                width="100%"
                                                                role="presentation"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                "
                                                            >
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                            font-size: 0px;
                                                                        "
                                                                    >
                                                                        <img
                                                                            src="https://fcxlvjr.stripocdn.email/content/guids/CABINET_2663efe83689b9bda1312f85374f56d2/images/10381620386430630.png"
                                                                            alt=""
                                                                            style="
                                                                                display: block;
                                                                                font-size: 16px;
                                                                                border: 0;
                                                                                outline: none;
                                                                                text-decoration: none;
                                                                            "
                                                                            width="100"
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                        "
                                                                    >
                                                                        <h2
                                                                            style="
                                                                                margin: 0;
                                                                                font-family: Montserrat,
                                                                                    sans-serif;
                                                                                mso-line-height-rule: exactly;
                                                                                letter-spacing: 0;
                                                                                font-size: 36px;
                                                                                font-style: normal;
                                                                                font-weight: normal;
                                                                                line-height: 43px;
                                                                                color: #333333;
                                                                            "
                                                                        >
                                                                            Your password was changed
                                                                        </h2>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        class="es-m-txt-c"
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                            padding-bottom: 10px;
                                                                            padding-top: 10px;
                                                                            font-size: 0;
                                                                        "
                                                                    >
                                                                        <table
                                                                            border="0"
                                                                            width="40%"
                                                                            height="100%"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="
                                                                                mso-table-lspace: 0pt;
                                                                                mso-table-rspace: 0pt;
                                                                                border-collapse: collapse;
                                                                                border-spacing: 0px;
                                                                                width: 40% !important;
                                                                                display: inline-table;
                                                                            "
                                                                            role="presentation"
                                                                        >
                                                                            <tr>
                                                                                <td
                                                                                    style="
                                                                                        padding: 0;
                                                                                        margin: 0;
                                                                                        border-bottom: 1px
                                                                                            solid
                                                                                            #cccccc;
                                                                                        background: none;
                                                                                        height: 1px;
                                                                                        width: 100%;
                                                                                        margin: 0px;
                                                                                    "
                                                                                ></td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        class="es-m-p0r"
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                            padding-top: 5px;
                                                                            padding-right: 40px;
                                                                            padding-bottom: 5px;
                                                                        "
                                                                    >
                                                                        <p
                                                                            style="
                                                                                margin: 0;
                                                                                mso-line-height-rule: exactly;
                                                                                font-family: Montserrat,
                                                                                    sans-serif;
                                                                                line-height: 24px;
                                                                                letter-spacing: 0;
                                                                                color: #333333;
                                                                                font-size: 16px;
                                                                            "
                                                                        >
                                                                            Thank
                                                                            you
                                                                            for
                                                                            choosing
                                                                            MEALSTOGO
                                                                        </p>
                                                                        <p
                                                                            style="
                                                                                margin: 0;
                                                                                mso-line-height-rule: exactly;
                                                                                font-family: Montserrat,
                                                                                    sans-serif;
                                                                                line-height: 24px;
                                                                                letter-spacing: 0;
                                                                                color: #333333;
                                                                                font-size: 16px;
                                                                            "
                                                                        >
                                                                            <br />
                                                                        </p>
                                                                        <p
                                                                            style="
                                                                                margin: 0;
                                                                                mso-line-height-rule: exactly;
                                                                                font-family: Montserrat,
                                                                                    sans-serif;
                                                                                line-height: 24px;
                                                                                letter-spacing: 0;
                                                                                color: #333333;
                                                                                font-size: 16px;
                                                                            "
                                                                        >
                                                                            You have received this email because your password was changed for
                                                                           
                                                                            <strong
                                                                                >${to}</strong
                                                                            > account on MEALSTOGO.
                                                                            If this was you, no further action is needed. If you did not make this change, please contact our support 
                                                                            or
                                                                            by
                                                                            clicking
                                                                            on
                                                                            the
                                                                            button
                                                                            below
                                                                            <a
                                                                                target="_blank"
                                                                                href=${url}
                                                                                style="
                                                                                    mso-line-height-rule: exactly;
                                                                                    text-decoration: none;
                                                                                    color: #134f5c;
                                                                                    font-size: 16px;
                                                                                    word-break: break-all;
                                                                                "
                                                                                >${url}</a
                                                                            >
                                                                            within
                                                                            <strong
                                                                                >6
                                                                                hours</strong
                                                                            >.
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        class="es-m-txt-c"
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                            padding-bottom: 10px;
                                                                            padding-top: 10px;
                                                                            font-size: 0;
                                                                        "
                                                                    >
                                                                        <table
                                                                            border="0"
                                                                            width="40%"
                                                                            height="100%"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="
                                                                                mso-table-lspace: 0pt;
                                                                                mso-table-rspace: 0pt;
                                                                                border-collapse: collapse;
                                                                                border-spacing: 0px;
                                                                                width: 40% !important;
                                                                                display: inline-table;
                                                                            "
                                                                            role="presentation"
                                                                        >
                                                                            <tr>
                                                                                <td
                                                                                    style="
                                                                                        padding: 0;
                                                                                        margin: 0;
                                                                                        border-bottom: 1px
                                                                                            solid
                                                                                            #cccccc;
                                                                                        background: none;
                                                                                        height: 1px;
                                                                                        width: 100%;
                                                                                        margin: 0px;
                                                                                    "
                                                                                ></td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        class="es-m-txt-l"
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                            padding-bottom: 10px;
                                                                            padding-top: 10px;
                                                                        "
                                                                    >
                                                                        <span
                                                                            class="es-button-border"
                                                                            style="
                                                                                border-style: solid;
                                                                                border-color: #999999;
                                                                                background: #ffffff;
                                                                                border-width: 1px;
                                                                                display: inline-block;
                                                                                border-radius: 0px;
                                                                                width: auto;
                                                                            "
                                                                            ><a
                                                                                href=${url}
                                                                                class="es-button"
                                                                                target="_blank"
                                                                                style="
                                                                                    mso-style-priority: 100 !important;
                                                                                    text-decoration: none !important;
                                                                                    mso-line-height-rule: exactly;
                                                                                    color: #666666;
                                                                                    font-size: 16px;
                                                                                    padding: 10px
                                                                                        30px
                                                                                        10px
                                                                                        30px;
                                                                                    display: inline-block;
                                                                                    background: #ffffff;
                                                                                    border-radius: 0px;
                                                                                    font-family: Montserrat,
                                                                                        sans-serif;
                                                                                    font-weight: normal;
                                                                                    font-style: normal;
                                                                                    line-height: 19px;
                                                                                    width: auto;
                                                                                    text-align: center;
                                                                                    letter-spacing: 0;
                                                                                    mso-padding-alt: 0;
                                                                                    mso-border-alt: 10px
                                                                                        solid
                                                                                        #fef3e6;
                                                                                    border-color: #ffffff;
                                                                                "
                                                                                >Visit our website</a
                                                                            ></span
                                                                        >
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <table
                            cellpadding="0"
                            cellspacing="0"
                            class="es-content"
                            align="center"
                            role="none"
                            style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                                width: 100%;
                                table-layout: fixed !important;
                            "
                        >
                            <tr>
                                <td
                                    align="center"
                                    style="padding: 0; margin: 0"
                                >
                                    <table
                                        bgcolor="#ffffff"
                                        class="es-content-body"
                                        align="center"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="none"
                                        style="
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            border-collapse: collapse;
                                            border-spacing: 0px;
                                            background-color: #ffffff;
                                            width: 700px;
                                        "
                                    >
                                        <tr>
                                            <td
                                                align="left"
                                                style="
                                                    padding: 0;
                                                    margin: 0;
                                                    padding-right: 20px;
                                                    padding-left: 20px;
                                                    padding-top: 40px;
                                                "
                                            >
                                                <table
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    width="100%"
                                                    role="none"
                                                    style="
                                                        mso-table-lspace: 0pt;
                                                        mso-table-rspace: 0pt;
                                                        border-collapse: collapse;
                                                        border-spacing: 0px;
                                                    "
                                                >
                                                    <tr>
                                                        <td
                                                            align="center"
                                                            valign="top"
                                                            style="
                                                                padding: 0;
                                                                margin: 0;
                                                                width: 660px;
                                                            "
                                                        >
                                                            <table
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                width="100%"
                                                                role="presentation"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                "
                                                            >
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                        "
                                                                    >
                                                                        <h2
                                                                            style="
                                                                                margin: 0;
                                                                                font-family: Montserrat,
                                                                                    sans-serif;
                                                                                mso-line-height-rule: exactly;
                                                                                letter-spacing: 0;
                                                                                font-size: 36px;
                                                                                font-style: normal;
                                                                                font-weight: normal;
                                                                                line-height: 43px;
                                                                                color: #333333;
                                                                            "
                                                                        >
                                                                            Need
                                                                            help?
                                                                        </h2>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        class="es-m-txt-c"
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                            padding-bottom: 10px;
                                                                            padding-top: 10px;
                                                                            font-size: 0;
                                                                        "
                                                                    >
                                                                        <table
                                                                            border="0"
                                                                            width="40%"
                                                                            height="100%"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            style="
                                                                                mso-table-lspace: 0pt;
                                                                                mso-table-rspace: 0pt;
                                                                                border-collapse: collapse;
                                                                                border-spacing: 0px;
                                                                                width: 40% !important;
                                                                                display: inline-table;
                                                                            "
                                                                            role="presentation"
                                                                        >
                                                                            <tr>
                                                                                <td
                                                                                    style="
                                                                                        padding: 0;
                                                                                        margin: 0;
                                                                                        border-bottom: 1px
                                                                                            solid
                                                                                            #cccccc;
                                                                                        background: none;
                                                                                        height: 1px;
                                                                                        width: 100%;
                                                                                        margin: 0px;
                                                                                    "
                                                                                ></td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                align="left"
                                                style="
                                                    padding: 0;
                                                    margin: 0;
                                                    padding-right: 20px;
                                                    padding-left: 20px;
                                                    padding-bottom: 20px;
                                                "
                                            >
                                                <!--[if mso]><table style="width:660px" cellpadding="0" cellspacing="0"><tr><td style="width:310px" valign="top"><![endif]-->
                                                <table
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    class="es-left"
                                                    align="left"
                                                    role="none"
                                                    style="
                                                        mso-table-lspace: 0pt;
                                                        mso-table-rspace: 0pt;
                                                        border-collapse: collapse;
                                                        border-spacing: 0px;
                                                        float: left;
                                                    "
                                                >
                                                    <tr>
                                                        <td
                                                            class="es-m-p20b"
                                                            align="left"
                                                            style="
                                                                padding: 0;
                                                                margin: 0;
                                                                width: 310px;
                                                            "
                                                        >
                                                            <table
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                width="100%"
                                                                role="presentation"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                "
                                                            >
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        class="es-m-txt-l"
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                            padding-top: 10px;
                                                                            padding-bottom: 5px;
                                                                        "
                                                                    >
                                                                        <h3
                                                                            style="
                                                                                margin: 0;
                                                                                font-family: Montserrat,
                                                                                    sans-serif;
                                                                                mso-line-height-rule: exactly;
                                                                                letter-spacing: 0;
                                                                                font-size: 20px;
                                                                                font-style: normal;
                                                                                font-weight: normal;
                                                                                line-height: 24px;
                                                                                color: #333333;
                                                                            "
                                                                        >
                                                                            Ask
                                                                            at
                                                                        </h3>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        align="left"
                                                                        class="es-m-txt-l"
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                            padding-bottom: 10px;
                                                                            padding-top: 10px;
                                                                        "
                                                                    >
                                                                        <span
                                                                            class="es-button-border"
                                                                            style="
                                                                                border-style: solid;
                                                                                border-color: #999999;
                                                                                background: #ffffff;
                                                                                border-width: 1px;
                                                                                display: block;
                                                                                border-radius: 0px;
                                                                                width: auto;
                                                                            "
                                                                            ><a
                                                                                href="mailto:codegeyser@gmail.com"
                                                                                class="es-button"
                                                                                target="_blank"
                                                                                style="
                                                                                    mso-style-priority: 100 !important;
                                                                                    text-decoration: none !important;
                                                                                    mso-line-height-rule: exactly;
                                                                                    color: #666666;
                                                                                    font-size: 16px;
                                                                                    padding: 10px
                                                                                        30px
                                                                                        10px
                                                                                        30px;
                                                                                    display: block;
                                                                                    background: #ffffff;
                                                                                    border-radius: 0px;
                                                                                    font-family: Montserrat,
                                                                                        sans-serif;
                                                                                    font-weight: normal;
                                                                                    font-style: normal;
                                                                                    line-height: 19px;
                                                                                    width: auto;
                                                                                    text-align: center;
                                                                                    letter-spacing: 0;
                                                                                    mso-padding-alt: 0;
                                                                                    mso-border-alt: 10px
                                                                                        solid
                                                                                        #fef3e6;
                                                                                    border-color: #ffffff;
                                                                                    border-left-width: 30px;
                                                                                    border-right-width: 30px;
                                                                                "
                                                                                >help@mealstogo.com</a
                                                                            ></span
                                                                        >
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]></td><td style="width:40px"></td><td style="width:310px" valign="top"><![endif]-->
                                                <table
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    class="es-right"
                                                    align="right"
                                                    role="none"
                                                    style="
                                                        mso-table-lspace: 0pt;
                                                        mso-table-rspace: 0pt;
                                                        border-collapse: collapse;
                                                        border-spacing: 0px;
                                                        float: right;
                                                    "
                                                >
                                                    <tr>
                                                        <td
                                                            align="left"
                                                            style="
                                                                padding: 0;
                                                                margin: 0;
                                                                width: 310px;
                                                            "
                                                        >
                                                            <table
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                width="100%"
                                                                role="presentation"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                "
                                                            >
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        class="es-m-txt-l"
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                            padding-top: 10px;
                                                                            padding-bottom: 5px;
                                                                        "
                                                                    >
                                                                        <h3
                                                                            style="
                                                                                margin: 0;
                                                                                font-family: Montserrat,
                                                                                    sans-serif;
                                                                                mso-line-height-rule: exactly;
                                                                                letter-spacing: 0;
                                                                                font-size: 20px;
                                                                                font-style: normal;
                                                                                font-weight: normal;
                                                                                line-height: 24px;
                                                                                color: #333333;
                                                                            "
                                                                        >
                                                                            Visit
                                                                            our
                                                                        </h3>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        align="left"
                                                                        class="es-m-txt-l"
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                            padding-bottom: 10px;
                                                                            padding-top: 10px;
                                                                        "
                                                                    >
                                                                        <span
                                                                            class="es-button-border"
                                                                            style="
                                                                                border-style: solid;
                                                                                border-color: #999999;
                                                                                background: #ffffff;
                                                                                border-width: 1px;
                                                                                display: block;
                                                                                border-radius: 0px;
                                                                                width: auto;
                                                                            "
                                                                            ><a
                                                                                href="http://localhost:3000"
                                                                                class="es-button es-button-1620385738243"
                                                                                target="_blank"
                                                                                style="
                                                                                    mso-style-priority: 100 !important;
                                                                                    text-decoration: none !important;
                                                                                    mso-line-height-rule: exactly;
                                                                                    color: #666666;
                                                                                    font-size: 16px;
                                                                                    padding: 10px
                                                                                        30px;
                                                                                    display: block;
                                                                                    background: #ffffff;
                                                                                    border-radius: 0px;
                                                                                    font-family: Montserrat,
                                                                                        sans-serif;
                                                                                    font-weight: normal;
                                                                                    font-style: normal;
                                                                                    line-height: 19px;
                                                                                    width: auto;
                                                                                    text-align: center;
                                                                                    letter-spacing: 0;
                                                                                    mso-padding-alt: 0;
                                                                                    mso-border-alt: 10px
                                                                                        solid
                                                                                        #fef3e6;
                                                                                    border-color: #ffffff;
                                                                                "
                                                                                >Help
                                                                                center</a
                                                                            ></span
                                                                        >
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <table
                            cellpadding="0"
                            cellspacing="0"
                            class="es-footer"
                            align="center"
                            role="none"
                            style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                                width: 100%;
                                table-layout: fixed !important;
                                background-color: transparent;
                                background-repeat: repeat;
                                background-position: center top;
                            "
                        >
                            <tr>
                                <td
                                    align="center"
                                    style="padding: 0; margin: 0"
                                >
                                    <table
                                        bgcolor="#ffffff"
                                        class="es-footer-body"
                                        align="center"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="none"
                                        style="
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            border-collapse: collapse;
                                            border-spacing: 0px;
                                            background-color: #ffffff;
                                            width: 700px;
                                        "
                                    >
                                        <tr>
                                            <td
                                                align="left"
                                                style="
                                                    padding: 0;
                                                    margin: 0;
                                                    padding-right: 20px;
                                                    padding-left: 20px;
                                                "
                                            >
                                                <table
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    width="100%"
                                                    role="none"
                                                    style="
                                                        mso-table-lspace: 0pt;
                                                        mso-table-rspace: 0pt;
                                                        border-collapse: collapse;
                                                        border-spacing: 0px;
                                                    "
                                                >
                                                    <tr>
                                                        <td
                                                            align="left"
                                                            style="
                                                                padding: 0;
                                                                margin: 0;
                                                                width: 660px;
                                                            "
                                                        >
                                                            <table
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                width="100%"
                                                                role="presentation"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                "
                                                            >
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                            padding-bottom: 10px;
                                                                            padding-top: 10px;
                                                                            font-size: 0;
                                                                        "
                                                                    >
                                                                        <table
                                                                            border="0"
                                                                            width="100%"
                                                                            height="100%"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            role="presentation"
                                                                            style="
                                                                                mso-table-lspace: 0pt;
                                                                                mso-table-rspace: 0pt;
                                                                                border-collapse: collapse;
                                                                                border-spacing: 0px;
                                                                            "
                                                                        >
                                                                            <tr>
                                                                                <td
                                                                                    style="
                                                                                        padding: 0;
                                                                                        margin: 0;
                                                                                        border-bottom: 1px
                                                                                            solid
                                                                                            #cccccc;
                                                                                        background: none;
                                                                                        height: 1px;
                                                                                        width: 100%;
                                                                                        margin: 0px;
                                                                                    "
                                                                                ></td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                align="left"
                                                style="
                                                    padding: 0;
                                                    margin: 0;
                                                    padding-right: 20px;
                                                    padding-left: 20px;
                                                "
                                            >
                                                <!--[if mso]><table style="width:660px" cellpadding="0" cellspacing="0"><tr><td style="width:320px" valign="top"><![endif]-->
                                                <table
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    class="es-left"
                                                    align="left"
                                                    role="none"
                                                    style="
                                                        mso-table-lspace: 0pt;
                                                        mso-table-rspace: 0pt;
                                                        border-collapse: collapse;
                                                        border-spacing: 0px;
                                                        float: left;
                                                    "
                                                >
                                                    <tr>
                                                        <td
                                                            class="es-m-p0r es-m-p20b"
                                                            align="center"
                                                            style="
                                                                padding: 0;
                                                                margin: 0;
                                                                width: 320px;
                                                            "
                                                        >
                                                            <table
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                width="100%"
                                                                role="presentation"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                "
                                                            >
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                            padding-top: 15px;
                                                                        "
                                                                    >
                                                                        <h3
                                                                            style="
                                                                                margin: 0;
                                                                                font-family: Montserrat,
                                                                                    sans-serif;
                                                                                mso-line-height-rule: exactly;
                                                                                letter-spacing: 0;
                                                                                font-size: 20px;
                                                                                font-style: normal;
                                                                                font-weight: normal;
                                                                                line-height: 24px;
                                                                                color: #333333;
                                                                            "
                                                                        >
                                                                            Like
                                                                            it!
                                                                            Love
                                                                            it!
                                                                            Share
                                                                            it!
                                                                        </h3>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]></td><td style="width:20px"></td><td style="width:320px" valign="top"><![endif]-->
                                                <table
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    class="es-right"
                                                    align="right"
                                                    role="none"
                                                    style="
                                                        mso-table-lspace: 0pt;
                                                        mso-table-rspace: 0pt;
                                                        border-collapse: collapse;
                                                        border-spacing: 0px;
                                                        float: right;
                                                    "
                                                >
                                                    <tr>
                                                        <td
                                                            align="center"
                                                            style="
                                                                padding: 0;
                                                                margin: 0;
                                                                width: 320px;
                                                            "
                                                        >
                                                            <table
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                width="100%"
                                                                role="presentation"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                "
                                                            >
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                            padding-bottom: 10px;
                                                                            padding-top: 10px;
                                                                            font-size: 0;
                                                                        "
                                                                    >
                                                                        <table
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            class="es-table-not-adapt es-social"
                                                                            role="presentation"
                                                                            style="
                                                                                mso-table-lspace: 0pt;
                                                                                mso-table-rspace: 0pt;
                                                                                border-collapse: collapse;
                                                                                border-spacing: 0px;
                                                                            "
                                                                        >
                                                                            <tr>
                                                                                <td
                                                                                    align="center"
                                                                                    valign="top"
                                                                                    class="es-m-p0r"
                                                                                    style="
                                                                                        padding: 0;
                                                                                        margin: 0;
                                                                                        padding-right: 30px;
                                                                                    "
                                                                                >
                                                                                    <a
                                                                                        target="_blank"
                                                                                        href="https://facebook.com"
                                                                                        style="
                                                                                            mso-line-height-rule: exactly;
                                                                                            text-decoration: underline;
                                                                                            color: #134f5c;
                                                                                            font-size: 12px;
                                                                                        "
                                                                                        ><img
                                                                                            title="Facebook"
                                                                                            src="https://fcxlvjr.stripocdn.email/content/assets/img/social-icons/square-black-bordered/facebook-square-black-bordered.png"
                                                                                            alt="Fb"
                                                                                            width="32"
                                                                                            style="
                                                                                                display: block;
                                                                                                font-size: 16px;
                                                                                                border: 0;
                                                                                                outline: none;
                                                                                                text-decoration: none;
                                                                                            "
                                                                                    /></a>
                                                                                </td>
                                                                                <td
                                                                                    align="center"
                                                                                    valign="top"
                                                                                    class="es-m-p0r"
                                                                                    style="
                                                                                        padding: 0;
                                                                                        margin: 0;
                                                                                        padding-right: 30px;
                                                                                    "
                                                                                >
                                                                                    <a
                                                                                        target="_blank"
                                                                                        href="https://instagram.com"
                                                                                        style="
                                                                                            mso-line-height-rule: exactly;
                                                                                            text-decoration: underline;
                                                                                            color: #134f5c;
                                                                                            font-size: 12px;
                                                                                        "
                                                                                        ><img
                                                                                            title="Instagram"
                                                                                            src="https://fcxlvjr.stripocdn.email/content/assets/img/social-icons/square-black-bordered/instagram-square-black-bordered.png"
                                                                                            alt="Inst"
                                                                                            width="32"
                                                                                            style="
                                                                                                display: block;
                                                                                                font-size: 16px;
                                                                                                border: 0;
                                                                                                outline: none;
                                                                                                text-decoration: none;
                                                                                            "
                                                                                    /></a>
                                                                                </td>
                                                                                <td
                                                                                    align="center"
                                                                                    valign="top"
                                                                                    style="
                                                                                        padding: 0;
                                                                                        margin: 0;
                                                                                    "
                                                                                >
                                                                                    <a
                                                                                        target="_blank"
                                                                                        href="https://youtube.com"
                                                                                        style="
                                                                                            mso-line-height-rule: exactly;
                                                                                            text-decoration: underline;
                                                                                            color: #134f5c;
                                                                                            font-size: 12px;
                                                                                        "
                                                                                        ><img
                                                                                            title="Youtube"
                                                                                            src="https://fcxlvjr.stripocdn.email/content/assets/img/social-icons/square-black-bordered/youtube-square-black-bordered.png"
                                                                                            alt="Yt"
                                                                                            width="32"
                                                                                            style="
                                                                                                display: block;
                                                                                                font-size: 16px;
                                                                                                border: 0;
                                                                                                outline: none;
                                                                                                text-decoration: none;
                                                                                            "
                                                                                    /></a>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                align="left"
                                                style="
                                                    padding: 0;
                                                    margin: 0;
                                                    padding-right: 20px;
                                                    padding-left: 20px;
                                                "
                                            >
                                                <table
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    width="100%"
                                                    role="none"
                                                    style="
                                                        mso-table-lspace: 0pt;
                                                        mso-table-rspace: 0pt;
                                                        border-collapse: collapse;
                                                        border-spacing: 0px;
                                                    "
                                                >
                                                    <tr>
                                                        <td
                                                            align="left"
                                                            style="
                                                                padding: 0;
                                                                margin: 0;
                                                                width: 660px;
                                                            "
                                                        >
                                                            <table
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                width="100%"
                                                                role="presentation"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                "
                                                            >
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                            padding-bottom: 10px;
                                                                            padding-top: 10px;
                                                                            font-size: 0;
                                                                        "
                                                                    >
                                                                        <table
                                                                            border="0"
                                                                            width="100%"
                                                                            height="100%"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            role="presentation"
                                                                            style="
                                                                                mso-table-lspace: 0pt;
                                                                                mso-table-rspace: 0pt;
                                                                                border-collapse: collapse;
                                                                                border-spacing: 0px;
                                                                            "
                                                                        >
                                                                            <tr>
                                                                                <td
                                                                                    style="
                                                                                        padding: 0;
                                                                                        margin: 0;
                                                                                        border-bottom: 1px
                                                                                            solid
                                                                                            #cccccc;
                                                                                        background: none;
                                                                                        height: 1px;
                                                                                        width: 100%;
                                                                                        margin: 0px;
                                                                                    "
                                                                                ></td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                align="left"
                                                style="padding: 20px; margin: 0"
                                            >
                                                <table
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    width="100%"
                                                    role="none"
                                                    style="
                                                        mso-table-lspace: 0pt;
                                                        mso-table-rspace: 0pt;
                                                        border-collapse: collapse;
                                                        border-spacing: 0px;
                                                    "
                                                >
                                                    <tr>
                                                        <td
                                                            align="center"
                                                            valign="top"
                                                            style="
                                                                padding: 0;
                                                                margin: 0;
                                                                width: 660px;
                                                            "
                                                        >
                                                            <table
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                width="100%"
                                                                role="presentation"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                "
                                                            >
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                        "
                                                                    >
                                                                        <p
                                                                            style="
                                                                                margin: 0;
                                                                                mso-line-height-rule: exactly;
                                                                                font-family: Montserrat,
                                                                                    sans-serif;
                                                                                line-height: 18px;
                                                                                letter-spacing: 0;
                                                                                color: #333333;
                                                                                font-size: 12px;
                                                                            "
                                                                        >
                                                                            You
                                                                            are
                                                                            receiving
                                                                            this
                                                                            email
                                                                            because
                                                                            you
                                                                            have
                                                                            visited
                                                                            our
                                                                            site
                                                                            or
                                                                            asked
                                                                            us
                                                                            about
                                                                            the
                                                                            regular
                                                                            newsletter.
                                                                            Make
                                                                            sure
                                                                            our
                                                                            messages
                                                                            get
                                                                            to
                                                                            your
                                                                            Inbox
                                                                            (and
                                                                            not
                                                                            your
                                                                            bulk
                                                                            or
                                                                            junk
                                                                            folders).<br /><a
                                                                                target="_blank"
                                                                                style="
                                                                                    mso-line-height-rule: exactly;
                                                                                    text-decoration: underline;
                                                                                    color: #134f5c;
                                                                                    font-size: 12px;
                                                                                    line-height: 18px;
                                                                                "
                                                                                href="http://localhost:3000"
                                                                                >Privacy
                                                                                police</a
                                                                            >
                                                                            |
                                                                            <a
                                                                                target="_blank"
                                                                                style="
                                                                                    mso-line-height-rule: exactly;
                                                                                    text-decoration: underline;
                                                                                    color: #134f5c;
                                                                                    font-size: 12px;
                                                                                    line-height: 18px;
                                                                                "
                                                                                href=""
                                                                                >Unsubscribe</a
                                                                            >
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <table
                            cellpadding="0"
                            cellspacing="0"
                            class="es-content"
                            align="center"
                            role="none"
                            style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                                width: 100%;
                                table-layout: fixed !important;
                            "
                        >
                            <tr>
                                <td
                                    align="center"
                                    style="padding: 0; margin: 0"
                                >
                                    <table
                                        bgcolor="#ffffff"
                                        class="es-content-body"
                                        align="center"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="none"
                                        style="
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            border-collapse: collapse;
                                            border-spacing: 0px;
                                            background-color: #ffffff;
                                            width: 700px;
                                        "
                                    >
                                        <tr>
                                            <td
                                                align="left"
                                                style="padding: 20px; margin: 0"
                                            >
                                                <table
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    width="100%"
                                                    role="none"
                                                    style="
                                                        mso-table-lspace: 0pt;
                                                        mso-table-rspace: 0pt;
                                                        border-collapse: collapse;
                                                        border-spacing: 0px;
                                                    "
                                                >
                                                    <tr>
                                                        <td
                                                            align="center"
                                                            valign="top"
                                                            style="
                                                                padding: 0;
                                                                margin: 0;
                                                                width: 660px;
                                                            "
                                                        >
                                                            <table
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                width="100%"
                                                                role="presentation"
                                                                style="
                                                                    mso-table-lspace: 0pt;
                                                                    mso-table-rspace: 0pt;
                                                                    border-collapse: collapse;
                                                                    border-spacing: 0px;
                                                                "
                                                            >
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        style="
                                                                            padding: 0;
                                                                            margin: 0;
                                                                            font-size: 0;
                                                                        "
                                                                    >
                                                                        <img
                                                                            src="cid:logo"
                                                                            alt=""
                                                                            width="130"
                                                                            class="img-9378"
                                                                            style="
                                                                                display: block;
                                                                                font-size: 16px;
                                                                                border: 0;
                                                                                outline: none;
                                                                                text-decoration: none;
                                                                            "
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
    </body>
</html>
    `;
};
